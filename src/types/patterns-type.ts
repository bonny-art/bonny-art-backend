import { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { Language } from './common-types';

export type Genre =
  | 'animalism'
  | 'fantasy'
  | 'floral'
  | 'landscape'
  | 'portrait'
  | 'scene'
  | 'stilllife'
  | 'other'
  | 'architecture'
  | 'cityscape'
  | 'seascape'
  | 'mythological'
  | 'historical'
  | 'religious'
  | 'nude'
  | 'genepainting'
  | 'wildlife';

export type PatternDoc = {
  _id: ObjectId;
  codename: string;
  patternNumber: string;
  patternType: 'S' | 'B' | 'T';
  width: number;
  height: number;
  maxSize: number;
  colors: number;
  solids: number;
  blends: number;
  title: {
    name: { [key in Language]: string };
  };
  author: {
    name: { [key in Language]: string };
  };
  origin: string;
  genre: {
    name: { [key in Language]: string };
  };
  cycle: {
    name: { [key in Language]: string };
  };
  pictures: {
    main: {
      url: string;
    };
    pattern: {
      url: { [key in Language]: string };
    };
  };
};

export type FormattedPattern = {
  id: ObjectId;
  title: string;
  codename: string;
  width: number | null;
  height: number | null;
  colors: number;
  solids: number;
  blends: number;
  author: string;
  origin: string;
  mainPictureUrl: string;
};

export type GetAllPatternsResult = {
  patterns: FormattedPattern[];
};

export type PatternData = {
  codename: string;
  patternNumber: string;
  patternType: 'S' | 'B' | 'T';
  width: number;
  height: number;
  maxSize: number;
  colors: number;
  solids: number;
  blends: number;
  title: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  origin: 'painting' | 'illustration' | 'photo';
  genre: mongoose.Types.ObjectId;
  cycle?: mongoose.Types.ObjectId;
  ratings?: {
    userId: string;
    rating: number;
  }[];
  pictures: {
    main: {
      url: string;
    };
    pattern: {
      url: {
        uk: string;
        en: string;
      };
    };
  };
};
