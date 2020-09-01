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

import createValidator from '../src';

/** has the following scopes:
 * "PROGRAMDATA-PACA-AU.WRITE"
 * "PROGRAMDATA-WP-CPMP-US.WRITE"
 **/
const DATA_SUBMITTER = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjI2NzkyMDksImV4cCI6MjA2Mjc2NTYwOSwic3ViIjoiM2RjNjU5MmItMTQzNi00ZDVlLTk5MzEtMTRiZjFjZmVlZGU4IiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiZDUyZTFjOGYtYzVkYS00ZGRkLTgzODUtODI2OWM4NzcxYzhiIiwiY29udGV4dCI6eyJzY29wZSI6WyJQUk9HUkFNREFUQS1QQUNBLUFVLldSSVRFIiwiUFJPR1JBTURBVEEtV1AtQ1BNUC1VUy5XUklURSJdLCJ1c2VyIjp7Im5hbWUiOiJhcmdvLmRhdGFzdWJtaXR0ZXJAZ21haWwuY29tIiwiZW1haWwiOiJhcmdvLmRhdGFzdWJtaXR0ZXJAZ21haWwuY29tIiwic3RhdHVzIjoiQVBQUk9WRUQiLCJmaXJzdE5hbWUiOiJEYW4iLCJsYXN0TmFtZSI6IkRhdGEgU3VibWl0dHRlciIsImNyZWF0ZWRBdCI6MTU2MjYyNTY0MTg2MSwibGFzdExvZ2luIjoxNTYyNjc5MjA5MDUwLCJwcmVmZXJyZWRMYW5ndWFnZSI6bnVsbCwidHlwZSI6IlVTRVIifX19.v7nwK75XBNZLQlBkvu00MGI_niUAySE8qfYv2jcWXqhHf9lRSLdYH1OoRsAaIolsya0aMtkG_bhS8FdrsE65wZ5u9xUlN-slCHb_dnuf4m_dZ1BuGUi4vciIdoABYDn48Wzz05NBOXe0lU9ix8jMXYV6TLJSn03GetWbLY4R0rAXo4EWFf1Y8oMeZMeAPlaaE9R2e537cHiJ_KFiEVCOPxU1Ccu-00oEPa70JD5QnIsYzGA5pe1n7zd_O9WsuZPE_oOzOiBAV0Lspg3ocjXr0aTbVhm9lSdK6D6qrxuV6UK_RQ7iCY56CsmdKVtFSXlsFSC2wPmr1UJvvtEPmp7qWg`;

/** has the following scopes:
 * "PROGRAMDATA-PACA-AU.WRITE"
 * "PROGRAM-PACA-AU.WRITE"
 **/
const PROGRAM_ADMIN = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjI2NzkzNjcsImV4cCI6MjA2Mjc2NTc2Nywic3ViIjoiMTYwZmZlYzctNDk0Zi00ZGU3LWFjMDItOGRlYjEwM2I3MDU3IiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiMmU3ZWZjY2QtZWNlMC00NTQ4LWE2MzAtMjA5ZDEyNDFmNDU5IiwiY29udGV4dCI6eyJzY29wZSI6WyJQUk9HUkFNREFUQS1QQUNBLUFVLldSSVRFIiwiUFJPR1JBTS1QQUNBLUFVLldSSVRFIl0sInVzZXIiOnsibmFtZSI6ImFyZ28ucHJvZ3JhbWFkQGdtYWlsLmNvbSIsImVtYWlsIjoiYXJnby5wcm9ncmFtYWRAZ21haWwuY29tIiwic3RhdHVzIjoiQVBQUk9WRUQiLCJmaXJzdE5hbWUiOiJQYXVsIiwibGFzdE5hbWUiOiJQcm9ncmFtIEFkbWluIiwiY3JlYXRlZEF0IjoxNTYyNjI1NjI4ODM4LCJsYXN0TG9naW4iOjE1NjI2NzkzNjc2MDYsInByZWZlcnJlZExhbmd1YWdlIjpudWxsLCJ0eXBlIjoiVVNFUiJ9fX0.tD1muPIhFNjD6OpMk9OG5-PAMVIMPAKerOYHXaNqmTcAcs-XaW_qMNZSnvDjqmLKse_gdQSQJVrRbXhpK_PhvWL6z_S7LIhA4EsDmKZEi8JbJz29K57Qp5gCI9qs2vOBD47hIS9XomGf5OUAcn8w_2xD7XNVSHnQP3PKmpdH5dCFpuyKbUsFupRUoJBuk0iltoxAs7uO2gKLnfFmUacd9592fAvidSAywu99T0kYGOGQBUNvBE68tngF_QIqlkVBMe0EbjQI8QkewuhrETZH3exWymg3J8E-uPNzuBpjEbwrdJm6kJUp1IGs65j9-SGLTTMfRCxEsBIW0v-6PqsiNQ`;

