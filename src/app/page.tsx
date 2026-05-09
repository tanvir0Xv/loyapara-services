"use client";

import CategoryGrid from "@/Components/CategoryGrid/CategoryGrid";
import EmergencyBar from "@/Components/EmergencyBar/EmergencyBar";
import Hero from "@/Components/Hero/Hero";
import Reviews from "@/Components/Reviews/Reviews";
import Steps from "@/Components/Steps/Steps";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />

      {/* Featured Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                label: "সক্রিয় সার্ভিস",
                value: "৫০০+",
                icon: Zap,
                color: "text-blue-500",
              },
              {
                label: "দক্ষ কারিগর",
                value: "২০০+",
                icon: ShieldCheck,
                color: "text-emerald-500",
              },
              {
                label: "এলাকা কভারেজ",
                value: "১০+",
                icon: MapPin,
                color: "text-rose-500",
              },
              {
                label: "সন্তুষ্ট গ্রাহক",
                value: "১০০০+",
                icon: ShieldCheck,
                color: "text-primary",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${stat.color} border border-slate-100`}
                >
                  <stat.icon size={28} />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                    {stat.value}
                  </h3>
                  <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CategoryGrid />

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              কেন লয়াপাড়া সেবা{" "}
              <span className="text-primary">ব্যবহার করবেন?</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              আমরা গ্রামের প্রতিটি মানুষের কাছে ডিজিটাল সেবা পৌঁছে দিতে কাজ করে
              যাচ্ছি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "নির্ভরযোগ্য সার্ভিস",
                desc: "আমাদের প্ল্যাটফর্মে থাকা প্রতিটি কারিগর এবং মিস্ত্রি যাচাইকৃত।",
                icon: "🛡️",
                color: "bg-blue-50",
              },
              {
                title: "দ্রুত যোগাযোগ",
                desc: "সরাসরি ফোন কলের মাধ্যমে মিস্ত্রিদের সাথে কথা বলার সুবিধা।",
                icon: "⚡",
                color: "bg-orange-50",
              },
              {
                title: "সহজ ইন্টারফেস",
                desc: "যে কেউ খুব সহজে ক্যাটাগরি অনুযায়ী তার প্রয়োজনীয় সেবা খুঁজে পাবে।",
                icon: "📱",
                color: "bg-emerald-50",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[40px] ${feature.color} border border-white shadow-sm transition-all`}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Loyapara Section */}
      <section className="py-24 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-widest border border-primary/10">
                <ShieldCheck size={14} />
                আমাদের মিশন
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                লয়াপাড়া গ্রামকে <br />
                <span className="text-primary italic">
                  স্মার্ট গ্রামে রূপান্তর
                </span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                আমাদের লক্ষ্য হলো গ্রামের প্রতিটি মানুষের কাছে ডিজিটাল সেবা
                পৌঁছে দেওয়া। লয়াপাড়ার সকল দক্ষ কারিগর, মিস্ত্রি এবং জরুরি
                সার্ভিসগুলোকে একটি প্ল্যাটফর্মে নিয়ে এসে আমরা জীবনযাত্রাকে আরও
                সহজ করছি।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  "দক্ষ কারিগরদের ডিরেক্টরি",
                  "যাচাইকৃত প্রোফাইল",
                  "সরাসরি কলিং সিস্টেম",
                  "২৪/৭ ইমার্জেন্সি সাপোর্ট",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  আমাদের সম্পর্কে জানুন <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="/loyapara.jpg"
                  alt="Loyapara Village"
                  width={1000}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 flex items-center gap-6"
              >
                <div className="w-16 h-16 rounded-[24px] bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                  <Zap size={32} fill="currentColor" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">১০০%</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    নির্ভরযোগ্য ডিজিটাল সেবা
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <EmergencyBar />
      <Steps />

      <Reviews />
    </div>
  );
}
