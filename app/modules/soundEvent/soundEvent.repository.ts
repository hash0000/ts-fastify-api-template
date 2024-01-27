import { Kysely } from 'kysely';
import { DB } from '../../common/type/kysely/db.type';
import { InsertableSoundEventRowType, UpdateableSoundEventRowType } from '../../common/type/kysely/soundEvent.type';

export async function insert(db: Kysely<DB>, values: InsertableSoundEventRowType) {
  const insertedRow = await db.insertInto('soundEvent').values(values).returningAll().executeTakeFirstOrThrow();

  return insertedRow;
}

export async function update(db: Kysely<DB>, id: string, values: UpdateableSoundEventRowType): Promise<number> {
  const updateResult = await db.updateTable('soundEvent').set(values).where('id', '=', id).execute();

  return Number(updateResult[0].numUpdatedRows);
}
