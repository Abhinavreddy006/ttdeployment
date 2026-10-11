import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BrainCircuit,
  Cross,
  HeartPulse,
  LockKeyhole,
  Microscope,
  Pill,
  Radio,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Video,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'

const workflow = [
  {
    number: '01',
    title: 'Rural RMP Triage',
    description: 'Capture vitals, symptoms, and the patient story at the point of care.',
    detail: 'Local context, carefully recorded',
    icon: Stethoscope,
  },
  {
    number: '02',
    title: 'MBBS Video Consult',
    description: 'Connect the RMP and a medical student in a shared clinical room.',
    detail: 'Real-time, collaborative review',
    icon: Video,
  },
  {
    number: '03',
    title: 'Professor Signature',
    description: 'Prepare a treatment draft for secure supervising-professor approval.',
    detail: 'Accountable clinical oversight',
    icon: ShieldCheck,
  },
]

const features = [
  {
    icon: Video,
    title: 'WebRTC Live Video',
    description: 'Bring practitioners and clinical learners together for face-to-face consultation.',
    tag: 'Connected consults',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Generated SOAP Notes',
    description: 'Turn clinical context into structured notes that are ready to review and refine.',
    tag: 'Structured insight',
  },
  {
    icon: LockKeyhole,
    title: 'Cryptographic Prescriptions',
    description: 'Support a clear approval workflow with securely signed prescription drafts.',
    tag: 'Verified workflow',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.04 } },
}

function CareNetworkVisualizer({ reduceMotion }) {
  return (
    <motion.div
      className="relative mx-auto w-full overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/[0.04]"
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src="/images/doctor-patient-consultation.jpg"
        alt="Doctor speaking with a patient during a consultation"
        className="aspect-[1.32/1] w-full object-cover object-center sm:aspect-[1.4/1]"
        loading="eager"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-white/10"
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full border border-white/40 bg-white/10 backdrop-blur-[1px]"
        animate={reduceMotion ? undefined : { scale: [0.96, 1.04, 0.96], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]" />
    </motion.div>
  )
}

function CustomCursor({ reduceMotion }) {
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const x = useSpring(pointerX, { stiffness: 500, damping: 38, mass: 0.35 })
  const y = useSpring(pointerY, { stiffness: 500, damping: 38, mass: 0.35 })
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const moveCursor = (event) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
    }
    const updateInteractiveTarget = (event) => {
      setIsInteractive(Boolean(event.target.closest('a, button, [role="button"]')))
    }
    const clearInteractiveTarget = (event) => {
      if (!event.relatedTarget || !event.relatedTarget.closest?.('a, button, [role="button"]')) {
        setIsInteractive(false)
      }
    }

    document.addEventListener('pointermove', moveCursor)
    document.addEventListener('pointerover', updateInteractiveTarget)
    document.addEventListener('pointerout', clearInteractiveTarget)

    return () => {
      document.removeEventListener('pointermove', moveCursor)
      document.removeEventListener('pointerover', updateInteractiveTarget)
      document.removeEventListener('pointerout', clearInteractiveTarget)
    }
  }, [pointerX, pointerY, reduceMotion])

  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-400/20 md:flex"
      style={{ x, y }}
      animate={{
        width: isInteractive ? 38 : 10,
        height: isInteractive ? 38 : 10,
        opacity: 1,
        backgroundColor: isInteractive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(16, 185, 129, 0.95)',
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      {isInteractive && <span className="size-1.5 rounded-full bg-emerald-600" />}
    </motion.div>
  )
}

