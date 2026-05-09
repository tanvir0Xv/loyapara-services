import { Farmer } from '@/types/services/service';
import { Phone, Award, CheckCircle2, Info, Star, MapPin, Wheat, ShoppingCart, Tractor, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HouseHolderCard = ({ data }: { data: Farmer }) => {
  return (
    <div className="bg-white border border-amber-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group h-full flex flex-col">
      
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[5rem] group-hover:bg-amber-500 transition-colors duration-500 opacity-50 group-hover:opacity-10" />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Header: Category & Bulk Sale Badge */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 bg-amber-600 text-white px-1 py-2.5 rounded-2xl shadow-lg shadow-amber-100">
            <Wheat size={18} className="text-amber-200" />
            <span className="text-xs font-black uppercase tracking-widest leading-none">
              {data.category}
            </span>
          </div>
          
          {data.bulkSale && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
              <ShoppingCart size={12} className="text-orange-600" />
              <span className="text-[9px] font-black text-orange-700 uppercase">পাইকারি বিক্রয়</span>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="flex gap-5 items-center mb-6">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl ring-2 ring-amber-100 group-hover:ring-amber-500 transition-all relative bg-slate-100">
              <Image 
                src={data.profileImage === "#" ? "/default-householder.png" : data.profileImage} 
                alt={data.name} 
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            {data.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                <CheckCircle2 size={18} className="text-blue-600 fill-blue-50" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
             <div className="flex items-center gap-1 mb-1 text-amber-600">
               <Leaf size={12} />
               <span className="text-[10px] font-black uppercase tracking-tighter">সফল গৃহস্থ</span>
            </div>
            <h3 className="font-black text-2xl text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
              {data.name}
            </h3>
            
            <p className="text-amber-600 font-black text-[11px] uppercase mt-1">
              ডাকনাম: {data.nickName}
            </p>
            
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={`${i < Math.floor(data.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} 
                  />
                ))}
              </div>
              <span className="text-[11px] font-black text-slate-700">{data.rating}</span>
            </div>
          </div>
        </div>

        {/* Produces Section (Items list) */}
        <div className="mb-6 flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
            <ShoppingCart size={16} className="text-amber-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 truncate">
                উৎপাদন: {Array.isArray(data.produces) ? data.produces.join(", ") : data.produces}
            </span>
        </div>

        {/* Info Grid (Experience & Machinery) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm text-amber-600">
              <Award size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">অভিজ্ঞতা</span>
              <span className="text-xs font-black text-slate-800">{data.experience}</span>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm text-amber-600">
              <Tractor size={18} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">সরঞ্জাম</span>
              <span className="text-[10px] font-black text-slate-800 leading-tight">
                {data.hasMachinery ? "আধুনিক মেশিন আছে" : "মেশিন নেই"}
              </span>
            </div>
          </div>
        </div>

        {/* Speciality Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {data.speciality?.slice(0, 3).map((s, index) => (
            <span key={index} className="bg-amber-50/50 text-amber-700 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-amber-100/50">
              🌱 {s}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <Link 
            href={`/services/${data._id}`}
            className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95 border border-slate-200"
          >
            <Info size={18} className="text-slate-400" /> বিস্তারিত
          </Link>
          
          <a 
            href={`tel:${data.phone}`} 
            className="flex-[1.8] py-4 bg-amber-600 text-white rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 hover:bg-amber-700 transition-all active:scale-95 shadow-lg shadow-amber-100"
          >
             <Phone size={18} className="fill-white/20" /> 
             <span>কল দিন</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HouseHolderCard;