import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Activity, ArrowUpRight, LayoutDashboard, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const sections = [
  { id: 'about', label: 'About Us' },
  { id: 'idea', label: 'Our Idea' },
  { id: 'solution', label: 'Our Solution' },
]

const dashboardRoutes = {
  RMP: '/rmp',
  STUDENT: '/student',
  SUPERVISING_PROFESSOR: '/professor',
}

function NavBar() {
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 260, damping: 20, mass: 0.25 })
  const y = useSpring(pointerY, { stiffness: 260, damping: 20, mass: 0.25 })

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)

    if (targets.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)
        if (visibleSections[0]) setActiveSection(visibleSections[0].target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.15, 0.35, 0.6] },
    )

    targets.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function magneticMove(event) {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 6)
  }

  function resetMagnetic() {
    pointerX.set(0)
    pointerY.set(0)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const destination = user ? dashboardRoutes[user.role] || '/login' : '/login'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-100/50 bg-white/70 shadow-sm shadow-emerald-950/[0.03] backdrop-blur-md transition-colors duration-300">
      <nav aria-label="Main navigation" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/10 transition group-hover:bg-emerald-700">
            <Activity size={21} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight text-slate-900 sm:text-base">Health-Setu</span>
            <span className="hidden text-[11px] text-slate-500 sm:block">Connected care, closer to home</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-7 md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={`group relative whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold transition-colors hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeSection === section.id ? 'text-emerald-800' : 'text-slate-700'
              }`}
            >
              {section.label}
              {activeSection === section.id ? (
                <motion.span layoutId="navbar-active-underline" className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-500" />
              ) : (
                <span className="absolute inset-x-2 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-emerald-300 transition-transform duration-300 group-hover:scale-x-100" />
              )}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <motion.div
            style={reduceMotion ? undefined : { x, y }}
            onPointerMove={magneticMove}
            onPointerLeave={resetMagnetic}
            whileHover={reduceMotion ? undefined : { scale: 1.035 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="hidden sm:block"
          >
            <Link
              to={destination}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25"
            >
              {user ? <><LayoutDashboard size={15} aria-hidden="true" /> Dashboard</> : <>Sign In <ArrowUpRight size={15} aria-hidden="true" /></>}
            </Link>
          </motion.div>
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-200 hover:text-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 md:hidden"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="overflow-hidden border-t border-emerald-100/70 bg-white/95 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3 sm:px-8">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => { setActiveSection(section.id); closeMenu() }}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    activeSection === section.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  {section.label}
                </a>
              ))}
              <Link
                to={destination}
                onClick={closeMenu}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-900/10"
              >
                {user ? 'Open Dashboard' : 'Sign In'} <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default NavBar
