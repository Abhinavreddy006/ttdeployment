import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  ArrowDownUp,
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Fingerprint,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wifi,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api, { apiRequest } from '../lib/api'

const SIGNING_FEEDBACK_MS = 1250

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
}

function formatAge(age) {
  return age === null || age === undefined || age === '' ? 'Age not recorded' : `${age} years`
}

function CaseCard({ consultationCase, signing, signed, onSign, index, reduceMotion, t }) {
  const patientName = consultationCase.patientName || 'Patient'
  const initials = patientName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <motion.li variants={cardVariants} className="list-none">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-emerald-900/5 transition duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/10 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-base font-semibold tracking-wide text-emerald-800">
              {initials || <Activity size={20} aria-hidden="true" />}
              <span className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{patientName}</h2>
                <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-800">
                  CASE {consultationCase.id}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-500">
                <span>{formatAge(consultationCase.patientAge)}</span>
                {consultationCase.patientGender && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{consultationCase.patientGender}</span>
                  </>
                )}
                {consultationCase.department && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1.5"><Stethoscope size={12} aria-hidden="true" />{consultationCase.department}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              signed
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}>
              {signed ? <BadgeCheck size={14} aria-hidden="true" /> : <Clock3 size={13} aria-hidden="true" />}
              {signed ? t('professor.signed') : (consultationCase.status || t('professor.awaitingReview'))}
            </span>
            <motion.button
              type="button"
              onClick={() => onSign(consultationCase.id)}
              disabled={signing || signed}
              whileHover={!reduceMotion && !signing && !signed ? { scale: 1.025, y: -1 } : undefined}
              whileTap={!reduceMotion && !signing && !signed ? { scale: 0.98 } : undefined}
              className={`inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed ${
                signed
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-900/15 disabled:opacity-70'
              }`}
              aria-label={signed ? `Prescription for case ${consultationCase.id} signed` : `Cryptographically sign prescription for case ${consultationCase.id}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {signed ? (
                  <motion.span key="signed" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2">
                    <BadgeCheck size={16} aria-hidden="true" />
                    {t('professor.signatureVerified')}
                  </motion.span>
                ) : signing ? (
                  <motion.span key="scanning" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2">
                    <span className="relative inline-flex size-5 items-center justify-center">
                      <Fingerprint size={19} className="animate-soft-pulse text-white" aria-hidden="true" />
                      <span className="absolute left-0 right-0 top-0 h-px animate-scan-line bg-white shadow-[0_0_8px_rgba(255,255,255,.9)]" />
                    </span>
                    {t('professor.securingSignature')}
                  </motion.span>
                ) : (
                  <motion.span key="sign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                    <LockKeyhole size={15} aria-hidden="true" />
                    {t('professor.cryptographicallySign')}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Activity size={12} className="text-emerald-700" aria-hidden="true" />
              Clinical summary
            </p>
            <p className={`text-sm leading-6 ${consultationCase.rawSymptoms ? 'text-slate-700' : 'italic text-slate-500'}`}>
              {consultationCase.rawSymptoms || 'No symptom summary was included with this case.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
            {consultationCase.vitalsBp && <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">BP <b className="ml-1 font-semibold text-slate-900">{consultationCase.vitalsBp}</b></span>}
            {consultationCase.vitalsPulse !== null && consultationCase.vitalsPulse !== undefined && <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">PULSE <b className="ml-1 font-semibold text-slate-900">{consultationCase.vitalsPulse}</b></span>}
            {consultationCase.vitalsSpo2 !== null && consultationCase.vitalsSpo2 !== undefined && <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">SpO₂ <b className="ml-1 font-semibold text-slate-900">{consultationCase.vitalsSpo2}%</b></span>}
            <span className="sr-only">Queue item {index + 1}</span>
          </div>
        </div>
      </article>
    </motion.li>
  )
}

function QueueSkeleton({ t }) {
  return (
    <div className="space-y-4" aria-label="Loading cases" role="status">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-emerald-900/5">
          <div className="flex items-start gap-4">
            <div className="size-14 shrink-0 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-44 rounded-full bg-slate-100" />
              <div className="h-3 w-56 max-w-full rounded-full bg-slate-100" />
              <div className="mt-5 h-3 w-full max-w-2xl rounded-full bg-slate-100" />
            </div>
            <div className="hidden h-11 w-48 rounded-xl bg-slate-100 sm:block" />
          </div>
        </div>
      ))}
      <span className="sr-only">{t('professor.loading')}</span>
    </div>
  )
}

function ProfessorReviewQueue() {
  const { t } = useTranslation()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [signingCaseId, setSigningCaseId] = useState(null)
  const [signedCaseIds, setSignedCaseIds] = useState([])
  const reduceMotion = useReducedMotion()

  const fetchCases = useCallback(async () => {
    const result = await apiRequest('/api/v1/cases/rmp/1')
    return Array.isArray(result) ? result : []
  }, [])

  const loadCases = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')

    try {
      setCases(await fetchCases())
    } catch (requestError) {
      setError(requestError.message || 'Unable to load the review queue.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [fetchCases])

  useEffect(() => {
    let isCurrent = true
    fetchCases()
      .then((result) => {
        if (isCurrent) setCases(result)
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || 'Unable to load the review queue.')
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => { isCurrent = false }
  }, [fetchCases])

  async function signPrescription(caseId) {
    setSigningCaseId(caseId)
    setError('')
    try {
      await Promise.all([
        api.put(`/api/v1/clinical/${encodeURIComponent(caseId)}/prescription/sign/2`),
        wait(SIGNING_FEEDBACK_MS),
      ])
      setSignedCaseIds((current) => current.includes(caseId) ? current : [...current, caseId])
    } catch (requestError) {
      const responseMessage = requestError.response?.data
      setError(
        (typeof responseMessage === 'string' && responseMessage) ||
          responseMessage?.message ||
          requestError.message ||
          t('professor.signError', { caseId }),
      )
    } finally {
      setSigningCaseId(null)
    }
  }

  const signedCount = signedCaseIds.length

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
              </span>
              {t('professor.workspace')}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t('professor.review')} <span className="text-emerald-700">{t('professor.prescriptions')}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              {t('professor.subtitle')}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => loadCases(true)}
            disabled={refreshing || loading}
            whileHover={reduceMotion ? undefined : { scale: 1.025 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15 disabled:cursor-wait disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
            {refreshing ? t('professor.synchronizing') : t('professor.refresh')}
          </motion.button>
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-3" aria-label="Review queue summary">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-emerald-900/5">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-slate-500">{t('professor.casesInQueue')}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{loading ? '—' : cases.length.toString().padStart(2, '0')}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-emerald-900/5">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-slate-500">{t('professor.awaitingSignature')}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-700">{loading ? '—' : Math.max(0, cases.length - signedCount).toString().padStart(2, '0')}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-emerald-900/5">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-slate-500">{t('professor.secureConnection')}</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-700"><Wifi size={16} aria-hidden="true" /> {t('professor.apiConnected')}</p>
          </div>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{t('professor.pendingDrafts')}</h2>
            <p className="mt-1 text-xs text-slate-600">{t('professor.reviewPrompt')}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowDownUp size={13} aria-hidden="true" /> {t('professor.latestCases')}
          </span>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>
            <button type="button" onClick={() => loadCases()} className="inline-flex items-center gap-1.5 self-start font-semibold text-rose-800 underline underline-offset-4 hover:text-rose-950 sm:self-auto">
              Try again <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          </motion.div>
        )}

        {loading ? (
          <QueueSkeleton t={t} />
        ) : cases.length === 0 ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-lg shadow-emerald-900/5"
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Sparkles size={23} aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{t('professor.queueClear')}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{t('professor.emptyDescription')}</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs leading-5 text-amber-800">
              <ShieldCheck size={15} className="shrink-0 text-amber-700" aria-hidden="true" />
              {t('professor.demoNotice')}
            </div>
            <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-4">
              {cases.map((consultationCase, index) => (
                <CaseCard
                  key={consultationCase.id}
                  consultationCase={consultationCase}
                  index={index}
                  signing={signingCaseId === consultationCase.id}
                  signed={signedCaseIds.includes(consultationCase.id)}
                  onSign={signPrescription}
                  reduceMotion={reduceMotion}
                  t={t}
                />
              ))}
            </motion.ul>
          </>
        )}

        <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck size={14} className="text-emerald-700" aria-hidden="true" />
          {t('professor.signatureFooter')}
        </div>
      </motion.div>
    </div>
  )
}

export default ProfessorReviewQueue
