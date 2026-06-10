import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, Calendar, School, Briefcase, Hash } from 'lucide-react';
import { API_BASE_URL } from '../config';

const VerifyCertificate = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/verify/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Invalid or Not Found Certificate');
      }
      setLoading(false);
    };
    verify();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Authenticating Certificate...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100">
            <div className="bg-rose-500 p-8 text-center">
                <XCircle className="h-20 w-20 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Verification Failed</h2>
            </div>
            <div className="p-10 text-center">
                <p className="text-gray-600 text-lg mb-8 font-medium">{error}</p>
                <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                    Back to Home
                </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-emerald-100">
            <div className="bg-emerald-500 p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Award size={200} />
                </div>
                <CheckCircle className="h-20 w-20 text-white mx-auto mb-4 relative z-10" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight relative z-10">Certificate Verified</h2>
                <p className="text-emerald-100 font-medium relative z-10 mt-2">This is an authentic TechForge digital certificate.</p>
            </div>
            
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Hash size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Certificate ID</p>
                            <p className="text-lg font-black text-gray-900 font-mono">{data.certificateId}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Award size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Name</p>
                            <p className="text-xl font-black text-gray-900 uppercase">{data.name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <School size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">College / Institution</p>
                            <p className="text-lg font-bold text-gray-700">{data.college}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internship Domain</p>
                            <p className="text-lg font-black text-blue-900 uppercase">{data.workshop}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue Date</p>
                            <p className="text-lg font-bold text-gray-700">{new Date(data.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">TF</div>
                    <div>
                        <p className="text-sm font-black text-gray-900">TechForge Solutions</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Official Verification Portal</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => window.print()} className="px-6 py-2 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm">
                        Print Record
                    </button>
                    <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-500/20">
                        Visit TechForge
                    </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;