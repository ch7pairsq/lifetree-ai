<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import AppIcon from '@/components/AppIcon.vue'

// 小康悬浮框：所有界面悬浮快捷点击
const router = useRouter()
const chatStore = useChatStore()
const expanded = ref(false)

function toggleExpand() {
  expanded.value = !expanded.value
}

function goCompanion() {
  expanded.value = false
  router.push('/companion')
}

function quickAsk(text: string) {
  expanded.value = false
  chatStore.sendUserMessage(text)
  router.push('/companion')
}
</script>

<template>
  <div class="floating-companion">
    <!-- 展开面板 -->
    <transition name="expand">
      <div v-if="expanded" class="float-panel">
        <div class="float-panel-head">
          <div class="float-avatar"><AppIcon name="bot" :size="20" :color="'#fff'" /></div>
          <div class="float-panel-title">小康随时都在</div>
          <button class="float-close" @click="toggleExpand"><AppIcon name="x" :size="16" /></button>
        </div>
        <div class="float-quick-list">
          <button class="float-quick-item" @click="quickAsk('帮我预约挂号')">
            <AppIcon name="hospital" :size="18" :color="'var(--color-brand)'" />
            <span>预约挂号</span>
          </button>
          <button class="float-quick-item" @click="quickAsk('提醒我吃药')">
            <AppIcon name="pill" :size="18" :color="'var(--color-accent3)'" />
            <span>用药提醒</span>
          </button>
          <button class="float-quick-item" @click="quickAsk('帮我叫车')">
            <AppIcon name="car" :size="18" :color="'var(--color-accent2)'" />
            <span>叫车出行</span>
          </button>
          <button class="float-quick-item" @click="quickAsk('查看今天日程')">
            <AppIcon name="calendar-days" :size="18" :color="'var(--color-brand)'" />
            <span>今日日程</span>
          </button>
        </div>
        <button class="float-chat-btn" @click="goCompanion">
          <AppIcon name="message-circle" :size="18" :color="'#fff'" />
          <span>和小康聊天</span>
        </button>
      </div>
    </transition>

    <!-- 悬浮按钮 -->
    <button class="float-btn" :class="{ expanded }" @click="toggleExpand" aria-label="小康助手">
      <span class="float-btn-pulse"></span>
      <span class="float-btn-icon">
        <AppIcon :name="expanded ? 'x' : 'bot'" :size="26" :color="'#fff'" />
      </span>
    </button>
  </div>
</template>

<style scoped>
.floating-companion {
  position: fixed;
  right: 12px;
  bottom: 40px;
  z-index: 999;
}

/* 悬浮按钮 */
.float-btn {
  position: relative;
  width: 56px;
  height: 56px;
  min-height: 56px !important;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--color-brand-light), var(--color-brand), var(--color-brand-dark));
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(91, 184, 158, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}
.float-btn:active {
  transform: scale(0.9);
}
.float-btn.expanded {
  transform: rotate(0deg);
}
.float-btn-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-brand);
  opacity: 0.4;
  animation: float-pulse 2.5s ease-out infinite;
}
.float-btn-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes float-pulse {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* 展开面板 */
.float-panel {
  position: absolute;
  bottom: 44px;
  right: 0;
  width: 260px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float);
  padding: var(--space-4);
  border: 1px solid var(--glass-border);
}
.float-panel-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.float-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-brand-light), var(--color-brand));
  flex-shrink: 0;
}
.float-panel-title {
  flex: 1;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}
.float-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.float-quick-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.float-quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  border: none;
  cursor: pointer;
  transition: transform var(--transition-fast);
}
.float-quick-item:active {
  transform: scale(0.95);
}
.float-quick-item span {
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  font-weight: 500;
}

.float-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  border: none;
  color: #fff;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: transform var(--transition-fast);
}
.float-chat-btn:active {
  transform: scale(0.97);
}

/* 动画 */
.expand-enter-active,
.expand-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>
