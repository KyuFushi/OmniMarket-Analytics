/**
 * @deprecated Calling the resource directly is deprecated. Use `.query(...)` for buffered results
 * or `.queryStreamRaw(...)` to forward the raw streamed response straight through a backend
 * function. Example: `retoolDb.query('SELECT 1')`.
 * * @note $N placeholders must appear in ascending order in the query text ($1 before $2 before $3).
 * The driver maps $N to params[N-1] - out-of-order placeholders silently swap values.
 * @param sql - SQL query string. Use $1, $2 for PostgreSQL/Redshift; ? for MySQL/MariaDB/SQLite.
 * @param params - Parameter values for parameterized queries (prevents SQL injection)
 */
type SQLResourceLegacyCallable = <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<{ data: T[] }>

export type SQLResourceFn<Name extends string> = SQLResourceLegacyCallable & {
  readonly __type: Name
  /**
   * Execute a SQL query against this database and buffer the full result.
   * * @example
   * const users = await retoolDb.query('SELECT * FROM users WHERE active = $1', [true])
   * console.log(users.data) // [{id: 1, name: 'Alice'}, ...]
   * * @example
   * // With type parameter for typed results:
   * const users = await retoolDb.query<{ id: number; name: string; email: string }>(
   * 'SELECT id, name, email FROM users WHERE active = $1', [true]
   * )
   * console.log(users.data[0].name) // typed as string
   * * @example
   * // Discover tables:
   * // SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
   * // Discover columns:
   * // SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'
   * * @note $N placeholders must appear in ascending order in the query text ($1 before $2 before $3).
   * The driver maps $N to params[N-1] - out-of-order placeholders silently swap values.
   * @param sql - SQL query string. Use $1, $2 for PostgreSQL/Redshift; ? for MySQL/MariaDB/SQLite.
   * @param params - Parameter values for parameterized queries (prevents SQL injection)
   */
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ data: T[] }>
  /**
   * Faster alternative to `.query(...)` when the backend function's only job is to
   * return the SQL result to the caller. Return the result directly from the backend
   * function - that is the only valid use. Do not iterate, await, or transform it;
   * use `.query(...)` if the function needs to inspect, transform, or aggregate rows.
   * * @example
   * export default async function getUsers() {
   * return retoolDb.queryStreamRaw('SELECT id, name FROM users WHERE active = $1', [true])
   * }
   */
  queryStreamRaw(sql: string, params?: unknown[]): Promise<AsyncIterable<Uint8Array>>
}