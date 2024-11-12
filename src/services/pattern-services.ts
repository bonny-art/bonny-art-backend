import { Types } from 'mongoose';
import { Pattern } from '../db/models/Pattern.js';
import { Work } from '../db/models/Work.js';
import { WorkPhoto } from '../db/models/WorkPhoto.js';
import { Master } from '../db/models/Master.js';
import { PhotoExtendedByWorkExtendedByMaster } from '../types/work-photos-types.js';
import { PatternData, PatternDoc } from '../types/patterns-type.js';
import {
  Language,
  SortDirection,
  SortPhotosBy,
} from '../types/common-types.js';

export const getAllPatterns = async () => {
  const patterns: PatternDoc[] = await Pattern.find({});

  return patterns;
};

export const getAllPatternsByPage = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const patterns: PatternDoc[] = await Pattern.find({})
    .skip(skip)
    .limit(limit)
    .populate('author', 'name')
    .populate('genre', 'name')
    .populate('cycle', 'name')
    .lean<PatternDoc[]>();

  const totalCount = await Pattern.countDocuments();

  return { patterns, totalCount };
};

export const getAllPatternsByPageAndFilter = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const patterns: PatternDoc[] = await Pattern.find({})
    .skip(skip)
    .limit(limit)
    .lean<PatternDoc[]>();

  const totalCount = await Pattern.countDocuments();

  return { patterns, totalCount };
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
  sortBy: SortPhotosBy,
  order: SortDirection,
  language: Language
) => {
  const skip = (page - 1) * limit;

  const sortParam: Record<string, 1 | -1> = {};

  if (sortBy === 'dateReceived') {
    sortParam['dateReceived'] = order === 'asc' ? 1 : -1;
  }

  if (sortBy === 'master') {
    sortParam[`work.master.name.${language}`] = order === 'asc' ? 1 : -1;
    sortParam['dateReceived'] = 1;
  }

  const photos = await WorkPhoto.aggregate([
    { $match: { pattern: new Types.ObjectId(patternId) } },
    {
      $lookup: {
        from: 'works',
        localField: 'work',
        foreignField: '_id',
        as: 'work',
      },
    },
    {
      $unwind: '$work',
    },
    {
      $lookup: {
        from: 'masters',
        localField: 'work.master',
        foreignField: '_id',
        as: 'work.master',
      },
    },
    {
      $unwind: '$work.master',
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

export const createPattern = async (patternData: PatternData) => {
  const newPattern = new Pattern(patternData);
  await newPattern.save();
  return newPattern;
};

export const getPatternByCodename = async (codename: string) => {
  const pattern = await Pattern.findOne({ codename });
  return pattern;
};

export const addOrUpdateRating = async (
  patternId: string,
  userId: string,
  rating: number
) => {
  console.log('🚀 ~ rating:', rating);
  console.log('🚀 ~ userId:', userId);
  const pattern = await Pattern.findById(patternId);

  if (!pattern) {
    throw new Error('Pattern not found');
  }

  // if (!pattern.rating) {
  //   pattern.rating = { averageRating: 0, ratings: [] };
  // }

  // const userObjectId = new Types.ObjectId(userId);

  // const existingRating = pattern.rating.ratings.find(
  //   (r) => r.userId.toString() === userObjectId.toString()
  // );

  // if (existingRating) {
  //   existingRating.rating = rating;
  // } else {
  //   pattern.rating.ratings.push({ userId: userObjectId, rating });
  // }

  // const totalRating = pattern.rating.ratings.reduce(
  //   (acc, i) => acc + i.rating,
  //   0
  // );

  // pattern.rating.averageRating = parseFloat(
  //   (totalRating / pattern.rating.ratings.length).toFixed(1)
  // );

  await pattern.save();
  return pattern;
};
