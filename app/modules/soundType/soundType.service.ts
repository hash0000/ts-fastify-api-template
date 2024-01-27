import { ExpressionWrapper, Kysely, SqlBool, expressionBuilder } from 'kysely';
import { OrderByDirectionExpression, UndirectedOrderByExpression } from 'kysely/dist/cjs/parser/order-by-parser';
import { omit } from 'lodash';
import fs from 'node:fs';
import { v4 } from 'uuid';
import { fileSizeLimit } from '../../common/config/fileSizeLimit.config';
import { filesDirPath } from '../../common/constant/filesDirPath.constant';
import { ValidationErrorType } from '../../common/enum/errorType.enum';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { startTransaction } from '../../common/handler/kyselyTransaction.handler';
import { DB } from '../../common/type/kysely/db.type';
import { SoundTypeTagRowType } from '../../common/type/kysely/soundTypeTag.type';
import { MainResponseType } from '../../common/type/mainResponse.type';
import { countUniversal as countUniversalSoundTypeTag } from '../soundTypeTag/soundTypeTag.repository';
import { IInsertSoundTypeSchema } from './schemas/insert.schema';
import { ISelectAllSoundTypeSchema } from './schemas/selectAll.schema';
import { IUpdateSoundTypeSchema } from './schemas/update.schema';
import * as repository from './soundType.repository';

export async function insert(db: Kysely<DB>, request: IInsertSoundTypeSchema): Promise<MainResponseType> {
  const countSoundTypeTag = await countUniversalSoundTypeTag(db, 'id', request.soundTypeTagId);
  if (countSoundTypeTag === 0) {
    return {
      statusCode: HttpStatusCode.NOT_FOUND,
      validationError: [{ property: 'soundTypeTagId', type: ValidationErrorType.NOT_FOUND }],
    };
  }

  const countName = await repository.countUniversal(db, 'name', request.name);
  if (countName !== 0) {
    return {
      statusCode: HttpStatusCode.CONFLICT,
      validationError: [{ property: 'name', type: ValidationErrorType.NOT_UNIQUE }],
    };
  }

  const transactionSession = await startTransaction(db);

  try {
    const fileName = `${v4()}.wav`;
    const fileBuffer = Buffer.from(request.fileBase64, 'base64url');

    if (fileBuffer.length > fileSizeLimit.SOUND_TYPE) {
      await transactionSession.rollback();

      return {
        statusCode: HttpStatusCode.PAYLOAD_TOO_LARGE,
        validationError: [{ property: 'fileBase64' }],
      };
    }

    fs.writeFileSync(filesDirPath + fileName, request.fileBase64, { encoding: 'base64url' });

    const values = { ...omit(request, ['fileBase64']), filePath: fileName };
    const data = await repository.insert(transactionSession.trx, values);

    await transactionSession.commit();

    return {
      statusCode: HttpStatusCode.CREATED,
      data,
    };
  } catch (e) {
    throw e;
  }
}

export async function update(db: Kysely<DB>, request: IUpdateSoundTypeSchema): Promise<MainResponseType> {
  if (request?.soundTypeTagId !== undefined) {
    const countSoundTypeTag = await countUniversalSoundTypeTag(db, 'id', request.soundTypeTagId);
    if (countSoundTypeTag === 0) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        validationError: [{ property: 'soundTypeTagId', type: ValidationErrorType.NOT_UNIQUE }],
      };
    }
  }

  if (request?.name !== undefined) {
    const countName = await repository.countUniversal(db, 'name', request.name, request.id);
    if (countName !== 0) {
      return {
        statusCode: HttpStatusCode.CONFLICT,
        validationError: [{ property: 'name', type: ValidationErrorType.NOT_UNIQUE }],
      };
    }
  }

  const soundType = await repository.selectOne(db, request.id);

  if (soundType === undefined) {
    return {
      statusCode: HttpStatusCode.NOT_FOUND,
    };
  } else if (soundType.isInbuilt === true) {
    return {
      statusCode: HttpStatusCode.FORBIDDEN,
      validationError: [{ property: 'isInbuilt', type: ValidationErrorType.NOT_ALLOWED }],
    };
  }

  const values = omit(request, ['id', 'fileBase64']);

  const transactionSession = await startTransaction(db);

  try {
    if (request?.fileBase64 !== undefined) {
      const fileBuffer = Buffer.from(request.fileBase64, 'base64url');

      if (fileBuffer.length > fileSizeLimit.SOUND_TYPE) {
        await transactionSession.rollback();

        return {
          statusCode: HttpStatusCode.PAYLOAD_TOO_LARGE,
          validationError: [{ property: 'fileBase64' }],
        };
      }

      fs.unlinkSync(filesDirPath + soundType.filePath);

      fs.writeFileSync(filesDirPath + soundType.filePath, request.fileBase64, { encoding: 'base64url' });
    }

    const affectedCount = await repository.update(transactionSession.trx, request.id, values);

    if (affectedCount === 0) {
      await transactionSession.rollback();

      return {
        statusCode: HttpStatusCode.NOT_FOUND,
      };
    }

    await transactionSession.commit();

    return {
      statusCode: HttpStatusCode.OK,
    };
  } catch (e) {
    throw e;
  }
}

export async function destroy(db: Kysely<DB>, id: string): Promise<MainResponseType> {
  const soundType = await repository.selectOne(db, id);

  if (soundType === undefined) {
    return {
      statusCode: HttpStatusCode.NOT_FOUND,
    };
  } else if (soundType.isInbuilt === true) {
    return {
      statusCode: HttpStatusCode.FORBIDDEN,
      validationError: [{ property: 'isInbuilt', type: ValidationErrorType.NOT_ALLOWED }],
    };
  }

  const transactionSession = await startTransaction(db);

  try {
    await repository.destroy(transactionSession.trx, id);

    fs.unlinkSync(filesDirPath + soundType.filePath);

    await transactionSession.commit();

    return {
      statusCode: HttpStatusCode.OK,
    };
  } catch (e) {
    throw e;
  }
}

export async function selectAll(db: Kysely<DB>, request: ISelectAllSoundTypeSchema): Promise<MainResponseType> {
  let sortBy: UndirectedOrderByExpression<DB, 'soundType' | 'soundTypeTag', SoundTypeTagRowType>;
  let orderDirection: OrderByDirectionExpression;

  if (request?.sortBySoundTypeTag && request?.orderBySoundTypeTag) {
    sortBy = request.sortBySoundTypeTag;
    orderDirection = request.orderBySoundTypeTag;
  } else {
    sortBy = request.sortBy;
    orderDirection = request.orderBy;
  }

  const filters: ExpressionWrapper<DB, 'soundType', SqlBool>[] = [];
  const eb = expressionBuilder<DB, 'soundType'>();

  if (request?.name !== undefined) {
    filters.push(eb('name', 'ilike', `%${request.name}%`));
  }
  if (request?.soundTypeTagId !== undefined) {
    filters.push(eb('soundTypeTagId', '=', request.soundTypeTagId));
  }

  const soundTypeArray = await repository.selectAll(db, filters, sortBy, orderDirection);

  return {
    statusCode: HttpStatusCode.OK,
    data: soundTypeArray,
  };
}
