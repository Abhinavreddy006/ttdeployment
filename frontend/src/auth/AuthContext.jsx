import { useMemo, useState } from 'react'
import { decodeToken } from './roles'
import { TOKEN_STORAGE_KEY } from '../lib/api'
import { AuthContext } from './context'

function currentSession() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!token) return { token: null, user: null }

  try {
    const user = decodeToken(token)
    return { token, user }
  } catch {
    // Invalid, expired, or unsupported tokens cannot establish a portal session.
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(currentSession)

  function signIn(token) {
    const user = decodeToken(token)
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    setSession({ token, user })
    return user
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setSession({ token: null, user: null })
  }

  const value = useMemo(
    () => ({ ...session, signIn, logout, signOut: logout }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
