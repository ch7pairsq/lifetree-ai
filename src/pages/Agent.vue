<script setup lang="ts">
import { ref } from 'vue'
import { agentDemoChat, shortcuts, schedule, capabilities } from '@/mock'
import AppIcon from '@/components/AppIcon.vue'

// 麦克风监听状态
const listening = ref(false)
function toggleMic() {
  listening.value = !listening.value
}

// 解析 actions 文本，将 ** 包裹的部分转为加粗
function parseAction(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '').trim()
}
</script>

<template>
  <div class="agent-page">
    <!-- 1. 语音输入区 -->
    <section class="voice-section">
      <div class="voice-label"><AppIcon name="mic" :size="16" /> 叫一声"小康"</div>

      <div class="mic-container" :class="{ listening }" @click="toggleMic">
        <div class="mic-ring"></div>
        <div class="mic-pulse mic-pulse-1"></div>
        <div class="mic-pulse mic-pulse-2"></div>
        <div class="mic-pulse mic-pulse-3"></div>
        <div class="mic-ring-mask"></div>
        <button class="mic-btn" aria-label="语音唤醒小康管家"><AppIcon name="mic" :size="36" :color="'#fff'" /></button>
      </div>

      <p class="voice-placeholder">
        {{ listening ? '正在聆听... 试试说：帮我预约明天协和医院' : '试试说：帮我预约明天协和医院' }}
      </p>
    </section>

    <!-- 2. 演示对话 -->
    <section class="demo-section">
      <h2 class="section-title"><AppIcon name="sparkles" :size="18" /> 一句话搞定一切</h2>

      <div class="chat-container">
        <template v-for="(msg, idx) in agentDemoChat" :key="msg.id">
          <div class="chat-bubble user" :style="{ animationDelay: `${0.1 + idx * 0.3}s` }">
            {{ msg.text }}
          </div>
          <div
            v-if="msg.role === 'ai' && msg.actions"
            class="chat-bubble ai action-bubble"
            :style="{ animationDelay: `${0.5 + idx * 0.3}s` }"
          >
            <div class="action-prefix">好的王奶奶！正在为您处理...</div>
            <div class="action-list">
              <div
                v-for="(action, i) in msg.actions"
                :key="i"
                class="action-item"
                :style="{ animationDelay: `${1.2 + i * 0.3}s` }"
              >
                <span class="action-check"><AppIcon name="check-circle" :size="16" /></span>
                <span class="action-text">{{ parseAction(action) }}</span>
              </div>
            </div>
          </div>
          <div
            v-else-if="msg.role === 'ai'"
            class="chat-bubble ai"
            :style="{ animationDelay: `${0.5 + idx * 0.3}s` }"
          >
            {{ msg.text }}
          </div>
        </template>
      </div>
    </section>

    <!-- 3. 快捷功能 -->
    <section class="block">
      <h2 class="section-title"><AppIcon name="zap" :size="18" /> 常用功能</h2>
      <div class="shortcut-grid">
        <div v-for="s in shortcuts" :key="s.label" class="shortcut-card">
          <span class="shortcut-icon"><AppIcon :name="s.icon" :size="26" :color="'var(--color-brand)'" /></span>
          <span class="shortcut-label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- 4. 今日日程 -->
    <section class="block">
      <h2 class="section-title"><AppIcon name="calendar-days" :size="18" /> 今日日程</h2>
      <div class="timeline">
        <div
          v-for="(item, idx) in schedule"
          :key="idx"
          class="timeline-item"
          :class="item.status"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-time">{{ item.time }}</div>
          <div class="timeline-content">
            <span class="timeline-emoji"><AppIcon :name="item.icon" :size="16" /></span>{{ item.desc }}
          </div>
        </div>
      </div>
    </section>

    <!-- 5. 小康能力 -->
    <section class="block">
      <h2 class="section-title"><AppIcon name="bot" :size="18" /> 小康能做什么</h2>
      <div class="capability-grid">
        <div v-for="c in capabilities" :key="c.title" class="capability-card">
          <span class="capability-icon"><AppIcon :name="c.icon" :size="26" :color="'var(--color-brand)'" /></span>
          <span class="capability-title">{{ c.title }}</span>
          <span class="capability-desc">{{ c.desc }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.agent-page {
  padding: var(--space-4) var(--space-5) var(--space-8);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.block {
  margin-bottom: var(--space-8);
}

/* 1. 语音输入 */
.voice-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-10) 0 var(--space-8);
}
.voice-label {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.mic-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
  cursor: pointer;
}
.mic-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--color-brand), var(--color-accent2), var(--color-brand));
  animation: ring-rotate 4s linear infinite;
  opacity: 0.6;
}
.mic-pulse {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid var(--color-brand);
  animation: pulse-expand 2.5s ease-out infinite;
}
.mic-pulse-1 {
  animation-delay: 0s;
  opacity: 0.5;
}
.mic-pulse-2 {
  animation-delay: 0.8s;
  opacity: 0.4;
}
.mic-pulse-3 {
  animation-delay: 1.6s;
  opacity: 0.3;
}
.mic-ring-mask {
  position: absolute;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: var(--color-bg);
  z-index: 1;
}
.mic-btn {
  position: relative;
  z-index: 2;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--color-brand), var(--color-accent2));
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(91, 184, 158, 0.35);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}
.mic-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 28px rgba(91, 184, 158, 0.45);
}
.mic-btn:active {
  transform: scale(0.96);
}
.voice-placeholder {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  text-align: center;
  max-width: 280px;
  line-height: var(--leading-relaxed);
  padding: 0 var(--space-4);
}

