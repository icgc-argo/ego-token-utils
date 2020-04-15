import { decodeToken, PERMISSIONS } from './common';

export const DCC_PREFIX = 'PROGRAMSERVICE.WRITE';
export const RDPC_PREFIX = 'RDPC-';

/**
 * check if a given jwt has dcc access
 * @param egoJwt
 */
export const isDccMember = (egoPublicKey: string) => (egoJwt: string) => {
  try {
    const data = decodeToken(egoPublicKey)(egoJwt);
    const permissions = data.context.scope;
    return permissions.some(p => p.includes(DCC_PREFIX));
  } catch (err) {
    return false;
  }
};

export const isDccMemberFromScopes = (permissions: string[]) => {
  return permissions.some(p => p.includes(DCC_PREFIX));
};

/**
 * check if a given jwt has rdpc access
 * @param egoJwt
 */
export const isRdpcMember = (egoPublicKey: string) => (egoJwt: string): boolean => {
  try {
    const data = decodeToken(egoPublicKey)(egoJwt);
    const scopes = data.context.scope;
    const rdpcPermissions = scopes.filter(p => {
      const policy = p.split('.')[0];
      return policy.indexOf(RDPC_PREFIX) === 0;
    });
    const isMember =
      rdpcPermissions.some(p =>
        [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(p.split('.')[1]),
      ) && !rdpcPermissions.some(p => [PERMISSIONS.DENY].includes(p.split('.')[1]));
    return isMember;
  } catch (err) {
    return false;
  }
};
