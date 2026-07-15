<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { companionAvatar, nurseCompanionAvatar, quickActions } from '@/mock'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import AppIcon from '@/components/AppIcon.vue'

const chatStore = useChatStore()
const userStore = useUserStore()

// 根据当前模式选择头像信息（护理模式使用护理助手问候语）
const avatarInfo = computed(() => (userStore.isMinimal ? nurseCompanionAvatar : companionAvatar))

// 页面挂载时根据当前模式重置消息
onMounted(() => {
  chatStore.resetMessages()
})

const inputText = ref('')
const chatBody = ref<HTMLElement | null>(null)
const listening = ref(false)
const showQuickPanel = ref(false)

async function scrollToBottom() {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

function sendMessage() {
  if (!inputText.value.trim() || chatStore.isReplying) return
  chatStore.sendUserMessage(inputText.value)
  inputText.value = ''
  scrollToBottom()
  setTimeout(scrollToBottom, 1000)
}

function toggleVoice() {
  listening.value = !listening.value
  if (listening.value) {
    setTimeout(() => {
      listening.value = false
      runOneSentenceDemo('小康，帮我预约明天去协和医院看病')
      scrollToBottom()
    }, 2000)
  }
}

function onQuickAction(label: string) {
  inputText.value = `帮我${label}`
  showQuickPanel.value = false
  sendMessage()
}

function selectOneSentence(text: string) {
  inputText.value = text
  showQuickPanel.value = false
  sendMessage()
}

function runOneSentenceDemo(userText: string) {
  chatStore.sendUserMessage(userText)
  scrollToBottom()
  setTimeout(() => {
    chatStore.sendAiMessage('好的王奶奶！我来帮您安排去协和医院的完整流程，请稍等...')
    scrollToBottom()
    setTimeout(() => {
      showFlow.value = true
      runFlowSteps()
    }, 800)
  }, 800)
}

const showFlow = ref(false)
const flowSteps = ref<{ icon: string; title: string; desc: string; done: boolean }[]>([])
const flowRunning = ref(false)

function runFlowSteps() {
  flowRunning.value = true
  flowSteps.value = [
    { icon: 'calendar-check', title: '规划时间', desc: '建议明早 8:30 出发，9:30 到达协和医院心内科', done: false },
    { icon: 'navigation', title: '规划路线', desc: '翠湖小区→地铁4号线→西单换乘1号线→西单站D口步行500米', done: false },
    { icon: 'stethoscope', title: '预约陪诊', desc: '已预约安心陪诊师小李，明早8:00上门陪同', done: false },
    { icon: 'car', title: '准备叫车', desc: '明早8:30 网约车到小区门口，预计费用35元', done: false },
    { icon: 'phone', title: '通知女儿', desc: '已发送短信通知女儿小芳，她会同步关注您的行程', done: false },
  ]
  flowSteps.value.forEach((_, idx) => {
    setTimeout(() => {
      flowSteps.value[idx].done = true
      if (idx === flowSteps.value.length - 1) {
        flowRunning.value = false
        chatStore.sendAiMessage('全部安排好了！明早8:00陪诊师小李上门，8:30网约车出发。记得带医保卡和检查报告，早点休息哦~')
        scrollToBottom()
      }
    }, (idx + 1) * 1000)
  })
}

function startOneSentence() {
  runOneSentenceDemo('小康，帮我预约明天去协和医院看病')
}
</script>

<template>
  <div class="companion-page">
    <!-- 1. 数字人头像 -->
    <section class="avatar-section">
      <div class="avatar-pulse">
        <AppIcon name="bot" :size="64" :color="'#fff'" />
      </div>
      <div class="avatar-name">{{ avatarInfo.name }}</div>
      <div class="avatar-status">
        <span class="status-dot"></span>
        {{ avatarInfo.status }}
      </div>
      <div class="avatar-greeting glass-card">{{ avatarInfo.greeting }}</div>
    </section>

    <!-- 2. 聊天区 -->
    <section ref="chatBody" class="chat-body">
      <div class="chat-list">
        <template v-for="msg in chatStore.messages" :key="msg.id">
          <div v-if="msg.role === 'ai'" class="chat-row ai-row">
            <div class="chat-avatar">
          <AppIcon name="bot" :size="22" :color="'#fff'" />
        </div>
            <div class="chat-ai">{{ msg.text }}</div>
          </div>
          <div v-else class="chat-row user-row">
            <div class="chat-user">{{ msg.text }}</div>
          </div>
        </template>
        <div v-if="chatStore.isReplying" class="chat-row ai-row">
          <div class="chat-avatar">
          <AppIcon name="bot" :size="22" :color="'#fff'" />
        </div>
          <div class="chat-ai typing">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- 占位 -->
    <div class="bottom-pad"></div>

    <!-- 一句话办事流程弹窗 -->
    <transition name="fade">
      <div v-if="showFlow" class="flow-mask" @click="showFlow = false">
        <div class="flow-dialog" @click.stop>
          <div class="flow-head">
            <div class="flow-title"><AppIcon name="zap" :size="20" :color="'var(--color-brand)'" /> 小康正在帮您办事</div>
            <button class="flow-close" @click="showFlow = false"><AppIcon name="x" :size="18" /></button>
          </div>
          <div class="flow-list">
            <div v-for="(step, idx) in flowSteps" :key="idx" class="flow-step" :class="{ done: step.done, running: flowRunning && !step.done && idx === flowSteps.findIndex(s => !s.done) }">
              <div class="flow-step-icon">
                <AppIcon v-if="step.done" name="check" :size="18" :color="'#fff'" />
                <AppIcon v-else :name="step.icon" :size="18" :color="'var(--color-text-tertiary)'" />
              </div>
              <div class="flow-step-content">
                <div class="flow-step-title">{{ step.title }}</div>
                <div class="flow-step-desc">{{ step.desc }}</div>
              </div>
              <div v-if="step.done" class="flow-step-status done">已完成</div>
              <div v-else-if="flowRunning && idx === flowSteps.findIndex(s => !s.done)" class="flow-step-status running">
                <span class="mini-dot"></span>进行中
              </div>
            </div>
          </div>
          <div v-if="!flowRunning && flowSteps.length && flowSteps.every(s => s.done)" class="flow-done-tip">
            <AppIcon name="check-circle" :size="16" :color="'var(--state-success)'" />
            <span>全部安排好了！详情已在聊天中发送</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 快捷功能 + 一句话办事（固定在输入框上方，可折叠） -->
    <div class="quick-panel-wrapper">
      <button class="quick-panel-toggle" @click="showQuickPanel = !showQuickPanel">
        <AppIcon :name="showQuickPanel ? 'chevron-up' : 'chevron-down'" :size="18" />
        <span>{{ showQuickPanel ? '收起' : '快捷功能' }}</span>
      </button>
      <transition name="expand">
        <div v-if="showQuickPanel" class="quick-panel">
          <!-- 快捷功能 -->
          <div class="quick-section-mini">
            <h3 class="quick-section-title"><AppIcon name="zap" :size="16" /> 快捷功能</h3>
            <div class="quick-grid-mini">
              <button v-for="a in quickActions" :key="a.label" class="quick-item-mini" @click="onQuickAction(a.label)">
                <span class="quick-icon-mini"><AppIcon :name="a.icon" :size="20" :color="'var(--color-brand)'" /></span>
                <span class="quick-label-mini">{{ a.label }}</span>
              </button>
            </div>
          </div>
          <!-- 一句话办事 -->
          <div class="onesent-section-mini">
            <h3 class="quick-section-title"><AppIcon name="sparkles" :size="16" /> 一句话办事</h3>
            <div class="onesent-list-mini">
              <button class="onesent-item-mini" @click="selectOneSentence('帮我预约明天去协和医院看病')">
                <span class="onesent-icon-mini"><AppIcon name="stethoscope" :size="16" color="var(--color-brand)" /></span>
                <span>预约明天去协和医院看病</span>
              </button>
              <button class="onesent-item-mini" @click="selectOneSentence('提醒我下午3点吃药')">
                <span class="onesent-icon-mini"><AppIcon name="pill" :size="16" color="var(--color-accent3)" /></span>
                <span>提醒我下午3点吃药</span>
              </button>
              <button class="onesent-item-mini" @click="selectOneSentence('帮我叫一辆车去菜市场')">
                <span class="onesent-icon-mini"><AppIcon name="car" :size="16" color="var(--color-accent2)" /></span>
                <span>帮我叫一辆车去菜市场</span>
              </button>
              <button class="onesent-item-mini" @click="selectOneSentence('给女儿小芳打电话')">
                <span class="onesent-icon-mini"><AppIcon name="phone" :size="16" color="var(--color-brand)" /></span>
                <span>给女儿小芳打电话</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 聊天输入栏 -->
    <div class="chat-input-bar">
      <div class="chat-input-inner">
        <button class="voice-btn" :class="{ listening }" aria-label="语音输入" @click="toggleVoice">
          <AppIcon name="mic" :size="22" />
        </button>
        <input
          v-model="inputText"
          type="text"
          :placeholder="listening ? '正在听...' : '和小康说说话...'"
          class="text-input"
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" aria-label="发送" @click="sendMessage"><AppIcon name="send" :size="20" :color="'#fff'" /></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.companion-page {
  padding-bottom: 0;
}

