import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

/**
 * Centered auth layout: top bar (brand + theme) + vertically & horizontally centered children.
 */
export default function AuthPageShell({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-charcoal-950 dark:text-slate-100 transition-colors duration-200">
      {/* Light mode grid and gradient background */}
      <div className="absolute inset-0 -z-10 dark:hidden pointer-events-none bg-gradient-to-b from-white via-slate-50 to-cyan-50/30" aria-hidden />
      <div className="absolute inset-0 -z-10 dark:hidden opacity-[0.35] pointer-events-none bg-[length:24px_24px] bg-[linear-gradient(rgba(15,118,110,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.05)_1px,transparent_1px)]" aria-hidden />

      {/* Dark mode background */}
      <div
        className="hidden dark:block absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
        style={{
          background: 'linear-gradient(180deg, #0c0f14 0%, #12161c 50%, #0c0f14 100%)',
        }}
      />
      <div className="hidden dark:block absolute inset-0 -z-10 opacity-[0.02] pointer-events-none bg-[length:24px_24px] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" aria-hidden />

      {/* Ambient Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-teal-500/15 dark:bg-teal-500/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Top Floating Bar for Theme Selection */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex justify-between items-center z-10">
        <Link to="/" className="font-display text-xl font-black tracking-tight text-gradient-teal">
          ClickWatch
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-2 sm:pb-24 w-full max-w-md mx-auto sm:px-6 z-10">
        {children}
      </div>
    </div>
  );
}
