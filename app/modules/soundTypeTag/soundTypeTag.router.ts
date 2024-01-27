import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IInsertSoundTypeTagSchema, InsertSoundTypeTagSchema } from './schemas/insert.schema';
import { ISelectAllSoundTypeTagSchema, SelectAllSoundTypeTagSchema } from './schemas/selectAll.schema';
import * as service from './soundTypeTag.service';

export async function SoundTypeTagRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '',
    schema: {
      body: InsertSoundTypeTagSchema,
    },
    handler: async function (this: FastifyInstance, request: FastifyRequest<{ Body: IInsertSoundTypeTagSchema }>, reply: FastifyReply): Promise<FastifyReply> {
      const serviceResponse = await service.insert(this.kysely, request.body);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      querystring: SelectAllSoundTypeTagSchema,
    },
    handler: async function (
      this: FastifyInstance,
      request: FastifyRequest<{ Querystring: ISelectAllSoundTypeTagSchema }>,
      reply: FastifyReply,
    ): Promise<FastifyReply> {
      const serviceResponse = await service.selectAll(this.kysely, request.query);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
}
