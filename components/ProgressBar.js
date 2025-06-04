export default function ProgressBar({ percent, status }) {
  return (
    <div className="my-4">
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="text-xs text-center mt-1">{status}</div>
    </div>
  );
}