/** has the following scopes:
 * "score-argo-qa.WRITE"
 * "song-argo-qa.WRITE"
 * "PROGRAMSERVICE.WRITE"
 * "CLINICALSERVICE.WRITE"
 **/
const DCC_USER = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjI2ODQ0NTgsImV4cCI6MjA2Mjc3MDg1OCwic3ViIjoiN2VlMWRkODctNTUzMC00MzA0LWIzYjItZTZiYzU5M2FmYjM3IiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiYWI0NTI0MjUtYjJiOC00MzExLWFmOTAtZGFkNzhjYjM0YTUzIiwiY29udGV4dCI6eyJzY29wZSI6WyJzY29yZS1hcmdvLXFhLldSSVRFIiwic29uZy1hcmdvLXFhLldSSVRFIiwiUFJPR1JBTVNFUlZJQ0UuV1JJVEUiLCJDTElOSUNBTFNFUlZJQ0UuV1JJVEUiXSwidXNlciI6eyJuYW1lIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsInN0YXR1cyI6IkFQUFJPVkVEIiwiZmlyc3ROYW1lIjoiT0lDUiIsImxhc3ROYW1lIjoiVGVzdGVyIiwiY3JlYXRlZEF0IjoxNTYyNjIzOTA4NTYzLCJsYXN0TG9naW4iOjE1NjI2ODQ0NTg0MDksInByZWZlcnJlZExhbmd1YWdlIjpudWxsLCJ0eXBlIjoiVVNFUiJ9fX0.rXQPLdJAis0EIWr_eZ_BG0WIZMFyKXsOGHLZz3_5MTFMp-YEy3_XaoBghJrp3C4uTjE7lrvv8XAo5IaL9W0uJnM0i31AsRQInmF1tjJOZ8w82oXxdqOvr5G-eRTPOtslFJarZI7AO18OAdkl5BPv_W-aGtFw--jMMt_DeJGUwbadXZwcbIjbX5fZNVwg6lo7wz0t4IH2e7ESxc_k8OF82j3XlflCoaigxu-77et2B_yzMJ_THWMts7E7JTog6b_fhQ2CiyzLdDogWotQtSWXhwgA-ugxxMDPdGRO1buqaAKeZguyQ9taUHYgH90HdIwCP9KCKqNt4v4Qvnk3IIqJeQ`;

const EXPIRED_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjI2ODQ0NTgsImV4cCI6MTU2Mjc3MDg1OCwic3ViIjoiN2VlMWRkODctNTUzMC00MzA0LWIzYjItZTZiYzU5M2FmYjM3IiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiYWI0NTI0MjUtYjJiOC00MzExLWFmOTAtZGFkNzhjYjM0YTUzIiwiY29udGV4dCI6eyJzY29wZSI6WyJzY29yZS1hcmdvLXFhLldSSVRFIiwic29uZy1hcmdvLXFhLldSSVRFIiwiUFJPR1JBTVNFUlZJQ0UuV1JJVEUiXSwidXNlciI6eyJuYW1lIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsInN0YXR1cyI6IkFQUFJPVkVEIiwiZmlyc3ROYW1lIjoiT0lDUiIsImxhc3ROYW1lIjoiVGVzdGVyIiwiY3JlYXRlZEF0IjoxNTYyNjIzOTA4NTYzLCJsYXN0TG9naW4iOjE1NjI2ODQ0NTg0MDksInByZWZlcnJlZExhbmd1YWdlIjpudWxsLCJ0eXBlIjoiVVNFUiJ9fX0.QoG-V9409iN3_HD_dSDn6Pic2bLlp27x9BD5sBzr_n9IyUUaYO2ZatF_l-iaPD1FaYu_MxgN39SrvN5tbhpG4Ahl05w_G004RPbBAG7H-_2H2B5EgHnnHdYrThZuPuCj50_0__ZpRWpL2uh-0qHfPz7llAvaHzInAMxJiQ3gtQXdNOfaESrRFOC4gpqGzKmyG185e2iVL92_x4prznW0L13mBGh9Ox6Y4ec-rO5cy9RvORDmzMGa3yVoDKTt1CGtwvBgu7f_eiM3Za2q413kPMjyp_LAKuSH_-RPvKlL1BqRFumjkt3J7qOXrkD1xs9pH-t4QpAp5oRIy475uIKP4A';

const BOGUS_PROGRAM_ID = 'BOGUS_PROGRAM';

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0lOqMuPLCVusc6szklNXQL1FHhSkEgR7An+8BllBqTsRHM4bRYosseGFCbYPn8r8FsWuMDtxp0CwTyMQR2PCbJ740DdpbE1KC6jAfZxqcBete7gP0tooJtbvnA6X4vNpG4ukhtUoN9DzNOO0eqMU0Rgyy5HjERdYEWkwTNB30i9I+nHFOSj4MGLBSxNlnuo3keeomCRgtimCx+L/K3HNo0QHTG1J7RzLVAchfQT0lu3pUJ8kB+UM6/6NG+fVyysJyRZ9gadsr4gvHHckw8oUBp2tHvqBEkEdY+rt1Mf5jppt7JUV7HAPLB/qR5jhALY2FX/8MN+lPLmb/nLQQichVQIDAQAB\r\n-----END PUBLIC KEY-----`;
const PUBLIC_KEY_WRONG = `-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0lOqMuPLCVusc6szklNXQL1FHhSkEgR7An+8BllBqTsRHM4bRYosseGFCbYPn8r8FsWuMDtxp0CwTyMQR2PCbJ740DdpbE1KC6jAfZxqcBete7gP0tooJtbvnA6X4vNpG4ukhtUoN9DzNOO0eqMU0Rgyy5HjERdYEWkwTNB30i9I+nHFOSj4MGLBSxNlnuo3keeomCRgtimCx+L/K3HNo0QHTG1J7RzLVAchfQT0lu3pUJ8kB+UM6/6NG+fVyysJyRZ9gadsr4gvHHckw8oUBp2tHvqBEkEdY+rt1Mf5jppt7JUV7HAPLB/qR5jhALY2FX/8MN+lPLmb/nLQQichVQIDAQAC\r\n-----END PUBLIC KEY-----`;

