import Joi from 'joi';
import { propertyLength } from '../../../common/constant/propertyLength';

export const InsertSoundEventSchema = Joi.object()
  .keys({
    signatureFilePath: Joi.string().min(propertyLength.SOUND_EVENT.SIGNATURE_FILE_PATH.MIN).max(propertyLength.SOUND_EVENT.SIGNATURE_FILE_PATH.MAX).optional(),
    record: Joi.string().min(propertyLength.SOUND_EVENT.SIGNATURE_FILE_PATH.MIN).max(propertyLength.SOUND_EVENT.SIGNATURE_FILE_PATH.MAX).required(),
    rtc: Joi.date().options({ convert: true }).required(),
    pressure: Joi.number().required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().required(),
    windSpeed: Joi.number().required(),
    windDirection: Joi.number().required(),
    latitudeDevice: Joi.number().required(),
    longitudeDevice: Joi.number().required(),
    altitudeDevice: Joi.number().required(),
    source: Joi.object().optional(),
    isChanged: Joi.boolean().optional(),
    soundSourceId: Joi.string().uuid({ version: 'uuidv4' }).optional(),
    deviceId: Joi.string().uuid({ version: 'uuidv4' }).required(),
  })
  .required();

export interface IInsertSoundEventSchema {
  signatureFilePath: string;
  record: string;
  rtc: Date;
  pressure: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  latitudeDevice: number;
  longitudeDevice: number;
  altitudeDevice: number;
  source: object;
  isChanged: boolean;
  soundSourceId: string;
  deviceId: string;
}
