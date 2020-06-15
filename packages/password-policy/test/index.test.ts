import { isPasswordValid } from '../src/index';
import defaultPasswordPolicies from '../src/passwordPolicies';

describe('Password policy test suite', () => {
  it('Should require a low password by default', () => {
    const result = isPasswordValid('123456');
    expect(result).toBe(true);
  });
  it('Should require at least 6 characters when using a low password', () => {
    const result = isPasswordValid('12345');
    const passwordPolicy = defaultPasswordPolicies.low.explain();
    const [lengthAtLeast] = passwordPolicy;
    expect(result).toBe(false);
    expect('lengthAtLeast').toBe(lengthAtLeast.code);
  });
  it('Should require at least 6 characters when using an easy password', () => {
    const result = isPasswordValid('12345');
    const passwordPolicy = defaultPasswordPolicies.easy.explain();
    const [shouldContain, lengthAtLeast] = passwordPolicy;
    expect(result).toBe(false);
    expect('shouldContain').toBe(shouldContain.code);
    expect('lengthAtLeast').toBe(lengthAtLeast.code);
  });
  it('Should require at least 10 characters when using a normal password', () => {
    const result = isPasswordValid('12345');
    const passwordPolicy = defaultPasswordPolicies.normal.explain();
    const [shouldContain, lengthAtLeast] = passwordPolicy;
    expect(result).toBe(false);
    expect('shouldContain').toBe(shouldContain.code);
    expect('lengthAtLeast').toBe(lengthAtLeast.code);
  });
  it('Should require at least 10 characters when using a medium password', () => {
    const result = isPasswordValid('12345');
    const passwordPolicy = defaultPasswordPolicies.medium.explain();
    const [shouldContain, lengthAtLeast] = passwordPolicy;
    expect(result).toBe(false);
    expect('shouldContain').toBe(shouldContain.code);
    expect('lengthAtLeast').toBe(lengthAtLeast.code);
  });
  it('Should require at least 15 characters when using a complex password', () => {
    const result = isPasswordValid('12345');
    const passwordPolicy = defaultPasswordPolicies.complex.explain();
    const [identicalChars, shouldContain, lengthAtLeast] = passwordPolicy;
    expect(result).toBe(false);
    expect('identicalChars').toBe(identicalChars.code);
    expect('shouldContain').toBe(shouldContain.code);
    expect('lengthAtLeast').toBe(lengthAtLeast.code);
  });
});
