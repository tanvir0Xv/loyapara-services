import DetailsModal from "@/Components/DetailsModal/DetailsModal";
import HandleOpenModal from "@/Components/DetailsModal/HandleOpenModal";
import Link from "next/link";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch data using relative path for safety
  let serviceData;
  try {
    const res = await fetch(`/api/services/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      serviceData = await res.json();
    }
  } catch {
    // Fallback
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <p className="text-gray-500 text-xl font-bold mb-4">
            তথ্য পাওয়া যায়নি!
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

export const dynamic = "force-dynamic";
