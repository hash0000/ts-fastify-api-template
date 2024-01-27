export const propertyLength = {
  DEVICE: {
    NAME: { MIN: 1, MAX: 127 },
    UNDER_ID: { MIN: 1, MAX: 255 },
  },
  SOUND_EVENT: {
    SIGNATURE_FILE_PATH: { MIN: 1, MAX: 4096 },
    RECORD: { MIN: 1, MAX: 4096 },
  },
  SOUND_TYPE: {
    NAME: { MIN: 1, MAX: 127 },
    UNDER_ID: { MIN: 1, MAX: 255 },
    FILE_PATH: { MIN: 1, MAX: 4096 },
  },
  SOUND_TYPE_TAG: {
    NAME: { MIN: 1, MAX: 127 },
  },
};
