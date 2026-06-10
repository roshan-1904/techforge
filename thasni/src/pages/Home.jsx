import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, Building2, BookOpen, Calendar, ArrowRight, Sparkles, CheckCircle2, Award, Zap, AlertCircle, Check } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
    year: '',
    email: '',
    mobile: '',
    workshop: 'Full Stack Web Development',
    startDate: '2026-06-15',
    endDate: '2026-06-30'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!/^[A-Za-z\s.]{3,}$/.test(value.trim())) {
          error = 'Min 3 letters required';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'mobile':
        const cleanMobile = value.replace(/[\s\-\+]/g, '');
        if (!/^\d{10,12}$/.test(cleanMobile)) {
          error = 'Enter 10-12 digits';
        }
        break;
      case 'college':
      case 'department':
      case 'year':
        if (!value) error = 'Field required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'Cannot be before start';
    }

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length > 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      toast.error('Please fix the errors in the form');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, formData);
      toast.success('Registration successful!');
      setIsSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const getInputClasses = (name) => {
    const base = "w-full pl-12 pr-10 py-3.5 bg-white/40 border rounded-2xl focus:ring-4 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium backdrop-blur-md shadow-inner text-gray-800";
    const status = touched[name] 
      ? errors[name] 
        ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/30" 
        : "border-emerald-400 focus:ring-emerald-500/10 focus:border-emerald-500 bg-emerald-50/30"
      : "border-white/50 focus:ring-orange-500/20 focus:border-orange-500 hover:bg-white/60";
    return `${base} ${status}`;
  };

  const labelClasses = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1";
  
  const getIconClasses = (name) => {
    const base = "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300";
    const status = touched[name]
      ? errors[name] ? "text-rose-500" : "text-emerald-500"
      : "text-gray-400 group-focus-within:text-orange-500";
    return `${base} ${status}`;
  };

  const ValidationError = ({ name }) => (
    <AnimatePresence>
      {touched[name] && errors[name] && (
        <motion.div
          initial={{ opacity: 0, y: -10, x: 5 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 -bottom-6 flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-tighter"
        >
          <AlertCircle size={10} />
          {errors[name]}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ValidationSuccess = ({ name }) => (
    <AnimatePresence>
      {touched[name] && !errors[name] && formData[name] && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-4 top-[60%] -translate-y-1/2 text-emerald-500"
        >
          <Check size={18} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans selection:bg-orange-500/30 selection:text-orange-900">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-orange-400/30 blur-[120px] rounded-full mix-blend-multiply" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 18, repeat: Infinity, delay: 2, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] bg-emerald-400/30 blur-[120px] rounded-full mix-blend-multiply" 
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], x: [0, 30, 0], y: [0, -40, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, delay: 4, ease: "easeInOut" }}
          className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply" 
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-64px)] flex items-center">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full">
          <div className="w-full lg:w-[45%] text-center lg:text-left flex flex-col items-center lg:items-start relative z-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 border border-orange-200 shadow-sm text-orange-600 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
                <Sparkles size={16} className="text-orange-500 animate-pulse" />
                <span>Premium Internship 2026</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.05] mb-6 tracking-tight">
                Master the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-emerald-500 to-blue-600 animate-gradient-x">Future of Tech</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                Immerse yourself in elite workshops designed for tomorrow's leaders. Earn a globally verifiable, cryptographic certificate upon completion.
              </motion.p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 mb-12">
                {[
                  { label: 'Elite Mentorship', icon: <Award size={20} className="text-orange-500" /> },
                  { label: 'Real-world Projects', icon: <Zap size={20} className="text-emerald-500" /> },
                  { label: 'Global Verification', icon: <CheckCircle2 size={20} className="text-blue-500" /> }
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }} className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-white/70 backdrop-blur-md shadow-lg shadow-slate-200/50 border border-white px-5 py-3 rounded-2xl">
                    <div className="p-2 bg-white rounded-xl shadow-sm">{item.icon}</div>
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-[55%] relative">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-tr from-orange-400 to-emerald-400 rounded-[40%] opacity-40 blur-2xl pointer-events-none" />
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div key="form" initial={{ opacity: 0, y: 40, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0, x: isShaking ? [0, -10, 10, -10, 10, 0] : 0 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ duration: isShaking ? 0.4 : 0.8, type: isShaking ? "tween" : "spring", bounce: 0.4 }} className="bg-white/60 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden" style={{ transformPerspective: 1000 }}>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[3rem]" />
                  <div className="mb-8 relative z-10">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Secure Your Seat</h2>
                    <p className="text-slate-500 font-medium text-sm">Complete the form below to initiate your registration.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>Full Name</label>
                        <User className={getIconClasses('name')} size={18} />
                        <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('name')} />
                        <ValidationError name="name" />
                        <ValidationSuccess name="name" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>Email Address</label>
                        <Mail className={getIconClasses('email')} size={18} />
                        <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('email')} />
                        <ValidationError name="email" />
                        <ValidationSuccess name="email" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>Mobile Number</label>
                        <Phone className={getIconClasses('mobile')} size={18} />
                        <input type="tel" name="mobile" placeholder="9876543210" value={formData.mobile} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('mobile')} />
                        <ValidationError name="mobile" />
                        <ValidationSuccess name="mobile" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>College Name</label>
                        <Building2 className={getIconClasses('college')} size={18} />
                        <input type="text" name="college" placeholder="Engineering College" value={formData.college} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('college')} />
                        <ValidationError name="college" />
                        <ValidationSuccess name="college" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>Department</label>
                        <BookOpen className={getIconClasses('department')} size={18} />
                        <input type="text" name="department" placeholder="Computer Science" value={formData.department} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('department')} />
                        <ValidationError name="department" />
                        <ValidationSuccess name="department" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>Year of Study</label>
                        <GraduationCap className={getIconClasses('year')} size={18} />
                        <select name="year" value={formData.year} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('year')}>
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                        <ValidationError name="year" />
                        <ValidationSuccess name="year" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group md:col-span-2">
                        <label className={labelClasses}>Workshop Domain</label>
                        <Sparkles className={getIconClasses('workshop')} size={18} />
                        <select name="workshop" value={formData.workshop} onChange={handleChange} className={getInputClasses('workshop')}>
                          <option value="Full Stack Web Development">Full Stack Web Development</option>
                          <option value="AI & Machine Learning">AI & Machine Learning</option>
                          <option value="Cloud Computing">Cloud Computing</option>
                          <option value="Cyber Security">Cyber Security</option>
                        </select>
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>Start Date</label>
                        <Calendar className={getIconClasses('startDate')} size={18} />
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={getInputClasses('startDate')} />
                        <ValidationError name="startDate" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className={labelClasses}>End Date</label>
                        <Calendar className={getIconClasses('endDate')} size={18} />
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={getInputClasses('endDate')} />
                        <ValidationError name="endDate" />
                      </motion.div>
                    </motion.div>
                    <motion.button whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -10px rgba(249,115,22,0.4)" }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full relative group overflow-hidden bg-gradient-to-r from-orange-500 via-emerald-500 to-blue-600 p-[2px] rounded-2xl mt-4 disabled:opacity-50">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-emerald-500 to-blue-600 animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors group-hover:bg-transparent">
                         {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                            <span className="text-white font-black tracking-widest uppercase text-sm drop-shadow-md">Confirm Registration</span>
                            <ArrowRight size={20} className="text-white drop-shadow-md group-hover:translate-x-1 transition-transform" />
                          </>}
                      </div>
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="bg-white/80 backdrop-blur-3xl p-14 rounded-[3rem] shadow-2xl border border-white/60 text-center relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full pointer-events-none"></div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-28 h-28 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30">
                    <CheckCircle2 size={56} className="text-white" />
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Application Received</h2>
                  <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">Your profile has been submitted for review. Keep an eye on your inbox—we will notify you once your registration is approved.</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsSubmitted(false)} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Submit Another Application</motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease infinite; }
      `}} />
    </div>
  );
};

export default Home;