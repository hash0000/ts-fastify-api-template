import Joi from 'joi';
import { propertyLength } from '../../../common/constant/propertyLength';
import { regexConstant } from '../../../common/constant/regex.constant';
import { sortOptions } from '../../../common/constant/sortOptions.constant';
import { OrderDirectionType } from '../../../common/type/orderDirection.type';

const sortByValueArr = ['id', 'name', 'iconPicture', 'underId', 'isInbuilt', 'comment', 'createdAt'] as const;
const sortBySoundTypeTagValueArr = ['id', 'name', 'createdAt'] as const;

export const SelectAllSoundTypeSchema = Joi.object()
  .keys({
    name: Joi.string().min(propertyLength.SOUND_TYPE.NAME.MIN).max(propertyLength.SOUND_TYPE.NAME.MAX).regex(regexConstant.SOUND_TYPE.NAME).trim().optional(),
    soundTypeTagId: Joi.string().uuid({ version: 'uuidv4' }).optional(),
    sortBy: Joi.string()
      .valid(...sortByValueArr)
      .default('createdAt')
      .optional(),
    orderBy: Joi.number()
      .valid(...sortOptions)
      .default('desc')
      .optional(),
    sortBySoundTypeTag: Joi.string()
      .valid(...sortBySoundTypeTagValueArr)
      .optional(),
    orderBySoundTypeTag: Joi.number()
      .valid(...sortOptions)
      .when('sortBySoundTypeTag', {
        is: Joi.exist(),
        then: Joi.required(),
      })
      .optional(),
  })
  .options({ convert: true });

export interface ISelectAllSoundTypeSchema {
  readonly name?: string;
  readonly soundTypeTagId?: string;
  readonly sortBy: (typeof sortByValueArr)[number];
  readonly orderBy: OrderDirectionType;
  readonly sortBySoundTypeTag?: (typeof sortBySoundTypeTagValueArr)[number];
  readonly orderBySoundTypeTag?: OrderDirectionType;
}
