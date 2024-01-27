import { Insertable, Selectable, Updateable } from 'kysely';
import { SoundType } from './db.type';

export type SoundTypeRowType = Selectable<SoundType>;
export type InsertableSoundTypeRowType = Insertable<SoundType>;
export type UpdateableSoundTypeRowType = Updateable<SoundType>;
