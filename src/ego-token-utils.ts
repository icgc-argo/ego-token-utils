import {
  decodeToken,
  PERMISSIONS,
  PermissionScopeObj,
  isPermission,
  PROGRAM_PREFIX,
  PROGRAM_DATA_PREFIX,
  parseScope,
} from './common';
import {
  canReadProgramData,
  canWriteProgramData,
  canReadSomeProgramData,
  canWriteSomeProgramData,
  getReadableProgramDataScopes,
  getWritableProgramDataScopes,
  getReadableProgramDataNames,
  getWritableProgramDataNames,
} from './programDataUtils';
import { isDccMember, isRdpcMember } from './argoRoleChecks';

import * as jwt from 'jsonwebtoken';

/**
 * checks if a given jwt is valid and has not expired.
 * currently does not validate against Ego signature
 * @param egoJwt
 */
const isValidJwt = (egoPublicKey: string) => (egoJwt?: string) => {
  try {
    if (!egoJwt || !egoPublicKey) {
      return false;
    } else {
      return jwt.verify(egoJwt, egoPublicKey, { algorithms: ['RS256'] }) && true;
    }
  } catch (err) {
    return false;
  }
};

/**
 * takes an PermissionScopeObj and returns a scope string in the format `<policy>.<permission>`
 * @param scopeObj
 */
const serializeScope = (scopeObj: PermissionScopeObj): string => {
  if (isPermission(scopeObj.permission)) {
    return `${scopeObj.policy}.${scopeObj.permission}`;
  } else {
    throw new Error(`invalid permission: ${scopeObj.permission}`);
  }
};

/**
 * get an array of PermissionScopeObj which gives at least `.READ` permission to the token
 * does not return entries that are given `.DENY`
 * @param egoJwt
 */
const getReadableProgramScopes = (egoPublicKey: string) => (
  egoJwt: string,
): PermissionScopeObj[] => {
  const data = decodeToken(egoPublicKey)(egoJwt);
  const permissions = data.context.scope;
  const programPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output =
      policy.indexOf(PROGRAM_PREFIX) === 0 && policy.indexOf(PROGRAM_DATA_PREFIX) !== 0;
    return output;
  });
  return programPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission),
    );
};

/**
 * get an array of PermissionScopeObj which gives at least `.WRITE` permission to the token
 * does not return entries that are given `.DENY`
 * @param egoJwt
 */
const getWriteableProgramScopes = (egoPublicKey: string) => (
  egoJwt: string,
): PermissionScopeObj[] => {
  const data = decodeToken(egoPublicKey)(egoJwt);
  const permissions = data.context.scope;
  const programPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output =
      policy.indexOf(PROGRAM_PREFIX) === 0 && policy.indexOf(PROGRAM_DATA_PREFIX) !== 0;
    return output;
  });
  return programPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission),
    );
};

/**
 * get an array of program short names where the user has been given at least `.READ` permission
 * in the provided token
 * @param egoJwt
 */
const getReadableProgramShortNames = (egoPublicKey: string) => (egoJwt: string): string[] => {
  return getReadableProgramScopes(egoPublicKey)(egoJwt).map(({ policy }) =>
    policy.replace(PROGRAM_PREFIX, ''),
  );
};

/**
 * get an array of program short names where the user has been given at least `.READ` permission
 * in the provided token
 * @param egoJwt
 */
const getWriteableProgramShortNames = (egoPublicKey: string) => (egoJwt: string): string[] => {
  return getWriteableProgramScopes(egoPublicKey)(egoJwt).map(({ policy }) =>
    policy.replace(PROGRAM_PREFIX, ''),
  );
};

/**
 * check if a given JWT can read program with given id
 * @param args
 */
const canReadProgram = (egoPublicKey: string) => (args: {
  egoJwt: string;
  programId: string;
}): boolean => {
  const authorizedProgramScopes = getReadableProgramScopes(egoPublicKey)(args.egoJwt);
  const programIds = authorizedProgramScopes.map(({ policy }) =>
    policy.replace(PROGRAM_PREFIX, ''),
  );
  return isDccMember(egoPublicKey)(args.egoJwt) || programIds.some(id => id === args.programId);
};

/**
 * check if a given JWT can write program with given id
 * @param args
 */
const canWriteProgram = (egoPublicKey: string) => (args: {
  egoJwt: string;
  programId: string;
}): boolean => {
  const authorizedProgramScopes = getReadableProgramScopes(egoPublicKey)(args.egoJwt);
  return (
    isDccMember(egoPublicKey)(args.egoJwt) ||
    authorizedProgramScopes.some(({ policy, permission }) => {
      const programId = policy.replace(PROGRAM_PREFIX, '');
      return (
        programId === args.programId && [PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(permission)
      );
    })
  );
};

/**
 * checks if a given token can read any program at all
 * @param egoJwt the ego token
 */
const canReadSomeProgram = (egoPublicKey: string) => (egoJwt: string) => {
  return (
    isDccMember(egoPublicKey)(egoJwt) || !!getReadableProgramScopes(egoPublicKey)(egoJwt).length
  );
};

/**
 * checks if a given token can write to any program at all
 * @param egoJwt the ego token
 */
const canWriteSomeProgram = (egoPublicKey: string) => (egoJwt: string) => {
  return (
    isDccMember(egoPublicKey)(egoJwt) || !!getWriteableProgramScopes(egoPublicKey)(egoJwt).length
  );
};

/**
 * check if a given JWT has admin access to program with given id
 * @param args
 */
const isProgramAdmin = (egoPublicKey: string) => (args: {
  egoJwt: string;
  programId: string;
}): boolean => canWriteProgram(egoPublicKey)(args);

export default (egoPublicKey: string) => ({
  serializeScope: serializeScope,
  parseScope: parseScope,
  isPermission: isPermission,
  decodeToken: decodeToken(egoPublicKey),
  isValidJwt: isValidJwt(egoPublicKey),
  isDccMember: isDccMember(egoPublicKey),
  isRdpcMember: isRdpcMember(egoPublicKey),
  getReadableProgramScopes: getReadableProgramScopes(egoPublicKey),
  getWriteableProgramScopes: getWriteableProgramScopes(egoPublicKey),
  canReadProgram: canReadProgram(egoPublicKey),
  canWriteProgram: canWriteProgram(egoPublicKey),
  isProgramAdmin: isProgramAdmin(egoPublicKey),
  canReadSomeProgram: canReadSomeProgram(egoPublicKey),
  canWriteSomeProgram: canWriteSomeProgram(egoPublicKey),
  getReadableProgramShortNames: getReadableProgramShortNames(egoPublicKey),
  getWriteableProgramShortNames: getWriteableProgramShortNames(egoPublicKey),
  canReadProgramData: canReadProgramData(egoPublicKey),
  canWriteProgramData: canWriteProgramData(egoPublicKey),
  canReadSomeProgramData: canReadSomeProgramData(egoPublicKey),
  canWriteSomeProgramData: canWriteSomeProgramData(egoPublicKey),
  getReadableProgramDataScopes: getReadableProgramDataScopes(egoPublicKey),
  getWritableProgramDataScopes: getWritableProgramDataScopes(egoPublicKey),
  getReadableProgramDataNames: getReadableProgramDataNames(egoPublicKey),
  getWritableProgramDataNames: getWritableProgramDataNames(egoPublicKey),
});
