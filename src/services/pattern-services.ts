import { Types } from 'mongoose';
import { Pattern } from '../db/models/pattern.schema.js';
import { Work } from '../db/models/work.schema.js';
import { WorkPhoto } from '../db/models/work-photo.schema.js';
import { Master } from '../db/models/master.schema.js';
import { PhotoExtendedByWorkExtendedByMaster } from '../types/work-photos-types.js';
import {
  PatternAgregatedDocument,
  PatternData,
  PatternDoc,
} from '../types/patterns-types.js';
import {
  Language,
  SortDirection,
  SortPhotosBy,
} from '../types/common-types.js';
import { transformPatternsFormat } from '../helpers/pattern-format-transformers.js';

export const getAllPatterns = async () => {
  const patterns: PatternDoc[] = await Pattern.find({});

  return patterns;
};

export const getAllPatternsByPage = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const patterns: PatternDoc[] = await Pattern.find({})
    .skip(skip)
    .limit(limit)
    .populate('title', 'name')
    .populate('author', 'name')
    .populate('genre', 'name')
    .populate('cycle', 'name')
    .lean<PatternDoc[]>();

  const totalCount = await Pattern.countDocuments();

  return { patterns, totalCount };
};

export const getAllPatternsByPageAndFilter = async (
  page: number,
  limit: number,
  filters: {
    sizeMin: number | null;
    sizeMax: number | null;
    colorsMin: number | null;
    colorsMax: number | null;
    cycles: string[];
    genres: string[];
    authors: string[];
    patternTitles: string[];
    origins: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  },
  lang: string
) => {
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};

  // Фільтр за maxSize
  if (filters.sizeMin !== null || filters.sizeMax !== null) {
    query.maxSize = {};
    if (filters.sizeMin !== null)
      (query.maxSize as Record<string, number>)['$gt'] = filters.sizeMin;
    if (filters.sizeMax !== null)
      (query.maxSize as Record<string, number>)['$lte'] = filters.sizeMax;
  }

  // Фільтр за colors
  if (filters.colorsMin !== null || filters.colorsMax !== null) {
    query.colors = {};
    if (filters.colorsMin !== null)
      (query.colors as Record<string, number>)['$gt'] = filters.colorsMin;
    if (filters.colorsMax !== null)
      (query.colors as Record<string, number>)['$lte'] = filters.colorsMax;
  }

  // Фільтр за cycles
  if (filters.cycles.length > 0) query.cycle = { $in: filters.cycles };

  // Фільтр за genres
  if (filters.genres.length > 0) query.genre = { $in: filters.genres };

  // Фільтр за authors
  if (filters.authors.length > 0) query.author = { $in: filters.authors };

  // Фільтр за patternTitles
  if (filters.patternTitles.length > 0)
    query.title = { $in: filters.patternTitles };

  // Фільтр за origins
  if (filters.origins.length > 0) query.origin = { $in: filters.origins };

  // Визначення сортування
  let sortField: string = 'codename';
  if (filters.sortBy === 'rating') {
    sortField = 'rating.averageRating';
  } else if (filters.sortBy === 'title') {
    sortField = `$title.name.${lang}`;
  }

  const agregatedPatterns: PatternAgregatedDocument[] = await Pattern.aggregate(
    [
      { $match: query },
      {
        $lookup: {
          from: 'pattern_titles',
          localField: 'title',
          foreignField: '_id',
          as: 'titleData',
        },
      },
      { $unwind: '$titleData' },
      {
        $lookup: {
          from: 'authors',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData',
        },
      },
      { $unwind: '$authorData' },
      {
        $lookup: {
          from: 'genres',
          localField: 'genre',
          foreignField: '_id',
          as: 'genreData',
        },
      },
      { $unwind: '$genreData' },
      {
        $lookup: {
          from: 'cycles',
          localField: 'cycle',
          foreignField: '_id',
          as: 'cycleData',
        },
      },
      { $unwind: { path: '$cycleData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          sortField:
            filters.sortBy === 'title'
              ? `$titleData.name.${lang}`
              : `$${sortField}`,
        },
      },
      { $sort: { sortField: filters.sortOrder === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ]
  );

  const patterns = transformPatternsFormat(agregatedPatterns);
  console.log(JSON.stringify(patterns, null, 2));

  const totalCount = await Pattern.countDocuments(query);

  return { patterns, totalCount };
};

export const getPatternByIdAndPopulate = async (
  patternId: string
): Promise<PatternDoc | null> => {
  const pattern = await Pattern.findById(patternId)
    .populate('title', 'name')
    .populate('author', 'name')
    .populate('genre', 'name')
    .populate('cycle', 'name')
    .lean<PatternDoc>();

  return pattern;
};

export const getPatternById = async (patternId: string) => {
  const pattern = await Pattern.findById(patternId);

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
  const pattern = await getPatternById(patternId);
  if (!pattern) {
    throw new Error('Pattern not found');
  }

  if (!pattern.rating) {
    pattern.rating = { averageRating: 0, ratings: [] };
  }

  const userObjectId = new Types.ObjectId(userId);

  const existingRating = pattern.rating.ratings.find(
    (r) => r.userId.toString() === userObjectId.toString()
  );

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    pattern.rating.ratings.push({ userId: userObjectId, rating });
  }

  const totalRating = pattern.rating.ratings.reduce(
    (acc, i) => acc + i.rating,
    0
  );
  const averageRating = totalRating / pattern.rating.ratings.length;

  const updatedPattern = await Pattern.findOneAndUpdate(
    { _id: patternId },
    {
      $set: {
        'rating.averageRating': parseFloat(averageRating.toFixed(1)),
        'rating.ratings': pattern.rating.ratings,
      },
    },
    { new: true, runValidators: true }
  );

  return updatedPattern;
};

export const deleteRatingsByUser = async (userId: string) => {
  const result = await Pattern.updateMany(
    { 'rating.ratings.userId': new Types.ObjectId(userId) },
    [
      {
        $set: {
          'rating.ratings': {
            $filter: {
              input: '$rating.ratings',
              as: 'rating',
              cond: { $ne: ['$$rating.userId', new Types.ObjectId(userId)] },
            },
          },
        },
      },
      {
        $set: {
          'rating.averageRating': {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: '$rating.ratings',
                  },
                  0,
                ],
              },
              then: {
                $round: [{ $avg: '$rating.ratings.rating' }, 1],
              },
              else: 0,
            },
          },
        },
      },
    ]
  );

  return result;
};

export const getRandomPatterns = async (count: number, language: string) => {
  const patterns = await Pattern.aggregate([
    { $sample: { size: count } },
    {
      $lookup: {
        from: 'pattern_titles',
        localField: 'title',
        foreignField: '_id',
        as: 'title',
      },
    },
    { $unwind: { path: '$title', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        title: { $ifNull: [`$title.name.${language}`, 'Untitled'] },
        mainPictureUrl: '$pictures.main.url',
      },
    },
  ]);

  return patterns;
};
