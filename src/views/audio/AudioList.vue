<template>
  <div class="audio-list">
    <div class="page-header">
      <h1 class="page-title">音频列表</h1>
      <el-button type="primary" @click="$router.push('/audio/upload')">
        <el-icon><Plus /></el-icon>
        上传音频
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
    
    <!-- 音频列表 -->
    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="audioList"
        stripe
        style="width: 100%"
      >
        <el-table-column label="图标" width="80">
          <template #default>
            <div class="audio-icon">
              <el-icon class="icon"><Headphone /></el-icon>
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
            <el-button type="primary" size="small" @click="handlePlay(row)">
              播放
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
    
    <!-- 播放对话框 -->
    <el-dialog
      v-model="playDialogVisible"
      title="音频播放"
      width="60%"
      align-center
    >
      <div v-if="currentAudio" class="play-content">
        <div class="audio-info">
          <div class="audio-cover">
            <el-icon class="cover-icon"><Headphone /></el-icon>
          </div>
          <div class="audio-details">
            <h3>{{ currentAudio.name }}</h3>
            <p>文件大小: {{ formatFileSize(currentAudio.size) }}</p>
            <p>格式: {{ currentAudio.format.toUpperCase() }}</p>
            <p v-if="currentAudio.duration">时长: {{ formatDuration(currentAudio.duration) }}</p>
            <p>上传时间: {{ formatDate(currentAudio.createdAt) }}</p>
          </div>
        </div>
        
        <div class="audio-player">
          <audio
            ref="audioPlayerRef"
            :src="currentAudio.url"
            controls
            style="width: 100%;"
            @loadedmetadata="onAudioLoaded"
            @timeupdate="onTimeUpdate"
            @ended="onAudioEnded"
          >
            您的浏览器不支持音频播放
          </audio>
        </div>
        
        <div class="player-info">
          <div class="time-info">
            <span>{{ formatTime(currentTime) }} / {{ formatTime(audioDuration) }}</span>
          </div>
          <div class="player-controls">
            <el-button
              :icon="isPlaying ? 'VideoPause' : 'VideoPlay'"
              @click="togglePlay"
            >
              {{ isPlaying ? '暂停' : '播放' }}
            </el-button>
            <el-button @click="stopPlay">停止</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Headphone } from '@element-plus/icons-vue'
import { getAudioListApi, deleteAudioApi, type MediaFile } from '@/api/media'

const loading = ref(false)
const audioList = ref<MediaFile[]>([])
const playDialogVisible = ref(false)
const currentAudio = ref<MediaFile | null>(null)
const audioPlayerRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(0)

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

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
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

const loadAudioList = async () => {
  loading.value = true
  try {
    const response = await getAudioListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword
    })
    
    audioList.value = response.list
    pagination.total = response.total
  } catch (error) {
    console.error('加载音频列表失败:', error)
    // 模拟数据
    audioList.value = [
      {
        id: 1,
        name: '背景音乐.mp3',
        url: '/mock/audio1.mp3',
        size: 1024 * 1024 * 5,
        duration: 240,
        format: 'mp3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '音效素材.wav',
        url: '/mock/audio2.wav',
        size: 1024 * 1024 * 8,
        duration: 30,
        format: 'wav',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
    pagination.total = 15
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadAudioList()
}

const handleReset = () => {
  searchForm.keyword = ''
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

const handlePlay = (audio: MediaFile) => {
  currentAudio.value = audio
  playDialogVisible.value = true
  isPlaying.value = false
  currentTime.value = 0
  audioDuration.value = 0
}

const handleDownload = (audio: MediaFile) => {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = audio.url
  link.download = audio.name
  link.click()
}

const handleDelete = async (audio: MediaFile) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除音频 "${audio.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        type: 'warning'
      }
    )
    
    await deleteAudioApi(audio.id)
    ElMessage.success('删除成功')
    loadAudioList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const onAudioLoaded = () => {
  if (audioPlayerRef.value) {
    audioDuration.value = audioPlayerRef.value.duration || 0
  }
}

const onTimeUpdate = () => {
  if (audioPlayerRef.value) {
    currentTime.value = audioPlayerRef.value.currentTime || 0
    isPlaying.value = !audioPlayerRef.value.paused
  }
}

const onAudioEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const togglePlay = () => {
  if (audioPlayerRef.value) {
    if (isPlaying.value) {
      audioPlayerRef.value.pause()
    } else {
      audioPlayerRef.value.play()
    }
  }
}

const stopPlay = () => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.pause()
    audioPlayerRef.value.currentTime = 0
    isPlaying.value = false
    currentTime.value = 0
  }
}

onMounted(() => {
  loadAudioList()
})
</script>

<style scoped>
.audio-list {
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

.audio-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.audio-icon .icon {
  font-size: 20px;
  color: white;
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

.play-content {
  text-align: center;
}

.audio-info {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  text-align: left;
}

.audio-cover {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.cover-icon {
  font-size: 48px;
  color: white;
}

.audio-details h3 {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 15px 0;
}

.audio-details p {
  font-size: 14px;
  color: #606266;
  margin: 8px 0;
}

.audio-player {
  margin-bottom: 20px;
}

.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-info {
  font-size: 14px;
  color: #606266;
}

.player-controls {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .audio-info {
    flex-direction: column;
    text-align: center;
  }
  
  .audio-cover {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .player-info {
    flex-direction: column;
    gap: 15px;
  }
}
</style> 