/* 2. 演示对话 */
.demo-section {
  margin-bottom: var(--space-8);
}
.chat-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.chat-bubble {
  max-width: 85%;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  animation: bubble-in 0.4s ease-out both;
}
.chat-bubble.user {
  align-self: flex-end;
  background: linear-gradient(135deg, var(--color-accent2), var(--color-accent2-dark));
  color: var(--color-text-inverse);
  border-bottom-right-radius: 6px;
}
.chat-bubble.ai {
  align-self: flex-start;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-solid);
  border-bottom-left-radius: 6px;
}
.action-prefix {
  margin-bottom: var(--space-2);
}
.action-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.action-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  opacity: 0;
  animation: check-appear 0.5s ease-out forwards;
}
.action-check {
  color: var(--color-brand);
  flex-shrink: 0;
  line-height: 1.6;
  display: inline-flex;
  align-items: center;
}
.action-text {
  color: var(--color-text-primary);
  line-height: 1.5;
}

/* 3. 快捷功能 */
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
.shortcut-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--color-border-solid);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  min-height: 80px;
  justify-content: center;
}
.shortcut-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.shortcut-card:active {
  transform: scale(0.97);
}
.shortcut-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand);
  line-height: 1;
}
.shortcut-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  text-align: center;
  line-height: 1.3;
}

/* 4. 时间线 */
.timeline {
  position: relative;
  padding-left: var(--space-8);
}
.timeline::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--color-border-solid);
  border-radius: 1px;
}
.timeline-item {
  position: relative;
  padding-bottom: var(--space-4);
  padding-right: var(--space-2);
}
.timeline-item:last-child {
  padding-bottom: 0;
}
.timeline-dot {
  position: absolute;
  left: calc(-1 * var(--space-8) + 4px);
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-surface-solid);
  border: 3px solid var(--color-border-solid);
  z-index: 1;
}
.timeline-item.completed .timeline-dot {
  background: var(--color-brand);
  border-color: var(--color-brand);
}
.timeline-item.completed .timeline-dot::after {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  margin: 2px auto 0;
}
.timeline-item.current .timeline-dot {
  border-color: var(--color-brand);
  background: var(--color-brand-lighter);
  animation: dot-pulse 2s ease-in-out infinite;
}
.timeline-time {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--color-text-tertiary);
  margin-bottom: 2px;
}
.timeline-content {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
}
.timeline-emoji {
  margin-right: var(--space-1);
  display: inline-flex;
  vertical-align: middle;
}
.timeline-item.completed .timeline-content {
  text-decoration: line-through;
  color: var(--color-text-tertiary);
}
.timeline-item.current .timeline-content {
  color: var(--color-brand-dark);
  font-weight: var(--weight-medium);
}

/* 5. 能力卡片 */
.capability-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
.capability-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--color-border-solid);
  border-radius: var(--radius-md);
  padding: var(--space-5) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}
.capability-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.capability-icon {
  display: flex;
  align-items: center;
  color: var(--color-brand);
  line-height: 1;
}
.capability-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}
.capability-desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}
</style>
