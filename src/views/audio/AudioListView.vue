<template>
  <div class="audio-list">
    <!-- 筛选器 -->
    <div class="filters">
      <div class="search-section">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      
      <div class="filter-section">
        <el-select 
          v-model="filters.status" 
          placeholder="状态"
          class="filter-select"
          clearable
        >
          <el-option label="已上架" value="published" />
          <el-option label="已下架" value="draft" />
          <el-option label="处理中" value="processing" />
          <el-option label="全部" value="all" />
        </el-select>
        
        <el-select 
          v-model="filters.date" 
          placeholder="日期"
          class="filter-select date-filter"
          clearable
        >
          <el-option label="今天" value="today" />
          <el-option label="本周" value="thisWeek" />
          <el-option label="本月" value="thisMonth" />
          <el-option label="全部" value="all" />
        </el-select>
      </div>
    </div>
    
    <!-- 音频列表 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="audioList"
        style="width: 100%"
        class="audio-table"
      >
        <el-table-column label="编号" width="80">
          <template #default="{ row }">
            <span class="table-id">#{{ row.id }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="音频标题" min-width="250">
          <template #default="{ row }">
            <div class="audio-info">
              <div class="audio-thumbnail">
                <div class="audio-icon">
                  <el-icon><Headset /></el-icon>
                  <div class="audio-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div class="audio-details">
                <p class="audio-name">{{ row.name }}</p>
                <p class="audio-format">{{ row.format.toUpperCase() }} • {{ formatFileSize(row.size) }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="上传日期" width="120">
          <template #default="{ row }">
            {{ formatDateShort(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="时长" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        
        <el-table-column label="格式" width="80">
          <template #default="{ row }">
            {{ row.format.toUpperCase() }}
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag 
              :type="getStatusType(row.status)" 
              class="status-tag"
            >
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="280" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="small"
                @click="handlePreview(row)"
              >
                播放
              </el-button>
              <el-button 
                type="success" 
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button 
                type="warning" 
                size="small"
                @click="handleDownload(row)"
              >
                下载
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
      
    <!-- 分页 -->
    <div class="pagination-container">
      <div class="pagination-info">
        显示 {{ pagination.pageSize }} 条，共 {{ pagination.total }} 条
      </div>
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        small
      />
    </div>

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
      <div class="upload-fab-tooltip">上传音频</div>
    </div>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      title="上传音频"
      width="600px"
      @close="resetUploadForm"
    >
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
        <el-form-item label="音频标题" prop="title">
          <el-input v-model="uploadForm.title" placeholder="请输入音频标题" />
        </el-form-item>
        
        <el-form-item label="音频描述" prop="description">
          <el-input 
            v-model="uploadForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入音频描述"
          />
        </el-form-item>

        <el-form-item label="上架状态" prop="status">
          <el-select v-model="uploadForm.status" style="width: 100%">
            <el-option label="已上架" value="published" />
            <el-option label="已下架" value="draft" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="音频文件" prop="file" class="file-upload-item">
          <div class="upload-container">
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
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 MP3、WAV、FLAC 等格式，文件大小不超过 50MB
                </div>
              </template>
            </el-upload>
            
            <!-- 上传进度 -->
            <el-progress 
              v-if="uploadProgress > 0 && uploadProgress < 100"
              :percentage="uploadProgress" 
              :stroke-width="8"
              status="success"
            />
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadDialog = false">取消</el-button>
          <el-button type="primary" @click="handleUpload" :loading="uploading">
            上传
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="音频预览"
      width="60%"
      align-center
    >
      <div v-if="previewAudio" class="preview-content">
        <audio
          :src="previewAudio.url"
          controls
          style="width: 100%;"
        >
          您的浏览器不支持音频播放
        </audio>
        <div class="preview-info">
          <h3>{{ previewAudio.name }}</h3>
          <p>文件大小: {{ formatFileSize(previewAudio.size) }}</p>
          <p>格式: {{ previewAudio.format.toUpperCase() }}</p>
          <p v-if="previewAudio.duration">时长: {{ formatDuration(previewAudio.duration) }}</p>
          <p v-if="previewAudio.description">描述: {{ previewAudio.description }}</p>
          <p>上传时间: {{ formatDate(previewAudio.createdAt) }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑音频"
      width="600px"
      @close="resetEditForm"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="音频标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入音频标题" />
        </el-form-item>
        
        <el-form-item label="音频描述" prop="description">
          <el-input 
            v-model="editForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入音频描述"
          />
        </el-form-item>

        <el-form-item label="上架状态" prop="status">
          <el-select v-model="editForm.status" style="width: 100%">
            <el-option label="已上架" value="published" />
            <el-option label="已下架" value="draft" />
            <el-option label="处理中" value="processing" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveEdit" :loading="editLoading">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Headset, Plus, UploadFilled } from '@element-plus/icons-vue'

interface AudioFile {
  id: number
  name: string
  url: string
  size: number
  duration?: number
  format: string
  status: string
  description: string
  createdAt: string
  updatedAt: string
}

const loading = ref(false)
const audioList = ref<AudioFile[]>([])
const previewDialogVisible = ref(false)
const previewAudio = ref<AudioFile | null>(null)
const showUploadDialog = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const editDialogVisible = ref(false)
const editLoading = ref(false)

const searchForm = reactive({
  keyword: ''
})

const filters = reactive({
  status: '',
  date: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 上传表单
const uploadForm = reactive({
  title: '',
  description: '',
  status: 'published',
  file: null
})

const uploadRules = {
  title: [
    { required: true, message: '请输入音频标题', trigger: 'blur' }
  ]
}

// 编辑表单
const editForm = reactive({
  id: 0,
  title: '',
  description: '',
  status: 'published'
})

const editRules = {
  title: [
    { required: true, message: '请输入音频标题', trigger: 'blur' }
  ]
}

const fileList = ref([])
const uploadFormRef = ref()
const editFormRef = ref()

const formatFileSize = (size: number): string => {
  if (size === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDuration = (duration?: number): string => {
  if (!duration) return '-'
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
}

const getStatusType = (status: string): string => {
  switch (status) {
    case 'published': return 'success'
    case 'processing': return 'warning'
    case 'draft': return 'info'
    default: return 'warning'
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'published': return '已上架'
    case 'processing': return '处理中'
    case 'draft': return '已下架'
    default: return '待处理'
  }
}

const loadAudioList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    audioList.value = [
      {
        id: 2001,
        name: '办公室轻音乐',
        url: '/mock/audio1.mp3',
        size: 1024 * 1024 * 8,
        duration: 225,
        format: 'mp3',
        status: 'published',
        description: '适合办公环境的轻松背景音乐，能够提升工作效率和心情',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2002,
        name: '系统提示音效包',
        url: '/mock/audio2.wav',
        size: 1024 * 1024 * 3,
        duration: 80,
        format: 'wav',
        status: 'processing',
        description: '包含多种系统提示音效，适用于软件界面交互',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 2003,
        name: '企业宣传语音',
        url: '/mock/audio3.mp3',
        size: 1024 * 1024 * 12,
        duration: 300,
        format: 'mp3',
        status: 'published',
        description: '专业录制的企业宣传配音，适用于公司介绍视频',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 2004,
        name: '科技播客节目',
        url: '/mock/audio4.mp3',
        size: 1024 * 1024 * 45,
        duration: 1530,
        format: 'mp3',
        status: 'draft',
        description: '讨论最新科技趋势的播客节目录音',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 2005,
        name: '冥想放松音乐',
        url: '/mock/audio5.mp3',
        size: 1024 * 1024 * 20,
        duration: 510,
        format: 'mp3',
        status: 'published',
        description: '舒缓的冥想音乐，帮助放松身心和缓解压力',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString()
      }
    ]
    pagination.total = 50
  } catch (error) {
    console.error('加载音频列表失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadAudioList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadAudioList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadAudioList()
}

const handlePreview = (audio: AudioFile) => {
  previewAudio.value = audio
  previewDialogVisible.value = true
}

const handleEdit = (audio: AudioFile) => {
  editForm.id = audio.id
  editForm.title = audio.name
  editForm.description = audio.description
  editForm.status = audio.status
  editDialogVisible.value = true
}

const handleDownload = (audio: AudioFile) => {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = audio.url
  link.download = audio.name
  link.click()
  ElMessage.success('开始下载')
}

const handleDelete = async (audio: AudioFile) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除音频 "${audio.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟删除API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('删除成功')
    loadAudioList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleFileChange = (file: any) => {
  uploadForm.file = file.raw
}

const resetUploadForm = () => {
  uploadForm.title = ''
  uploadForm.description = ''
  uploadForm.status = 'published'
  uploadForm.file = null
  fileList.value = []
  uploadProgress.value = 0
}

const resetEditForm = () => {
  editForm.id = 0
  editForm.title = ''
  editForm.description = ''
  editForm.status = 'published'
}

const handleUpload = async () => {
  try {
    await uploadFormRef.value?.validate()
    
    if (!uploadForm.file) {
      ElMessage.warning('请选择要上传的音频文件')
      return
    }
    
    uploading.value = true
    uploadProgress.value = 0
    
    // 模拟上传进度
    const interval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 30
      }
    }, 200)
    
    // 模拟上传API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    clearInterval(interval)
    uploadProgress.value = 100
    
    setTimeout(() => {
      showUploadDialog.value = false
      uploadProgress.value = 0
      ElMessage.success('上传成功')
      resetUploadForm()
      loadAudioList()
    }, 500)
  } catch (error) {
    console.error('上传失败:', error)
  } finally {
    uploading.value = false
  }
}

const handleSaveEdit = async () => {
  try {
    await editFormRef.value?.validate()
    
    editLoading.value = true
    
    // 模拟编辑API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地数据
    const index = audioList.value.findIndex(item => item.id === editForm.id)
    if (index !== -1) {
      audioList.value[index].name = editForm.title
      audioList.value[index].description = editForm.description
      audioList.value[index].status = editForm.status
      audioList.value[index].updatedAt = new Date().toISOString()
    }
    
    editDialogVisible.value = false
    ElMessage.success('保存成功')
    resetEditForm()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    editLoading.value = false
  }
}

onMounted(() => {
  loadAudioList()
})
</script>

<style scoped>
.audio-list {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

/* 筛选器样式 */
.filters {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 0;
}

.search-section {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.filter-section {
  display: flex;
  gap: 16px;
}

.filter-select {
  min-width: 140px;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.date-filter {
  min-width: 180px;
}

/* 表格容器 */
.table-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.audio-table {
  border-radius: 8px;
}

.audio-table :deep(.el-table__header) {
  background-color: #fafbfc;
}

.audio-table :deep(.el-table__header th) {
  background-color: #fafbfc;
  border-bottom: 1px solid #e1e5e9;
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 16px 12px;
}

.audio-table :deep(.el-table__body tr) {
  border-bottom: 1px solid #f0f0f0;
}

.audio-table :deep(.el-table__body td) {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.audio-table :deep(.el-table__body tr:hover td) {
  background-color: #f9fafb;
}

/* ID 列样式 */
.table-id {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

/* 音频信息样式 */
.audio-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audio-thumbnail {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  position: relative;
}

.audio-icon {
  font-size: 20px;
  z-index: 2;
}

.audio-wave {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1px;
  z-index: 1;
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

.audio-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audio-format {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.2;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.action-buttons .el-button {
  margin: 0;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
}

/* 状态标签样式 */
.status-tag {
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border: none;
}

.status-tag.el-tag--warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-tag.el-tag--success {
  background-color: #d1fae5;
  color: #065f46;
}

.status-tag.el-tag--info {
  background-color: #e0e7ff;
  color: #3730a3;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px 0;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

/* 上传悬浮按钮 */
.upload-fab-container {
  position: fixed;
  bottom: 80px;
  right: 40px;
  z-index: 999;
}

.upload-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.upload-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.upload-fab-tooltip {
  position: absolute;
  top: 50%;
  right: 70px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.upload-fab-container:hover .upload-fab-tooltip {
  opacity: 1;
}

/* 上传对话框样式 */
.file-upload-item {
  grid-column: 1 / -1;
}

.upload-container {
  width: 100%;
}

.upload-demo {
  width: 100%;
}

.upload-demo :deep(.el-upload) {
  width: 100%;
}

.upload-demo :deep(.el-upload-dragger) {
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.upload-demo :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
}

/* 预览对话框样式 */
.preview-content {
  text-align: center;
}

.preview-info {
  margin-top: 20px;
  text-align: left;
}

.preview-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.preview-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 6px 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .audio-list {
    padding: 16px;
  }
  
  .filters {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .audio-info {
    gap: 8px;
  }
  
  .audio-thumbnail {
    width: 40px;
    height: 40px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .upload-fab-container {
    bottom: 20px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .audio-table :deep(.el-table__header th),
  .audio-table :deep(.el-table__body td) {
    padding: 12px 8px;
  }
  
  .audio-name {
    font-size: 13px;
  }
  
  .audio-format {
    font-size: 11px;
  }
}
</style>