const validator = createValidator(PUBLIC_KEY);
const badKeyValidator = createValidator(PUBLIC_KEY_WRONG);
const noKeyValidator = createValidator('');

const dccUserPermissions = validator.getPermissionsFromToken(DCC_USER);
const programAdminPermissions = validator.getPermissionsFromToken(PROGRAM_ADMIN);
const dataSubmitterPermissions = validator.getPermissionsFromToken(DATA_SUBMITTER);

describe('serializeScope', () => {
  it('should throw error for invalid scope objects', () => {
    const parseInvalidObj = () => validator.serializeScope({ permission: '' as any, policy: '' });
    expect(parseInvalidObj).toThrow();
  });
});

describe('isRdpcMember', () => {
  it('should invalidate all non RDPC tokens', () => {
    [DATA_SUBMITTER, PROGRAM_ADMIN, DCC_USER].forEach(token => {
      expect(validator.isRdpcMember(validator.getPermissionsFromToken(token))).toBe(false);
    });
  });
  it('should return false if failed', () => {
    expect(validator.isRdpcMember(validator.getPermissionsFromToken('ssdfg'))).toBe(false);
  });
});

describe('parseScope', () => {
  it('should parse valid scopes correctly', () => {
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.READ')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'READ',
    });
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.WRITE')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'WRITE',
    });
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.ADMIN')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'ADMIN',
    });
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.DENY')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'DENY',
    });
  });
  it('should throw error ', () => {
    expect(() => validator.parseScope('PROGRAM-WP-CPMP-US.sdfgsdfg')).toThrow();
  });
});

