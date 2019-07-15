import utils from '../src/ego-token-utils'

const {
  isValidJwt,
  getReadableProgramScopes,
  isDccMember,
  canReadProgram,
  canWriteProgram,
  isProgramAdmin,
  isPermission,
  isRdpcMember,
  parseScope,
  serializeScope,
  canReadSomeProgram,
  decodeToken
} = utils

/** has the following scopes:
 * "PROGRAMDATA-PACA-AU.WRITE"
 * "PROGRAMDATA-WP-CPMP-US.WRITE"
 **/
const DATA_SUBMITTER = `eyJhbGciOiJSUzI1NiJ9.ewogICJpYXQiOiAxNTYyNjc5MjA5LAogICJleHAiOiAyMDYyNzY1NjA5LAogICJzdWIiOiAiM2RjNjU5MmItMTQzNi00ZDVlLTk5MzEtMTRiZjFjZmVlZGU4IiwKICAiaXNzIjogImVnbyIsCiAgImF1ZCI6IFtdLAogICJqdGkiOiAiZDUyZTFjOGYtYzVkYS00ZGRkLTgzODUtODI2OWM4NzcxYzhiIiwKICAiY29udGV4dCI6IHsKICAgICJzY29wZSI6IFsKICAgICAgIlBST0dSQU1EQVRBLVBBQ0EtQVUuV1JJVEUiLAogICAgICAiUFJPR1JBTURBVEEtV1AtQ1BNUC1VUy5XUklURSIKICAgIF0sCiAgICAidXNlciI6IHsKICAgICAgIm5hbWUiOiAiYXJnby5kYXRhc3VibWl0dGVyQGdtYWlsLmNvbSIsCiAgICAgICJlbWFpbCI6ICJhcmdvLmRhdGFzdWJtaXR0ZXJAZ21haWwuY29tIiwKICAgICAgInN0YXR1cyI6ICJBUFBST1ZFRCIsCiAgICAgICJmaXJzdE5hbWUiOiAiRGFuIiwKICAgICAgImxhc3ROYW1lIjogIkRhdGEgU3VibWl0dHRlciIsCiAgICAgICJjcmVhdGVkQXQiOiAxNTYyNjI1NjQxODYxLAogICAgICAibGFzdExvZ2luIjogMTU2MjY3OTIwOTA1MCwKICAgICAgInByZWZlcnJlZExhbmd1YWdlIjogbnVsbCwKICAgICAgInR5cGUiOiAiVVNFUiIsCiAgICAgICJwZXJtaXNzaW9ucyI6IFsKICAgICAgICAiUFJPR1JBTURBVEEtUEFDQS1BVS5XUklURSIsCiAgICAgICAgIlBST0dSQU1EQVRBLVdQLUNQTVAtVVMuV1JJVEUiCiAgICAgIF0KICAgIH0KICB9LAogICJzY29wZSI6IFsKICAgICJQUk9HUkFNREFUQS1QQUNBLUFVLldSSVRFIiwKICAgICJQUk9HUkFNREFUQS1XUC1DUE1QLVVTLldSSVRFIgogIF0KfQ==.bNyAjQZnTynVVUwGIYWvwnf0Bu-TihJrgncMRFHfd1S_oFV9mAU7Bf-W-J4uTtnWnWurK1qsGBHJ3QO3SDiBIhaRRj4R9qAY6fDkELNamc3E7Wxa52fmikZyo0PazdmGSEefNAW1poyjZa7XCnGYDQhFNHp9a9afvAuthRqRKXA6RV5NLtJ9WUNsoA_jg9i8z4bNQb8gubLP_e3340u7G6fFR5O8yYXtOJFblNDSFbG9_OFLpZxz-iUTCAQ5tH_aDeSgCfi780BJN9sI85rBxtpVkHwkZgLBBmv0_snVKb5s-zGr4beXbh1rBKxcAd43BKCDvZbZy4YsEmGd1JQ6uA`

/** has the following scopes:
 * "PROGRAMDATA-PACA-AU.WRITE"
 * "PROGRAM-PACA-AU.WRITE"
 **/
