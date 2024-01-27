import { Insertable, Selectable, Updateable } from 'kysely';
import { Device } from './db.type';

export type DeviceRowType = Selectable<Device>;
export type InsertableDeviceRowType = Insertable<Device>;
export type UpdateableDeviceRowType = Updateable<Device>;
