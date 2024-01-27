import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as service from './device.service';
import { IInsertDeviceSchema, InsertDeviceSchema } from './schemas/insert.schema';

export async function DeviceRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '',
    schema: {
      body: InsertDeviceSchema,
    },
    handler: async function (this: FastifyInstance, request: FastifyRequest<{ Body: IInsertDeviceSchema }>, reply: FastifyReply): Promise<FastifyReply> {
      const serviceResponse = await service.insert(this.kysely, request.body);
      return reply.status(serviceResponse.statusCode).send(serviceResponse);
    },
  });
}
