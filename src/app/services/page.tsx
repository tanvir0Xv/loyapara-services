import SearchAndFilter from "./components/SearchAndFilter/SearchAndFilter";
import { ServiceMember } from "@/types/services/service";
import DateJuiceCard from "./components/ServiceCard/DateJuiceCard/DateJuiceCard";
import CowDoctorCard from "./components/ServiceCard/CowDoctorCard/CowDoctorCard";
import RajMistriCard from "./components/ServiceCard/RajMistriCard/RajMistriCard";
import ElectricianCard from "./components/ServiceCard/ElectricianCard/ElectricianCard";
import ElectronicsCard from "./components/ServiceCard/ElectronicsCard/ElectronicsCard"
import FarmerCard from "./components/ServiceCard/FarmerCard/FarmerCard";
import HomeopathicDoctorCard from "./components/ServiceCard/HomeopathicDoctorCard/HomeopathicDoctorCard";
import HouseHolderCard from "./components/ServiceCard/HouseHolderCard/HouseHolderCard";
import MotorcycleMechanicCard from "./components/ServiceCard/MotorcycleMechanicCard/MotorcycleMechanicCard";
import PlumberCard from "./components/ServiceCard/PlambarCard/PlambarCard";
import PowerTillerMechanicCard from "./components/ServiceCard/PowerTillerMechanicCard/PowerTillerMechanicCard";
import TailorCard from "./components/ServiceCard/TailorCard/TailorCard";
import TeacherCard from "./components/ServiceCard/TeacherCard/TeacherCard";
import VanAndAutoCard from "./components/ServiceCard/VanAndAutoCard/VanAndAutoCard";
import { VanCycleMechanicCard } from "./components/ServiceCard/VanCycleMechanicCard/VanCycleMechanicCard";
import { WeldingCard } from "./components/ServiceCard/WeldingCard/WeldingCard";


export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";

  // API Call
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services?search=${search}&category=${category}`,
    { cache: "no-store" }
  );
  
  
  const services: ServiceMember[] = await res.json();

  // টাইপ-সেফ রেন্ডারিং ফাংশন
  const renderServiceCard = (service: ServiceMember) => {
    switch (service.category) {
      case "খেজুরের রস":
        return <DateJuiceCard key={service._id} data={service} />;
      
      case "পশু চিকিৎসক":
        return <CowDoctorCard key={service._id} data={service} />;
      
      case "রাজমিস্ত্রি":
			return <RajMistriCard key={service._id} data={service} />;
		case "ইলেকট্রিশিয়ান":
			return <ElectricianCard key={service._id} data={service} />;
		case "ইলেকট্রনিক্স মেকার":
			return <ElectronicsCard key={service._id} data={service} />;
		case "কৃষি শ্রমিক":
			return <FarmerCard key={service._id} data={service} />;
		case "হোমিও ডাক্তার":
			return <HomeopathicDoctorCard key={service._id} data={service} />;
		case "কৃষক / কৃষি উদ্যোক্তা":
			return <HouseHolderCard key={service._id} data={service} />;
		case "কৃষক":
			return <HouseHolderCard key={service._id} data={service} />;
		case "মোটরসাইকেল মেকার":
			return <MotorcycleMechanicCard key={service._id} data={service} />;
		case "প্লাম্বার":
			return <PlumberCard key={service._id} data={service} />;
		case "মেশিন ও হালের মেকার":
			return <PowerTillerMechanicCard key={service._id} data={service} />;
		case "দর্জি / টেইলার্স":
			return <TailorCard key={service._id} data={service} />;
		case "মাস্টার / গৃহশিক্ষক":
			return <TeacherCard key={service._id} data={service} />;
		case "ভ্যান ও অটো সার্ভিস":
			return <VanAndAutoCard key={service._id} data={service} />;
		case "ভ্যান ও সাইকেল মেকার":
			return <VanCycleMechanicCard key={service._id} data={service} />;
		case "ওয়েল্ডিং মিস্ত্রি":
			return <WeldingCard key={service._id} data={service} />;
		
		
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* হেডার সেকশন */}
      <div className="bg-slate-900 pt-10 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">লয়াপাড়া সেবা ডিরেক্টরি</h1>
          <p className="text-gray-400">আপনার প্রয়োজনীয় দক্ষ কারিগর এখন এক ক্লিকেই</p>
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="max-w-6xl mx-auto px-4 -mt-10">
        <SearchAndFilter />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service) => renderServiceCard(service))
          ) : (
            <div className="col-span-full bg-white rounded-2xl p-20 text-center border shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-800">কোনো ফলাফল পাওয়া যায়নি!</h2>
              <p className="text-gray-500">অন্য কোনো নাম বা ক্যাটাগরি দিয়ে চেষ্টা করুন।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";