import request from '@/utils/request'

// ==================== 基础数据模型 ====================

// 媒体文件基础接口（对应 VideoItem）
export interface MediaFile {
  id: string                                    // 唯一标识符 (对应Flutter的String id)
  title: string                                 // 文件标题 (对应Flutter的title)
  description: string                           // 文件描述 (对应Flutter的description)
  cover?: string                                // 封面图URL (对应Flutter的cover)
  url: string                                   // 文件访问URL (对应Flutter的path)
  size: number                                  // 文件大小(字节)
  duration: number                              // 时长(秒) (对应Flutter的duration)
  format: string                                // 文件格式(mp4, mp3等)
  thumbnail?: string                            // 缩略图URL(仅视频)
  status: 'published' | 'draft' | 'processing' // 状态：已上架/已下架/处理中
  level: number                                 // 难度等级 (对应Flutter的level)
  type: string                                  // 类型 (对应Flutter的type, 如'education', 'entertainment')
  category: string                              // 分类 (对应Flutter的category)
  difficulty: 'easy' | 'medium' | 'hard'       // 难度 (对应Flutter的difficulty)
  tags: string[]                                // 标签列表 (对应Flutter的tags)
  createdAt: string                             // 创建时间(ISO格式)
  updatedAt: string                             // 更新时间(ISO格式)
  
  // 扩展字段
  viewCount?: number                            // 观看次数
  progress?: number                             // 播放进度（0-1）
  lastWatchedAt?: string                        // 最后观看时间
}

// 媒体元数据（对应 VideoMetadata）
export interface MediaMetadata {
  version: string                               // 数据版本
  lastUpdated: string                           // 最后更新时间
  totalVideos: number                           // 视频总数
  totalAudios: number                           // 音频总数
  supportedLevels: number[]                     // 支持的等级列表
  supportedTypes: string[]                      // 支持的类型列表
  supportedCategories: string[]                 // 支持的分类列表
  supportedDifficulties: string[]               // 支持的难度列表
  supportedFormats: {                           // 支持的格式
    video: string[]
    audio: string[]
  }
}

// 筛选条件（对应 VideoFilter）
export interface MediaFilter {
  levels?: number[]                             // 等级筛选
  types?: string[]                              // 类型筛选
  categories?: string[]                         // 分类筛选
  difficulties?: string[]                       // 难度筛选
  tags?: string[]                               // 标签筛选
  searchQuery?: string                          // 搜索关键字
  minDuration?: number                          // 最小时长
  maxDuration?: number                          // 最大时长
  status?: string[]                             // 状态筛选
  hasProgress?: boolean                         // 是否有播放进度
}

// 分页参数
export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
  filter?: MediaFilter
  sortBy?: 'title' | 'duration' | 'category' | 'createdAt' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  metadata?: MediaMetadata
}

// 统计信息（对应 getLevelStats）
export interface MediaStats {
  totalCount: number
  levelStats: Record<number, number>            // 各等级数量统计
  typeStats: Record<string, number>             // 各类型数量统计
  categoryStats: Record<string, number>         // 各分类数量统计
  difficultyStats: Record<string, number>       // 各难度数量统计
  avgDuration: number                           // 平均时长
  totalDuration: number                         // 总时长
  viewStats: {                                  // 观看统计
    totalViews: number
    uniqueViewers: number
    avgViewsPerItem: number
  }
}

// 进度信息（对应 LocalStore）
export interface ProgressInfo {
  videoId: string
  position: number                              // 播放位置（秒）
  duration: number                              // 总时长
  percentage: number                            // 完成百分比
  lastWatchedAt: string                         // 最后观看时间
  isCompleted: boolean                          // 是否完成
}

// 推荐参数
export interface RecommendationParams {
  level: number
  excludeIds?: string[]
  maxResults?: number
  type?: string
  category?: string
}

// 上传参数
export interface UploadParams {
  title: string
  description?: string
  status: 'published' | 'draft'
  level: number
  type: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
  file: File
}

