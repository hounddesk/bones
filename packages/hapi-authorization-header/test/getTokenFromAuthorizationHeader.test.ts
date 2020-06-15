import { SupportedAuthorizationHeader } from '../src/types';
import { getTokenFromAuthorizationHeader } from '../src/getTokenFromAuthorizationHeader';

describe('Request Headers Test Suite', () => {
  describe('Bearer token authorization ', () => {
    it('should fail when the authorization header is empty', () => {
      expect(() =>
        getTokenFromAuthorizationHeader(
          '',
          SupportedAuthorizationHeader.BearerToken
        )
      ).toThrowError('Missing authorization header');
    });
    it('should fail when the authorization header is not a valid Bearer header', () => {
      expect(() =>
        getTokenFromAuthorizationHeader(
          'Bearer',
          SupportedAuthorizationHeader.BearerToken
        )
      ).toThrowError('Bad HTTP authentication header format');
    });
    it('should extract the token when the header is correct', () => {
      const expectedToken = 'xxxxxxxxxx';
      expect(
        getTokenFromAuthorizationHeader(
          `Bearer ${expectedToken}`,
          SupportedAuthorizationHeader.BearerToken
        )
      ).toEqual(expectedToken);
    });
  });
});
