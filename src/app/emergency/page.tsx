"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Flame,
  Ambulance,
  Zap,
  Search,
  AlertTriangle,
  Users,
} from "lucide-react";

// আপনার দেওয়া তথ্য অনুযায়ী আপডেট করা কন্টাক্ট লিস্ট
const emergencyContacts = [
  {
    category: "লয়াপাড়ার প্রধান প্রতিনিধি",
    icon: <Users className="text-primary" size={32} />,
    color: "bg-green-50 border-green-300 shadow-md", // এই কার্ডটি একটু বেশি হাইলাইট করা হয়েছে
    contacts: [
      { name: "তানভীর হাসান (শুভ)", number: "+8801796255213" },
      { name: "আব্দুল কাদের", number: "+8801568559443" },
    ],
    note: "লয়াপাড়ার যেকোনো সুবিধা-অসুবিধা বা পরামর্শের জন্য সরাসরি কল করুন।",
  },
  {
    category: "জাতীয় জরুরি সেবা",
    icon: <AlertTriangle className="text-red-500" size={32} />,
    color: "bg-red-50 border-red-200",
    contacts: [{ name: "জরুরি পুলিশ, ফায়ার ও অ্যাম্বুলেন্স", number: "999" }],
  },
  {
    category: "ফায়ার সার্ভিস",
    icon: <Flame className="text-orange-500" size={32} />,
    color: "bg-orange-50 border-orange-200",
    contacts: [{ name: "জেলা ফায়ার স্টেশন", number: "01730-002497" }],
  },
  {
    category: "পল্লী বিদ্যুৎ",
    icon: <Zap className="text-yellow-600" size={32} />,
    color: "bg-yellow-50 border-yellow-200",
    contacts: [
      { name: "বিদ্যুৎ অভিযোগ কেন্দ্র (মোকামতলা)", number: "01769-400899" },
    ],
  },
];

export default function EmergencyPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // সার্চ ফিল্টার লজিক
  const filteredContacts = emergencyContacts
    .map((section) => ({
      ...section,
      contacts: section.contacts.filter(
        (contact) =>
          contact.name.includes(searchTerm) ||
          contact.number.includes(searchTerm),
      ),
    }))
    .filter((section) => section.contacts.length > 0);

  return (
    <main className="min-h-screen bg-[#fcfdfa] text-slate-800 pb-20">
      {/* হিরো সেকশন */}
      <section className="text-white pt-12 pb-24 px-4 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/loyapara (3).JPG"
            alt="Loyapara"
            className="w-full h-full object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-950/70" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Phone size={40} className="animate-pulse" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            জরুরি যোগাযোগ
          </h1>
          <p className="text-slate-200 text-lg mb-8 max-w-xl mx-auto font-medium">
            বিপদের মুহূর্তে বা গ্রামের যেকোনো প্রয়োজনে দ্রুত যোগাযোগের জন্য
            গুরুত্বপূর্ণ নম্বরসমূহ। এক ক্লিকেই সরাসরি কল করুন।
          </p>

          {/* সার্চ বার */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="নাম বা নম্বর লিখে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 font-medium text-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-slate-500 bg-white/70 backdrop-blur-md"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              size={24}
            />
          </div>
        </div>
      </section>

      {/* কন্টাক্ট গ্রিড */}
      <section className="container mx-auto px-4 max-w-6xl -mt-12 relative z-20">
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-3xl p-6 border-2 ${section.color} hover:shadow-lg transition-shadow duration-300 relative overflow-hidden`}
              >
                {/* কার্ডের ভেতরে হালকা ব্যাকগ্রাউন্ড আইকন */}
                <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                  {section.icon}
                </div>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">
                    {section.category}
                  </h2>
                </div>

                {/* যদি কোনো নোট থাকে (যেমন আপনাদের সেকশনে) */}
                {section.note && (
                  <p className="text-xs font-bold text-primary mb-4 bg-green-50 p-2 rounded-lg border border-green-100">
                    {section.note}
                  </p>
                )}

                <div className="space-y-3">
                  {section.contacts.map((contact, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                      <span className="font-bold text-slate-700 text-sm">
                        {contact.name}
                      </span>
                      <a
                        href={`tel:${contact.number}`}
                        className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 whitespace-nowrap shadow-sm"
                      >
                        <Phone size={14} />
                        {contact.number}
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200 mt-12">
            <AlertTriangle size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">
              কোনো তথ্য পাওয়া যায়নি
            </h3>
            <p className="text-slate-500">
              অন্য কোনো নাম বা নম্বর লিখে আবার খুঁজুন।
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
