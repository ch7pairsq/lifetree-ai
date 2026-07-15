<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'

// 视障语音模式：底部只保留一个"按住说话"按钮，点击跳转小康对话页
const router = useRouter()
const pressing = ref(false)

function onTap() {
  router.push('/companion')
}
</script>

<template>
  <nav class="voice-nav">
    <button
      class="voice-hold-btn"
      :class="{ pressing }"
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-top: 3px solid #000000;
}
.voice-hold-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
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
</style>
