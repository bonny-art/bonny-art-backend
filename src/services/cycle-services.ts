import { Cycle } from '../db/models/Cycle.js';

export const getCycleById = async (cycleId: string) => {
  const cycle = await Cycle.findById(cycleId);

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
