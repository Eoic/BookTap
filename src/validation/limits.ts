const validationLimits = {
  EMAIL: { max: 100 },
  PASSWORD: { min: 6, max: 4096 },
  SCRIPT_FILENAME: 50,
  USERNAME: { min: 4, max: 25 },
};

export const shelfLimits = {
  title: { max: 255 },
  description: { max: 255 },
};

export const topicLimits = {
  title: { max: 255 },
  description: { max: 255 },
};

export { validationLimits };
