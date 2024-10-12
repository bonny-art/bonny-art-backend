import { ObjectId } from 'mongoose';
import { WorkExtendedByMaster } from './works-types';

export type PhotoExtendedByWorkExtendedByMaster = {
  _id: ObjectId;
  work: WorkExtendedByMaster;
  pattern: ObjectId;
  progress?: number;
  dateReceived: Date;
  imageUrl: string;
  episodeNumber: number;
  numberWithinEpisode: number;
  review?: string;
};