/* 数字人头像 */
.avatar-section {
  text-align: center;
  padding: var(--space-6) var(--space-5) var(--space-4);
}
.avatar-pulse {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--color-brand-light), var(--color-brand), var(--color-accent2));
  color: white;
  margin-bottom: var(--space-3);
  animation: avatar-pulse 2.4s ease-out infinite;
}
.avatar-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.avatar-name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}
.avatar-status {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand);
}
.avatar-greeting {
  display: inline-block;
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  color: var(--color-brand-dark);
  font-weight: var(--weight-medium);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* 聊天区 */
.chat-body {
  padding: var(--space-2) var(--space-4) var(--space-4);
  max-height: 360px;
  overflow-y: auto;
}
.chat-body::-webkit-scrollbar {
  display: none;
}
.chat-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.chat-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  animation: bubble-in 0.4s ease-out both;
}
.user-row {
  justify-content: flex-end;
}
.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--color-brand-light), var(--color-brand));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
}
.chat-avatar-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.chat-ai {
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.12), rgba(91, 184, 158, 0.06));
  border: 1px solid rgba(91, 184, 158, 0.18);
  border-radius: 2px 16px 16px 16px;
  max-width: 82%;
  padding: var(--space-3) var(--space-4);
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-text-primary);
}
.chat-user {
  background: linear-gradient(135deg, rgba(111, 177, 217, 0.15), rgba(111, 177, 217, 0.08));
  border: 1px solid rgba(111, 177, 217, 0.2);
  border-radius: 16px 2px 16px 16px;
  max-width: 75%;
  padding: var(--space-3) var(--space-4);
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-text-primary);
}
.typing {
  display: flex;
  gap: 4px;
  align-items: center;
}
.typing .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand);
  animation: dot-bounce 1.2s ease-in-out infinite;
}
.typing .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing .dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes dot-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* 聊天输入栏：固定在 tab 栏上方 */
.chat-input-bar {
  position: fixed;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  z-index: 30;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-top: 1px solid var(--glass-border);
  padding: var(--space-3) var(--space-4);
  box-sizing: border-box;
}
.chat-input-inner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.voice-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--color-text-secondary);
}
.voice-btn.listening {
  background: var(--state-error);
  color: #fff;
  animation: mic-pulse 1s infinite;
}
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,107,107,0.5); }
  50% { box-shadow: 0 0 0 8px rgba(212,107,107,0); }
}
.text-input {
  flex: 1;
  height: 48px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-solid);
  background: var(--color-surface-solid);
  padding: 0 var(--space-5);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  outline: none;
  font-family: var(--font-body);
}
.text-input:focus {
  border-color: var(--color-brand);
}
.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}
.send-btn:active {
  transform: scale(0.95);
}

