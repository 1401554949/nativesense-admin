<template>
  <div class="dashboard">

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card user-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">{{ $t('dashboard.totalUser') }}</p>
              <h3 class="stat-value">40,689</h3>
              <div class="stat-change positive">
                <el-icon><TrendCharts /></el-icon>
                <span>8.5% {{ $t('dashboard.upFromYesterday') }}</span>
              </div>
            </div>
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card order-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">{{ $t('dashboard.totalOrder') }}</p>
              <h3 class="stat-value">10293</h3>
              <div class="stat-change positive">
                <el-icon><TrendCharts /></el-icon>
                <span>1.3% {{ $t('dashboard.upFromPastWeek') }}</span>
              </div>
            </div>
            <div class="stat-icon order-icon">
              <el-icon><Box /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card sales-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">{{ $t('dashboard.totalSales') }}</p>
              <h3 class="stat-value">$89,000</h3>
              <div class="stat-change negative">
                <el-icon><Bottom /></el-icon>
                <span>4.3% {{ $t('dashboard.downFromYesterday') }}</span>
              </div>
            </div>
            <div class="stat-icon sales-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card pending-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">{{ $t('dashboard.totalPending') }}</p>
              <h3 class="stat-value">2040</h3>
              <div class="stat-change positive">
                <el-icon><TrendCharts /></el-icon>
                <span>1.8% {{ $t('dashboard.upFromYesterday') }}</span>
              </div>
            </div>
            <div class="stat-icon pending-icon">
              <el-icon><Clock /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 销售详情图表 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h3>{{ $t('dashboard.salesDetails') }}</h3>
              <el-select v-model="selectedPeriod" class="period-select" @change="handlePeriodChange">
                <el-option :label="$t('common.october')" value="october" />
                <el-option :label="$t('common.november')" value="november" />
                <el-option :label="$t('common.december')" value="december" />
              </el-select>
            </div>
          </template>
          
          <div class="chart-container">
            <v-chart class="chart" :option="chartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 视频和音频列表 -->
    <el-row :gutter="20" class="media-section">
      <!-- 最近视频 -->
      <el-col :xs="24" :lg="12">
        <el-card class="media-card">
          <template #header>
            <div class="card-header">
              <h3>{{ $t('dashboard.recentVideos') }}</h3>
              <el-button type="text" @click="$router.push('/video/list')" class="view-more-btn">
                {{ $t('dashboard.viewMore') }}
              </el-button>
            </div>
          </template>

          <div class="media-list">
            <div v-for="video in recentVideos" :key="video.id" class="media-item">
              <div class="media-thumbnail">
                <el-image 
                  :src="video.thumbnail" 
                  fit="cover"
                  class="thumbnail-image"
                >
                  <template #error>
                    <div class="default-thumbnail">
                      <el-icon size="24"><VideoPlay /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="duration-badge">{{ video.duration }}</div>
              </div>
              <div class="media-info">
                <h4 class="media-title">{{ video.title }}</h4>
                <p class="media-meta">
                  <span class="file-size">{{ formatFileSize(video.size) }}</span>
                  <span class="upload-time">{{ formatRelativeTime(video.uploadTime) }}</span>
                </p>
                <div class="media-stats">
                  <span class="views">
                    <el-icon><View /></el-icon>
                    {{ video.views }}
                  </span>
                  <span class="status" :class="video.status.toLowerCase()">
                    {{ $t(`dashboard.${video.status.toLowerCase()}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 最近音频 -->
      <el-col :xs="24" :lg="12">
        <el-card class="media-card">
          <template #header>
            <div class="card-header">
              <h3>{{ $t('dashboard.recentAudios') }}</h3>
              <el-button type="text" @click="$router.push('/audio/list')" class="view-more-btn">
                {{ $t('dashboard.viewMore') }}
              </el-button>
            </div>
          </template>

          <div class="media-list">
            <div v-for="audio in recentAudios" :key="audio.id" class="media-item">
              <div class="media-thumbnail audio-thumbnail">
                <div class="audio-icon">
                  <el-icon size="24"><Headset /></el-icon>
                </div>
                <div class="duration-badge">{{ audio.duration }}</div>
              </div>
              <div class="media-info">
                <h4 class="media-title">{{ audio.title }}</h4>
                <p class="media-meta">
                  <span class="file-size">{{ formatFileSize(audio.size) }}</span>
                  <span class="upload-time">{{ formatRelativeTime(audio.uploadTime) }}</span>
                </p>
                <div class="media-stats">
                  <span class="plays">
                    <el-icon><Headset /></el-icon>
                    {{ audio.plays }}
                  </span>
                  <span class="status" :class="audio.status.toLowerCase()">
                    {{ $t(`dashboard.${audio.status.toLowerCase()}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { User, Box, TrendCharts, Clock, Bottom, VideoPlay, Headset, View } from '@element-plus/icons-vue'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const { t } = useI18n()

const selectedPeriod = ref('october')
const selectedMonth = ref('october')

// 处理下拉筛选变化
const handlePeriodChange = (value: string) => {
  selectedPeriod.value = value
  // 这里可以添加更新图表数据的逻辑
  console.log('Period changed to:', value)
}

const handleMonthChange = (value: string) => {
  selectedMonth.value = value
  // 这里可以添加更新表格数据的逻辑
  console.log('Month changed to:', value)
}

// 图表配置
const chartOption = reactive({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderColor: '#e4e7ed',
    borderWidth: 1,
    textStyle: {
      color: '#606266'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#a0aec0',
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#a0aec0',
      fontSize: 12,
      formatter: '{value}%'
    },
    splitLine: {
      lineStyle: {
        color: '#f7fafc',
        type: 'solid'
      }
    }
  },
  series: [
    {
      name: 'Sales',
      type: 'line',
      data: [20, 32, 45, 32, 45, 32, 45, 88, 35, 23, 45, 88, 43, 23, 56, 88, 32, 45, 32, 43, 23, 45, 56, 33],
      smooth: true,
      lineStyle: {
        color: '#4880ff',
        width: 3
      },
      itemStyle: {
        color: '#4880ff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(72, 128, 255, 0.1)' },
            { offset: 1, color: 'rgba(72, 128, 255, 0)' }
          ]
        }
      },
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: false,
      markPoint: {
        data: [
          {
            coord: [21, 88],
            value: '64,3664.77',
            itemStyle: {
              color: '#4880ff'
            }
          }
        ],
        label: {
          show: true,
          position: 'top',
          backgroundColor: '#4880ff',
          color: '#fff',
          padding: [4, 8],
          borderRadius: 4,
          fontSize: 10
        }
      }
    }
  ]
})

