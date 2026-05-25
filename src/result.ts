type BaseError = {
  message: string;
};

type Success<T> = {
  ok: true;
  value: T;
};

type Failure<E extends BaseError> = {
  ok: false;
  error: E;
};

export type Result<T, E extends BaseError = BaseError> =
  | Success<T>
  | Failure<E>;

export const success = <T>(value: T): Success<T> => ({
  ok: true,
  value,
});

export const failure = <E extends BaseError = BaseError>(
  error: E,
): Failure<E> => ({
  ok: false,
  error,
});

export type ResultAsync<T, E extends BaseError = BaseError> = Promise<
  Result<T, E>
>;
