import Joi from 'joi';
import { sortOptions } from '../../../common/constant/sortOptions.constant';
import { SoundSourceRecognitionEnum } from '../../../common/enum/soundSourceRecognition.enum';
import { getEnumValues } from '../../../common/helper/getEnumValues.helper';
import { OrderDirectionType } from '../../../common/type/orderDirection.type';

const sortByValueArr = ['id', 'latitude', 'longitude', 'altitude', 'eventTime', 'isSimulated', 'details', 'createdAt'] as const;

export const SelectAllSoundSourceWithDeviceSchema = Joi.object()
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
        is: Joi.exist(),
        then: Joi.forbidden(),
      }),
    sortBy: Joi.string()
      .valid(...sortByValueArr)
      .default('createdAt')
      .optional(),
    orderBy: Joi.string()
      .valid(...sortOptions)
      .default('desc')
      .optional(),
  })
  .options({ convert: true });

export interface ISelectAllSoundSourceWithDeviceSchema {
  soundTypeRecognition?: number;
  isSimulated?: boolean;
  eventTimeFrom?: Date;
  eventTimeTo?: Date;
  soundTypeIds?: string[];
  sortBy: (typeof sortByValueArr)[number];
  orderBy: OrderDirectionType;
}
