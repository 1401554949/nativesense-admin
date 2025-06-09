<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="sidebar-header">
                  <div v-if="!isCollapse" class="logo-section">
            <div class="logo-icon">
              <el-icon size="24"><Grid /></el-icon>
            </div>
            <h2 class="logo-title">NATIVESENSE</h2>
          </div>
        <div v-else class="logo-mini-section">
          <el-icon size="20"><Grid /></el-icon>
        </div>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        class="sidebar-menu"
        background-color="#ffffff"
        text-color="#a0aec0"
        active-text-color="#4880ff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <template #title>{{ $t('menu.dashboard') }}</template>
        </el-menu-item>

        <el-sub-menu index="video">
          <template #title>
            <el-icon><VideoPlay /></el-icon>
            <span>{{ $t('menu.video') }}</span>
          </template>
          <el-menu-item index="/video/list">{{ $t('menu.videoList') }}</el-menu-item>
          <el-menu-item index="/video/upload">{{ $t('menu.videoUpload') }}</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="audio">
          <template #title>
            <el-icon><Headset /></el-icon>
            <span>{{ $t('menu.audio') }}</span>
          </template>
          <el-menu-item index="/audio/list">{{ $t('menu.audioList') }}</el-menu-item>
          <el-menu-item index="/audio/upload">{{ $t('menu.audioUpload') }}</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/products">
          <el-icon><Grid /></el-icon>
          <template #title>{{ $t('menu.products') }}</template>
        </el-menu-item>

        <el-menu-item index="/favorites">
          <el-icon><Star /></el-icon>
          <template #title>{{ $t('menu.favorites') }}</template>
        </el-menu-item>

        <el-menu-item index="/inbox">
          <el-icon><Message /></el-icon>
          <template #title>{{ $t('menu.inbox') }}</template>
        </el-menu-item>

        <el-menu-item index="/order-lists">
          <el-icon><List /></el-icon>
          <template #title>{{ $t('menu.orderLists') }}</template>
        </el-menu-item>

        <el-menu-item index="/product-stock">
          <el-icon><Box /></el-icon>
          <template #title>{{ $t('menu.productStock') }}</template>
        </el-menu-item>

        <div class="menu-divider">
          <div class="menu-section-title">{{ $t('menu.pages') }}</div>
        </div>

        <el-menu-item index="/pricing">
          <el-icon><CreditCard /></el-icon>
          <template #title>{{ $t('menu.pricing') }}</template>
        </el-menu-item>

        <el-menu-item index="/calendar">
          <el-icon><Calendar /></el-icon>
          <template #title>{{ $t('menu.calendar') }}</template>
        </el-menu-item>

        <el-menu-item index="/todo">
          <el-icon><Document /></el-icon>
          <template #title>{{ $t('menu.todo') }}</template>
        </el-menu-item>

        <el-menu-item index="/contact">
          <el-icon><User /></el-icon>
          <template #title>{{ $t('menu.contact') }}</template>
        </el-menu-item>

        <el-menu-item index="/invoice">
          <el-icon><Tickets /></el-icon>
          <template #title>{{ $t('menu.invoice') }}</template>
        </el-menu-item>

        <el-menu-item index="/ui-elements">
          <el-icon><Grid /></el-icon>
          <template #title>{{ $t('menu.uiElements') }}</template>
        </el-menu-item>

        <el-menu-item index="/team">
          <el-icon><UserFilled /></el-icon>
          <template #title>{{ $t('menu.team') }}</template>
        </el-menu-item>

        <el-menu-item index="/table">
          <el-icon><Grid /></el-icon>
          <template #title>{{ $t('menu.table') }}</template>
        </el-menu-item>

        <div class="menu-divider">
          <!-- 设置 -->
        </div>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>{{ $t('menu.settings') }}</template>
        </el-menu-item>

        <el-menu-item index="/logout">
          <el-icon><SwitchButton /></el-icon>
          <template #title>{{ $t('menu.logout') }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <div class="breadcrumb-container">
            <el-breadcrumb separator="/" class="breadcrumb">
              <el-breadcrumb-item 
                v-for="(item, index) in breadcrumbItems" 
                :key="index"
                :to="item.path"
                class="breadcrumb-item"
              >
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>

        <div class="header-right">
          <!-- 通知图标 -->
          <el-badge :value="3" class="notification-badge">
            <el-button type="text" class="header-btn">
              <el-icon size="18"><Bell /></el-icon>
            </el-button>
          </el-badge>

          <!-- 语言选择器 -->
          <el-dropdown class="language-selector" @command="handleLanguageChange">
            <el-button type="text" class="header-btn language-btn">
              <div class="flag-icon">{{ currentLanguage.flag }}</div>
              <span>{{ currentLanguage.name }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="en">🇺🇸 {{ $t('common.english') }}</el-dropdown-item>
                <el-dropdown-item command="zh">🇨🇳 {{ $t('common.chinese') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 用户信息 -->
          <el-dropdown @command="handleUserCommand" class="user-dropdown">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar" class="user-avatar">
                <img src="https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=MR" alt="User" />
              </el-avatar>
              <div class="user-details">
                <span class="username">{{ userStore.userInfo?.username || 'Moni Roy' }}</span>
                <span class="user-role">Admin</span>
              </div>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { 
  House, 
  Grid, 
  CreditCard, 
  User, 
  Star,
  Message,
  List,
  Box,
  Calendar,
  Document,
  Tickets,
  UserFilled,
  Setting,
  SwitchButton,
  Fold, 
  Expand, 
  ArrowDown,
  Bell,
  Search,
  VideoPlay,
  Headset
} from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()
const { locale, t } = useI18n()

const isCollapse = ref(false)
const searchText = ref('')

// 语言相关
const currentLanguage = computed(() => {
  return locale.value === 'en' 
    ? { flag: '🇺🇸', name: t('common.english') }
    : { flag: '🇨🇳', name: t('common.chinese') }
})

const handleLanguageChange = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}

const activeMenu = computed(() => route.path)

// 面包屑导航
const breadcrumbItems = computed(() => {
  const path = route.path
  const items = [
    {
      title: '首页',
      path: '/dashboard'
    }
  ]
  
  if (path.startsWith('/video')) {
    items.push({
      title: '视频管理',
      path: '/video'
    })
    
    if (path === '/video/list') {
      items.push({
        title: '视频列表',
        path: '/video/list'
      })
    } else if (path === '/video/upload') {
      items.push({
        title: '视频上传',
        path: '/video/upload'
      })
    }
  } else if (path.startsWith('/audio')) {
    items.push({
      title: '音频管理',
      path: '/audio'
    })
    
    if (path === '/audio/list') {
      items.push({
        title: '音频列表',
        path: '/audio/list'
      })
    } else if (path === '/audio/upload') {
      items.push({
        title: '音频上传',
        path: '/audio/upload'
      })
    }
  } else if (path === '/order-lists') {
    items.push({
      title: '订单列表',
      path: '/order-lists'
    })
  }
  
  return items
})

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      // 处理个人资料
      break
    case 'settings':
      // 处理设置
      break
    case 'logout':
      userStore.logout()
      break
  }
}

