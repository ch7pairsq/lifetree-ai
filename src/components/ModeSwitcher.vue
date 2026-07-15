<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UI_MODES, useUserStore } from '@/stores/user'
import AppIcon from '@/components/AppIcon.vue'

const userStore = useUserStore()
const router = useRouter()
const showPanel = ref(false)

function openPanel() {
  showPanel.value = true
}
function closePanel() {
  showPanel.value = false
}
function selectMode(key: string) {
  userStore.setMode(key)
  showPanel.value = false
  router.push('/')
}
</script>

<template>
  <!-- 当前版式标签（可点击切换） -->
  <button class="mode-tag" @click="openPanel">
    <AppIcon :name="userStore.activeMode.icon" :size="14" :color="'var(--color-brand-dark)'" />
    <span class="mode-tag-label">{{ userStore.activeMode.label }}</span>
    <AppIcon name="chevron-down" :size="12" :color="'var(--color-brand-dark)'" />
  </button>

  <!-- 版式切换弹窗（ teleport 到 body，避免被父级 transform 裁剪） -->
  <teleport to="body">
    <transition name="fade">
      <div v-if="showPanel" class="mode-mask" @click="closePanel">
        <div class="mode-panel" @click.stop>
          <div class="mode-panel-head">
            <div class="mode-panel-title">界面版式切换</div>
            <div class="mode-panel-sub">当前：{{ userStore.activeMode.label }} · {{ userStore.activeMode.desc }}</div>
          </div>
          <div class="mode-grid">
            <button
              v-for="m in UI_MODES"
              :key="m.key"
              class="mode-card"
              :class="{ active: m.key === userStore.activeModeKey }"
              @click="selectMode(m.key)"
            >
              <span class="mode-card-icon"><AppIcon :name="m.icon" :size="22" :color="m.key === userStore.activeModeKey ? '#fff' : 'var(--color-brand)'" /></span>
              <span class="mode-card-text">
                <span class="mode-card-label">{{ m.label }}</span>
                <span class="mode-card-desc">{{ m.desc }}</span>
              </span>
              <span v-if="m.recommend && m.key !== userStore.activeModeKey" class="mode-card-badge">推荐</span>
              <span v-if="m.key === userStore.activeModeKey" class="mode-card-check"><AppIcon name="check-circle" :size="14" :color="'#fff'" /></span>
            </button>
          </div>
          <button class="mode-close-btn" @click="closePanel">关闭</button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.mode-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  min-height: 28px !important;
  padding: 0 10px;
  border-radius: 14px;
  background: rgba(91, 184, 158, 0.12);
  border: 1px solid rgba(91, 184, 158, 0.25);
  cursor: pointer;
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}
.mode-tag:active {
  transform: scale(0.94);
}
.mode-tag-label {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-brand-dark);
  white-space: nowrap;
}

/* 弹窗 */
.mode-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.45);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}
.mode-panel {
  width: 92%;
  max-width: 360px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-4) var(--space-4);
  box-shadow: var(--shadow-float);
  animation: panel-in 0.3s ease-out;
}
@keyframes panel-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.mode-panel-head {
  margin-bottom: var(--space-4);
}
.mode-panel-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}
.mode-panel-sub {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.mode-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}
.mode-card:active {
  transform: scale(0.97);
}
.mode-card.active {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  border-color: var(--color-brand-dark);
}
.mode-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(91, 184, 158, 0.1);
  flex-shrink: 0;
}
.mode-card.active .mode-card-icon {
  background: rgba(255, 255, 255, 0.2);
}
.mode-card-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mode-card-label {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}
.mode-card.active .mode-card-label {
  color: #fff;
}
.mode-card-desc {
  font-size: 0.625rem;
  color: var(--color-text-tertiary);
  line-height: 1.3;
}
.mode-card.active .mode-card-desc {
  color: rgba(255, 255, 255, 0.85);
}
.mode-card-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--color-accent3);
  color: #fff;
  font-size: 0.5rem;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: var(--radius-full);
}
.mode-card-check {
  position: absolute;
  top: 4px;
  right: 4px;
}
.mode-close-btn {
  width: 100%;
  min-height: 48px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: none;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  cursor: pointer;
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
