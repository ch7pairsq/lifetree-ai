import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Health from '@/pages/Health.vue'
import Companion from '@/pages/Companion.vue'
import Learn from '@/pages/Learn.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
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

export default router
