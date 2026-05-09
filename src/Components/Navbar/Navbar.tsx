"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, MapPin, Search, ShieldAlert } from "lucide-react";
import ComplaintModal from "../ComplaintModal/ComplaintModal";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingDashboard, setIsCheckingDashboard] = useState(false);

  const detailsRef = useRef<HTMLDetailsElement>(null);

  // ২. বাইরে ক্লিক করলে ক্লোজ করার লজিক
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        // যদি ক্লিক করা জায়গাটি ড্রপডাউনের ভেতরে না হয়, তবে 'open' এট্রিবিউট সরিয়ে দিন
        detailsRef.current.removeAttribute("open");
      }
    };

    // ক্লিক লিসেনার যোগ করা
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // ক্লিনআপ
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // একটিভ পাথ চেক করার ফাংশন
  const isActive = (path: string) => {
    if (path === "/services") {
      // যদি রুট শুধু /services হয়, তবে কোনো ক্যাটাগরি থাকা যাবে না
      return pathname === "/services" && !searchParams.get("category");
    }
    if (path.includes("?category=")) {
      const category = path.split("?category=")[1];
      return (
        pathname === "/services" && searchParams.get("category") === category
      );
    }
    return pathname === path;
  };

  const navItems = (
    <>
      <li>
        <details ref={detailsRef} className="lg:static group">
          <summary className="font-bold text-primary">সকল সার্ভিসসমূহ</summary>
          <ul className="p-2 bg-base-100 w-72 z-[50] shadow-2xl border border-base-200 max-h-[80vh] overflow-y-auto">
            <li>
              <Link
                href="/services"
                className={isActive("/services") ? "bg-primary text-white" : ""}
              >
                🌐 সকল সার্ভিস
              </Link>
            </li>
            <li className="menu-title text-gray-500 mt-2">নির্মাণ ও মেরামত</li>
            <li>
              <Link
                href="/services?category=রাজমিস্ত্রি"
                className={
                  isActive("/services?category=রাজমিস্ত্রি")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🧱 রাজমিস্ত্রি
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=ওয়েল্ডিং মিস্ত্রি"
                className={
                  isActive("/services?category=ওয়েল্ডিং মিস্ত্রি")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                ⚒️ ওয়েল্ডিং মিস্ত্রি
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=প্লাম্বার"
                className={
                  isActive("/services?category=প্লাম্বার")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🚰 পাইপ ফিটিং (প্লাম্বার)
              </Link>
            </li>

            <div className="divider my-0"></div>
            <li className="menu-title text-gray-500">স্বাস্থ্য ও শিক্ষা</li>
            <li>
              <Link
                href="/services?category=পশু চিকিৎসক"
                className={
                  isActive("/services?category=পশু চিকিৎসক")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🐄 গরুর ডাক্তার (পশু চিকিৎসক)
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=মাস্টার / গৃহশিক্ষক"
                className={
                  isActive("/services?category=মাস্টার / গৃহশিক্ষক")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                👨‍🏫 মাস্টার/শিক্ষক
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=হোমিও ডাক্তার"
                className={
                  isActive("/services?category=হোমিও ডাক্তার")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🧪 হোমিও ডাক্তার
              </Link>
            </li>

            <div className="divider my-0"></div>
            <li className="menu-title text-gray-500">যানবাহন ও ইঞ্জিন</li>
            <li>
              <Link
                href="/services?category=ভ্যান ও অটো সার্ভিস"
                className={
                  isActive("/services?category=ভ্যান ও অটো সার্ভিস")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🛺 ভ্যান ও অটোরিকশা
              </Link>
            </li>

            <div className="divider my-0"></div>
            <li className="menu-title text-gray-500">ইলেকট্রনিক্স ও মেকার</li>
            <li>
              <Link
                href="/services?category=ইলেকট্রিশিয়ান"
                className={
                  isActive("/services?category=ইলেকট্রিশিয়ান")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                ⚡ ইলেকট্রিশিয়ান (হাউজ ওয়ারিং)
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=ইলেকট্রনিক্স মেকার"
                className={
                  isActive("/services?category=ইলেকট্রনিক্স মেকার")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                📻 ইলেকট্রনিক্স মেকার
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=মোটরসাইকেল মেকার"
                className={
                  isActive("/services?category=মোটরসাইকেল মেকার")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🏍️ মোটরসাইকেল মেকার
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=মেশিন ও হাল মেকার"
                className={
                  isActive("/services?category=মেশিন ও হাল মেকার")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                ⚙️ মেশিন/হাল-এর মেকার
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=ভ্যান ও সাইকেল মেকার"
                className={
                  isActive("/services?category=ভ্যান ও সাইকেল মেকার")
                    ? "active"
                    : ""
                }
              >
                🚲 ভ্যান ও সাইকেল মেকার
              </Link>
            </li>

            <div className="divider my-0"></div>
            <li className="menu-title text-gray-500">কৃষি ও গৃহস্থালি</li>
            {/* খেজুরের রস যোগ করা হয়েছে */}
            <li>
              <Link
                href="/services?category=খেজুরের রস"
                className={
                  isActive("/services?category=খেজুরের রস")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🍯 খেজুরের রস
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=কৃষি শ্রমিক"
                className={
                  isActive("/services?category=কৃষি শ্রমিক")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🌾 কৃষক (পরামর্শ ও শ্রমিক)
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=কৃষক / কৃষি উদ্যোক্তা"
                className={
                  isActive("/services?category=কৃষক / কৃষি উদ্যোক্তা")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🏠 গৃহস্থ
              </Link>
            </li>

            <div className="divider my-0"></div>
            <li className="menu-title text-gray-500">অন্যান্য</li>
            <li>
              <Link
                href="/services?category=দর্জি / টেইলার্স"
                className={
                  isActive("/services?category=দর্জি / টেইলার্স")
                    ? "bg-primary text-white"
                    : ""
                }
              >
                🧵 দর্জি (টেইলার্স)
              </Link>
            </li>
          </ul>
        </details>
      </li>
    </>
  );

  const handleDashboardClick = async () => {
    if (isCheckingDashboard) return;
    setIsCheckingDashboard(true);
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (response.ok) {
        router.push("/Dashboard");
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setIsCheckingDashboard(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="navbar bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-50 px-4 lg:px-12 transition-all duration-300"
      >
        <div className="navbar-start gap-2">
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-100/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-4 z-[60] w-64 p-3 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 animate-in fade-in zoom-in duration-300"
            >
              <li className="mb-1">
                <Link
                  href="/"
                  className={`rounded-xl py-3 px-4 font-bold ${isActive("/") ? "bg-primary/10 text-primary" : "text-slate-600"}`}
                >
                  হোম
                </Link>
              </li>
              {navItems}
              <li className="mb-1">
                <Link
                  href="/lostFound"
                  className={`rounded-xl py-3 px-4 font-bold ${isActive("/lostFound") ? "bg-primary/10 text-primary" : "text-slate-600"}`}
                >
                  হারানো ও প্রাপ্তি
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="/emergency"
                  className={`rounded-xl py-3 px-4 font-bold ${isActive("/emergency") ? "bg-primary/10 text-primary" : "text-slate-600"}`}
                >
                  জরুরি নম্বর
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`rounded-xl py-3 px-4 font-bold ${isActive("/about") ? "bg-primary/10 text-primary" : "text-slate-600"}`}
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-3 group relative">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40"
            >
              <MapPin size={22} strokeWidth={2.5} />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                লয়াপাড়া<span className="text-primary italic">সেবা</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">
                Village Network
              </span>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-1 gap-1">
            <li>
              <Link
                href="/"
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                  isActive("/")
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                হোম
              </Link>
            </li>
            {navItems}
            <li>
              <Link
                href="/lostFound"
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                  isActive("/lostFound")
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                হারানো ও প্রাপ্তি
              </Link>
            </li>
            <li>
              <Link
                href="/emergency"
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                  isActive("/emergency")
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                জরুরি নম্বর
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                  isActive("/about")
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                আমাদের সম্পর্কে
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDashboardClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
          >
            {isCheckingDashboard ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShieldAlert size={16} className="text-primary" />
            )}
            Admin
          </motion.button>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle text-slate-600 bg-slate-100/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <div className="indicator">
                <Search size={20} />
                <span className="badge badge-xs badge-primary indicator-item ring-2 ring-white"></span>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white/95 backdrop-blur-xl rounded-[2.5rem] z-[60] mt-4 w-72 p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-100 animate-in fade-in zoom-in duration-300"
            >
              <li className="mb-3">
                <Link
                  href="/lostFound"
                  className="flex items-center gap-4 p-4 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-bold rounded-2xl transition-all group border border-indigo-100/50"
                >
                  <div className="bg-indigo-100 p-2.5 rounded-xl group-hover:bg-indigo-200 transition-colors shadow-sm">
                    <Search size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] leading-tight font-black">
                      হারিয়ে যাওয়া / পাওয়া
                    </span>
                    <span className="text-[10px] font-bold text-indigo-400 mt-1 uppercase tracking-wider">
                      Public Records
                    </span>
                  </div>
                </Link>
              </li>

              <div className="h-px bg-slate-100 w-full mb-3" />

              <li>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-4 p-4 bg-rose-50/50 hover:bg-rose-50 text-rose-600 font-bold rounded-2xl transition-all group w-full border border-rose-100/50"
                >
                  <div className="bg-rose-100 p-2.5 rounded-xl group-hover:bg-rose-200 transition-colors shadow-sm">
                    <ShieldAlert size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[14px] leading-tight font-black">
                      অভিযোগ জানান
                    </span>
                    <span className="text-[10px] font-bold text-rose-400 mt-1 uppercase tracking-wider">
                      Report Issue
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
      <ComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
