import { SwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { join } from 'node:path';
import { OpenAPIV3 } from 'openapi-types';
import SwaggerJSDoc from 'swagger-jsdoc';

const swaggerDocument = SwaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Aerostat',
      version: '0.0.1',
    },
  },
  apis: [join(process.cwd() + `/documentation/**/*.yaml`)],
});

export const swaggerOptions: SwaggerOptions = {
  mode: 'static',
  specification: {
    document: swaggerDocument as OpenAPIV3.Document,
  },
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'none',
  },
};
