import { WorkPhoto } from '../db/models/work-photo.schema.js';

export const getRandomWorkPhotos = async (count: number, language: string) => {
  const works = await WorkPhoto.aggregate([
    { $sample: { size: 6  } }, 
    {
      $lookup: {
        from: 'patterns',
        localField: 'pattern',
        foreignField: '_id',
        as: 'pattern',
      },
    },
    { $unwind: { path: '$pattern', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'pattern_titles',
        localField: 'pattern.title',
        foreignField: '_id',
        as: 'title',
      },
    },
    { $unwind: { path: '$title', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'works',
        localField: 'work',
        foreignField: '_id',
        as: 'work',
      },
    },
    { $unwind: { path: '$work', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'masters',
        localField: 'work.master',
        foreignField: '_id',
        as: 'master',
      },
    },
    { $unwind: { path: '$master', preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: '$pattern._id', 
        workPhoto: { $first: '$$ROOT' }, 
      },
    },

    { $replaceRoot: { newRoot: '$workPhoto' } }, 

    { $limit: count }, 

    {
      $project: {
        _id: 1,
        imageUrl: 1,
        patternTitle: { $ifNull: [`$title.name.${language}`, 'Untitled'] },
        masterName: { $ifNull: [`$master.name.${language}`, 'Unknown'] },
      },
    },
  ]);

  return works;
};
