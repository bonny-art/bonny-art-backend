import mongoose, { Types } from 'mongoose';
import { Pattern } from '../db/models/pattern.schema.js';
import { PatternDoc } from '../types/patterns-types.js';

export const getPatternForOrder = async (
  patternId: mongoose.Schema.Types.ObjectId | Types.ObjectId
) => {
  return await Pattern.findById(patternId)
    .populate('title', 'name')
    .lean<PatternDoc>();
};
