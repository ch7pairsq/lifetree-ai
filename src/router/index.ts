import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Health from '@/pages/Health.vue'
import Companion from '@/pages/Companion.vue'
import Learn from '@/pages/Learn.vue'
import Profile from '@/pages/Profile.vue'
import Login from '@/pages/Login.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { title: '登录', public: true, hideChrome: true } },
  { path: '/', name: 'home', component: Home, meta: { title: '首页' } },
  { path: '/health', name: 'health', component: Health, meta: { title: 'AI 健康' } },
  { path: '/companion', name: 'companion', component: Companion, meta: { title: 'AI 陪伴' } },
  { path: '/learn', name: 'learn', component: Learn, meta: { title: '学习中心' } },
  { path: '/profile', name: 'profile', component: Profile, meta: { title: '我的' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 全局守卫：未登录跳转登录页
router.beforeEach((to) => {
  // 在路由守卫中首次访问 store 需要先确保 Pinia 已初始化
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // 已登录再访问登录页，直接回首页
  if (to.name === 'login' && userStore.isLoggedIn) {
    return { name: 'home' }
  }
  return true
})

export default router
