import { ObjectId } from 'mongoose';

export type Master = {
  _id: ObjectId;
  name: {
    uk: string;
    en: string;
  };
};
