import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Languages, LogOut, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/useAuth'

const languages = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'te', label: 'తెలుగు', native: 'తె' },
  { code: 'hi', label: 'हिन्दी', native: 'हि' },
]

const navigation = {
  RMP: [{ to: '/rmp', labelKey: 'roles.RMP' }],
  STUDENT: [{ to: '/student', labelKey: 'roles.STUDENT' }],
  SUPERVISING_PROFESSOR: [{ to: '/professor', labelKey: 'roles.SUPERVISING_PROFESSOR' }],
}

function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { i18n, t } = useTranslation()
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const activeLanguage = languages.find((language) => language.code === i18n.resolvedLanguage) || languages[0]
  const isLightWorkspace = ['RMP', 'STUDENT', 'SUPERVISING_PROFESSOR'].includes(user?.role)

  async function selectLanguage(language) {
    await i18n.changeLanguage(language.code)
    localStorage.setItem('healthsetu_language', language.code)
    setLanguageMenuOpen(false)
  }

  function handleSignOut() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
    <div className={`relative isolate min-h-screen overflow-hidden ${isLightWorkspace ? 'bg-slate-50 text-slate-900' : 'bg-command-gradient text-slate-50'}`}>
      {!isLightWorkspace && <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-48 size-[36rem] animate-aurora rounded-full bg-teal-400/[0.055] blur-[120px]" />
        <div className="absolute -right-40 top-[28%] size-[40rem] animate-aurora rounded-full bg-sky-400/[0.045] blur-[130px] [animation-delay:-8s]" />
        <div className="absolute -bottom-64 left-[35%] size-[38rem] animate-aurora rounded-full bg-cyan-300/[0.035] blur-[140px] [animation-delay:-13s]" />
      </div>}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-2xl ${isLightWorkspace ? 'border-slate-200 bg-white/90 shadow-sm shadow-emerald-950/[0.03]' : 'border-slate-700/60 bg-slate-950/90'}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link className="group flex items-center gap-3 self-start" to="/">
              <span className={`relative flex size-10 items-center justify-center overflow-hidden rounded-xl text-base font-bold shadow-sm transition ${isLightWorkspace ? 'bg-emerald-600 text-white shadow-emerald-900/10 group-hover:bg-emerald-700' : 'border border-teal-100/20 bg-teal-300/10 text-teal-100 shadow-glow-teal group-hover:shadow-glow-cyan'}`} aria-hidden="true">
                {!isLightWorkspace && <span className="absolute inset-0 bg-gradient-to-br from-teal-200/15 to-transparent" />}
                <span className="relative">H</span>
              </span>
              <span>
                <span className={`block text-base font-bold tracking-tight ${isLightWorkspace ? 'text-slate-900' : 'text-white'}`}>Health-Setu</span>
                <span className={`block text-[11px] ${isLightWorkspace ? 'text-slate-500' : 'text-slate-300'}`}>Connected care, closer to home</span>
              </span>
            </Link>
            <div className="relative md:hidden">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={languageMenuOpen}
                onClick={() => setLanguageMenuOpen((open) => !open)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs ${isLightWorkspace ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-600 bg-slate-800 text-slate-100'}`}
              >
                <Languages size={14} /> {activeLanguage.native} <ChevronDown size={13} />
              </button>
              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.98 }} className={`absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border p-1 shadow-xl backdrop-blur-xl ${isLightWorkspace ? 'border-slate-200 bg-white' : 'border-white/10 bg-command-900/95 shadow-glass'}`}>
                    {languages.map((language) => (
                      <button key={language.code} type="button" role="option" aria-selected={activeLanguage.code === language.code} onClick={() => selectLanguage(language)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs ${isLightWorkspace ? 'text-slate-700 hover:bg-emerald-50' : 'text-slate-200 hover:bg-white/[0.08]'}`}>
                        {language.label}{activeLanguage.code === language.code && <Check size={13} className={isLightWorkspace ? 'text-emerald-700' : 'text-teal-200'} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
            {(navigation[user?.role] || []).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? isLightWorkspace
                        ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                        : 'border-teal-100/15 bg-teal-200/[0.09] text-teal-100'
                        : isLightWorkspace
                          ? 'border-transparent text-slate-600 hover:border-emerald-100 hover:bg-emerald-50 hover:text-emerald-800'
                          : 'border-transparent text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white'
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
            <div className="relative hidden md:block">
              <motion.button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={languageMenuOpen}
                onClick={() => setLanguageMenuOpen((open) => !open)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${isLightWorkspace ? 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800' : 'border-slate-600 bg-slate-800 text-slate-100 hover:border-teal-400/50 hover:bg-slate-700 hover:text-white'}`}
              >
                <Languages size={14} className={isLightWorkspace ? 'text-emerald-700' : 'text-teal-200'} />
                {activeLanguage.native}
                <ChevronDown size={13} className={`transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    role="listbox"
                    aria-label="Choose language"
                    className={`absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border p-1.5 shadow-xl backdrop-blur-2xl ${isLightWorkspace ? 'border-slate-200 bg-white' : 'border-slate-600 bg-slate-900 shadow-glass'}`}
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        type="button"
                        role="option"
                        aria-selected={activeLanguage.code === language.code}
                        onClick={() => selectLanguage(language)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${isLightWorkspace ? 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800' : 'text-slate-100 hover:bg-slate-700 hover:text-white'}`}
                      >
                        {language.label}
                        {activeLanguage.code === language.code && <Check size={14} className={isLightWorkspace ? 'text-emerald-700' : 'text-teal-200'} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              type="button"
              onClick={handleSignOut}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-xs font-medium transition focus:outline-none focus:ring-2 ${isLightWorkspace ? 'text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 focus:ring-emerald-300/60' : 'text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white focus:ring-teal-300/60'}`}
            >
              <LogOut size={14} aria-hidden="true" />
              {t('signOut')}
            </motion.button>
          </nav>
        </div>
      </header>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <footer className={`mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 pb-7 text-[11px] sm:px-6 lg:px-8 ${isLightWorkspace ? 'text-slate-500' : 'text-slate-400'}`}>
        <ShieldCheck size={13} className={isLightWorkspace ? 'text-emerald-700' : 'text-teal-300'} />
        {t('tagline')} · {t('secureSession')}
      </footer>
    </div>
    </>
  )
}

export default AppLayout
