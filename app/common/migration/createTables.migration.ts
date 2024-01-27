import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql<void>`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db);

  await db.schema
    .createTable('device')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('name', 'varchar(127)', (col) => col.notNull().unique())
    .addColumn('underId', 'varchar(255)')
    .addColumn('isRegularMode', 'boolean', (col) => col.defaultTo(true))
    .addColumn('isSimulated', 'boolean', (col) => col.defaultTo(false))
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable('soundTypeTag')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('name', 'varchar(127)', (col) => col.notNull().unique())
    .addColumn('iconPicture', 'int2', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable('soundType')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('name', 'varchar(127)', (col) => col.notNull().unique())
    .addColumn('iconPicture', 'int2', (col) => col.notNull())
    .addColumn('underId', 'varchar(255)')
    .addColumn('filePath', 'varchar(4096)', (col) => col.notNull())
    .addColumn('isInbuilt', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('comment', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('soundTypeTagId', 'uuid', (col) => col.references('soundTypeTag.id').onDelete('cascade').notNull())
    .execute();

  await db.schema
    .createTable('soundSource')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('latitude', 'decimal(8, 6)', (col) => col.notNull())
    .addColumn('longitude', 'decimal(9, 6)', (col) => col.notNull())
    .addColumn('altitude', 'real', (col) => col.notNull())
    .addColumn('eventTime', 'timestamp', (col) => col.notNull())
    .addColumn('isSimulated', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('details', 'jsonb')
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('soundTypeId', 'uuid', (col) => col.references('soundType.id').onDelete('cascade').notNull())
    .execute();

  await db.schema
    .createTable('soundEvent')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('signatureFilePath', 'varchar(4096)')
    .addColumn('record', 'varchar(4096)', (col) => col.notNull())
    .addColumn('rtc', 'timestamp', (col) => col.notNull())
    .addColumn('pressure', 'real', (col) => col.notNull())
    .addColumn('temperature', 'real', (col) => col.notNull())
    .addColumn('humidity', 'real', (col) => col.notNull())
    .addColumn('windSpeed', 'real', (col) => col.notNull())
    .addColumn('windDirection', 'real', (col) => col.notNull())
    .addColumn('latitudeDevice', 'decimal(8, 6)', (col) => col.notNull())
    .addColumn('longitudeDevice', 'decimal(9, 6)', (col) => col.notNull())
    .addColumn('altitudeDevice', 'real', (col) => col.notNull())
    .addColumn('source', 'jsonb', (col) => col.notNull())
    .addColumn('isChanged', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('isSimulated', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('soundTypeId', 'uuid', (col) => col.references('soundType.id').onDelete('cascade').notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('soundEvent').cascade().execute();
  await db.schema.dropTable('soundSource').cascade().execute();
  await db.schema.dropTable('soundType').cascade().execute();
  await db.schema.dropTable('soundTypeTag').cascade().execute();
  await db.schema.dropTable('device').cascade().execute();
}
