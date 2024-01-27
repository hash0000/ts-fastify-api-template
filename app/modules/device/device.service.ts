import { Kysely } from 'kysely';
import { ValidationErrorType } from '../../common/enum/errorType.enum';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { DB } from '../../common/type/kysely/db.type';
import { MainResponseType } from '../../common/type/mainResponse.type';
import * as repository from './device.repository';
import { IInsertDeviceSchema } from './schemas/insert.schema';

export async function insert(db: Kysely<DB>, schema: IInsertDeviceSchema): Promise<MainResponseType> {
  const countName = await repository.countUniversal(db, 'name', schema.name);
  if (countName !== 0) {
    return {
      statusCode: HttpStatusCode.CONFLICT,
      validationError: [{ property: 'name', type: ValidationErrorType.NOT_UNIQUE }],
    };
  }

  if (schema.underId !== undefined) {
    const countUnderId = await repository.countUniversal(db, 'underId', schema.underId);

    if (countUnderId !== 0) {
      return {
        statusCode: HttpStatusCode.CONFLICT,
        validationError: [{ property: 'underId', type: ValidationErrorType.NOT_UNIQUE }],
      };
    }
  }

  const data = await repository.insert(db, schema);

  return {
    statusCode: HttpStatusCode.CREATED,
    data,
  };
}
