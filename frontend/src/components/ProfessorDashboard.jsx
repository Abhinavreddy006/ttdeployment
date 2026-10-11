import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'
import Feedback from './Feedback'

function ProfessorDashboard() {
  const [cases, setCases] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [signingCaseId, setSigningCaseId] = useState(null)

  const fetchCases = useCallback(
    () => apiRequest('/api/v1/cases/rmp/1'),
    [],
  )

  useEffect(() => {
    let isActive = true

    fetchCases()
      .then((result) => {
        if (isActive) {
          setCases(Array.isArray(result) ? result : [])
          setFeedback(null)
        }
      })
      .catch((error) => {
        if (isActive) setFeedback({ type: 'error', message: error.message })
      })

    return () => {
      isActive = false
    }
  }, [fetchCases])

  async function loadCases() {
    setFeedback({ type: 'loading', message: 'Loading cases for RMP #1…' })
    try {
      const result = await fetchCases()
      setCases(Array.isArray(result) ? result : [])
      setFeedback(null)
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    }
  }

  async function signPrescription(caseId) {
    setSigningCaseId(caseId)
    setFeedback({ type: 'loading', message: `Signing prescription for case #${caseId}…` })
    try {
      await apiRequest(`/api/v1/clinical/${encodeURIComponent(caseId)}/prescription/sign/2`, {
        method: 'PUT',
      })
      setFeedback({ type: 'success', message: `Prescription for case #${caseId} signed successfully.` })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setSigningCaseId(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Supervising professor</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Prescription review</h1>
          <p className="mt-2 text-slate-600">Review a case and cryptographically sign its prescription draft.</p>
        </div>
        <button type="button" onClick={loadCases} className="self-start rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-500/10 sm:self-auto">
          Refresh cases
        </button>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Demo queue: this backend exposes cases by RMP, so the list below shows cases for test RMP #1 rather than a professor-wide pending-drafts endpoint.
      </div>
      <Feedback feedback={feedback} />

      {cases.length === 0 && feedback?.type !== 'loading' ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="font-semibold text-slate-900">No cases to review</h2>
          <p className="mt-2 text-sm text-slate-500">Submit an intake as RMP #1 to populate this demo queue.</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {cases.map((consultationCase) => (
            <li key={consultationCase.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">{consultationCase.patientName}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">Case #{consultationCase.id}</span>
                    {consultationCase.status && (
                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">{consultationCase.status}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {[consultationCase.patientAge && `${consultationCase.patientAge} years`, consultationCase.patientGender, consultationCase.department]
                      .filter(Boolean)
                      .join(' · ') || 'Patient details available in case record'}
                  </p>
                  {consultationCase.rawSymptoms && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">{consultationCase.rawSymptoms}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => signPrescription(consultationCase.id)}
                  disabled={signingCaseId !== null}
                  className="shrink-0 rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/20 disabled:cursor-wait disabled:opacity-60"
                >
                  {signingCaseId === consultationCase.id ? 'Signing…' : 'Cryptographically sign'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProfessorDashboard
