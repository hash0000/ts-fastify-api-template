import { ExpressionBuilder, ExpressionWrapper, ReferenceExpression, SqlBool, expressionBuilder } from 'kysely';
import { DB } from '../type/kysely/db.type';

export async function pushDateTimeClause(
  arr: ExpressionWrapper<DB, keyof DB, SqlBool>[],
  table: keyof DB,
  column: ReferenceExpression<DB, keyof DB>,
  from: Date | undefined,
  to: Date | undefined,
): Promise<void> {
  const eb: ExpressionBuilder<DB, typeof table> = expressionBuilder();
  if (from !== undefined && to !== undefined) {
    arr.push(eb.between(column, from, to));

    return;
  }

  if (from !== undefined && to === undefined) {
    arr.push(eb(column, '>', from));

    return;
  }
  if (from === undefined && to !== undefined) {
    arr.push(eb(column, '<', to));

    return;
  }

  return;
}
