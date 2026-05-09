"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">কিছু একটা ভুল হয়েছে!</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        দুঃখিত, আমরা আপনার অনুরোধটি প্রসেস করতে পারছি না। দয়া করে আবার চেষ্টা করুন।
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-primary/90 transition-all active:scale-95"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}
