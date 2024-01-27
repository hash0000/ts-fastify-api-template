import Joi from 'joi';
import { propertyLength } from '../../../common/constant/propertyLength';
import { regexConstant } from '../../../common/constant/regex.constant';
import { BaseIconPictureEnum } from '../../../common/enum/iconPicture.enum';
import { getEnumValues } from '../../../common/helper/getEnumValues.helper';

export const InsertSoundTypeSchema = Joi.object().keys({
  name: Joi.string().trim().min(propertyLength.SOUND_TYPE.NAME.MIN).max(propertyLength.SOUND_TYPE.NAME.MAX).regex(regexConstant.SOUND_TYPE.NAME).required(),
  iconPicture: Joi.number()
    .valid(...getEnumValues(BaseIconPictureEnum))
    .required(),
  soundTypeTagId: Joi.string().uuid({ version: 'uuidv4' }).required(),
  comment: Joi.string().trim().regex(regexConstant.SOUND_TYPE.COMMENT).optional(),
  fileBase64: Joi.string().required(),
});

export interface IInsertSoundTypeSchema {
  name: string;
  iconPicture: BaseIconPictureEnum;
  soundTypeTagId: string;
  comment?: string;
  fileBase64: string;
}
