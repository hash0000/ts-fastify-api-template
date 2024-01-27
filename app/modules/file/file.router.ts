import { FastifyInstance } from 'fastify';
import * as handler from './file.handler';
import { StreamSoundTypeFileSchema } from './schemas/streamFile.schema';

export async function FileRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/stream',
    schema: {
      querystring: StreamSoundTypeFileSchema,
    },
    handler: handler.steamFile,
  });
  fastify.route({
    method: 'GET',
    url: '/export/sound-type',
    handler: handler.exportSoundType,
  });
}
