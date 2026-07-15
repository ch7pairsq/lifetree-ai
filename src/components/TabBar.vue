<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const tabs = computed(() => {
  const allTabs = [
    { key: 'home', icon: 'home', label: '首页', path: '/' },
    { key: 'health', icon: 'heart-pulse', label: 'AI健康', path: '/health' },
    { key: 'companion', icon: 'bot', label: '小康陪伴', path: '/companion' },
    { key: 'learn', icon: 'book-open', label: '乐活天地', path: '/learn' },
    { key: 'profile', icon: 'user', label: '我的', path: '/profile' },
  ]
  if (userStore.isElderly) {
    return allTabs.filter(tab => tab.key !== 'learn')
  }
  return allTabs
})

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="tab-bar">
    <a
      v-for="tab in tabs"
      :key="tab.key"
      class="tab-item"
      :class="{ active: route.path === tab.path }"
      role="button"
      :aria-label="tab.label"
      @click="go(tab.path)"
    >
      <AppIcon :name="tab.icon" :size="24" :stroke-width="route.path === tab.path ? 2.5 : 2" class="tab-icon" />
      <span class="tab-label">{{ tab.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.tab-bar {
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
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--glass-border);
  box-shadow: 0 -2px 16px rgba(45, 52, 54, 0.05);
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: var(--space-1) var(--space-3);
  min-height: 48px;
  min-width: 56px;
  text-decoration: none;
  position: relative;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: transform var(--transition-fast), color var(--transition-fast);
}
.tab-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: var(--color-brand);
  transition: transform var(--transition-normal);
}
.tab-item.active::before {
  transform: translateX(-50%) scaleX(1);
}
.tab-icon {
  transition: color var(--transition-fast);
}
.tab-label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  line-height: 1;
  white-space: nowrap;
}
.tab-item.active {
  color: var(--color-brand);
}
.tab-item.active .tab-icon {
  color: var(--color-brand);
}
.tab-item.active .tab-label {
  color: var(--color-brand);
  font-weight: var(--weight-semibold);
}
.tab-item:active {
  transform: scale(0.95);
}
</style>