// 编辑参数
export interface EditParams {
  id: string
  title: string
  description?: string
  status: 'published' | 'draft' | 'processing'
  level: number
  type: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

// 下载参数
export interface DownloadParams {
  id: string
  name: string
}

// 批量操作参数
export interface BatchParams {
  ids: string[]
  action: 'delete' | 'publish' | 'draft' | 'export'
}

// ==================== 视频相关接口 ====================

// 获取视频列表
export const getVideoListApi = (params: PageParams) => {
  return request<PageResponse<MediaFile>>({
    url: '/api/videos',
    method: 'get',
    params
  })
}

// 获取视频元数据
export const getVideoMetadataApi = () => {
  return request<MediaMetadata>({
    url: '/api/videos/metadata',
    method: 'get'
  })
}

// 获取视频统计信息
export const getVideoStatsApi = () => {
  return request<MediaStats>({
    url: '/api/videos/stats',
    method: 'get'
  })
}

// 按等级获取视频
export const getVideosByLevelApi = (level: number, sortBy?: string) => {
  return request<MediaFile[]>({
    url: `/api/videos/level/${level}`,
    method: 'get',
    params: { sortBy }
  })
}

// 高级筛选获取视频
export const getVideosWithFilterApi = (filter: MediaFilter) => {
  return request<MediaFile[]>({
    url: '/api/videos/filter',
    method: 'post',
    data: filter
  })
}

// 搜索视频
export const searchVideosApi = (query: string) => {
  return request<MediaFile[]>({
    url: '/api/videos/search',
    method: 'get',
    params: { q: query }
  })
}

// 获取推荐视频
export const getRecommendedVideosApi = (params: RecommendationParams) => {
  return request<MediaFile[]>({
    url: '/api/videos/recommended',
    method: 'get',
    params
  })
}

// 上传视频
export const uploadVideoApi = (params: UploadParams, onProgress?: (progress: number) => void) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('title', params.title)
  formData.append('description', params.description || '')
  formData.append('status', params.status)
  formData.append('level', params.level.toString())
  formData.append('type', params.type)
  formData.append('category', params.category)
  formData.append('difficulty', params.difficulty)
  if (params.tags) {
    formData.append('tags', JSON.stringify(params.tags))
  }