const PROGRAM_ADMIN = `eyJhbGciOiJSUzI1NiJ9.ewogICJpYXQiOiAxNTYyNjc5MzY3LAogICJleHAiOiAyMDYyNzY1NzY3LAogICJzdWIiOiAiMTYwZmZlYzctNDk0Zi00ZGU3LWFjMDItOGRlYjEwM2I3MDU3IiwKICAiaXNzIjogImVnbyIsCiAgImF1ZCI6IFtdLAogICJqdGkiOiAiMmU3ZWZjY2QtZWNlMC00NTQ4LWE2MzAtMjA5ZDEyNDFmNDU5IiwKICAiY29udGV4dCI6IHsKICAgICJzY29wZSI6IFsKICAgICAgIlBST0dSQU1EQVRBLVBBQ0EtQVUuV1JJVEUiLAogICAgICAiUFJPR1JBTS1QQUNBLUFVLldSSVRFIgogICAgXSwKICAgICJ1c2VyIjogewogICAgICAibmFtZSI6ICJhcmdvLnByb2dyYW1hZEBnbWFpbC5jb20iLAogICAgICAiZW1haWwiOiAiYXJnby5wcm9ncmFtYWRAZ21haWwuY29tIiwKICAgICAgInN0YXR1cyI6ICJBUFBST1ZFRCIsCiAgICAgICJmaXJzdE5hbWUiOiAiUGF1bCIsCiAgICAgICJsYXN0TmFtZSI6ICJQcm9ncmFtIEFkbWluIiwKICAgICAgImNyZWF0ZWRBdCI6IDE1NjI2MjU2Mjg4MzgsCiAgICAgICJsYXN0TG9naW4iOiAxNTYyNjc5MzY3NjA2LAogICAgICAicHJlZmVycmVkTGFuZ3VhZ2UiOiBudWxsLAogICAgICAidHlwZSI6ICJVU0VSIiwKICAgICAgInBlcm1pc3Npb25zIjogWwogICAgICAgICJQUk9HUkFNLVBBQ0EtQVUuV1JJVEUiLAogICAgICAgICJQUk9HUkFNREFUQS1QQUNBLUFVLldSSVRFIgogICAgICBdCiAgICB9CiAgfSwKICAic2NvcGUiOiBbCiAgICAiUFJPR1JBTURBVEEtUEFDQS1BVS5XUklURSIsCiAgICAiUFJPR1JBTS1QQUNBLUFVLldSSVRFIgogIF0KfQ==.hjJXeurgqv6xaGRN9EmLQrTrK2MOp0R5RxwbnMElwcJTMwMr5MbMRYttH9jDyevZGUHW13sFsonwiXZquF2xIzUeOdditF_I2ZVzg5My_uh0jEwarscRAV_ESmvUzA0YSryHHI6f-DKgxd2S6ngLNj9kCRuFk2K_aVMXU4cgt3vV5jAoVQ-HsE2n17paYqW7jDgjcQW32HzT9Dq6WDBPvy5pndcS4AsvqrsIvJKCUDjtmjWRIcGnQ8-UDg7lNxdju_o7LYxDub1x5iuaqm5851l1z_d7EM15JyxNHh9EX2jfEkyGhXsuBIF9TvIW3LZtExUKS1n2OScq6bqjb5xSaw`

/** has the following scopes:
 * "score-argo-qa.WRITE"
 * "song-argo-qa.WRITE"
 * "program-service.WRITE"
 **/
const DCC_USER = `eyJhbGciOiJSUzI1NiJ9.ewogICJpYXQiOiAxNTYyNjg0NDU4LAogICJleHAiOiAyMDYyNzcwODU4LAogICJzdWIiOiAiN2VlMWRkODctNTUzMC00MzA0LWIzYjItZTZiYzU5M2FmYjM3IiwKICAiaXNzIjogImVnbyIsCiAgImF1ZCI6IFtdLAogICJqdGkiOiAiYWI0NTI0MjUtYjJiOC00MzExLWFmOTAtZGFkNzhjYjM0YTUzIiwKICAiY29udGV4dCI6IHsKICAgICJzY29wZSI6IFsKICAgICAgInNjb3JlLWFyZ28tcWEuV1JJVEUiLAogICAgICAic29uZy1hcmdvLXFhLldSSVRFIiwKICAgICAgInByb2dyYW0tc2VydmljZS5XUklURSIKICAgIF0sCiAgICAidXNlciI6IHsKICAgICAgIm5hbWUiOiAib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsCiAgICAgICJlbWFpbCI6ICJvaWNydGVzdHVzZXJAZ21haWwuY29tIiwKICAgICAgInN0YXR1cyI6ICJBUFBST1ZFRCIsCiAgICAgICJmaXJzdE5hbWUiOiAiT0lDUiIsCiAgICAgICJsYXN0TmFtZSI6ICJUZXN0ZXIiLAogICAgICAiY3JlYXRlZEF0IjogMTU2MjYyMzkwODU2MywKICAgICAgImxhc3RMb2dpbiI6IDE1NjI2ODQ0NTg0MDksCiAgICAgICJwcmVmZXJyZWRMYW5ndWFnZSI6IG51bGwsCiAgICAgICJ0eXBlIjogIlVTRVIiLAogICAgICAicGVybWlzc2lvbnMiOiBbCiAgICAgICAgInNjb3JlLWFyZ28tcWEuV1JJVEUiLAogICAgICAgICJwcm9ncmFtLXNlcnZpY2UuV1JJVEUiLAogICAgICAgICJzb25nLWFyZ28tcWEuV1JJVEUiCiAgICAgIF0KICAgIH0KICB9LAogICJzY29wZSI6IFsKICAgICJzY29yZS1hcmdvLXFhLldSSVRFIiwKICAgICJzb25nLWFyZ28tcWEuV1JJVEUiLAogICAgInByb2dyYW0tc2VydmljZS5XUklURSIKICBdCn0=.UDg7lNxdju_o7LYxDub1x5iuaqm5851l1z_d7EM15JyxNHh9EX2jfEkyGhXsuBIF9TvIW3LZtExUKS1n2OScq6bqjb5xSaw`

