<script setup lang="ts">
import { watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import TabBar from '@/components/TabBar.vue'
import VoiceNav from '@/components/VoiceNav.vue'
import SideTools from '@/components/SideTools.vue'
import MinimalNav from '@/components/MinimalNav.vue'
import CaregiverNav from '@/components/CaregiverNav.vue'
import WheelchairNav from '@/components/WheelchairNav.vue'
import FloatingCompanion from '@/components/FloatingCompanion.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

// 根据路由 meta.title 更新文档标题
watch(
  () => route.meta.title,
  (title) => {
    document.title = title ? `${title} - 生命树 AI` : '生命树 AI'
  },
  { immediate: true }
)

// 当前模式 key（用于 data-mode 属性）
const modeKey = computed(() => userStore.activeModeKey)

// 登录等全屏页面：隐藏 AppHeader / 导航 / 悬浮小康
const hideChrome = computed(() => route.meta.hideChrome === true)

// 导航组件
const navComp = computed(() => {
  switch (userStore.activeMode.navStyle) {
    case 'voice-bar':
      return VoiceNav
    case 'side-tools':
      return SideTools
    case 'minimal-nav':
      return MinimalNav
    case 'caregiver-tabs':
      return CaregiverNav
    case 'wheelchair-nav':
      return WheelchairNav
    default:
      return TabBar
  }
})
</script>

<template>
  <div class="app-container" :data-mode="modeKey" :class="{ 'chrome-hidden': hideChrome }">
    <AppHeader v-if="!hideChrome" />
    <main class="app-main" :class="[`layout-${userStore.activeMode.layout}`, { 'no-chrome': hideChrome }]">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <!-- 根据模式渲染不同导航 -->
    <component :is="navComp" v-if="!hideChrome" />

    <!-- 小康悬浮框（非登录页悬浮） -->
    <FloatingCompanion v-if="!hideChrome" />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background: var(--mode-bg, var(--color-bg));
  transition: background var(--transition-normal);
}
.app-main {
  padding-top: 56px;
  padding-bottom: 64px;
  min-height: 100vh;
}
/* 登录等全屏页面：移除顶部/底部留白 */
.app-main.no-chrome {
  padding-top: 0;
  padding-bottom: 0;
}

/* 路由切换动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
