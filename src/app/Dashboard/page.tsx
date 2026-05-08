"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Filter,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldAlert,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Complaint = {
  _id: string;
  accusedName: string;
  complaintType: string;
  message: string;
};

type LostFoundItem = {
  _id: string;
  title: string;
  location: string;
  type: "lost" | "found";
  date: string;
  description?: string;
  status?: "active" | "claimed";
};

type ActiveTab = "complaints" | "lostfound";

const statusPillClass: Record<string, string> = {
  lost: "bg-rose-100 text-rose-700",
  found: "bg-sky-100 text-sky-700",
  active: "bg-amber-100 text-amber-700",
  claimed: "bg-emerald-100 text-emerald-700",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("complaints");
  const [query, setQuery] = useState("");
  const [editComplain, setEditComplain] = useState<Complaint | null>(null);
  const [editLostFound, setEditLostFound] = useState<LostFoundItem | null>(
    null,
  );
  const [viewComplain, setViewComplain] = useState<Complaint | null>(null);
  const [viewLostFound, setViewLostFound] = useState<LostFoundItem | null>(
    null,
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: authOk = false, isLoading: authLoading } = useQuery({
    queryKey: ["authMe"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      return response.ok;
    },
  });

  const {
    data: complaints = [],
    isLoading: complaintsLoading,
    isError: complaintsError,
  } = useQuery({
    queryKey: ["complaints"],
    enabled: authOk,
    queryFn: async () => {
      const response = await fetch("/api/complain", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load complaints.");
      const payload = (await response.json()) as { data: Complaint[] };
      return payload.data || [];
    },
  });

  const {
    data: lostFoundItems = [],
    isLoading: lostLoading,
    isError: lostError,
  } = useQuery({
    queryKey: ["lostFoundPosts"],
    enabled: authOk,
    queryFn: async () => {
      const response = await fetch("/api/lostFound", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load lost/found data.");
      const payload = (await response.json()) as { data: LostFoundItem[] };
      return payload.data || [];
    },
  });

  const loading = authLoading || complaintsLoading || lostLoading;
  const errorMessage =
    complaintsError || lostError ? "Failed to load dashboard data." : "";

  useEffect(() => {
    if (!authLoading && !authOk) {
      router.push("/login");
    }
  }, [authLoading, authOk, router]);

  const totalComplaints = complaints.length;
  const activeLostItems = lostFoundItems.filter(
    (item) => item.status === "active",
  ).length;
  const claimedItems = lostFoundItems.filter(
    (item) => item.status === "claimed",
  ).length;

  const filteredComplaints = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return complaints;
    }
    return complaints.filter(
      (item) =>
        item.accusedName.toLowerCase().includes(search) ||
        item.complaintType.toLowerCase().includes(search) ||
        item.message.toLowerCase().includes(search),
    );
  }, [query, complaints]);

  const filteredLostFound = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return lostFoundItems;
    }
    return lostFoundItems.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search) ||
        item.type.toLowerCase().includes(search) ||
        (item.status || "").toLowerCase().includes(search),
    );
  }, [query, lostFoundItems]);

  const deleteComplainMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/complain/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });

  const deleteComplain = async (id: string) => {
    if (!confirm("এই অভিযোগটি ডিলিট করতে চান?")) return;
    try {
      await deleteComplainMutation.mutateAsync(id);
    } catch {
      alert("Delete failed");
    }
  };

  const deleteLostFoundMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/lostFound/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lostFoundPosts"] });
    },
  });

  const deleteLostFound = async (id: string) => {
    if (!confirm("এই Lost/Found পোস্টটি ডিলিট করতে চান?")) return;
    try {
      await deleteLostFoundMutation.mutateAsync(id);
    } catch {
      alert("Delete failed");
    }
  };

  const claimLostFoundMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/lostFound/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "claimed" }),
      });
      if (!response.ok) throw new Error("Update failed");
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lostFoundPosts"] });
    },
  });

  const markAsClaimed = async (id: string) => {
    if (!confirm("এই আইটেমটি কি Claimed হিসেবে মার্ক করতে চান?")) return;
    try {
      await claimLostFoundMutation.mutateAsync(id);
    } catch {
      alert("Failed to mark as claimed");
    }
  };

  const updateComplainMutation = useMutation({
    mutationFn: async (payload: Complaint) => {
      const response = await fetch(`/api/complain/${payload._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accusedName: payload.accusedName,
          complaintType: payload.complaintType,
          message: payload.message,
        }),
      });
      if (!response.ok) throw new Error("Update failed");
    },
    onSuccess: async () => {
      setEditComplain(null);
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });

  const onComplainEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editComplain) return;
    try {
      await updateComplainMutation.mutateAsync(editComplain);
    } catch {
      alert("Update failed");
    }
  };

  const updateLostFoundMutation = useMutation({
    mutationFn: async (payload: LostFoundItem) => {
      const response = await fetch(`/api/lostFound/${payload._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Update failed");
    },
    onSuccess: async () => {
      setEditLostFound(null);
      await queryClient.invalidateQueries({ queryKey: ["lostFoundPosts"] });
    },
  });

  const onLostEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editLostFound) return;
    try {
      await updateLostFoundMutation.mutateAsync(editLostFound);
    } catch {
      alert("Update failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl md:p-10"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 backdrop-blur-md"
              >
                <ShieldAlert size={14} className="animate-pulse" />
                Admin Command Center
              </motion.div>
              <div>
                <h1 className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl">
                  Management Dashboard
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 md:text-base">
                  <Clock size={16} className="text-indigo-400" />
                  {new Date().toLocaleDateString("bn-BD", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Total Complaints",
              value: totalComplaints,
              icon: AlertCircle,
              color: "rose",
              trend: "High Priority",
            },
            {
              title: "Active Lost & Found",
              value: activeLostItems,
              icon: Search,
              color: "orange",
              trend: "Ongoing",
            },
            {
              title: "Claimed Items",
              value: claimedItems,
              icon: CheckCircle2,
              color: "emerald",
              trend: "Resolved",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              whileHover={{ y: -5 }}
              className={`group relative overflow-hidden rounded-[2rem] border border-${stat.color}-100 bg-white p-6 shadow-lg shadow-${stat.color}-900/5 transition-all`}
            >
              <div
                className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-${stat.color}-500/5 transition-transform group-hover:scale-150`}
              />

              <div className="relative flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${stat.color}-50 shadow-inner shadow-${stat.color}-200/50 text-${stat.color}-600 transition-transform group-hover:rotate-12`}
                >
                  <stat.icon size={28} />
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full bg-${stat.color}-50 px-2 py-1 text-[10px] font-bold text-${stat.color}-600`}
                >
                  <TrendingUp size={12} />
                  {stat.trend}
                </div>
              </div>

              <div className="relative mt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {stat.title}
                </p>
                <h3 className="mt-1 text-4xl font-black text-slate-900">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          <div className="border-b border-slate-100 bg-slate-50/50 p-4 backdrop-blur-sm md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex rounded-2xl bg-slate-200/50 p-1.5 backdrop-blur-md">
                  {[
                    {
                      id: "complaints",
                      label: "Complaints",
                      icon: AlertCircle,
                    },
                    { id: "lostfound", label: "Lost & Found", icon: Search },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                      className={`relative flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-indigo-600 shadow-md"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl border-2 border-indigo-100"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:max-w-md">
                <div className="group relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
                    size={18}
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="text"
                    placeholder="Search records..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-medium outline-none ring-indigo-50 transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95">
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                <p className="mt-4 text-sm font-bold text-slate-500">
                  Syncing with database...
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="rounded-2xl bg-rose-50 p-4 text-rose-500">
                  <ShieldAlert size={40} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {errorMessage}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Please check your connection or try again.
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!loading && !errorMessage && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <tr>
                          {activeTab === "complaints" ? (
                            <>
                              <th className="px-8 py-5">Accused Name</th>
                              <th className="px-8 py-5">Complaint Type</th>
                              <th className="px-8 py-5">Message</th>
                            </>
                          ) : (
                            <>
                              <th className="px-8 py-5">Item Title</th>
                              <th className="px-8 py-5">Location</th>
                              <th className="px-8 py-5">Type</th>
                              <th className="px-8 py-5">Status</th>
                            </>
                          )}
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(activeTab === "complaints"
                          ? filteredComplaints
                          : filteredLostFound
                        ).map((row, idx) => (
                          <motion.tr
                            key={row._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() =>
                              activeTab === "complaints"
                                ? setViewComplain(row as Complaint)
                                : setViewLostFound(row as LostFoundItem)
                            }
                            className="group hover:bg-indigo-50/30 transition-colors cursor-pointer"
                          >
                            {activeTab === "complaints" ? (
                              <>
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                      {(row as Complaint).accusedName.charAt(0)}
                                    </div>
                                    <span className="font-bold text-slate-900">
                                      {(row as Complaint).accusedName}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    {(row as Complaint).complaintType}
                                  </span>
                                </td>
                                <td className="px-8 py-5">
                                  <p className="line-clamp-1 max-w-xs text-sm text-slate-500">
                                    {(row as Complaint).message}
                                  </p>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-8 py-5 font-bold text-slate-900">
                                  {(row as LostFoundItem).title}
                                </td>
                                <td className="px-8 py-5 text-slate-600">
                                  {(row as LostFoundItem).location}
                                </td>
                                <td className="px-8 py-5">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass[(row as LostFoundItem).type]}`}
                                  >
                                    <span className="h-1 w-1 rounded-full bg-current" />
                                    {(row as LostFoundItem).type}
                                  </span>
                                </td>
                                <td className="px-8 py-5">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass[(row as LostFoundItem).status || "active"]}`}
                                  >
                                    <span className="h-1 w-1 rounded-full bg-current" />
                                    {(row as LostFoundItem).status || "active"}
                                  </span>
                                </td>
                              </>
                            )}
                            <td
                              className="px-8 py-5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {activeTab === "lostfound" &&
                                  (row as LostFoundItem).status !==
                                    "claimed" && (
                                    <button
                                      onClick={() =>
                                        void markAsClaimed(row._id)
                                      }
                                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md"
                                      title="Mark as Claimed"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                  )}
                                <button
                                  onClick={() =>
                                    activeTab === "complaints"
                                      ? setEditComplain(row as Complaint)
                                      : setEditLostFound(row as LostFoundItem)
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:text-indigo-600 hover:shadow-md"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    activeTab === "complaints"
                                      ? void deleteComplain(row._id)
                                      : void deleteLostFound(row._id)
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:text-rose-600 hover:shadow-md"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-4 p-4 md:hidden">
                    {(activeTab === "complaints"
                      ? filteredComplaints
                      : filteredLostFound
                    ).map((row, idx) => (
                      <motion.article
                        key={row._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() =>
                          activeTab === "complaints"
                            ? setViewComplain(row as Complaint)
                            : setViewLostFound(row as LostFoundItem)
                        }
                        className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm active:scale-95 transition-transform cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600">
                              {(activeTab === "complaints"
                                ? (row as Complaint).accusedName
                                : (row as LostFoundItem).title
                              ).charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">
                                {activeTab === "complaints"
                                  ? (row as Complaint).accusedName
                                  : (row as LostFoundItem).title}
                              </h3>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {activeTab === "complaints"
                                  ? (row as Complaint).complaintType
                                  : (row as LostFoundItem).location}
                              </p>
                            </div>
                          </div>
                          <div
                            className="flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {activeTab === "lostfound" &&
                              (row as LostFoundItem).status !== "claimed" && (
                                <button
                                  onClick={() => void markAsClaimed(row._id)}
                                  className="p-2 text-emerald-500"
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                              )}
                            <button
                              onClick={() =>
                                activeTab === "complaints"
                                  ? setEditComplain(row as Complaint)
                                  : setEditLostFound(row as LostFoundItem)
                              }
                              className="p-2 text-slate-400"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                activeTab === "complaints"
                                  ? void deleteComplain(row._id)
                                  : void deleteLostFound(row._id)
                              }
                              className="p-2 text-rose-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        {activeTab === "complaints" ? (
                          <p className="mt-4 text-sm leading-relaxed text-slate-600">
                            {(row as Complaint).message}
                          </p>
                        ) : (
                          <div className="mt-4 flex gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusPillClass[(row as LostFoundItem).type]}`}
                            >
                              {(row as LostFoundItem).type}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusPillClass[(row as LostFoundItem).status || "active"]}`}
                            >
                              {(row as LostFoundItem).status || "active"}
                            </span>
                          </div>
                        )}
                      </motion.article>
                    ))}
                  </div>

                  {(activeTab === "complaints"
                    ? filteredComplaints
                    : filteredLostFound
                  ).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="rounded-full bg-slate-50 p-6 text-slate-300">
                        <LayoutDashboard size={48} />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-slate-900">
                        No records found
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {viewComplain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewComplain(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">
                        Complaint Details
                      </h2>
                      <p className="text-sm font-medium text-slate-500">
                        Full report information.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewComplain(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Trash2 size={20} className="text-slate-400 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Accused Name
                      </p>
                      <p className="font-bold text-slate-900">
                        {viewComplain.accusedName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Type
                      </p>
                      <p className="font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-lg">
                        {viewComplain.complaintType}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Detailed Message
                    </p>
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {viewComplain.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => {
                      setEditComplain(viewComplain);
                      setViewComplain(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
                  >
                    <Edit3 size={18} /> Edit Record
                  </button>
                  <button
                    onClick={() => setViewComplain(null)}
                    className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewLostFound && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewLostFound(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl"
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${viewLostFound.type === "lost" ? "bg-rose-500/5" : "bg-sky-500/5"} blur-2xl`}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${viewLostFound.type === "lost" ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-600"}`}
                    >
                      <Search size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">
                        Item Details
                      </h2>
                      <p className="text-sm font-medium text-slate-500">
                        Record verification.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewLostFound(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Trash2 size={20} className="text-slate-400 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Title
                    </p>
                    <p className="text-lg font-black text-slate-900">
                      {viewLostFound.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Location
                      </p>
                      <p className="font-bold text-slate-900">
                        {viewLostFound.location}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Date
                      </p>
                      <p className="font-bold text-slate-900">
                        {viewLostFound.date}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Type
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass[viewLostFound.type]}`}
                      >
                        {viewLostFound.type}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass[viewLostFound.status || "active"]}`}
                      >
                        {viewLostFound.status || "active"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Description
                    </p>
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {viewLostFound.description ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  {viewLostFound.status !== "claimed" && (
                    <button
                      onClick={() => {
                        void markAsClaimed(viewLostFound._id);
                        setViewLostFound(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                    >
                      <CheckCircle2 size={18} /> Mark Claimed
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditLostFound(viewLostFound);
                      setViewLostFound(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
                  >
                    <Edit3 size={18} /> Edit
                  </button>
                  <button
                    onClick={() => setViewLostFound(null)}
                    className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editComplain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditComplain(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.form
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onSubmit={onComplainEditSubmit}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Edit Complaint
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                      Update the record details below.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Accused Name
                    </label>
                    <input
                      value={editComplain.accusedName}
                      onChange={(e) =>
                        setEditComplain({
                          ...editComplain,
                          accusedName: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      placeholder="Enter name..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Complaint Type
                    </label>
                    <input
                      value={editComplain.complaintType}
                      onChange={(e) =>
                        setEditComplain({
                          ...editComplain,
                          complaintType: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      placeholder="e.g. Harassment, Theft..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Detailed Message
                    </label>
                    <textarea
                      value={editComplain.message}
                      onChange={(e) =>
                        setEditComplain({
                          ...editComplain,
                          message: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      rows={4}
                      placeholder="Describe the issue..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditComplain(null)}
                    className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editLostFound && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditLostFound(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.form
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onSubmit={onLostEditSubmit}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Search size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Edit Lost & Found
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                      Update item information.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Item Title
                    </label>
                    <input
                      value={editLostFound.title}
                      onChange={(e) =>
                        setEditLostFound({
                          ...editLostFound,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
                      placeholder="e.g. Blue Wallet, iPhone 13..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Last Seen Location
                    </label>
                    <input
                      value={editLostFound.location}
                      onChange={(e) =>
                        setEditLostFound({
                          ...editLostFound,
                          location: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
                      placeholder="Enter location..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Description
                    </label>
                    <textarea
                      value={editLostFound.description || ""}
                      onChange={(e) =>
                        setEditLostFound({
                          ...editLostFound,
                          description: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
                      rows={4}
                      placeholder="Add more details..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditLostFound(null)}
                    className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] rounded-2xl bg-orange-600 py-4 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-700 hover:shadow-orange-300 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
