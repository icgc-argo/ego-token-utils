import { PermissionScopeObj, PROGRAM_DATA_PREFIX, PERMISSIONS, parseScope } from './common';

import { isDccMember } from './argoRoleChecks';

export const getReadableProgramDataScopes = (permissions: string[]): PermissionScopeObj[] => {
  const programDataPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output = policy.indexOf(PROGRAM_DATA_PREFIX) === 0;
    return output;
  });
  return programDataPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission),
    );
};
export const getReadableProgramDataNames = (permissions: string[]): string[] =>
  getReadableProgramDataScopes(permissions).map(s => s.policy.replace(PROGRAM_DATA_PREFIX, ''));

export const getWritableProgramDataScopes = (permissions: string[]): PermissionScopeObj[] => {
  const programDataPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output = policy.indexOf(PROGRAM_DATA_PREFIX) === 0;
    return output;
  });
  return programDataPermissions
    .map(parseScope)
    .filter(
      scopeObj =>
        [PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(scopeObj.permission) &&
        ![PERMISSIONS.DENY].includes(scopeObj.permission),
    );
};

export const getWritableProgramDataNames = (permissions: string[]): string[] =>
  getWritableProgramDataScopes(permissions).map(s => s.policy.replace(PROGRAM_DATA_PREFIX, ''));

export const canReadSomeProgramData = (permissions: string[]): boolean => {
  return isDccMember(permissions) || !!getReadableProgramDataScopes(permissions).length;
};

export const canWriteSomeProgramData = (permissions: string[]): boolean => {
  return isDccMember(permissions) || !!getWritableProgramDataScopes(permissions).length;
};

export const canReadProgramData = (args: { permissions: string[]; programId: string }): boolean => {
  const { permissions, programId } = args;
  return isDccMember(permissions) || getReadableProgramDataNames(permissions).includes(programId);
};

export const canWriteProgramData = (args: {
  permissions: string[];
  programId: string;
}): boolean => {
  const { permissions, programId } = args;
  return isDccMember(permissions) || getWritableProgramDataNames(permissions).includes(programId);
};
