import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardPlus,
  Droplets,
  HeartPulse,
  LoaderCircle,
  Send,
  ShieldCheck,
  Stethoscope,
  Thermometer,
} from 'lucide-react'
import { apiRequest } from '../lib/api'
import Feedback from './Feedback'

const initialValues = {
  patientName: '',
  patientAge: '',
  patientGender: '',
  vitalsBp: '',
  vitalsPulse: '',
  vitalsTemp: '',
  vitalsSpo2: '',
  rawSymptoms: '',
}

const steps = [
  { title: 'Patient details', description: 'Start with the patient’s basic information.', icon: Stethoscope },
  { title: 'Vital signs', description: 'Record current measurements and observations.', icon: HeartPulse },
  { title: 'Symptoms', description: 'Capture what brings the patient in today.', icon: ClipboardPlus },
]

const inputClass =
  'peer w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 pb-2 pt-6 text-sm text-slate-900 outline-none transition placeholder:text-transparent focus:border-emerald-500 focus:ring-0 disabled:opacity-60'
const floatingLabelClass =
  'pointer-events-none absolute left-0 top-1 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-emerald-700'

function RmpDashboard() {
  const [values, setValues] = useState(initialValues)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [feedback, setFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedVital, setFocusedVital] = useState('')
  const stepFields = useRef(null)
  const reduceMotion = useReducedMotion()
  const StepIcon = steps[step].icon

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function moveToNextStep() {
    const fields = stepFields.current?.querySelectorAll('input, select, textarea')
    const invalidField = Array.from(fields || []).find((field) => !field.checkValidity())
    if (invalidField) {
      invalidField.reportValidity()
      return
    }
    setDirection(1)
    setFeedback(null)
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (step < steps.length - 1) {
      moveToNextStep()
      return
    }

    setIsSubmitting(true)
    setFeedback({ type: 'loading', message: 'Submitting patient intake…' })

    const payload = {
      patientName: values.patientName.trim(),
      patientAge: Number(values.patientAge),
      patientGender: values.patientGender,
      vitalsBp: values.vitalsBp.trim(),
      vitalsPulse: Number(values.vitalsPulse),
      vitalsTemp: values.vitalsTemp.trim(),
      vitalsSpo2: Number(values.vitalsSpo2),
      rawSymptoms: values.rawSymptoms.trim(),
    }

    try {
      const createdCase = await apiRequest('/api/v1/cases/intake/1', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setFeedback({
        type: 'success',
        message: `Patient intake submitted${createdCase?.id ? ` as case #${createdCase.id}` : ''}.`,
      })
      setValues(initialValues)
      setStep(0)
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">RMP workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">New patient intake</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Capture patient details and clinical observations to start a connected-care case.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm sm:self-auto">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Ready to submit · RMP #1
        </div>
      </motion.section>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-emerald-900/5">
        <div className="border-b border-slate-100 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <StepIcon size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Step {step + 1} of {steps.length}</p>
                <p className="mt-0.5 text-xs text-slate-500">{steps[step].title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>
              {steps.map((item, index) => (
                <span
                  key={item.title}
                  className={`h-1.5 w-10 rounded-full transition-colors sm:w-16 ${index <= step ? 'bg-emerald-600' : 'bg-slate-100'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-[330px] px-5 py-7 sm:px-8 sm:py-9" ref={stepFields}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={step}
              initial={reduceMotion ? false : { opacity: 0, x: direction * 34, y: direction * 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: direction * -34, y: direction * -5 }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
              aria-labelledby="wizard-step-title"
            >
              <h2 id="wizard-step-title" className="text-xl font-semibold text-slate-900">{steps[step].title}</h2>
              <p className="mt-1 text-sm text-slate-500">{steps[step].description}</p>

              {step === 0 && (
                <div className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                  <label className="relative block" htmlFor="patientName">
                    <input id="patientName" name="patientName" value={values.patientName} onChange={update} autoComplete="name" placeholder="Patient name" required className={inputClass} />
                    <span className={floatingLabelClass}>Patient name</span>
                  </label>
                  <label className="relative block" htmlFor="patientAge">
                    <input id="patientAge" name="patientAge" type="number" min="0" max="130" inputMode="numeric" value={values.patientAge} onChange={update} placeholder="Age" required className={inputClass} />
                    <span className={floatingLabelClass}>Age (years)</span>
                  </label>
                  <label className="block sm:col-span-2" htmlFor="patientGender">
                    <span className="mb-2 block text-xs font-medium text-slate-500">Gender</span>
                    <select
                      id="patientGender"
                      name="patientGender"
                      value={values.patientGender}
                      onChange={update}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </label>
                </div>
              )}

              {step === 1 && (
                <fieldset className="mt-7">
                  <legend className="sr-only">Vital signs</legend>
                  <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                    {[
                      { id: 'vitalsBp', label: 'Blood pressure (mmHg)', placeholder: 'Blood pressure', Icon: Activity },
                      { id: 'vitalsPulse', label: 'Pulse (bpm)', placeholder: 'Pulse', type: 'number', min: 0, inputMode: 'numeric', Icon: HeartPulse },
                      { id: 'vitalsTemp', label: 'Temperature (°C)', placeholder: 'Temperature', type: 'number', step: '0.1', inputMode: 'decimal', Icon: Thermometer },
                      { id: 'vitalsSpo2', label: 'SpO₂ (%)', placeholder: 'SpO2', type: 'number', min: 0, max: 100, inputMode: 'numeric', Icon: Droplets },
                    ].map(({ id, label, placeholder, type = 'text', Icon, ...inputProps }) => (
                      <label
                        key={id}
                        className="relative block"
                        htmlFor={id}
                        onFocus={() => setFocusedVital(id)}
                        onBlur={(event) => {
                          if (!event.currentTarget.contains(event.relatedTarget)) setFocusedVital('')
                        }}
                      >
                        <input
                          id={id}
                          name={id}
                          type={type}
                          value={values[id]}
                          onChange={update}
                          placeholder={placeholder}
                          required
                          {...inputProps}
                          className={inputClass}
                        />
                        <span className={floatingLabelClass}>{label}</span>
                        <motion.span
                          aria-hidden="true"
                          animate={focusedVital === id ? { y: [0, -3, 0], scale: [1, 1.08, 1] } : { y: 0, scale: 1 }}
                          transition={focusedVital === id ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                          className={`absolute right-0 top-3 ${focusedVital === id ? 'text-emerald-600' : 'text-slate-300'}`}
                        >
                          <Icon size={17} />
                        </motion.span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <label className="mt-7 block" htmlFor="rawSymptoms">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Patient’s symptoms</span>
                  <span className="mb-3 block text-xs text-slate-500">Describe the symptoms in the patient’s own words where possible.</span>
                  <textarea
                    id="rawSymptoms"
                    name="rawSymptoms"
                    rows="7"
                    value={values.rawSymptoms}
                    onChange={update}
                    placeholder="What brings the patient in today?"
                    required
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-8">
          <Feedback feedback={feedback} />
          <AnimatePresence mode="wait">
            {(feedback?.type === 'loading' || feedback?.type === 'success') && (
              <motion.div
                key={feedback.type}
                initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                className={`mb-4 flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  feedback.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-teal-100 bg-white text-slate-700'
                }`}
                role="status"
                aria-live="polite"
              >
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                  feedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-50 text-teal-700'
                }`}>
                  {feedback.type === 'success' ? (
                    <motion.span initial={reduceMotion ? false : { scale: 0.4, rotate: -35 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                      <Check size={18} aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={reduceMotion ? undefined : { x: [0, 7, 14], y: [0, -5, -12], opacity: [1, 1, 0.35], rotate: [0, -12, -20] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Send size={17} aria-hidden="true" />
                    </motion.span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold">
                    {feedback.type === 'success' ? 'Checked in to the network' : 'Sending to the care network'}
                  </span>
                  <span className="mt-0.5 block text-[11px] opacity-75">
                    {feedback.type === 'success' ? 'Patient intake is ready for clinical review.' : 'Securely sharing patient details and vitals…'}
                  </span>
                </span>
                {feedback.type === 'loading' && <LoaderCircle size={15} className="animate-spin text-teal-700" aria-hidden="true" />}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-emerald-700" aria-hidden="true" />
              Intake is submitted securely to the Health-Setu API.
            </p>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => { setDirection(-1); setFeedback(null); setStep((current) => current - 1) }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15"
                >
                  <ArrowLeft size={16} aria-hidden="true" /> Back
                </button>
              )}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={reduceMotion || isSubmitting ? undefined : { y: -1 }}
                whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.98 }}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> Submitting…</>
                ) : step === steps.length - 1 ? (
                  <><Check size={17} aria-hidden="true" /> Submit to Network</>
                ) : (
                  <>Continue <ArrowRight size={16} aria-hidden="true" /></>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RmpDashboard
