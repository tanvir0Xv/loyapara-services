"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  Wrench,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Camera,
  Award,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// সার্ভিস ক্যাটাগরির লিস্ট
const categories = [
  "রাজমিস্ত্রি",
  "ওয়েল্ডিং মিস্ত্রি",
  "পাইপ ফিটিং (প্লাম্বার)",
  "গরুর ডাক্তার (পশু চিকিৎসক)",
  "মাস্টার / গৃহশিক্ষক",
  "হোমিও ডাক্তার",
  "ভ্যান ও অটো সার্ভিস",
  "ইলেকট্রিশিয়ান",
  "ইলেকট্রনিক্স মেকার",
  "মোটরসাইকেল মেকার",
  "মেশিন ও হালের মেকার",
  "ভ্যান ও সাইকেল মেকার",
  "খেজুরের রস",
  "কৃষি শ্রমিক",
  "কৃষক / কৃষি উদ্যোক্তা",
  "দর্জি / টেইলার্স",
];

// ক্যাটাগরি অনুযায়ী ডাইনামিক ফিল্ড ম্যাপ
const categoryFields: Record<string, any[]> = {
  রাজমিস্ত্রি: [
    { name: "isHead", label: "তিনি কি হেড মিস্ত্রি?", type: "checkbox" },
    { name: "isLebar", label: "তিনি কি হেল্পার/লেবার?", type: "checkbox" },
  ],
  "ওয়েল্ডিং মিস্ত্রি": [
    {
      name: "workshopName",
      label: "ওয়ার্কশপের নাম",
      type: "text",
      placeholder: "যেমন: লয়াপাড়া ওয়েল্ডিং",
    },
    {
      name: "hasPortableMachine",
      label: "পোর্টেবল মেশিন আছে?",
      type: "checkbox",
    },
    { name: "isSteelExpert", label: "স্টিল কাজের বিশেষজ্ঞ?", type: "checkbox" },
    {
      name: "callTime",
      label: "কল করার সময়",
      type: "text",
      placeholder: "যেমন: সকাল ৯টা - রাত ৮টা",
    },
  ],
  "পাইপ ফিটিং (প্লাম্বার)": [
    {
      name: "serviceType",
      label: "সার্ভিস টাইপ (যেমন: স্যানিটারি, মোটর)",
      type: "text",
      placeholder: "যেমন: স্যানিটারি ও মোটর মেরামত",
    },
    {
      name: "hasModernTools",
      label: "আধুনিক যন্ত্রপাতি আছে?",
      type: "checkbox",
    },
    {
      name: "isHomeVisit",
      label: "বাড়িতে গিয়ে সার্ভিস দেন?",
      type: "checkbox",
    },
    { name: "callTime", label: "কল করার সময়", type: "text" },
  ],
  "গরুর ডাক্তার (পশু চিকিৎসক)": [
    {
      name: "qualification",
      label: "শিক্ষাগত যোগ্যতা/প্রশিক্ষণ",
      type: "text",
      placeholder: "যেমন: এলএসপি (LSP) প্রশিক্ষণ প্রাপ্ত",
    },
    {
      name: "serviceType",
      label: "সার্ভিস টাইপ (যেমন: বাসায় গিয়ে দেখা)",
      type: "text",
    },
    { name: "callTime", label: "কল করার সময়", type: "text" },
    { name: "emergencyService", label: "জরুরি সেবা দেন?", type: "checkbox" },
    { name: "hasVaccine", label: "ভ্যাকসিন আছে?", type: "checkbox" },
  ],
  "মাস্টার / গৃহশিক্ষক": [
    {
      name: "education",
      label: "শিক্ষাগত যোগ্যতা",
      type: "text",
      placeholder: "যেমন: বিএসসি (অনার্স) ইন ম্যাথ",
    },
    {
      name: "targetClass",
      label: "কোন ক্লাসের স্টুডেন্ট পড়ান",
      type: "text",
      placeholder: "যেমন: ৬ষ্ঠ থেকে ১০ম শ্রেণী",
    },
    {
      name: "teachingMethod",
      label: "পড়ানোর পদ্ধতি (যেমন: বাসায় গিয়ে/ব্যাচে)",
      type: "text",
    },
    { name: "availableTime", label: "পড়ানোর সময়", type: "text" },
    {
      name: "hasSmallBatch",
      label: "ছোট ব্যাচে পড়ানোর সুবিধা আছে?",
      type: "checkbox",
    },
  ],
  "হোমিও ডাক্তার": [
    { name: "degree", label: "ডিগ্রি (যেমন: DHMS)", type: "text" },
    { name: "chamberTime", label: "চেম্বারে বসার সময়", type: "text" },
    { name: "offDay", label: "বন্ধের দিন", type: "text" },
    { name: "visitFee", label: "ভিজিট ফি", type: "text" },
    { name: "hasMedicine", label: "সরাসরি ঔষধ পাওয়া যায়?", type: "checkbox" },
  ],
  "ভ্যান ও অটো সার্ভিস": [
    {
      name: "vehicleType",
      label: "যানবাহনের ধরণ",
      type: "text",
      placeholder: "যেমন: ব্যাটারি চালিত অটো ভ্যান",
    },
    {
      name: "capacity",
      label: "যাত্রী/মাল বহনের ক্ষমতা",
      type: "text",
      placeholder: "যেমন: ৬ জন যাত্রী / ১০ মন মাল",
    },
    {
      name: "availability",
      label: "সময়কাল (যেমন: ভোর ৬টা - রাত ১০টা)",
      type: "text",
    },
    {
      name: "isEmergencyCall",
      label: "জরুরি প্রয়োজনে পাওয়া যাবে?",
      type: "checkbox",
    },
  ],
  ইলেকট্রিশিয়ান: [
    {
      name: "serviceType",
      label: "সার্ভিস টাইপ (যেমন: হাউজ ওয়ারিং, মোটর)",
      type: "text",
    },
    { name: "callTime", label: "কল করার সময়", type: "text" },
    { name: "emergencyService", label: "জরুরি সেবা দেন?", type: "checkbox" },
    { name: "hasTools", label: "নিজস্ব যন্ত্রপাতি আছে?", type: "checkbox" },
  ],
  "ইলেকট্রনিক্স মেকার": [
    { name: "shopName", label: "দোকানের নাম", type: "text" },
    { name: "businessHours", label: "দোকান খোলা রাখার সময়", type: "text" },
    {
      name: "isHomeCollection",
      label: "বাসা থেকে মালামাল সংগ্রহ করেন?",
      type: "checkbox",
    },
    { name: "hasWarranty", label: "কাজের ওয়ারেন্টি দেন?", type: "checkbox" },
  ],
  "মোটরসাইকেল মেকার": [
    { name: "shopName", label: "দোকানের নাম", type: "text" },
    { name: "businessHours", label: "দোকান খোলা রাখার সময়", type: "text" },
    {
      name: "hasSpareParts",
      label: "দোকানে স্পেয়ার পার্টস পাওয়া যায়?",
      type: "checkbox",
    },
    {
      name: "isEmergencyOnRoad",
      label: "রাস্তায় গিয়ে সার্ভিস দেন?",
      type: "checkbox",
    },
  ],
  "মেশিন ও হালের মেকার": [
    {
      name: "serviceArea",
      label: "সার্ভিস এরিয়া (যেমন: মাঠে/দোকানে)",
      type: "text",
    },
    { name: "callTime", label: "কল করার সময়", type: "text" },
    {
      name: "hasSpareParts",
      label: "শ্যালো/টিলারের পার্টস পাওয়া যায়?",
      type: "checkbox",
    },
    {
      name: "emergencyCall",
      label: "জরুরি প্রয়োজনে পাওয়া যাবে?",
      type: "checkbox",
    },
  ],
  "ভ্যান ও সাইকেল মেকার": [
    { name: "businessHours", label: "কাজের সময়কাল", type: "text" },
    {
      name: "hasWorkshop",
      label: "নিজস্ব দোকান বা গ্যারেজ আছে?",
      type: "checkbox",
    },
    {
      name: "onRoadService",
      label: "রাস্তায় গিয়ে ঠিক করেন?",
      type: "checkbox",
    },
  ],
  "খেজুরের রস": [
    { name: "pricePerLitre", label: "প্রতি লিটারের দাম", type: "text" },
    { name: "collectionTime", label: "রস সংগ্রহের সময়", type: "text" },
    { name: "isHomeDelivery", label: "হোম ডেলিভারি দেন?", type: "checkbox" },
    { name: "hasGur", label: "গুড় পাওয়া যায়?", type: "checkbox" },
  ],
  "কৃষি শ্রমিক": [
    {
      name: "speciality",
      label: "বিশেষ দক্ষতা (কমা দিয়ে লিখুন)",
      type: "text",
      placeholder: "যেমন: ধান কাটা, জমি নিড়ানো, বীজ বপন",
    },
    {
      name: "dailyWage",
      label: "দৈনিক মজুরি",
      type: "text",
      placeholder: "যেমন: ৫০০ টাকা (আলোচনা সাপেক্ষে)",
    },
    {
      name: "groupSize",
      label: "দলের সদস্য সংখ্যা (যেমন: ১-২ জন)",
      type: "text",
    },
    { name: "workType", label: "কাজের ধরণ (যেমন: একক/দলগত)", type: "text" },
    { name: "hasTools", label: "নিজস্ব কাঁচি বা কোদাল আছে?", type: "checkbox" },
  ],
  "কৃষক / কৃষি উদ্যোক্তা": [
    {
      name: "speciality",
      label: "বিশেষ দক্ষতা (কমা দিয়ে লিখুন)",
      type: "text",
      placeholder: "যেমন: উন্নত জাতের বীজ সরবরাহ, সবজি চাষ পরামর্শ",
    },
    {
      name: "produces",
      label: "কি কি ফসল উৎপাদন করেন",
      type: "text",
      placeholder: "যেমন: উন্নত মানের ধান, আলু, সরিষা",
    },
    {
      name: "hasMachinery",
      label: "নিজস্ব কৃষি যন্ত্রপাতি আছে?",
      type: "checkbox",
    },
    { name: "isExpert", label: "পরামর্শ দেওয়ার দক্ষতা আছে?", type: "checkbox" },
    { name: "bulkSale", label: "পাইকারি বিক্রয় করেন?", type: "checkbox" },
  ],
  "দর্জি / টেইলার্স": [
    {
      name: "deliveryTime",
      label: "ডেলিভারি সময় (যেমন: ৩-৫ দিন)",
      type: "text",
    },
    { name: "orderTime", label: "অর্ডার নেওয়ার সময়", type: "text" },
    { name: "isHomeService", label: "বাড়িতে গিয়ে মাপ নেন?", type: "checkbox" },
    {
      name: "isExpertInDesign",
      label: "আধুনিক ডিজাইন বা নকশী কাজে দক্ষ?",
      type: "checkbox",
    },
  ],
};

