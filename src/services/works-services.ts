import { WorkPhoto } from '../db/models/work-photo.schema.js';

export const getRandomWorkPhotos = async (count: number, language: string) => {
  let works = [];
  let attempts = 3;

  while (works.length < count && attempts > 0) {
    works = await WorkPhoto.aggregate([
      { $sample: { size: 10 } }, // Увеличили выборку до 10
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

    attempts -= 1;
  }

  return works;
};
