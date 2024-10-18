import { Request } from 'express';
import { PatternDoc } from './patterns-type';

export type Language = 'uk' | 'en';

export type SortPhotosBy = 'dateReceived' | 'master';

export type SortDirection = 'asc' | 'desc';

export interface setLanguageRequest extends Request {
  lang?: Language;
}

export interface checkPatternExistsRequest extends setLanguageRequest {
  pattern?: PatternDoc;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    token: string;
  };
}
