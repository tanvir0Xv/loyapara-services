"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { LogIn, Lock, Phone, CheckCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

// লয়াপাড়া গ্রামের আবহের ব্যাকগ্রাউন্ড
const VILLAGE_BG = "/loyapara.jpg";

type LoginValues = {
  phoneNumber: string;
  password: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setErrorMessage(payload.message || "লগইন ব্যর্থ হয়েছে।");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/Dashboard");
      }, 600);
    } catch {
      setErrorMessage("সার্ভার সংযোগে সমস্যা হয়েছে।");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
      {/* ব্যাকগ্রাউন্ড লেয়ার - ব্লার এবং ডার্ক ওভারলে */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/loyapara.jpg" 
          className="w-full h-full object-cover opacity-30 blur-[4px]" 
          alt="Village BG" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/90 to-[#020617]" />
      </motion.div>

      {/* মেইন কার্ড */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* ডেকোরেটিভ গ্লো */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* হেডার সেকশন */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 mb-6 shadow-2xl backdrop-blur-md">
              <ShieldCheck className="text-primary" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              লয়াপাড়া <span className="text-primary italic">সেবা</span>
            </h1>
            <p className="mt-3 text-xs font-bold text-white/40 uppercase tracking-[0.3em]">
              Administrative Portal
            </p>
          </motion.div>

          {/* ফর্ম */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-colors" />
                <Phone
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-all duration-300"
                  size={18}
                />
                <input
                  {...register("phoneNumber", { required: "নম্বর দিন" })}
                  className="relative w-full pl-13 pr-5 py-4.5 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-primary/50 focus:bg-white/[0.05] text-white font-bold placeholder:text-white/20 transition-all"
                  placeholder="ফোন নম্বর"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-primary text-[10px] font-bold ml-4 uppercase tracking-wider">
                  {errors.phoneNumber.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-colors" />
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-all duration-300"
                  size={18}
                />
                <input
                  {...register("password", { required: "পাসওয়ার্ড দিন" })}
                  type="password"
                  className="relative w-full pl-13 pr-5 py-4.5 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-primary/50 focus:bg-white/[0.05] text-white font-bold placeholder:text-white/20 transition-all"
                  placeholder="পাসওয়ার্ড"
                />
              </div>
              {errors.password && (
                <p className="text-primary text-[10px] font-bold ml-4 uppercase tracking-wider">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* লগইন বাটন */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 shadow-2xl ${
                isSuccess
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-primary text-white hover:brightness-110 shadow-primary/40 hover:shadow-primary/60"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSuccess ? (
                <>
                  সফল হয়েছে <CheckCircle size={20} className="animate-bounce" />
                </>
              ) : (
                <>
                  প্রবেশ করুন{" "}
                  <LogIn
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </motion.button>

            {errorMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[10px] font-black uppercase tracking-wider text-rose-400 mt-4 bg-rose-400/10 py-2 rounded-lg"
              >
                {errorMessage}
              </motion.p>
            )}
          </form>

          {/* সিম্পল ফুটার */}
          <div className="mt-12 text-center">
            <p className="text-white/10 text-[9px] font-black tracking-[4px] uppercase">
              Loyapara • Trusted Village Services
            </p>
          </div>
        </div>
      </motion.div>

      {/* ভাসমান ডেকোরেশন */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]"
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
