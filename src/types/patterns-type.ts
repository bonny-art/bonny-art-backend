import { Request } from 'express';

export type Language = 'uk' | 'en';

export interface GetAllPatternsRequest extends Request {
  params: {
    language: Language;
  };
}

export type PatternDb = {
  _id: string;
  codename: string;
  solids: number;
  blends: number;
  title: { [key in Language]: string };
  author: { [key in Language]: string };
  origin: { [key in Language]: string };
  pictures: {
    main: {
      url: string;
    };
  };
};

export type FormattedPattern = {
  id: string;
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
