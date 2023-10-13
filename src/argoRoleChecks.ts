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

import { PERMISSIONS } from './common';

export const DCC_ADMIN_PERMISSION = 'PROGRAMSERVICE.WRITE';
export const RDPC_PREFIX = 'RDPC-';
export const DACO_ADMIN_PERMISSION = 'DACO-REVIEW.WRITE';

export const DACO_POLICY = 'DACO';

/**
 * check if a given set of permissions has dcc access
 * @param permissions
 */
export const isDccMember = (permissions: string[]): boolean => {
  return permissions.includes(DCC_ADMIN_PERMISSION);
};

/**
 * check if a given set of permissions has rdpc access
 * @param permissions
 */
export const isRdpcMember = (permissions: string[]): boolean => {
  try {
    const rdpcPermissions = permissions.filter(p => {
      const policy = p.split('.')[0];
      return policy.startsWith(RDPC_PREFIX);
    });
    const isMember =
      rdpcPermissions.some(p =>
        [PERMISSIONS.READ, PERMISSIONS.WRITE].includes(p.split('.')[1] as keyof typeof PERMISSIONS),
      ) &&
      !rdpcPermissions.some(p =>
        [PERMISSIONS.DENY].includes(p.split('.')[1] as keyof typeof PERMISSIONS),
      );
    return isMember;
  } catch (err) {
    return false;
  }
};

/**
 * check if a given set of permissions has rdpc write access
 * @param permissions
 */
export const isRdpcAdmin = (permissions: string[]): boolean =>
  permissions
    .filter(policy => policy && policy.startsWith(RDPC_PREFIX))
    .some(code => code.includes(PERMISSIONS.WRITE));

/**
 * check if given permissions has write access to specific RDPC
 * @param args
 */
export const canWriteToRdpc = (args: { permissions: string[]; rdpcCode: string }): boolean =>
  args.permissions.some(code => code === `${RDPC_PREFIX}${args.rdpcCode}.${PERMISSIONS.WRITE}`);

/**
 * check if a given set of permissions has daco admin access
 * @param permissions
 */
export const isDacoAdmin = (permissions: string[]): boolean => {
  return permissions.includes(DACO_ADMIN_PERMISSION);
};

export const isDacoApproved = (permissions: string[]): boolean => {
  const dacoPermission = `${DACO_POLICY}.READ`;
  return permissions.includes(dacoPermission);
};
