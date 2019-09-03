import * as _jwtDecode from 'jwt-decode'

const jwtDecode = _jwtDecode

export const PERMISSIONS: {
  READ: string
  WRITE: string
  ADMIN: string
  DENY: string
} = {
  READ: 'READ',
  WRITE: 'WRITE',
  ADMIN: 'ADMIN',
  DENY: 'DENY'
}
export const DCC_PREFIX = 'PROGRAMSERVICE.WRITE'
export const RDPC_PREFIX = 'RDPC-'
export const PROGRAM_PREFIX = 'PROGRAM-'
export const PROGRAM_DATA_PREFIX = 'PROGRAMDATA-'

export type EgoJwtData = {
  iat: number
  exp: number
  sub: string
  iss: string
  aud: string[]
  jti: string
  context: {
    scope: string[]
    user: {
      name: string
      email: string
      status: 'APPROVED' | 'DISABLED' | 'PENDING' | 'REJECTED'
      firstName: string
      lastName: string
      createdAt: number
      lastLogin: number
      preferredLanguage: string | undefined
      type: 'ADMIN' | 'USER'
    }
  }
}

export type PermissionScopeObj = {
  policy: string
  permission: keyof typeof PERMISSIONS
}

/**
 * checks if a string is a proper permission
 * @param str
 */
export const isPermission = (str: any): str is keyof typeof PERMISSIONS =>
  Object.values(PERMISSIONS).includes(str)

/**
 * wrapper for jwt-decode that provides static Ego typing
 * @param egoJwt
 */
export const decodeToken = (egoPublicKey: string) => (egoJwt: string): EgoJwtData =>
  jwtDecode(egoJwt)

/**
 * check if a given jwt has dcc access
 * @param egoJwt
 */
export const isDccMember = (egoPublicKey: string) => (egoJwt: string) => {
  try {
    const data = decodeToken(egoPublicKey)(egoJwt)
    const permissions = data.context.scope
    return permissions.some(p => p.includes(DCC_PREFIX))
  } catch (err) {
    return false
  }
}

/**
 * takes a scope string and returns an object for interpretation
 * @param scope should be of the format `<policy>.<permission>`
 */
export const parseScope = (scope: string): PermissionScopeObj => {
  const permission = scope.split('.')[1]
  if (isPermission(permission)) {
    return {
      policy: scope.split('.')[0],
      permission
    }
  } else {
    throw new Error(`invalid scope: ${scope}`)
  }
}
