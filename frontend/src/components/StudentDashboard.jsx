import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  HeartPulse,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Video,
} from 'lucide-react'
import { apiRequest } from '../lib/api'
import Feedback from './Feedback'

const emptySoap = { subjective: '', objective: '', assessment: '', plan: '' }

async function fetchPendingCases() {
  const result = await apiRequest('/api/v1/cases/pending')
  if (!Array.isArray(result)) throw new Error('The pending-case response was not a list.')
  return result
}

function StudentDashboard() {
  const [cases, setCases] = useState([])
  const [activeCaseId, setActiveCaseId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [queueError, setQueueError] = useState(null)
  const [soap, setSoap] = useState(emptySoap)
  const [soapFeedback, setSoapFeedback] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const reduceMotion = useReducedMotion()

  const activeCase = cases.find((item) => String(item.id) === activeCaseId)

  async function refreshQueue() {
    setIsRefreshing(true)
    try {
      const nextCases = await fetchPendingCases()
      setCases(nextCases)
      setQueueError(null)
      setActiveCaseId((current) => (
        nextCases.some((item) => String(item.id) === current) ? current : ''
      ))
    } catch (error) {
      setQueueError(error.message)
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isCurrent = true

    fetchPendingCases()
      .then((nextCases) => {
        if (!isCurrent) return
        setCases(nextCases)
        setQueueError(null)
      })
      .catch((error) => {
        if (isCurrent) setQueueError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => { isCurrent = false }
  }, [])

  function selectCase(caseItem) {
    setActiveCaseId(String(caseItem.id))
    setSoap(emptySoap)
    setSoapFeedback(null)
  }

  async function submitSoap(event) {
    event.preventDefault()
    if (!activeCase) return

    setIsSaving(true)
    setSoapFeedback({ type: 'loading', message: 'Saving clinical note…' })
    try {
      await apiRequest(`/api/v1/clinical/${encodeURIComponent(activeCase.id)}/soap`, {
        method: 'POST',
        body: JSON.stringify(soap),
      })
      setSoapFeedback({ type: 'success', message: 'SOAP note saved to this case.' })
    } catch (error) {
      setSoapFeedback({ type: 'error', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const vitals = [
    { label: 'Blood pressure', value: activeCase?.vitalsBp || '—', unit: 'mmHg', icon: Activity },
    { label: 'Pulse', value: activeCase?.vitalsPulse ?? '—', unit: 'bpm', icon: HeartPulse },
    { label: 'Temperature', value: activeCase?.vitalsTemp || '—', unit: '°C', icon: Activity },
    { label: 'SpO₂', value: activeCase?.vitalsSpo2 ?? '—', unit: '%', icon: HeartPulse },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">MBBS student portal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Clinical workspace</h1>
          <p className="mt-2 text-sm text-slate-600">Select a patient from the queue to begin consultation.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
          <ShieldCheck size={15} aria-hidden="true" /> Student workspace
        </span>
      </header>

      <div className="grid min-h-[620px] gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-emerald-900/5" aria-labelledby="patient-queue-heading">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 id="patient-queue-heading" className="font-semibold text-slate-900">Patient queue</h2>
              <p className="mt-1 text-xs text-slate-500">Patients awaiting review</p>
            </div>
            <button
              type="button"
              onClick={refreshQueue}
              disabled={isRefreshing}
              aria-label="Refresh patient queue"
              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15 disabled:opacity-50"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {queueError && <Feedback feedback={{ type: 'error', message: `Could not load cases: ${queueError}` }} />}
            {isLoading ? (
              <div className="space-y-3 p-1" role="status" aria-label="Loading patient queue">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="animate-pulse rounded-2xl border border-slate-100 p-4">
                    <div className="h-4 w-32 rounded bg-slate-100" />
                    <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : !queueError && cases.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <HeartPulse size={22} aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-800">Queue is clear</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">New triaged patients will appear here.</p>
              </div>
            ) : (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                className="space-y-2"
              >
                {cases.map((caseItem) => {
                  const selected = String(caseItem.id) === activeCaseId
                  return (
                    <motion.li
                      key={caseItem.id}
                      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => selectCase(caseItem)}
                        aria-pressed={selected}
                        whileHover={reduceMotion ? undefined : { scale: 1.015, y: -1 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        className={`w-full rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15 ${
                          selected
                            ? 'border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                            : 'border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-white text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                            <UserRound size={18} aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-slate-900">{caseItem.patientName || 'Patient'}</span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {caseItem.patientAge ?? '—'} years · {caseItem.patientGender || 'Not specified'}
                            </span>
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">#{caseItem.id}</span>
                        </div>
                        <span className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                          {caseItem.status || 'TRIAGED'}
                        </span>
                        <span className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-emerald-800">
                          <span className="relative flex size-1.5">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                            <span className="relative size-1.5 rounded-full bg-emerald-600" />
                          </span>
                          Case ready for review
                        </span>
                      </motion.button>
                    </motion.li>
                  )
                })}
              </motion.ul>
            )}
          </div>
          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">
            {cases.length} {cases.length === 1 ? 'patient' : 'patients'} in queue
          </div>
        </aside>

        <AnimatePresence mode="wait" initial={false}>
          {activeCase ? (
            <motion.main
              key={activeCase.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="min-w-0 space-y-5"
            >
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl shadow-emerald-900/5 sm:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Active patient · Case #{activeCase.id}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">{activeCase.patientName}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeCase.patientAge ?? 'Age not recorded'} years · {activeCase.patientGender || 'Gender not recorded'}
                  </p>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-2">
                  <section aria-labelledby="patient-vitals-heading">
                    <h3 id="patient-vitals-heading" className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <HeartPulse size={16} className="text-emerald-700" aria-hidden="true" /> Patient vitals
                    </h3>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
                      className="grid grid-cols-2 gap-2.5"
                    >
                      {vitals.map((vital) => {
                        const Icon = vital.icon
                        return (
                          <motion.article
                            key={vital.label}
                            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
                          >
                            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <Icon size={14} className="text-emerald-700" aria-hidden="true" /> {vital.label}
                            </p>
                            <p className="mt-2 text-xl font-bold text-slate-900">
                              {vital.value}
                              {vital.value !== '—' && <span className="ml-1 text-[10px] font-medium text-slate-500">{vital.unit}</span>}
                            </p>
                          </motion.article>
                        )
                      })}
                    </motion.div>
                    <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">Reported symptoms</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {activeCase.rawSymptoms || 'No symptoms recorded.'}
                      </p>
                    </div>
                  </section>

                  <section aria-labelledby="consultation-video-heading">
                    <h3 id="consultation-video-heading" className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-slate-800">
                      <span className="flex items-center gap-2"><Video size={16} className="text-emerald-700" aria-hidden="true" /> Consultation room</span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative size-2 rounded-full bg-emerald-500" />
                        </span>
                        {activeCase.webrtcRoomId ? 'Room ready' : 'Awaiting RMP'}
                      </span>
                    </h3>
                    <div className="relative flex aspect-video min-h-48 flex-col items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-5 text-center shadow-inner shadow-slate-950/20">
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(52,211,153,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/50 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-200 backdrop-blur">
                        <Activity size={11} aria-hidden="true" /> Clinical signal
                      </div>
                      <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-slate-950/50 px-2.5 py-1.5 text-[9px] font-medium text-slate-200 backdrop-blur">
                        {activeCase.webrtcRoomId ? `Room ${activeCase.webrtcRoomId}` : 'Secure room pending'}
                      </div>
                      <motion.div
                        aria-hidden="true"
                        className="absolute inset-x-[12%] top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
                        animate={reduceMotion ? undefined : { opacity: [0.25, 0.8, 0.25], scaleX: [0.88, 1, 0.88] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <svg viewBox="0 0 320 70" className="absolute inset-x-[10%] top-[42%] h-14 w-[80%] opacity-80" role="img" aria-label="Decorative clinical waveform">
                        <path d="M0 36 H82 L101 36 L113 29 L123 43 L139 9 L155 61 L172 30 L187 36 H320" fill="none" stroke="#34d399" strokeOpacity=".25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <motion.path
                          d="M0 36 H82 L101 36 L113 29 L123 43 L139 9 L155 61 L172 30 L187 36 H320"
                          fill="none"
                          stroke="#6ee7b7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={reduceMotion ? { pathLength: 1 } : { pathLength: [0, 1] }}
                          transition={reduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: 'linear' }}
                        />
                      </svg>
                      <span className="relative z-10 mt-7 flex size-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 shadow-lg shadow-emerald-500/10 backdrop-blur">
                        <Video size={19} aria-hidden="true" />
                      </span>
                      <p className="relative z-10 mt-2 text-xs font-semibold text-white">WebRTC video preview</p>
                      <p className="relative z-10 mt-1 text-[10px] text-slate-300">
                        Video placeholder · patient data is available for review
                      </p>
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        {vitals.slice(0, 3).map((vital) => (
                          <div key={vital.label} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950/55 px-2 py-1.5 text-left backdrop-blur">
                            <p className="truncate text-[8px] font-medium text-slate-400">{vital.label}</p>
                            <p className="mt-0.5 truncate text-[10px] font-bold text-emerald-200">{vital.value}{vital.value !== '—' ? ` ${vital.unit}` : ''}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl shadow-emerald-900/5 sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <HeartPulse size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-slate-900">Clinical workspace</h2>
                    <p className="mt-1 text-xs text-slate-500">Document a SOAP note for this case.</p>
                  </div>
                </div>
                <form onSubmit={submitSoap}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ['subjective', 'Subjective'],
                      ['objective', 'Objective'],
                      ['assessment', 'Assessment'],
                      ['plan', 'Plan'],
                    ].map(([key, label]) => (
                      <label className="block" htmlFor={`soap-${key}`} key={key}>
                        <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
                        <textarea
                          id={`soap-${key}`}
                          rows="3"
                          value={soap[key]}
                          onChange={(event) => setSoap((current) => ({ ...current, [key]: event.target.value }))}
                          required
                          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </label>
                    ))}
                  </div>
                  <Feedback feedback={soapFeedback} />
                  <motion.button
                    type="submit"
                    disabled={isSaving}
                    whileHover={reduceMotion || isSaving ? undefined : { y: -1 }}
                    whileTap={reduceMotion || isSaving ? undefined : { scale: 0.99 }}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-wait disabled:opacity-50"
                  >
                    {isSaving ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                    {isSaving ? 'Saving note…' : 'Save SOAP note'}
                  </motion.button>
                </form>
              </section>
            </motion.main>
          ) : (
            <motion.section
              key="empty-workspace"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              className="flex min-h-[480px] flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center shadow-xl shadow-emerald-900/5"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <HeartPulse size={30} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">Select a patient from the queue</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Patient vitals and the clinical workspace will appear here when you choose a case.
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StudentDashboard
