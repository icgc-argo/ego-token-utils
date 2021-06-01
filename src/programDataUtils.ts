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

import { PermissionScopeObj, PROGRAM_DATA_PREFIX, PERMISSIONS, parseScope } from './common';

import { isDccMember } from './argoRoleChecks';

export const getReadableProgramDataScopes = (permissions: string[]): PermissionScopeObj[] => {
  const programDataPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output = policy.startsWith(PROGRAM_DATA_PREFIX);
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
  Array.from(
    // Build from a Set to force unique values.
    new Set<string>(
      getReadableProgramDataScopes(permissions).map(s => s.policy.replace(PROGRAM_DATA_PREFIX, '')),
    ),
  );

export const getWritableProgramDataScopes = (permissions: string[]): PermissionScopeObj[] => {
  const programDataPermissions = permissions.filter(p => {
    const policy = p.split('.')[0];
    const output = policy.startsWith(PROGRAM_DATA_PREFIX);
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
  Array.from(
    // Build from a Set to force unique values.
    new Set<string>(
      getWritableProgramDataScopes(permissions).map(s => s.policy.replace(PROGRAM_DATA_PREFIX, '')),
    ),
  );

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
