import { Kysely } from 'kysely';
import { ValidationErrorType } from '../../common/enum/errorType.enum';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { DB } from '../../common/type/kysely/db.type';
import { MainResponseType } from '../../common/type/mainResponse.type';
import { countUniversal as countUniversalDevice } from '../device/device.repository';
import { countUniversal as countUniversalSoundSource } from '../soundSource/soundSource.repository';
import { IInsertSoundEventSchema } from './schemas/create.schema';
import { IUpdateSoundEventSchema } from './schemas/update.schema';
import * as repository from './soundEvent.repository';

export async function create(db: Kysely<DB>, request: IInsertSoundEventSchema): Promise<MainResponseType> {
  const countDevice = await countUniversalDevice(db, 'id', request.deviceId);
  if (countDevice === 0) {
    return {
      statusCode: HttpStatusCode.NOT_FOUND,
      validationError: [{ property: 'deviceId', type: ValidationErrorType.NOT_FOUND }],
    };
  }

  if (request?.soundSourceId !== undefined) {
    const countSoundSource = await countUniversalSoundSource(db, 'soundTypeId', request.soundSourceId);
    if (countSoundSource === 0) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        validationError: [{ property: 'soundSourceId', type: ValidationErrorType.NOT_FOUND }],
      };
    }
  }

  const values = { ...request, source: JSON.stringify(request.source) };

  const data = await repository.insert(db, values);

  return {
    statusCode: HttpStatusCode.CREATED,
    data,
  };
}

export async function update(db: Kysely<DB>, id: string, request: IUpdateSoundEventSchema): Promise<MainResponseType> {
  const values = { ...request, isChanged: true };

  const affectedCount = await repository.update(db, id, values);

  if (affectedCount === 0) {
    return {
      statusCode: HttpStatusCode.NOT_FOUND,
      validationError: [{ property: 'id', type: ValidationErrorType.NOT_FOUND }],
    };
  }

  return {
    statusCode: HttpStatusCode.OK,
  };
}
