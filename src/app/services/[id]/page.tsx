'use client';

import DetailsModal from "@/Components/DetailsModal/DetailsModal";
import HandleOpenModal from "@/Components/DetailsModal/HandleOpenModal";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch service data");
        }

        const data = await res.json();
        setServiceData(data);
      } catch (err: any) {
        setError(err.message || "তথ্য পাওয়া যায়নি!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-500 font-bold">তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <p className="text-gray-500 text-xl font-bold mb-4">
            {error || "তথ্য পাওয়া যায়নি!"}
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold"
          >
            ← ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DetailsModal>
      <div className="min-h-screen py-10 px-4 bg-white">
        <div className="max-w-xl mx-auto">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors font-medium"
          >
            ← ফিরে যান
          </Link>

          <div className="rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
            <HandleOpenModal data={serviceData} />
          </div>
        </div>
      </div>
    </DetailsModal>
  );
}
