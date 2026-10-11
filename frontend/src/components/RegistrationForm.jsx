import { useState } from 'react'
import { apiRequest } from '../lib/api'
import Feedback from './Feedback'
import FormField from './FormField'

const initialValues = {
  email: '',
  password: '',
  name: '',
  role: 'RMP',
  institution: '',
  department: '',
}

function RegistrationForm() {
  const [values, setValues] = useState(initialValues)
  const [feedback, setFeedback] = useState(null)

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback({ type: 'loading', message: 'Creating account…' })

    const isRmp = values.role === 'RMP'
    const payload = {
      email: values.email,
      passwordHash: values.password,
      name: values.name,
      role: values.role,
      clinicLocation: isRmp ? values.institution : null,
      college: isRmp ? null : values.institution,
      department: values.department,
    }

    try {
      const result = await apiRequest('/api/v1/users/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setFeedback({
        type: 'success',
        message: `Account created${result?.id ? ` (user #${result.id})` : ''}.`,
      })
      setValues(initialValues)
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    }
  }

  const institutionLabel = values.role === 'RMP' ? 'Clinic location' : 'College'

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Get started</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Create your account</h1>
        <p className="mt-2 text-slate-600">Register an RMP or supervising professor on the Health-Setu network.</p>
      </div>
      <p className="mb-4 text-sm text-slate-600">
        Already registered? <a className="font-semibold text-teal-800 underline underline-offset-4" href="/login">Sign in</a>
      </p>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="name" name="name" label="Full name" value={values.name} onChange={update} autoComplete="name" required />
          <FormField id="email" name="email" label="Email address" type="email" value={values.email} onChange={update} autoComplete="email" required />
          <FormField id="password" name="password" label="Password" type="password" value={values.password} onChange={update} autoComplete="new-password" required minLength={6} />
          <label className="block" htmlFor="role">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Role</span>
            <select
              id="role"
              name="role"
              value={values.role}
              onChange={update}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
            >
              <option value="RMP">RMP</option>
              <option value="SUPERVISING_PROFESSOR">Supervising professor</option>
            </select>
          </label>
          <FormField id="institution" name="institution" label={institutionLabel} value={values.institution} onChange={update} required />
          <FormField id="department" name="department" label="Department" value={values.department} onChange={update} required />
        </div>
        <Feedback feedback={feedback} />
        <button
          type="submit"
          disabled={feedback?.type === 'loading'}
          className="mt-6 w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/20 disabled:cursor-wait disabled:opacity-60"
        >
          {feedback?.type === 'loading' ? 'Creating account…' : 'Create account'}
        </button>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          For this backend model, the password is sent in its <code className="rounded bg-slate-100 px-1 py-0.5">passwordHash</code> field.
        </p>
      </form>
    </section>
  )
}

export default RegistrationForm
