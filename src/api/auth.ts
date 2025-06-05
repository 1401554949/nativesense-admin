import request from '@/utils/request'

// 登录接口
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: {
    id: number
    username: string
    email: string
    avatar?: string
    role: string
  }
}

export const loginApi = (data: LoginParams) => {
  return request<LoginResponse>({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getUserInfoApi = () => {
  return request({
    url: '/auth/userinfo',
    method: 'get'
  })
}

// 退出登录
export const logoutApi = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
} 