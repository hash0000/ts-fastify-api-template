import fs from 'node:fs';
import internal from 'node:stream';
import { Readable } from 'stream';
import { getFileStreamType } from '../type/exportFileStream.type';

export function getFileStream(path: string): getFileStreamType {
  if (fs.existsSync(path) === false) {
    return { error: true, stream: null };
  }

  const buffer = fs.readFileSync(path);
  const stream = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });

  return { error: false, stream };
}

export async function getFileStreamFromBuffer(buffer: Buffer): Promise<internal.Readable> {
  const stream = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });

  return stream;
}
