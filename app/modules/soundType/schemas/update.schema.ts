import Joi from 'joi';
import { propertyLength } from '../../../common/constant/propertyLength';
import { regexConstant } from '../../../common/constant/regex.constant';
import { BaseIconPictureEnum } from '../../../common/enum/iconPicture.enum';

export const UpdateSoundTypeSchema = Joi.object().keys({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  name: Joi.string().trim().min(propertyLength.SOUND_TYPE.NAME.MIN).max(propertyLength.SOUND_TYPE.NAME.MAX).regex(regexConstant.SOUND_TYPE.NAME).optional(),
  iconPicture: Joi.number()
    .valid(...Object.values(BaseIconPictureEnum).filter((el) => !isNaN(Number(el))))
    .optional(),
  fileBase64: Joi.string().optional(),
  soundTypeTagId: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  comment: Joi.string().trim().regex(regexConstant.SOUND_TYPE.COMMENT).allow(null).optional(),
});

export interface IUpdateSoundTypeSchema {
  readonly id: string;
  readonly name?: string;
  readonly iconPicture?: BaseIconPictureEnum;
  readonly fileBase64?: string;
  readonly soundTypeTagId?: string;
  readonly comment?: string | null;
}