describe('serializeScope', () => {
  it('should serialize properly', () => {
    expect(
      validator.serializeScope({
        policy: 'PROGRAM-WP-CPMP-US',
        permission: 'DENY',
      }),
    ).toBe('PROGRAM-WP-CPMP-US.DENY');
  });
});

describe('isPermission', () => {
  it('should validates all permissions', () => {
    ['READ', 'WRITE', 'ADMIN', 'DENY'].forEach(str => {
      expect(validator.isPermission(str)).toBe(true);
    });
  });
  it('should invalidate non permission', () => {
    ['', undefined, 1, null].forEach(str => {
      expect(validator.isPermission(str)).toBe(false);
    });
  });
});

describe('isValidJwt', () => {
  it('should return false if undefined', () => {
    expect(validator.isValidJwt()).toBe(false);
  });
  it('should return false if failed', () => {
    expect(validator.isValidJwt('sfgsdfg')).toBe(false);
  });
  it('should return true for valid jwt', () => {
    [DATA_SUBMITTER, PROGRAM_ADMIN, DCC_USER].forEach(token => {
      expect(validator.isValidJwt(token)).toBe(true);
    });
  });
  it('should return false for expired token', () => {
    expect(validator.isValidJwt(EXPIRED_TOKEN)).toBe(false);
  });
  it('should return false for the wrong public key', () => {
    expect(badKeyValidator.isValidJwt(DCC_USER)).toBe(false);
  });
  it('should return false for no provided public key', () => {
    expect(noKeyValidator.isValidJwt(DCC_USER)).toBe(false);
  });
});

describe('decodeToken', () => {
  it('should return data for a valid token', () => {
    const decoded = validator.decodeToken(DCC_USER);
    expect(decoded.context.user.name).toBe('oicrtestuser@gmail.com');
    expect(decoded.context.scope.length).toBeGreaterThan(0);
  });
  it('should throw error for invalid token', () => {
    expect(() => validator.decodeToken(EXPIRED_TOKEN)).toThrowError();
  });
  it('should throw error for valid token with wrong public key', () => {
    expect(() => badKeyValidator.decodeToken(DCC_USER)).toThrowError();
  });
  it('should throw error for valid token with no public key', () => {
    expect(() => noKeyValidator.decodeToken(DCC_USER)).toThrowError();
  });
});

describe('getReadableProgramScopes', () => {
  it('should return authorized program scopes', () => {
    expect(validator.getReadableProgramScopes(dataSubmitterPermissions)).toEqual([]);
    expect(validator.getReadableProgramScopes(programAdminPermissions)).toEqual([
      { policy: 'PROGRAM-PACA-AU', permission: 'WRITE' },
    ]);
    expect(validator.getReadableProgramScopes(dccUserPermissions)).toEqual([]);
  });
});

describe('getWriteableProgramScopes', () => {
  it('should return authorized program scopes', () => {
    expect(validator.getWriteableProgramScopes(dataSubmitterPermissions)).toEqual([]);
    expect(validator.getWriteableProgramScopes(programAdminPermissions)).toEqual([
      { policy: 'PROGRAM-PACA-AU', permission: 'WRITE' },
    ]);
    expect(validator.getWriteableProgramScopes(dccUserPermissions)).toEqual([]);
  });
});

describe('getReadableProgramShortNames', () => {
  it('should return authorized program names', () => {
    expect(
      validator.getReadableProgramShortNames(
        validator.getReadableProgramScopes(dataSubmitterPermissions),
      ),
    ).toEqual([]);
    expect(
      validator.getReadableProgramShortNames(
        validator.getReadableProgramScopes(programAdminPermissions),
      ),
    ).toEqual(['PACA-AU']);
    expect(
      validator.getReadableProgramShortNames(
        validator.getReadableProgramScopes(dccUserPermissions),
      ),
    ).toEqual([]);
  });
});