/* 快捷面板（固定在输入框上方，可折叠） */
.quick-panel-wrapper {
  position: fixed;
  bottom: calc(64px + 72px);
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  z-index: 28;
}
.quick-panel-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: var(--space-2) var(--space-4);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}
.quick-panel-toggle:hover {
  background: rgba(91, 184, 158, 0.08);
  color: var(--color-brand);
}
.quick-panel {
  background: var(--color-surface-solid);
  border-top: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-4);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
}
.quick-section-mini {
  margin-bottom: var(--space-3);
}
.quick-section-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: 6px;
}
.quick-grid-mini {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
}
.quick-item-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-2) var(--space-1);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  cursor: pointer;
  transition: all 0.25s;
}
.quick-item-mini:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.12);
  background: rgba(91, 184, 158, 0.08);
}
.quick-item-mini:active { transform: scale(0.95); }
.quick-icon-mini { display: flex; align-items: center; }
.quick-label-mini { font-size: 0.65rem; color: var(--color-text-primary); font-weight: 500; }

.onesent-section-mini {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-3);
}
.onesent-list-mini {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}
.onesent-item-mini {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s;
  font-size: 0.75rem;
  color: var(--color-text-primary);
}
.onesent-item-mini:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.12);
  background: rgba(91, 184, 158, 0.08);
}
.onesent-item-mini:active { transform: scale(0.97); }
.onesent-icon-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(91, 184, 158, 0.1);
  flex-shrink: 0;
}

/* 流程弹窗 */
.flow-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.flow-dialog {
  width: 100%;
  max-width: 430px;
  background: var(--color-surface-solid);
  border-radius: 24px 24px 0 0;
  padding: var(--space-5) var(--space-5) var(--space-6);
  box-shadow: var(--shadow-float);
  animation: slide-up 0.3s ease-out;
  max-height: 85vh;
  overflow-y: auto;
}
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.flow-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.flow-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.flow-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
}
.flow-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.flow-step {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  transition: all var(--transition-fast);
}
.flow-step.done {
  background: rgba(91, 184, 158, 0.08);
}
.flow-step.running {
  background: rgba(232, 184, 124, 0.1);
  box-shadow: 0 0 0 2px rgba(232, 184, 124, 0.3);
}
.flow-step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-tertiary);
  flex-shrink: 0;
}
.flow-step.done .flow-step-icon {
  background: var(--state-success);
}
.flow-step-content { flex: 1; }
.flow-step-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.flow-step-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.flow-step-status {
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}
.flow-step-status.done {
  color: var(--state-success);
}
.flow-step-status.running {
  color: var(--state-warning);
}
.mini-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--state-warning);
  animation: dot-pulse 1s infinite;
}
@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.flow-done-tip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: rgba(91, 184, 158, 0.1);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--color-brand-dark);
  font-weight: 500;
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
