import { Error as MongooseError } from 'mongoose';

export type IHttpError = Error & {
  status?: number;
};

export type MessageListT = {
  [key: string]: string;
};

export interface MongoServerError extends MongooseError {
  code?: number;
  status?: number;
}
