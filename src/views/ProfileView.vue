<template>
  <div class="profile-container">

    <div class="profile-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('profile.basicInfo') }}</h2>
          </div>
        </template>
        
        <div class="basic-info-section">
          <div class="avatar-section">
            <div class="avatar-upload">
              <el-upload
                :show-file-list="false"
                :on-change="handleAvatarChange"
                :before-upload="beforeAvatarUpload"
                accept="image/*"
                :auto-upload="false"
              >
                <div class="avatar-container">
                  <el-avatar 
                    :size="120" 
                    :src="userInfo.avatar" 
                    class="user-avatar"
                  >
                    <img src="https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=MR" alt="Avatar" />
                  </el-avatar>
                  <div class="avatar-overlay">
                    <el-icon size="24"><Camera /></el-icon>
                    <span>{{ $t('profile.uploadAvatar') }}</span>
                  </div>
                </div>
              </el-upload>
            </div>
          </div>

          <div class="info-form">
            <el-form :model="userForm" :rules="formRules" ref="userFormRef" label-width="120px">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item :label="$t('profile.username')" prop="username">
                    <el-input v-model="userForm.username" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('profile.fullName')" prop="fullName">
                    <el-input v-model="userForm.fullName" />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item :label="$t('profile.email')" prop="email">
                    <el-input v-model="userForm.email" type="email" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('profile.phone')" prop="phone">
                    <el-input v-model="userForm.phone" />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item :label="$t('profile.department')" prop="department">
                    <el-input v-model="userForm.department" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('profile.position')" prop="position">
                    <el-input v-model="userForm.position" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-card>

      <!-- 账户设置卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('profile.accountSettings') }}</h2>
          </div>
        </template>
        
        <div class="account-settings">
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('profile.currentPassword')" prop="currentPassword">
                  <el-input 
                    v-model="passwordForm.currentPassword" 
                    type="password" 
                    show-password
                    :placeholder="$t('profile.currentPassword')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('profile.newPassword')" prop="newPassword">
                  <el-input 
                    v-model="passwordForm.newPassword" 
                    type="password" 
                    show-password
                    :placeholder="$t('profile.newPassword')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('profile.confirmPassword')" prop="confirmPassword">
                  <el-input 
                    v-model="passwordForm.confirmPassword" 
                    type="password" 
                    show-password
                    :placeholder="$t('profile.confirmPassword')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword">
                {{ $t('profile.changePassword') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 偏好设置卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('profile.preferences') }}</h2>
          </div>
        </template>
        
        <div class="preferences-section">
          <el-form :model="preferencesForm" label-width="120px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('profile.language')">
                  <el-select v-model="preferencesForm.language" style="width: 100%">
                    <el-option label="中文" value="zh" />
                    <el-option label="English" value="en" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('profile.timezone')">
                  <el-select v-model="preferencesForm.timezone" style="width: 100%">
                    <el-option label="北京时间 (UTC+8)" value="Asia/Shanghai" />
                    <el-option label="东京时间 (UTC+9)" value="Asia/Tokyo" />
                    <el-option label="纽约时间 (UTC-5)" value="America/New_York" />
                    <el-option label="伦敦时间 (UTC+0)" value="Europe/London" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('profile.emailNotifications')">
                  <el-switch v-model="preferencesForm.emailNotifications" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('profile.systemNotifications')">
                  <el-switch v-model="preferencesForm.systemNotifications" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 统计信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('profile.statistics') }}</h2>
          </div>
        </template>
        
        <div class="statistics-section">
          <el-row :gutter="24">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon video-icon">
                  <el-icon size="24"><VideoPlay /></el-icon>
                </div>
                <div class="stat-content">
                  <h3>{{ statistics.uploadedVideos }}</h3>
                  <p>{{ $t('profile.uploadedVideos') }}</p>
                </div>
              </div>
            </el-col>
            
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon audio-icon">
                  <el-icon size="24"><Headset /></el-icon>
                </div>
                <div class="stat-content">
                  <h3>{{ statistics.uploadedAudios }}</h3>
                  <p>{{ $t('profile.uploadedAudios') }}</p>
                </div>
              </div>
            </el-col>
            
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon size-icon">
                  <el-icon size="24"><FolderOpened /></el-icon>
                </div>
                <div class="stat-content">
                  <h3>{{ formatFileSize(statistics.totalFileSize) }}</h3>
                  <p>{{ $t('profile.totalFileSize') }}</p>
                </div>
              </div>
            </el-col>
            
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon login-icon">
                  <el-icon size="24"><User /></el-icon>
                </div>
                <div class="stat-content">
                  <h3>{{ statistics.loginCount }}</h3>
                  <p>{{ $t('profile.loginCount') }}</p>
                </div>
              </div>
            </el-col>
          </el-row>
          
          <el-divider />
          
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="info-item">
                <span class="info-label">{{ $t('profile.joinDate') }}:</span>
                <span class="info-value">{{ formatDate(userInfo.joinDate) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="info-label">{{ $t('profile.lastLogin') }}:</span>
                <span class="info-value">{{ formatDate(userInfo.lastLogin) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 保存按钮 -->
      <div class="save-section">
        <el-button type="primary" size="large" @click="handleSaveAll">
          {{ $t('profile.saveChanges') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Camera, 
  VideoPlay, 
  Headset, 
  FolderOpened, 
  User 
} from '@element-plus/icons-vue'

const { t, locale } = useI18n()

// 用户信息
const userInfo = reactive({
  avatar: '',
  username: 'admin',
  joinDate: '2023-01-15',
  lastLogin: new Date().toISOString()
})

// 表单数据
const userForm = reactive({
  username: 'admin',
  fullName: '张三',
  email: 'admin@nativesense.com',
  phone: '13800138000',
  department: '技术部',
  position: '系统管理员'
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferencesForm = reactive({
  language: locale.value,
  timezone: 'Asia/Shanghai',
  emailNotifications: true,
  systemNotifications: true
})

// 统计数据
const statistics = reactive({
  uploadedVideos: 23,
  uploadedAudios: 45,
  totalFileSize: 1024 * 1024 * 1024 * 5.2, // 5.2GB
  loginCount: 156
})

// 表单验证规则
const formRules = {
  fullName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const passwordRules = {
  currentPassword: [
    { required: true, message: t('profile.passwordRequired'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('profile.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('profile.passwordLength'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('profile.passwordRequired'), trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error(t('profile.passwordMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 表单引用
const userFormRef = ref()
const passwordFormRef = ref()

// 头像上传
const handleAvatarChange = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.avatar = e.target?.result as string
    ElMessage.success(t('profile.uploadSuccess'))
  }
  reader.readAsDataURL(file.raw)
}

const beforeAvatarUpload = (file: any) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式！')
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB！')
  }
  return isJPGOrPNG && isLt2M
}

// 修改密码
const handleChangePassword = async () => {
  try {
    await passwordFormRef.value?.validate()
    
    await ElMessageBox.confirm(
      '确定要修改密码吗？',
      '确认修改',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重置密码表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    ElMessage.success('密码修改成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('修改密码失败:', error)
    }
  }
}

// 保存所有设置
const handleSaveAll = async () => {
  try {
    await userFormRef.value?.validate()
    
    // 更新语言设置
    if (preferencesForm.language !== locale.value) {
      locale.value = preferencesForm.language
      localStorage.setItem('language', preferencesForm.language)
    }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(t('profile.saveSuccess'))
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(() => {
  // 初始化数据
  console.log('个人资料页面加载完成')
})
</script>

<style scoped>
.profile-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.profile-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.info-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e9ecef;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #495057;
  margin: 0;
}

.basic-info-section {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-upload {
  position: relative;
  cursor: pointer;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.user-avatar {
  border: 4px solid #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 12px;
  text-align: center;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.info-form {
  flex: 1;
}

.account-settings {
  padding: 8px 0;
}

.preferences-section {
  padding: 8px 0;
}

.statistics-section {
  padding: 8px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.video-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.audio-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.size-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.login-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.stat-content p {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.info-item {
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: #4a5568;
}

.info-value {
  color: #2d3748;
}

.save-section {
  text-align: center;
  padding: 20px 0;
}

.save-section .el-button {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
}

/* 表单样式 */
.info-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #4a5568;
}

.info-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-form :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

.info-form :deep(.el-input__wrapper.is-focus) {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.info-form :deep(.el-select .el-input__wrapper) {
  border: 1px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .basic-info-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-section {
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .stat-content h3 {
    font-size: 20px;
  }
  
  .info-item {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .profile-content {
    gap: 16px;
  }
  
  .basic-info-section {
    gap: 20px;
  }
  
  .stat-item {
    padding: 16px;
  }
  
  .user-avatar {
    width: 80px !important;
    height: 80px !important;
  }
}
</style> 