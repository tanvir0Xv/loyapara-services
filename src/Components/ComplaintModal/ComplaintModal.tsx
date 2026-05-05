"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { AlertTriangle, X, Send, User, MessageSquare, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ComplaintValues = {
  accusedName: string;
  complaintType: string;
  message: string;
};

export default function ComplaintModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ComplaintValues>();


  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  
  useEffect(() => {
    if (!mounted) return; 

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mounted]);

const onSubmit = async (data: ComplaintValues) => {
  try {
    const response = await fetch('/api/complain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // সাকসেস হলে নিচের কাজগুলো হবে
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
        onClose();
      }, 2500);
    } else {
      
      console.error('Submission failed');
    }
  } catch (error) {
    
    console.error('Error submitting complaint:', error);
  }
};

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitted && onClose()}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
          >
            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div key="form">
                    <div className="flex flex-col items-center mb-6">
                      <div className="bg-red-50 p-4 rounded-3xl text-red-500 mb-3 shadow-sm">
                        <AlertTriangle size={32} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">অভিযোগ জানান</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* অভিযুক্তের নাম */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">মিস্ত্রির নাম *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            {...register("accusedName", { required: "নাম লিখুন" })}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-slate-800" 
                            placeholder="কার বিরুদ্ধে অভিযোগ?" 
                          />
                        </div>
                        {errors.accusedName && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.accusedName.message}</p>}
                      </div>

                      {/* অভিযোগের ধরন - এটি আগে বাদ পড়েছিল */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">অভিযোগের ধরন *</label>
                        <div className="relative">
                          <select 
                            {...register("complaintType", { required: "একটি ধরন বেছে নিন" })}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                          >
                            <option value="">নির্বাচন করুন</option>
                            <option value="খারাপ ব্যবহার">খারাপ ব্যবহার</option>
                            <option value="অতিরিক্ত টাকা দাবি">অতিরিক্ত টাকা দাবি</option>
                            <option value="কাজে ফাঁকি">কাজে গাফিলতি</option>
                            <option value="অন্যান্য">অন্যান্য</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                        {errors.complaintType && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.complaintType.message}</p>}
                      </div>

                      {/* বিস্তারিত বিবরণ */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">বিস্তারিত বিবরণ *</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                          <textarea 
                            {...register("message", { required: "বিস্তারিত লিখুন" })}
                            rows={3}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 resize-none font-medium text-slate-800" 
                            placeholder="কী সমস্যা হয়েছে বিস্তারিত লিখুন..." 
                          />
                        </div>
                        {errors.message && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.message.message}</p>}
                      </div>

                      {/* বাটন গ্রুপ */}
                      <div className="flex gap-3 pt-3">
                        <button 
                          type="button" 
                          onClick={onClose}
                          className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-2xl hover:bg-slate-200 transition-all active:scale-95 text-sm"
                        >
                          বাতিল
                        </button>
                        <button 
                          type="submit" 
                          className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                        >
                          জমা দিন <Send size={16} />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  /* সাকসেস মেসেজ */
                  <motion.div key="success" className="flex flex-col items-center py-8 text-center">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">সফল হয়েছে!</h2>
                    <p className="text-slate-500 font-medium px-4">আপনার অভিযোগটি রেকর্ড করা হয়েছে। শীঘ্রই ব্যবস্থা নেওয়া হবে।</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}