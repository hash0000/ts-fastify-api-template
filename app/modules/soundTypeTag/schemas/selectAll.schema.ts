import Joi from 'joi';
import { sortOptions } from '../../../common/constant/sortOptions.constant';
import { OrderDirectionType } from '../../../common/type/orderDirection.type';

const sortByKey = ['createdAt', 'name'] as const;

export const SelectAllSoundTypeTagSchema = Joi.object()
  .keys({
    sortBy: Joi.string()
      .valid(...sortByKey)
      .default('createdAt')
      .optional(),
    orderBy: Joi.string()
      .valid(...sortOptions)
      .default('desc')
      .optional(),
  })
  .options({ convert: true });

export interface ISelectAllSoundTypeTagSchema {
  sortBy: (typeof sortByKey)[number];
  orderBy: OrderDirectionType;
}
