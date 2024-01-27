import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import EventEmitter from 'node:events';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { IUuidSchema, UuidSchema } from '../../common/validation/uuidSchema.validator';
import { IInsertSoundSourceSchema, InsertSoundSourceSchema } from './schemas/create.schema';
import { ISelectAllSoundSourceSchema, SelectAllSoundSourceSchema } from './schemas/getAll.schema';
import { ISelectAllSoundSourceWithDeviceSchema, SelectAllSoundSourceWithDeviceSchema } from './schemas/selectAllWithDevice.schema';
import { IUpdateSoundSourceSchema, UpdateSoundSourceSchema } from './schemas/update.schema';
import * as service from './soundSource.service';

export async function SoundSourceRouter(fastify: FastifyInstance): Promise<void> {
  const emitter = new EventEmitter();

  fastify.route({
    method: 'POST',
    url: '',
    schema: {
      body: InsertSoundSourceSchema,
    },
    handler: async function (this: FastifyInstance, request: FastifyRequest<{ Body: IInsertSoundSourceSchema }>, reply: FastifyReply): Promise<FastifyReply> {
      const serviceResponse = await service.create(this.kysely, request.body);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      body: UpdateSoundSourceSchema,
      params: UuidSchema,
    },
    handler: async function (
      this: FastifyInstance,
      request: FastifyRequest<{ Body: IUpdateSoundSourceSchema; Params: IUuidSchema }>,
      reply: FastifyReply,
    ): Promise<FastifyReply> {
      const serviceResponse = await service.update(this.kysely, request.params.id, request.body);
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
      querystring: SelectAllSoundSourceSchema,
    },
    handler: async function (
      this: FastifyInstance,
      request: FastifyRequest<{ Querystring: ISelectAllSoundSourceSchema }>,
      reply: FastifyReply,
    ): Promise<FastifyReply> {
      const serviceResponse = await service.selectAll(this.kysely, request.query);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: UuidSchema,
    },
    handler: async function (this: FastifyInstance, request: FastifyRequest<{ Params: IUuidSchema }>, reply: FastifyReply): Promise<FastifyReply> {
      const serviceResponse = await service.selectOne(this.kysely, request.params.id);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
  fastify.route({
    method: 'GET',
    url: '/with-device',
    schema: {
      querystring: SelectAllSoundSourceWithDeviceSchema,
    },
    handler: async function (
      this: FastifyInstance,
      request: FastifyRequest<{ Querystring: ISelectAllSoundSourceWithDeviceSchema }>,
      reply: FastifyReply,
    ): Promise<FastifyReply> {
      const serviceResponse = await service.selectAllWithDevice(this.kysely, request.query);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });

  /* Listener */
  fastify.route({
    method: 'GET',
    url: '/listener/listen',
    handler: function (_request: FastifyRequest, reply: FastifyReply): void {
      emitter.once('soundSourceEvent', (): void => {
        reply.status(HttpStatusCode.RESET_CONTENT).send();
      });
    },
  });
  fastify.route({
    method: 'PUT',
    url: '/listener/trigger',
    handler: async function (_request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
      emitter.emit('soundSourceEvent');
      return reply.status(HttpStatusCode.CREATED).send();
    },
  });
}
