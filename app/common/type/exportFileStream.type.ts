import { Readable } from 'stream';
import { MainResponseType } from './mainResponse.type';

export type getFileStreamType = { error: boolean; stream: Readable | null };

export interface IMainResponseWithStream extends MainResponseType {
  data?: {
    stream: Readable;
  };
}
