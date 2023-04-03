// Don't use `{}` as a type. `{}` actually means "any non-nullish value".
export type EmptyObj = Record<string, never>;
