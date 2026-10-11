import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { apiRequest } from '../lib/api'

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'te', label: 'తె', name: 'తెలుగు' },
  { code: 'hi', label: 'हि', name: 'हिन्दी' },
]

function LoginPage() {
  const { t, i18n } = useTranslation()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState(
    new URLSearchParams(location.search).has('session') ? t('sessionExpired') : '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      if (typeof response?.token !== 'string' || !response.token) {
        throw new Error('The login response did not include an authentication token.')
      }

      const user = signIn(response?.token)
      let destination
      switch (user.role) {
        case 'STUDENT':
          destination = '/student'
          break
        case 'RMP':
          destination = '/rmp'
          break
        case 'SUPERVISING_PROFESSOR':
          destination = '/professor'
          break
        default:
          throw new Error('Your account role is not supported by this application.')
      }
      navigate(destination, { replace: true })
    } catch (requestError) {
      const error = requestError.cause || requestError
      console.error("LOGIN API ERROR:", error.response?.data || error.message)
      const responseData = error.response?.data
      const message = typeof responseData === 'string'
        ? responseData
        : responseData?.message || requestError.message
      setError(message || t('loginError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function changeLanguage(language) {
    await i18n.changeLanguage(language)
    localStorage.setItem('healthsetu_language', language)
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-healthcare-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -left-36 top-20 size-96 rounded-full bg-healthcare-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 size-[30rem] rounded-full bg-teal-200/25 blur-3xl" />

      <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-xl border border-white/80 bg-white/75 p-1 shadow-sm backdrop-blur sm:right-8 sm:top-7">
        {languages.map((language) => (
          <button
            key={language.code}
            type="button"
            onClick={() => changeLanguage(language.code)}
            aria-label={`Change language to ${language.name}`}
            aria-pressed={i18n.resolvedLanguage === language.code}
            className={`min-w-10 rounded-lg px-2.5 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${
              i18n.resolvedLanguage === language.code
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
            }`}
          >
            {language.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:px-12 lg:py-16">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="hidden max-w-xl lg:block"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-3.5 py-2 text-sm font-medium text-teal-800 shadow-sm">
            <span className="flex size-7 items-center justify-center rounded-full bg-teal-700 text-white">
              <Activity size={15} aria-hidden="true" />
            </span>
            {t('secureNetwork')}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/15">
              <Activity size={28} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-2xl font-bold tracking-tight text-slate-950">{t('brand')}</span>
              <span className="mt-0.5 block text-sm text-slate-500">{t('tagline')}</span>
            </span>
          </div>
          <h1 className="mt-12 text-5xl font-semibold leading-[1.12] tracking-tight text-slate-950 xl:text-6xl">
            Care, connected
            <span className="mt-2 block text-teal-700">across every mile.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Bringing local practitioners, medical students, and supervising specialists together around every patient.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
            <span className="flex size-10 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
              <ShieldCheck size={20} aria-hidden="true" />
            </span>
            A role-protected workspace for clinical teams
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="flex size-11 items-center justify-center rounded-xl bg-teal-700 text-white">
              <Activity size={23} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-bold text-slate-950">{t('brand')}</span>
              <span className="text-xs text-slate-500">{t('tagline')}</span>
            </span>
          </div>
          <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-[0_24px_80px_-30px_rgba(15,118,110,0.28)] backdrop-blur sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
                <LockKeyhole size={22} aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{t('welcome')}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t('loginSubtitle')}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block" htmlFor="login-email">
                <span className="mb-2 block text-sm font-medium text-slate-700">{t('email')}</span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  required
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  placeholder={t('emailPlaceholder')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                />
              </label>

              <label className="block" htmlFor="login-password">
                <span className="mb-2 block text-sm font-medium text-slate-700">{t('password')}</span>
                <span className="relative block">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                    placeholder={t('passwordPlaceholder')}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-600"
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </span>
              </label>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-800"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={!isSubmitting ? { y: -1 } : undefined}
                whileTap={!isSubmitting ? { scale: 0.99 } : undefined}
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/25 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                    {t('signingIn')}
                  </>
                ) : (
                  <>
                    {t('signIn')}
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-teal-700" aria-hidden="true" />
              {t('secureSession')}
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-slate-500">
            {t('noAccount')}{' '}
            <Link className="font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-900" to="/register">
              {t('createAccount')}
            </Link>
          </p>
        </motion.section>
      </div>
    </main>
  )
}

export default LoginPage
