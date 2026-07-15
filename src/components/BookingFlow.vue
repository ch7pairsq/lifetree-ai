<script setup lang="ts">
import { ref, computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

// 当前步骤：1 选科室 / 2 选医生 / 3 确认 / 4 成功
const step = ref(1)

// 科室列表
const departments = [
  { id: 'cardio', name: '心内科', icon: 'heart-pulse', desc: '高血压、冠心病' },
  { id: 'neuro', name: '神经内科', icon: 'brain', desc: '头晕、脑卒中' },
  { id: 'ortho', name: '骨科', icon: 'activity', desc: '关节、骨质疏松' },
  { id: 'endo', name: '内分泌科', icon: 'droplet', desc: '糖尿病、甲亢' },
  { id: 'tcm', name: '中医科', icon: 'leaf', desc: '中医调理' },
  { id: 'eye', name: '眼科', icon: 'eye', desc: '视力、白内障' },
]

// 医生与号源列表
const doctors = [
  { name: '张主任', title: '主任医师', time: '明天 09:30', left: 3 },
  { name: '李医生', title: '副主任医师', time: '明天 14:00', left: 8 },
  { name: '王医生', title: '主治医师', time: '后天 09:00', left: 12 },
]

const selectedDept = ref('')
const selectedDoctor = ref<number | null>(null)

// 选择科室 -> 进入步骤 2
function selectDept(id: string) {
  selectedDept.value = id
  step.value = 2
}
// 选择医生 -> 进入步骤 3
function selectDoctor(idx: number) {
  selectedDoctor.value = idx
  step.value = 3
}
// 确认预约 -> 进入步骤 4
function confirm() {
  step.value = 4
}
// 关闭弹窗并重置状态
function close() {
  step.value = 1
  selectedDept.value = ''
  selectedDoctor.value = null
  emit('close')
}

const currentDept = computed(() => departments.find(d => d.id === selectedDept.value))
const currentDoctor = computed(() => selectedDoctor.value !== null ? doctors[selectedDoctor.value] : null)
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="booking-overlay" @click.self="close">
      <div class="booking-modal">
        <!-- 步骤指示器 -->
        <div class="booking-steps">
          <div class="step-dot" :class="{ active: step >= 1, done: step > 1 }">1</div>
          <div class="step-line" :class="{ done: step > 1 }"></div>
          <div class="step-dot" :class="{ active: step >= 2, done: step > 2 }">2</div>
          <div class="step-line" :class="{ done: step > 2 }"></div>
          <div class="step-dot" :class="{ active: step >= 3, done: step > 3 }">3</div>
          <div class="step-line" :class="{ done: step > 3 }"></div>
          <div class="step-dot" :class="{ active: step >= 4 }">4</div>
        </div>

        <!-- 步骤1：选择科室 -->
        <div v-if="step === 1" class="booking-content">
          <h3 class="booking-title"><AppIcon name="hospital" :size="20" /> 选择科室</h3>
          <div class="dept-grid">
            <button v-for="d in departments" :key="d.id" class="dept-card" @click="selectDept(d.id)">
              <span class="dept-icon"><AppIcon :name="d.icon" :size="28" /></span>
              <span class="dept-name">{{ d.name }}</span>
              <span class="dept-desc">{{ d.desc }}</span>
            </button>
          </div>
        </div>

        <!-- 步骤2：选择医生 -->
        <div v-if="step === 2" class="booking-content">
          <h3 class="booking-title"><AppIcon name="stethoscope" :size="20" /> 选择医生 - {{ currentDept?.name }}</h3>
          <div class="doctor-list">
            <button v-for="(doc, idx) in doctors" :key="idx" class="doctor-card" @click="selectDoctor(idx)">
              <div class="doctor-avatar"><AppIcon name="user" :size="32" /></div>
              <div class="doctor-info">
                <div class="doctor-name">{{ doc.name }} <span class="doctor-title">{{ doc.title }}</span></div>
                <div class="doctor-time"><AppIcon name="clock" :size="14" /> {{ doc.time }}</div>
                <div class="doctor-left">剩余 {{ doc.left }} 个号源</div>
              </div>
              <AppIcon name="chevron-right" :size="20" />
            </button>
          </div>
          <button class="booking-back" @click="step = 1"><AppIcon name="chevron-left" :size="16" /> 返回选科室</button>
        </div>

        <!-- 步骤3：确认信息 -->
        <div v-if="step === 3" class="booking-content">
          <h3 class="booking-title"><AppIcon name="clipboard-list" :size="20" /> 确认预约信息</h3>
          <div class="confirm-card">
            <div class="confirm-row"><span>医院</span><strong>协和医院</strong></div>
            <div class="confirm-row"><span>科室</span><strong>{{ currentDept?.name }}</strong></div>
            <div class="confirm-row"><span>医生</span><strong>{{ currentDoctor?.name }} {{ currentDoctor?.title }}</strong></div>
            <div class="confirm-row"><span>时间</span><strong>{{ currentDoctor?.time }}</strong></div>
            <div class="confirm-row"><span>患者</span><strong>王秀兰</strong></div>
            <div class="confirm-row"><span>医保</span><strong>北京市医保</strong></div>
          </div>
          <button class="booking-confirm" @click="confirm"><AppIcon name="check-circle" :size="20" /> 确认预约</button>
          <button class="booking-back" @click="step = 2"><AppIcon name="chevron-left" :size="16" /> 返回选医生</button>
        </div>

        <!-- 步骤4：预约成功 -->
        <div v-if="step === 4" class="booking-content booking-success">
          <div class="success-icon"><AppIcon name="check-circle" :size="64" :color="'var(--color-brand)'" /></div>
          <h3 class="success-title">预约成功！</h3>
          <div class="success-detail">
            <p>{{ currentDept?.name }} - {{ currentDoctor?.name }}</p>
            <p>{{ currentDoctor?.time }}</p>
            <p>协和医院 门诊楼 3层</p>
          </div>
          <div class="success-actions">
            <button class="success-btn primary">查看预约详情</button>
            <button class="success-btn" @click="close">完成</button>
          </div>
          <p class="success-tip"><AppIcon name="bell" :size="14" /> 已设置明日 8:00 出发提醒，已通知女儿小芳</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* 全屏遮罩层 */
.booking-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* 弹窗主体 */
.booking-modal {
  background: #fff;
  border-radius: 24px;
  max-width: 380px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
}

/* 步骤指示器 */
.booking-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

/* 步骤圆点 */
.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: #fff;
  flex-shrink: 0;
}

