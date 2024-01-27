import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { Pool, types } from 'pg';
import { consoleColor } from '../constant/consoleColor.constant';
import { DB } from '../type/kysely/db.type';

export let kysely: Kysely<DB>;

declare module 'fastify' {
  interface FastifyInstance {
    kysely: Kysely<DB>;
  }
}

export const KyselyPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance): Promise<void> => {
  try {
    types.setTypeParser(types.builtins.NUMERIC, function (val) {
      if (val !== undefined && val !== null) {
        return Number(val);
      }
      return val;
    });

    const pgDialect = new PostgresDialect({
      pool: new Pool({
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DB_NAME,
      }),
    });

    const db = new Kysely<DB>({
      dialect: pgDialect,
      plugins: [new ParseJSONResultsPlugin()],
    });
    console.info(consoleColor.FG.GREEN, '[APP] Postgres: connection established');

    fastify.decorate('kysely', db);

    kysely = db;

    fastify.addHook('onClose', async () => {
      await db.destroy();
    });
  } catch (e) {
    console.info(consoleColor.FG.RED, '[APP] Postgres: failed to establish database connection. See details:');
    console.error(e);
    process.exit(1);
  }
});
