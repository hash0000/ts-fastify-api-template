import { Insertable, Selectable, Updateable } from 'kysely';
import { SoundSource } from './db.type';

export type SoundSourceRowType = Selectable<SoundSource>;
export type InsertableSoundSourceRowType = Insertable<SoundSource>;
export type UpdateableSoundSourceRowType = Updateable<SoundSource>;
