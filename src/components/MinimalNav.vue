<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'

// 极简模式：底部仅 2 个超大按钮 + SOS
const router = useRouter()
const route = useRoute()

const tabs = [
  { key: 'home', icon: 'home', label: '首页', path: '/' },
  { key: 'companion', icon: 'bot', label: '说话', path: '/companion' },
]

function go(path: string) {
  router.push(path)
}

// 自定义提示弹窗
const showAlert = ref(false)
const alertMsg = ref('')
function onSos() {
  alertMsg.value = '120 紧急求助已拨叫！\n已通知女儿小芳'
  showAlert.value = true
}
</script>

<template>
  <nav class="minimal-nav">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="minimal-tab"
      :class="{ active: route.path === tab.path }"
      @click="go(tab.path)"
    >
      <AppIcon :name="tab.icon" :size="36" />
      <span class="minimal-label">{{ tab.label }}</span>
    </button>
    <button class="minimal-sos" @click="onSos">
      <AppIcon name="siren" :size="36" />
      <span class="minimal-label">SOS</span>
    </button>
  </nav>

  <!-- 提示弹窗 -->
  <transition name="fade">
    <div v-if="showAlert" class="alert-mask" @click="showAlert = false">
      <div class="alert-dialog" @click.stop>
        <div class="alert-icon"><AppIcon name="info" :size="36" color="var(--color-brand)" /></div>
        <div class="alert-content">{{ alertMsg }}</div>
        <button class="alert-btn" @click="showAlert = false">确定</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.minimal-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 88px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #FFFFFF;
  border-top: 3px solid #000000;
}
.minimal-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 80px;
  min-height: 80px;
  border: none;
  background: none;
  color: #000000;
  cursor: pointer;
}
.minimal-tab.active {
  color: var(--color-brand-dark);
}
.minimal-label {
  font-size: 1.1rem;
  font-weight: 700;
}
.minimal-sos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 80px;
  min-height: 80px;
  border: none;
  background: none;
  color: var(--state-error);
  cursor: pointer;
}

/* 提示弹窗 */
.alert-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.alert-dialog {
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: dialog-pop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes dialog-pop {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.15), rgba(91, 184, 158, 0.08));
  border: 1px solid rgba(91, 184, 158, 0.2);
}
.alert-content {
  font-size: 1rem;
  color: #2d3436;
  line-height: 1.6;
  white-space: pre-line;
  margin-bottom: 20px;
}
.alert-btn {
  width: 100%;
  min-height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5BB89E, #3E9A80);
  color: #fff;
  border: none;
  font-family: 'Outfit', 'PingFang SC', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.alert-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(91, 184, 158, 0.4);
}
.alert-btn:active { transform: scale(0.97); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
