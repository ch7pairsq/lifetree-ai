<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import ModeSwitcher from '@/components/ModeSwitcher.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// SOS 按住3秒求助
const pressing = ref(false)
const pressTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const showSosSent = ref(false)

function startPress() {
  pressing.value = true
  pressTimer.value = setTimeout(() => {
    pressing.value = false
    showSosSent.value = true
  }, 3000)
}

function cancelPress() {
  pressing.value = false
  if (pressTimer.value) {
    clearTimeout(pressTimer.value)
    pressTimer.value = null
  }
}

onUnmounted(() => {
  if (pressTimer.value) clearTimeout(pressTimer.value)
})
</script>

<template>
  <header class="app-header">
    <!-- 品牌：LifeTree-AI + 特色树 Logo（外加边框） -->
    <div class="brand">
      <span class="logo">
        <span class="logo-frame">
          <svg viewBox="0 0 40 40" class="logo-svg" aria-hidden="true">
            <!-- 树冠：三层渐变圆形 -->
            <circle cx="20" cy="13" r="8" fill="url(#crownGrad)" />
            <circle cx="12" cy="19" r="5.5" fill="url(#crownGrad)" opacity="0.85" />
            <circle cx="28" cy="19" r="5.5" fill="url(#crownGrad)" opacity="0.85" />
            <!-- 树干 -->
            <path d="M18 21 L18 33 L22 33 L22 21 Z" fill="#3E9A80" />
            <!-- 根部 -->
            <path d="M13 33 Q20 35.5 27 33" stroke="#3E9A80" stroke-width="2" fill="none" stroke-linecap="round" />
            <!-- 心形点缀 -->
            <path d="M20 8.5 C18.8 7 16.8 7.5 16.8 9.5 C16.8 11.2 20 13 20 13 C20 13 23.2 11.2 23.2 9.5 C23.2 7.5 21.2 7 20 8.5 Z" fill="#fff" opacity="0.92" />
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7DCEAF" />
                <stop offset="100%" stop-color="#3E9A80" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </span>
      <span class="name">LifeTree<span class="name-dash">-</span>AI</span>
    </div>

    <!-- 右侧操作 -->
    <div class="header-right">
      <!-- 版式切换 -->
      <ModeSwitcher />

      <!-- SOS 按住3秒按钮（视障语音/护理/子女/高龄/卧床模式均隐藏，页面内已另有求助入口） -->
      <button
        v-if="!userStore.isVoice && !userStore.isMinimal && !userStore.isCaregiver && !userStore.isElderly && !userStore.isTool"
        class="sos-btn"
        :class="{ pressing }"
        aria-label="SOS 紧急求助（按住3秒）"
        @pointerdown.prevent="startPress"
        @pointerup="cancelPress"
        @pointerleave="cancelPress"
        @pointercancel="cancelPress"
      >
        <svg class="sos-ring" viewBox="0 0 56 56">
          <circle class="sos-ring-bg" cx="28" cy="28" r="26" />
          <circle class="sos-ring-fill" :class="{ active: pressing }" cx="28" cy="28" r="26" />
        </svg>
        <span class="sos-inner">
          <span class="sos-text">SOS</span>
          <span class="sos-hint">{{ pressing ? '求助中...' : '长按3秒' }}</span>
        </span>
      </button>
    </div>
  </header>

  <!-- SOS 已发出提示弹窗 -->
  <transition name="fade">
    <div v-if="showSosSent" class="sos-mask" @click="showSosSent = false">
      <div class="sos-dialog" @click.stop>
        <div class="sos-icon-wrap">
          <svg viewBox="0 0 56 56" class="sos-icon-svg">
            <circle cx="28" cy="28" r="26" fill="#D46B6B" />
            <path d="M28 14 C20 14 14 20 14 28 C14 36 20 42 28 42 C36 42 42 36 42 28 C42 20 36 14 28 14 Z M28 36 L28 38 M28 18 L28 32" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="sos-title">SOS 求助已发出</div>
        <div class="sos-info-list">
          <div class="sos-info-item">
            <span class="sos-info-icon">✓</span>
            <span>已通知紧急联系人 <b>女儿小芳</b>（138****6789）</span>
          </div>
          <div class="sos-info-item">
            <span class="sos-info-icon">✓</span>
            <span>已通知 <b>社区护理员</b> 张阿姨</span>
          </div>
          <div class="sos-info-item">
            <span class="sos-info-icon">✓</span>
            <span>已共享您的 <b>实时位置</b>（翠湖小区3号楼）</span>
          </div>
          <div class="sos-info-item">
            <span class="sos-info-icon">✓</span>
            <span>正在拨打 <b>120</b> 急救电话</span>
          </div>
        </div>
        <p class="sos-tip">请保持冷静，保持电话畅通，救援正在赶来。</p>
        <button class="sos-confirm" @click="showSosSent = false">我知道了</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 56px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-3);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--glass-border);
}

/* 品牌区 */
.brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
}

/* Logo：外加圆角边框 */
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.15), rgba(111, 177, 217, 0.1));
  border: 1.5px solid rgba(91, 184, 158, 0.45);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.6);
}
.logo-svg {
  width: 28px;
  height: 28px;
  filter: drop-shadow(0 1px 2px rgba(91, 184, 158, 0.3));
}

/* 品牌名 */
.name {
  font-family: 'Outfit', 'PingFang SC', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #5BB89E 0%, #3E9A80 50%, #6FB1D9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.name-dash {
  font-weight: 400;
  opacity: 0.6;
}

/* 右侧操作 */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* SOS 按钮：按住3秒，提示在按钮内部 */
.sos-btn {
  position: relative;
  width: 48px;
  height: 48px;
  min-height: auto !important;
  border-radius: 50%;
  background: linear-gradient(135deg, #E07474, #D46B6B);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(212, 107, 107, 0.4);
  transition: transform var(--transition-fast);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}
.sos-btn:active {
  transform: scale(0.92);
}
.sos-btn.pressing {
  box-shadow: 0 0 0 4px rgba(212, 107, 107, 0.2), 0 2px 16px rgba(212, 107, 107, 0.5);
}

/* 进度环 */
.sos-ring {
  position: absolute;
  inset: 0;
  width: 48px;
  height: 48px;
  transform: rotate(-90deg);
}
.sos-ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 2.5;
}
.sos-ring-fill {
  fill: none;
  stroke: #fff;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 163.4;
  stroke-dashoffset: 163.4;
}
.sos-ring-fill.active {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 3s linear;
}

/* 按钮内部内容 */
.sos-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.sos-text {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8125rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}
.sos-hint {
  font-size: 0.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
  white-space: nowrap;
  font-family: var(--font-display);
}

/* SOS 已发出弹窗 */
.sos-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}
.sos-dialog {
  width: 100%;
  max-width: 340px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-float);
  text-align: center;
}
.sos-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-3);
}
.sos-icon-svg {
  width: 56px;
  height: 56px;
}
.sos-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--state-error);
  margin-bottom: var(--space-4);
}
.sos-info-list {
  text-align: left;
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.sos-info-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.sos-info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--state-success);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}
.sos-info-item b {
  color: var(--color-text-primary);
  font-weight: 600;
}
.sos-tip {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-5);
  line-height: 1.5;
}
.sos-confirm {
  width: 100%;
  min-height: 48px;
  border-radius: var(--radius-sm);
  background: var(--state-error);
  color: var(--color-text-inverse);
  border: none;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: transform var(--transition-fast);
}
.sos-confirm:active {
  transform: scale(0.97);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
