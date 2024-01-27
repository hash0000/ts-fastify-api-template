import Joi from 'joi';
import { propertyLength } from '../../../common/constant/propertyLength';

export const InsertDeviceSchema = Joi.object().keys({
  name: Joi.string().min(propertyLength.DEVICE.NAME.MIN).max(propertyLength.DEVICE.NAME.MAX).required(),
  underId: Joi.string().min(propertyLength.DEVICE.UNDER_ID.MIN).max(propertyLength.DEVICE.UNDER_ID.MAX).optional(),
  isRegularMode: Joi.boolean().optional(),
  isSimulated: Joi.boolean().optional(),
});

export type IInsertDeviceSchema = {
  name: string;
  underId?: string;
  isRegularMode?: boolean;
  isSimulated?: boolean;
};
