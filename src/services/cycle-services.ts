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
  let cycle = await Cycle.findOne({ 'name.en': cycleData.en });

  if (!cycle) {
    cycle = new Cycle({
      name: cycleData,
    });
    await cycle.save();
  }

  return cycle._id;
};
