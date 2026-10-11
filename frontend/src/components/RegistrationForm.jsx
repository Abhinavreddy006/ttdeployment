import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building2,
  Stethoscope,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Loader2,
  MapPin,
} from 'lucide-react'
import { apiRequest } from '../lib/api'

const roles = [
  {
    id: 'RMP',
    title: 'Rural Practitioner',
    subtitle: 'Primary care & patient intake',
    icon: Stethoscope,
    fieldLabel: 'Clinic location',
    fieldPlaceholder: 'e.g. Warangal Community Health Center',
    fieldIcon: MapPin,
    badge: 'Frontline Care',
  },
  {
    id: 'STUDENT',
    title: 'Medical Student',
    subtitle: 'MBBS clinical learning & SOAP',
    icon: GraduationCap,
    fieldLabel: 'Medical college',
    fieldPlaceholder: 'e.g. Osmania Medical College',
    fieldIcon: Building2,
    badge: 'Clinical Queue',
  },
  {
    id: 'SUPERVISING_PROFESSOR',
    title: 'Supervising Professor',
    subtitle: 'Case review & prescription sign-off',
    icon: UserCheck,
    fieldLabel: 'Institution / Hospital',
    fieldPlaceholder: 'e.g. Gandhi Medical Hospital',
    fieldIcon: Building2,
    badge: 'Senior Faculty',
  },
]

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'bg-slate-700' }
  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 8) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  switch (score) {
    case 1:
      return { score: 25, label: 'Weak', color: 'bg-rose-500' }
    case 2:
      return { score: 50, label: 'Fair', color: 'bg-amber-500' }
    case 3:
      return { score: 75, label: 'Good', color: 'bg-teal-400' }
    case 4:
      return { score: 100, label: 'Strong', color: 'bg-emerald-400' }
    default:
      return { score: 0, label: '', color: 'bg-slate-700' }
  }
}