type FormValues = {
  name: string;
  nickName: string;
  phone: string;
  category: string;
  location: string;
  experience: number;
  speciality: string;
  details: string;
  image: FileList;
  [key: string]: any; // ডাইনামিক ফিল্ডের জন্য
};

export default function AddServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // ১. সেশন চেক করার লজিক
  const { data: authOk = false, isLoading: authLoading } = useQuery({
    queryKey: ["authMe"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      return response.ok;
    },
  });

  useEffect(() => {
    if (!authLoading && !authOk) {
      router.push("/login");
    }
  }, [authLoading, authOk, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>();
  const selectedCategory = watch("category");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="font-bold text-slate-500 animate-pulse">
            অনুমতি যাচাই করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!authOk) return null;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // ১. ছবি আপলোড লজিক (ImgBB)
      let uploadedUrl = "";
      if (data.image[0]) {
        const imageFormData = new FormData();
        imageFormData.append("image", data.image[0]);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: imageFormData,
          },
        );
        const result = await response.json();
        if (result.success) {
          uploadedUrl = result.data.url;
        }
      }

      // ২. ফিল্ড প্রসেসিং (String to Array conversion for specific fields)
      const arrayFields = [
        "produces",
        "serviceType",
        "workType",
        "serviceArea",
        "partsAvailable",
        "teachingMethod",
        "speciality",
      ];
      const processedData = { ...data };

      arrayFields.forEach((field) => {
        if (processedData[field] && typeof processedData[field] === "string") {
          processedData[field] = processedData[field]
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s !== "");
        }
      });

      // ৩. ফাইনাল ডাটা অবজেক্ট
      const finalPayload = {
        ...processedData,
        profileImage: uploadedUrl,
        isVerified: false,
        rating: 5,
        status: "Available",
        experience: String(data.experience), // অনেক মডেল এ experience string হিসেবে আছে
      };

      console.log("Submitting Data:", finalPayload);

      // ৪. API কল
      const apiResponse = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!apiResponse.ok) {
        throw new Error("API call failed");
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error(error);
      alert("দুঃখিত, তথ্য জমা দিতে সমস্যা হয়েছে।");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfdfa] text-slate-800 py-12 px-4 relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-green-100/50 to-transparent -z-10" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellow-100/30 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* বাম দিকের টেক্সট ও ইনফো সেকশন */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8 pt-8"
          >
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 rounded-full border border-green-200 bg-green-50 text-[12px] font-bold tracking-[0.2em] uppercase text-green-700">
                নতুন সদস্য যোগ করুন
              </span>
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-slate-900 mb-4 tracking-tight">
                আপনার সেবাকে <br />
                <span className="text-primary">সবার কাছে</span> পৌঁছে দিন
              </h1>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                লয়াপাড়া সেবায় যুক্ত হয়ে আপনার কাজ বা ব্যবসাকে পৌঁছে দিন পুরো
                গ্রামের মানুষের কাছে।
              </p>
            </div>

            <div className="space-y-6 bg-white p-8 rounded-3xl border border-green-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                কীভাবে যুক্ত হবেন?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    সঠিক নাম, ছবি ও অভিজ্ঞতা প্রদান করুন।
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-full text-orange-600 mt-1">
                    <AlertCircle size={16} />
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    এডমিন প্যানেল থেকে যাচাইয়ের পর আপনার নাম লিস্টে যোগ হবে।
                  </p>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* ডান দিকের ফর্ম সেকশন */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-[40px] shadow-2xl shadow-green-900/5 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-4">
                    ধন্যবাদ!
                  </h2>
                  <p className="text-slate-600 text-lg font-medium mb-8 max-w-sm">
                    আপনার তথ্য সফলভাবে জমা হয়েছে।
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn btn-primary rounded-xl px-8 text-white font-bold"
                  >
                    আরেকটি যোগ করুন
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* নাম ও ডাকনাম */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          {...register("name", {
                            required: "আপনার নাম প্রয়োজন",
                          })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium"
                          placeholder="রহিম মিয়া"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 ml-2">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        ডাকনাম <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          {...register("nickName", {
                            required: "ডাকনাম প্রয়োজন",
                          })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium"
                          placeholder="রহিম"
                        />
                      </div>
                      {errors.nickName && (
                        <p className="text-red-500 text-xs mt-1 ml-2">
                          {errors.nickName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* মোবাইল */}
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        {...register("phone", {
                          required: "মোবাইল নম্বর দিতে হবে",
                          pattern: {
                            value: /^01[3-9]\d{8}$/,
                            message: "সঠিক নম্বর দিন",
                          },
                        })}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary outline-none font-medium"
                        placeholder="017XXXXXXXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 ml-2">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ক্যাটাগরি */}
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        পেশা বা সার্ভিস <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Wrench
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <select
                          {...register("category", {
                            required: "ক্যাটাগরি বেছে নিন",
                          })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-medium appearance-none"
                        >
                          <option value="">নির্বাচন করুন</option>
                          {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1 ml-2">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* অভিজ্ঞতা (Number Input) */}
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        অভিজ্ঞতা (বছর) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Award
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="number"
                          {...register("experience", {
                            required: "অভিজ্ঞতা লিখুন",
                            min: 0,
                          })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-medium"
                          placeholder="যেমন: ৫"
                        />
                      </div>
                      {errors.experience && (
                        <p className="text-red-500 text-xs mt-1 ml-2">
                          {errors.experience.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ডাইনামিক ক্যাটাগরি ফিল্ডস */}
                  <AnimatePresence mode="wait">
                    {selectedCategory && categoryFields[selectedCategory] && (
                      <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-2"
                      >
                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <Wrench size={16} />
                            <span className="text-xs font-black uppercase tracking-wider">
                              {selectedCategory} এর জন্য অতিরিক্ত তথ্য
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryFields[selectedCategory].map((field) => (
                              <div
                                key={field.name}
                                className={
                                  field.type === "checkbox"
                                    ? "flex items-center gap-3 py-2"
                                    : "space-y-1"
                                }
                              >
                                {field.type === "checkbox" ? (
                                  <>
                                    <input
                                      type="checkbox"
                                      {...register(field.name)}
                                      className="checkbox checkbox-primary rounded-lg"
                                    />
                                    <label className="text-sm font-bold text-slate-700">
                                      {field.label}
                                    </label>
                                  </>
                                ) : (
                                  <>
                                    <label className="text-xs font-bold text-slate-500 ml-1">
                                      {field.label}
                                    </label>
                                    <input
                                      type={field.type}
                                      {...register(field.name)}
                                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-medium text-sm"
                                      placeholder={field.placeholder || ""}
                                    />
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ঠিকানা ও বিশেষ দক্ষতা */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        ঠিকানা (পাড়া/মোড়){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          {...register("location", {
                            required: "ঠিকানা প্রয়োজন",
                          })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary outline-none font-medium"
                          placeholder="লয়াপাড়া পূর্ব পাড়া"
                        />
                      </div>
                      {errors.location && (
                        <p className="text-red-500 text-xs mt-1 ml-2">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        বিশেষ দক্ষতা (কমা দিয়ে){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Sparkles
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          {...register("speciality", {
                            required: "অন্তত একটি দক্ষতা লিখুন",
                          })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary outline-none font-medium"
                          placeholder="যেমন: টাইলস কাজ, প্লাস্টার"
                        />
                      </div>
                      {errors.speciality && (
                        <p className="text-red-500 text-xs mt-1 ml-2">
                          {errors.speciality.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ইমেজ আপলোড */}
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      আপনার ছবি <span className="text-red-500">*</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all relative overflow-hidden group">
                      {watch("image") && watch("image")[0] ? (
                        <div className="flex flex-col items-center justify-center p-2 text-center">
                          <CheckCircle2
                            className="text-emerald-500 mb-1"
                            size={24}
                          />
                          <p className="text-[10px] font-bold text-emerald-600 truncate max-w-[200px]">
                            {watch("image")[0].name}
                          </p>
                          <p className="text-[8px] text-slate-400 mt-1 uppercase">
                            Click to change
                          </p>
                        </div>
                      ) : (
                        <>
                          <Camera
                            className="text-slate-400 mb-1 group-hover:scale-110 transition-transform"
                            size={24}
                          />
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                            ছবি সিলেক্ট করুন
                          </p>
                        </>
                      )}
                      <input
                        {...register("image", { required: "একটি ছবি দিন" })}
                        type="file"
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    {errors.image && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  {/* বিস্তারিত মন্তব্য */}
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      বিস্তারিত মন্তব্য (ঐচ্ছিক)
                    </label>
                    <div className="relative">
                      <FileText
                        size={18}
                        className="absolute top-4 left-4 text-slate-400"
                      />
                      <textarea
                        {...register("details")}
                        rows={2}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary resize-none font-medium"
                        placeholder="আপনার কাজ সম্পর্কে কিছু লিখুন..."
                      />
                    </div>
                  </div>

                  {/* সাবমিট বাটন */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-primary text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        তথ্য জমা দিন <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
