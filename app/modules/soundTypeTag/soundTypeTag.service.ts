import { Kysely } from 'kysely';
import { OrderByDirectionExpression, UndirectedOrderByExpression } from 'kysely/dist/cjs/parser/order-by-parser';
import { ValidationErrorType } from '../../common/enum/errorType.enum';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { DB } from '../../common/type/kysely/db.type';
import { SoundTypeTagRowType } from '../../common/type/kysely/soundTypeTag.type';
import { MainResponseType } from '../../common/type/mainResponse.type';
import { IInsertSoundTypeTagSchema } from './schemas/insert.schema';
import { ISelectAllSoundTypeTagSchema } from './schemas/selectAll.schema';
import * as repository from './soundTypeTag.repository';

export async function insert(db: Kysely<DB>, request: IInsertSoundTypeTagSchema): Promise<MainResponseType> {
  const countName = await repository.countUniversal(db, 'name', request.name);
  if (countName !== 0) {
    return {
      statusCode: HttpStatusCode.CONFLICT,
      validationError: [{ property: 'name', type: ValidationErrorType.NOT_UNIQUE }],
    };
  }

  const data = await repository.insert(db, request);

  return {
    statusCode: HttpStatusCode.CREATED,
    data,
  };
}

export async function selectAll(db: Kysely<DB>, request: ISelectAllSoundTypeTagSchema): Promise<MainResponseType> {
  const sortBy: UndirectedOrderByExpression<DB, 'soundTypeTag', SoundTypeTagRowType> = request.sortBy;
  const orderDirection: OrderByDirectionExpression = request.orderBy;

  const data = await repository.selectAll(db, sortBy, orderDirection);

  return {
    statusCode: HttpStatusCode.OK,
    data,
  };
}
