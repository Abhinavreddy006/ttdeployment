import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LoaderCircle, MessageCircle, Mic, MicOff, Send, Volume2, X } from 'lucide-react'
import { apiRequest } from '../lib/api'

async function requestSymptomGuidance(symptoms) {
  const result = await apiRequest('/api/v1/ai/symptom-chat', {
    method: 'POST',
    body: JSON.stringify({ symptoms }),
  })
  if (typeof result?.response !== 'string' || !result.response.trim()) {
    throw new Error('The symptom assistant returned an empty response.')
  }
  return result.response
}

const statusLabels = {
  idle: 'Describe symptoms or use voice',
  listening: 'Listening…',
  thinking: 'Reviewing the symptoms…',
  speaking: 'Speaking…',
  error: 'Assistant needs attention',
}

function VoiceAssistantBot() {
  const reduceMotion = useReducedMotion()
  const [status, setStatus] = useState('idle')
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const recognitionRef = useRef(null)
  const mountedRef = useRef(true)
  const statusRef = useRef('idle')
  const conversationRef = useRef(null)

  function changeStatus(nextStatus) {
    statusRef.current = nextStatus
    setStatus(nextStatus)
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      recognitionRef.current?.abort()
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }, [messages, status, errorMessage, reduceMotion])

  async function requestReply(prompt, speak = false) {
    changeStatus('thinking')
    setErrorMessage('')
    try {
      const assistantReply = await requestSymptomGuidance(prompt)
      if (!mountedRef.current) return
      setMessages((current) => [...current, { role: 'assistant', text: assistantReply }])

      if (!speak) {
        changeStatus('idle')
        return
      }

      if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
        setErrorMessage('Text-to-speech is not supported here. You can read the response above.')
        changeStatus('idle')
        return
      }

      const utterance = new window.SpeechSynthesisUtterance(assistantReply)
      utterance.lang = window.navigator.language || 'en-US'
      utterance.onend = () => {
        if (mountedRef.current) changeStatus('idle')
      }
      utterance.onerror = () => {
        if (!mountedRef.current) return
        setErrorMessage('The response could not be spoken. You can still read it here.')
        changeStatus('idle')
      }
      window.speechSynthesis.cancel()
      changeStatus('speaking')
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      if (!mountedRef.current) return
      setErrorMessage(error instanceof Error ? error.message : 'The symptom assistant could not prepare a response.')
      changeStatus('error')
    }
  }

  async function submitMessage(event) {
    event.preventDefault()
    const symptoms = draft.trim()
    if (!symptoms || status === 'thinking') return

    setDraft('')
    setIsOpen(true)
    setMessages((current) => [...current, { role: 'user', text: symptoms }])
    await requestReply(symptoms)
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsOpen(true)
      setErrorMessage('Speech recognition is not supported here. Try the latest version of Chrome or Edge.')
      changeStatus('error')
      return
    }

    setIsOpen(true)
    setErrorMessage('')

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.lang = window.navigator.language || 'en-US'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        const symptoms = Array.from(event.results)
          .slice(event.resultIndex)
          .filter((result) => result.isFinal)
          .map((result) => result[0]?.transcript?.trim())
          .filter(Boolean)
          .join(' ')

        if (!symptoms) return
        setMessages((current) => [...current, { role: 'user', text: symptoms }])
        void requestReply(symptoms, true)
      }

      recognition.onerror = (event) => {
        if (!mountedRef.current) return
        const messages = {
          'not-allowed': 'Microphone access was denied. Allow microphone access in your browser settings.',
          'service-not-allowed': 'Speech recognition is blocked by this browser or device.',
          'no-speech': 'No speech was detected. Tap the microphone and try again.',
          'audio-capture': 'No microphone was found. Connect a microphone and try again.',
          network: 'Speech recognition could not connect. Check your network and try again.',
        }
        setErrorMessage(messages[event.error] || 'Speech recognition stopped unexpectedly. Please try again.')
        changeStatus('error')
      }

      recognition.onend = () => {
        if (mountedRef.current && statusRef.current === 'listening') changeStatus('idle')
      }

      changeStatus('listening')
      recognition.start()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The microphone could not be started.')
      changeStatus('error')
    }
  }

  function handleButtonClick() {
    if (status === 'thinking') return
    if (status === 'listening') {
      recognitionRef.current?.stop()
      changeStatus('idle')
      return
    }
    if (status === 'speaking') {
      window.speechSynthesis?.cancel()
      changeStatus('idle')
      return
    }
    startListening()
  }

  const isActive = status === 'listening' || status === 'thinking' || status === 'speaking'
  const ButtonIcon = status === 'speaking' ? Volume2 : status === 'listening' ? MicOff : Mic

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            aria-label="Health-Setu symptom assistant"
            className="mb-1 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-2xl shadow-emerald-950/15 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <MessageCircle size={17} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Symptom assistant</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500" aria-live="polite">{statusLabels[status]}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close symptom assistant"
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div ref={conversationRef} className="max-h-64 space-y-3 overflow-y-auto p-4" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === 'user'
                    ? 'ml-6 rounded-2xl rounded-tr-sm bg-slate-100 px-3.5 py-3 text-sm leading-5 text-slate-700'
                    : 'mr-4 rounded-2xl rounded-tl-sm border border-emerald-100 bg-emerald-50/80 px-3.5 py-3 text-sm leading-5 text-slate-700'}
                >
                  <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide ${message.role === 'user' ? 'text-slate-400' : 'text-emerald-700'}`}>
                    {message.role === 'user' ? 'Symptoms' : 'Possible causes & guidance'}
                  </p>
                  {message.text}
                </div>
              ))}
              {errorMessage && (
                <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-700">
                  {errorMessage}
                </p>
              )}
              {messages.length === 0 && !errorMessage && (
                <p className="py-3 text-center text-xs leading-5 text-slate-500">
                  Describe symptoms to explore possible causes and safe next steps. You can type or use the microphone.
                </p>
              )}
              {status === 'thinking' && (
                <div className="flex items-center gap-2 text-xs text-emerald-800" role="status">
                  <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
                  Reviewing the symptoms…
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-4 py-3">
              <p className="mb-2 rounded-lg bg-amber-50 px-2.5 py-2 text-[10px] leading-4 text-amber-800">
                AI guidance only—not a diagnosis. Avoid names or other identifying details; symptoms are sent to the configured AI service. For emergencies, contact local emergency services.
              </p>
              <form onSubmit={submitMessage} className="flex items-end gap-2">
                <label htmlFor="assistant-symptoms" className="sr-only">Describe symptoms</label>
                <textarea
                  id="assistant-symptoms"
                  rows="2"
                  maxLength={3000}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Describe the symptoms…"
                  className="max-h-24 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || status === 'thinking'}
                  aria-label="Send symptoms"
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {status === 'listening' && (
            <>
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-rose-400/70 bg-rose-300/20"
                initial={{ scale: 0.85, opacity: 0.75 }}
                animate={reduceMotion ? { scale: 1.35, opacity: 0 } : { scale: [1, 1.85], opacity: [0.6, 0] }}
                transition={{ duration: reduceMotion ? 0 : 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-rose-400/50"
                initial={{ scale: 0.85, opacity: 0.5 }}
                animate={reduceMotion ? { scale: 1.35, opacity: 0 } : { scale: [1, 1.85], opacity: [0.45, 0] }}
                transition={{ duration: reduceMotion ? 0 : 1.5, delay: 0.45, repeat: Infinity, ease: 'easeOut' }}
              />
            </>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={handleButtonClick}
          aria-label={
            status === 'listening'
              ? 'Stop listening'
              : status === 'speaking'
                ? 'Stop speaking'
                : status === 'thinking'
                  ? 'Assistant is preparing a response'
                  : 'Open symptom assistant and start voice input'
          }
          aria-pressed={isActive}
          disabled={status === 'thinking'}
          animate={
            status === 'listening'
              ? { scale: 1.08, boxShadow: '0 0 0 8px rgba(244,63,94,.08), 0 16px 40px rgba(244,63,94,.22)' }
              : status === 'speaking'
                ? { scale: [1, 1.06, 1], boxShadow: ['0 12px 34px rgba(5,150,105,.17)', '0 12px 38px rgba(5,150,105,.3)', '0 12px 34px rgba(5,150,105,.17)'] }
                : status === 'thinking'
                  ? { boxShadow: '0 12px 34px rgba(5,150,105,.18)' }
                  : { scale: 1, boxShadow: ['0 10px 30px rgba(5,150,105,.1)', '0 14px 38px rgba(5,150,105,.18)', '0 10px 30px rgba(5,150,105,.1)'] }
          }
          transition={
            status === 'listening'
              ? { duration: 0.22 }
              : status === 'thinking'
                ? { duration: 0.2 }
                : { duration: status === 'speaking' ? 1.05 : 3, repeat: Infinity, ease: 'easeInOut' }
          }
          whileHover={reduceMotion || status === 'thinking' ? undefined : { y: -2 }}
          whileTap={reduceMotion || status === 'thinking' ? undefined : { scale: 0.95 }}
          className={`relative flex size-14 items-center justify-center rounded-full border bg-white/90 backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-4 disabled:cursor-wait disabled:opacity-80 sm:size-16 ${
            status === 'listening'
              ? 'border-rose-200 text-rose-500 focus-visible:ring-rose-300/30'
              : 'border-emerald-100 text-emerald-600 focus-visible:ring-emerald-300/40'
          }`}
        >
          {status === 'thinking' ? (
            <LoaderCircle size={23} className="animate-spin text-emerald-600" aria-hidden="true" />
          ) : status === 'speaking' ? (
            <motion.span
              animate={reduceMotion ? undefined : { scale: [1, 1.13, 1] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Volume2 size={23} aria-hidden="true" />
            </motion.span>
          ) : (
            <ButtonIcon size={23} aria-hidden="true" />
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default VoiceAssistantBot
