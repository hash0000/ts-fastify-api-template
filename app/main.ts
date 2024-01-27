import { fastifyCors } from '@fastify/cors';
import { FastifyInstance, fastify } from 'fastify';
import { consoleColor } from './common/constant/consoleColor.constant';
import { errorHandler } from './common/handler/validationError.handler';
import { validatorCompiler } from './common/handler/validatorCompiler.handler';
import { KyselyPlugin } from './common/plugin/kysely.plugin';
import { DeviceRouter } from './modules/device/device.router';
import { FileRouter } from './modules/file/file.router';
import { SoundEventRouter } from './modules/soundEvent/soundEvent.router';
import { SoundSourceRouter } from './modules/soundSource/soundSource.router';
import { SoundTypeRouter } from './modules/soundType/soundType.router';
import { SoundTypeTagRouter } from './modules/soundTypeTag/soundTypeTag.router';

async function app(): Promise<void> {
  const app: FastifyInstance = fastify();
  const port: number = Number(process.env.APP_PORT);
  const host: string = String(process.env.APP_HOST);

  app.setValidatorCompiler(validatorCompiler);
  app.setErrorHandler(errorHandler);

  await app.register(fastifyCors);
  await app.register(KyselyPlugin);

  app.register(FileRouter, { prefix: '/file' });
  app.register(DeviceRouter, { prefix: '/device' });
  app.register(SoundTypeTagRouter, { prefix: '/sound-type-tag' });
  app.register(SoundTypeRouter, { prefix: '/sound-type' });
  app.register(SoundEventRouter, { prefix: '/sound-event' });
  app.register(SoundSourceRouter, { prefix: '/sound-source' });

  app.listen({ port, host }, (e, address) => {
    if (e) {
      console.info(consoleColor.FG.RED, '[APP] App crushed while starting. See details:');
      console.error(e);
      process.exit(1);
    }
    console.info(consoleColor.FG.BLUE, `[APP] Server listening on ${address}`);
  });
}

void app();
