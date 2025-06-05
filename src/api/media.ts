import request from '@/utils/request'

// 媒体文件基础接口
export interface MediaFile {
  id: number
  name: string
  url: string
  size: number
  duration?: number
  format: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

// 分页参数
export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 视频相关接口
export const getVideoListApi = (params: PageParams) => {
  return request<PageResponse<MediaFile>>({
    url: '/media/videos',
    method: 'get',
    params
  })
}

export const uploadVideoApi = (file: FormData, onProgress?: (progress: number) => void) => {
  return request<MediaFile>({
    url: '/media/upload/video',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

export const deleteVideoApi = (id: number) => {
  return request({
    url: `/media/video/${id}`,
    method: 'delete'
  })
}

// 音频相关接口
export const getAudioListApi = (params: PageParams) => {
  return request<PageResponse<MediaFile>>({
    url: '/media/audios',
    method: 'get',
    params
  })
}

export const uploadAudioApi = (file: FormData, onProgress?: (progress: number) => void) => {
  return request<MediaFile>({
    url: '/media/upload/audio',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

export const deleteAudioApi = (id: number) => {
  return request({
    url: `/media/audio/${id}`,
    method: 'delete'
  })
} 