function FloatingMedicalIcons({ reduceMotion }) {
  const items = [
    { Icon: Stethoscope, className: 'left-[7%] top-[17%]', delay: 0 },
    { Icon: Syringe, className: 'right-[10%] top-[18%]', delay: 0.8 },
    { Icon: Cross, className: 'left-[12%] bottom-[18%]', delay: 1.5 },
    { Icon: Pill, className: 'right-[8%] bottom-[15%]', delay: 0.4 },
    { Icon: Microscope, className: 'right-[26%] top-[9%]', delay: 1.1 },
  ]

  return items.map(({ Icon, className, delay }, index) => (
    <motion.div
      key={className}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className} text-emerald-200`}
      animate={reduceMotion ? undefined : { y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
      transition={{
        duration: 6 + (index % 3) * 0.7,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Icon size={index === 4 ? 30 : 38} strokeWidth={1.35} />
    </motion.div>
  ))
}

function LandingPage() {
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const pointerTiltX = useMotionValue(0)
  const pointerTiltY = useMotionValue(0)
  const rotateX = useSpring(pointerTiltX, { stiffness: 120, damping: 18, mass: 0.45 })
  const rotateY = useSpring(pointerTiltY, { stiffness: 120, damping: 18, mass: 0.45 })

  function enterPortal(targetRole) {
    navigate('/login', { state: { targetRole } })
  }

  function tiltVisualizer(event) {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5
    pointerTiltX.set(relativeY * -7)
    pointerTiltY.set(relativeX * 8)
  }

  function resetVisualizerTilt() {
    pointerTiltX.set(0)
    pointerTiltY.set(0)
  }

  return (
    <main className="landing-page relative isolate min-h-screen overflow-hidden bg-white text-slate-900">
      <CustomCursor reduceMotion={reduceMotion} />

      <NavBar />

      <section className="relative mx-auto grid min-h-[760px] max-w-7xl scroll-mt-20 items-center gap-14 px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:min-h-[820px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-24 -top-20 size-[34rem] rounded-full bg-emerald-100/70 blur-[90px]" />
          <div className="absolute -bottom-32 left-0 size-[28rem] rounded-full bg-teal-50 blur-[85px]" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)]" />
          <FloatingMedicalIcons reduceMotion={reduceMotion} />
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-800 shadow-sm sm:text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
            </span>
            A new connection in community healthcare
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.06] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
            Bridging the Gap in{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Healthcare.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Bringing rural practitioners and tomorrow’s doctors together to make
            expert clinical collaboration feel closer to every community.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <motion.div whileHover={reduceMotion ? undefined : { scale: 1.035, y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              <button
                type="button"
                onClick={() => enterPortal('RMP')}
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-emerald-900/10 transition hover:bg-emerald-700 hover:shadow-emerald-900/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 sm:w-auto sm:min-w-56"
              >
                <Stethoscope size={18} aria-hidden="true" />
                Enter RMP Portal
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </motion.div>

            <motion.div whileHover={reduceMotion ? undefined : { scale: 1.035, y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              <button
                type="button"
                onClick={() => enterPortal('STUDENT')}
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-white/90 px-6 py-4 text-sm font-semibold text-emerald-800 shadow-lg shadow-emerald-900/5 backdrop-blur transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-900/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 sm:w-auto sm:min-w-56"
              >
                <HeartPulse size={18} aria-hidden="true" />
                Enter MBBS Portal
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </motion.div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-600 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" aria-hidden="true" />
              Role-protected workspaces
            </span>
            <span className="inline-flex items-center gap-2">
              <Radio size={16} className="text-emerald-700" aria-hidden="true" />
              Built for connected care
            </span>
          </div>

          <div className="mt-10 max-w-xl overflow-hidden rounded-xl border border-emerald-100 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5 backdrop-blur">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Care, connected</p>
            <svg viewBox="0 0 600 48" className="h-10 w-full overflow-visible" role="img" aria-label="Animated heartbeat waveform">
              <defs>
                <linearGradient id="heartbeat-gradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#a7f3d0" stopOpacity=".2" />
                  <stop offset="45%" stopColor="#059669" />
                  <stop offset="72%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#a7f3d0" stopOpacity=".2" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0 25 H145 L165 25 L180 20 L192 30 L208 4 L225 43 L242 19 L256 25 H350 L366 25 L381 20 L394 30 L410 4 L427 43 L444 19 L458 25 H600"
                fill="none"
                stroke="url(#heartbeat-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={reduceMotion ? { pathLength: 1 } : { pathLength: [0, 1] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 3.8, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 18 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={tiltVisualizer}
          onMouseLeave={resetVisualizerTilt}
          style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1400, transformStyle: 'preserve-3d' }}
          className="relative mx-auto w-full max-w-xl"
        >
          <CareNetworkVisualizer reduceMotion={reduceMotion} />
        </motion.div>
      </section>

      <section id="about" className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">About Us</motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Great care should not depend on your postcode.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Health-Setu brings rural medical practitioners and academic clinical teams into one connected workflow—so a patient’s local care team can collaborate with broader expertise.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Our mission is to make timely clinical collaboration feel practical, coordinated, and centered on the person receiving care.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
              <BadgeCheck size={17} aria-hidden="true" />
              Designed around accountable care teams
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            role="img"
            aria-label="Illustration of connected healthcare teams"
            className="relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.09),_transparent_65%)]" />
            <motion.div
              aria-hidden="true"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute size-[68%] rounded-full border border-dashed border-emerald-200"
            />
            <div className="absolute h-px w-[68%] rotate-[-28deg] bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="absolute h-px w-[68%] rotate-[30deg] bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex size-28 items-center justify-center rounded-[2rem] bg-emerald-600 text-white shadow-xl shadow-emerald-900/15 sm:size-32"
            >
              <HeartPulse size={52} strokeWidth={1.4} aria-hidden="true" />
            </motion.div>
            {[
              { className: 'left-[12%] top-[21%]', icon: Stethoscope, label: 'RMP' },
              { className: 'right-[11%] top-[20%]', icon: Video, label: 'Consult' },
              { className: 'left-[9%] bottom-[20%]', icon: HeartPulse, label: 'Patient' },
              { className: 'right-[10%] bottom-[19%]', icon: ShieldCheck, label: 'Expertise' },
            ].map((node, index) => {
              const Icon = node.icon
              return (
                <motion.div
                  key={node.label}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 190, damping: 16, delay: index * 0.12 }}
                  animate={reduceMotion ? undefined : { y: [0, index % 2 ? 8 : -8, 0] }}
                  className={`absolute ${node.className} z-10 flex flex-col items-center gap-2`}
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-lg shadow-emerald-900/5 sm:size-14">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 shadow-sm">{node.label}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section id="idea" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            variants={stagger}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Our Idea</motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Local first. Connected by design.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              A simple, transparent path from first assessment to reviewed next steps.
            </motion.p>
          </motion.div>

          <div className="relative">
            <svg className="pointer-events-none absolute left-0 top-8 hidden h-1 w-full md:block" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="timeline-gradient">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <motion.path d="M0 2 H1000" fill="none" stroke="url(#timeline-gradient)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.65 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
            </svg>
            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
              className="grid gap-4 md:grid-cols-3"
            >
              {workflow.map((step) => {
                const Icon = step.icon
                return (
                  <motion.li
                    key={step.number}
                    variants={{
                      hidden: { opacity: 0, y: 25, scale: 0.96 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 18 } },
                    }}
                    whileHover={reduceMotion ? undefined : { y: -5 }}
                    className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-emerald-950/[0.05] transition-colors hover:border-emerald-200"
                  >
                    <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                      <Icon size={23} aria-hidden="true" />
                    </span>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Step {step.number}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                    <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold text-emerald-700">{step.detail}</p>
                  </motion.li>
                )
              })}
            </motion.ol>
          </div>
        </div>
      </section>

      <section id="solution" className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
            className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
          >
            <div>
              <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Our Solution</motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Purpose-built tools for connected clinical care.
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} className="max-w-md text-sm leading-6 text-slate-600">
              One coordinated experience to connect a consultation, organize clinical thinking, and support accountable review.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid gap-4 md:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.article
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-emerald-950/[0.05] transition duration-300 hover:border-emerald-200 hover:shadow-emerald-900/10"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 transition group-hover:from-emerald-50/80 group-hover:to-transparent" />
                  <div className="relative">
                    <motion.span
                      whileHover={reduceMotion ? undefined : { scale: 1.12, rotate: -4 }}
                      className="mb-7 flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100"
                    >
                      <Icon size={24} aria-hidden="true" />
                    </motion.span>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{feature.tag}</p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      Explore the workflow <ArrowRight size={15} aria-hidden="true" />
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 py-12 text-center shadow-xl shadow-emerald-950/[0.05] sm:px-12 sm:py-16"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Care works better together</motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Start with your workspace.
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Sign in to continue or choose the portal that fits your role.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => enterPortal('RMP')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25">
              RMP portal <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => enterPortal('STUDENT')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20">
              MBBS portal <ArrowRight size={16} aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-slate-100 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <div className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <Activity size={18} className="text-emerald-700" aria-hidden="true" />
            Health-Setu
          </div>
          <p>Connecting care teams with purpose</p>
          <Link to="/login" className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800">
            Sign in to your account <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage
