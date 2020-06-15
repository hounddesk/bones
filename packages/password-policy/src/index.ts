import { PasswordPolicyType } from './types';
import passwordPolicies from './passwordPolicies';

export function isPasswordValid(
  password: string,
  passwordPolicyType: PasswordPolicyType = PasswordPolicyType.Low
): boolean {
  const policy = passwordPolicies[passwordPolicyType];
  const checkResult = policy.check(password);
  return checkResult;
}
