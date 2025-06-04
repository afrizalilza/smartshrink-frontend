import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 w-full bg-white border-b border-blue-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8">
        <div className="flex items-center gap-4 select-none py-3">
          <span className="text-base md:text-lg font-extrabold bg-gradient-to-r from-blue-700 to-blue-400 text-transparent bg-clip-text tracking-tight">SmartShrink <span className="text-blue-400">AI</span></span>
        </div>
        <div className="flex gap-8 py-3 text-blue-700 items-center">
          <Link href="/">
            <span className="hover:text-blue-900 cursor-pointer no-underline" title="Beranda">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-2-2h-3.5a2 2 0 00-1.5.67" /></svg>
            </span>
          </Link>
          <Link href="/how-it-work">
            <span className="hover:text-blue-900 cursor-pointer no-underline" title="Cara Kerja">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
