"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="relative">
          <h1 className="text-9xl font-black text-slate-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white px-8 py-2 rounded-full shadow-xl border border-slate-100"
            >
              <span className="text-2xl font-black text-slate-800">
                পৃষ্ঠাটি পাওয়া যায়নি
              </span>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 space-y-4">
          <p className="text-slate-500 text-lg">
            দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি আর নেই বা移動 করা হয়েছে।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200"
            >
              <ArrowLeft size={18} />
              পেছনে যান
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110"
            >
              <Home size={18} />
              হোম পেজে যান
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
