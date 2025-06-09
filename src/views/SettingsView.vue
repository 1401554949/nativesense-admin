<template>
  <div class="settings-container">

    <div class="settings-content">
      <!-- 基本设置卡片 -->
      <el-card class="settings-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('settings.general') }}</h2>
          </div>
        </template>
        
        <div class="settings-section">
          <el-form :model="generalForm" :rules="generalRules" ref="generalFormRef" label-width="150px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.siteName')" prop="siteName">
                  <el-input v-model="generalForm.siteName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.adminEmail')" prop="adminEmail">
                  <el-input v-model="generalForm.adminEmail" type="email" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item :label="$t('settings.siteDescription')" prop="siteDescription">
              <el-input 
                v-model="generalForm.siteDescription" 
                type="textarea" 
                :rows="3"
                placeholder="请输入网站描述"
              />
            </el-form-item>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.timezone')" prop="timezone">
                  <el-select v-model="generalForm.timezone" style="width: 100%">
                    <el-option label="北京时间 (UTC+8)" value="Asia/Shanghai" />
                    <el-option label="东京时间 (UTC+9)" value="Asia/Tokyo" />
                    <el-option label="纽约时间 (UTC-5)" value="America/New_York" />
                    <el-option label="伦敦时间 (UTC+0)" value="Europe/London" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.language')" prop="language">
                  <el-select v-model="generalForm.language" style="width: 100%">
                    <el-option label="中文" value="zh" />
                    <el-option label="English" value="en" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 系统配置卡片 -->
      <el-card class="settings-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('settings.system') }}</h2>
          </div>
        </template>
        
        <div class="settings-section">
          <el-form :model="systemForm" label-width="150px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.maxFileSize')">
                  <el-input-number 
                    v-model="systemForm.maxFileSize" 
                    :min="1" 
                    :max="1024" 
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.sessionTimeout')">
                  <el-input-number 
                    v-model="systemForm.sessionTimeout" 
                    :min="5" 
                    :max="1440" 
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item :label="$t('settings.allowedFormats')">
              <el-select v-model="systemForm.allowedFormats" multiple style="width: 100%">
                <el-option label="MP4" value="mp4" />
                <el-option label="AVI" value="avi" />
                <el-option label="MOV" value="mov" />
                <el-option label="MP3" value="mp3" />
                <el-option label="WAV" value="wav" />
                <el-option label="FLAC" value="flac" />
                <el-option label="JPG" value="jpg" />
                <el-option label="PNG" value="png" />
                <el-option label="PDF" value="pdf" />
              </el-select>
            </el-form-item>
            
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item :label="$t('settings.enableRegistration')">
                  <el-switch v-model="systemForm.enableRegistration" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('settings.maintenanceMode')">
                  <el-switch v-model="systemForm.maintenanceMode" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('settings.cacheEnabled')">
                  <el-switch v-model="systemForm.cacheEnabled" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 通知设置卡片 -->
      <el-card class="settings-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('settings.notifications') }}</h2>
          </div>
        </template>
        
        <div class="settings-section">
          <el-form :model="notificationForm" label-width="150px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.enableNotifications')">
                  <el-switch v-model="notificationForm.enableNotifications" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-divider content-position="left">邮件通知设置</el-divider>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="用户注册通知">
                  <el-switch v-model="notificationForm.userRegistrationNotify" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件上传通知">
                  <el-switch v-model="notificationForm.fileUploadNotify" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="系统错误通知">
                  <el-switch v-model="notificationForm.systemErrorNotify" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="定期报告">
                  <el-switch v-model="notificationForm.weeklyReport" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 邮件设置卡片 -->
      <el-card class="settings-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('settings.emailSettings') }}</h2>
          </div>
        </template>
        
        <div class="settings-section">
          <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef" label-width="150px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.smtpHost')" prop="smtpHost">
                  <el-input v-model="emailForm.smtpHost" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.smtpPort')" prop="smtpPort">
                  <el-input-number v-model="emailForm.smtpPort" :min="1" :max="65535" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.smtpUsername')" prop="smtpUsername">
                  <el-input v-model="emailForm.smtpUsername" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.smtpPassword')" prop="smtpPassword">
                  <el-input v-model="emailForm.smtpPassword" type="password" show-password />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.smtpEncryption')">
                  <el-select v-model="emailForm.smtpEncryption" style="width: 100%">
                    <el-option label="无加密" value="none" />
                    <el-option label="SSL" value="ssl" />
                    <el-option label="TLS" value="tls" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.testEmail')">
                  <div class="test-email-group">
                    <el-input v-model="emailForm.testEmail" placeholder="请输入测试邮箱" />
                    <el-button type="primary" @click="sendTestEmail" :loading="testEmailLoading">
                      {{ $t('settings.sendTestEmail') }}
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 备份与日志卡片 -->
      <el-card class="settings-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('settings.backupSettings') }}</h2>
          </div>
        </template>
        
        <div class="settings-section">
          <el-form :model="backupForm" label-width="150px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.autoBackup')">
                  <el-switch v-model="backupForm.autoBackup" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.backupFrequency')">
                  <el-select v-model="backupForm.backupFrequency" style="width: 100%">
                    <el-option label="每日" value="daily" />
                    <el-option label="每周" value="weekly" />
                    <el-option label="每月" value="monthly" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.retentionDays')">
                  <el-input-number v-model="backupForm.retentionDays" :min="1" :max="365" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.lastBackup')">
                  <el-input v-model="backupForm.lastBackup" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item>
              <el-button type="success" @click="createBackup" :loading="backupLoading">
                {{ $t('settings.createBackup') }}
              </el-button>
            </el-form-item>
            
            <el-divider content-position="left">{{ $t('settings.logSettings') }}</el-divider>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('settings.logLevel')">
                  <el-select v-model="backupForm.logLevel" style="width: 100%">
                    <el-option label="错误" value="error" />
                    <el-option label="警告" value="warning" />
                    <el-option label="信息" value="info" />
                    <el-option label="调试" value="debug" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.logRetention')">
                  <el-input-number v-model="backupForm.logRetention" :min="1" :max="365" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item>
              <el-button type="warning" @click="clearLogs">
                {{ $t('settings.clearLogs') }}
              </el-button>
              <el-button type="info" @click="viewLogs">
                {{ $t('settings.viewLogs') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 保存按钮区域 -->
      <div class="save-section">
        <el-button type="primary" size="large" @click="saveAllSettings" :loading="saveLoading">
          {{ $t('settings.saveSettings') }}
        </el-button>
        <el-button size="large" @click="resetDefaults">
          {{ $t('settings.resetDefaults') }}
        </el-button>
        <el-button type="success" size="large" @click="exportSettings">
          {{ $t('settings.exportSettings') }}
        </el-button>
        <el-upload
          :show-file-list="false"
          :on-change="importSettings"
          :auto-upload="false"
          accept=".json"
          style="display: inline-block; margin-left: 12px;"
        >
          <el-button type="warning" size="large">
            {{ $t('settings.importSettings') }}
          </el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t, locale } = useI18n()

// 加载状态
const saveLoading = ref(false)
const testEmailLoading = ref(false)
const backupLoading = ref(false)

// 基本设置表单
const generalForm = reactive({
  siteName: 'NativeSense Admin',
  siteDescription: '一个现代化的音视频管理系统',
  adminEmail: 'admin@nativesense.com',
  timezone: 'Asia/Shanghai',
  language: locale.value
})

// 系统配置表单
const systemForm = reactive({
  maxFileSize: 100,
  sessionTimeout: 60,
  allowedFormats: ['mp4', 'avi', 'mov', 'mp3', 'wav', 'flac'],
  enableRegistration: true,
  maintenanceMode: false,
  cacheEnabled: true
})

// 通知设置表单
const notificationForm = reactive({
  enableNotifications: true,
  userRegistrationNotify: true,
  fileUploadNotify: false,
  systemErrorNotify: true,
  weeklyReport: true
})

// 邮件设置表单
const emailForm = reactive({
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
  smtpEncryption: 'tls',
  testEmail: ''
})

// 备份设置表单
const backupForm = reactive({
  autoBackup: true,
  backupFrequency: 'daily',
  retentionDays: 30,
  lastBackup: '2024-01-15 10:30:00',
  logLevel: 'info',
  logRetention: 30
})

// 表单验证规则
const generalRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' }
  ],
  adminEmail: [
    { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const emailRules = {
  smtpHost: [
    { required: true, message: '请输入SMTP主机', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  smtpUsername: [
    { required: true, message: '请输入SMTP用户名', trigger: 'blur' }
  ]
}

// 表单引用
const generalFormRef = ref()
const emailFormRef = ref()

// 保存所有设置
const saveAllSettings = async () => {
  try {
    saveLoading.value = true
    
    // 验证表单
    await generalFormRef.value?.validate()
    await emailFormRef.value?.validate()
    
    // 更新语言设置
    if (generalForm.language !== locale.value) {
      locale.value = generalForm.language
      localStorage.setItem('language', generalForm.language)
    }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success(t('settings.settingsSaved'))
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存失败，请检查输入信息')
  } finally {
    saveLoading.value = false
  }
}

// 发送测试邮件
const sendTestEmail = async () => {
  if (!emailForm.testEmail) {
    ElMessage.warning('请输入测试邮箱地址')
    return
  }
  
  try {
    testEmailLoading.value = true
    
    // 模拟发送测试邮件
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    ElMessage.success(t('settings.testEmailSent'))
  } catch (error) {
    console.error('发送测试邮件失败:', error)
    ElMessage.error('发送失败，请检查邮件配置')
  } finally {
    testEmailLoading.value = false
  }
}

// 创建备份
const createBackup = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要立即创建备份吗？此操作可能需要一些时间。',
      '确认备份',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    backupLoading.value = true
    
    // 模拟备份过程
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    backupForm.lastBackup = new Date().toLocaleString('zh-CN')
    ElMessage.success(t('settings.backupCreated'))
  } catch (error) {
    if (error !== 'cancel') {
      console.error('备份失败:', error)
    }
  } finally {
    backupLoading.value = false
  }
}

// 清空日志
const clearLogs = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有系统日志吗？此操作不可恢复。',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟清空日志
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(t('settings.logsCleared'))
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空日志失败:', error)
    }
  }
}

