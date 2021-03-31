/*
 * Copyright (c) 2020 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of the GNU Affero General Public License v3.0.
 * You should have received a copy of the GNU Affero General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 */

import {
  decodeToken,
  PERMISSIONS,
  PermissionScopeObj,
  isPermission,
  PROGRAM_PREFIX,
  PROGRAM_DATA_PREFIX,
  KAFKA_TOPIC_PREFIX,
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
 * get an array of all permissions from the token
 * @param egoJwt
 */
const getPermissionsFromToken = (egoPublicKey: string) => (egoJwt: string): string[] => {
  try {
    const data = decodeToken(egoPublicKey)(egoJwt);
    return data.context.scope;
  } catch (err) {
    return [];
  }
};

/**
 * get an array of PermissionScopeObj which gives at least `.READ` permission to the token
 * does not return entries that are given `.DENY`
 * @param permissions as string[]
 */
const getReadableProgramScopes = (permissions: string[]): PermissionScopeObj[] => {
  const programPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output = policy.startsWith(PROGRAM_PREFIX) && policy.indexOf(PROGRAM_DATA_PREFIX) !== 0;
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
 * @param permissions as string[]
 */
const getWriteableProgramScopes = (permissions: string[]): PermissionScopeObj[] => {
  const programPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output = policy.startsWith(PROGRAM_PREFIX) && policy.indexOf(PROGRAM_DATA_PREFIX) !== 0;
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
 * @param scopeObj in array
 */
const getReadableProgramShortNames = (readableScopes: PermissionScopeObj[]) => {
  return readableScopes.map(({ policy }) => policy.replace(PROGRAM_PREFIX, ''));
};

/**
 * get an array of program short names where the user has been given at least `.WRITE` permission
 * in the provided token
 * @param scopeObj in array
 */
const getWriteableProgramShortNames = (writableScopes: PermissionScopeObj[]) => {
  return writableScopes.map(({ policy }) => policy.replace(PROGRAM_PREFIX, ''));
};
/**
 * check if given permissions can read program with given id
 * @param args
 */
const canReadProgram = (args: { permissions: string[]; programId: string }): boolean => {
  const authorizedProgramScopes = getReadableProgramScopes(args.permissions);
  const programIds = authorizedProgramScopes.map(({ policy }) =>
    policy.replace(PROGRAM_PREFIX, ''),
  );

  return isDccMember(args.permissions) || programIds.some(id => id === args.programId);
};

/**
 * check if given permissions can write program with given id
 * @param args
 */
const canWriteProgram = (args: { permissions: string[]; programId: string }): boolean => {
  const authorizedProgramScopes = getReadableProgramScopes(args.permissions);
  return (
    isDccMember(args.permissions) ||
    authorizedProgramScopes.some(({ policy, permission }) => {
      const programId = policy.replace(PROGRAM_PREFIX, '');
      return (
        programId === args.programId && [PERMISSIONS.WRITE, PERMISSIONS.ADMIN].includes(permission)
      );
    })
  );
};

/**
 * checks if given permissions can read any program at all
 * @param permissions as string[]
 */
const canReadSomeProgram = (permissions: string[]) => {
  return isDccMember(permissions) || !!getReadableProgramScopes(permissions).length;
};

/**
 * checks if given permissions can write to any program at all
 * @param permissions as string[]
 */
const canWriteSomeProgram = (permissions: string[]) => {
  return isDccMember(permissions) || !!getWriteableProgramScopes(permissions).length;
};

/**
 * check if given permissions has admin access to program with given id
 * @param args
 */
const isProgramAdmin = (args: { permissions: string[]; programId: string }): boolean =>
  canWriteProgram(args);

export enum UserProgramMembershipAccessLevel {
  DCC_MEMBER = 'DCC_MEMBER',
  FULL_PROGRAM_MEMBER = 'FULL_PROGRAM_MEMBER',
  ASSOCIATE_PROGRAM_MEMBER = 'ASSOCIATE_PROGRAM_MEMBER',
  PUBLIC_MEMBER = 'PUBLIC_MEMBER',
}

/**
 * return the user's program membership access level
 * @param args
 */
const getProgramMembershipAccessLevel = (args: {
  permissions: string[];
}): UserProgramMembershipAccessLevel => {
  const permissionObjs = args.permissions.map(parseScope);

  const FULL_PROGRAM_MEMBER_POLICY = 'PROGRAMMEMBERSHIP-FULL';
  const containsFullProgramMemberPolicy = permissionObjs.some(
    scope => scope.policy === FULL_PROGRAM_MEMBER_POLICY,
  );
  const deniedFullProgramMemberPolicy = permissionObjs
    .filter(scope => scope.policy === FULL_PROGRAM_MEMBER_POLICY)
    .some(scope => scope.permission === 'DENY');

  const ASSOCIATE_PROGRAM_MEMBER_POLICY = 'PROGRAMMEMBERSHIP-ASSOCIATE';
  const containsAssociateProgramMemberPolicy = permissionObjs.some(
    scope => scope.policy === ASSOCIATE_PROGRAM_MEMBER_POLICY,
  );
  const deniedAssociateProgramMemberPolicy = permissionObjs
    .filter(scope => scope.policy === ASSOCIATE_PROGRAM_MEMBER_POLICY)
    .some(scope => scope.permission === 'DENY');

  switch (true) {
    case isDccMember(args.permissions):
      return UserProgramMembershipAccessLevel.DCC_MEMBER;

    case containsFullProgramMemberPolicy && !deniedFullProgramMemberPolicy:
      return UserProgramMembershipAccessLevel.FULL_PROGRAM_MEMBER;

    case containsAssociateProgramMemberPolicy && !deniedAssociateProgramMemberPolicy:
      return UserProgramMembershipAccessLevel.ASSOCIATE_PROGRAM_MEMBER;

    default:
      return UserProgramMembershipAccessLevel.PUBLIC_MEMBER;
  }
};

/**
 *
 * @param permissions
 * @param topic
 * @returns
 */
const canWriteKafkaTopic = (args: { permissions: string[]; topic: string }) =>
  args.permissions.includes(`${KAFKA_TOPIC_PREFIX}${args.topic}.${PERMISSIONS.WRITE}`);

export default (egoPublicKey: string) => ({
  serializeScope: serializeScope,
  parseScope: parseScope,
  isPermission: isPermission,
  decodeToken: decodeToken(egoPublicKey),
  isValidJwt: isValidJwt(egoPublicKey),
  isDccMember: isDccMember,
  isRdpcMember: isRdpcMember,
  getPermissionsFromToken: getPermissionsFromToken(egoPublicKey),
  getReadableProgramScopes: getReadableProgramScopes,
  getWriteableProgramScopes: getWriteableProgramScopes,
  canReadProgram: canReadProgram,
  canWriteProgram: canWriteProgram,
  isProgramAdmin: isProgramAdmin,
  canReadSomeProgram: canReadSomeProgram,
  canWriteSomeProgram: canWriteSomeProgram,
  getReadableProgramShortNames: getReadableProgramShortNames,
  getWriteableProgramShortNames: getWriteableProgramShortNames,
  canReadProgramData: canReadProgramData,
  canWriteProgramData: canWriteProgramData,
  canReadSomeProgramData: canReadSomeProgramData,
  canWriteSomeProgramData: canWriteSomeProgramData,
  getReadableProgramDataScopes: getReadableProgramDataScopes,
  getWritableProgramDataScopes: getWritableProgramDataScopes,
  getReadableProgramDataNames: getReadableProgramDataNames,
  getWritableProgramDataNames: getWritableProgramDataNames,
  getProgramMembershipAccessLevel: getProgramMembershipAccessLevel,
  canWriteKafkaTopic: canWriteKafkaTopic,
});

export { PERMISSIONS, PermissionScopeObj, PROGRAM_DATA_PREFIX, PROGRAM_PREFIX } from './common';
