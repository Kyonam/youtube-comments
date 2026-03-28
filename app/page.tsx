import { Analyzer } from "@/components/analyzer/Analyzer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="py-8 flex items-center justify-between border-b mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-6 h-6"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-800 dark:text-slate-100">
              Youtube<span className="text-blue-600">Comment</span><span className="text-slate-400 font-light">.ai</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </nav>
        </header>

        <Analyzer />

        <footer className="py-12 border-t mt-20 text-center text-slate-400 text-sm">
          <p>© 2026 YoutubeComment.ai. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Cookie Settings</a>
          </div>
        </footer>
      </div>
    </main>
  )
}
