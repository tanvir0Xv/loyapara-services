import Image from "next/image";
import React from "react";

interface FarmerData {
  _id: string;
  name: string;
  nickName: string;
  phone: string;
  category: string;
  experience: string;
  location: string;
  speciality: string[];
  rating: number;
  isVerified: boolean;
  status: string;
  profileImage: string;
  produces: string[];
  hasMachinery: boolean;
  isExpert: boolean;
  bulkSale: boolean;
}

const HouseholderDetailsModal = ({ data }: { data: FarmerData }) => {
  return (
    <div className="relative overflow-hidden bg-white max-w-2xl mx-auto rounded-[2.5rem] shadow-2xl border border-emerald-100">
      
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (এগ্রিকালচার গ্র্যাডিয়েন্ট) */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl"></div>

      <div className="relative p-6 md:p-10 flex flex-col items-center">
        
        {/* ১. প্রোফাইল সেকশন (গোল্ডেন-গ্রিন গ্র্যাডিয়েন্ট ফ্রেম) */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative p-1.5 bg-gradient-to-tr from-emerald-600 via-green-500 to-yellow-400 rounded-3xl shadow-2xl">
            <div className="relative w-28 h-28 md:w-32 md:h-32">
              <Image
                src={data.profileImage}
                alt={data.name}
                fill
                className="object-cover rounded-[22px] border-4 border-white shadow-sm"
                sizes="(max-width: 128px) 100vw, 128px"
                priority
              />
            </div>
            {data.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="mt-10 text-3xl font-black text-slate-800 tracking-tight text-center">
            {data.name}
          </h2>
          <div className="flex flex-col items-center gap-1 mt-1">
             <p className="text-emerald-700 font-bold text-base tracking-wide">
               {data.category} — {data.nickName}
             </p>
             <span className="px-4 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-200 uppercase mt-2">
               ● {data.status}
             </span>
          </div>
        </div>

        {/* ২. হাইলাইট বক্সস (৩টি উজ্জ্বল বক্স) */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 text-center shadow-sm">
            <p className="text-[10px] text-emerald-600 uppercase font-black mb-1">অভিজ্ঞতা</p>
            <p className="text-slate-700 font-bold text-sm">{data.experience}</p>
          </div>
          <div className="bg-yellow-50/50 p-4 rounded-3xl border border-yellow-100 text-center shadow-sm">
            <p className="text-[10px] text-yellow-600 uppercase font-black mb-1">রেটিং</p>
            <p className="text-slate-700 font-bold text-sm">⭐ {data.rating}</p>
          </div>
          <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 text-center shadow-sm">
            <p className="text-[10px] text-emerald-600 uppercase font-black mb-1">অবস্থান</p>
            <p className="text-slate-700 font-bold text-sm truncate px-1">{data.location}</p>
          </div>
        </div>

        {/* ৩. কি কি উৎপাদন করেন (Produces) */}
        <div className="w-full mb-8">
          <h4 className="text-sm font-black text-slate-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-2 h-5 bg-emerald-500 rounded-full"></span> খামারে যা উৎপাদন হয়:
          </h4>
          <div className="flex flex-wrap gap-2">
            {data?.produces?.map((item, idx) => (
              <span key={idx} className="bg-white text-emerald-700 text-xs px-4 py-2 rounded-xl border border-emerald-100 font-bold shadow-sm">
                🌾 {item}
              </span>
            ))}
          </div>
        </div>

        {/* ৪. সকল অতিরিক্ত তথ্য (Y-Axis) */}
        <div className="w-full space-y-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 shadow-inner mb-8">
          
          <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
            <span className="text-slate-500 font-bold">কৃষি যন্ত্রপাতি:</span>
            <span className={`font-black ${data.hasMachinery ? 'text-emerald-600' : 'text-red-500'}`}>
              {data.hasMachinery ? "নিজস্ব সরঞ্জাম আছে" : "নেই"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
            <span className="text-slate-500 font-bold">দক্ষতা লেভেল:</span>
            <span className="font-black text-emerald-700">
              {data.isExpert ? "কৃষি বিশেষজ্ঞ" : "সাধারণ"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
            <span className="text-slate-500 font-bold">পাইকারি বিক্রয়:</span>
            <span className="font-black text-emerald-700">
              {data.bulkSale ? "পাইকারি ও খুচরা উপলব্ধ" : "শুধুমাত্র খুচরা"}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-slate-500 font-bold text-xs uppercase">বিশেষ কারিগরি দক্ষতা:</span>
            <div className="flex flex-wrap gap-2">
                {data.speciality.map((s, i) => (
                    <span key={i} className="text-[11px] font-bold text-emerald-800 bg-emerald-100/50 px-2 py-1 rounded-lg"># {s}</span>
                ))}
            </div>
          </div>
          
          <p className="text-[9px] font-mono text-slate-300 pt-2 tracking-tighter">REF-ID: {data._id}</p>
        </div>

        {/* ৫. সুপার ভিজিবল কল বাটন (সবার নিচে) */}
        <div className="w-full px-2">
          <a
            href={`tel:${data.phone}`}
            className="group relative flex items-center justify-center gap-4 w-full bg-green-500 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-2xl shadow-[0_20px_40px_-10px_rgba(5,150,105,0.5)] transition-all duration-300 active:scale-[0.96] overflow-hidden"
          >
            {/* বাটন শাইন অ্যানিমেশন */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            
            <div className="bg-white/20 p-2 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span className="tracking-tight">পরামর্শ বা ক্রয়ের জন্য কল দিন</span>
          </a>
          <p className="text-center mt-6 text-[12px] text-emerald-800 font-extrabold tracking-widest uppercase opacity-80">
             লয়াপাড়া সার্ভিস দ্বারা বিশ্বস্ত
          </p>
        </div>
      </div>
    </div>
  );
};

export default HouseholderDetailsModal;