// 监听路由变化，自动获取用户信息
watch(
  () => route.path,
  () => {
    if (userStore.isLogin && !userStore.userInfo) {
      userStore.fetchUserInfo()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.layout {
  height: 100vh;
}

.sidebar {
  background-color: #ffffff;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #f7fafc;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4fd1c7 0%, #81e6d9 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-title {
  color: #2d3748;
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.1em;
}

.logo-mini-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4fd1c7 0%, #81e6d9 100%);
  border-radius: 8px;
  color: white;
}

.sidebar-menu {
  border: none;
  padding: 0 16px;
}

.sidebar-menu .el-menu-item {
  height: 44px;
  margin: 4px 0;
  background-color: transparent;
  color: #a0aec0;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.02em;
  border-radius: 8px;
  border: none;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #f7fafc;
  color: #2d3748;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #4880ff !important;
  color: #ffffff !important;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(72, 128, 255, 0.24);
}

.sidebar-menu .el-menu-item .el-icon {
  width: 20px;
  font-size: 16px;
}

.menu-divider {
  padding: 24px 0 8px 0;
  margin: 0 16px;
}

.menu-section-title {
  color: #a0aec0;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.breadcrumb-container {
  display: flex;
  align-items: center;
}

.breadcrumb {
  color: #606266;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133;
  font-weight: 600;
}

.breadcrumb :deep(.el-breadcrumb__item .el-breadcrumb__inner) {
  color: #909399;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb :deep(.el-breadcrumb__item .el-breadcrumb__inner:hover) {
  color: #409eff;
}

.breadcrumb :deep(.el-breadcrumb__separator) {
  color: #c0c4cc;
  margin: 0 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-badge {
  margin-right: 10px;
}

.language-selector {
  margin-right: 10px;
}

.language-btn {
  padding: 0;
  background-color: transparent;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag-icon {
  width: 20px;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-dropdown {
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  color: #606266;
}

.user-role {
  font-size: 12px;
  color: #a0aec0;
}

.main-content {
  background-color: #f8f9fa;
  padding: 20px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .header {
    padding: 0 15px;
  }
  
  .header-left {
    gap: 15px;
  }
  
  .header-search {
    display: none;
  }
  
  .search-input {
    width: 150px;
  }
  
  .user-details {
    display: none;
  }
  
  .notification-badge,
  .language-selector {
    margin-right: 5px;
  }
  
  .main-content {
    padding: 15px;
  }
  
  .sidebar {
    width: 200px !important;
  }
}

@media (max-width: 480px) {
  .layout {
    height: 100vh;
    overflow: hidden;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    width: 200px !important;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
  
  .header {
    padding: 0 10px;
  }
  
  .header-logo {
    display: none;
  }
  
  .header-right {
    gap: 10px;
  }
  
  .language-btn span {
    display: none;
  }
  
  .main-content {
    padding: 10px;
    margin-left: 0 !important;
  }
}
</style>
