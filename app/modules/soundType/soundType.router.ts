import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { fileSizeLimit } from '../../common/config/fileSizeLimit.config';
import { IUuidSchema, UuidSchema } from '../../common/validation/uuidSchema.validator';
import { IInsertSoundTypeSchema, InsertSoundTypeSchema } from './schemas/insert.schema';
import { ISelectAllSoundTypeSchema, SelectAllSoundTypeSchema } from './schemas/selectAll.schema';
import { IUpdateSoundTypeSchema, UpdateSoundTypeSchema } from './schemas/update.schema';
import * as service from './soundType.service';

export async function SoundTypeRouter(fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: '',
    bodyLimit: fileSizeLimit.BODY + fileSizeLimit.SOUND_TYPE,
    schema: {
      body: InsertSoundTypeSchema,
    },
    handler: async function (this: FastifyInstance, request: FastifyRequest<{ Body: IInsertSoundTypeSchema }>, reply: FastifyReply): Promise<FastifyReply> {
      const serviceResponse = await service.insert(this.kysely, request.body);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'PATCH',
    url: '',
    bodyLimit: fileSizeLimit.BODY + fileSizeLimit.SOUND_TYPE,
    schema: {
      body: UpdateSoundTypeSchema,
    },
    handler: async function (this: FastifyInstance, request: FastifyRequest<{ Body: IUpdateSoundTypeSchema }>, reply: FastifyReply): Promise<FastifyReply> {
      const serviceResponse = await service.update(this.kysely, request.body);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: UuidSchema,
    },
    handler: async function (this: FastifyInstance, request: FastifyRequest<{ Params: IUuidSchema }>, reply: FastifyReply): Promise<FastifyReply> {
      const serviceResponse = await service.destroy(this.kysely, request.params.id);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      querystring: SelectAllSoundTypeSchema,
    },
    handler: async function (
      this: FastifyInstance,
      request: FastifyRequest<{ Querystring: ISelectAllSoundTypeSchema }>,
      reply: FastifyReply,
    ): Promise<FastifyReply> {
      const serviceResponse = await service.selectAll(this.kysely, request.query);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
}
