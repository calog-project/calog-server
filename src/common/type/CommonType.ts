export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
