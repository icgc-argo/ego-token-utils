import * as _jwtDecode from 'jwt-decode'

const jwtDecode = _jwtDecode

const PERMISSIONS: {
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
const DCC_PREFIX = 'program-service.WRITE'
const RDPC_PREFIX = 'RDPC-'
const PROGRAM_PREFIX = 'PROGRAM-'
const PROGRAM_DATA_PREFIX = 'PROGRAMDATA-'

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
      permissions: string[]
    }
  }
  scope: string[]
}

type PermissionScopeObj = {
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
export const decodeToken = (egoJwt: string): EgoJwtData => jwtDecode(egoJwt)

/**
 * checks if a given jwt is valid and has not expired.
 * currently does not validate against Ego signature
 * @param egoJwt
 */
export const isValidJwt = (egoJwt?: string) => {
  try {
    if (!egoJwt) {
      return false
    } else {
      const { exp } = decodeToken(egoJwt)
      return exp * 1000 > Date.now()
    }
  } catch (err) {
    return false
  }
}

/**
 * check if a given jwt has dcc access
 * @param egoJwt
 */
export const isDccMember = (egoJwt: string) => {
  try {
    const data = decodeToken(egoJwt)
    const permissions = data.context.user.permissions
    return permissions.some(p => p.includes(DCC_PREFIX))
  } catch (err) {
    return false
  }
}

/**
 * check if a given jwt has rdpc access
 * @param egoJwt
 */
export const isRdpcMember = (egoJwt: string) => {
  try {
    const data = decodeToken(egoJwt)
    const permissions = data.context.user.permissions
    const rdpcPermissions = permissions.filter(p => {
      const policy = p.split('.')[0]
      return policy.indexOf(RDPC_PREFIX) === 0
    })
    const isMember =
      rdpcPermissions.some(p =>
        [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(p.split('.')[1])
      ) && !rdpcPermissions.some(p => [PERMISSIONS.DENY].includes(p.split('.')[1]))
    return isMember
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

/**
 * takes an PermissionScopeObj and returns a scope string in the format `<policy>.<permission>`
 * @param scopeObj
 */
export const serializeScope = (scopeObj: PermissionScopeObj): string => {
  if (isPermission(scopeObj.permission)) {
    return `${scopeObj.policy}.${scopeObj.permission}`
  } else {
    throw new Error(`invalid permission: ${scopeObj.permission}`)
  }
}

/**
 * get an array of PermissionScopeObj which gives at least `.READ` permission to the token
 * does not return entries that are given `.DENY`
 * @param egoJwt
 */
export const getReadableProgramScopes = (egoJwt: string): PermissionScopeObj[] => {
  const data = decodeToken(egoJwt)
  const permissions = data.context.user.permissions
  const programPermissions = permissions.filter(p => {
    const policy = p.split('.')[0]
    const output = policy.indexOf(PROGRAM_PREFIX) === 0 && policy.indexOf(PROGRAM_DATA_PREFIX) !== 0
    return output
  })
  return programPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission)
    )
}

/**
 * get an array of PermissionScopeObj which gives at least `.WRITE` permission to the token
 * does not return entries that are given `.DENY`
 * @param egoJwt
 */
export const getWriteableProgramScopes = (egoJwt: string): PermissionScopeObj[] => {
  const data = decodeToken(egoJwt)
  const permissions = data.context.user.permissions
  const programPermissions = permissions.filter(p => {
    const policy = p.split('.')[0]
    const output = policy.indexOf(PROGRAM_PREFIX) === 0 && policy.indexOf(PROGRAM_DATA_PREFIX) !== 0
    return output
  })
  return programPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission)
    )
}

/**
 * get an array of program short names where the user has been given at least `.READ` permission
 * in the provided token
 * @param egoJwt
 */
export const getReadableProgramShortNames = (egoJwt: string): string[] => {
  return getReadableProgramScopes(egoJwt).map(({ policy }) => policy.replace(PROGRAM_PREFIX, ''))
}

/**
 * get an array of program short names where the user has been given at least `.READ` permission
 * in the provided token
 * @param egoJwt
 */
export const getWriteableProgramShortNames = (egoJwt: string): string[] => {
  return getWriteableProgramScopes(egoJwt).map(({ policy }) => policy.replace(PROGRAM_PREFIX, ''))
}

/**
 * check if a given JWT can read program with given id
 * @param args
 */
export const canReadProgram = (args: { egoJwt: string; programId: string }): boolean => {
  const authorizedProgramScopes = getReadableProgramScopes(args.egoJwt)
  const programIds = authorizedProgramScopes.map(({ policy }) => policy.replace(PROGRAM_PREFIX, ''))
  return isDccMember(args.egoJwt) || programIds.some(id => id === args.programId)
}

/**
 * check if a given JWT can write program with given id
 * @param args
 */
export const canWriteProgram = (args: { egoJwt: string; programId: string }): boolean => {
  const authorizedProgramScopes = getReadableProgramScopes(args.egoJwt)
  return (
    isDccMember(args.egoJwt) ||
    authorizedProgramScopes.some(({ policy, permission }) => {
      const programId = policy.replace(PROGRAM_PREFIX, '')
      return (
        programId === args.programId && [PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(permission)
      )
    })
  )
}

/**
 * checks if a given token can read any program at all
 * @param egoJwt the ego token
 */
export const canReadSomeProgram = (egoJwt: string) => {
  return isDccMember(egoJwt) || !!getReadableProgramScopes(egoJwt).length
}

/**
 * checks if a given token can write to any program at all
 * @param egoJwt the ego token
 */
export const canWriteSomeProgram = (egoJwt: string) => {
  return isDccMember(egoJwt) || !!getWriteableProgramScopes(egoJwt).length
}

/**
 * check if a given JWT has admin access to program with given id
 * @param args
 */
export const isProgramAdmin = (args: { egoJwt: string; programId: string }): boolean =>
  canWriteProgram(args)

export default {
  isPermission,
  decodeToken,
  isValidJwt,
  isDccMember,
  isRdpcMember,
  parseScope,
  serializeScope,
  getReadableProgramScopes,
  getWriteableProgramScopes,
  canReadProgram,
  canWriteProgram,
  isProgramAdmin,
  canReadSomeProgram,
  canWriteSomeProgram,
  getReadableProgramShortNames,
  getWriteableProgramShortNames
}
