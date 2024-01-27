const baseRegex: RegExp = /^[0-9a-zA-Zа-яА-ЯёЁ ~.,;:\n!@#$%^&*()_+-=`'"№?{}[\]<>]+$/;

export const regexConstant = {
  SOUND_TYPE: {
    NAME: baseRegex,
    COMMENT: baseRegex,
  },
  WAV_FILE: /^.*\.(wav)$/,
};
