export const ROLE_ROUTES = {
  RMP: '/rmp',
  STUDENT: '/student',
  SUPERVISING_PROFESSOR: '/professor',
}

export function normalizeRole(value) {
  if (typeof value !== 'string') return null
  const role = value.toUpperCase().replace(/^ROLE_/, '')
  if (role === 'MBBS_STUDENT' || role === 'MEDICAL_STUDENT') return 'STUDENT'
  return Object.hasOwn(ROLE_ROUTES, role) ? role : null
}

export function decodeToken(token) {
  const payloadSegment = token.split('.')[1]
  if (!payloadSegment) throw new Error('The login response did not contain a valid JWT.')

  const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const bytes = Uint8Array.from(atob(paddedBase64), (character) => character.charCodeAt(0))
  const payload = JSON.parse(new TextDecoder().decode(bytes))
  const roleClaims = [
    payload.role,
    payload.authority,
    ...(Array.isArray(payload.roles) ? payload.roles : []),
    ...(Array.isArray(payload.authorities) ? payload.authorities : []),
  ]
  const role = roleClaims.map(normalizeRole).find(Boolean)

  if (!role) {
    throw new Error('Your account role is missing from the JWT. Please contact your administrator.')
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    throw new Error('Your session has expired. Please sign in again.')
  }

  return { ...payload, role }
}
