import { ExpressionWrapper, Kysely, SqlBool, Transaction } from 'kysely';
import { OrderByDirectionExpression, UndirectedOrderByExpression } from 'kysely/dist/cjs/parser/order-by-parser';
import { jsonBuildObject, jsonObjectFrom } from 'kysely/helpers/postgres';
import { DB } from '../../common/type/kysely/db.type';
import { InsertableSoundTypeRowType, SoundTypeRowType, UpdateableSoundTypeRowType } from '../../common/type/kysely/soundType.type';

export async function insert(trx: Transaction<DB>, values: InsertableSoundTypeRowType): Promise<SoundTypeRowType> {
  const insertedRow = await trx.insertInto('soundType').values(values).returningAll().executeTakeFirstOrThrow();

  return insertedRow;
}

export async function update(db: Kysely<DB>, id: string, values: UpdateableSoundTypeRowType): Promise<number> {
  const updateResult = await db.updateTable('soundType').set(values).where('id', '=', id).execute();

  return Number(updateResult[0].numUpdatedRows);
}

export async function destroy(trx: Transaction<DB>, id: string): Promise<number> {
  const deleteResult = await trx.deleteFrom('soundType').where('id', '=', id).execute();

  return Number(deleteResult[0].numDeletedRows);
}

export async function selectAllForExport(
  db: Kysely<DB>,
  filter: ExpressionWrapper<DB, 'soundType', SqlBool>[],
): Promise<
  {
    comment: string | null;
    filePath: string;
    id: string;
    isInbuilt: boolean;
    name: string;
    underId: string | null;
    tag: {
      name: string;
    };
  }[]
> {
  const result = await db
    .selectFrom('soundType')
    .where((eb) => eb.and(filter))
    .select((eb) => [
      'id',
      'name',
      'underId',
      'isInbuilt',
      'comment',
      'filePath',
      jsonObjectFrom(eb.selectFrom('soundTypeTag').select('name').whereRef('soundTypeTag.id', '=', 'soundType.soundTypeTagId'))
        .$notNull()
        .as('tag'),
    ])
    .execute();

  return result;
}

export async function selectOne(
  db: Kysely<DB>,
  id: string,
): Promise<
  | {
      id: string;
      filePath: string;
      isInbuilt: boolean;
    }
  | undefined
> {
  const result = await db.selectFrom('soundType').select(['id', 'isInbuilt', 'filePath']).where('id', '=', id).executeTakeFirst();

  return result;
}

export async function selectAll(
  db: Kysely<DB>,
  filter: ExpressionWrapper<DB, 'soundType', SqlBool>[],
  orderBy: UndirectedOrderByExpression<DB, 'soundType' | 'soundTypeTag', SoundTypeRowType>,
  orderDirection: OrderByDirectionExpression,
) {
  const selectOption = [
    'soundType.createdAt',
    'soundType.iconPicture',
    'soundType.id',
    'soundType.name',
    'soundType.comment',
    'soundType.filePath',
    'soundType.isInbuilt',
    'soundType.underId',
  ] as const;

  const result = await db
    .selectFrom('soundType')
    .select(selectOption)
    .where((eb) => eb.and(filter))
    .innerJoin('soundTypeTag', 'soundTypeTag.id', 'soundType.soundTypeTagId')
    .select((eb) =>
      jsonBuildObject({
        name: eb.ref('soundTypeTag.name'),
        iconPicture: eb.ref('soundTypeTag.iconPicture'),
        createdAt: eb.ref('soundTypeTag.createdAt'),
      }).as('tag'),
    )
    .orderBy(orderBy, orderDirection)
    .execute();

  return result;
}

export async function countUniversal(db: Kysely<DB>, column: keyof SoundTypeRowType, value: string, notId?: string, notIdArr?: string[]): Promise<number> {
  if (notId !== undefined) {
    const result = await db
      .selectFrom('soundType')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', '!=', notId)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  if (notIdArr !== undefined) {
    const result = await db
      .selectFrom('soundType')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', 'not in', notIdArr)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  const result = await db
    .selectFrom('soundType')
    .select(({ fn }) => [fn.count<bigint>('id').as('count')])
    .where(column, '=', value)
    .executeTakeFirstOrThrow();

  return Number(result.count);
}
