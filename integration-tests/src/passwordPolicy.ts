import Hapi from '@hapi/hapi';
import Hoek from '@hapi/hoek';
import Boom from '@hapi/boom';
import { User } from '@hounddesk/plugin-firebase-users/lib/types';
import { isPasswordValid } from '@hounddesk/password-policy';
import { PasswordPolicyType } from '@hounddesk/password-policy/lib/types';

export default function passwordPolicy(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): unknown {
  const payload = request.payload as User;
  Hoek.assert(
    isPasswordValid(payload.password, PasswordPolicyType.Low) === true,
    Boom.badRequest('invalid password')
  );
  return h.continue;
}
