<template>
  <div class="video-list">
    <!-- 筛选器 -->
    <div class="filters">
      <div class="search-section">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索视频标题、描述或标签"
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
        </el-select>
        
        <el-select 
          v-model="filters.level" 
          placeholder="等级"
          class="filter-select"
          clearable
        >
          <el-option 
            v-for="level in metadata?.supportedLevels || []" 
            :key="level"
            :label="`等级 ${level}`" 
            :value="level" 
          />
        </el-select>

        <el-select 
          v-model="filters.type" 
          placeholder="类型"
          class="filter-select"
          clearable
        >
          <el-option 
            v-for="type in metadata?.supportedTypes || []" 
            :key="type"
            :label="type" 
            :value="type" 
          />
        </el-select>

        <el-select 
          v-model="filters.category" 
          placeholder="分类"
          class="filter-select"
          clearable
        >
          <el-option 
            v-for="category in metadata?.supportedCategories || []" 
            :key="category"
            :label="category" 
            :value="category" 
          />
        </el-select>

        <el-select 
          v-model="filters.difficulty" 
          placeholder="难度"
          class="filter-select"
          clearable
        >
          <el-option label="简单" value="easy" />
          <el-option label="中等" value="medium" />
          <el-option label="困难" value="hard" />
        </el-select>
      </div>
    </div>
    
    <!-- 统计信息 -->
    <div v-if="stats" class="stats-section">
      <el-card>
        <div class="stats-content">
          <div class="stat-item">
            <span class="stat-label">视频总数</span>
            <span class="stat-value">{{ stats.totalCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总时长</span>
            <span class="stat-value">{{ formatDuration(stats.totalDuration) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均时长</span>
            <span class="stat-value">{{ formatDuration(stats.avgDuration) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总观看次数</span>
            <span class="stat-value">{{ stats.viewStats.totalViews }}</span>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 视频列表 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="videoList"
        style="width: 100%"
        class="video-table"
      >
        <el-table-column label="编号" width="80">
          <template #default="{ row }">
            <span class="table-id">#{{ row.id }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="视频信息" min-width="280">
          <template #default="{ row }">
            <div class="video-info">
              <div class="video-thumbnail">
                <img v-if="row.thumbnail || row.cover" :src="row.thumbnail || row.cover" alt="缩略图">
                <el-icon v-else class="default-thumbnail"><VideoPlay /></el-icon>
              </div>
              <div class="video-details">
                <p class="video-title">{{ row.title }}</p>
                <p class="video-meta">{{ row.format.toUpperCase() }} • {{ formatFileSize(row.size) }}</p>
                <div class="video-tags">
                  <el-tag 
                    v-for="tag in row.tags.slice(0, 3)" 
                    :key="tag" 
                    size="small" 
                    type="info"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-tag v-if="row.tags.length > 3" size="small" type="info">
                    +{{ row.tags.length - 3 }}
                  </el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="等级" width="80">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            {{ row.type }}
          </template>
        </el-table-column>
        
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            {{ row.category }}
          </template>
        </el-table-column>
        
        <el-table-column label="难度" width="80">
          <template #default="{ row }">
            <el-tag 
              :type="getDifficultyType(row.difficulty)"
              size="small"
            >
              {{ getDifficultyLabel(row.difficulty) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="时长" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        
        <el-table-column label="观看次数" width="100">
          <template #default="{ row }">
            {{ row.viewCount || 0 }}
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getStatusType(row.status)" 
              class="status-tag"
            >
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="上传日期" width="120">
          <template #default="{ row }">
            {{ formatDateShort(row.createdAt) }}
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
                预览
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
      <div class="upload-fab-tooltip">上传视频</div>
    </div>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      title="上传视频"
      width="700px"
      @close="resetUploadForm"
    >
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="uploadForm.title" placeholder="请输入视频标题" />
        </el-form-item>
        
        <el-form-item label="视频描述" prop="description">
          <el-input 
            v-model="uploadForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入视频描述"
          />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="等级" prop="level">
              <el-select v-model="uploadForm.level" style="width: 100%">
                <el-option 
                  v-for="level in metadata?.supportedLevels || [1, 2, 3]" 
                  :key="level"
                  :label="`等级 ${level}`" 
                  :value="level" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="type">
              <el-select v-model="uploadForm.type" style="width: 100%">
                <el-option 
                  v-for="type in metadata?.supportedTypes || ['education', 'entertainment']" 
                  :key="type"
                  :label="type" 
                  :value="type" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="uploadForm.difficulty" style="width: 100%">
                <el-option label="简单" value="easy" />
                <el-option label="中等" value="medium" />
                <el-option label="困难" value="hard" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="uploadForm.category" style="width: 100%">
                <el-option 
                  v-for="category in metadata?.supportedCategories || ['general']" 
                  :key="category"
                  :label="category" 
                  :value="category" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上架状态" prop="status">
              <el-select v-model="uploadForm.status" style="width: 100%">
                <el-option label="已上架" value="published" />
                <el-option label="已下架" value="draft" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="uploadForm.tags"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in ['教育', '娱乐', '新手', '进阶', '专业']"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="视频文件" prop="file" class="file-upload-item">
          <div class="upload-container">
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
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 MP4、AVI、MOV 等格式，文件大小不超过 100MB
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
      title="视频预览"
      width="80%"
      align-center
    >
      <div v-if="previewVideo" class="preview-content">
        <video
          :src="previewVideo.url"
          controls
          style="width: 100%; max-height: 500px;"
        >
          您的浏览器不支持视频播放
        </video>
        <div class="preview-info">
          <h3>{{ previewVideo.title }}</h3>
          <p><strong>描述:</strong> {{ previewVideo.description }}</p>
          <p><strong>文件大小:</strong> {{ formatFileSize(previewVideo.size) }}</p>
          <p><strong>格式:</strong> {{ previewVideo.format.toUpperCase() }}</p>
          <p><strong>时长:</strong> {{ formatDuration(previewVideo.duration) }}</p>
          <p><strong>等级:</strong> {{ previewVideo.level }}</p>
          <p><strong>类型:</strong> {{ previewVideo.type }}</p>
          <p><strong>分类:</strong> {{ previewVideo.category }}</p>
          <p><strong>难度:</strong> {{ getDifficultyLabel(previewVideo.difficulty) }}</p>
          <p><strong>观看次数:</strong> {{ previewVideo.viewCount || 0 }}</p>
          <p><strong>上传时间:</strong> {{ formatDate(previewVideo.createdAt) }}</p>
          <div class="preview-tags">
            <strong>标签:</strong>
            <el-tag 
              v-for="tag in previewVideo.tags" 
              :key="tag" 
              type="info" 
              style="margin-left: 8px;"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑视频"
      width="700px"
      @close="resetEditForm"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入视频标题" />
        </el-form-item>
        
        <el-form-item label="视频描述" prop="description">
          <el-input 
            v-model="editForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入视频描述"
          />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="等级" prop="level">
              <el-select v-model="editForm.level" style="width: 100%">
                <el-option 
                  v-for="level in metadata?.supportedLevels || [1, 2, 3]" 
                  :key="level"
                  :label="`等级 ${level}`" 
                  :value="level" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="type">
              <el-select v-model="editForm.type" style="width: 100%">
                <el-option 
                  v-for="type in metadata?.supportedTypes || ['education', 'entertainment']" 
                  :key="type"
                  :label="type" 
                  :value="type" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="editForm.difficulty" style="width: 100%">
                <el-option label="简单" value="easy" />
                <el-option label="中等" value="medium" />
                <el-option label="困难" value="hard" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="editForm.category" style="width: 100%">
                <el-option 
                  v-for="category in metadata?.supportedCategories || ['general']" 
                  :key="category"
                  :label="category" 
                  :value="category" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上架状态" prop="status">
              <el-select v-model="editForm.status" style="width: 100%">
                <el-option label="已上架" value="published" />
                <el-option label="已下架" value="draft" />
                <el-option label="处理中" value="processing" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="editForm.tags"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in ['教育', '娱乐', '新手', '进阶', '专业']"
              :key="tag"
              :label="tag"
              :value="tag"
            />
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
import { Search, VideoPlay, Plus, UploadFilled } from '@element-plus/icons-vue'
import { 
  getVideoListApi, 
  uploadVideoApi, 
  editVideoApi, 
  deleteVideoApi, 
  downloadVideoApi,
  getVideoMetadataApi,
  getVideoStatsApi,
  type MediaFile,
  type UploadParams,
  type EditParams,
  type MediaFilter,
  type MediaMetadata,
  type MediaStats
} from '@/api/media'

// 使用MediaFile类型
type VideoFile = MediaFile

const loading = ref(false)
const videoList = ref<VideoFile[]>([])
const previewDialogVisible = ref(false)
const previewVideo = ref<VideoFile | null>(null)
const showUploadDialog = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const editDialogVisible = ref(false)
const editLoading = ref(false)
const metadata = ref<MediaMetadata | null>(null)
const stats = ref<MediaStats | null>(null)

const searchForm = reactive({
  keyword: ''
})

const filters = reactive({
  status: '',
  level: null as number | null,
  type: '',
  category: '',
  difficulty: ''
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
  status: 'published' as 'published' | 'draft',
  level: 1,
  type: 'education',
  category: 'general',
  difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  tags: [] as string[],
  file: null as File | null
})

const uploadRules = {
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择等级', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ]
}

// 编辑表单
const editForm = reactive({
  id: '',
  title: '',
  description: '',
  status: 'published' as 'published' | 'draft' | 'processing',
  level: 1,
  type: 'education',
  category: 'general',
  difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  tags: [] as string[]
})

const editRules = {
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' }
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

const formatDuration = (duration: number): string => {
  if (!duration) return '-'
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
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

const getDifficultyType = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return 'success'
    case 'medium': return 'warning'
    case 'hard': return 'danger'
    default: return 'info'
  }
}

const getDifficultyLabel = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return '简单'
    case 'medium': return '中等'
    case 'hard': return '困难'
    default: return difficulty
  }
}

const buildFilter = (): MediaFilter => {
  const filter: MediaFilter = {}
  
  if (filters.status) filter.status = [filters.status]
  if (filters.level) filter.levels = [filters.level]
  if (filters.type) filter.types = [filters.type]
  if (filters.category) filter.categories = [filters.category]
  if (filters.difficulty) filter.difficulties = [filters.difficulty]
  if (searchForm.keyword) filter.searchQuery = searchForm.keyword
  
  return filter
}

const loadVideoList = async () => {
  loading.value = true
  try {
    const response = await getVideoListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword,
      filter: buildFilter()
    })
    
    videoList.value = response.list
    pagination.total = response.total
  } catch (error) {
    console.error('加载视频列表失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const loadMetadata = async () => {
  try {
    metadata.value = await getVideoMetadataApi()
  } catch (error) {
    console.error('加载元数据失败:', error)
  }
}

const loadStats = async () => {
  try {
    stats.value = await getVideoStatsApi()
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadVideoList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadVideoList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadVideoList()
}

const handlePreview = (video: VideoFile) => {
  previewVideo.value = video
  previewDialogVisible.value = true
}

const handleEdit = (video: VideoFile) => {
  editForm.id = video.id
  editForm.title = video.title
  editForm.description = video.description
  editForm.status = video.status
  editForm.level = video.level
  editForm.type = video.type
  editForm.category = video.category
  editForm.difficulty = video.difficulty
  editForm.tags = [...video.tags]
  editDialogVisible.value = true
}

const handleDownload = async (video: VideoFile) => {
  try {
    await downloadVideoApi({
      id: video.id,
      name: video.title
    })
    ElMessage.success('开始下载')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  }
}

const handleDelete = async (video: VideoFile) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除视频 "${video.title}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteVideoApi(video.id)
    
    ElMessage.success('删除成功')
    loadVideoList()
    loadStats() // 重新加载统计信息
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
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
  uploadForm.level = 1
  uploadForm.type = 'education'
  uploadForm.category = 'general'
  uploadForm.difficulty = 'easy'
  uploadForm.tags = []
  uploadForm.file = null
  fileList.value = []
  uploadProgress.value = 0
}

const resetEditForm = () => {
  editForm.id = ''
  editForm.title = ''
  editForm.description = ''
  editForm.status = 'published'
  editForm.level = 1
  editForm.type = 'education'
  editForm.category = 'general'
  editForm.difficulty = 'easy'
  editForm.tags = []
}

const handleUpload = async () => {
  try {
    await uploadFormRef.value?.validate()
    
    if (!uploadForm.file) {
      ElMessage.warning('请选择要上传的视频文件')
      return
    }
    
    uploading.value = true
    uploadProgress.value = 0
    
    const uploadParams: UploadParams = {
      title: uploadForm.title,
      description: uploadForm.description,
      status: uploadForm.status,
      level: uploadForm.level,
      type: uploadForm.type,
      category: uploadForm.category,
      difficulty: uploadForm.difficulty,
      tags: uploadForm.tags,
      file: uploadForm.file
    }
    
    await uploadVideoApi(uploadParams, (progress) => {
      uploadProgress.value = progress
    })
    
    showUploadDialog.value = false
    uploadProgress.value = 0
    ElMessage.success('上传成功')
    resetUploadForm()
    loadVideoList()
    loadStats() // 重新加载统计信息
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
  }
}

const handleSaveEdit = async () => {
  try {
    await editFormRef.value?.validate()
    
    editLoading.value = true
    
    const editParams: EditParams = {
      id: editForm.id,
      title: editForm.title,
      description: editForm.description,
      status: editForm.status,
      level: editForm.level,
      type: editForm.type,
      category: editForm.category,
      difficulty: editForm.difficulty,
      tags: editForm.tags
    }
    
    await editVideoApi(editParams)
    
    editDialogVisible.value = false
    ElMessage.success('保存成功')
    resetEditForm()
    loadVideoList() // 重新加载列表获取最新数据
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    editLoading.value = false
  }
}

onMounted(() => {
  loadVideoList()
  loadMetadata()
  loadStats()
})
</script>

<style scoped>
.video-list {
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
  flex-wrap: wrap;
}

.search-section {
  flex: 1;
  max-width: 400px;
  min-width: 300px;
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
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  min-width: 120px;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

/* 统计信息样式 */
.stats-section {
  margin-bottom: 24px;
}

.stats-content {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* 表格容器 */
.table-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.video-table {
  border-radius: 8px;
}

.video-table :deep(.el-table__header) {
  background-color: #fafbfc;
}

.video-table :deep(.el-table__header th) {
  background-color: #fafbfc;
  border-bottom: 1px solid #e1e5e9;
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.video-table :deep(.el-table__body td) {
  border-bottom: 1px solid #f5f5f5;
  padding: 16px 12px;
}

.table-id {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
}

.video-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.video-thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-thumbnail {
  font-size: 24px;
  color: #bbb;
}

.video-details {
  flex: 1;
  min-width: 0;
}

.video-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.4;
}

.video-meta {
  color: #6b7280;
  font-size: 12px;
  margin: 0 0 8px 0;
}

.video-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.video-tags .el-tag {
  font-size: 10px;
  height: 20px;
  line-height: 18px;
}

.status-tag {
  font-size: 11px;
  padding: 2px 8px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  padding: 6px 12px;
  font-size: 12px;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

/* 上传悬浮按钮 */
.upload-fab-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1000;
}

.upload-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.upload-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.upload-fab-tooltip {
  position: absolute;
  top: 50%;
  right: 64px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.upload-fab-container:hover .upload-fab-tooltip {
  opacity: 1;
}

/* 上传容器 */
.upload-container {
  width: 100%;
}

.upload-demo {
  width: 100%;
}

.upload-demo :deep(.el-upload-dragger) {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  width: 100%;
  height: 180px;
  transition: border-color 0.3s ease;
}

.upload-demo :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
}

/* 预览内容 */
.preview-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.preview-info h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.preview-info p {
  margin: 8px 0;
  color: #4b5563;
  line-height: 1.5;
}

.preview-tags {
  margin-top: 12px;
}

.preview-tags strong {
  color: #374151;
}

/* 文件上传项 */
.file-upload-item {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-section {
    max-width: none;
  }
  
  .filter-section {
    justify-content: space-between;
  }
  
  .filter-select {
    flex: 1;
    min-width: 100px;
  }
  
  .stats-content {
    justify-content: space-around;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .upload-fab-container {
    bottom: 20px;
    right: 20px;
  }
}
</style> 