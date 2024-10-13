import { Request } from 'express';
import { ObjectId } from 'mongoose';
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

export interface setLanguageRequest extends Request {
  lang?: Language;
}

export interface checkPatternExistsRequest extends setLanguageRequest {
  pattern?: PatternDoc;
}

export type PatternDoc = {
  _id: ObjectId;
  codename: string;
  solids: number;
  blends: number;
  title: { [key in Language]: string };
  author: { [key in Language]: string };
  origin: string;
  genre: Genre[];
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
