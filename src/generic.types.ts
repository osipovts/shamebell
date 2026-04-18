export type Constructor<T> = new (...args: any[]) => T;
export type Maybe<T = unknown> = undefined | T;
export type MaybeAsyncVoid = void | Promise<void>;
