import Joi from 'joi';

export const UuidSchema = Joi.object()
  .keys({
    id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  })
  .required();

export interface IUuidSchema {
  id: string;
}
