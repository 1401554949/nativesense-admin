import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { 
        title: '登录',
        requireAuth: false 
      }
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/components/Layout.vue'),
      redirect: '/dashboard',
      meta: { 
        requireAuth: true 
      },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { 
            title: '仪表盘',
            requireAuth: true 
          }
        },
        {
          path: '/video',
          name: 'Video',
          redirect: '/video/list',
          meta: { 
            title: '视频管理',
            requireAuth: true 
          },
          children: [
            {
              path: '/video/list',
              name: 'VideoList',
              component: () => import('@/views/video/VideoList.vue'),
              meta: { 
                title: '视频列表',
                requireAuth: true 
              }
            },
            {
              path: '/video/upload',
              name: 'VideoUpload',
              component: () => import('@/views/video/VideoUpload.vue'),
              meta: { 
                title: '上传视频',
                requireAuth: true 
              }
            }
          ]
        },
        {
          path: '/audio',
          name: 'Audio',
          redirect: '/audio/list',
          meta: { 
            title: '音频管理',
            requireAuth: true 
          },
          children: [
            {
              path: '/audio/list',
              name: 'AudioList',
              component: () => import('@/views/audio/AudioList.vue'),
              meta: { 
                title: '音频列表',
                requireAuth: true 
              }
            },
            {
              path: '/audio/upload',
              name: 'AudioUpload',
              component: () => import('@/views/audio/AudioUpload.vue'),
              meta: { 
                title: '上传音频',
                requireAuth: true 
              }
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { 
        title: '页面不存在' 
      }
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = Cookies.get('token')
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - NativeSense Admin`
  }
  
  // 检查是否需要登录
  if (to.meta.requireAuth) {
    if (token && userStore.isLogin) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 如果已登录用户访问登录页，重定向到首页
    if (to.path === '/login' && token && userStore.isLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