// 视频数据
const recentVideos = ref([
  {
    id: 1,
    title: '产品介绍视频 - 2024年度回顾',
    thumbnail: 'https://via.placeholder.com/160x90/4A90E2/FFFFFF?text=Video1',
    duration: '05:32',
    size: 52428800, // 50MB
    uploadTime: new Date(Date.now() - 3600000).toISOString(), // 1小时前
    views: 1240,
    status: 'Published'
  },
  {
    id: 2,
    title: '用户培训教程 - 基础操作指南',
    thumbnail: 'https://via.placeholder.com/160x90/7ED321/FFFFFF?text=Video2',
    duration: '12:45',
    size: 125829120, // 120MB
    uploadTime: new Date(Date.now() - 86400000).toISOString(), // 1天前
    views: 856,
    status: 'Processing'
  },
  {
    id: 3,
    title: '技术分享 - AI智能识别技术解析',
    thumbnail: 'https://via.placeholder.com/160x90/F5A623/FFFFFF?text=Video3',
    duration: '08:15',
    size: 78643200, // 75MB
    uploadTime: new Date(Date.now() - 172800000).toISOString(), // 2天前
    views: 2103,
    status: 'Published'
  }
])

// 音频数据
const recentAudios = ref([
  {
    id: 1,
    title: '背景音乐 - 轻松办公BGM',
    duration: '03:45',
    size: 8947848, // 8.5MB
    uploadTime: new Date(Date.now() - 7200000).toISOString(), // 2小时前
    plays: 456,
    status: 'Published'
  },
  {
    id: 2,
    title: '语音提示 - 系统操作音效包',
    duration: '01:20',
    size: 3145728, // 3MB
    uploadTime: new Date(Date.now() - 129600000).toISOString(), // 1.5天前
    plays: 789,
    status: 'Processing'
  },
  {
    id: 3,
    title: '播客节目 - 科技前沿讨论',
    duration: '25:30',
    size: 60817408, // 58MB
    uploadTime: new Date(Date.now() - 259200000).toISOString(), // 3天前
    plays: 1234,
    status: 'Published'
  }
])

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds}秒前`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`
  return `${Math.floor(diffInSeconds / 2592000)}月前`
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 30px 0;
}

.stats-cards {
  margin-bottom: 30px;
}

.stat-card {
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #a0aec0;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #48bb78;
}

.stat-change.negative {
  color: #f56565;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.order-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.sales-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.pending-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.chart-section {
  margin-bottom: 30px;
}

.media-section {
  margin-bottom: 30px;
}

.chart-card,
.media-card {
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.period-select {
  width: 120px;
}

.view-more-btn {
  color: #4880ff;
  font-size: 14px;
  padding: 0;
}

.media-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.media-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.media-item:hover {
  background: #f1f3f4;
  transform: translateY(-1px);
}

.media-thumbnail {
  position: relative;
  width: 80px;
  height: 45px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.default-thumbnail {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 6px;
}

.audio-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-icon {
  color: white;
}

.duration-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
}

.media-info {
  flex: 1;
  min-width: 0;
}

.media-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-meta {
  font-size: 12px;
  color: #718096;
  margin: 0 0 8px 0;
  display: flex;
  gap: 12px;
}

.media-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.views,
.plays {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #718096;
}

.status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status.published {
  background: #c6f6d5;
  color: #22543d;
}

.status.processing {
  background: #fed7d7;
  color: #742a2a;
}

.status.draft {
  background: #e2e8f0;
  color: #4a5568;
}

.chart-container {
  height: 300px;
}

.chart {
  height: 100%;
  width: 100%;
}



:deep(.el-card__header) {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #f7fafc;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #a0aec0;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.el-table td) {
  padding: 12px 0;
  color: #2d3748;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .stats-cards .el-col {
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .period-select {
    width: 100%;
  }
  
  .media-section .el-col {
    margin-bottom: 20px;
  }
  
  .media-item {
    padding: 12px;
  }
  
  .media-thumbnail {
    width: 60px;
    height: 34px;
  }
  
  .audio-thumbnail {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 10px;
  }
  
  .stats-cards,
  .chart-section,
  .table-section {
    margin-bottom: 20px;
  }
  
  :deep(.el-card__body) {
    padding: 15px;
  }
  
  .stat-content {
    padding: 0;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .media-list {
    gap: 12px;
  }
  
  .media-item {
    padding: 8px;
  }
  
  .media-thumbnail {
    width: 50px;
    height: 28px;
  }
  
  .audio-thumbnail {
    width: 40px;
    height: 40px;
  }
  
  .media-title {
    font-size: 12px;
    -webkit-line-clamp: 1;
  }
}
</style>
