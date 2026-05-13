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
  X,
  MapPin,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Search,
  ShieldAlert,
  Trash2,
  TrendingUp,
  Briefcase,
  User,
  Phone,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

type Service = {
  _id: string;
  name: string;
  category: string;
  phone: string;
  location: string;
  [key: string]: any;
};

type Claim = {
  _id: string;
  postId: string;
  claimerName: string;
  claimerPhone: string;
  claimerAddress?: string;
  claimDetails?: string;
  proofText?: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
};

type ActiveTab = "complaints" | "lostfound" | "services" | "claims";

const statusPillClass: Record<string, string> = {
  lost: "bg-rose-100 text-rose-700",
  found: "bg-sky-100 text-sky-700",
  active: "bg-amber-100 text-amber-700",
  claimed: "bg-emerald-100 text-emerald-700",
  pending: "bg-orange-100 text-orange-700",
  verified: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("complaints");
  const [query, setQuery] = useState("");
  const [editComplain, setEditComplain] = useState<Complaint | null>(null);
  const [editLostFound, setEditLostFound] = useState<LostFoundItem | null>(
    null,
  );
  const [editService, setEditService] = useState<Service | null>(null);
  const [viewComplain, setViewComplain] = useState<Complaint | null>(null);
  const [viewLostFound, setViewLostFound] = useState<LostFoundItem | null>(
    null,
  );
  const [viewService, setViewService] = useState<Service | null>(null);
  const [viewClaim, setViewClaim] = useState<Claim | null>(null);
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

  const {
    data: services = [],
    isLoading: servicesLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ["services"],
    enabled: authOk,
    queryFn: async () => {
      const response = await fetch("/api/services", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load services.");
      return (await response.json()) as Service[];
    },
  });

  const {
    data: claims = [],
    isLoading: claimsLoading,
    isError: claimsError,
  } = useQuery({
    queryKey: ["claims"],
    enabled: authOk,
    queryFn: async () => {
      const response = await fetch("/api/claims", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load claims.");
      const payload = (await response.json()) as { data: Claim[] };
      return payload.data || [];
    },
  });

  const loading =
    authLoading ||
    complaintsLoading ||
    lostLoading ||
    servicesLoading ||
    claimsLoading;
  const errorMessage =
    complaintsError || lostError || servicesError || claimsError
      ? "Failed to load dashboard data."
      : "";

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
  const pendingClaims = claims.filter(
    (claim) => claim.status === "pending",
  ).length;

  const filteredComplaints = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return complaints;
    }
    return complaints.filter(
      (item) =>
        (item.accusedName || "").toLowerCase().includes(search) ||
        (item.complaintType || "").toLowerCase().includes(search) ||
        (item.message || "").toLowerCase().includes(search),
    );
  }, [query, complaints]);

  const filteredLostFound = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return lostFoundItems;
    }
    return lostFoundItems.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(search) ||
        (item.location || "").toLowerCase().includes(search) ||
        (item.type || "").toLowerCase().includes(search) ||
        (item.status || "").toLowerCase().includes(search),
    );
  }, [query, lostFoundItems]);

  const filteredServices = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return services;
    }
    return services.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(search) ||
        (item.category || "").toLowerCase().includes(search) ||
        (item.phone || "").toLowerCase().includes(search) ||
        (item.location || "").toLowerCase().includes(search),
    );
  }, [query, services]);

  const filteredClaims = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return claims;
    }
    return claims.filter(
      (item) =>
        (item.claimerName || "").toLowerCase().includes(search) ||
        (item.claimerPhone || "").toLowerCase().includes(search) ||
        (item.status || "").toLowerCase().includes(search),
    );
  }, [query, claims]);

  const deleteComplainMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/complain/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete complaint!");
    },
  });

  const deleteComplain = async (id: string) => {
    if (!confirm("এই অভিযোগটি ডিলিট করতে চান?")) return;
    try {
      await deleteComplainMutation.mutateAsync(id);
    } catch {
      // Error handled in mutation
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
      toast.success("Lost/Found post deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete post!");
    },
  });

  const deleteLostFound = async (id: string) => {
    if (!confirm("এই Lost/Found পোস্টটি ডিলিট করতে চান?")) return;
    try {
      await deleteLostFoundMutation.mutateAsync(id);
    } catch {
      // Error handled in mutation
    }
  };

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete service!");
    },
  });

  const deleteService = async (id: string) => {
    if (!confirm("এই সার্ভিসটি ডিলিট করতে চান?")) return;
    try {
      await deleteServiceMutation.mutateAsync(id);
    } catch {
      // Error handled in mutation
    }
  };

  const updateServiceMutation = useMutation({
    mutationFn: async (payload: Service) => {
      const response = await fetch(`/api/services/${payload._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Update failed");
    },
    onSuccess: async () => {
      setEditService(null);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update service!");
    },
  });

  const onServiceEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editService) return;
    try {
      await updateServiceMutation.mutateAsync(editService);
    } catch {
      // Error handled in mutation
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
      toast.success("Item marked as claimed!");
    },
    onError: () => {
      toast.error("Failed to mark as claimed!");
    },
  });

  const markAsClaimed = async (id: string) => {
    if (!confirm("এই আইটেমটি কি Claimed হিসেবে মার্ক করতে চান?")) return;
    try {
      await claimLostFoundMutation.mutateAsync(id);
    } catch {
      // Error handled in mutation
    }
  };

  const updateClaimStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "verified" | "rejected";
    }) => {
      const response = await fetch(`/api/claims/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Update failed");
    },
    onSuccess: async () => {
      setViewClaim(null);
      await queryClient.invalidateQueries({ queryKey: ["claims"] });
      toast.success("Claim status updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update claim status!");
    },
  });

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
      toast.success("Complaint updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update complaint!");
    },
  });

  const onComplainEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editComplain) return;
    try {
      await updateComplainMutation.mutateAsync(editComplain);
    } catch {
      // Error handled in mutation
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
      toast.success("Lost/Found post updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update post!");
    },
  });

  const onLostEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editLostFound) return;
    try {
      await updateLostFoundMutation.mutateAsync(editLostFound);
    } catch {
      // Error handled in mutation
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    toast.success("Logged out successfully!");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="font-bold text-slate-500 animate-pulse">
            অনুমতি যাচাই করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!authOk) return null;

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
                onClick={() => router.push("/addService")}
                className="group flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110"
              >
                <PlusCircle size={18} />
                লিস্টিং যোগ করুন
              </motion.button>
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

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Complaints",
              value: totalComplaints,
              icon: AlertCircle,
              color: "rose",
              trend: "High Priority",
              targetTab: "complaints",
            },
            {
              title: "Active Lost & Found",
              value: activeLostItems,
              icon: Search,
              color: "orange",
              trend: "Ongoing",
              targetTab: "lostfound",
            },
            {
              title: "Claimed Items",
              value: claimedItems,
              icon: CheckCircle2,
              color: "emerald",
              trend: "Resolved",
              targetTab: "lostfound",
            },
            {
              title: "Pending Claims",
              value: pendingClaims,
              icon: Award,
              color: "indigo",
              trend: "Review Needed",
              targetTab: "claims",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              whileHover={{ y: -5 }}
              onClick={() => setActiveTab(stat.targetTab as ActiveTab)}
              className={`group relative overflow-hidden rounded-[2rem] border border-${stat.color}-100 bg-white p-6 shadow-lg shadow-${stat.color}-900/5 transition-all cursor-pointer`}
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
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <div className="flex rounded-2xl bg-slate-200/50 p-1.5 backdrop-blur-md min-w-max">
                  {[
                    {
                      id: "complaints",
                      label: "Complaints",
                      icon: AlertCircle,
                    },
                    { id: "lostfound", label: "Lost & Found", icon: Search },
                    { id: "services", label: "Services", icon: Briefcase },
                    { id: "claims", label: "Claims", icon: Award },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                      className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all whitespace-nowrap ${
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
                          ) : activeTab === "lostfound" ? (
                            <>
                              <th className="px-8 py-5">Item Title</th>
                              <th className="px-8 py-5">Location</th>
                              <th className="px-8 py-5">Type</th>
                              <th className="px-8 py-5">Status</th>
                            </>
                          ) : activeTab === "claims" ? (
                            <>
                              <th className="px-8 py-5">Claimer Name</th>
                              <th className="px-8 py-5">Phone</th>
                              <th className="px-8 py-5">Address</th>
                              <th className="px-8 py-5">Status</th>
                            </>
                          ) : (
                            <>
                              <th className="px-8 py-5">Name</th>
                              <th className="px-8 py-5">Category</th>
                              <th className="px-8 py-5">Phone</th>
                              <th className="px-8 py-5">Location</th>
                            </>
                          )}
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(activeTab === "complaints"
                          ? filteredComplaints
                          : activeTab === "lostfound"
                            ? filteredLostFound
                            : activeTab === "claims"
                              ? filteredClaims
                              : filteredServices
                        ).map((row, idx) => (
                          <motion.tr
                            key={(row as any)._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              if (activeTab === "complaints")
                                setViewComplain(row as Complaint);
                              else if (activeTab === "lostfound")
                                setViewLostFound(row as LostFoundItem);
                              else if (activeTab === "claims")
                                setViewClaim(row as Claim);
                              else setViewService(row as Service);
                            }}
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
                            ) : activeTab === "lostfound" ? (
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
                            ) : activeTab === "claims" ? (
                              <>
                                <td className="px-8 py-5 font-bold text-slate-900">
                                  {(row as Claim).claimerName}
                                </td>
                                <td className="px-8 py-5 text-slate-600">
                                  {(row as Claim).claimerPhone}
                                </td>
                                <td className="px-8 py-5 text-slate-500">
                                  {(row as Claim).claimerAddress || "N/A"}
                                </td>
                                <td className="px-8 py-5">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass[(row as Claim).status]}`}
                                  >
                                    <span className="h-1 w-1 rounded-full bg-current" />
                                    {(row as Claim).status}
                                  </span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-8 py-5 font-bold text-slate-900">
                                  {(row as Service).name}
                                </td>
                                <td className="px-8 py-5">
                                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                                    {(row as Service).category}
                                  </span>
                                </td>
                                <td className="px-8 py-5 text-slate-600">
                                  {(row as Service).phone}
                                </td>
                                <td className="px-8 py-5 text-slate-600">
                                  {(row as Service).location}
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
                                        void markAsClaimed((row as any)._id)
                                      }
                                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md"
                                      title="Mark as Claimed"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                  )}
                                <button
                                  onClick={() => {
                                    if (activeTab === "complaints")
                                      setEditComplain(row as Complaint);
                                    else if (activeTab === "lostfound")
                                      setEditLostFound(row as LostFoundItem);
                                    else if (activeTab === "claims") {
                                      // For claims, we view first then decide
                                      setViewClaim(row as Claim);
                                    } else setEditService(row as Service);
                                  }}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:text-indigo-600 hover:shadow-md"
                                >
                                  {activeTab === "claims" ? (
                                    <ExternalLink size={16} />
                                  ) : (
                                    <Edit3 size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    if (activeTab === "complaints")
                                      void deleteComplain((row as any)._id);
                                    else if (activeTab === "lostfound")
                                      void deleteLostFound((row as any)._id);
                                    else if (activeTab === "services")
                                      void deleteService((row as any)._id);
                                    // Claims delete is handled in view modal
                                  }}
                                  className={
                                    activeTab === "claims"
                                      ? "hidden"
                                      : "flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:text-rose-600 hover:shadow-md"
                                  }
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
                      : activeTab === "lostfound"
                        ? filteredLostFound
                        : activeTab === "claims"
                          ? filteredClaims
                          : filteredServices
                    ).map((row, idx) => (
                      <motion.article
                        key={(row as any)._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600">
                              {(activeTab === "complaints"
                                ? (row as Complaint).accusedName
                                : activeTab === "lostfound"
                                  ? (row as LostFoundItem).title
                                  : activeTab === "claims"
                                    ? (row as Claim).claimerName
                                    : (row as Service).name
                              ).charAt(0)}
                            </div>
                            <div>
                              {activeTab === "complaints" && (
                                <>
                                  <h4 className="font-bold text-slate-900">
                                    {(row as Complaint).accusedName}
                                  </h4>
                                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                                    {(row as Complaint).complaintType}
                                  </span>
                                </>
                              )}
                              {activeTab === "lostfound" && (
                                <>
                                  <h4 className="font-bold text-slate-900">
                                    {(row as LostFoundItem).title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                        statusPillClass[
                                          (row as LostFoundItem).type
                                        ]
                                      }`}
                                    >
                                      {(row as LostFoundItem).type}
                                    </span>
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                        statusPillClass[
                                          (row as LostFoundItem).status ||
                                            "active"
                                        ]
                                      }`}
                                    >
                                      {(row as LostFoundItem).status ||
                                        "active"}
                                    </span>
                                  </div>
                                </>
                              )}
                              {activeTab === "claims" && (
                                <>
                                  <h4 className="font-bold text-slate-900">
                                    {(row as Claim).claimerName}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    {(row as Claim).claimerPhone}
                                  </p>
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider mt-1 ${
                                      statusPillClass[(row as Claim).status]
                                    }`}
                                  >
                                    {(row as Claim).status}
                                  </span>
                                </>
                              )}
                              {activeTab === "services" && (
                                <>
                                  <h4 className="font-bold text-slate-900">
                                    {(row as Service).name}
                                  </h4>
                                  <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                                    {(row as Service).category}
                                  </span>
                                  <p className="text-sm text-slate-500 mt-1">
                                    {(row as Service).phone}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (activeTab === "complaints")
                                  setViewComplain(row as Complaint);
                                else if (activeTab === "lostfound")
                                  setViewLostFound(row as LostFoundItem);
                                else if (activeTab === "claims")
                                  setViewClaim(row as Claim);
                                else setViewService(row as Service);
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100"
                            >
                              <ExternalLink size={16} />
                            </button>

                            {activeTab !== "claims" && (
                              <button
                                onClick={() => {
                                  if (activeTab === "complaints")
                                    setEditComplain(row as Complaint);
                                  else if (activeTab === "lostfound")
                                    setEditLostFound(row as LostFoundItem);
                                  else setEditService(row as Service);
                                }}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100"
                              >
                                <Edit3 size={16} />
                              </button>
                            )}

                            {activeTab === "lostfound" &&
                              (row as LostFoundItem).status !== "claimed" && (
                                <button
                                  onClick={() =>
                                    void markAsClaimed((row as any)._id)
                                  }
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 transition-all hover:bg-emerald-100"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                          </div>

                          {activeTab !== "claims" && (
                            <button
                              onClick={() => {
                                if (activeTab === "complaints")
                                  void deleteComplain((row as any)._id);
                                else if (activeTab === "lostfound")
                                  void deleteLostFound((row as any)._id);
                                else if (activeTab === "services")
                                  void deleteService((row as any)._id);
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-all hover:bg-rose-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      {/* Modal components for editing and viewing */}
      <AnimatePresence>
        {viewComplain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setViewComplain(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-[2rem] bg-white p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Complaint Details
                  </h2>
                  <p className="text-slate-500 mt-1">
                    Viewing complaint record
                  </p>
                </div>
                <button
                  onClick={() => setViewComplain(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Accused Name
                    </p>
                    <p className="font-bold text-slate-900">
                      {viewComplain.accusedName}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Complaint Type
                    </p>
                    <p className="font-bold text-slate-900">
                      {viewComplain.complaintType}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Message
                  </p>
                  <p className="text-slate-700">{viewComplain.message}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setViewComplain(null)}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {viewLostFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setViewLostFound(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-[2rem] bg-white p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Lost & Found Details
                  </h2>
                  <p className="text-slate-500 mt-1">Viewing item record</p>
                </div>
                <button
                  onClick={() => setViewLostFound(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Title
                    </p>
                    <p className="font-bold text-slate-900">
                      {viewLostFound.title}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Type
                    </p>
                    <p className="font-bold text-slate-900">
                      {viewLostFound.type}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Description
                  </p>
                  <p className="text-slate-700">{viewLostFound.description}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setViewLostFound(null)}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {viewClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setViewClaim(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-[2rem] bg-white p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Claim Request
                  </h2>
                  <p className="text-slate-500 mt-1">
                    Review and verify this claim
                  </p>
                </div>
                <button
                  onClick={() => setViewClaim(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Post Details */}
              {(() => {
                const relatedPost = lostFoundItems.find(
                  (item) => item._id === viewClaim.postId,
                );
                return (
                  <div className="mb-6 rounded-2xl bg-indigo-50 p-5 border border-indigo-100">
                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-500 mb-4">
                      Related Post
                    </h3>
                    {relatedPost ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-xl bg-white p-4 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                              Post Title
                            </p>
                            <p className="font-bold text-slate-900">
                              {relatedPost.title}
                            </p>
                          </div>
                          <div className="rounded-xl bg-white p-4 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                              Type
                            </p>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass[relatedPost.type]}`}
                            >
                              <span className="h-1 w-1 rounded-full bg-current" />
                              {relatedPost.type}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-4 shadow-sm">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            Description
                          </p>
                          <p className="text-slate-700">
                            {relatedPost.description || "No description"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">
                        Post not found or deleted
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Claimer Name
                    </p>
                    <p className="font-bold text-slate-900">
                      {viewClaim.claimerName}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Phone
                    </p>
                    <p className="font-bold text-slate-900">
                      {viewClaim.claimerPhone}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Address
                  </p>
                  <p className="text-slate-700">
                    {viewClaim.claimerAddress || "N/A"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Claim Details
                  </p>
                  <p className="text-slate-700">
                    {viewClaim.claimDetails || "N/A"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Proof
                  </p>
                  <p className="text-slate-700">
                    {viewClaim.proofText || "N/A"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass[viewClaim.status]}`}
                  >
                    <span className="h-1 w-1 rounded-full bg-current" />
                    {viewClaim.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                {viewClaim.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        void updateClaimStatusMutation.mutateAsync({
                          id: viewClaim._id,
                          status: "rejected",
                        })
                      }
                      className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        // Also mark the post as claimed when verifying
                        const relatedPost = lostFoundItems.find(
                          (item) => item._id === viewClaim.postId,
                        );
                        if (relatedPost && relatedPost.status !== "claimed") {
                          void markAsClaimed(relatedPost._id);
                        }
                        void updateClaimStatusMutation.mutateAsync({
                          id: viewClaim._id,
                          status: "verified",
                        });
                      }}
                      className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600"
                    >
                      Verify & Accept
                    </button>
                  </>
                )}
                <button
                  onClick={() => setViewClaim(null)}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {editComplain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setEditComplain(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[2rem] bg-white p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">
                  Edit Complaint
                </h2>
                <button
                  onClick={() => setEditComplain(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={onComplainEditSubmit} className="space-y-4">
                <input
                  required
                  value={editComplain.accusedName}
                  onChange={(e) =>
                    setEditComplain({
                      ...editComplain,
                      accusedName: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                  placeholder="Accused Name"
                />
                <input
                  required
                  value={editComplain.complaintType}
                  onChange={(e) =>
                    setEditComplain({
                      ...editComplain,
                      complaintType: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                  placeholder="Complaint Type"
                />
                <textarea
                  required
                  value={editComplain.message}
                  onChange={(e) =>
                    setEditComplain({
                      ...editComplain,
                      message: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 p-3"
                  placeholder="Message"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditComplain(null)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:brightness-110"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {editLostFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setEditLostFound(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[2rem] bg-white p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">
                  Edit Lost/Found
                </h2>
                <button
                  onClick={() => setEditLostFound(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={onLostEditSubmit} className="space-y-4">
                <input
                  required
                  value={editLostFound.title}
                  onChange={(e) =>
                    setEditLostFound({
                      ...editLostFound,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                  placeholder="Title"
                />
                <input
                  required
                  value={editLostFound.location}
                  onChange={(e) =>
                    setEditLostFound({
                      ...editLostFound,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                  placeholder="Location"
                />
                <input
                  required
                  type="date"
                  value={editLostFound.date}
                  onChange={(e) =>
                    setEditLostFound({ ...editLostFound, date: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                />
                <textarea
                  value={editLostFound.description || ""}
                  onChange={(e) =>
                    setEditLostFound({
                      ...editLostFound,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 p-3"
                  placeholder="Description"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditLostFound(null)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:brightness-110"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {editService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setEditService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[2rem] bg-white p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">
                  Edit Service
                </h2>
                <button
                  onClick={() => setEditService(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={onServiceEditSubmit} className="space-y-4">
                {Object.entries(editService).map(([key, value]) => {
                  if (key === "_id") return null;
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        value={typeof value === "string" ? value : ""}
                        onChange={(e) =>
                          setEditService({
                            ...editService,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-3"
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  );
                })}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditService(null)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:brightness-110"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const dynamic = "force-dynamic";
