export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-slate-500 font-bold animate-pulse">
        লোডিং হচ্ছে...
      </p>
    </div>
  );
}