const EXPIRED_TOKEN =
  'eyJhbGciOiJSUzI1NiJ9.ewogICJpYXQiOiAxNTYyNjg0NDU4LAogICJleHAiOiAxNTYyNzcwODU4LAogICJzdWIiOiAiN2VlMWRkODctNTUzMC00MzA0LWIzYjItZTZiYzU5M2FmYjM3IiwKICAiaXNzIjogImVnbyIsCiAgImF1ZCI6IFtdLAogICJqdGkiOiAiYWI0NTI0MjUtYjJiOC00MzExLWFmOTAtZGFkNzhjYjM0YTUzIiwKICAiY29udGV4dCI6IHsKICAgICJzY29wZSI6IFsKICAgICAgInNjb3JlLWFyZ28tcWEuV1JJVEUiLAogICAgICAic29uZy1hcmdvLXFhLldSSVRFIiwKICAgICAgInByb2dyYW0tc2VydmljZS5XUklURSIKICAgIF0sCiAgICAidXNlciI6IHsKICAgICAgIm5hbWUiOiAib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsCiAgICAgICJlbWFpbCI6ICJvaWNydGVzdHVzZXJAZ21haWwuY29tIiwKICAgICAgInN0YXR1cyI6ICJBUFBST1ZFRCIsCiAgICAgICJmaXJzdE5hbWUiOiAiT0lDUiIsCiAgICAgICJsYXN0TmFtZSI6ICJUZXN0ZXIiLAogICAgICAiY3JlYXRlZEF0IjogMTU2MjYyMzkwODU2MywKICAgICAgImxhc3RMb2dpbiI6IDE1NjI2ODQ0NTg0MDksCiAgICAgICJwcmVmZXJyZWRMYW5ndWFnZSI6IG51bGwsCiAgICAgICJ0eXBlIjogIlVTRVIiLAogICAgICAicGVybWlzc2lvbnMiOiBbCiAgICAgICAgInNjb3JlLWFyZ28tcWEuV1JJVEUiLAogICAgICAgICJwcm9ncmFtLXNlcnZpY2UuV1JJVEUiLAogICAgICAgICJzb25nLWFyZ28tcWEuV1JJVEUiCiAgICAgIF0KICAgIH0KICB9LAogICJzY29wZSI6IFsKICAgICJzY29yZS1hcmdvLXFhLldSSVRFIiwKICAgICJzb25nLWFyZ28tcWEuV1JJVEUiLAogICAgInByb2dyYW0tc2VydmljZS5XUklURSIKICBdCn0=.UDg7lNxdju_o7LYxDub1x5iuaqm5851l1z_d7EM15JyxNHh9EX2jfEkyGhXsuBIF9TvIW3LZtExUKS1n2OScq6bqjb5xSaw'

const BOGUS_PROGRAM_ID = 'BOGUS_PROGRAM'

describe('isRdpcMember', () => {
  it('should invalidate all non RDPC tokens', () => {
    ;[DATA_SUBMITTER, PROGRAM_ADMIN, DCC_USER].forEach(token => {
      expect(isRdpcMember(token)).toBe(false)
    })
  })
  it('should return false if failed', () => {
    expect(isRdpcMember('ssdfg')).toBe(false)
  })
})

