"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Wrench,
  Truck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// স্লাইডার ডাটা অ্যারে
const banners = [
  {
    id: 1,
    image: "/loyapara.jpg",
    title: "লয়াপাড়ার ডিজিটাল সার্ভিস",
    subtitle: "সব সেবা এখন এক ঠিকানায়",
    description:
      "আপনার প্রয়োজনীয় দক্ষ কারিগর বা জরুরি সার্ভিস খুঁজে নিন মুহূর্তেই।",
  },
  {
    id: 2,
    image: "/loyapara (2).JPG",
    title: "সেরা মিস্ত্রি ও কারিগর",
    subtitle: "দক্ষ ও নির্ভরযোগ্য সেবা",
    description:
      "রাজমিস্ত্রি, ইলেকট্রিশিয়ান থেকে শুরু করে সব ধরনের মিস্ত্রি এখন আপনার হাতের মুঠোয়।",
  },
  {
    id: 3,
    image: "/loyapara (3).JPG",
    title: "জরুরি স্বাস্থ্য সেবা",
    subtitle: "নিকটস্থ ডাক্তার ও ক্লিনিক",
    description:
      "পশু চিকিৎসক বা হোমিও ডাক্তার - প্রয়োজনে দ্রুত যোগাযোগ করুন আমাদের সাথে।",
  },
  {
    id: 4,
    image: "/loyapara (4).JPG",
    title: "যাতায়াত ও পরিবহন",
    subtitle: "ভ্যান ও অটো সার্ভিস",
    description:
      "আপনার যাতায়াত সহজ করতে ভ্যান ও অটোরিকশা চালকদের সাথে সরাসরি যোগাযোগ করুন।",
  },
  {
    id: 5,
    image: "/loyapara (5).JPG",
    title: "কৃষি ও খামার",
    subtitle: "উন্নত কৃষি সমাধান",
    description:
      "কৃষি শ্রমিক বা যন্ত্রপাতির জন্য দক্ষ লোক খুঁজে নিন আমাদের প্ল্যাটফর্মে।",
  },
  {
    id: 6,
    image: "/loyapara (6).JPG",
    title: "নির্মাণ ও প্রকৌশল",
    subtitle: "আধুনিক নির্মাণ শৈলী",
    description:
      "আপনার স্বপ্নের বাড়ি তৈরিতে দক্ষ রাজমিস্ত্রি ও ইঞ্জিনিয়ারদের সাথে যোগাযোগ করুন।",
  },
  {
    id: 7,
    image: "/loyapara (7).JPG",
    title: "শিক্ষা ও প্রশিক্ষণ",
    subtitle: "সেরা শিক্ষক আপনার দ্বারে",
    description:
      "অভিজ্ঞ টিউটর বা শিক্ষক খুঁজে নিন আপনার সন্তানদের উজ্জ্বল ভবিষ্যতের জন্য।",
  },
  {
    id: 8,
    image: "/loyapara (8).JPG",
    title: "ডিজিটাল লয়াপাড়া",
    subtitle: "স্মার্ট গ্রাম, স্মার্ট সেবা",
    description:
      "প্রযুক্তির ছোঁয়ায় গ্রামের প্রতিটি মানুষের জীবনযাত্রাকে সহজ করতে আমরা বদ্ধপরিকর।",
  },
];

