import Joi from '@hapi/joi';
import { User } from '../types';

export default Joi.object<User>({
  uid: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phoneNumber: Joi.string(),
  password: Joi.string(),
  displayName: Joi.string(),
  photoURL: Joi.string(),
  disabled: Joi.bool().default(false),
});
