<template>
  <div class="audio-list">
    <div class="page-header">
      <h1 class="page-title">{{ $t('menu.audioList') }}</h1>
      
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
            <el-option :label="$t('audio.published')" value="published" />
            <el-option :label="$t('audio.processing')" value="processing" />
            <el-option :label="$t('audio.draft')" value="draft" />
            <el-option :label="$t('common.all')" value="all" />
          </el-select>
          
          <el-select 
            v-model="filters.type" 
            :placeholder="$t('audio.audioType')" 
            class="filter-select"
            clearable
            @clear="filters.type = 'all'"
          >
            <el-option :label="$t('audio.music')" value="music" />
            <el-option :label="$t('audio.voice')" value="voice" />
            <el-option :label="$t('audio.podcast')" value="podcast" />
            <el-option :label="$t('audio.effect')" value="effect" />
            <el-option :label="$t('common.all')" value="all" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 音频表格 -->
    <el-card class="table-card">
      <el-table :data="filteredAudios" class="audio-table" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column :label="$t('audio.name')" min-width="200">
          <template #default="scope">
            <div class="audio-info">
              <div class="audio-thumbnail">
                <el-icon><Headset /></el-icon>
                <div class="audio-wave">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="audio-details">
                <div class="audio-title">{{ scope.row.title }}</div>
                <div class="audio-duration">{{ scope.row.duration }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('audio.uploadDate')" min-width="120">
          <template #default="scope">
            {{ formatDate(scope.row.uploadTime) }}
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('audio.type')" min-width="100">
          <template #default="scope">
            {{ $t(`audio.${scope.row.type}`) }}
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('audio.size')" min-width="100">
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
              {{ $t(`audio.${scope.row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('common.actions')" width="180" fixed="right" align="center">
          <template #default="scope">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="playAudio(scope.row)">
                {{ $t('audio.play') }}
              </el-button>
              <el-button type="success" size="small" @click="editAudio(scope.row)">
                {{ $t('audio.edit') }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteAudio(scope.row)">
                {{ $t('audio.delete') }}
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
          :total="totalAudios"
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
      <div class="upload-fab-tooltip">{{ $t('audio.uploadAudio') }}</div>
    </div>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      :title="$t('audio.uploadAudio')"
      width="600px"
      @close="resetUploadForm"
    >
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
        <el-form-item :label="$t('audio.title')" prop="title">
          <el-input v-model="uploadForm.title" :placeholder="$t('audio.enterTitle')" />
        </el-form-item>
        
        <el-form-item :label="$t('audio.type')" prop="type">
          <el-select v-model="uploadForm.type" :placeholder="$t('audio.selectType')" style="width: 100%">
            <el-option :label="$t('audio.music')" value="music" />
            <el-option :label="$t('audio.voice')" value="voice" />
            <el-option :label="$t('audio.podcast')" value="podcast" />
            <el-option :label="$t('audio.effect')" value="effect" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('audio.description')" prop="description">
          <el-input 
            v-model="uploadForm.description" 
            type="textarea" 
            :rows="3"
            :placeholder="$t('audio.enterDescription')"
          />
        </el-form-item>
        
        <el-form-item :label="$t('audio.file')" prop="file">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            accept="audio/*"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              {{ $t('audio.dragOrClick') }}
            </div>
            <template #tip>
              <div class="el-upload__tip">
                {{ $t('audio.fileFormat') }}
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadDialog = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleUpload" :loading="uploading">
            {{ $t('audio.upload') }}
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
  Headset, 
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

// 音频数据
const audios = ref([
  {
    id: '00001',
    title: '背景音乐 - 轻松办公BGM',
    duration: '03:45',
    size: 8947848,
    uploadTime: '2024-01-15T14:30:00Z',
    type: 'music',
    status: 'published',
    plays: 456
  },
  {
    id: '00002',
    title: '语音提示 - 系统操作音效包',
    duration: '01:20',
    size: 3145728,
    uploadTime: '2024-01-14T10:15:00Z',
    type: 'effect',
    status: 'processing',
    plays: 789
  },
  {
    id: '00003',
    title: '播客节目 - 科技前沿讨论',
    duration: '25:30',
    size: 60817408,
    uploadTime: '2024-01-13T09:45:00Z',
    type: 'podcast',
    status: 'published',
    plays: 1234
  },
  {
    id: '00004',
    title: '英语口语 - 商务会议用语',
    duration: '12:15',
    size: 29360128,
    uploadTime: '2024-01-12T16:20:00Z',
    type: 'voice',
    status: 'draft',
    plays: 0
  },
  {
    id: '00005',
    title: '冥想音乐 - 放松身心专用',
    duration: '08:30',
    size: 20971520,
    uploadTime: '2024-01-11T08:00:00Z',
    type: 'music',
    status: 'published',
    plays: 2048
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
    { required: true, message: t('audio.titleRequired'), trigger: 'blur' }
  ],
  type: [
    { required: true, message: t('audio.typeRequired'), trigger: 'change' }
  ]
}

const fileList = ref([])
const uploadFormRef = ref()

// 计算属性
const filteredAudios = computed(() => {
  let result = audios.value

  if (filters.status !== 'all') {
    result = result.filter(audio => audio.status === filters.status)
  }
  
  if (filters.type !== 'all') {
    result = result.filter(audio => audio.type === filters.type)
  }

  return result.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const totalAudios = computed(() => audios.value.length)

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalAudios.value)
  return { start, end, total: totalAudios.value }
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

const playAudio = (audio: any) => {
  ElMessage.info(t('audio.playFeature'))
}

const editAudio = (audio: any) => {
  ElMessage.info(t('audio.editFeature'))
}

const deleteAudio = (audio: any) => {
  ElMessageBox.confirm(
    t('audio.deleteConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success(t('audio.deleteSuccess'))
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
        ElMessage.success(t('audio.uploadSuccess'))
        resetUploadForm()
      }, 2000)
    }
  })
}
</script>

<style scoped>
.audio-list {
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
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(79, 172, 254, 0.15);
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

.audio-table {
  font-size: 14px;
}

.audio-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audio-thumbnail {
  position: relative;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.audio-wave {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1px;
}

.audio-wave span {
  width: 2px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1px;
  animation: wave 1.5s ease-in-out infinite;
}

.audio-wave span:nth-child(2) {
  animation-delay: 0.1s;
}

.audio-wave span:nth-child(3) {
  animation-delay: 0.2s;
}

.audio-wave span:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes wave {
  0%, 100% {
    height: 4px;
  }
  50% {
    height: 12px;
  }
}

.audio-details {
  flex: 1;
  min-width: 0;
}

.audio-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
  line-height: 1.4;
}

.audio-duration {
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
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.upload-fab:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(79, 172, 254, 0.4);
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
  
  .audio-info {
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