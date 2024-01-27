import { ExpressionWrapper, Kysely, sql, SqlBool } from 'kysely';
import { OrderByDirectionExpression, UndirectedOrderByExpression } from 'kysely/dist/cjs/parser/order-by-parser';
import { jsonArrayFrom, jsonBuildObject, jsonObjectFrom } from 'kysely/helpers/postgres';
import { DB, JsonValue } from '../../common/type/kysely/db.type';
import { SoundSourceRowType } from '../../common/type/kysely/soundSource.type';
import { IInsertSoundSourceSchema } from './schemas/create.schema';
import { IUpdateSoundSourceSchema } from './schemas/update.schema';

export async function insert(db: Kysely<DB>, values: IInsertSoundSourceSchema): Promise<SoundSourceRowType> {
  const insertedRow = await db.insertInto('soundSource').values(values).returningAll().executeTakeFirstOrThrow();

  return insertedRow;
}

export async function update(db: Kysely<DB>, id: string, values: IUpdateSoundSourceSchema): Promise<number> {
  const updateResult = await db.updateTable('soundSource').set(values).where('id', '=', id).execute();

  return Number(updateResult[0].numUpdatedRows);
}

export async function destroy(db: Kysely<DB>, id: string): Promise<number> {
  const deleteResult = await db.deleteFrom('soundSource').where('id', '=', id).execute();

  return Number(deleteResult[0].numDeletedRows);
}

export async function selectAll(
  db: Kysely<DB>,
  filter: ExpressionWrapper<DB, 'soundSource', SqlBool>[],
  orderBy: UndirectedOrderByExpression<DB, 'soundSource' | 'soundType', SoundSourceRowType>,
  orderDirection: OrderByDirectionExpression,
): Promise<
  {
    id: string;
    eventTime: Date;
    latitude: string;
    longitude: string;
    altitude: number;
    isSimulated: boolean;
    details: JsonValue;
    createdAt: Date;
    soundType: { id: string; name: string; filePath: string; tag: { name: string; iconPicture: number } };
    soundEvent: {
      id: string;
      record: JsonValue;
      rtc: Date;
      difference: number;
    } | null;
  }[]
> {
  const selectOptions = [
    'soundSource.id',
    'soundSource.eventTime',
    'soundSource.latitude',
    'soundSource.longitude',
    'soundSource.altitude',
    'soundSource.isSimulated',
    'soundSource.details',
    'soundSource.createdAt',
  ] as const;
  const selectOptionsSoundEvent = [
    'soundEvent.id',
    'soundEvent.record',
    'soundEvent.rtc',
    sql<number>`EXTRACT(EPOCH FROM("soundEvent"."rtc" - "soundSource"."eventTime"))`.as('difference'),
  ] as const;

  const result = await db
    .selectFrom('soundSource')
    .where((eb) => eb.and(filter))
    .select(selectOptions)
    .innerJoin('soundType', 'soundType.id', 'soundSource.soundTypeId')
    .innerJoin('soundTypeTag', 'soundTypeTag.id', 'soundType.soundTypeTagId')
    .select((eb) =>
      jsonBuildObject({
        id: eb.ref('soundType.id'),
        name: eb.ref('soundType.name'),
        filePath: eb.ref('soundType.filePath'),
        tag: jsonBuildObject({
          name: eb.ref('soundTypeTag.name'),
          iconPicture: eb.ref('soundTypeTag.iconPicture'),
        }),
      }).as('soundType'),
    )
    .select((eb) =>
      jsonObjectFrom(
        eb
          .selectFrom('soundEvent')
          .select(selectOptionsSoundEvent)
          .whereRef('soundEvent.soundSourceId', '=', 'soundSource.id')
          .orderBy('difference', 'desc')
          .limit(1),
      ).as('soundEvent'),
    )
    .orderBy(orderBy, orderDirection)
    .execute();

  return result;
}

