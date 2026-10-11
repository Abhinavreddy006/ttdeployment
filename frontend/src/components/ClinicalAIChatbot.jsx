import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Bot, Send, X } from 'lucide-react'
import api, { TOKEN_STORAGE_KEY } from '../lib/api'

const initialMessages = [
  {
    role: 'assistant',
    content: 'Hello, I’m your Clinical Copilot. Share a question to get general health information and guidance.',
  },
]

function getRequestError(error) {
  const responseData = error.response?.data
  if (typeof responseData === 'string' && responseData.trim()) return responseData
  if (responseData?.message) return responseData.message
  if (responseData?.reply) return responseData.reply
  if (error.response?.status === 401 || error.response?.status === 403) {
    return 'Please sign in with an authorized account to use Clinical Copilot.'
  }
  if (error.code === 'ERR_NETWORK') return 'Could not reach the server. Check that the backend is running and try again.'
  return error.message || 'The assistant could not respond. Please try again.'
}

function ClinicalAIChatbot() {
  const reduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const conversationRef = useRef(null)
  const requestRef = useRef(null)

  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }, [messages, isLoading, errorMessage, reduceMotion])

  useEffect(() => () => requestRef.current?.abort(), [])

  async function handleSubmit(event) {
    event.preventDefault()
    const message = input.trim()
    if (!message || isLoading) return

    setInput('')
    setErrorMessage('')
    setMessages((current) => [...current, { role: 'user', content: message }])
    setIsLoading(true)
    const controller = new AbortController()
    requestRef.current = controller

    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!token) {
        throw new Error('Please sign in to use Clinical Copilot.')
      }

      const response = await api.post(
        '/api/v1/ai/chat',
        { message },
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const reply = response.data?.reply
      if (typeof reply !== 'string' || !reply.trim()) {
        throw new Error('The assistant returned an empty response. Please try again.')
      }
      setMessages((current) => [...current, { role: 'assistant', content: reply.trim() }])
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('CLINICAL COPILOT API ERROR:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        })
      }
      if (!controller.signal.aborted) setErrorMessage(getRequestError(error))
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            aria-label="Clinical AI Copilot chat"
            className="flex h-[min(31.25rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white text-slate-800 shadow-2xl shadow-emerald-950/15"
          >
            <header className="flex shrink-0 items-center justify-between bg-emerald-600 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                  <Bot size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">Clinical Copilot</h2>
                  <p className="mt-0.5 text-[11px] text-emerald-50">Health information assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Clinical Copilot"
                className="flex size-8 items-center justify-center rounded-lg text-white/85 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div
              ref={conversationRef}
              className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-sm leading-5 ${
                    item.role === 'user'
                      ? 'ml-auto rounded-br-sm bg-emerald-600 text-white'
                      : 'mr-auto rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {item.content}
                </div>
              ))}

              {isLoading && (
                <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3.5 shadow-sm" role="status" aria-label="Assistant is typing">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="size-2 rounded-full bg-emerald-500"
                      animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                      transition={{ duration: 0.65, repeat: Infinity, delay: dot * 0.12, ease: 'easeInOut' }}
                    />
                  ))}
                  <span className="sr-only">Clinical Copilot is typing</span>
                </div>
              )}

              {errorMessage && (
                <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-700">
                  {errorMessage}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white p-3">
              <label htmlFor="clinical-copilot-input" className="sr-only">Message Clinical Copilot</label>
              <input
                id="clinical-copilot-input"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a health question…"
                autoComplete="off"
                maxLength={3000}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </form>
            <p className="shrink-0 bg-white px-4 pb-3 text-[10px] leading-4 text-slate-500">
              AI guidance is informational and not a diagnosis. Contact a clinician or emergency services when needed.
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close Clinical Copilot chat' : 'Open Clinical Copilot chat'}
        aria-expanded={isOpen}
        whileHover={reduceMotion ? undefined : { scale: 1.08 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
        animate={reduceMotion ? undefined : { boxShadow: ['0 8px 24px rgba(5,150,105,.18)', '0 10px 32px rgba(5,150,105,.32)', '0 8px 24px rgba(5,150,105,.18)'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
      >
        {isOpen ? <X size={24} aria-hidden="true" /> : <Bot size={25} aria-hidden="true" />}
      </motion.button>
    </div>
  )
}

export default ClinicalAIChatbot
