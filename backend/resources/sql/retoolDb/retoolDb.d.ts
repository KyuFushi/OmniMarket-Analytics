import type { SQLResourceFn } from '../_types'
declare global {
  /** PostgreSQL resource "retool_db" */
  const retoolDb: SQLResourceFn<'retoolDb'>
}
export {}