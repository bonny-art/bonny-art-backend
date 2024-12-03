import { Document } from 'mongoose';

import { Request } from 'express';
import { PatternDoc } from './patterns-types';
import { IUser } from './user-types';

export type Language = 'uk' | 'en';

export type SortPhotosBy = 'dateReceived' | 'master';

export type SortDirection = 'asc' | 'desc';

export interface setLanguageRequest extends Request {
  lang?: Language;
}

export interface checkPatternExistsRequest extends setLanguageRequest {
  params: {
    patternId: string;
  };
  pattern?: PatternDoc;
  user?: Document & IUser;
}

// export interface AuthenticatedRequest extends Request {
//   user?: {
//     _id: Schema.Types.ObjectId;
//     userName: string;
//     email: string;
//     password: string;
//     verify: boolean;
//     verifyToken: string;
//     passwordRecoveryToken: string;
//     token: string;
//     cart: Schema.Types.ObjectId[] | PatternData[];
//   };
// }

export interface AuthenticatedRequest extends Request {
  user?: Document & IUser;
}
