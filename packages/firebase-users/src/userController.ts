import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { User } from './types';

export async function createUser(
  request: Hapi.Request
): Promise<User | unknown> {
  try {
    const user = request.payload as User;
    const createdUser = await request.pre.firebase.auth().createUser(user);
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
    return await request.pre.firebase.auth().updateUser(uid, user);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

async function getUserByEmail(request: Hapi.Request): Promise<User | unknown> {
  try {
    const { email } = request.payload as User;
    return await request.pre.firebase.auth().getUserByEmail(email);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

async function getUserById(request: Hapi.Request): Promise<User | unknown> {
  try {
    const { uid } = request.params;
    return await request.pre.firebase.auth().getUser(uid);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

async function getUserByPhoneNumber(
  request: Hapi.Request
): Promise<User | unknown> {
  try {
    const { phoneNumber } = request.payload as User;
    return await request.pre.firebase.auth().getUserByPhoneNumber(phoneNumber);
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
  request: Hapi.Request
): Promise<User | unknown> {
  try {
    const { uid } = request.params;
    const { claims } = request.payload as User;
    return await request.pre.firebase.auth().setCustomUserClaims(uid, claims);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
}

export const getUser = {
  byId: getUserById,
  byEmail: getUserByEmail,
  byPhoneNumber: getUserByPhoneNumber,
};
