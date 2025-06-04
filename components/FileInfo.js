export default function FileInfo({ before, after }) {
  return (
    <div className="flex justify-between text-xs my-2">
      <div>
        <div>Ukuran File Awal</div>
        <div className="font-semibold">{before}</div>
      </div>
      <div>
        <div>Ukuran File Akhir</div>
        <div className="font-semibold">{after}</div>
      </div>
    </div>
  );
}
