// Loader.js
export default function Loader({ label = "Memproses..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <span className="relative flex h-10 w-10 mb-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-10 w-10 bg-blue-600"></span>
      </span>
      <span className="text-blue-700 text-sm font-semibold animate-pulse">{label}</span>
    </div>
  );
}
