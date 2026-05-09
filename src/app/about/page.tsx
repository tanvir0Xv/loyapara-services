"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Users2,
  Zap,
  ShieldCheck,
  PhoneCall,
  Heart,
  Smartphone,
  MessageSquare,
  Sprout,
  Sun,
  Cloud,
  MapPin,
  Leaf,
  Globe,
  Star,
} from "lucide-react";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-slate-800 selection:bg-emerald-600 selection:text-white overflow-hidden font-sans relative">
      
      {/* প্রগ্রেস বার */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-[100]" style={{ scaleX }} />

      {/* ১. প্রিমিয়াম ন্যাচারাল হিরো সেকশন */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* আকাশ ও প্রকৃতির আবহ */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-emerald-50/40 to-[#fdfbf7] -z-20" />
        
        {/* ডেকোরেটিভ অ্যানিমেটেড উপাদান */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-[60rem] h-[60rem] bg-emerald-200/30 rounded-full blur-[120px] -z-10" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-[70rem] h-[70rem] bg-blue-200/30 rounded-full blur-[150px] -z-10" 
        />

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 rounded-full bg-white shadow-xl shadow-emerald-900/5 border border-emerald-100 text-emerald-700 backdrop-blur-md">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center">
                      <Star size={10} fill="currentColor" />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] pl-2">Loyapara • Digital Roots</span>
              </div>

              <h1 className="text-7xl md:text-9xl lg:text-[13rem] font-black leading-[0.8] tracking-tighter mb-12 text-slate-900 drop-shadow-2xl">
                শেকড়ের <br />
                <span className="bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-800 bg-clip-text text-transparent italic font-serif pr-6">
                  স্পন্দন
                </span>
              </h1>

              <div className="max-w-3xl mx-auto relative group">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -left-12 -top-12 text-emerald-200 hidden md:block"
                >
                  <Cloud size={80} strokeWidth={1} />
                </motion.div>
                <p className="text-xl md:text-3xl text-slate-500 font-medium leading-relaxed px-4 md:px-0">
                  লয়াপাড়া সেবা কোনো অ্যাপ নয়, এটি একটি <span className="text-slate-900 font-black underline decoration-emerald-500/30 underline-offset-8">ডিজিটাল সেতু</span>। যা আমাদের শেকড়কে ধরে রেখে মানুষের জীবনকে প্রাণবন্ত করে তোলে।
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* স্ক্রল ইন্ডিকেটর */}
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] rotate-90 mb-8">Scroll</span>
          <div className="w-px h-24 bg-gradient-to-b from-slate-900 to-transparent" />
        </motion.div>
      </section>

      {/* ২. আমাদের গল্প - স্টোরিটেলিং সেকশন */}
      <section className="py-32 md:py-48 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-slate-900"
            >
              লয়াপাড়া সেবার <span className="text-emerald-600 italic font-serif">পথচলা</span>
            </motion.h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              একটি সাধারণ চিন্তা থেকে শুরু হওয়া এই ডিজিটাল উদ্যোগ আজ লয়াপাড়া গ্রামের প্রতিটি ঘরে ঘরে পৌঁছে গেছে। 
              আমাদের লক্ষ্য ছিল সহজ—গ্রামের মানুষকে প্রযুক্তির সাথে পরিচয় করিয়ে দেওয়া।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* কানেক্টিং লাইন */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-emerald-100 hidden md:block -z-10" />
            
            {[
              { year: "২০২৩", title: "শুরু", desc: "গ্রামের মানুষের সমস্যা চিহ্নিত করা ও পরিকল্পনার সূচনা।" },
              { year: "২০২৪", title: "উদ্বোধন", desc: "প্রথমবারের মতো লয়াপাড়া সেবা প্ল্যাটফর্মের যাত্রা শুরু।" },
              { year: "২০২৫", title: "ভবিষ্যৎ", desc: "প্রতিটি গ্রামকে স্মার্ট ও স্বাবলম্বী হিসেবে গড়ে তোলা।" },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#fdfbf7] p-10 rounded-[3rem] border border-emerald-50 text-center relative hover:shadow-2xl hover:shadow-emerald-900/5 transition-all"
              >
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-lg shadow-emerald-200">
                  {step.year}
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2">{step.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ৩. আমাদের লক্ষ্য - ইউনিক ডিজাইন */}
      <section className="py-32 md:py-56 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="relative rounded-[4rem] overflow-hidden aspect-[4/5] shadow-[0_50px_100px_-20px_rgba(0,60,0,0.2)] group">
                  <img 
                    src="/loyapara.jpg" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt="Village Life" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent" />
                </div>
                
                {/* ভাসমান ব্যাজ */}
                <motion.div 
                  animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center p-6 border border-emerald-50 text-center"
                >
                  <Leaf className="text-emerald-500 mb-2" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-tight leading-tight">১০১% খাঁটি সেবা</p>
                </motion.div>
              </motion.div>

              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-50 rounded-full -z-0 blur-3xl opacity-60" />
            </div>

            <div className="lg:col-span-7 space-y-16 lg:pl-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9]">
                    একটি আধুনিক <br />
                    <span className="text-emerald-600 italic font-serif">ডিজিটাল গ্রাম</span>
                  </h2>
                  <div className="h-2 w-32 bg-emerald-500 rounded-full" />
                </div>

                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  লয়াপাড়া সেবা প্রকল্পের মূল উদ্দেশ্য হলো স্থানীয় মিস্ত্রি, শ্রমিক এবং জরুরি সেবাগুলোকে 
                  সবার নাগালে পৌঁছে দেওয়া। আমরা বিশ্বাস করি, ডিজিটাল সেবা শুধু শহরের জন্য নয়, 
                  গ্রামের প্রতিটি মানুষের অধিকার।
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: <ShieldCheck size={32} />, title: "নিরাপদ সেবা", desc: "সরাসরি যাচাইকৃত দক্ষ মিস্ত্রি", color: "emerald" },
                  { icon: <Zap size={32} />, title: "দ্রুত সমাধান", desc: "এক ক্লিকেই সব তথ্য ও কন্টাক্ট", color: "orange" },
                  { icon: <Users2 size={32} />, title: "জনগণের জন্য", desc: "দালালমুক্ত সরাসরি সার্ভিস", color: "blue" },
                  { icon: <Smartphone size={32} />, title: "স্মার্ট গ্রাম", desc: "সহজ ও সাবলীল ইউজার ইন্টারফেস", color: "teal" },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -10 }}
                    className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ৩. স্ট্যাটস - গ্লাস-মরফিজম ভাইব */}
      <section className="py-32 bg-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#10b981_1px,_transparent_1px)] bg-[length:60px_60px] opacity-10" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { val: "৫০০+", label: "নিবন্ধিত সেবা প্রদানকারী", icon: <Users2 size={24} /> },
              { val: "৫০+", label: "দৈনিক সফল সমাধান", icon: <CheckCircle2 size={24} /> },
              { val: "১০০%", label: "স্থানীয় মানুষের আস্থা", icon: <Heart size={24} /> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-6">
                  {stat.icon}
                </div>
                <h3 className="text-6xl md:text-8xl font-black text-white mb-2">{stat.val}</h3>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ৪. যোগাযোগ - গ্র্যান্ড ফিনালে */}
      <section className="py-40 bg-[#fdfbf7] relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="space-y-8 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Connect With Us
              </div>
              <h2 className="text-6xl md:text-[9rem] font-black text-slate-900 leading-[0.8] tracking-tighter">
                আসুন, গ্রামকে <br />
                <span className="text-emerald-600 italic font-serif">একসাথে গড়ি</span>
              </h2>
              <p className="text-2xl text-slate-500 font-medium max-w-2xl mx-auto pt-8">
                আমাদের এই ক্ষুদ্র প্রয়াসকে আরও বড় করতে আপনার যেকোনো মতামত বা পরামর্শ আমাদের জানান। 
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <motion.a 
                href="tel:01700000000"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-4 px-12 py-6 rounded-[2rem] bg-emerald-600 text-white font-black text-xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] hover:bg-emerald-700 transition-all"
              >
                <PhoneCall size={28} /> কল করুন
              </motion.a>
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-4 px-12 py-6 rounded-[2rem] bg-white text-slate-900 font-black text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 hover:bg-slate-50 transition-all"
              >
                <MessageSquare size={28} className="text-emerald-600" /> মেসেজ দিন
              </motion.button>
            </div>

            <div className="pt-32">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tighter">
                  <MapPin size={20} className="text-emerald-500 animate-bounce" /> 
                  লয়াপাড়া, কলারোয়া, সাতক্ষীরা
                </div>
                <div className="flex items-center gap-6 text-slate-300 font-bold uppercase tracking-[0.5em] text-[9px]">
                  <span>Terms</span>
                  <span>Privacy</span>
                  <span>Security</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ভাসমান ন্যাচারাল এলিমেন্ট */}
      <div className="fixed bottom-10 left-10 opacity-10 pointer-events-none hidden xl:block">
        <Sprout size={120} strokeWidth={1} className="text-emerald-900" />
      </div>
      <div className="fixed top-40 right-10 opacity-10 pointer-events-none hidden xl:block">
        <Sun size={150} strokeWidth={1} className="text-orange-900 animate-[spin_30s_linear_infinite]" />
      </div>
    </main>
  );
}

function CheckCircle2({ size, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
