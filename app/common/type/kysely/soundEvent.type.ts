import { Insertable, Selectable, Updateable } from 'kysely';
import { SoundEvent } from './db.type';

export type SoundEventRowType = Selectable<SoundEvent>;
export type InsertableSoundEventRowType = Insertable<SoundEvent>;
export type UpdateableSoundEventRowType = Updateable<SoundEvent>;
