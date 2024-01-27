import { FastifySchemaCompiler } from 'fastify';
import { FastifyRouteSchemaDef, FastifyValidationResult } from 'fastify/types/schema';
import { ObjectSchema } from 'joi';

export const validatorCompiler: FastifySchemaCompiler<any> = (schema: FastifyRouteSchemaDef<ObjectSchema>): FastifyValidationResult => {
  return (input: FastifyRouteSchemaDef<any>) => {
    return schema.schema.validate(input, { allowUnknown: false, abortEarly: false, convert: false });
  };
};

/* export function validatorCompiler(schema: FastifyRouteSchemaDef<any | ObjectSchema>): FastifyValidationResult {
  return (input: any) => {
    return schema.schema.validate(input);
  };
} */
