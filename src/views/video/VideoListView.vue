<template>
  <div class="video-list">
    <div class="page-header">
      <h1 class="page-title">{{ $t('menu.videoList') }}</h1>
      
      <!-- 筛选器 -->
      <div class="filters">
        <div class="filter-group">
          <div class="filter-icon">
            <el-icon><Filter /></el-icon>
          </div>
          <span class="filter-label">{{ $t('common.filterBy') }}</span>
          
          <el-select 
            v-model="filters.date" 
            :placeholder="$t('common.date')" 
            class="filter-select"
            clearable
            @clear="filters.date = 'all'"
          >
            <el-option :label="$t('common.today')" value="today" />
            <el-option :label="$t('common.thisWeek')" value="thisWeek" />
            <el-option :label="$t('common.thisMonth')" value="thisMonth" />
            <el-option :label="$t('common.all')" value="all" />
          </el-select>
          
          <el-select 
            v-model="filters.status" 
            :placeholder="$t('common.status')" 
            class="filter-select"
            clearable
            @clear="filters.status = 'all'"
          >
            <el-option :label="$t('video.published')" value="published" />
            <el-option :label="$t('video.processing')" value="processing" />
            <el-option :label="$t('video.draft')" value="draft" />
            <el-option :label="$t('common.all')" value="all" />
          </el-select>
          
          <el-select 
            v-model="filters.type" 
            :placeholder="$t('video.videoType')" 
            class="filter-select"
            clearable
            @clear="filters.type = 'all'"
          >
            <el-option :label="$t('video.tutorial')" value="tutorial" />
            <el-option :label="$t('video.presentation')" value="presentation" />
            <el-option :label="$t('video.demo')" value="demo" />
            <el-option :label="$t('common.all')" value="all" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 视频表格 -->
    <el-card class="table-card">
      <el-table :data="filteredVideos" class="video-table" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column :label="$t('video.name')" min-width="200">
          <template #default="scope">
            <div class="video-info">
              <el-image 
                :src="scope.row.thumbnail" 
                class="video-thumbnail"
                fit="cover"
              >
                <template #error>
                  <div class="thumbnail-placeholder">
                    <el-icon><VideoPlay /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="video-details">
                <div class="video-title">{{ scope.row.title }}</div>
                <div class="video-duration">{{ scope.row.duration }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('video.uploadDate')" min-width="120">
          <template #default="scope">
            {{ formatDate(scope.row.uploadTime) }}
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('video.type')" min-width="100">
          <template #default="scope">
            {{ $t(`video.${scope.row.type}`) }}
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('video.size')" min-width="100">
          <template #default="scope">
            {{ formatFileSize(scope.row.size) }}
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('common.status')" min-width="100">
          <template #default="scope">
            <el-tag 
              :type="getStatusType(scope.row.status)" 
              size="small"
              class="status-tag"
            >
              {{ $t(`video.${scope.row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('common.actions')" width="180" fixed="right" align="center">
          <template #default="scope">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="previewVideo(scope.row)">
                {{ $t('video.preview') }}
              </el-button>
              <el-button type="success" size="small" @click="editVideo(scope.row)">
                {{ $t('video.edit') }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteVideo(scope.row)">
                {{ $t('video.delete') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          {{ $t('common.showing') }} {{ paginationInfo.start }}-{{ paginationInfo.end }} {{ $t('common.of') }} {{ paginationInfo.total }}
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalVideos"
          layout="sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
        />
      </div>
    </el-card>

    <!-- 上传悬浮按钮 -->
    <div class="upload-fab-container">
      <el-button 
        type="primary" 
        class="upload-fab"
        @click="showUploadDialog = true"
        circle
        size="large"
      >
        <el-icon size="20"><Plus /></el-icon>
      </el-button>
      <div class="upload-fab-tooltip">{{ $t('video.uploadVideo') }}</div>
    </div>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      :title="$t('video.uploadVideo')"
      width="600px"
      @close="resetUploadForm"
    >
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
        <el-form-item :label="$t('video.title')" prop="title">
          <el-input v-model="uploadForm.title" :placeholder="$t('video.enterTitle')" />
        </el-form-item>
        
        <el-form-item :label="$t('video.type')" prop="type">
          <el-select v-model="uploadForm.type" :placeholder="$t('video.selectType')" style="width: 100%">
            <el-option :label="$t('video.tutorial')" value="tutorial" />
            <el-option :label="$t('video.presentation')" value="presentation" />
            <el-option :label="$t('video.demo')" value="demo" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('video.description')" prop="description">
          <el-input 
            v-model="uploadForm.description" 
            type="textarea" 
            :rows="3"
            :placeholder="$t('video.enterDescription')"
          />
        </el-form-item>
        
        <el-form-item :label="$t('video.file')" prop="file">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            accept="video/*"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              {{ $t('video.dragOrClick') }}
            </div>
            <template #tip>
              <div class="el-upload__tip">
                {{ $t('video.fileFormat') }}
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadDialog = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleUpload" :loading="uploading">
            {{ $t('video.upload') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Filter, 
  VideoPlay, 
  Plus,
  UploadFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()

// 数据
const loading = ref(false)
const showUploadDialog = ref(false)
const uploading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选器
const filters = reactive({
  date: 'all',
  status: 'all',
  type: 'all'
})

// 视频数据
const videos = ref([
  {
    id: '00001',
    title: '产品介绍视频 - 2024年度回顾',
    thumbnail: 'https://via.placeholder.com/120x68/4A90E2/FFFFFF?text=Video1',
    duration: '05:32',
    size: 52428800,
    uploadTime: '2024-01-15T10:30:00Z',
    type: 'presentation',
    status: 'published',
    views: 1240
  },
  {
    id: '00002',
    title: '用户培训教程 - 基础操作指南',
    thumbnail: 'https://via.placeholder.com/120x68/7ED321/FFFFFF?text=Video2',
    duration: '12:45',
    size: 125829120,
    uploadTime: '2024-01-14T14:20:00Z',
    type: 'tutorial',
    status: 'processing',
    views: 856
  },
  {
    id: '00003',
    title: '技术分享 - AI智能识别技术解析',
    thumbnail: 'https://via.placeholder.com/120x68/F5A623/FFFFFF?text=Video3',
    duration: '08:15',
    size: 78643200,
    uploadTime: '2024-01-13T16:45:00Z',
    type: 'demo',
    status: 'published',
    views: 2103
  },
  {
    id: '00004',
    title: '产品功能演示 - 新特性介绍',
    thumbnail: 'https://via.placeholder.com/120x68/9013FE/FFFFFF?text=Video4',
    duration: '06:20',
    size: 67108864,
    uploadTime: '2024-01-12T09:15:00Z',
    type: 'demo',
    status: 'draft',
    views: 0
  },
  {
    id: '00005',
    title: '团队协作培训 - 高效沟通技巧',
    thumbnail: 'https://via.placeholder.com/120x68/50E3C2/FFFFFF?text=Video5',
    duration: '15:30',
    size: 156437504,
    uploadTime: '2024-01-11T11:30:00Z',
    type: 'tutorial',
    status: 'published',
    views: 3456
  }
])

// 上传表单
const uploadForm = reactive({
  title: '',
  type: '',
  description: '',
  file: null
})

const uploadRules = {
  title: [
    { required: true, message: t('video.titleRequired'), trigger: 'blur' }
  ],
  type: [
    { required: true, message: t('video.typeRequired'), trigger: 'change' }
  ]
}

const fileList = ref([])
const uploadFormRef = ref()

// 计算属性
const filteredVideos = computed(() => {
  let result = videos.value

  if (filters.status !== 'all') {
    result = result.filter(video => video.status === filters.status)
  }
  
  if (filters.type !== 'all') {
    result = result.filter(video => video.type === filters.type)
  }

  return result.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const totalVideos = computed(() => videos.value.length)

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalVideos.value)
  return { start, end, total: totalVideos.value }
})

// 方法
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    published: 'success',
    processing: 'warning',
    draft: 'info'
  }
  return statusMap[status] || 'info'
}



const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const previewVideo = (video: any) => {
  ElMessage.info(t('video.previewFeature'))
}

const editVideo = (video: any) => {
  ElMessage.info(t('video.editFeature'))
}

const deleteVideo = (video: any) => {
  ElMessageBox.confirm(
    t('video.deleteConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success(t('video.deleteSuccess'))
  })
}

const handleFileChange = (file: any) => {
  uploadForm.file = file.raw
}

const resetUploadForm = () => {
  uploadForm.title = ''
  uploadForm.type = ''
  uploadForm.description = ''
  uploadForm.file = null
  fileList.value = []
  uploadFormRef.value?.resetFields()
}

const handleUpload = () => {
  uploadFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      uploading.value = true
      // 模拟上传
      setTimeout(() => {
        uploading.value = false
        showUploadDialog.value = false
        ElMessage.success(t('video.uploadSuccess'))
        resetUploadForm()
      }, 2000)
    }
  })
}
</script>

<style scoped>
.video-list {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.filters {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.filter-label {
  font-weight: 600;
  color: white;
  font-size: 16px;
  margin-right: 12px;
}

.filter-select {
  min-width: 140px;
}

:deep(.filter-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.filter-select .el-input__wrapper:hover) {
  background: white;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.table-card {
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.video-table {
  font-size: 14px;
}

.video-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.video-thumbnail {
  width: 60px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
}

.thumbnail-placeholder {
  width: 60px;
  height: 34px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.video-details {
  flex: 1;
  min-width: 0;
}

.video-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
  line-height: 1.4;
}

.video-duration {
  font-size: 12px;
  color: #a0aec0;
}

.status-tag {
  border-radius: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}

.pagination-info {
  font-size: 14px;
  color: #718096;
}

.upload-fab-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.upload-fab {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.upload-fab:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.upload-fab:active {
  transform: translateY(-1px) scale(0.98);
}

.upload-fab-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.upload-fab-container:hover .upload-fab-tooltip {
  opacity: 1;
  right: 75px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.action-buttons .el-button {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-table th) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #495057;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 11px;
  border-bottom: 2px solid #dee2e6;
  height: 56px;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
  padding: 16px 12px;
}

:deep(.el-table tbody tr:hover) {
  background-color: #f8f9ff;
}

:deep(.el-pagination) {
  --el-pagination-font-size: 14px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .filters {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-select {
    min-width: 100%;
  }
  
  .video-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-buttons .el-button {
    width: 100%;
    font-size: 11px;
    padding: 4px 8px;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 12px;
  }
  
  .upload-fab-container {
    bottom: 20px;
    right: 20px;
  }
  
  .upload-fab {
    width: 48px;
    height: 48px;
  }
  
  .upload-fab-tooltip {
    display: none;
  }
}
</style> 