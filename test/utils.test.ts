import createValidator from '../src/ego-token-utils';

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

describe('isRdpcMember', () => {
  it('should invalidate all non RDPC tokens', () => {
    [DATA_SUBMITTER, PROGRAM_ADMIN, DCC_USER].forEach(token => {
      expect(validator.isRdpcMember(token)).toBe(false);
    });
  });
  it('should return false if failed', () => {
    expect(validator.isRdpcMember('ssdfg')).toBe(false);
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
    expect(validator.getReadableProgramScopes(DATA_SUBMITTER)).toEqual([]);
    expect(validator.getReadableProgramScopes(PROGRAM_ADMIN)).toEqual([
      { policy: 'PROGRAM-PACA-AU', permission: 'WRITE' },
    ]);
    expect(validator.getReadableProgramScopes(DCC_USER)).toEqual([]);
  });
});

describe('getWriteableProgramScopes', () => {
  it('should return authorized program scopes', () => {
    expect(validator.getWriteableProgramScopes(DATA_SUBMITTER)).toEqual([]);
    expect(validator.getWriteableProgramScopes(PROGRAM_ADMIN)).toEqual([
      { policy: 'PROGRAM-PACA-AU', permission: 'WRITE' },
    ]);
    expect(validator.getWriteableProgramScopes(DCC_USER)).toEqual([]);
  });
});

describe('getReadableProgramShortNames', () => {
  it('should return authorized program names', () => {
    expect(validator.getReadableProgramShortNames(DATA_SUBMITTER)).toEqual([]);
    expect(validator.getReadableProgramShortNames(PROGRAM_ADMIN)).toEqual(['PACA-AU']);
    expect(validator.getReadableProgramShortNames(DCC_USER)).toEqual([]);
  });
});

describe('getWriteableProgramShortNames', () => {
  it('should return authorized program names', () => {
    expect(validator.getWriteableProgramShortNames(DATA_SUBMITTER)).toEqual([]);
    expect(validator.getWriteableProgramShortNames(PROGRAM_ADMIN)).toEqual(['PACA-AU']);
    expect(validator.getWriteableProgramShortNames(DCC_USER)).toEqual([]);
  });
});

describe('isDccMember', () => {
  it('should validate DCC member as such', () => {
    expect(validator.isDccMember(DCC_USER)).toBe(true);
  });
  it('should validate non DCC member as such', () => {
    expect(validator.isDccMember(DATA_SUBMITTER)).toBe(false);
  });
  it('should return false if fail', () => {
    expect(validator.isDccMember('asdfsdf')).toBe(false);
  });
});

describe('canReadProgram', () => {
  it('should validate read access', () => {
    expect(validator.canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true);
  });
  it('should handle "" for programId correctly', () => {
    expect(validator.canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: '' })).toBe(false);
  });
  it('should invalidate read access', () => {
    expect(validator.canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: BOGUS_PROGRAM_ID })).toBe(
      false,
    );
  });
  it('should give dcc members access', () => {
    expect(validator.canReadProgram({ egoJwt: DCC_USER, programId: '' })).toBe(true);
  });
});

describe('canWriteProgram', () => {
  it('should validate write access', () => {
    expect(validator.canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true);
  });
  it('should invalidate write access', () => {
    expect(validator.canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: BOGUS_PROGRAM_ID })).toBe(
      false,
    );
  });
  it('should handle "" for programId correctly', () => {
    expect(validator.canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: '' })).toBe(false);
  });
  it('should invalidate read only access', () => {
    expect(validator.canWriteProgram({ egoJwt: DATA_SUBMITTER, programId: 'WP-CPMP-US' })).toBe(
      false,
    );
  });
  it('should give dcc members access', () => {
    expect(validator.canReadProgram({ egoJwt: DCC_USER, programId: '' })).toBe(true);
  });
});

describe('isProgramAdmin', () => {
  it('should validate admin access', () => {
    expect(validator.isProgramAdmin({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true);
  });
  it('should invalidate read only access', () => {
    expect(validator.isProgramAdmin({ egoJwt: DATA_SUBMITTER, programId: 'PACA-AU' })).toBe(false);
  });
});

describe('canReadSomeProgram', () => {
  it('should return true for dcc members', () => {
    expect(validator.canReadSomeProgram(DCC_USER)).toBe(true);
  });
  it('should return true for program admin', () => {
    expect(validator.canReadSomeProgram(PROGRAM_ADMIN)).toBe(true);
  });
  it('should return false for data submitters with no program access', () => {
    expect(validator.canReadSomeProgram(DATA_SUBMITTER)).toBe(false);
  });
});

describe('canWriteSomeProgram', () => {
  it('should return true for dcc members', () => {
    expect(validator.canWriteSomeProgram(DCC_USER)).toBe(true);
  });
  it('should return true for program admin', () => {
    expect(validator.canWriteSomeProgram(PROGRAM_ADMIN)).toBe(true);
  });
  it('should return false for data submitters with no program access', () => {
    expect(validator.canWriteSomeProgram(DATA_SUBMITTER)).toBe(false);
  });
});

describe('getReadableProgramDataScopes', () => {
  it('should return the right list of accessible scope objects', () => {
    expect(validator.getReadableProgramDataScopes(DATA_SUBMITTER)).toEqual([
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
    expect(validator.canReadSomeProgramData(DATA_SUBMITTER)).toBe(true);
  });
});

describe('canWriteSomeProgramData', () => {
  it('should return true for ', () => {
    expect(validator.canWriteSomeProgramData(DATA_SUBMITTER)).toBe(true);
  });
});

describe('canReadProgramData', () => {
  it('should return true for data submitters', () => {
    expect(
      validator.canReadProgramData({
        programId: 'PACA-AU',
        egoJwt: DATA_SUBMITTER,
      }),
    ).toBe(true);
  });
  it('should return true for DCC members', () => {
    expect(
      validator.canReadProgramData({
        programId: 'PACA-AU',
        egoJwt: DCC_USER,
      }),
    ).toBe(true);
  });
});
describe('canWriteProgramData', () => {
  it('should return true for data submitters', () => {
    expect(
      validator.canWriteProgramData({
        programId: 'PACA-AU',
        egoJwt: DATA_SUBMITTER,
      }),
    ).toBe(true);
  });
  it('should return true for DCC members', () => {
    expect(
      validator.canWriteProgramData({
        programId: 'PACA-AU',
        egoJwt: DCC_USER,
      }),
    ).toBe(true);
  });
});
