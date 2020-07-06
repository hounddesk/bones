import Joi from '@hapi/joi';
import { UserSignin } from '../types';

export default Joi.object<UserSignin>({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string(),
});
