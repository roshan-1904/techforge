import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, RefreshCw, FileText, ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import CertificatePreview from '../components/CertificatePreview';

const CertificateGenerator = () => {
  const [formData, setFormData] = useState({
    name: 'GOWTHAM M',
    college: 'KONGU ENGINEERING COLLEGE',
    workshop: 'FULL STACK WEB DEVELOPMENT',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    certificateId: `TFI-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  });

  const previewRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateNewId = () => {
    const newId = `TFI-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    setFormData({ ...formData, certificateId: newId });
    toast.success('New Certificate ID Generated');
  };

  const downloadPNG = async () => {
    const node = previewRef.current?.getCertificateNode();
    if (!node) return;

    const loadingToast = toast.loading('Generating high-quality PNG...');
    try {
      const canvas = await html2canvas(node, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Certificate-${formData.certificateId}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('PNG Downloaded Successfully', { id: loadingToast });
    } catch (err) {
      toast.error('PNG Generation Failed', { id: loadingToast });
      console.error(err);
    }
  };

  const downloadPDF = async () => {
    const node = previewRef.current?.getCertificateNode();
    if (!node) return;

    const loadingToast = toast.loading('Generating premium PDF...');
    try {
      // Wait for fonts/images
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1123, 794]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
      pdf.save(`Certificate-${formData.certificateId}.pdf`);
      toast.success('PDF Downloaded Successfully', { id: loadingToast });
    } catch (err) {
      toast.error('PDF Generation Failed', { id: loadingToast });
      console.error('Download Error:', err);
    }
  };

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-[1600px] mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Left: Form */}
        <div className="w-full lg:w-1/3 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Generator Controls
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Student Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm md:text-base"
                  placeholder="Enter Student Name"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">College Name</label>
                <input 
                  type="text" name="college" value={formData.college} onChange={handleChange}
                  className="w-full px-4 py-2 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm md:text-base"
                  placeholder="Enter College Name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Internship Domain</label>
                <input 
                  type="text" name="workshop" value={formData.workshop} onChange={handleChange}
                  className="w-full px-4 py-2 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm md:text-base"
                  placeholder="e.g. Full Stack Web Development"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</label>
                  <input 
                    type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                    className="w-full px-4 py-2 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">End Date</label>
                  <input 
                    type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                    className="w-full px-4 py-2 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Certificate ID</label>
                <div className="flex gap-2">
                  <input 
                    type="text" name="certificateId" value={formData.certificateId} onChange={handleChange}
                    className="flex-grow px-4 py-2 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs md:text-sm"
                  />
                  <button 
                    onClick={generateNewId}
                    className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                    title="Generate Random ID"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button 
                onClick={downloadPDF}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg text-sm"
              >
                <Download size={18} />
                PDF
              </button>
              <button 
                onClick={downloadPNG}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg text-sm"
              >
                <ImageIcon size={18} />
                PNG
              </button>
              <button 
                onClick={printCertificate}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
              >
                <Printer size={18} />
                Print Certificate
              </button>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 md:p-6">
            <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2 text-sm">
                <RefreshCw size={16} className="animate-spin-slow" />
                Real-time Preview
            </h4>
            <p className="text-amber-700 text-[10px] md:text-xs leading-relaxed">
                Changes made in the form will reflect instantly in the premium preview. 
                Exports are generated at high resolution for professional quality.
            </p>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-full lg:w-2/3 order-1 lg:order-2">
          <div className="sticky top-4 md:top-8 space-y-4">
             <div className="flex justify-between items-end mb-2 px-2">
                <div>
                    <h3 className="text-lg md:text-xl font-black text-gray-800 tracking-tight">Live Preview</h3>
                    <p className="text-xs text-gray-500 font-medium">1123 × 794 (A4 Landscape)</p>
                </div>
                <div className="hidden xs:flex gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Premium Gold</span>
                    <span>•</span>
                    <span>Verified</span>
                </div>
             </div>
             <div className="bg-gray-800 p-4 sm:p-8 md:p-12 rounded-2xl md:rounded-[2rem] shadow-2xl border-[6px] md:border-[12px] border-gray-700 overflow-hidden min-h-[300px] md:min-h-[600px] flex items-center justify-center">
                <CertificatePreview ref={previewRef} data={formData} />
             </div>
          </div>
        </div>
      </div>
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, .lg\\:w-1\\/3, h3, p, .sticky > div:first-child, .bg-amber-50 { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .max-w-\\[1600px\\] { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .lg\\:w-2\\/3 { width: 100% !important; }
          .sticky { position: static !important; }
          .bg-gray-800 { background: white !important; padding: 0 !important; border: none !important; border-radius: 0 !important; box-shadow: none !important; }
          .scale-\\[0\\.5\\], .scale-\\[0\\.6\\], .scale-\\[0\\.75\\], .scale-\\[0\\.8\\], .scale-100 { transform: scale(1) !important; transform-origin: top left !important; }
          .w-\\[1123px\\] { width: 1123px !important; height: 794px !important; margin: 0 !important; }
        }
      `}} />
    </div>
  );
};

export default CertificateGenerator;