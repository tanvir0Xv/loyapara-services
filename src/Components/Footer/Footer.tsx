import React from "react";
import Link from "next/link";
import { Facebook, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 pt-12 pb-6">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ১. পরিচিতি সেকশন */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tighter">
              লয়াপাড়া<span className="text-primary">সেবা</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              আমাদের গ্রামের সকল দক্ষ মিস্ত্রি এবং জরুরি সেবা এখন আপনার হাতের
              মুঠোয়। লয়াপাড়া গ্রামকে ডিজিটালি এগিয়ে নেওয়াই আমাদের লক্ষ্য।
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/groups/loyaparabd"
                target="blank"
                className="hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="mailto:support.loyapara@gmail.com"
                className="hover:text-primary transition-colors"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* ২. দ্রুত লিঙ্ক */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              প্রয়োজনীয় লিঙ্ক
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline hover:text-primary">
                  হোম
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:underline hover:text-primary"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  href="/emergency"
                  className="hover:underline hover:text-primary"
                >
                  জরুরি নম্বর
                </Link>
              </li>
              <li>
                <Link
                  href="/addService"
                  className="hover:underline hover:text-primary"
                >
                  সেবা যোগ করুন
                </Link>
              </li>
            </ul>
          </div>

          {/* ৩. যোগাযোগ */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>
                  লয়াপাড়া, আমলিচুকাই / লাংলুহাট, গাবতলী, বগুড়া (রাজশাহী, ঢাকা
                  , বাংলাদেশ)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+৮৮০ ১৭৯৬২৫৫২১৩ (তানভীর)</span>
              </li>
              {/* ইমেইল সেকশন */}
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-primary shrink-0" />
                <Link href="mailto:support.loyapara@gmail.com" className="break-all hover:link-accent">support.loyapara@gmail.com</Link>
              </li>
            </ul>
          </div>

          {/* ৪. গুগল ম্যাপ সেকশন */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              অবস্থান <ExternalLink size={16} />
            </h3>
            <div className="rounded-xl overflow-hidden border border-slate-700 h-40 w-full shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1636.1157439821704!2d89.4095096!3d25.0023755!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fd03005a23a66f%3A0xb198681ec00557ce!2sTanvir%20Home!5e1!3m2!1sen!2sbd!4v1772985747857!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Loyapara Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* নিচের কপিরাইট অংশ */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} লয়াপাড়া সেবা। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-4">
            <Link href="/privacy">প্রাইভেসি পলিসি</Link>
            <Link href="/terms">শর্তাবলী</Link>
            <p className="text-xs text-blue-500">Develop By Tanvir Hasan</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
