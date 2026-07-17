<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'

// 视障语音模式：底部只保留一个"按住说话"按钮，点击跳转小康对话页
const router = useRouter()
const route = useRoute()
const pressing = ref(false)

// 非首页时显示返回主页按钮
const isHome = computed(() => route.path === '/')

function onTap() {
  router.push('/companion')
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <nav class="voice-nav">
    <div class="voice-nav-inner">
      <!-- 返回主页按钮（非首页显示） -->
      <button v-if="!isHome" class="voice-back-btn" @click="goHome" aria-label="返回主页">
        <AppIcon name="home" :size="26" color="#fff" />
        <span class="back-text">返回主页</span>
      </button>
      <!-- 按住与小康对话按钮 -->
      <button
        class="voice-hold-btn"
        :class="{ pressing, 'with-back': !isHome }"
        @touchstart.prevent="pressing = true"
        @touchend.prevent="pressing = false; onTap()"
        @touchcancel.prevent="pressing = false"
        @mousedown.prevent="pressing = true"
        @mouseup.prevent="pressing = false; onTap()"
        @mouseleave="pressing = false"
      >
        <AppIcon name="mic" :size="36" color="#fff" />
        <span class="hold-text">按住与小康对话</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.voice-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 96px;
  padding: var(--space-3) var(--space-6);
  padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
  z-index: 1000;
  background: #FFFFFF;
  border-top: 3px solid #000000;
}
.voice-nav-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
  height: 100%;
}
.voice-hold-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  flex: 1;
  height: 64px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(91, 184, 158, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  user-select: none;
  -webkit-user-select: none;
}
.voice-hold-btn:active,
.voice-hold-btn.pressing {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.3);
}
.hold-text {
  font-size: 1.2rem;
}
/* 返回主页按钮 */
.voice-back-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 88px;
  height: 64px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #F6A35C, #E8853A);
  color: #fff;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(246, 163, 92, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  flex-shrink: 0;
  padding-top: 8px;
  padding-bottom: 6px;
  box-sizing: border-box;
}
.voice-back-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(246, 163, 92, 0.3);
}
.back-text {
  font-size: 0.78rem;
  line-height: 1;
}
</style>
