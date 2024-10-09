import {
  FormattedPattern,
  GetAllPatternsResult,
  Language,
  PatternDb,
} from '../types/patterns-type.js';
import { Pattern } from '../db/models/Pattern.js';
import { Work } from '../db/models/Work.js';
import { WorkPhoto } from '../db/models/WorkPhoto.js';
import { Master } from '../db/models/Master.js';

export const getAllPatterns = async (
  language: Language
): Promise<GetAllPatternsResult> => {
  const patterns: PatternDb[] = await Pattern.find({});

  const formattedPatterns: FormattedPattern[] = patterns.map((pattern) => {
    const widthHeightMatch = pattern.codename.match(/\((\d+)x(\d+)\)/);
    const width = widthHeightMatch ? parseInt(widthHeightMatch[1]) : null;
    const height = widthHeightMatch ? parseInt(widthHeightMatch[2]) : null;

    return {
      id: pattern._id.toString(),
      title: pattern.title[language],
      codename: pattern.codename,
      width,
      height,
      colors: pattern.solids + pattern.blends,
      solids: pattern.solids,
      blends: pattern.blends,
      author: pattern.author[language],
      origin: pattern.origin[language],
      mainPictureUrl: pattern.pictures.main.url,
    };
  });

  return { patterns: formattedPatterns };
};

export const getPhotosWithMasterAndWork = async (patternId: string) => {
  try {
    const photos = await WorkPhoto.find({ pattern: patternId }).populate({
      path: 'work',
      populate: {
        path: 'master',
        model: 'Master',
      },
    });

    return photos;
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};

export const getPatternDetails = async (patternId: string) => {
  const pattern = await Pattern.findById(patternId);
  return pattern;
};

export const getWorkByID = async (patternId: string) => {
  const work = await Work.findById(patternId);
  return work;
};

export const getMasterByID = async (masterId: string) => {
  const master = await Master.findById(masterId);
  return master;
};
