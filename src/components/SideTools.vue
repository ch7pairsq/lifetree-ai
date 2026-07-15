<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'

// 卧床模式：底部简易导航
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
  <!-- 底部导航 -->
  <nav class="tool-tabbar">
    <a
      v-for="tab in tabs"
      :key="tab.key"
      class="tool-tab"
      :class="{ active: route.path === tab.path }"
      @click="go(tab.path)"
    >
      <AppIcon :name="tab.icon" :size="20" />
      <span class="tool-label">{{ tab.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.tool-tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 64px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--glass-border);
}
.tool-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 48px;
  color: var(--color-text-tertiary);
  cursor: pointer;
}
.tool-tab.active {
  color: var(--color-brand);
}
.tool-label {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
