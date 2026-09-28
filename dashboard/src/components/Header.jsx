import { motion } from 'framer-motion'

export default function Header({ onReset }) {
  return (
    <header className="w-full border-b border-cream-200/70 bg-cream-50/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <button onClick={onReset} className="flex items-center gap-3 group">
          <Mark />
          <div className="leading-tight text-left">
            <div className="font-display text-2xl text-ink-900 group-hover:text-maroon-600 transition-colors">
              LeaseIQ
            </div>
            <div className="text-[10px] uppercase tracking-wider2 text-ink-500">
              NNN Lease Forensics
            </div>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-700">
          <a className="hover:text-maroon-600 transition-colors" href="#">How it works</a>
          <a className="hover:text-maroon-600 transition-colors" href="#">Pricing</a>
          <a className="hover:text-maroon-600 transition-colors" href="#">Sample report</a>
          <span className="btn-ghost text-sm cursor-default">
            Guarantee: <span className="text-maroon-600 ml-1">$10K found or it's free</span>
          </span>
        </nav>
      </div>
    </header>
  )
}

function Mark() {
  return (
    <motion.svg
      width="40" height="40" viewBox="0 0 40 40"
      initial={{ rotate: -8, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7B1F2C"/>
          <stop offset="100%" stopColor="#430F18"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#g1)"/>
      <path d="M11 12 L11 28 L22 28" stroke="#C8A55B" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="27" cy="14" r="3.2" stroke="#C8A55B" strokeWidth="2.2" fill="none"/>
      <line x1="29.4" y1="16.4" x2="32.5" y2="19.5" stroke="#C8A55B" strokeWidth="2.2" strokeLinecap="round"/>
    </motion.svg>
  )
}
