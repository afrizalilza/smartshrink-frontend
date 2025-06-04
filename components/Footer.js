export default function Footer() {
  return (
    <footer className="w-full text-center py-7 rounded-b-2xl border-t mt-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="font-semibold text-sm md:text-base text-blue-800 flex flex-wrap items-center justify-center gap-2">
          SmartShrink AI <span className="hidden md:inline">&mdash;</span> <span className="text-blue-500 font-bold">Kompresi Cerdas Berbasis AI</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-1">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-blue-50/60 hover:underline transition text-blue-700 font-medium">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.424 2.865 8.176 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.907-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.528 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.545 1.382.202 2.402.1 2.656.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.36.31.68.92.68 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.193 22 16.442 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
            Github
          </a>
          <a href="/privacy" className="px-3 py-1 rounded hover:bg-blue-50/60 hover:underline transition text-blue-700 font-medium">Privasi</a>
          <a href="/terms" className="px-3 py-1 rounded hover:bg-blue-50/60 hover:underline transition text-blue-700 font-medium">Ketentuan</a>
        </div>
        <div className="text-[14px] text-gray-400 mt-2">&copy; {new Date().getFullYear()} SmartShrink AI. All rights reserved.</div>
      </div>
    </footer>
  );
}
