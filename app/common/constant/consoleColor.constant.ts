const oneLine: string = '%s\x1b[0m';

export const consoleColor = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERSCORE: '\x1b[4m',
  BLINK: '\x1b[5m',
  REVERSE: '\x1b[7m',
  HIDDEN: '\x1b[8m',
  FG: {
    BLACK: '\x1b[30m' + oneLine,
    RED: '\x1b[31m' + oneLine,
    GREEN: '\x1b[32m' + oneLine,
    YELLOW: '\x1b[33m' + oneLine,
    BLUE: '\x1b[34m' + oneLine,
    MAGENTA: '\x1b[35m' + oneLine,
    CYAN: '\x1b[36m' + oneLine,
    WHITE: '\x1b[37m' + oneLine,
    GRAY: '\x1b[90m' + oneLine,
  },
  BG: {
    BLACK: '\x1b[40m' + oneLine,
    RED: '\x1b[41m' + oneLine,
    GREEN: '\x1b[42m' + oneLine,
    YELLOW: '\x1b[43m' + oneLine,
    BLUE: '\x1b[44m' + oneLine,
    MAGENTA: '\x1b[45m' + oneLine,
    CYAN: '\x1b[46m' + oneLine,
    WHITE: '\x1b[47m' + oneLine,
    GRAY: '\x1b[100m' + oneLine,
  },
};
