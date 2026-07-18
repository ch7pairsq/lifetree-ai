<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'

// 轮椅模式：底部导航
const router = useRouter()
const route = useRoute()

const tabs = [
  { key: 'home', icon: 'home', label: '首页', path: '/' },
  { key: 'health', icon: 'heart-pulse', label: 'AI健康', path: '/health' },
  { key: 'companion', icon: 'bot', label: '小康陪伴', path: '/companion' },
  { key: 'profile', icon: 'user', label: '我的', path: '/profile' },
]

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="wc-tabbar">
    <a
      v-for="tab in tabs"
      :key="tab.key"
      class="wc-tab"
      :class="{ active: route.path === tab.path }"
      @click="go(tab.path)"
    >
      <AppIcon :name="tab.icon" :size="22" />
      <span class="wc-label">{{ tab.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.wc-tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--glass-border);
  box-shadow: 0 -2px 16px rgba(45, 52, 54, 0.06);
}
.wc-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 48px;
  min-width: 56px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}
.wc-tab.active {
  color: var(--color-brand);
}
.wc-label {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
