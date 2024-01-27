import Joi from 'joi';
import { propertyLength } from '../../../common/constant/propertyLength';
import { BaseIconPictureEnum } from '../../../common/enum/iconPicture.enum';
import { getEnumValues } from '../../../common/helper/getEnumValues.helper';

export const InsertSoundTypeTagSchema = Joi.object().keys({
  name: Joi.string().trim().min(propertyLength.SOUND_TYPE_TAG.NAME.MIN).max(propertyLength.SOUND_TYPE_TAG.NAME.MAX).required(),
  iconPicture: Joi.number()
    .valid(...getEnumValues(BaseIconPictureEnum))
    .required(),
});

export type IInsertSoundTypeTagSchema = {
  name: string;
  iconPicture: BaseIconPictureEnum;
};