describe('parseScope', () => {
  it('should parse valid scopes correctly', () => {
    expect(parseScope('PROGRAM-WP-CPMP-US.READ')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'READ'
    })
    expect(parseScope('PROGRAM-WP-CPMP-US.WRITE')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'WRITE'
    })
    expect(parseScope('PROGRAM-WP-CPMP-US.ADMIN')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'ADMIN'
    })
    expect(parseScope('PROGRAM-WP-CPMP-US.DENY')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'DENY'
    })
  })
  it('should throw error ', () => {
    expect(() => parseScope('PROGRAM-WP-CPMP-US.sdfgsdfg')).toThrow()
  })
})

describe('serializeScope', () => {
  it('should serialize properly', () => {
    expect(
      serializeScope({
        policy: 'PROGRAM-WP-CPMP-US',
        permission: 'DENY'
      })
    ).toBe('PROGRAM-WP-CPMP-US.DENY')
  })
})

describe('isPermission', () => {
  it('should validates all permissions', () => {
    ;['READ', 'WRITE', 'ADMIN', 'DENY'].forEach(str => {
      expect(isPermission(str)).toBe(true)
    })
  })
  it('should invalidate non permission', () => {
    ;['', undefined, 1, null].forEach(str => {
      expect(isPermission(str)).toBe(false)
    })
  })
})

describe('isValidJwt', () => {
  it('should return false if undefined', () => {
    expect(isValidJwt()).toBe(false)
  })
  it('should return false if failed', () => {
    expect(isValidJwt('sfgsdfg')).toBe(false)
  })
  it('should return true for valid jwt', () => {
    ;[DATA_SUBMITTER, PROGRAM_ADMIN, DCC_USER].forEach(token => {
      expect(isValidJwt(token)).toBe(true)
    })
  })
  it('should return false for expired token', () => {
    expect(isValidJwt(EXPIRED_TOKEN)).toBe(false)
  })
})

describe('getReadableProgramScopes', () => {
  it('should return authorized program scopes', () => {
    expect(getReadableProgramScopes(DATA_SUBMITTER)).toEqual([])
    expect(getReadableProgramScopes(PROGRAM_ADMIN)).toEqual([
      { policy: 'PROGRAM-PACA-AU', permission: 'WRITE' }
    ])
    expect(getReadableProgramScopes(DCC_USER)).toEqual([])
  })
})

describe('isDccMember', () => {
  it('should validate DCC member as such', () => {
    expect(isDccMember(DCC_USER)).toBe(true)
  })
  it('should validate non DCC member as such', () => {
    expect(isDccMember(DATA_SUBMITTER)).toBe(false)
  })
  it('should return false if fail', () => {
    expect(isDccMember('asdfsdf')).toBe(false)
  })
})

describe('canReadProgram', () => {
  it('should validate read access', () => {
    expect(canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true)
  })
  it('should handle "" for programId correctly', () => {
    expect(canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: '' })).toBe(false)
  })
  it('should invalidate read access', () => {
    expect(canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: BOGUS_PROGRAM_ID })).toBe(false)
  })
  it('should give dcc members access', () => {
    expect(canReadProgram({ egoJwt: DCC_USER, programId: '' })).toBe(true)
  })
})

describe('canWriteProgram', () => {
  it('should validate write access', () => {
    expect(canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true)
  })
  it('should invalidate write access', () => {
    expect(canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: BOGUS_PROGRAM_ID })).toBe(false)
  })
  it('should handle "" for programId correctly', () => {
    expect(canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: '' })).toBe(false)
  })
  it('should invalidate read only access', () => {
    expect(canWriteProgram({ egoJwt: DATA_SUBMITTER, programId: 'WP-CPMP-US' })).toBe(false)
  })
  it('should give dcc members access', () => {
    expect(canReadProgram({ egoJwt: DCC_USER, programId: '' })).toBe(true)
  })
})

describe('isProgramAdmin', () => {
  it('should validate admin access', () => {
    expect(isProgramAdmin({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true)
  })
  it('should invalidate read only access', () => {
    expect(isProgramAdmin({ egoJwt: DATA_SUBMITTER, programId: 'PACA-AU' })).toBe(false)
  })
})

describe('canReadSomeProgram', () => {
  it('should return true for dcc members', () => {
    expect(canReadSomeProgram(DCC_USER)).toBe(true)
  })
  it('should return true for program admin', () => {
    expect(canReadSomeProgram(PROGRAM_ADMIN)).toBe(true)
  })
  it('should return false for data submitters with no program access', () => {
    expect(canReadSomeProgram(DATA_SUBMITTER)).toBe(false)
  })
})
