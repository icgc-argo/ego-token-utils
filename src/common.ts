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

import * as jwt from 'jsonwebtoken';

export type Permission = 'READ' | 'WRITE' | 'ADMIN' | 'DENY';
export const PERMISSIONS: {
  [k in Permission]: Permission;
} = {
  READ: 'READ',
  WRITE: 'WRITE',
  ADMIN: 'ADMIN',
  DENY: 'DENY',
};
export const PROGRAM_PREFIX = 'PROGRAM-';
export const PROGRAM_DATA_PREFIX = 'PROGRAMDATA-';
export const KAFKA_TOPIC_PREFIX = 'DCCKAFKA-';

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
  permission: Permission;
};

/**
 * checks if a string is a proper permission
 * @param str
 */
export const isPermission = (str: any): str is Permission =>
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
