import Joi from 'joi';
import { regexConstant } from '../../../common/constant/regex.constant';

export const ExportSoundTypeFilesSchema = Joi.object()
  .keys({
    periodFrom: Joi.date().optional(),
    periodTo: Joi.date().optional(),
    comment: Joi.string().regex(regexConstant.SOUND_TYPE.COMMENT).optional(),
  })
  .options({ convert: true });

export interface IExportSoundTypeFilesSchema {
  periodFrom?: Date;
  periodTo?: Date;
  comment?: string;
}
