import { Types, Document } from 'mongoose';

export interface Rating {
  userId: Types.ObjectId;
  rating: number;
}

export interface PatternSchemaI extends Document {
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
    uk: string;
    en: string;
  };
  author: Types.ObjectId;
  origin: 'painting' | 'illustration' | 'photo';
  genre: Types.ObjectId;
  cycle?: Types.ObjectId;
  rating: {
    averageRating: number;
    ratings: Rating[];
  };
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
}
