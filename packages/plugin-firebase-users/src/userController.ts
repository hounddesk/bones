import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import Hoek from '@hapi/hoek';
import { User } from './types';

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
  request: Hapi.Request
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
      return { ...createdUser, ...user.extras } as User;
    }
    return createdUser as User;
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
    return h.response().code(200);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

export async function updateUser(
  request: Hapi.Request
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
      return { ...updatedUser, ...user.extras };
    }
    return updatedUser;
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

async function getUserById(request: Hapi.Request): Promise<User | unknown> {
  try {
    const { uid } = request.params;
    const { extras } = request.query;
    const user = await request.pre.firebase.auth().getUser(uid);
    return assignUserExtras(user, request, !!extras);
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
