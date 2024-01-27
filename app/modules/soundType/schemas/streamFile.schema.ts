import Joi from 'joi';
import { propertyLength } from '../../../common/constant/propertyLength';

export const StreamSoundTypeFileSchema = Joi.object().keys({
  fileName: Joi.string().min(propertyLength.SOUND_TYPE.FILE_PATH.MIN).max(propertyLength.SOUND_TYPE.FILE_PATH.MAX).required(),
});

export interface IStreamSoundTypeFileSchema {
  fileName: string;
}
