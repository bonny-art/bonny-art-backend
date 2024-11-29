import { ObjectId } from 'mongoose';
import { Master } from './masters-types';

export type WorkExtendedByMaster = {
  _id: ObjectId;
  master: Master;
  canvas: string;
  canvasCount: number;
  stitchType: string;
  threadCount: number;
  threads: string;
};