describe('getWriteableProgramShortNames', () => {
  it('should return authorized program names', () => {
    expect(
      validator.getWriteableProgramShortNames(
        validator.getWriteableProgramScopes(dataSubmitterPermissions),
      ),
    ).toEqual([]);
    expect(
      validator.getWriteableProgramShortNames(
        validator.getWriteableProgramScopes(programAdminPermissions),
      ),
    ).toEqual(['PACA-AU']);
    expect(
      validator.getWriteableProgramShortNames(
        validator.getWriteableProgramScopes(dccUserPermissions),
      ),
    ).toEqual([]);
  });
});

describe('isDccMember', () => {
  it('should validate DCC member as such', () => {
    expect(validator.isDccMember(dccUserPermissions)).toBe(true);
  });
  it('should validate non DCC member as such', () => {
    expect(validator.isDccMember(dataSubmitterPermissions)).toBe(false);
  });
  it('should return false if fail', () => {
    expect(validator.isDccMember(validator.getPermissionsFromToken('asdfsdf'))).toBe(false);
  });
});

describe('canReadProgram', () => {
  it('should validate read access', () => {
    expect(
      validator.canReadProgram({
        permissions: programAdminPermissions,
        programId: 'PACA-AU',
      }),
    ).toBe(true);
  });
  it('should handle "" for programId correctly', () => {
    expect(
      validator.canReadProgram({
        permissions: programAdminPermissions,
        programId: '',
      }),
    ).toBe(false);
  });
  it('should invalidate read access', () => {
    expect(
      validator.canReadProgram({
        permissions: programAdminPermissions,
        programId: BOGUS_PROGRAM_ID,
      }),
    ).toBe(false);
  });
  it('should give dcc members access', () => {
    expect(
      validator.canReadProgram({
        permissions: dccUserPermissions,
        programId: '',
      }),
    ).toBe(true);
  });
});

describe('canWriteProgram', () => {
  it('should validate write access', () => {
    expect(
      validator.canWriteProgram({
        permissions: programAdminPermissions,
        programId: 'PACA-AU',
      }),
    ).toBe(true);
  });
  it('should invalidate write access', () => {
    expect(
      validator.canWriteProgram({
        permissions: programAdminPermissions,
        programId: BOGUS_PROGRAM_ID,
      }),
    ).toBe(false);
  });
  it('should handle "" for programId correctly', () => {
    expect(
      validator.canWriteProgram({
        permissions: programAdminPermissions,
        programId: '',
      }),
    ).toBe(false);
  });
  it('should invalidate read only access', () => {
    expect(
      validator.canWriteProgram({
        permissions: dataSubmitterPermissions,
        programId: 'WP-CPMP-US',
      }),
    ).toBe(false);
  });
  it('should give dcc members access', () => {
    expect(
      validator.canReadProgram({
        permissions: dccUserPermissions,
        programId: '',
      }),
    ).toBe(true);
  });
});

describe('isProgramAdmin', () => {
  it('should validate admin access', () => {
    expect(
      validator.isProgramAdmin({
        permissions: programAdminPermissions,
        programId: 'PACA-AU',
      }),
    ).toBe(true);
  });
  it('should invalidate read only access', () => {
    expect(
      validator.isProgramAdmin({
        permissions: dataSubmitterPermissions,
        programId: 'PACA-AU',
      }),
    ).toBe(false);
  });
});

describe('canReadSomeProgram', () => {
  it('should return true for dcc members', () => {
    expect(validator.canReadSomeProgram(dccUserPermissions)).toBe(true);
  });
  it('should return true for program admin', () => {
    expect(validator.canReadSomeProgram(programAdminPermissions)).toBe(true);
  });
  it('should return false for data submitters with no program access', () => {
    expect(validator.canReadSomeProgram(dataSubmitterPermissions)).toBe(false);
  });
});

describe('canWriteSomeProgram', () => {
  it('should return true for dcc members', () => {
    expect(validator.canWriteSomeProgram(dccUserPermissions)).toBe(true);
  });
  it('should return true for program admin', () => {
    expect(validator.canWriteSomeProgram(programAdminPermissions)).toBe(true);
  });
  it('should return false for data submitters with no program access', () => {
    expect(validator.canWriteSomeProgram(dataSubmitterPermissions)).toBe(false);
  });
});

