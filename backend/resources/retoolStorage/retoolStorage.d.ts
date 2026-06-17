import type { RetoolStorageClient } from './_client'
declare global {
  /**
   * Retool Storage resource "retool_storage"
   *
   * Usage guidance (from resource configuration):
   * Retool hosted File Storage
   */
  const retoolStorage: RetoolStorageClient<'retoolStorage'>
}
export {}