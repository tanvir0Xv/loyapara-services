"use client";
import React, { FormEvent, useMemo, useState } from "react";
import { Calendar, Loader2, MapPin, Plus, Search, Send } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

const initialFormState: FormState = {
  title: "",
  location: "",
  date: "",
  description: "",
  image: "",
};

export default function LostFoundPage() {
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [postType, setPostType] = useState<"lost" | "found">("lost");
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    } else {
      alert("ইমেজ আপলোড ব্যর্থ হয়েছে");
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
        throw new Error("পোস্ট করা যায়নি");
      }
      return response.json();
    },
    onSuccess: async () => {
      setIsModalOpen(false);
      setFormData(initialFormState);
      await queryClient.invalidateQueries({ queryKey: ["lostFoundPosts"] });
    },
    onError: () => {
      alert("পোস্ট করা যায়নি");
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createPostMutation.mutateAsync();
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
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-black md:text-6xl">হারানো ও প্রাপ্তি</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base">
          হারানো জিনিসের তথ্য দিন অথবা পাওয়া জিনিসের খোঁজ শেয়ার করুন।
        </p>
      </div>

      <div className="mx-auto -mt-8 max-w-6xl space-y-8 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex rounded-xl bg-slate-100 p-1">
              {["all", "lost", "found"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as "all" | "lost" | "found")}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    filter === tab ? "bg-white text-primary shadow-sm" : "text-slate-500"
                  }`}
                >
                  {tab === "all" ? "সব" : tab === "lost" ? "হারানো" : "প্রাপ্তি"}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
                placeholder="টাইটেল বা লোকেশন দিয়ে সার্চ করুন"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus size={16} /> নতুন পোস্ট
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">লোড হচ্ছে...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article key={post._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="h-44 bg-slate-200">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">No Image</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white bg-slate-700">
                    {post.type.toUpperCase()}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-600">
                    <MapPin size={14} /> {post.location}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                    <Calendar size={14} /> {post.date}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">{post.description || "বিস্তারিত তথ্য নেই।"}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="text-lg font-bold text-slate-900">নতুন Lost/Found পোস্ট</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 p-5">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setPostType("lost")} className={`rounded-lg py-2 text-sm font-semibold ${postType === "lost" ? "bg-rose-500 text-white" : "bg-slate-100"}`}>হারানো</button>
                <button type="button" onClick={() => setPostType("found")} className={`rounded-lg py-2 text-sm font-semibold ${postType === "found" ? "bg-emerald-500 text-white" : "bg-slate-100"}`}>পাওয়া</button>
              </div>
              <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="শিরোনাম" />
              <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="লোকেশন" />
              <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3 text-sm" />
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3 text-sm" rows={3} placeholder="বর্ণনা" />
              <label className="block rounded-xl border border-dashed border-slate-300 p-3 text-center text-sm text-slate-500">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {uploading ? <span className="inline-flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Uploading...</span> : formData.image ? "ছবি যুক্ত হয়েছে" : "ছবি যুক্ত করুন"}
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">পোস্ট করুন <Send size={14} /></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}