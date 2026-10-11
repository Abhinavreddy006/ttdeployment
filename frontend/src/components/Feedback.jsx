function Feedback({ feedback }) {
  if (!feedback) return null

  const styles = {
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    loading: 'border-teal-200 bg-teal-50 text-teal-800',
  }

  return (
    <div
      className={`mt-5 rounded-xl border px-4 py-3 text-sm ${styles[feedback.type]}`}
      role={feedback.type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {feedback.message}
    </div>
  )
}

export default Feedback
