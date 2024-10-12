import { ObjectId } from 'mongoose';
import { Master } from './masters-type';

export type WorkExtendedByMaster = {
  _id: ObjectId;
  master: Master;
  fabric: string;
  fabricCount: number;
  stitchType: string;
  threadCount: number;
  threads: string;
};
