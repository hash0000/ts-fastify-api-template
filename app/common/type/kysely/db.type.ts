import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Device {
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  isRegularMode: Generated<boolean | null>;
  isSimulated: Generated<boolean>;
  name: string;
  underId: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface SoundEvent {
  altitudeDevice: number;
  createdAt: Generated<Timestamp>;
  deviceId: string | null;
  humidity: number;
  id: Generated<string>;
  isChanged: Generated<boolean>;
  isSimulated: Generated<boolean>;
  latitudeDevice: Numeric;
  longitudeDevice: Numeric;
  pressure: number;
  record: string;
  rtc: Timestamp;
  signatureFilePath: string | null;
  soundSourceId: string | null;
  source: Json;
  temperature: number;
  updatedAt: Generated<Timestamp>;
  windDirection: number;
  windSpeed: number;
}

export interface SoundSource {
  altitude: number;
  createdAt: Generated<Timestamp>;
  details: Json | null;
  eventTime: Timestamp;
  id: Generated<string>;
  isSimulated: Generated<boolean>;
  latitude: Numeric;
  longitude: Numeric;
  soundTypeId: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface SoundType {
  comment: string | null;
  createdAt: Generated<Timestamp>;
  filePath: string;
  iconPicture: number;
  id: Generated<string>;
  isInbuilt: Generated<boolean>;
  name: string;
  soundTypeTagId: string;
  underId: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface SoundTypeTag {
  createdAt: Generated<Timestamp>;
  iconPicture: number;
  id: Generated<string>;
  name: string;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  device: Device;
  soundEvent: SoundEvent;
  soundSource: SoundSource;
  soundType: SoundType;
  soundTypeTag: SoundTypeTag;
}
