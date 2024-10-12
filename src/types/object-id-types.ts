import { ObjectId } from 'mongoose';

export type ObjectIdStr = ObjectId & { toString(): string };
