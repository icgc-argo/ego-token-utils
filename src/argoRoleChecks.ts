import { PERMISSIONS } from './common';

export const DCC_PREFIX = 'PROGRAMSERVICE.WRITE';
export const RDPC_PREFIX = 'RDPC-';

/**
 * check if a given jwt has dcc access
 * @param egoJwt
 */
export const isDccMember = (permissions: string[]): boolean => {
  return permissions.some(p => p.includes(DCC_PREFIX));
};

/**
 * check if a given jwt has rdpc access
 * @param egoJwt
 */
export const isRdpcMember = (permissions: string[]): boolean => {
  try {
    const rdpcPermissions = permissions.filter(p => {
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
