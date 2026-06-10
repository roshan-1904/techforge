import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, XCircle, Search, Eye, X, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSearchParams } from 'react-router-dom';
import CertificateGenerator from './CertificateGenerator';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'registrations';
  
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('gold');
  const previewRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [regRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/registrations`, config),
        axios.get(`${API_BASE_URL}/api/admin/stats`, config)
      ]);
      setRegistrations(regRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleApprove = async (id) => {
    const loadingToast = toast.loading('Generating premium certificate and sending email...');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_BASE_URL}/api/admin/approve/${id}`, { theme: selectedTheme }, config);
      toast.success('Approved and Certificate Sent', { id: loadingToast });
      fetchData();
    } catch (error) {
      toast.error('Approval failed', { id: loadingToast });
    }
  };

  const handleReject = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_BASE_URL}/api/admin/reject/${id}`, {}, config);
      toast.success('Registration Rejected');
      fetchData();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  const downloadPDF = async (customData = null) => {
    const data = customData || { ...previewData, theme: selectedTheme };
    if (!data) return;

    const loadingToast = toast.loading('Generating premium PDF on server...');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_BASE_URL}/api/admin/preview-pdf`, data, config);
      
      const pdfUrl = `${API_BASE_URL}${response.data.pdfUrl}`;
      
      const fileResponse = await axios.get(pdfUrl, { 
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${data.name.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF Downloaded Successfully', { id: loadingToast });
    } catch (err) {
      toast.error('Server PDF Generation Failed', { id: loadingToast });
      console.error('Download Error:', err);
    }
  };

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.college.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 flex flex-col xs:flex-row gap-2 w-full max-w-md xs:w-auto">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 sm:px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'registrations' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            Manage Registrations
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 sm:px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'generator' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            Custom Generator
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <CertificateGenerator />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 max-w-7xl mx-auto">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-600 text-white' },
          { label: 'Approved', value: stats.approved, color: 'bg-emerald-600 text-white' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-500 text-white' },
          { label: 'Rejected', value: stats.rejected, color: 'bg-rose-600 text-white' }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={`${stat.color} p-4 md:p-6 rounded-2xl shadow-lg border border-white/20 relative overflow-hidden group`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <CheckCircle size={80} />
            </div>
            <h3 className="text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-80">{stat.label}</h3>
            <p className="text-2xl md:text-4xl font-black mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Workshop Registrations</h2>
            <p className="text-xs md:text-sm text-gray-500">Manage participants and generate premium certificates</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search by name, college..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Participant</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell">College</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Workshop</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 uppercase text-xs md:text-base">
                            {reg.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">{reg.name}</div>
                            <div className="text-[10px] md:text-xs text-gray-500">{reg.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-700 font-medium">{reg.college}</div>
                    <div className="text-xs text-gray-400">{reg.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-700">{reg.workshop}</div>
                    <div className="text-xs text-gray-400">{reg.startDate} to {reg.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 md:px-3 py-1 inline-flex text-[10px] md:text-xs leading-5 font-bold rounded-full 
                      ${reg.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                        reg.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                        'bg-amber-100 text-amber-700'}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center gap-1 md:gap-2">
                        {reg.status !== 'Rejected' && (
                          <button 
                              onClick={() => { setPreviewData(reg); setSelectedTheme('gold'); }}
                              className="bg-blue-50 text-blue-600 p-1.5 md:p-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                              title="Preview Certificate"
                          >
                              <Eye size={16} />
                              <span className="hidden xs:inline text-[10px] font-bold uppercase">View</span>
                          </button>
                        )}
                        
                        {reg.status === 'Approved' && (
                          <button 
                              onClick={() => downloadPDF(reg)}
                              className="bg-gray-50 text-gray-600 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                              title="Quick Download"
                          >
                              <FileDown size={16} />
                              <span className="hidden xs:inline text-[10px] font-bold uppercase">PDF</span>
                          </button>
                        )}

                        {reg.status === 'Pending' && (
                        <div className="flex gap-1 border-l pl-2 ml-1">
                            <button onClick={() => handleApprove(reg._id)} className="text-emerald-500 hover:text-emerald-700 transition-colors p-1" title="Approve">
                                <CheckCircle size={18} />
                            </button>
                            <button onClick={() => handleReject(reg._id)} className="text-rose-500 hover:text-rose-700 transition-colors p-1" title="Reject">
                                <XCircle size={18} />
                            </button>
                        </div>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Preview Modal */}
      <AnimatePresence>
        {previewData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gray-900 p-3 sm:p-6 rounded-2xl sm:rounded-[2.5rem] shadow-2xl relative max-w-[1200px] w-full border border-white/10 overflow-y-auto max-h-[95vh]"
            >
                <button 
                    onClick={() => setPreviewData(null)}
                    className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-0">
                    {/* Left: Certificate Preview */}
                    <div className="lg:w-3/4 bg-black/40 rounded-xl sm:rounded-3xl overflow-hidden border border-white/5 order-2 lg:order-1">
                        <CertificatePreview ref={previewRef} data={previewData} theme={selectedTheme} />
                    </div>

                    {/* Right: Theme Controls */}
                    <div className="lg:w-1/4 flex flex-col gap-4 sm:gap-6 p-2 order-1 lg:order-2">
                        <div>
                            <h3 className="text-white font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                Premium Themes
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                                {[
                                    { id: 'gold', name: 'Royal Gold', color: 'bg-[#c9b37d]' },
                                    { id: 'emerald', name: 'Emerald Green', color: 'bg-[#10b981]' },
                                    { id: 'sapphire', name: 'Sapphire Blue', color: 'bg-[#3b82f6]' },
                                    { id: 'ruby', name: 'Ruby Excellence', color: 'bg-[#ef4444]' },
                                    { id: 'midnight', name: 'Midnight Dark', color: 'bg-[#1e293b] border border-white/20' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTheme(t.id)}
                                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all border-2 ${selectedTheme === t.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${t.color} shadow-lg shrink-0`}></div>
                                        <span className={`font-bold text-[10px] sm:text-sm truncate ${selectedTheme === t.id ? 'text-blue-400' : 'text-gray-400'}`}>{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto space-y-2 sm:space-y-3">
                            <button 
                                onClick={() => downloadPDF()}
                                className="w-full bg-white text-black hover:bg-gray-200 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <FileDown size={18} />
                                Download PDF
                            </button>
                            {previewData.status === 'Pending' && (
                                <button 
                                    onClick={() => { handleApprove(previewData._id); setPreviewData(null); }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <CheckCircle size={18} />
                                    Approve & Issue
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
};

export default AdminDashboard;