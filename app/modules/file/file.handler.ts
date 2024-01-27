import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { filesDirPath } from '../../common/constant/filesDirPath.constant';
import { mimeType } from '../../common/constant/mimeType.constant';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { getFileStream } from '../../common/helper/getFileStream.helper';
import { getFileStreamType } from '../../common/type/exportFileStream.type';
import * as service from './file.service';
import { IExportSoundTypeFilesSchema } from './schemas/exportSoundTypeFiles.schema';
import { IStreamSoundTypeFileSchema } from './schemas/streamFile.schema';

export function steamFile(request: FastifyRequest, reply: FastifyReply): FastifyReply | void {
  const query: IStreamSoundTypeFileSchema = request.query as IStreamSoundTypeFileSchema;
  const streamOrError: getFileStreamType = getFileStream(filesDirPath + query.fileName);
  if (streamOrError.error === true) {
    return reply.status(HttpStatusCode.NOT_FOUND).send();
  }

  reply.headers({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
  });
  reply.type(mimeType.WAV).send(streamOrError.stream);
}

export async function exportSoundType(
  this: FastifyInstance,
  request: FastifyRequest<{ Querystring: IExportSoundTypeFilesSchema }>,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  const serviceResponse = await service.exportSoundType(this.kysely, request.query);

  if (serviceResponse.statusCode !== HttpStatusCode.OK) {
    return reply.status(serviceResponse.statusCode).send(serviceResponse);
  }

  let fileName = 'soundType.zip';
  if (request.query?.periodFrom && request.query?.periodTo) {
    fileName = `soundType from ${request.query.periodFrom} to ${request.query.periodTo}.zip`;
  }

  reply.headers({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Disposition': `inline; filename="${fileName}"`,
    Pragma: 'no-cache',
    Expires: 0,
  });

  return reply.type(mimeType.ZIP).send(serviceResponse.data?.stream);
}
