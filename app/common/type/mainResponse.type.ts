import { CustomErrorTypeEnum } from '../enum/errorType.enum';
import { HttpStatusCode } from '../enum/httpStatusCode.enum';

type CustomResponseTypeError = Array<{ property?: string; type?: string; message?: string }>;

export type MainResponseType = {
  statusCode: HttpStatusCode;
  data?: object | object[];
  validationError?: CustomResponseTypeError;
  errorTypeCode?: CustomErrorTypeEnum;
};
