import parser from '../src/index';

describe('Hapi Bearer parser test suite', () => {
  it('should Unauthorized the request when the authorization header is malformed', () => {
    expect(() => parser('')).toThrowError('Unauthorized');
  });

  it('should unauthorize the bearer token is empty', () => {
    expect(() => parser('Bearer ')).toThrowError(
      'Bad HTTP authentication header format'
    );
  });

  it('should parse the bearer token when the header is valid', () => {
    expect(parser('Bearer [the-token]')).toBe('[the-token]');
  });
});