function RegistrationForm() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('RMP')
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    department: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState(null)

  const activeRoleConfig = roles.find((r) => r.id === selectedRole) || roles[0]
  const passwordStrength = getPasswordStrength(formValues.password)

  function handleChange(e) {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    const isRmp = selectedRole === 'RMP'
    const isStudent = selectedRole === 'STUDENT'

    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      passwordHash: formValues.password,
      role: selectedRole,
      clinicLocation: isRmp ? formValues.institution.trim() : null,
      college: !isRmp ? formValues.institution.trim() : null,
      department: formValues.department.trim(),
    }

    try {
      const response = await apiRequest('/api/v1/users/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setSuccessData(response || { success: true })
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Background Animated Atmosphere */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-teal-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[42rem] w-[42rem] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-600/10 blur-[130px]" />

      {/* Decorative Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Top Navbar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-12">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 rounded-full border border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur transition hover:border-teal-500/50 hover:bg-slate-900 hover:text-white"
        >
          <ArrowLeft size={14} className="transition group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Already registered?</span>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-semibold text-teal-400 transition hover:text-teal-300 hover:underline"
          >
            <span>Sign In</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-4 sm:px-8 lg:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Brand Context & Feature Showcase (Hidden on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="hidden lg:col-span-5 lg:block lg:pt-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300">
              <Sparkles size={13} className="text-teal-400" />
              <span>Verified Health Network</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-lg shadow-teal-500/25">
                <Activity size={26} strokeWidth={2.4} />
              </span>
              <div>
                <span className="block text-2xl font-bold tracking-tight text-white">Health-Setu</span>
                <span className="block text-xs font-medium text-teal-300/80">Clinical Collaboration Portal</span>
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-extrabold leading-[1.18] tracking-tight text-white xl:text-5xl">
              Join the future of
              <span className="mt-1 block bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                connected care.
              </span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-slate-400">
              Health-Setu unites rural practitioners, medical students, and supervising faculty into one synchronized workspace for seamless care delivery.
            </p>

            {/* Feature Highlights Cards */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 backdrop-blur-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Point-of-Care Intake</h2>
                  <p className="text-xs text-slate-400">Streamlined rural patient consultations with AI assistance</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 backdrop-blur-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Supervised Validation</h2>
                  <p className="text-xs text-slate-400">Senior professors sign off on digital prescriptions</p>
                </div>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-10 flex items-center gap-2 text-xs text-slate-500">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aiven Cloud Encrypted MySQL Database Active</span>
            </div>
          </motion.div>

          {/* Right Column: Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/75 p-6 shadow-2xl shadow-teal-950/40 backdrop-blur-2xl sm:p-10">
              {/* Card Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Create your account</h2>
                <p className="mt-1.5 text-sm text-slate-400">
                  Select your role to configure your clinical workspace.
                </p>
              </div>

              {/* Success View */}
              {successData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center"
                >
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={34} strokeWidth={2.5} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-white">Registration Successful!</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Your account has been created on the Health-Setu network.
                  </p>

                  <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left text-xs text-slate-400">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Full Name</span>
                      <span className="font-semibold text-slate-200">{formValues.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-slate-800/60">
                      <span className="text-slate-500">Email Address</span>
                      <span className="font-semibold text-slate-200">{formValues.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-slate-800/60">
                      <span className="text-slate-500">Assigned Role</span>
                      <span className="font-semibold text-teal-400">{selectedRole}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:from-teal-400 hover:to-emerald-400 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
                    >
                      <span>Proceed to Sign In</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessData(null)
                        setFormValues({ name: '', email: '', password: '', institution: '', department: '' })
                      }}
                      className="rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Register Another User
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Interactive Role Switcher Cards */}
                  <div>
                    <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Choose Account Role
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {roles.map((role) => {
                        const Icon = role.icon
                        const isSelected = selectedRole === role.id
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id)}
                            className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                              isSelected
                                ? 'border-teal-500/80 bg-teal-500/10 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/40'
                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70'
                            }`}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span
                                className={`flex size-9 items-center justify-center rounded-xl transition ${
                                  isSelected
                                    ? 'bg-teal-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                                }`}
                              >
                                <Icon size={18} strokeWidth={2.2} />
                              </span>
                              <span
                                className={`text-[10px] font-semibold uppercase tracking-wider ${
                                  isSelected ? 'text-teal-300' : 'text-slate-500'
                                }`}
                              >
                                {role.badge}
                              </span>
                            </div>
                            <span className="mt-3 block text-sm font-bold text-white">{role.title}</span>
                            <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">
                              {role.subtitle}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid gap-4.5 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300" htmlFor="name">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <User size={16} />
                        </span>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formValues.name}
                          onChange={handleChange}
                          placeholder="Dr. Abhinav Reddy"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-teal-500 focus:bg-slate-950 focus:ring-4 focus:ring-teal-500/10"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <Mail size={16} />
                        </span>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formValues.email}
                          onChange={handleChange}
                          placeholder="doctor@healthsetu.org"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-teal-500 focus:bg-slate-950 focus:ring-4 focus:ring-teal-500/10"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-300" htmlFor="password">
                          Password
                        </label>
                        {formValues.password && (
                          <span className="text-[11px] font-medium text-slate-400">
                            Strength: <span className="font-semibold text-teal-400">{passwordStrength.label}</span>
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <Lock size={16} />
                        </span>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={formValues.password}
                          onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-teal-500 focus:bg-slate-950 focus:ring-4 focus:ring-teal-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition hover:text-slate-300 focus:outline-none"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Password strength bar */}
                      {formValues.password && (
                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.score}%` }}
                            transition={{ duration: 0.25 }}
                            className={`h-full ${passwordStrength.color}`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Dynamic Role-specific Field (Clinic location / Medical College) */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300" htmlFor="institution">
                        {activeRoleConfig.fieldLabel}
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <activeRoleConfig.fieldIcon size={16} />
                        </span>
                        <input
                          id="institution"
                          name="institution"
                          type="text"
                          required
                          value={formValues.institution}
                          onChange={handleChange}
                          placeholder={activeRoleConfig.fieldPlaceholder}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-teal-500 focus:bg-slate-950 focus:ring-4 focus:ring-teal-500/10"
                        />
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300" htmlFor="department">
                        Clinical Department
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <Building2 size={16} />
                        </span>
                        <input
                          id="department"
                          name="department"
                          type="text"
                          required
                          value={formValues.department}
                          onChange={handleChange}
                          placeholder="e.g. Internal Medicine, Cardiology"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-teal-500 focus:bg-slate-950 focus:ring-4 focus:ring-teal-500/10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Notification Alert */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300"
                      >
                        <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
                        <span className="leading-relaxed">{errorMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 transition focus:outline-none focus:ring-4 focus:ring-teal-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-slate-950" />
                        <span>Creating Clinical Account…</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </motion.button>

                  {/* Security Notice Footer */}
                  <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500">
                    <ShieldCheck size={14} className="text-teal-400" />
                    <span>Protected by Spring Security JWT & Aiven MySQL Encryption</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default RegistrationForm
