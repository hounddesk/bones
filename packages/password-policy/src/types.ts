export interface PasswordLengthPolicy {
  minLength: number;
}

export interface PasswordExpressionPolicy {
  atLeast: number;
  expressions: Array<string>;
}

export interface PasswordPolicySchema {
  length?: PasswordLengthPolicy;
  contains?: PasswordExpressionPolicy;
}
export enum PasswordPolicyType {
  Low = 'low',
  Easy = 'easy',
  Normal = 'normal',
  Medium = 'medium',
  Complex = 'complex',
}

export enum PasswordsLengthsType {
  Low = 6,
  Easy = 6,
  Normal = 10,
  Medium = 10,
  Complex = 15,
}