// পপুলার সার্চ ক্যাটাগরি
const popularCategories = [
  { name: "রাজমিস্ত্রি", category: "রাজমিস্ত্রি", icon: "🧱" },
  { name: "ইলেকট্রিশিয়ান", category: "ইলেকট্রিশিয়ান", icon: "⚡" },
  { name: "ভ্যান ও অটো", category: "ভ্যান ও অটো সার্ভিস", icon: "🛺" },
  { name: "প্লাম্বার", category: "প্লাম্বার", icon: "🚰" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); 

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization", 
    name: "লয়াপাড়া সেবা - Loyapara Services",
    description:
      "কাগইল ইউনিয়ন, গাবতলী থানা, বগুড়া জেলার লয়াপাড়ার ডিজিটাল সেবা ও তথ্য।",
    url: "https://loyapara-services.vercel.app",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kagoil Union, Gabtoli (কাগইল ইউনিয়ন, গাবতলী)",
      "addressRegion": "Bogura (বগুড়া)",
      "postalCode": "5820",
      "addressCountry": "BD",
    },
    sameAs: [
      "https://www.facebook.com/groups/loyaparabd", // আপনার ফেসবুক গ্রুপের লিংকটি এখানে বসান
    ],
  };

  // অটো স্লাইডার লজিক
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // ক্লিক আউটসাইড টু ক্লোজ সাজেশন
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/services?search=${encodeURIComponent(query.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[600px] md:h-[800px] bg-slate-950">
      {/* ১. ইমেজ স্লাইডার */}
      <div className="absolute inset-0 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-110 rotate-0"
                : "opacity-0 scale-100 rotate-1"
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
          </div>
        ))}
      </div>

      {/* ডেকোরেティブ এলিমেন্টস */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* ২. কন্ট্রোল বাটন - লুকানো ছোট স্ক্রিনে */}
      <div className="absolute inset-0 hidden md:flex items-center justify-between px-10 z-20 pointer-events-none">
        <button
          onClick={prevSlide}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl text-white pointer-events-auto hover:bg-primary hover:scale-110 transition-all border border-white/10 group shadow-2xl"
        >
          <ChevronLeft
            size={32}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <button
          onClick={nextSlide}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl text-white pointer-events-auto hover:bg-primary hover:scale-110 transition-all border border-white/10 group shadow-2xl"
        >
          <ChevronRight
            size={32}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* ৩. কন্টেন্ট ওভারলে */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center text-white z-10">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl w-full space-y-6 md:space-y-10"
        >
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-black uppercase tracking-[0.3em] backdrop-blur-md shadow-xl"
            >
              <Sparkles
                size={14}
                className="text-yellow-400 animate-spin-slow"
              />
              Loyapara Digital Village
            </motion.div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1] text-white">
              {banners[currentSlide].title} <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent italic font-serif">
                {banners[currentSlide].subtitle}
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
            {banners[currentSlide].description}
          </p>

          {/* স্মার্ট সার্চ বক্স */}
          <div
            ref={searchRef}
            className="relative w-full max-w-3xl mx-auto z-[100] group"
          >
            <div
              className={`flex items-center bg-white/30 backdrop-blur-xl rounded-[2.5rem] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-2 border-white/30 transition-all duration-700 ${isSearchFocused ? "border-primary/50 scale-[1.02] shadow-primary/10 bg-white/40" : ""}`}
            >
              <div className="pl-6 md:pl-8 text-slate-400 group-focus-within:text-primary transition-colors">
                <Search className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                placeholder="মিস্ত্রি, সার্ভিস বা ক্যাটাগরি খুঁজুন..."
                className="w-full py-5 md:py-7 px-5 md:px-6 text-lg md:text-2xl text-slate-900 outline-none placeholder:text-slate-400 font-bold bg-transparent"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-3 mr-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X size={24} strokeWidth={3} />
                </button>
              )}

              <button
                onClick={() => handleSearch(searchQuery)}
                className="hidden md:flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-lg shadow-primary/30"
              >
                খুঁজুন
              </button>
            </div>

            {/* ড্রপডাউন সাজেশন */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.35)] overflow-hidden border border-slate-100 p-8 text-left z-[110]"
                >
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-5 px-2">
                        <TrendingUp size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                          জনপ্রিয় সার্চ
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {popularCategories.map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              router.push(
                                `/services?category=${encodeURIComponent(cat.category)}`,
                              );
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 hover:bg-white hover:text-primary border border-slate-100/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all font-bold text-slate-700 active:scale-95 group"
                          >
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                              {cat.icon}
                            </span>
                            <span className="text-sm">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                        Loyapara Digital Service Hub
                      </p>
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary/30"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ট্রাস্ট ব্যাজ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 pt-4"
          >
            {[
              {
                label: "Verified Providers",
                icon: <CheckCircle size={14} className="text-emerald-400" />,
              },
              {
                label: "Direct Contact",
                icon: <Phone size={14} className="text-blue-400" />,
              },
              {
                label: "Easy Search",
                icon: <Search size={14} className="text-orange-400" />,
              },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest"
              >
                {badge.icon}
                {badge.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* স্লাইড ইন্ডিকেটর - একদম নিচে */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? "w-12 bg-primary shadow-[0_0_15px_rgba(255,100,0,0.5)]" : "w-3 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
