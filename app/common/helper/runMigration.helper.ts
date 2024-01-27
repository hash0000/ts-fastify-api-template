import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { Pool } from 'pg';
import { DB } from '../type/kysely/db.type';

async function migrateToLatest() {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DB_NAME,
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../migration'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
