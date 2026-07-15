<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 根据模式动态显示tab名称
const tabs = computed(() => {
  const isCaregiver = userStore.isCaregiver
  return [
    { key: 'home', icon: 'home', label: '工作台', path: '/' },
    { key: 'health', icon: 'heart-pulse', label: 'AI健康', path: '/health' },
    { key: 'companion', icon: 'bot', label: isCaregiver ? '小康照看' : '小康陪护', path: '/companion' },
    { key: 'profile', icon: 'user', label: '我的', path: '/profile' },
  ]
})

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="caregiver-nav">
    <a
      v-for="tab in tabs"
      :key="tab.key"
      class="caregiver-tab"
      :class="{ active: route.path === tab.path }"
      @click="go(tab.path)"
    >
      <AppIcon :name="tab.icon" :size="22" />
      <span class="caregiver-label">{{ tab.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.caregiver-nav {
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
  background: #FFFFFF;
  border-top: 1px solid rgba(91,184,158,0.15);
}
.caregiver-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 52px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}
.caregiver-tab.active {
  color: var(--color-brand-dark);
}
.caregiver-tab.active .caregiver-label {
  font-weight: 700;
}
.caregiver-label {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
