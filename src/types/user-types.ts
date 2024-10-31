import { Document, Types } from 'mongoose';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 48;

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  userName: string;
  token?: string;
  verify?: boolean;
  verifyToken?: string;
}

export interface UserQuery {
  email?: string;
  userName?: string;
  verifyToken?: string; 
}

export interface CreateUserData {
  email: string;
  password: string;
  userName: string;
  verifyToken: string;
}
export interface Payload {
  id: string;
}
