import {
  PermissionScopeObj,
  decodeToken,
  PROGRAM_DATA_PREFIX,
  isDccMember,
  PERMISSIONS,
  parseScope
} from './common'

export const getReadableProgramDataScopes = (egoPublicKey: string) => (
  egoJwt: string
): PermissionScopeObj[] => {
  const data = decodeToken(egoPublicKey)(egoJwt)
  const permissions = data.context.scope
  const programDataPermissions = permissions.filter(p => {
    const policy = p.split('.')[0]
    const output = policy.indexOf(PROGRAM_DATA_PREFIX) === 0
    return output
  })
  return programDataPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission)
    )
}
export const getReadableProgramDataNames = (egoPublicKey: string) => (egoJwt: string): string[] =>
  getReadableProgramDataScopes(egoPublicKey)(egoJwt).map(s =>
    s.policy.replace(PROGRAM_DATA_PREFIX, '')
  )

export const getWritableProgramDataScopes = (egoPublicKey: string) => (
  egoJwt: string
): PermissionScopeObj[] => {
  const data = decodeToken(egoPublicKey)(egoJwt)
  const permissions = data.context.scope
  const programDataPermissions = permissions.filter(p => {
    const policy = p.split('.')[0]
    const output = policy.indexOf(PROGRAM_DATA_PREFIX) === 0
    return output
  })
  return programDataPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission)
    )
}

export const getWritableProgramDataNames = (egoPublicKey: string) => (egoJwt: string): string[] =>
  getWritableProgramDataScopes(egoPublicKey)(egoJwt).map(s =>
    s.policy.replace(PROGRAM_DATA_PREFIX, '')
  )

export const canReadSomeProgramData = (egoPublicKey: string) => (egoJwt: string): boolean => {
  return isDccMember(egoPublicKey)(egoJwt) || !!getReadableProgramDataScopes(egoJwt).length
}

export const canWriteSomeProgramData = (egoPublicKey: string) => (egoJwt: string): boolean => {
  return isDccMember(egoPublicKey)(egoJwt) || !!getWritableProgramDataScopes(egoJwt).length
}

export const canReadProgramData = (egoPublicKey: string) => (args: {
  egoJwt: string
  programId: string
}): boolean => {
  const { egoJwt, programId } = args
  return (
    isDccMember(egoPublicKey)(egoJwt) ||
    getReadableProgramDataNames(egoPublicKey)(egoJwt).includes(programId)
  )
}

export const canWriteProgramData = (egoPublicKey: string) => (args: {
  egoJwt: string
  programId: string
}): boolean => {
  const { egoJwt, programId } = args
  return (
    isDccMember(egoPublicKey)(egoJwt) ||
    getWritableProgramDataNames(egoPublicKey)(egoJwt).includes(programId)
  )
}
