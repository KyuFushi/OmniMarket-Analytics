import type {
  RetoolFile,
  RetoolFileStorageObject,
  RetoolFileFolderResource,
  DeleteResult,
} from './_types'

/**
 * Retool Storage client for managing files and folders.
 *
 * @example
 * // List files
 * const files = await myRetoolStorage.list()
 *
 * @example
 * // Upload a file
 * const file = await myRetoolStorage.upload({
 * fileName: 'my-file.txt',
 * data: btoa('hello world'), // base64 data
 * mimeType: 'text/plain'
 * })
 *
 * @example
 * // Read a file
 * const fileData = await myRetoolStorage.read({ fileId: 'abc-123' })
 * const text = atob(fileData.data.base64Data)
 */
export interface RetoolStorageClient<Name extends string> {
  readonly __type: Name

  /**
   * List files in Retool Storage.
   *
   * @param params.folderName - Folder to list files from (omit for root)
   * @param params.pageSize - Number of files per page
   * @param params.pageNumber - Page number (1-based)
   */
  list(params: {
    folderName?: string
    pageSize?: number
    pageNumber?: number
  }): Promise<{ data: RetoolFile[] }>

  /**
   * List folders in Retool Storage.
   *
   * @param params.pageSize - Number of folders per page
   * @param params.pageNumber - Page number (1-based)
   */
  listFolders(params: {
    pageSize?: number
    pageNumber?: number
  }): Promise<{ data: RetoolFileFolderResource[] }>

  /**
   * Read a file's contents.
   *
   * @param params.fileId - Opaque file ID obtained from list
   */
  read(params: {
    fileId: string
  }): Promise<{ data: RetoolFileStorageObject }>

  /**
   * Download a file's contents.
   *
   * @param params.fileId - Opaque file ID obtained from list
   */
  download(params: {
    fileId: string
  }): Promise<{ data: RetoolFileStorageObject }>

  /**
   * Upload a file to Retool Storage.
   *
   * @param params.fileName - Name of the uploaded file
   * @param params.data - File contents as base64-encoded string
   * @param params.folderName - Folder to upload to (must exist; omit for root)
   * @param params.mimeType - MIME type of the file
   * @param params.shouldOverwriteOnNameCollision - Overwrite if a file with the same name exists (default: false)
   * @param params.isPublic - Make the file publicly accessible (default: false, use with caution)
   */
  upload(params: {
    fileName: string
    data: string
    folderName?: string
    mimeType: string
    shouldOverwriteOnNameCollision?: boolean
    isPublic?: boolean
  }): Promise<{ data: RetoolFile }>

  /**
   * Delete a file.
   *
   * @param params.fileId - Opaque file ID obtained from list
   */
  delete(params: {
    fileId: string
  }): Promise<{ data: DeleteResult }>

  /**
   * Rename a file.
   *
   * @param params.fileId - Opaque file ID obtained from list
   * @param params.fileName - New name for the file
   */
  rename(params: {
    fileId: string
    fileName: string
  }): Promise<{ data: RetoolFile }>

  /**
   * Set a file's public access.
   * Be careful when making files public.
   *
   * @param params.fileId - Opaque file ID obtained from list
   * @param params.isPublic - Whether the file should be publicly accessible
   */
  setPublic(params: {
    fileId: string
    isPublic: boolean
  }): Promise<{ data: RetoolFile }>

  /**
   * Move a file to a different folder.
   *
   * @param params.fileId - Opaque file ID obtained from list
   * @param params.folderName - Target folder name (must exist)
   */
  move(params: {
    fileId: string
    folderName: string
  }): Promise<{ data: RetoolFile }>

  /**
   * Create a new folder.
   *
   * @param params.folderName - Name of the new folder
   */
  mkdir(params: {
    folderName: string
  }): Promise<{ data: RetoolFileFolderResource }>

  /**
   * Delete a folder.
   *
   * @param params.folderName - Name of the folder to delete
   */
  deleteFolder(params: {
    folderName: string
  }): Promise<{ data: DeleteResult }>

  /**
   * Rename a folder.
   *
   * @param params.folderName - Current name of the folder
   * @param params.newFolderName - New name for the folder
   */
  renameFolder(params: {
    folderName: string
    newFolderName: string
  }): Promise<{ data: RetoolFileFolderResource }>

  /**
   * More performant alternative to the buffered method when the backend function does
   * not need to modify the result before returning it to the client. Return the result
   * directly from the backend function - that is the only valid use. Do not iterate,
   * await, or transform it; use the buffered variant if the function needs to inspect,
   * transform, or aggregate the response.
   *
   * Streaming variant of `list`.
   */
  listStreamRaw(params?: {
    folderName?: string
    pageSize?: number
    pageNumber?: number
  }): Promise<AsyncIterable<Uint8Array>>

  /**
   * More performant alternative to the buffered method when the backend function does
   * not need to modify the result before returning it to the client. Return the result
   * directly from the backend function - that is the only valid use. Do not iterate,
   * await, or transform it; use the buffered variant if the function needs to inspect,
   * transform, or aggregate the response.
   *
   * Streaming variant of `listFolders`.
   */
  listFoldersStreamRaw(params?: {
    pageSize?: number
    pageNumber?: number
  }): Promise<AsyncIterable<Uint8Array>>

  /**
   * More performant alternative to the buffered method when the backend function does
   * not need to modify the result before returning it to the client. Return the result
   * directly from the backend function - that is the only valid use. Do not iterate,
   * await, or transform it; use the buffered variant if the function needs to inspect,
   * transform, or aggregate the response.
   *
   * Streaming variant of `read`. Particularly useful for large files.
   */
  readStreamRaw(params: {
    fileId: string
  }): Promise<AsyncIterable<Uint8Array>>

  /**
   * More performant alternative to the buffered method when the backend function does
   * not need to modify the result before returning it to the client. Return the result
   * directly from the backend function - that is the only valid use. Do not iterate,
   * await, or transform it; use the buffered variant if the function needs to inspect,
   * transform, or aggregate the response.
   *
   * Streaming variant of `download`. Particularly useful for large files.
   */
  downloadStreamRaw(params: {
    fileId: string
  }): Promise<AsyncIterable<Uint8Array>>
}