.step-dot.active {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: var(--color-text-on-brand);
}

.step-dot.done {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: var(--color-text-on-brand);
}

/* 步骤连接线 */
.step-line {
  width: 24px;
  height: 2px;
  background: var(--color-border-solid);
}

.step-line.done {
  background: var(--color-brand);
}

/* 标题 */
.booking-title {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

/* 科室网格 */
.dept-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 科室卡片 */
.dept-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border-solid);
  background: #fff;
  cursor: pointer;
  gap: 6px;
  transition: all 0.2s;
}

.dept-card:hover {
  border-color: var(--color-brand);
  background: var(--color-bg-tertiary);
}

.dept-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-brand-lighter);
  color: var(--color-brand-darker);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.dept-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dept-desc {
  font-size: 12px;
  color: var(--color-text-tertiary);
  text-align: center;
}

/* 医生列表 */
.doctor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 医生卡片 */
.doctor-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--color-border-solid);
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.doctor-card:hover {
  border-color: var(--color-brand);
  background: var(--color-bg-tertiary);
}

.doctor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  color: var(--color-brand-darker);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doctor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doctor-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.doctor-title {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-tertiary);
}

.doctor-time {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.doctor-left {
  font-size: 12px;
  color: var(--color-brand-dark);
}

/* 确认信息卡片 */
.confirm-card {
  background: var(--color-bg-tertiary);
  border-radius: 12px;
  padding: 16px;
}

.confirm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-solid);
}

.confirm-row:last-child {
  border-bottom: none;
}

.confirm-row span {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.confirm-row strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* 确认按钮 */
.booking-confirm {
  width: 100%;
  background: var(--color-brand);
  color: var(--color-text-on-brand);
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.2s;
}

.booking-confirm:hover {
  background: var(--color-brand-dark);
}

/* 返回按钮 */
.booking-back {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  margin-top: 12px;
  padding: 8px;
}

.booking-back:hover {
  color: var(--color-brand-dark);
}

/* 成功页 */
.booking-success {
  text-align: center;
}

.success-icon {
  margin: 20px auto;
  display: flex;
  justify-content: center;
}

.success-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.success-detail {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 20px;
}

.success-detail p {
  margin: 0;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.success-btn {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--color-border-solid);
  background: #fff;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.success-btn.primary {
  background: var(--color-brand);
  color: var(--color-text-on-brand);
  border-color: var(--color-brand);
}

.success-btn.primary:hover {
  background: var(--color-brand-dark);
}

.success-btn:hover {
  border-color: var(--color-brand);
}

.success-tip {
  font-size: 12px;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
