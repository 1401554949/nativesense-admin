import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi, logoutApi, type LoginParams, type LoginResponse } from '@/api/auth'
import Cookies from 'js-cookie'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(Cookies.get('token') || '')
  const userInfo = ref<LoginResponse['userInfo'] | null>(null)
  const loading = ref(false)

  // 【禁用登录功能期间】设置为始终已登录状态
  const isLogin = computed(() => !!token.value)

  // 登录
  const login = async (params: LoginParams) => {
    loading.value = true
    try {
      const response = await loginApi(params)
      token.value = response.token
      userInfo.value = response.userInfo
      
      // 保存token到cookie
      Cookies.set('token', response.token, { expires: 7 }) // 7天过期
      
      return response
    } finally {
      loading.value = false
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return null
    
    try {
      const response = await getUserInfoApi()
      userInfo.value = response
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      token.value = ''
      userInfo.value = null
      Cookies.remove('token')
      router.push('/login')
    }
  }

  // 清除用户信息
  const clearUser = () => {
    token.value = ''
    userInfo.value = null
    Cookies.remove('token')
  }

  return {
    token,
    userInfo,
    loading,
    isLogin,
    login,
    fetchUserInfo,
    logout,
    clearUser
  }
}) 