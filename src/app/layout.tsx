import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import WhatsAppSupport from "@/Components/WhatsAppSupport/WhatsAppSupport";
import ReactQueryProvider from "@/Components/Providers/ReactQueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "লয়াপাড়া সেবা - আপনার এলাকার সব ডিজিটাল সার্ভিস",
  description:
    "লয়াপাড়া গ্রামের সকল দক্ষ কারিগর, মিস্ত্রি এবং জরুরি সার্ভিসগুলোকে একটি প্ল্যাটফর্মে নিয়ে এসে আমরা জীবনযাত্রাকে আরও সহজ করছি।",
  keywords: [
    "লয়াপাড়া",
    "সেবা",
    "ডিজিটাল ভিলেজ",
    "মিস্ত্রি",
    "সার্ভিস",
    "বগুড়া",
  ],
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
          <Navbar />
          {children}
          <WhatsAppSupport />
          <Footer />
          <Toaster position="top-right" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
