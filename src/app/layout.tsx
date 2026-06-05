import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import WhatsAppSupport from "@/Components/WhatsAppSupport/WhatsAppSupport";
import ReactQueryProvider from "@/Components/Providers/ReactQueryProvider";
import { Toaster } from "sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "লয়াপাড়া সেবা - Loyapara Services | কাগইল, গাবতলী, বগুড়া",
  description:
    "লয়াপাড়া গ্রামের সকল দক্ষ কারিগর, মিস্ত্রি এবং জরুরি সার্ভিসগুলোকে একটি প্ল্যাটফর্মে নিয়ে এসে আমরা জীবনযাত্রাকে আরও সহজ করছি। কাগইল ইউনিয়ন, গাবতলী থানা, বগুড়া জেলার একটি স্থানীয় ডিজিটাল সেবা প্ল্যাটফর্ম।",
  keywords: [
    "লয়াপাড়া",
    "সেবা",
    "ডিজিটাল ভিলেজ",
    "মিস্ত্রি",
    "সার্ভিস",
    "বগুড়া",
    "loyapara services",
    "লয়াপাড়া সেবা",
    "গাবতলী বগুড়া",
    "কাগইল ইউনিয়ন"
  ],
  openGraph: {
    title: "লয়াপাড়া সেবা - Loyapara Services",
    description:
      "লয়াপাড়া গ্রামের সকল দক্ষ কারিগর, মিস্ত্রি এবং জরুরি সার্ভিসগুলোকে একটি প্ল্যাটফর্মে নিয়ে এসে আমরা জীবনযাত্রাকে আরও সহজ করছি। কাগইল ইউনিয়ন, গাবতলী, বগুড়া।",
    url: "https://loyapara-services.vercel.app", 
    siteName: "লয়াপাড়া সেবা",
    locale: "bn_BD", 
    type: "website",
  },
  verification: {
    google: "Q0d4tiulIZNJVeysEfG2mMqtWKeNC3Fvc75ZjfFlN1I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          {children}
          <WhatsAppSupport />
          <Footer />
          <Toaster position="top-right" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
