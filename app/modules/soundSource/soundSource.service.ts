import { ExpressionWrapper, Kysely, SqlBool, expressionBuilder } from 'kysely';
import { OrderByDirectionExpression, UndirectedOrderByExpression } from 'kysely/dist/cjs/parser/order-by-parser';
import { meanBy } from 'lodash';
import { ValidationErrorType } from '../../common/enum/errorType.enum';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { SoundSourceRecognitionEnum } from '../../common/enum/soundSourceRecognition.enum';
import { pushDateTimeClause } from '../../common/helper/getDateBetween.helper';
import { DB } from '../../common/type/kysely/db.type';
import { SoundSourceRowType } from '../../common/type/kysely/soundSource.type';
import { MainResponseType } from '../../common/type/mainResponse.type';
import { countUniversal as countUniversalSoundType } from '../soundType/soundType.repository';
import { IInsertSoundSourceSchema } from './schemas/create.schema';
import { ISelectAllSoundSourceSchema } from './schemas/getAll.schema';
import { ISelectAllSoundSourceWithDeviceSchema } from './schemas/selectAllWithDevice.schema';
import { IUpdateSoundSourceSchema } from './schemas/update.schema';
import * as repository from './soundSource.repository';

export async function create(db: Kysely<DB>, schema: IInsertSoundSourceSchema): Promise<MainResponseType> {
  if (schema?.soundTypeId !== undefined) {
    const countSoundType = await countUniversalSoundType(db, 'id', schema.soundTypeId);

    if (countSoundType === 0) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        validationError: [{ property: 'soundTypeId', type: ValidationErrorType.NOT_FOUND }],
      };
    }
  }

  const data = await repository.insert(db, schema);

  return {
    statusCode: HttpStatusCode.CREATED,
    data,
  };
}

export async function update(db: Kysely<DB>, id: string, schema: IUpdateSoundSourceSchema): Promise<MainResponseType> {
  if (schema.soundTypeId !== null) {
    const countSoundType = await countUniversalSoundType(db, 'id', schema.soundTypeId);

    if (countSoundType === 0) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        validationError: [{ property: 'soundTypeId', type: ValidationErrorType.NOT_FOUND }],
      };
    }
  }

  const affectedCount = await repository.update(db, id, schema);

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

export async function destroy(db: Kysely<DB>, id: string): Promise<MainResponseType> {
  const affectedCount = await repository.destroy(db, id);

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

export async function selectAll(db: Kysely<DB>, request: ISelectAllSoundSourceSchema): Promise<MainResponseType> {
  let sortBy: UndirectedOrderByExpression<DB, 'soundSource' | 'soundType', SoundSourceRowType>;
  let orderDirection: OrderByDirectionExpression;

  if (request?.sortBySoundType !== undefined && request?.orderBySoundType !== undefined) {
    sortBy = `soundType.${request.sortBySoundType}`;
    orderDirection = request.orderBySoundType;
  } else {
    sortBy = `soundSource.${request.sortBy}`;
    orderDirection = request.orderBy;
  }

  const filters: ExpressionWrapper<DB, 'soundSource', SqlBool>[] = [];
  const eb = expressionBuilder<DB, 'soundSource'>();

  if (request?.soundTypeIds !== undefined) {
    filters.push(eb('soundSource.soundTypeId', 'in', request.soundTypeIds));
  } else if (request?.soundTypeRecognition !== undefined) {
    if (request.soundTypeRecognition === SoundSourceRecognitionEnum.RECOGNIZED) {
      filters.push(eb('soundSource.soundTypeId', 'is not', null));
    } else {
      filters.push(eb('soundSource.soundTypeId', 'is', null));
    }
  }
  if (request?.isSimulated !== undefined) {
    filters.push(eb('soundSource.isSimulated', '=', request.isSimulated));
  }
  await pushDateTimeClause(filters, 'soundSource', 'soundSource.eventTime', request?.eventTimeFrom, request?.eventTimeTo);

  const data = await repository.selectAll(db, filters, sortBy, orderDirection);

  return {
    statusCode: HttpStatusCode.OK,
    data,
  };
}

export async function selectOne(db: Kysely<DB>, id: string): Promise<MainResponseType> {
  const data = await repository.selectOne(db, id);

  if (data === undefined) {
    return {
      statusCode: HttpStatusCode.NOT_FOUND,
    };
  }

  return {
    statusCode: HttpStatusCode.OK,
    data,
  };
}

export async function selectAllWithDevice(db: Kysely<DB>, request: ISelectAllSoundSourceWithDeviceSchema): Promise<MainResponseType> {
  const sortBy: UndirectedOrderByExpression<DB, 'soundSource', SoundSourceRowType> = `soundSource.${request.sortBy}`;
  const orderDirection: OrderByDirectionExpression = request.orderBy;

  const filters: ExpressionWrapper<DB, 'soundSource', SqlBool>[] = [];
  const eb = expressionBuilder<DB, 'soundSource'>();

  if (request?.soundTypeIds !== undefined) {
    filters.push(eb('soundSource.soundTypeId', 'in', request.soundTypeIds));
  } else if (request?.soundTypeRecognition !== undefined) {
    if (request.soundTypeRecognition === SoundSourceRecognitionEnum.RECOGNIZED) {
      filters.push(eb('soundSource.soundTypeId', 'is not', null));
    } else {
      filters.push(eb('soundSource.soundTypeId', 'is', null));
    }
  }
  if (request?.isSimulated !== undefined) {
    filters.push(eb('soundSource.isSimulated', '=', request.isSimulated));
  }
  pushDateTimeClause(filters, 'soundSource', 'soundSource.eventTime', request?.eventTimeFrom, request?.eventTimeTo);

  const data = await repository.selectAllWithDevice(db, filters, sortBy, orderDirection).then(function (soundSourceArr) {
    return soundSourceArr.map(function (soundSource) {
      Object.assign(soundSource, {
        averageCoordinates: {
          latitude: Number.parseFloat(meanBy(soundSource.soundEvents, (soundEvent) => soundEvent.latitudeDevice).toFixed(6)),
          longitude: Number.parseFloat(meanBy(soundSource.soundEvents, (soundEvent) => soundEvent.longitudeDevice).toFixed(6)),
          altitude: Number.parseFloat(meanBy(soundSource.soundEvents, (soundEvent) => soundEvent.altitudeDevice).toFixed(6)),
        },
      });

      return soundSource;
    });
  });

  return {
    statusCode: HttpStatusCode.OK,
    data,
  };
}