  return request<MediaFile>({
    url: '/api/videos/upload',
    method: 'post',
    data: formData,
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

// 编辑视频
export const editVideoApi = (params: EditParams) => {
  return request<MediaFile>({
    url: `/api/videos/${params.id}`,
    method: 'put',
    data: {
      title: params.title,
      description: params.description,
      status: params.status,
      level: params.level,
      type: params.type,
      category: params.category,
      difficulty: params.difficulty,
      tags: params.tags
    }
  })
}

// 删除视频
export const deleteVideoApi = (id: string) => {
  return request({
    url: `/api/videos/${id}`,
    method: 'delete'
  })
}

// 批量操作视频
export const batchVideoOperationApi = (params: BatchParams) => {
  return request({
    url: '/api/videos/batch',
    method: 'post',
    data: params
  })
}

// 下载视频
export const downloadVideoApi = (params: DownloadParams) => {
  return request({
    url: `/api/videos/${params.id}/download`,
    method: 'get',
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response as any])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = params.name
    link.click()
    window.URL.revokeObjectURL(url)
  })
}

// 获取视频详情
export const getVideoDetailApi = (id: string) => {
  return request<MediaFile>({
    url: `/api/videos/${id}`,
    method: 'get'
  })
}

// 保存播放进度
export const saveVideoProgressApi = (videoId: string, position: number) => {
  return request({
    url: '/api/videos/progress',
    method: 'post',
    data: { videoId, position }
  })
}

// 获取播放进度
export const getVideoProgressApi = (videoId: string) => {
  return request<ProgressInfo>({
    url: `/api/videos/progress/${videoId}`,
    method: 'get'
  })
}

// 获取所有播放进度
export const getAllVideoProgressApi = () => {
  return request<ProgressInfo[]>({
    url: '/api/videos/progress',
    method: 'get'
  })
}

// ==================== 音频相关接口 ====================

// 获取音频列表
export const getAudioListApi = (params: PageParams) => {
  return request<PageResponse<MediaFile>>({
    url: '/api/audios',
    method: 'get',
    params
  })
}

// 获取音频元数据
export const getAudioMetadataApi = () => {
  return request<MediaMetadata>({
    url: '/api/audios/metadata',
    method: 'get'
  })
}

// 获取音频统计信息
export const getAudioStatsApi = () => {
  return request<MediaStats>({
    url: '/api/audios/stats',
    method: 'get'
  })
}

// 按等级获取音频
export const getAudiosByLevelApi = (level: number, sortBy?: string) => {
  return request<MediaFile[]>({
    url: `/api/audios/level/${level}`,
    method: 'get',
    params: { sortBy }
  })
}

// 高级筛选获取音频
export const getAudiosWithFilterApi = (filter: MediaFilter) => {
  return request<MediaFile[]>({
    url: '/api/audios/filter',
    method: 'post',
    data: filter
  })
}

// 搜索音频
export const searchAudiosApi = (query: string) => {
  return request<MediaFile[]>({
    url: '/api/audios/search',
    method: 'get',
    params: { q: query }
  })
}

// 获取推荐音频
export const getRecommendedAudiosApi = (params: RecommendationParams) => {
  return request<MediaFile[]>({
    url: '/api/audios/recommended',
    method: 'get',
    params
  })
}

// 上传音频
export const uploadAudioApi = (params: UploadParams, onProgress?: (progress: number) => void) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('title', params.title)
  formData.append('description', params.description || '')
  formData.append('status', params.status)
  formData.append('level', params.level.toString())
  formData.append('type', params.type)
  formData.append('category', params.category)
  formData.append('difficulty', params.difficulty)
  if (params.tags) {
    formData.append('tags', JSON.stringify(params.tags))
  }

  return request<MediaFile>({
    url: '/api/audios/upload',
    method: 'post',
    data: formData,
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

// 编辑音频
export const editAudioApi = (params: EditParams) => {
  return request<MediaFile>({
    url: `/api/audios/${params.id}`,
    method: 'put',
    data: {
      title: params.title,
      description: params.description,
      status: params.status,
      level: params.level,
      type: params.type,
      category: params.category,
      difficulty: params.difficulty,
      tags: params.tags
    }
  })
}

// 删除音频
export const deleteAudioApi = (id: string) => {
  return request({
    url: `/api/audios/${id}`,
    method: 'delete'
  })
}

// 批量操作音频
export const batchAudioOperationApi = (params: BatchParams) => {
  return request({
    url: '/api/audios/batch',
    method: 'post',
    data: params
  })
}

// 下载音频
export const downloadAudioApi = (params: DownloadParams) => {
  return request({
    url: `/api/audios/${params.id}/download`,
    method: 'get',
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response as any])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = params.name
    link.click()
    window.URL.revokeObjectURL(url)
  })
}

// 获取音频详情
export const getAudioDetailApi = (id: string) => {
  return request<MediaFile>({
    url: `/api/audios/${id}`,
    method: 'get'
  })
}

// 保存播放进度
export const saveAudioProgressApi = (audioId: string, position: number) => {
  return request({
    url: '/api/audios/progress',
    method: 'post',
    data: { audioId, position }
  })
}

// 获取播放进度
export const getAudioProgressApi = (audioId: string) => {
  return request<ProgressInfo>({
    url: `/api/audios/progress/${audioId}`,
    method: 'get'
  })
}

// 获取所有播放进度
export const getAllAudioProgressApi = () => {
  return request<ProgressInfo[]>({
    url: '/api/audios/progress',
    method: 'get'
  })
} 