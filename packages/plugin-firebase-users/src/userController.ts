import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import Hoek from '@hapi/hoek';
import { User, UserSignin, UserSigninResult } from './types';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

function _validateExtras(user: User, request: Hapi.Request) {
  if (user.extras) {
    Hoek.assert(
      request.pre.extrasSchema && request.pre.extrasSchema.validate,
      'Missing validation schema for extras'
    );
    Joi.assert(user.extras, request.pre.extrasSchema);
  }
}

export async function createUser(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<User | Boom.Boom<unknown>> {
  try {
    const user = request.payload as User;
    _validateExtras(user, request);
    const createdUser = await request.pre.firebase.auth().createUser(user);
    if (user.claims) {
      await request.pre.firebase
        .auth()
        .setCustomUserClaims(createdUser.uid, user.claims);
    }

    // Store custom properties in Firestore
    if (user.extras) {
      const db = request.pre.firebase.firestore();
      const document = db.collection('users').doc(createdUser.uid);
      await document.set(user.extras);
      const response = { ...createdUser, extras: user.extras } as User;
      return await request.pre.afterCreateUser(request, h, response);
    }
    return await request.pre.afterCreateUser(request, h, createdUser);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

export async function deleteUser(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<Hapi.ResponseObject | unknown> {
  try {
    const { uid } = request.params;
    await request.pre.firebase.auth().deleteUser(uid);
    // Delete extras from firestore
    const db = request.pre.firebase.firestore();
    await db.collection('users').doc(uid).delete();
    return await request.pre.afterDeleteUser(
      request,
      h,
      h.response().code(200)
    );
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

export async function updateUser(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<User | unknown> {
  try {
    const user = request.payload as User;
    const { uid } = request.params;
    const updatedUser = await request.pre.firebase.auth().updateUser(uid, user);
    // Update extra fields from firestore
    if (user.extras) {
      _validateExtras(user, request);
      const db = request.pre.firebase.firestore();
      const document = db.collection('users').doc(uid);
      await document.update(user.extras);
      const response = { ...updatedUser, ...user.extras };
      return await request.pre.afterUpdateUser(request, h, response);
    }
    return await request.pre.afterUpdateUser(request, h, updatedUser);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

async function getUserByEmail(request: Hapi.Request): Promise<User | unknown> {
  try {
    const { email } = request.payload as User;
    const { extras } = request.query;
    const user = await request.pre.firebase.auth().getUserByEmail(email);
    return assignUserExtras(user, request, !!extras);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

async function getUserById(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<User | unknown> {
  try {
    const { uid } = request.params;
    const { extras } = request.query;
    const user = await request.pre.firebase.auth().getUser(uid);
    const response = await assignUserExtras(user, request, !!extras);
    return await request.pre.afterGetUser(request, h, response);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

async function getUserByPhoneNumber(
  request: Hapi.Request
): Promise<User | unknown> {
  try {
    const { phoneNumber } = request.payload as User;
    const { extras } = request.query;
    const user = await request.pre.firebase
      .auth()
      .getUserByPhoneNumber(phoneNumber);
    return assignUserExtras(user, request, !!extras);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

export async function listUsers(
  request: Hapi.Request
): Promise<User | unknown> {
  try {
    const { limit, pageToken } = request.query;
    return await request.pre.firebase.auth().listUsers(limit, pageToken);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

export async function setCustomUserClaims(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<User | unknown> {
  try {
    const { uid } = request.params;
    const { claims } = request.payload as User;
    await request.pre.firebase.auth().setCustomUserClaims(uid, claims);
    return h.response().code(200);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

export async function assignUserExtras(
  user: User,
  request: Hapi.Request,
  extras = false
): Promise<User | undefined> {
  if (extras && user) {
    const extras = await getExtrasFromUser(user.uid, request);
    return { ...user, ...(extras as User) };
  }
  return user;
}

export async function getExtrasFromUser(
  uid: string,
  request: Hapi.Request
): Promise<unknown> {
  const db = request.pre.firebase.firestore();
  const document = db.collection('users').doc(uid);
  const extras = await document.get();
  if (extras.exists) {
    return { extras: extras.data() };
  }
}

export const getUser = {
  byId: getUserById,
  byEmail: getUserByEmail,
  byPhoneNumber: getUserByPhoneNumber,
};

export async function userSignin(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<Hapi.ResponseObject | unknown> {
  try {
    Hoek.assert(request.pre.signin_url, 'signin_url option is required');
    const { email, password } = request.payload as UserSignin;
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);
    params.append('returnSecureToken', 'true');
    const userSigninRequest = await fetch(request.pre.signin_url, {
      method: 'POST',
      body: params,
    });
    const response = (await userSigninRequest.json()) as UserSigninResult;
    if (response.error) {
      return Boom.forbidden(response.error.message);
    }
    return request.pre.afterUserSignin(request, h, response);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}
