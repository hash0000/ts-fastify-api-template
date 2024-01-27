import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IUuidSchema, UuidSchema } from '../../common/validation/uuidSchema.validator';
import { IInsertSoundEventSchema, InsertSoundEventSchema } from './schemas/create.schema';
import { IUpdateSoundEventSchema, UpdateSoundEventSchema } from './schemas/update.schema';
import * as service from './soundEvent.service';

export async function SoundEventRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '',
    schema: {
      body: InsertSoundEventSchema,
    },
    handler: async function (
      this: FastifyInstance,
      request: FastifyRequest<{ Body: IInsertSoundEventSchema; Params: IUuidSchema }>,
      reply: FastifyReply,
    ): Promise<FastifyReply> {
      const serviceResponse = await service.create(this.kysely, request.body);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      body: UpdateSoundEventSchema,
      params: UuidSchema,
    },
    handler: async function (
      this: FastifyInstance,
      request: FastifyRequest<{ Body: IUpdateSoundEventSchema; Params: IUuidSchema }>,
      reply: FastifyReply,
    ): Promise<FastifyReply> {
      const serviceResponse = await service.update(this.kysely, request.params.id, request.body);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
}
