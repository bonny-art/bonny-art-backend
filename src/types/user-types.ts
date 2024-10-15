import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  token?: string;
}

export interface UserQuery {
  email?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  verificationToken: string;
}
