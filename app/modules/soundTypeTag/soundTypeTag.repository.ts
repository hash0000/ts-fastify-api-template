import { Kysely } from 'kysely';
import { OrderByDirectionExpression, UndirectedOrderByExpression } from 'kysely/dist/cjs/parser/order-by-parser';
import { DB } from '../../common/type/kysely/db.type';
import { InsertableSoundTypeTagRowType, SoundTypeTagRowType } from '../../common/type/kysely/soundTypeTag.type';

export async function insert(db: Kysely<DB>, values: InsertableSoundTypeTagRowType): Promise<SoundTypeTagRowType> {
  const insertedRow = await db.insertInto('soundTypeTag').values(values).returningAll().executeTakeFirstOrThrow();

  return insertedRow;
}

export async function selectAll(
  db: Kysely<DB>,
  orderBy: UndirectedOrderByExpression<DB, 'soundTypeTag', SoundTypeTagRowType>,
  orderDirection: OrderByDirectionExpression,
): Promise<SoundTypeTagRowType[]> {
  const result = await db.selectFrom('soundTypeTag').selectAll().orderBy(orderBy, orderDirection).execute();

  return result;
}

export async function countUniversal(db: Kysely<DB>, column: keyof SoundTypeTagRowType, value: string, notId?: string, notIdArr?: string[]): Promise<number> {
  if (notId !== undefined) {
    const result = await db
      .selectFrom('soundTypeTag')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', '!=', notId)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  if (notIdArr !== undefined) {
    const result = await db
      .selectFrom('soundTypeTag')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', 'not in', notIdArr)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  const result = await db
    .selectFrom('soundTypeTag')
    .select(({ fn }) => [fn.count<bigint>('id').as('count')])
    .where(column, '=', value)
    .executeTakeFirstOrThrow();

  return Number(result.count);
}
