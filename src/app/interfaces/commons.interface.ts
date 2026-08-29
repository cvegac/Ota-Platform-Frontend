import { Subject } from "rxjs";

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type GenericHash = {key: string; value: string};

export type RestCache<R = any> = {
  time: number
  data: R;
  expiredTime: number;
}

export type RestCacheConfig = {
  expiredTime: number;
}
