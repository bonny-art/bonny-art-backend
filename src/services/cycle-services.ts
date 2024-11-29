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
