import { Types, Document } from 'mongoose';

interface Rating extends Document {
  userId: Types.ObjectId;
  rating: number;
}

export interface PatternSh extends Document {
  codename: string;
  solids: number;
  blends: number;
  title: {
    uk: string;
    en: string;
  };
  author: {
    uk: string;
    en: string;
  };
  origin: string;
  genre: string[];
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