export async function selectOne(db: Kysely<DB>, id: string) {
  const selectOption = [
    'soundSource.eventTime',
    'soundSource.latitude',
    'soundSource.longitude',
    'soundSource.altitude',
    'soundSource.details',
    'soundSource.isSimulated',
  ] as const;
  const selectOptionSoundEvent = [
    'soundEvent.id',
    'soundEvent.record',
    'soundEvent.rtc',
    'soundEvent.latitudeDevice',
    'soundEvent.longitudeDevice',
    'soundEvent.pressure',
    'soundEvent.temperature',
    'soundEvent.humidity',
    'soundEvent.windSpeed',
    'soundEvent.windDirection',
    'soundEvent.altitudeDevice',
    sql<number>`EXTRACT(EPOCH FROM("soundEvent"."rtc" - "soundSource"."eventTime"))`.as('difference'),
  ] as const;
  const selectOptionDevice = ['device.id', 'device.name'] as const;

  const result = await db
    .selectFrom('soundSource')
    .select(selectOption)
    .where('soundSource.id', '=', id)
    .innerJoin('soundType', 'soundType.id', 'soundSource.soundTypeId')
    .select((eb) =>
      jsonBuildObject({
        id: eb.ref('soundType.id'),
        name: eb.ref('soundType.name'),
        iconPicture: eb.ref('soundType.iconPicture'),
      }).as('soundType'),
    )
    .select((eb) =>
      jsonObjectFrom(
        eb
          .selectFrom('soundEvent')
          .select(selectOptionSoundEvent)
          .whereRef('soundEvent.soundSourceId', '=', 'soundSource.id')
          .orderBy('difference', 'desc')
          .limit(1)
          .select((eb) =>
            jsonObjectFrom(eb.selectFrom('device').select(selectOptionDevice).whereRef('device.id', '=', 'soundEvent.deviceId'))
              .$notNull()
              .as('device'),
          ),
      ).as('soundEvent'),
    )
    .executeTakeFirst();

  return result;
}

export async function selectAllWithDevice(
  db: Kysely<DB>,
  filter: ExpressionWrapper<DB, 'soundSource', SqlBool>[],
  orderBy: UndirectedOrderByExpression<DB, 'soundSource', SoundSourceRowType>,
  orderDirection: OrderByDirectionExpression,
) {
  const selectOption = [
    'soundSource.id',
    'soundSource.latitude',
    'soundSource.longitude',
    'soundSource.altitude',
    'soundSource.eventTime',
    'soundSource.isSimulated',
    'soundSource.details',
    'soundSource.createdAt',
  ] as const;
  const selectOptionDevice = ['device.id', 'device.name', 'device.underId', 'device.isRegularMode', 'device.isSimulated', 'device.createdAt'] as const;
  const selectOptionSoundEvent = [
    'soundEvent.id',
    'soundEvent.signatureFilePath',
    'soundEvent.record',
    'soundEvent.rtc',
    'soundEvent.pressure',
    'soundEvent.temperature',
    'soundEvent.humidity',
    'soundEvent.windSpeed',
    'soundEvent.windDirection',
    'soundEvent.latitudeDevice',
    'soundEvent.longitudeDevice',
    'soundEvent.altitudeDevice',
    'soundEvent.source',
    'soundEvent.isChanged',
    'soundEvent.isSimulated',
    'soundEvent.createdAt',
  ] as const;

  const result = await db
    .selectFrom('soundSource')
    .select(selectOption)
    .where((eb) => eb.and(filter))
    .innerJoin('soundType', 'soundType.id', 'soundSource.soundTypeId')
    .innerJoin('soundTypeTag', 'soundTypeTag.id', 'soundType.soundTypeTagId')
    .select((eb) =>
      jsonBuildObject({
        id: eb.ref('soundType.id'),
        name: eb.ref('soundType.name'),
        iconPicture: eb.ref('soundType.iconPicture'),
        underId: eb.ref('soundType.underId'),
        filePath: eb.ref('soundType.filePath'),
        isInbuilt: eb.ref('soundType.isInbuilt'),
        tag: jsonBuildObject({
          name: eb.ref('soundTypeTag.name'),
          iconPicture: eb.ref('soundTypeTag.iconPicture'),
        }),
      }).as('soundType'),
    )
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom('soundEvent')
          .select(selectOptionSoundEvent)
          .whereRef('soundEvent.soundSourceId', '=', 'soundSource.id')
          .select((eb) =>
            jsonObjectFrom(eb.selectFrom('device').select(selectOptionDevice).whereRef('device.id', '=', 'soundEvent.deviceId'))
              .$notNull()
              .as('device'),
          ),
      ).as('soundEvents'),
    )
    .orderBy(orderBy, orderDirection)
    .execute();

  return result;
}

export async function countUniversal(db: Kysely<DB>, column: keyof SoundSourceRowType, value: string, notId?: string, notIdArr?: string[]): Promise<number> {
  if (notId !== undefined) {
    const result = await db
      .selectFrom('soundSource')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', '!=', notId)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  if (notIdArr !== undefined) {
    const result = await db
      .selectFrom('soundSource')
      .select(({ fn }) => [fn.count<bigint>('id').as('count')])
      .where((eb) => eb.and([eb(column, '=', value), eb('id', 'not in', notIdArr)]))
      .executeTakeFirstOrThrow();

    return Number(result.count);
  }

  const result = await db
    .selectFrom('soundSource')
    .select(({ fn }) => [fn.count<bigint>('id').as('count')])
    .where(column, '=', value)
    .executeTakeFirstOrThrow();

  return Number(result.count);
}
