import { Types } from 'mongoose';
import { Pattern } from '../db/models/Pattern.js';
import { Work } from '../db/models/Work.js';
import { WorkPhoto } from '../db/models/WorkPhoto.js';
import { Master } from '../db/models/Master.js';
import { PhotoExtendedByWorkExtendedByMaster } from '../types/work-photos-types.js';
import { PatternDoc } from '../types/patterns-type.js';

export const getAllPatterns = async () => {
  const patterns: PatternDoc[] = await Pattern.find({});

  return patterns;
};

export const getPatternById = async (
  patternId: string
): Promise<PatternDoc | null> => {
  const pattern = await Pattern.findById(patternId).lean<PatternDoc>();

  return pattern;
};

export const getPhotosByPatternWithMasterAndWork = async (
  patternId: string
) => {
  const photos = await WorkPhoto.find({
    pattern: patternId,
  })
    .populate({
      path: 'work',
      populate: {
        path: 'master',
        model: 'Master',
      },
    })
    .lean<PhotoExtendedByWorkExtendedByMaster[]>();

  return photos;
};

export const getPhotosByPatternWithMasterAndWorkByPage = async (
  patternId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const photos = await WorkPhoto.find({
    pattern: patternId,
  })
    .populate({
      path: 'work',
      populate: {
        path: 'master',
        model: 'Master',
      },
    })
    .skip(skip)
    .limit(limit)
    .lean<PhotoExtendedByWorkExtendedByMaster[]>();

  const totalCount = await WorkPhoto.countDocuments({ pattern: patternId });

  return { photos, totalCount };
};

export const getPhotosByPatternWithMasterAndWorkByPageWithSorting = async (
  patternId: string,
  page: number,
  limit: number,
  sortBy: 'dateReceived' | 'master',
  order: 'asc' | 'desc',
  language: 'uk' | 'en'
) => {
  const skip = (page - 1) * limit;

  const sortParam: Record<string, 1 | -1> = {};

  if (sortBy === 'dateReceived') {
    sortParam['dateReceived'] = order === 'asc' ? 1 : -1;
  }

  if (sortBy === 'master') {
    sortParam['masterName'] = order === 'asc' ? 1 : -1;
    sortParam['dateReceived'] = 1;
  }

  const photos = await WorkPhoto.aggregate([
    { $match: { pattern: new Types.ObjectId(patternId) } },
    {
      $lookup: {
        from: 'works',
        localField: 'work',
        foreignField: '_id',
        as: 'work_info',
      },
    },
    {
      $unwind: '$work_info',
    },
    {
      $lookup: {
        from: 'masters',
        localField: 'work_info.master',
        foreignField: '_id',
        as: 'master_info',
      },
    },
    {
      $unwind: '$master_info',
    },
    {
      $addFields: {
        masterName: `$master_info.name.${language}`,
      },
    },
    { $sort: sortParam },
    { $skip: skip },
    { $limit: limit },
  ]);

  console.log(JSON.stringify(photos, null, 2));

  const totalCount = await WorkPhoto.countDocuments({ pattern: patternId });

  return { photos, totalCount };
};

export const getWorkByID = async (patternId: string) => {
  const work = await Work.findById(patternId);
  return work;
};

export const getMasterByID = async (masterId: string) => {
  const master = await Master.findById(masterId);
  return master;
};
