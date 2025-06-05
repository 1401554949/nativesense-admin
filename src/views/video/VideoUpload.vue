<template>
  <div class="video-upload">
    <div class="page-header">
      <h1 class="page-title">上传视频</h1>
      <el-button @click="$router.push('/video/list')">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
    </div>
    
    <el-card class="upload-card">
      <div class="upload-area">
        <el-upload
          ref="uploadRef"
          class="upload-dragger"
          drag
          action="#"
          :multiple="true"
          :auto-upload="false"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :accept="acceptedTypes"
          :before-upload="beforeUpload"
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持格式：MP4、AVI、MOV、WMV、FLV（单个文件不超过500MB）
            </div>
          </template>
        </el-upload>
        
        <!-- 上传按钮 -->
        <div v-if="fileList.length > 0" class="upload-actions">
          <el-button
            type="primary"
            :loading="uploading"
            @click="handleUpload"
          >
            {{ uploading ? '上传中...' : '开始上传' }}
          </el-button>
          <el-button @click="clearFiles">清空列表</el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 上传进度 -->
    <el-card v-if="uploadingFiles.length > 0" class="progress-card">
      <template #header>
        <div class="card-header">
          <span>上传进度</span>
          <span>{{ completedCount }}/{{ uploadingFiles.length }}</span>
        </div>
      </template>
      
      <div class="progress-list">
        <div
          v-for="file in uploadingFiles"
          :key="file.uid"
          class="progress-item"
        >
          <div class="file-info">
            <div class="file-icon">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="file-details">
              <p class="file-name">{{ file.name }}</p>
              <p class="file-size">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          
          <div class="progress-info">
            <el-progress
              :percentage="file.progress"
              :status="file.status === 'success' ? 'success' : file.status === 'error' ? 'exception' : undefined"
            />
            <div class="progress-text">
              <span v-if="file.status === 'uploading'">{{ file.progress }}%</span>
              <span v-else-if="file.status === 'success'" class="success-text">上传成功</span>
              <span v-else-if="file.status === 'error'" class="error-text">上传失败</span>
              <span v-else>等待上传</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 上传成功列表 -->
    <el-card v-if="successFiles.length > 0" class="success-card">
      <template #header>
        <div class="card-header">
          <span>上传成功</span>
          <el-button type="text" @click="viewUploaded">查看文件</el-button>
        </div>
      </template>
      
      <div class="success-list">
        <div
          v-for="file in successFiles"
          :key="file.id"
          class="success-item"
        >
          <div class="file-thumbnail">
            <img v-if="file.thumbnail" :src="file.thumbnail" alt="缩略图">
            <el-icon v-else><VideoPlay /></el-icon>
          </div>
          <div class="file-info">
            <h4>{{ file.name }}</h4>
            <p>{{ formatFileSize(file.size) }} • {{ file.format.toUpperCase() }}</p>
          </div>
          <div class="file-actions">
            <el-button type="primary" size="small" @click="previewFile(file)">
              预览
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Upload, VideoPlay } from '@element-plus/icons-vue'
import { uploadVideoApi, type MediaFile } from '@/api/media'
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus'

interface UploadingFile extends UploadFile {
  progress: number
  status: 'waiting' | 'uploading' | 'success' | 'error'
}

const router = useRouter()
const uploadRef = ref<UploadInstance>()

const fileList = ref<UploadFiles>([])
const uploadingFiles = ref<UploadingFile[]>([])
const successFiles = ref<MediaFile[]>([])
const uploading = ref(false)

const acceptedTypes = '.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm'

const completedCount = computed(() => {
  return uploadingFiles.value.filter(file => 
    file.status === 'success' || file.status === 'error'
  ).length
})

const formatFileSize = (size: number): string => {
  if (size === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const beforeUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/')
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isVideo) {
    ElMessage.error('只能上传视频文件！')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('上传文件大小不能超过 500MB！')
    return false
  }
  return true
}

const handleFileChange = (file: UploadFile, files: UploadFiles) => {
  fileList.value = files
}

const handleFileRemove = (file: UploadFile, files: UploadFiles) => {
  fileList.value = files
}

const clearFiles = () => {
  uploadRef.value?.clearFiles()
  fileList.value = []
}

const handleUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要上传的文件')
    return
  }

  uploading.value = true
  uploadingFiles.value = fileList.value.map(file => ({
    ...file,
    progress: 0,
    status: 'waiting' as const
  }))

  try {
    for (let i = 0; i < uploadingFiles.value.length; i++) {
      const file = uploadingFiles.value[i]
      file.status = 'uploading'

      try {
        const formData = new FormData()
        formData.append('file', file.raw!)

        const response = await uploadVideoApi(formData, (progress) => {
          file.progress = progress
        })

        file.status = 'success'
        file.progress = 100
        successFiles.value.push(response)
        
        ElMessage.success(`${file.name} 上传成功`)
      } catch (error) {
        file.status = 'error'
        console.error(`${file.name} 上传失败:`, error)
        ElMessage.error(`${file.name} 上传失败`)
      }
    }
  } finally {
    uploading.value = false
  }
}

const previewFile = (file: MediaFile) => {
  // 预览文件逻辑
  console.log('预览文件:', file)
}

const viewUploaded = () => {
  router.push('/video/list')
}
</script>

<style scoped>
.video-upload {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.upload-card {
  margin-bottom: 20px;
}

.upload-area {
  text-align: center;
}

.upload-dragger {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

:deep(.el-upload-dragger:hover) {
  border-color: #409eff;
}

:deep(.el-icon--upload) {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

:deep(.el-upload__text) {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

:deep(.el-upload__text em) {
  color: #409eff;
  font-style: normal;
}

:deep(.el-upload__tip) {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}

.upload-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.progress-card,
.success-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-list {
  max-height: 400px;
  overflow-y: auto;
}

.progress-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.progress-item:last-child {
  border-bottom: none;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 20px;
}

.file-icon {
  width: 40px;
  height: 40px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 20px;
  color: #909399;
}

.file-details .file-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 4px 0;
}

.file-details .file-size {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.progress-info {
  width: 300px;
}

.progress-text {
  text-align: right;
  margin-top: 4px;
  font-size: 12px;
}

.success-text {
  color: #67c23a;
}

.error-text {
  color: #f56c6c;
}

.success-list {
  max-height: 300px;
  overflow-y: auto;
}

.success-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.success-item:last-child {
  border-bottom: none;
}

.file-thumbnail {
  width: 60px;
  height: 45px;
  border-radius: 4px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  overflow: hidden;
  font-size: 20px;
  color: #909399;
}

.file-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.success-item .file-info {
  flex: 1;
  margin-right: 12px;
}

.success-item .file-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 4px 0;
}

.success-item .file-info p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.file-actions {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .progress-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .progress-info {
    width: 100%;
  }
  
  .progress-text {
    text-align: left;
  }
}
</style> 