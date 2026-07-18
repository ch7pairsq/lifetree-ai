<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'

// 轮椅模式：底部导航 + 语音操作按钮
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

function voiceTap() {
  router.push('/companion')
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
    <!-- 语音操作快捷按钮 -->
    <button class="wc-voice-btn" aria-label="语音操作" @click="voiceTap">
      <AppIcon name="mic" :size="22" color="#fff" />
      <span class="wc-voice-text">语音</span>
    </button>
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
.wc-voice-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.35);
  transition: transform 0.15s;
  flex-shrink: 0;
}
.wc-voice-btn:active {
  transform: scale(0.92);
}
.wc-voice-text {
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
}
</style>
