import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from 'joi';
import { consoleColor } from '../constant/consoleColor.constant';
import { HttpStatusCode } from '../enum/httpStatusCode.enum';
import { MainResponseType } from '../type/mainResponse.type';

export function errorHandler(error: FastifyError, _request: FastifyRequest, reply: FastifyReply): FastifyReply {
  if (error.statusCode === 500 || error.statusCode === undefined) {
    console.info(consoleColor.FG.RED, `[APP] Unexpected error at ${new Date()}. See details:`);
    console.error(error);

    return reply.status(500).send({ statusCode: 500 });
  }

  let response: MainResponseType;

  if (error.code === 'FST_ERR_VALIDATION' && error instanceof ValidationError) {
    const validationErrorArray: object[] = [];

    for (const el of error.details) {
      validationErrorArray.push({ property: el.context?.key, type: el.type, message: el.context?.message });
    }

    response = {
      statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
      validationError: validationErrorArray,
    };
  } else {
    response = {
      statusCode: error.statusCode,
      validationError: [{ message: error.message }],
    };
  }

  return reply.status(response.statusCode).send(response);
}
