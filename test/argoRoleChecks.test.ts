import { isDacoApproved } from '../src/argoRoleChecks';

describe('isDacoApproved', () => {
  it('should return true when permissions include `DACO.READ`', () => {
    const result = isDacoApproved(['asdf.WRITE', 'DACO.READ', 'OTHER.READ']);
    expect(result).toBe(true);
  });
  it('should return false when permissions do not include `DACO.READ`', () => {
    const result = isDacoApproved(['asdf.WRITE', 'OTHER.READ']);
    expect(result).toBe(false);
  });
});
