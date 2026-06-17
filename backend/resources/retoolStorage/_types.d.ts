/** Metadata for a file stored in Retool Storage */
export interface RetoolFile {
  id: string
  name: string
  type: string
  url: string
  sizeBytes: number
  createdAt: string
  updatedAt: string
  folderName: string | null
  isPublic: boolean
}

/** File contents returned from read/download operations */
export interface RetoolFileStorageObject {
  id: string
  name: string
  type: string
  sizeBytes: number
  base64Data: string
  fileId?: string
  url?: string
  folderName: string | null
}

/** Folder metadata */
export interface RetoolFileFolderAsResource {
  name: string
  createdAt: string
  updatedAt: string
}

/** Result from delete operations */
export interface DeleteResult {
  message: string
}