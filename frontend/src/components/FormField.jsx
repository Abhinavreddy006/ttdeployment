function FormField({ label, id, className = '', ...props }) {
  return (
    <label className={`block ${className}`} htmlFor={id}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 disabled:bg-slate-100"
        {...props}
      />
    </label>
  )
}

export default FormField
