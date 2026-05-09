"use client";
import React, { FormEvent, useMemo, useState } from "react";
import {
  Calendar,
  Loader2,
  MapPin,
  Plus,
  Search,
  Send,
  CheckCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type LostFoundPost = {
  _id: string;
  type: "lost" | "found";
  title: string;
  location: string;
  date: string;
  description?: string;
  image?: string;
  status?: "active" | "claimed";
};

type FormState = {
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
};

type ClaimFormState = {
  claimerName: string;
  claimerPhone: string;
  claimerAddress: string;
  claimDetails: string;
  proofText: string;
};

const initialFormState: FormState = {
  title: "",
  location: "",
  date: "",
  description: "",
  image: "",
};

const initialClaimFormState: ClaimFormState = {
  claimerName: "",
  claimerPhone: "",
  claimerAddress: "",
  claimDetails: "",
  proofText: "",
};

export default function LostFoundPage() {
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [postType, setPostType] = useState<"lost" | "found">("lost");
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimFormData, setClaimFormData] = useState<ClaimFormState>(
    initialClaimFormState,
  );
  const [selectedPost, setSelectedPost] = useState<LostFoundPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ["lostFoundPosts"],
    queryFn: async () => {
      const response = await fetch("/api/lostFound", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load lost and found posts.");
      }
      const payload = (await response.json()) as { data: LostFoundPost[] };
      return payload.data || [];
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: data,
    });
    if (response.ok) {
      const payload = (await response.json()) as { imageUrl: string };
      setFormData((prev) => ({ ...prev, image: payload.imageUrl }));
      toast.success("Image uploaded successfully!");
    } else {
      toast.error("ইমেজ আপলোড ব্যর্থ হয়েছে");
    }
    setUploading(false);
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/lostFound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: postType }),
      });
      if (!response.ok) {
        throw new Error("পোস্ট করা যায়নি");
      }
      return response.json();
    },
    onSuccess: async () => {
      setIsModalOpen(false);
      setFormData(initialFormState);
      await queryClient.invalidateQueries({ queryKey: ["lostFoundPosts"] });
      toast.success("পোস্ট সফলভাবে তৈরি হয়েছে!");
    },
    onError: () => {
      toast.error("পোস্ট করা যায়নি");
    },
  });

  const submitClaimMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPost) throw new Error("No post selected");

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: selectedPost._id,
          ...claimFormData,
        }),
      });
      if (!response.ok) {
        throw new Error("ক্লেম করা যায়নি");
      }
      return response.json();
    },
    onSuccess: async () => {
      setIsClaimModalOpen(false);
      setClaimFormData(initialClaimFormState);
      setSelectedPost(null);
      toast.success("আপনার ক্লেম সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই করবেন।");
    },
    onError: () => {
      toast.error("ক্লেম জমা দেয়া যায়নি");
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createPostMutation.mutateAsync();
  };

  const handleClaimSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitClaimMutation.mutateAsync();
  };

  const openClaimModal = (post: LostFoundPost) => {
    setSelectedPost(post);
    setIsClaimModalOpen(true);
  };

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesFilter = filter === "all" || post.type === filter;
        const search = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !search ||
          post.title.toLowerCase().includes(search) ||
          post.location.toLowerCase().includes(search);
        return matchesFilter && matchesSearch;
      }),
    [posts, filter, searchQuery],
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="relative h-80 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/loyapara (3).JPG')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 text-center text-white">
          <h1 className="text-4xl font-black md:text-6xl lg:text-7xl">
            হারানো ও প্রাপ্তি
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm text-white/80 md:text-base lg:text-lg">
            হারানো জিনিসের তথ্য দিন অথবা পাওয়া জিনিসের খোঁজ শেয়ার করুন।
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-6xl space-y-8 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex rounded-xl bg-slate-100 p-1.5">
              {["all", "lost", "found"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`flex-1 rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
                    filter === tab
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab === "all" ? "সব" : tab === "lost" ? "হারানো" : "প্রাপ্ত"}
                </button>
              ))}
            </div>

            <div className="flex-1 relative max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="আইটেম বা লোকেশন দিয়ে খুঁজুন..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:brightness-110"
            >
              <Plus size={20} />
              নতুন পোস্ট
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 font-bold text-slate-500">লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Search size={40} />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">
                  কোনো পোস্ট পাওয়া যায়নি
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  নতুন পোস্ট তৈরি করে শুরু করুন।
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className={`group flex flex-col overflow-hidden rounded-3xl border ${
                    post.status === "claimed"
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-slate-200 bg-white"
                  } shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="relative h-52 w-full bg-slate-100">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Search size={48} className="text-slate-300" />
                      </div>
                    )}
                    <div
                      className={`absolute left-4 top-4 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider ${
                        post.type === "lost"
                          ? "bg-rose-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {post.type === "lost" ? "হারানো" : "প্রাপ্ত"}
                    </div>
                    {post.status === "claimed" && (
                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                        <CheckCircle size={12} />
                        Claimed
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="line-clamp-2 text-xl font-black text-slate-900">
                      {post.title}
                    </h3>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin
                        size={16}
                        className="flex-shrink-0 text-primary"
                      />
                      <span className="line-clamp-1 font-bold">
                        {post.location}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <Calendar size={16} className="flex-shrink-0" />
                      <span>
                        {new Date(post.date).toLocaleDateString("bn-BD")}
                      </span>
                    </div>

                    {post.description && (
                      <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                        {post.description}
                      </p>
                    )}

                    <div className="mt-auto pt-6">
                      {post.status === "active" ? (
                        <button
                          onClick={() => openClaimModal(post)}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:brightness-110"
                        >
                          <Send size={18} />
                          Claim করুন
                        </button>
                      ) : (
                        <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-200">
                          <CheckCircle size={18} />
                          Claimed হয়েছে
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  নতুন পোস্ট
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  নিচের ফর্মটি পূরণ করুন
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setPostType("lost")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                  postType === "lost"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                হারানো
              </button>
              <button
                onClick={() => setPostType("found")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                  postType === "found"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                প্রাপ্ত
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  আইটেমের নাম
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="যেমন: ব্ল্যাক রঙের ওয়ালেট"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  লোকেশন
                </label>
                <input
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="যেমন: লয়াপাড়া বাজার"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  তারিখ
                </label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  ছবি (ঐচ্ছিক)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:brightness-110"
                />
                {uploading && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    আপলোড হচ্ছে...
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  বিস্তারিত (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="আইটেম সম্পর্কে বিস্তারিত লিখুন..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={createPostMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {createPostMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  পোস্ট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isClaimModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Claim করুন
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  নিচের ফর্মটি পূরণ করুন
                </p>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    selectedPost.type === "lost"
                      ? "bg-rose-100 text-rose-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {selectedPost.type === "lost" ? (
                    <Search size={24} />
                  ) : (
                    <CheckCircle size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-400">
                    Claiming for:
                  </p>
                  <p className="font-black text-slate-900">
                    {selectedPost.title}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  আপনার নাম
                </label>
                <input
                  required
                  value={claimFormData.claimerName}
                  onChange={(e) =>
                    setClaimFormData({
                      ...claimFormData,
                      claimerName: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  ফোন নম্বর
                </label>
                <input
                  required
                  value={claimFormData.claimerPhone}
                  onChange={(e) =>
                    setClaimFormData({
                      ...claimFormData,
                      claimerPhone: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  ঠিকানা
                </label>
                <input
                  required
                  value={claimFormData.claimerAddress}
                  onChange={(e) =>
                    setClaimFormData({
                      ...claimFormData,
                      claimerAddress: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="আপনার ঠিকানা"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  Claim Details
                </label>
                <textarea
                  required
                  value={claimFormData.claimDetails}
                  onChange={(e) =>
                    setClaimFormData({
                      ...claimFormData,
                      claimDetails: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="কেন এটি আপনার জিনিস তা বিস্তারিত লিখুন..."
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  প্রমাণ (ঐচ্ছিক)
                </label>
                <textarea
                  value={claimFormData.proofText}
                  onChange={(e) =>
                    setClaimFormData({
                      ...claimFormData,
                      proofText: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4"
                  placeholder="যেকোনো প্রমাণ বা রেফারেন্স..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitClaimMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {submitClaimMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  Claim জমা করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
