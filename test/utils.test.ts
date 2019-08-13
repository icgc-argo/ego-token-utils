import createValidator from '../src/ego-token-utils'

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
const DCC_USER = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjI2ODQ0NTgsImV4cCI6MjA2Mjc3MDg1OCwic3ViIjoiN2VlMWRkODctNTUzMC00MzA0LWIzYjItZTZiYzU5M2FmYjM3IiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiYWI0NTI0MjUtYjJiOC00MzExLWFmOTAtZGFkNzhjYjM0YTUzIiwiY29udGV4dCI6eyJzY29wZSI6WyJzY29yZS1hcmdvLXFhLldSSVRFIiwic29uZy1hcmdvLXFhLldSSVRFIiwiUFJPR1JBTVNFUlZJQ0UuV1JJVEUiXSwidXNlciI6eyJuYW1lIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsInN0YXR1cyI6IkFQUFJPVkVEIiwiZmlyc3ROYW1lIjoiT0lDUiIsImxhc3ROYW1lIjoiVGVzdGVyIiwiY3JlYXRlZEF0IjoxNTYyNjIzOTA4NTYzLCJsYXN0TG9naW4iOjE1NjI2ODQ0NTg0MDksInByZWZlcnJlZExhbmd1YWdlIjpudWxsLCJ0eXBlIjoiVVNFUiIsInBlcm1pc3Npb25zIjpbInNjb3JlLWFyZ28tcWEuV1JJVEUiLCJQUk9HUkFNU0VSVklDRS5XUklURSIsInNvbmctYXJnby1xYS5XUklURSJdfX0sInNjb3BlIjpbInNjb3JlLWFyZ28tcWEuV1JJVEUiLCJzb25nLWFyZ28tcWEuV1JJVEUiLCJQUk9HUkFNU0VSVklDRS5XUklURSJdfQ.kF-SiQ41mV44vbdhMWhzNCOLPol9lirj31rDtzHcViA`

const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjI2ODQ0NTgsImV4cCI6MTU2Mjc3MDg1OCwic3ViIjoiN2VlMWRkODctNTUzMC00MzA0LWIzYjItZTZiYzU5M2FmYjM3IiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiYWI0NTI0MjUtYjJiOC00MzExLWFmOTAtZGFkNzhjYjM0YTUzIiwiY29udGV4dCI6eyJzY29wZSI6WyJzY29yZS1hcmdvLXFhLldSSVRFIiwic29uZy1hcmdvLXFhLldSSVRFIiwiUFJPR1JBTVNFUlZJQ0UuV1JJVEUiXSwidXNlciI6eyJuYW1lIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsIjoib2ljcnRlc3R1c2VyQGdtYWlsLmNvbSIsInN0YXR1cyI6IkFQUFJPVkVEIiwiZmlyc3ROYW1lIjoiT0lDUiIsImxhc3ROYW1lIjoiVGVzdGVyIiwiY3JlYXRlZEF0IjoxNTYyNjIzOTA4NTYzLCJsYXN0TG9naW4iOjE1NjI2ODQ0NTg0MDksInByZWZlcnJlZExhbmd1YWdlIjpudWxsLCJ0eXBlIjoiVVNFUiIsInBlcm1pc3Npb25zIjpbInNjb3JlLWFyZ28tcWEuV1JJVEUiLCJQUk9HUkFNU0VSVklDRS5XUklURSIsInNvbmctYXJnby1xYS5XUklURSJdfX0sInNjb3BlIjpbInNjb3JlLWFyZ28tcWEuV1JJVEUiLCJzb25nLWFyZ28tcWEuV1JJVEUiLCJQUk9HUkFNU0VSVklDRS5XUklURSJdfQ.1JAYtB1HUvZyvNNoUnp14GhTHrBvT67NlMUlBqqL_Rg'

const BOGUS_PROGRAM_ID = 'BOGUS_PROGRAM'

const PUBLIC_KEY = ''

const validator = createValidator(PUBLIC_KEY)

describe('isRdpcMember', () => {
  it('should invalidate all non RDPC tokens', () => {
    ;[DATA_SUBMITTER, PROGRAM_ADMIN, DCC_USER].forEach(token => {
      expect(validator.isRdpcMember(token)).toBe(false)
    })
  })
  it('should return false if failed', () => {
    expect(validator.isRdpcMember('ssdfg')).toBe(false)
  })
})

describe('parseScope', () => {
  it('should parse valid scopes correctly', () => {
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.READ')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'READ'
    })
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.WRITE')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'WRITE'
    })
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.ADMIN')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'ADMIN'
    })
    expect(validator.parseScope('PROGRAM-WP-CPMP-US.DENY')).toEqual({
      policy: 'PROGRAM-WP-CPMP-US',
      permission: 'DENY'
    })
  })
  it('should throw error ', () => {
    expect(() => validator.parseScope('PROGRAM-WP-CPMP-US.sdfgsdfg')).toThrow()
  })
})

describe('serializeScope', () => {
  it('should serialize properly', () => {
    expect(
      validator.serializeScope({
        policy: 'PROGRAM-WP-CPMP-US',
        permission: 'DENY'
      })
    ).toBe('PROGRAM-WP-CPMP-US.DENY')
  })
})

describe('isPermission', () => {
  it('should validates all permissions', () => {
    ;['READ', 'WRITE', 'ADMIN', 'DENY'].forEach(str => {
      expect(validator.isPermission(str)).toBe(true)
    })
  })
  it('should invalidate non permission', () => {
    ;['', undefined, 1, null].forEach(str => {
      expect(validator.isPermission(str)).toBe(false)
    })
  })
})

describe('isValidJwt', () => {
  it('should return false if undefined', () => {
    expect(validator.isValidJwt()).toBe(false)
  })
  it('should return false if failed', () => {
    expect(validator.isValidJwt('sfgsdfg')).toBe(false)
  })
  it('should return true for valid jwt', () => {
    ;[DATA_SUBMITTER, PROGRAM_ADMIN, DCC_USER].forEach(token => {
      expect(validator.isValidJwt(token)).toBe(true)
    })
  })
  it('should return false for expired token', () => {
    expect(validator.isValidJwt(EXPIRED_TOKEN)).toBe(false)
  })
})

describe('getReadableProgramScopes', () => {
  it('should return authorized program scopes', () => {
    expect(validator.getReadableProgramScopes(DATA_SUBMITTER)).toEqual([])
    expect(validator.getReadableProgramScopes(PROGRAM_ADMIN)).toEqual([
      { policy: 'PROGRAM-PACA-AU', permission: 'WRITE' }
    ])
    expect(validator.getReadableProgramScopes(DCC_USER)).toEqual([])
  })
})

describe('getWriteableProgramScopes', () => {
  it('should return authorized program scopes', () => {
    expect(validator.getWriteableProgramScopes(DATA_SUBMITTER)).toEqual([])
    expect(validator.getWriteableProgramScopes(PROGRAM_ADMIN)).toEqual([
      { policy: 'PROGRAM-PACA-AU', permission: 'WRITE' }
    ])
    expect(validator.getWriteableProgramScopes(DCC_USER)).toEqual([])
  })
})

describe('getReadableProgramShortNames', () => {
  it('should return authorized program names', () => {
    expect(validator.getReadableProgramShortNames(DATA_SUBMITTER)).toEqual([])
    expect(validator.getReadableProgramShortNames(PROGRAM_ADMIN)).toEqual(['PACA-AU'])
    expect(validator.getReadableProgramShortNames(DCC_USER)).toEqual([])
  })
})

describe('getWriteableProgramShortNames', () => {
  it('should return authorized program names', () => {
    expect(validator.getWriteableProgramShortNames(DATA_SUBMITTER)).toEqual([])
    expect(validator.getWriteableProgramShortNames(PROGRAM_ADMIN)).toEqual(['PACA-AU'])
    expect(validator.getWriteableProgramShortNames(DCC_USER)).toEqual([])
  })
})

describe('isDccMember', () => {
  it('should validate DCC member as such', () => {
    expect(validator.isDccMember(DCC_USER)).toBe(true)
  })
  it('should validate non DCC member as such', () => {
    expect(validator.isDccMember(DATA_SUBMITTER)).toBe(false)
  })
  it('should return false if fail', () => {
    expect(validator.isDccMember('asdfsdf')).toBe(false)
  })
})

describe('canReadProgram', () => {
  it('should validate read access', () => {
    expect(validator.canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true)
  })
  it('should handle "" for programId correctly', () => {
    expect(validator.canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: '' })).toBe(false)
  })
  it('should invalidate read access', () => {
    expect(validator.canReadProgram({ egoJwt: PROGRAM_ADMIN, programId: BOGUS_PROGRAM_ID })).toBe(
      false
    )
  })
  it('should give dcc members access', () => {
    expect(validator.canReadProgram({ egoJwt: DCC_USER, programId: '' })).toBe(true)
  })
})

describe('canWriteProgram', () => {
  it('should validate write access', () => {
    expect(validator.canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true)
  })
  it('should invalidate write access', () => {
    expect(validator.canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: BOGUS_PROGRAM_ID })).toBe(
      false
    )
  })
  it('should handle "" for programId correctly', () => {
    expect(validator.canWriteProgram({ egoJwt: PROGRAM_ADMIN, programId: '' })).toBe(false)
  })
  it('should invalidate read only access', () => {
    expect(validator.canWriteProgram({ egoJwt: DATA_SUBMITTER, programId: 'WP-CPMP-US' })).toBe(
      false
    )
  })
  it('should give dcc members access', () => {
    expect(validator.canReadProgram({ egoJwt: DCC_USER, programId: '' })).toBe(true)
  })
})

describe('isProgramAdmin', () => {
  it('should validate admin access', () => {
    expect(validator.isProgramAdmin({ egoJwt: PROGRAM_ADMIN, programId: 'PACA-AU' })).toBe(true)
  })
  it('should invalidate read only access', () => {
    expect(validator.isProgramAdmin({ egoJwt: DATA_SUBMITTER, programId: 'PACA-AU' })).toBe(false)
  })
})

describe('canReadSomeProgram', () => {
  it('should return true for dcc members', () => {
    expect(validator.canReadSomeProgram(DCC_USER)).toBe(true)
  })
  it('should return true for program admin', () => {
    expect(validator.canReadSomeProgram(PROGRAM_ADMIN)).toBe(true)
  })
  it('should return false for data submitters with no program access', () => {
    expect(validator.canReadSomeProgram(DATA_SUBMITTER)).toBe(false)
  })
})

describe('canWriteSomeProgram', () => {
  it('should return true for dcc members', () => {
    expect(validator.canWriteSomeProgram(DCC_USER)).toBe(true)
  })
  it('should return true for program admin', () => {
    expect(validator.canWriteSomeProgram(PROGRAM_ADMIN)).toBe(true)
  })
  it('should return false for data submitters with no program access', () => {
    expect(validator.canWriteSomeProgram(DATA_SUBMITTER)).toBe(false)
  })
})

describe('getReadableProgramDataScopes', () => {
  it('should return the right list of accessible scope objects', () => {
    expect(validator.getReadableProgramDataScopes(DATA_SUBMITTER)).toEqual([
      {
        permission: 'WRITE',
        policy: 'PROGRAMDATA-PACA-AU'
      },
      {
        permission: 'WRITE',
        policy: 'PROGRAMDATA-WP-CPMP-US'
      }
    ])
  })
})

describe('canReadSomeProgramData', () => {
  it('should return true for ', () => {
    expect(validator.canReadSomeProgramData(DATA_SUBMITTER)).toBe(true)
  })
})

describe('canWriteSomeProgramData', () => {
  it('should return true for ', () => {
    expect(validator.canWriteSomeProgramData(DATA_SUBMITTER)).toBe(true)
  })
})

describe('canReadProgramData', () => {
  it('should return true for data submitters', () => {
    expect(
      validator.canReadProgramData({
        programId: 'PACA-AU',
        egoJwt: DATA_SUBMITTER
      })
    ).toBe(true)
  })
  it('should return true for DCC members', () => {
    expect(
      validator.canReadProgramData({
        programId: 'PACA-AU',
        egoJwt: DCC_USER
      })
    ).toBe(true)
  })
})
describe('canWriteProgramData', () => {
  it('should return true for data submitters', () => {
    expect(
      validator.canWriteProgramData({
        programId: 'PACA-AU',
        egoJwt: DATA_SUBMITTER
      })
    ).toBe(true)
  })
  it('should return true for DCC members', () => {
    expect(
      validator.canWriteProgramData({
        programId: 'PACA-AU',
        egoJwt: DCC_USER
      })
    ).toBe(true)
  })
})