// 查看日志
const viewLogs = () => {
  ElMessage.info('日志查看功能即将推出')
}

// 重置为默认设置
const resetDefaults = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置为默认设置吗？当前所有自定义配置将丢失。',
      '确认重置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 重置表单数据
    Object.assign(generalForm, {
      siteName: 'NativeSense Admin',
      siteDescription: '一个现代化的音视频管理系统',
      adminEmail: 'admin@nativesense.com',
      timezone: 'Asia/Shanghai',
      language: 'zh'
    })
    
    Object.assign(systemForm, {
      maxFileSize: 100,
      sessionTimeout: 60,
      allowedFormats: ['mp4', 'avi', 'mov', 'mp3', 'wav', 'flac'],
      enableRegistration: true,
      maintenanceMode: false,
      cacheEnabled: true
    })
    
    ElMessage.success('已重置为默认设置')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置失败:', error)
    }
  }
}

// 导出设置
const exportSettings = () => {
  const settings = {
    general: generalForm,
    system: systemForm,
    notification: notificationForm,
    email: emailForm,
    backup: backupForm,
    exportTime: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(settings, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `nativesense-settings-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(url)
  ElMessage.success('设置导出成功')
}

// 导入设置
const importSettings = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const settings = JSON.parse(e.target?.result as string)
      
      if (settings.general) Object.assign(generalForm, settings.general)
      if (settings.system) Object.assign(systemForm, settings.system)
      if (settings.notification) Object.assign(notificationForm, settings.notification)
      if (settings.email) Object.assign(emailForm, settings.email)
      if (settings.backup) Object.assign(backupForm, settings.backup)
      
      ElMessage.success('设置导入成功')
    } catch (error) {
      console.error('导入设置失败:', error)
      ElMessage.error('导入失败，文件格式不正确')
    }
  }
  reader.readAsText(file.raw)
}

onMounted(() => {
  // 初始化数据
  console.log('系统设置页面加载完成')
})
</script>

<style scoped>
.settings-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.settings-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.settings-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e9ecef;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #495057;
  margin: 0;
}

.settings-section {
  padding: 8px 0;
}

.test-email-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.test-email-group .el-input {
  flex: 1;
}

.save-section {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #e9ecef;
  margin-top: 24px;
}

.save-section .el-button {
  margin: 0 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
}

/* 表单样式优化 */
.settings-section :deep(.el-form-item__label) {
  font-weight: 500;
  color: #4a5568;
}

.settings-section :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-section :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

.settings-section :deep(.el-input__wrapper.is-focus) {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.settings-section :deep(.el-select .el-input__wrapper) {
  border: 1px solid #e2e8f0;
}

.settings-section :deep(.el-input-number .el-input__wrapper) {
  border: 1px solid #e2e8f0;
}

.settings-section :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-section :deep(.el-switch) {
  --el-switch-on-color: #4299e1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .test-email-group {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .settings-section :deep(.el-form-item__label) {
    width: 100px !important;
  }
  
  .save-section .el-button {
    margin: 6px 3px;
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .test-email-group {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .save-section {
    text-align: left;
  }
  
  .save-section .el-button {
    width: 100%;
    margin: 6px 0;
  }
  
  .settings-section :deep(.el-col) {
    width: 100% !important;
    margin-bottom: 12px;
  }
}
</style> 