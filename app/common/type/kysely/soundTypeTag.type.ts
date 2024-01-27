import { Insertable, Selectable, Updateable } from 'kysely';
import { SoundTypeTag } from './db.type';

export type SoundTypeTagRowType = Selectable<SoundTypeTag>;
export type InsertableSoundTypeTagRowType = Insertable<SoundTypeTag>;
export type UpdateableSoundTypeTagRowType = Updateable<SoundTypeTag>;
