import Joi from 'joi';

export const UpdateSoundEventSchema = Joi.object()
  .keys({
    latitudeDevice: Joi.number().optional(),
    longitudeDevice: Joi.number().optional(),
    altitudeDevice: Joi.number().optional(),
    pressure: Joi.number().optional(),
    humidity: Joi.number().optional(),
    temperature: Joi.number().optional(),
    windSpeed: Joi.number().optional(),
    windDirection: Joi.number().optional(),
    rtc: Joi.date().options({ convert: true }).optional(),
  })
  .min(1)
  .required();

export interface IUpdateSoundEventSchema {
  latitudeDevice?: number;
  longitudeDevice?: number;
  altitudeDevice?: number;
  pressure?: number;
  humidity?: number;
  temperature?: number;
  windSpeed?: number;
  windDirection?: number;
  rtc?: Date;
}
