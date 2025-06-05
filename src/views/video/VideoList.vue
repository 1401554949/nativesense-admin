<template>
  <div class="video-list">
    <div class="page-header">
      <h1 class="page-title">视频列表</h1>
      <el-button type="primary" @click="$router.push('/video/upload')">
        <el-icon><Plus /></el-icon>
        上传视频
      </el-button>
    </div>
    
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="文件名">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入文件名"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 视频列表 -->
    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="videoList"
        stripe
        style="width: 100%"
      >
        <el-table-column label="缩略图" width="120">
          <template #default="{ row }">
            <div class="video-thumbnail">
              <img v-if="row.thumbnail" :src="row.thumbnail" alt="缩略图">
              <el-icon v-else class="default-thumbnail"><VideoPlay /></el-icon>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="文件名" min-width="200">
          <template #default="{ row }">
            <div class="file-info">
              <p class="file-name">{{ row.name }}</p>
              <p class="file-format">{{ row.format.toUpperCase() }}</p>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        
        <el-table-column label="时长" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="上传时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handlePreview(row)">
              预览
            </el-button>
            <el-button type="success" size="small" @click="handleDownload(row)">
              下载
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
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
          <h3>{{ previewVideo.name }}</h3>
          <p>文件大小: {{ formatFileSize(previewVideo.size) }}</p>
          <p>格式: {{ previewVideo.format.toUpperCase() }}</p>
          <p v-if="previewVideo.duration">时长: {{ formatDuration(previewVideo.duration) }}</p>
          <p>上传时间: {{ formatDate(previewVideo.createdAt) }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, VideoPlay } from '@element-plus/icons-vue'
import { getVideoListApi, deleteVideoApi, type MediaFile } from '@/api/media'

const loading = ref(false)
const videoList = ref<MediaFile[]>([])
const previewDialogVisible = ref(false)
const previewVideo = ref<MediaFile | null>(null)

const searchForm = reactive({
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

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

const loadVideoList = async () => {
  loading.value = true
  try {
    const response = await getVideoListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword
    })
    
    videoList.value = response.list
    pagination.total = response.total
  } catch (error) {
    console.error('加载视频列表失败:', error)
    // 模拟数据
    videoList.value = [
      {
        id: 1,
        name: '产品介绍视频.mp4',
        url: '/mock/video1.mp4',
        size: 1024 * 1024 * 50,
        duration: 180,
        format: 'mp4',
        thumbnail: '/mock/thumbnail1.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '培训视频.mp4',
        url: '/mock/video2.mp4',
        size: 1024 * 1024 * 120,
        duration: 600,
        format: 'mp4',
        thumbnail: '',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
    pagination.total = 25
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadVideoList()
}

const handleReset = () => {
  searchForm.keyword = ''
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

const handlePreview = (video: MediaFile) => {
  previewVideo.value = video
  previewDialogVisible.value = true
}

const handleDownload = (video: MediaFile) => {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = video.url
  link.download = video.name
  link.click()
}

const handleDelete = async (video: MediaFile) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除视频 "${video.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        type: 'warning'
      }
    )
    
    await deleteVideoApi(video.id)
    ElMessage.success('删除成功')
    loadVideoList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

onMounted(() => {
  loadVideoList()
})
</script>

<style scoped>
.video-list {
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

.search-card {
  margin-bottom: 20px;
}

.list-card {
  margin-bottom: 20px;
}

.video-thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-thumbnail {
  font-size: 24px;
  color: #909399;
}

.file-info .file-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.file-info .file-format {
  font-size: 12px;
  color: #909399;
  margin: 0;
  background-color: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.preview-content {
  text-align: center;
}

.preview-info {
  margin-top: 20px;
  text-align: left;
}

.preview-info h3 {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 10px 0;
}

.preview-info p {
  font-size: 14px;
  color: #606266;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .video-thumbnail {
    width: 60px;
    height: 45px;
  }
}
</style> 