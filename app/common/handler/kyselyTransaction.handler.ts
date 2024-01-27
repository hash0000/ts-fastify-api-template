import { Kysely, Transaction } from 'kysely';
import { DB } from '../type/kysely/db.type';

export async function startTransaction(db: Kysely<DB>) {
  const connection = new Deferred<Transaction<DB>>();
  const result = new Deferred<any>();

  db.transaction()
    .execute((trx) => {
      connection.resolve(trx);
      return result.promise;
    })
    .catch(() => {});

  const trx = await connection.promise;

  return {
    trx,
    commit() {
      result.resolve(null);
    },
    rollback() {
      result.reject(new Error('rollback'));
    },
  };
}

class Deferred<T> {
  readonly #promise: Promise<T>;

  #resolve?: (value: T | PromiseLike<T>) => void;
  #reject?: (reason?: any) => void;

  constructor() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.#reject = reject;
      this.#resolve = resolve;
    });
  }

  get promise(): Promise<T> {
    return this.#promise;
  }

  resolve = (value: T | PromiseLike<T>): void => {
    if (this.#resolve) {
      this.#resolve(value);
    }
  };

  reject = (reason?: any): void => {
    if (this.#reject) {
      this.#reject(reason);
    }
  };
}
