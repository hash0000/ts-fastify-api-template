import Joi from 'joi';

export const InsertSoundSourceSchema = Joi.object().keys({
  latitude: Joi.number().precision(8).less(90).greater(-90).required(),
  longitude: Joi.number().precision(8).less(180).greater(-180).required(),
  altitude: Joi.number().required(),
  eventTime: Joi.date().options({ convert: true }).required(),
  soundTypeId: Joi.string().uuid({ version: 'uuidv4' }).optional(),
});

export interface IInsertSoundSourceSchema {
  latitude: number;
  longitude: number;
  altitude: number;
  eventTime: Date;
  soundTypeId?: string;
}
