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
  try {
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

    //todo: refactor this to move to dataHandlers and then use in controller
    const photosData = photos.map((photo) => {
      return {
        id: photo._id.toString(),
        masterId: photo.work.master._id.toString(),
        masterName: photo.work.master.name,
        review: photo.review,
        fabric: photo.work.fabric,
        fabricCount: photo.work.fabricCount,
        stitchType: photo.work.stitchType,
        threadCount: photo.work.threadCount,
        threads: photo.work.threads,
        progress: photo.progress,
        imageUrl: photo.imageUrl,
        dateReceived: photo.dateReceived,
        episodeNumber: photo.episodeNumber,
        numberWithinEpisode: photo.numberWithinEpisode,
      };
    });

    return photosData;
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};

export const getWorkByID = async (patternId: string) => {
  const work = await Work.findById(patternId);
  return work;
};

export const getMasterByID = async (masterId: string) => {
  const master = await Master.findById(masterId);
  return master;
};
