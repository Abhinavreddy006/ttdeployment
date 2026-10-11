import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './components/AppLayout'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import ProfessorReviewQueue from './components/ProfessorReviewQueue'
import RegistrationForm from './components/RegistrationForm'
import RmpDashboard from './components/RmpDashboard'
import StudentDashboard from './components/StudentDashboard'
import ClinicalAIChatbot from './components/ClinicalAIChatbot'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute role="RMP" />}>
              <Route path="/rmp" element={<RmpDashboard />} />
            </Route>
            <Route element={<ProtectedRoute role="STUDENT" />}>
              <Route path="/student" element={<StudentDashboard />} />
            </Route>
            <Route element={<ProtectedRoute role="SUPERVISING_PROFESSOR" />}>
              <Route path="/professor" element={<ProfessorReviewQueue />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ClinicalAIChatbot />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
