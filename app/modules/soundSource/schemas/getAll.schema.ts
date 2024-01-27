import Joi from 'joi';
import { sortOptions } from '../../../common/constant/sortOptions.constant';
import { SoundSourceRecognitionEnum } from '../../../common/enum/soundSourceRecognition.enum';
import { getEnumValues } from '../../../common/helper/getEnumValues.helper';
import { OrderDirectionType } from '../../../common/type/orderDirection.type';

const sortByKey = ['createdAt', 'eventTime', 'latitude', 'longitude', 'altitude', 'isSimulated'] as const;
const sortBySoundTypeKey = ['id', 'name', 'createdAt'] as const;

export const SelectAllSoundSourceSchema = Joi.object()
  .keys({
    soundTypeRecognition: Joi.number()
      .valid(...getEnumValues(SoundSourceRecognitionEnum))
      .optional(),
    isSimulated: Joi.boolean().optional(),
    eventTimeFrom: Joi.date().optional(),
    eventTimeTo: Joi.date().optional(),
    soundTypeIds: Joi.array()
      .items(Joi.string().uuid({ version: 'uuidv4' }))
      .min(1)
      .single()
      .unique()
      .optional()
      .when('soundTypeRecognition', {
        is: Joi.exist().valid(SoundSourceRecognitionEnum.NOT_RECOGNIZED),
        then: Joi.forbidden(),
      }),
    sortBy: Joi.string()
      .valid(...sortByKey)
      .default('createdAt')
      .when('sortBySoundType', {
        is: Joi.exist(),
        then: Joi.forbidden(),
      })
      .optional(),
    orderBy: Joi.string()
      .valid(...sortOptions)
      .default('desc')
      .when('sortBySoundType', {
        is: Joi.exist(),
        then: Joi.forbidden(),
      })
      .optional(),
    sortBySoundType: Joi.string()
      .valid(...sortBySoundTypeKey)
      .optional(),
    orderBySoundType: Joi.string()
      .valid(...sortOptions)
      .when('sortBySoundType', {
        is: Joi.exist(),
        then: Joi.required(),
      })
      .optional(),
  })
  .options({ convert: true });

export interface ISelectAllSoundSourceSchema {
  readonly soundTypeRecognition?: number;
  readonly isSimulated?: boolean;
  readonly eventTimeFrom?: Date;
  readonly eventTimeTo?: Date;
  readonly soundTypeIds?: string[];
  readonly sortBy: (typeof sortByKey)[number];
  readonly orderBy: OrderDirectionType;
  readonly sortBySoundType?: (typeof sortBySoundTypeKey)[number];
  readonly orderBySoundType?: OrderDirectionType;
}
