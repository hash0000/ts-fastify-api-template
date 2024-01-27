import { Kysely } from 'kysely';
import { DB } from '../../common/type/kysely/db.type';
import { DeviceRowType, InsertableDeviceRowType } from '../../common/type/kysely/device.type';

export async function insert(db: Kysely<DB>, values: InsertableDeviceRowType): Promise<DeviceRowType> {
  const insertedRow = await db.insertInto('device').values(values).returningAll().executeTakeFirstOrThrow();

  return insertedRow;
}

export async function countUniversal(db: Kysely<DB>, column: keyof DeviceRowType, value: string, notId?: string, notIdArr?: string[]): Promise<number> {
  if (notId !== undefined) {
    const result = await db
      .selectFrom('device')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', '!=', notId)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  if (notIdArr !== undefined) {
    const result = await db
      .selectFrom('device')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', 'not in', notIdArr)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  const result = await db
    .selectFrom('device')
    .select(({ fn }) => [fn.count<bigint>('id').as('count')])
    .where(column, '=', value)
    .executeTakeFirstOrThrow();

  return Number(result.count);
}
