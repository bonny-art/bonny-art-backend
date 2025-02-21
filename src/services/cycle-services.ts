import HttpError from '../helpers/http-error.js';
import { Cycle } from '../db/models/cycle.schema.js';

export const getCycleById = async (cycleId: string) => {
  const cycle = await Cycle.findById(cycleId);

  return cycle;
};

export const getCycleByName = async (name: string) => {
  const cycle = await Cycle.findOne({
    $or: [{ 'name.uk': name }, { 'name.en': name }],
  });

  return cycle;
};

export const createCycle = async (cycleData: {
  name: {
    uk: string;
    en: string;
  };
  description?: {
    uk?: string;
    en?: string;
  };
}) => {
  const newCycle = new Cycle(cycleData);
  await newCycle.save();
  return newCycle;
};

export const findOrCreateCycle = async (cycleData: {
  uk: string;
  en: string;
}) => {
  if (!cycleData || !cycleData.uk || !cycleData.en) {
    throw HttpError(400, 'Cycle data is missing or invalid');
  }

  const existingCycle = await Cycle.findOne({ 'name.en': cycleData.en });

  if (existingCycle) {
    if (existingCycle.name && existingCycle.name.uk !== cycleData.uk) {
      throw HttpError(
        400,
        'Mismatch in Ukrainian cycle name. Please verify the spelling.'
      );
    }
    return existingCycle._id;
  }

  const newCycle = new Cycle({ name: cycleData });
  await newCycle.save();

  return newCycle._id;
};
