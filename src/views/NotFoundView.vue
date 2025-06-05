<template>
  <div class="not-found">
    <div class="error-content">
      <div class="error-image">
        <el-icon class="error-icon"><Warning /></el-icon>
      </div>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面不存在</h2>
      <p class="error-description">
        抱歉，您访问的页面不存在或已被删除。
      </p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Warning, House, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
}

.error-image {
  margin-bottom: 30px;
}

.error-icon {
  font-size: 120px;
  color: rgba(255, 255, 255, 0.8);
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  margin: 0 0 20px 0;
  line-height: 1;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
}

.error-description {
  font-size: 16px;
  margin: 0 0 40px 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-content {
    padding: 20px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-icon {
    font-size: 80px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 200px;
  }
}
</style> 