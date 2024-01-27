import { join } from 'node:path';

export const filesDirPath = join(process.cwd() + `${process.env.APP_SHARED_DIRECTORY}/`);
