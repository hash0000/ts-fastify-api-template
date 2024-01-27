import Joi from 'joi';

export const UpdateSoundSourceSchema = Joi.object().keys({
  soundTypeId: Joi.string().allow(null).uuid({ version: 'uuidv4' }).required(),
});

export interface IUpdateSoundSourceSchema {
  soundTypeId: string;
}
