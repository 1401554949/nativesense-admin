<template>
  <div class="dashboard">
    <h1 class="page-title">仪表盘</h1>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon video-icon">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats.videoCount }}</h3>
              <p>视频总数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon audio-icon">
              <el-icon><Headphone /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats.audioCount }}</h3>
              <p>音频总数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon storage-icon">
              <el-icon><FolderOpened /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ formatFileSize(stats.totalSize) }}</h3>
              <p>存储空间</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats.userCount }}</h3>
              <p>用户总数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近上传 -->
    <el-row :gutter="20" class="recent-uploads">
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近上传的视频</span>
              <el-button type="text" @click="$router.push('/video/list')">
                查看更多
              </el-button>
            </div>
          </template>
          
          <div v-if="recentVideos.length === 0" class="empty-state">
            <el-empty description="暂无视频" />
          </div>
          
          <div v-else class="media-list">
            <div
              v-for="video in recentVideos"
              :key="video.id"
              class="media-item"
            >
              <div class="media-thumbnail">
                <img v-if="video.thumbnail" :src="video.thumbnail" alt="">
                <el-icon v-else class="default-icon"><VideoPlay /></el-icon>
              </div>
              <div class="media-info">
                <h4>{{ video.name }}</h4>
                <p>{{ formatFileSize(video.size) }} • {{ formatDate(video.createdAt) }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近上传的音频</span>
              <el-button type="text" @click="$router.push('/audio/list')">
                查看更多
              </el-button>
            </div>
          </template>
          
          <div v-if="recentAudios.length === 0" class="empty-state">
            <el-empty description="暂无音频" />
          </div>
          
          <div v-else class="media-list">
            <div
              v-for="audio in recentAudios"
              :key="audio.id"
              class="media-item"
            >
              <div class="media-thumbnail">
                <el-icon class="default-icon"><Headphone /></el-icon>
              </div>
              <div class="media-info">
                <h4>{{ audio.name }}</h4>
                <p>{{ formatFileSize(audio.size) }} • {{ formatDate(audio.createdAt) }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VideoPlay, Headphone, FolderOpened, User } from '@element-plus/icons-vue'
import type { MediaFile } from '@/api/media'

interface DashboardStats {
  videoCount: number
  audioCount: number
  totalSize: number
  userCount: number
}

const stats = ref<DashboardStats>({
  videoCount: 0,
  audioCount: 0,
  totalSize: 0,
  userCount: 0
})

const recentVideos = ref<MediaFile[]>([])
const recentAudios = ref<MediaFile[]>([])

const formatFileSize = (size: number): string => {
  if (size === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

const loadDashboardData = async () => {
  try {
    // 这里应该调用真实的API接口
    // 模拟数据
    stats.value = {
      videoCount: 156,
      audioCount: 89,
      totalSize: 1024 * 1024 * 1024 * 2.5, // 2.5GB
      userCount: 23
    }
    
    // 模拟最近上传的文件
    recentVideos.value = [
      {
        id: 1,
        name: '产品介绍视频.mp4',
        url: '',
        size: 1024 * 1024 * 50,
        format: 'mp4',
        thumbnail: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '培训视频.mp4',
        url: '',
        size: 1024 * 1024 * 120,
        format: 'mp4',
        thumbnail: '',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
    
    recentAudios.value = [
      {
        id: 3,
        name: '背景音乐.mp3',
        url: '',
        size: 1024 * 1024 * 5,
        format: 'mp3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        name: '音效素材.wav',
        url: '',
        size: 1024 * 1024 * 8,
        format: 'wav',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
  color: white;
}

.video-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.audio-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.storage-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.user-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 4px 0;
}

.stat-info p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.recent-uploads {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  padding: 20px 0;
}

.media-list {
  max-height: 300px;
  overflow-y: auto;
}

.media-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.media-item:last-child {
  border-bottom: none;
}

.media-thumbnail {
  width: 50px;
  height: 40px;
  border-radius: 4px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  overflow: hidden;
}

.media-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-icon {
  font-size: 20px;
  color: #909399;
}

.media-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.media-info p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

@media (max-width: 768px) {
  .stats-cards .el-col {
    margin-bottom: 20px;
  }
  
  .recent-uploads .el-col {
    margin-bottom: 20px;
  }
}
</style> 