describe('getReadableProgramDataScopes', () => {
  it('should return the right list of accessible scope objects', () => {
    expect(validator.getReadableProgramDataScopes(dataSubmitterPermissions)).toEqual([
      {
        permission: 'WRITE',
        policy: 'PROGRAMDATA-PACA-AU',
      },
      {
        permission: 'WRITE',
        policy: 'PROGRAMDATA-WP-CPMP-US',
      },
    ]);
  });
});

describe('canReadSomeProgramData', () => {
  it('should return true for ', () => {
    expect(validator.canReadSomeProgramData(dataSubmitterPermissions)).toBe(true);
  });
});

describe('canWriteSomeProgramData', () => {
  it('should return true for ', () => {
    expect(validator.canWriteSomeProgramData(dataSubmitterPermissions)).toBe(true);
  });
});

describe('canReadProgramData', () => {
  it('should return true for data submitters', () => {
    expect(
      validator.canReadProgramData({
        programId: 'PACA-AU',
        permissions: dataSubmitterPermissions,
      }),
    ).toBe(true);
  });
  it('should return true for DCC members', () => {
    expect(
      validator.canReadProgramData({
        programId: 'PACA-AU',
        permissions: dccUserPermissions,
      }),
    ).toBe(true);
  });
});
describe('canWriteProgramData', () => {
  it('should return true for data submitters', () => {
    expect(
      validator.canWriteProgramData({
        programId: 'PACA-AU',
        permissions: dataSubmitterPermissions,
      }),
    ).toBe(true);
  });
  it('should return true for DCC members', () => {
    expect(
      validator.canWriteProgramData({
        programId: 'PACA-AU',
        permissions: dccUserPermissions,
      }),
    ).toBe(true);
  });
});

describe('getProgramMembershipAccessLevel', () => {
  it('should identify DCC members correctly', () => {
    expect(
      validator.getProgramMembershipAccessLevel({
        permissions: dccUserPermissions,
      }),
    ).toBe('DCC_MEMBER');
  });
  it('should identify empty permissions correctly', () => {
    expect(
      validator.getProgramMembershipAccessLevel({
        permissions: [],
      }),
    ).toBe('PUBLIC_MEMBER');
  });
  it('should give the highest of dcc, full program and associate program', () => {
    expect(
      validator.getProgramMembershipAccessLevel({
        permissions: [
          'PROGRAMMEMBERSHIP-FULL.READ',
          'PROGRAMMEMBERSHIP-ASSOCIATE.READ',
          ...dccUserPermissions,
        ],
      }),
    ).toBe('DCC_MEMBER');
  });
  it('should give the highest of full program and associate program', () => {
    expect(
      validator.getProgramMembershipAccessLevel({
        permissions: ['PROGRAMMEMBERSHIP-FULL.READ', 'PROGRAMMEMBERSHIP-ASSOCIATE.READ'],
      }),
    ).toBe('FULL_PROGRAM_MEMBER');
  });
  it('should identify associate program members correctly', () => {
    expect(
      validator.getProgramMembershipAccessLevel({
        permissions: ['PROGRAMMEMBERSHIP-ASSOCIATE.READ'],
      }),
    ).toBe('ASSOCIATE_PROGRAM_MEMBER');
  });

  it('should not allow denied full program members', () => {
    expect(
      validator.getProgramMembershipAccessLevel({
        permissions: ['PROGRAMMEMBERSHIP-FULL.READ', 'PROGRAMMEMBERSHIP-FULL.DENY'],
      }),
    ).not.toBe('FULL_PROGRAM_MEMBER');
  });
  it('should not allow denied associate program members', () => {
    expect(
      validator.getProgramMembershipAccessLevel({
        permissions: ['PROGRAMMEMBERSHIP-ASSOCIATE.READ', 'PROGRAMMEMBERSHIP-ASSOCIATE.DENY'],
      }),
    ).not.toBe('ASSOCIATE_PROGRAM_MEMBER');
  });
});
