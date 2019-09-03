import * as jwt from 'jsonwebtoken';

export const PERMISSIONS: {
  READ: string;
  WRITE: string;
  ADMIN: string;
  DENY: string;
} = {
  READ: 'READ',
  WRITE: 'WRITE',
  ADMIN: 'ADMIN',
  DENY: 'DENY',
};
export const PROGRAM_PREFIX = 'PROGRAM-';
export const PROGRAM_DATA_PREFIX = 'PROGRAMDATA-';

export enum UserStatus {
  APPROVED = 'APPROVED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}
export enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type EgoJwtData = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
  aud: string[];
  jti: string;
  context: {
    scope: string[];
    user: {
      name: string;
      email: string;
      status: UserStatus;
      firstName: string;
      lastName: string;
      createdAt: number;
      lastLogin: number;
      preferredLanguage: string | undefined;
      type: UserType;
    };
  };
};

export type PermissionScopeObj = {
  policy: string;
  permission: keyof typeof PERMISSIONS;
};

/**
 * checks if a string is a proper permission
 * @param str
 */
export const isPermission = (str: any): str is keyof typeof PERMISSIONS =>
  Object.values(PERMISSIONS).includes(str);

/**
 * Decode provided JWT to provide typed EgoJwtData object
 * Missing values will be null in the provided object,
 * @param egoJwt
 */
export const decodeToken = (egoPublicKey: string) => (egoJwt: string): EgoJwtData => {
  const decoded = jwt.verify(egoJwt, egoPublicKey, { algorithms: ['RS256'] });
  if (typeof decoded == 'string' || decoded === null) {
    throw Error('Unexpected JWT Format');
  } else {
    return <EgoJwtData>decoded;
  }
};

/**
 * takes a scope string and returns an object for interpretation
 * @param scope should be of the format `<policy>.<permission>`
 */
export const parseScope = (scope: string): PermissionScopeObj => {
  const permission = scope.split('.')[1];
  if (isPermission(permission)) {
    return {
      policy: scope.split('.')[0],
      permission,
    };
  } else {
    throw new Error(`invalid scope: ${scope}`);
  }
};
