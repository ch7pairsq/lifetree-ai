<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RefreshCw } from 'lucide-vue-next'
import { vitals, medications, healthReport, healthTip, healthTips, riskGuardScores, greeting, onlineDoctors, medicalOrders, medicalOrderSummary, healthReports, alertCenter, type ReportPeriod } from '@/mock'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import AppIcon from '@/components/AppIcon.vue'

const userStore = useUserStore()
const router = useRouter()
const chatStore = useChatStore()

// 报告详情弹窗
const showReport = ref(false)

// 下载健康报告
function downloadReport() {
  const content = `LifeTree-AI 健康报告\n\n${healthReport}\n\n本周共记录生命体征 42 次，整体健康趋势平稳。建议继续保持规律作息，适当增加户外活动。`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `健康报告_${new Date().toLocaleDateString('zh-CN')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 转发健康报告
async function shareReport() {
  const text = `LifeTree-AI 健康报告：${healthReport} 本周共记录生命体征 42 次，整体健康趋势平稳。`
  if (navigator.share) {
    try {
      await navigator.share({ title: 'LifeTree-AI 健康报告', text })
    } catch {
      // 用户取消分享
    }
  } else {
    await navigator.clipboard.writeText(text)
    showAlert('报告内容已复制到剪贴板')
  }
}

// AI深入分析 - 流式输出
const analyzing = ref(false)
const analysisResult = ref('')
const showAnalysis = ref(false)
function analyzeRisk() {
  analyzing.value = true
  analysisResult.value = ''
  showAnalysis.value = true
  const analysisText = 'AI正在基于您的指标数据进行深入分析：心率72bpm正常，血压128/82略偏高，建议减少盐分摄入。'
  let idx = 0
  const interval = setInterval(() => {
    if (idx < analysisText.length) {
      analysisResult.value += analysisText[idx]
      idx++
    } else {
      clearInterval(interval)
      analyzing.value = false
    }
  }, 30)
}

// ===== 健康报告中心（历史/周月年报/趋势/异常预警）=====
const showReportCenter = ref(false)
const activePeriod = ref<ReportPeriod>('day')
const periodTabs: { key: ReportPeriod; label: string; icon: string }[] = [
  { key: 'day', label: '日报', icon: 'file-text' },
  { key: 'week', label: '周报', icon: 'calendar-days' },
  { key: 'month', label: '月报', icon: 'calendar-check' },
  { key: 'year', label: '年报', icon: 'trophy' },
]
const currentReport = computed(() => {
  return healthReports.find(r => r.period === activePeriod.value) || healthReports[0]
})
// 趋势图：根据数据生成 SVG 折线
function buildTrendPath(data: number[], width = 240, height = 50, pad = 4): string {
  if (data.length < 2) return ''
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = (width - pad * 2) / (data.length - 1)
  return data.map((v, i) => {
    const x = pad + i * step
    const y = height - pad - ((v - min) / range) * (height - pad * 2)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}
function switchPeriod(p: ReportPeriod) {
  activePeriod.value = p
}
function viewReportHistory() {
  showReportCenter.value = true
  activePeriod.value = 'day'
}

// 统一提示弹窗（替代原生 alert）
const showAppAlert = ref(false)
const appAlertMsg = ref('')
function showAlert(msg: string) {
  appAlertMsg.value = msg
  showAppAlert.value = true
}

// 生命体征一键同步
const syncing = ref(false)
const lastSyncTime = ref('刚刚')
function syncVitals() {
  if (syncing.value) return
  syncing.value = true
  setTimeout(() => {
    syncing.value = false
    lastSyncTime.value = '刚刚'
    showAlert('生命体征数据已同步！\n心率、血压、血氧、体温、睡眠均为最新数据。')
  }, 1500)
}

// 让小康详细解释
const aiExplaining = ref(false)
const aiExplainText = ref('')
function askXiaoKang(topic: string, detail: string) {
  aiExplaining.value = true
  aiExplainText.value = ''
  setTimeout(() => {
    aiExplaining.value = false
    aiExplainText.value = `关于「${topic}」的详细解释：\n\n${detail}\n\n小康建议：您可以点击下方按钮直接和小康对话，我会帮您进一步分析并给出个性化的辅助建议。`
  }, 1500)
}
function goChat(msg: string) {
  chatStore.sendUserMessage(msg)
  router.push('/companion')
}

// 风险守护弹窗
const showRiskGuard = ref(false)
const activeRiskGuard = ref<typeof riskGuardScores[number] | null>(null)
function openRiskGuard(item: typeof riskGuardScores[number]) {
  activeRiskGuard.value = item
  showRiskGuard.value = true
}

// 私家教练
const coachPlans = [
  { icon: 'activity', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)', title: '膝盖疼痛缓解训练', desc: '股四头肌强化+关节活动度训练', duration: '15分钟', level: '初级' },
  { icon: 'footprints', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)', title: '脚踝疼痛康复', desc: '踝关节稳定性+柔韧性训练', duration: '12分钟', level: '初级' },
  { icon: 'hand', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)', title: '肩膀疼痛改善', desc: '肩袖肌群激活+活动度训练', duration: '18分钟', level: '中级' },
  { icon: 'hand', bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)', title: '握拳无力训练', desc: '手部握力+指尖灵活性训练', duration: '10分钟', level: '初级' },
]

function startCoach(title: string) {
  showAlert(`开始训练：${title}`)
}

// 护理模式：长者列表（可筛选查看）
const careElders = [
  { id: 1, name: '王秀兰', age: 68, initial: '王', healthScore: 86, riskLevel: '低风险' },
  { id: 2, name: '李建国', age: 76, initial: '李', healthScore: 72, riskLevel: '中风险' },
  { id: 3, name: '张桂英', age: 82, initial: '张', healthScore: 68, riskLevel: '中风险' },
  { id: 4, name: '刘德明', age: 79, initial: '刘', healthScore: 65, riskLevel: '高风险' },
  { id: 5, name: '陈淑芬', age: 73, initial: '陈', healthScore: 80, riskLevel: '低风险' },
  { id: 6, name: '赵伟民', age: 85, initial: '赵', healthScore: 70, riskLevel: '中风险' },
]

const selectedElderId = ref(1)
const selectedElder = computed(() => careElders.find(e => e.id === selectedElderId.value)!)

// 根据选中的长者生成不同的健康数据
const elderVitalsMap: Record<number, typeof vitals> = {
  1: vitals, // 王秀兰用默认数据
  2: [
    { icon: 'heart-pulse', label: '心率', value: '78', unit: 'bpm', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'droplet', label: '血压', value: '142/88', unit: 'mmHg', trend: 'warning' as const, trendText: '偏高', trendIcon: 'arrow-up' },
    { icon: 'droplets', label: '血氧', value: '96%', unit: '', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'thermometer', label: '体温', value: '36.6', unit: '°C', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'moon', label: '睡眠时长', value: '5.1', unit: '小时', trend: 'warning' as const, trendText: '偏少', trendIcon: 'arrow-down' },
    { icon: 'bed-double', label: '睡眠质量', value: '差', unit: '', trend: 'warning' as const, trendText: '较差', trendIcon: 'arrow-down' },
  ],
  3: [
    { icon: 'heart-pulse', label: '心率', value: '82', unit: 'bpm', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'droplet', label: '血压', value: '135/85', unit: 'mmHg', trend: 'warning' as const, trendText: '偏高', trendIcon: 'arrow-up' },
    { icon: 'droplets', label: '血氧', value: '97%', unit: '', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'thermometer', label: '体温', value: '36.4', unit: '°C', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'candy', label: '空腹血糖', value: '7.2', unit: 'mmol/L', trend: 'warning' as const, trendText: '偏高', trendIcon: 'arrow-up' },
    { icon: 'moon', label: '睡眠时长', value: '6.8', unit: '小时', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
  ],
  4: [
    { icon: 'heart-pulse', label: '心率', value: '88', unit: 'bpm', trend: 'warning' as const, trendText: '偏快', trendIcon: 'arrow-up' },
    { icon: 'droplet', label: '血压', value: '148/92', unit: 'mmHg', trend: 'warning' as const, trendText: '偏高', trendIcon: 'arrow-up' },
    { icon: 'droplets', label: '血氧', value: '95%', unit: '', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'thermometer', label: '体温', value: '36.7', unit: '°C', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'moon', label: '睡眠时长', value: '4.5', unit: '小时', trend: 'warning' as const, trendText: '严重偏少', trendIcon: 'arrow-down' },
    { icon: 'person-standing', label: '跌倒风险', value: '高', unit: '', trend: 'warning' as const, trendText: '高风险', trendIcon: 'alert-triangle' },
  ],
  5: [
    { icon: 'heart-pulse', label: '心率', value: '74', unit: 'bpm', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'droplet', label: '血压', value: '125/80', unit: 'mmHg', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'droplets', label: '血氧', value: '98%', unit: '', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'thermometer', label: '体温', value: '36.5', unit: '°C', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'moon', label: '睡眠时长', value: '7.5', unit: '小时', trend: 'normal' as const, trendText: '达标', trendIcon: 'check' },
    { icon: 'activity', label: '康复进度', value: '60', unit: '%', trend: 'normal' as const, trendText: '进行中', trendIcon: 'arrow-up' },
  ],
  6: [
    { icon: 'heart-pulse', label: '心率', value: '76', unit: 'bpm', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'droplet', label: '血压', value: '138/86', unit: 'mmHg', trend: 'warning' as const, trendText: '偏高', trendIcon: 'arrow-up' },
    { icon: 'droplets', label: '血氧', value: '97%', unit: '', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'thermometer', label: '体温', value: '36.3', unit: '°C', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
    { icon: 'brain', label: '认知评分', value: '22', unit: '/30', trend: 'warning' as const, trendText: '下降', trendIcon: 'arrow-down' },
    { icon: 'moon', label: '睡眠时长', value: '6.0', unit: '小时', trend: 'warning' as const, trendText: '偏少', trendIcon: 'arrow-down' },
  ],
}

const elderMedicationsMap: Record<number, typeof medications> = {
  1: medications,
  2: [
    { time: '07:30', name: '降压药 1片', detail: '饭后服用', status: 'pending' as const, statusText: '待确认', icon: 'clock' },
    { time: '12:30', name: '钙片 2片', detail: '饭后服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
    { time: '19:00', name: '安眠药 1片', detail: '睡前服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
  ],
  3: [
    { time: '07:00', name: '降糖药 1片', detail: '饭前30分钟', status: 'taken' as const, statusText: '已服用', icon: 'check-circle' },
    { time: '12:30', name: '降糖药 1片', detail: '饭前30分钟', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
    { time: '18:00', name: '降糖药 1片', detail: '饭前30分钟', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
  ],
  4: [
    { time: '07:30', name: '降压药 2片', detail: '饭后服用', status: 'taken' as const, statusText: '已服用', icon: 'check-circle' },
    { time: '08:00', name: '心脏药 1片', detail: '饭前30分钟', status: 'taken' as const, statusText: '已服用', icon: 'check-circle' },
    { time: '20:00', name: '安眠药 1片', detail: '睡前服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
  ],
  5: [
    { time: '07:30', name: '维生素D 1片', detail: '饭后服用', status: 'taken' as const, statusText: '已服用', icon: 'check-circle' },
    { time: '12:30', name: '钙片 2片', detail: '饭后服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
  ],
  6: [
    { time: '07:30', name: '降压药 1片', detail: '饭后服用', status: 'taken' as const, statusText: '已服用', icon: 'check-circle' },
    { time: '09:00', name: '认知改善药 1片', detail: '饭后服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
    { time: '21:00', name: '安眠药 1片', detail: '睡前服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
  ],
}

const displayVitals = computed(() => {
  if (userStore.isMinimal && elderVitalsMap[selectedElderId.value]) {
    return elderVitalsMap[selectedElderId.value]
  }
  return vitals
})

const displayMedications = computed(() => {
  if (userStore.isMinimal && elderMedicationsMap[selectedElderId.value]) {
    return elderMedicationsMap[selectedElderId.value]
  }
  return medications
})

const displayScore = computed(() => {
  if (userStore.isMinimal) {
    return selectedElder.value.healthScore
  }
  return userStore.profile.healthScore
})

const displayRiskLevel = computed(() => {
  if (userStore.isMinimal) {
    return selectedElder.value.riskLevel
  }
  return userStore.profile.riskLevel
})

// 健康评分环：周长 2*PI*65 ≈ 408.4
const circumference = 2 * Math.PI * 65
const ringOffset = computed(() => circumference * (1 - displayScore.value / 100))

// ===== AI 记医嘱（任务5）=====
const showMedicalOrders = ref(false)
const showMedicalSummary = ref(false)
const playingSummary = ref(false)
let summaryTimer: ReturnType<typeof setTimeout> | null = null

function openMedicalOrders() {
  showMedicalOrders.value = true
}

function inputOrderByPhoto() {
  showAlert('正在打开相机...\n\n拍照完成后，小康会自动识别医嘱内容并保存到医嘱记忆库。')
}

function inputOrderByVoice() {
  showAlert('请开始口述医嘱内容...\n\n小康会自动录音并转写成文字，保存到医嘱记忆库。')
}

function playMedicalSummary() {
  showMedicalSummary.value = true
  playingSummary.value = true
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(60)
  }
  if (summaryTimer) clearTimeout(summaryTimer)
  // 模拟朗读约6秒
  summaryTimer = setTimeout(() => {
    playingSummary.value = false
  }, 6000)
}

function stopMedicalSummary() {
  playingSummary.value = false
  if (summaryTimer) {
    clearTimeout(summaryTimer)
    summaryTimer = null
  }
}

// ===== 在线医生问诊（任务9）=====
const showDoctorConsult = ref(false)
const activeDoctor = ref<typeof onlineDoctors[number] | null>(null)
const consultMode = ref<'voice' | 'video'>('voice')
const consultStarted = ref(false)
const consultConnected = ref(false)
let consultTimer: ReturnType<typeof setTimeout> | null = null

function openDoctorConsult(doc: typeof onlineDoctors[number]) {
  if (!doc.online) {
    showAlert(`${doc.name}医生当前不在线，请稍后再试或选择其他在线医生。`)
    return
  }
  activeDoctor.value = doc
  consultStarted.value = false
  consultConnected.value = false
  showDoctorConsult.value = true
}

function startConsult(mode: 'voice' | 'video') {
  if (!activeDoctor.value) return
  consultMode.value = mode
  consultStarted.value = true
  consultConnected.value = false
  if (consultTimer) clearTimeout(consultTimer)
  // 模拟接通过程约2秒
  consultTimer = setTimeout(() => {
    consultConnected.value = true
  }, 2000)
}

function endConsult() {
  consultConnected.value = false
  consultStarted.value = false
  showDoctorConsult.value = false
  if (consultTimer) {
    clearTimeout(consultTimer)
    consultTimer = null
  }
}
</script>

<template>
  <div class="health-page">
    <!-- 标题 -->
    <div class="page-head">
      <h1 class="page-head__title"><AppIcon name="heart-pulse" :size="24" :color="'var(--color-brand)'" /> AI 健康</h1>
      <p class="page-head__sub">全方位守护您的健康</p>
    </div>

    <!-- 护理模式：长者筛选 -->
    <div v-if="userStore.isMinimal" class="block">
      <div class="section-title"><AppIcon name="users" :size="18" /> 长者健康档案</div>
      <div class="elder-filter-scroll">
        <button
          v-for="e in careElders"
          :key="e.id"
          class="elder-filter-chip"
          :class="{ active: selectedElderId === e.id }"
          @click="selectedElderId = e.id"
        >
          <span class="elder-filter-avatar">{{ e.initial }}</span>
          <span class="elder-filter-name">{{ e.name }}</span>
          <span class="elder-filter-age">{{ e.age }}岁</span>
        </button>
      </div>
    </div>

    <!-- 今日健康小贴士（置顶 · 含天气/日期/节气） -->
    <div class="block" v-if="!userStore.isMinimal">
      <div class="section-title"><AppIcon name="lightbulb" :size="18" /> 今日健康小贴士</div>

      <!-- 综合信息卡：天气 + 日期 + 节气 -->
      <div class="info-card">
        <div class="info-card-row">
          <div class="info-block">
            <div class="info-icon">
              <AppIcon :name="greeting.weatherIcon" :size="28" color="#F6A35C" />
            </div>
            <div class="info-body">
              <div class="info-main">{{ greeting.weatherText }} {{ greeting.temp }}</div>
              <div class="info-sub">空气 {{ greeting.airQuality }} · {{ greeting.lunar }}</div>
            </div>
          </div>
          <div class="info-block">
            <div class="info-icon">
              <AppIcon name="calendar-days" :size="28" color="var(--color-brand)" />
            </div>
            <div class="info-body">
              <div class="info-main">{{ greeting.fullDate }}</div>
              <div class="info-sub">{{ greeting.weekday }} · {{ greeting.solarTerm }}节气</div>
            </div>
          </div>
        </div>
        <div class="info-divider"></div>
        <div class="info-term-row">
          <div class="info-term-block current">
            <span class="info-term-tag">当前</span>
            <span class="info-term-name">{{ greeting.solarTerm }}</span>
          </div>
          <div class="info-term-arrow">
            <AppIcon name="arrow-right" :size="16" color="var(--color-text-tertiary)" />
          </div>
          <div class="info-term-block next">
            <span class="info-term-tag">下一节气</span>
            <span class="info-term-name">{{ greeting.nextSolarTerm }}</span>
            <span class="info-term-meta">{{ greeting.nextSolarTermDate }} · 距今 <b>{{ greeting.daysToNextTerm }}</b> 天</span>
          </div>
        </div>
      </div>

      <div class="glass-card tip-card">
        <div class="tip-head">
          <span class="tip-label">夏季养生三注意</span>
          <span class="tip-more" @click="showAlert('更多养生知识正在整理中，敬请期待')">更多</span>
        </div>
        <div class="tip-list">
          <div v-for="(tip, idx) in healthTips" :key="idx" class="tip-item">
            <div class="tip-icon"><AppIcon :name="tip.icon" :size="18" color="var(--color-brand)" /></div>
            <div class="tip-body">
              <div class="tip-title">{{ tip.title }}</div>
              <div class="tip-desc">{{ tip.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 健康评分环 + 今日健康报告入口 -->
    <div class="block">
      <div class="glass-card score-card">
        <div class="score-ring">
          <svg viewBox="0 0 140 140">
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7DCEAF" />
                <stop offset="100%" stop-color="#3E9A80" />
              </linearGradient>
            </defs>
            <circle class="ring-bg" cx="70" cy="70" r="65" />
            <circle
              class="ring-fill"
              cx="70"
              cy="70"
              r="65"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="ringOffset"
            />
          </svg>
          <div class="ring-label">
            <div class="score-number">{{ displayScore }}</div>
            <div class="score-unit">/ 100</div>
          </div>
        </div>
        <div class="score-label">健康评分</div>
        <div class="risk-badge"><AppIcon name="target" :size="14" /> 风险等级: {{ displayRiskLevel }}</div>
        <button class="report-quick-btn" @click="showReport = true">
          <AppIcon name="file-text" :size="16" :color="'#fff'" />
          <span>查看今日健康报告</span>
          <AppIcon name="chevron-right" :size="14" :color="'#fff'" />
        </button>
        <button class="report-history-btn" @click="viewReportHistory">
          <AppIcon name="bar-chart" :size="14" :color="'var(--color-brand-dark)'" />
          <span>历史报告 · 周月年报 · 趋势分析</span>
          <AppIcon name="chevron-right" :size="12" :color="'var(--color-brand-dark)'" />
        </button>
      </div>
    </div>

    <!-- 生命体征 -->
    <div class="block">
      <div class="vital-head">
        <div class="section-title"><AppIcon name="activity" :size="18" /> 生命体征</div>
        <button class="sync-btn" :class="{ syncing }" @click="syncVitals">
          <RefreshCw :size="14" /> {{ syncing ? '同步中...' : '数据同步' }}
        </button>
      </div>
      <div class="vital-grid">
        <div v-for="v in displayVitals" :key="v.label" class="vital-card" @click="askXiaoKang(v.label, `${v.label}当前数值为 ${v.value}${v.unit}，趋势${v.trendText}。正常范围参考：心率60-100bpm，血压<140/90mmHg，血氧≥95%，体温36-37.3°C，睡眠时长7-8小时。`)">
          <div class="vital-icon"><AppIcon :name="v.icon" :size="22" :color="'var(--color-brand)'" /></div>
          <div class="vital-label">{{ v.label }}</div>
          <div class="vital-value">{{ v.value }}<span class="vital-unit">{{ v.unit }}</span></div>
          <div class="vital-trend" :class="v.trend">
            <span>{{ v.trendIcon }}</span> {{ v.trendText }}
          </div>
          <div class="vital-ask"><AppIcon name="message-circle" :size="12" /> 问小康</div>
        </div>
      </div>
    </div>

    <!-- AI风险评估（合并风险评估） -->
    <div class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="shield-check" :size="18" /> AI风险评估</div>
        <button class="risk-analyze-btn" @click="analyzeRisk">
          <AppIcon name="bot" :size="14" /> AI深入分析
        </button>
      </div>
      <p class="block-sub">点击各项评分查看近期详情和规避建议</p>
      <div class="risk-guard-grid">
        <div
          v-for="rg in riskGuardScores"
          :key="rg.key"
          class="rg-card"
          :class="rg.level"
          @click="openRiskGuard(rg)"
        >
          <div class="rg-icon"><AppIcon :name="rg.icon" :size="20" :color="rg.level === 'high' ? 'var(--state-error)' : rg.level === 'mid' ? 'var(--state-warning)' : 'var(--state-success)'" /></div>
          <div class="rg-name">{{ rg.name }}</div>
          <div class="rg-score" :class="rg.level">{{ rg.score }}<span class="rg-score-unit">分</span></div>
          <div class="rg-level-tag" :class="rg.level">{{ rg.level === 'high' ? '高风险' : rg.level === 'mid' ? '中风险' : '低风险' }}</div>
        </div>
      </div>
    </div>

    <!-- 私家教练（护理模式/子女照看模式不显示） -->
    <div class="block" v-if="!userStore.isMinimal && !userStore.isCaregiver">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="dumbbell" :size="18" /> 私家教练</div>
        <span class="more-link" @click="showAlert('查看更多训练方案')">更多</span>
      </div>
      <div class="coach-list">
        <div v-for="(c, idx) in coachPlans" :key="idx" class="coach-card" @click="startCoach(c.title)">
          <div class="coach-icon-wrap" :style="{ background: c.bg }">
            <AppIcon :name="c.icon" :size="24" :color="'#fff'" />
          </div>
          <div class="coach-info">
            <div class="coach-title">{{ c.title }}</div>
            <div class="coach-desc">{{ c.desc }}</div>
            <div class="coach-meta">
              <span class="coach-duration"><AppIcon name="clock" :size="12" /> {{ c.duration }}</span>
              <span class="coach-level">{{ c.level }}</span>
            </div>
          </div>
          <button class="coach-start-btn">开始</button>
        </div>
      </div>
    </div>

    <!-- 在线医生问诊（护理模式/子女照看模式不显示） -->
    <div class="block" v-if="!userStore.isMinimal && !userStore.isCaregiver">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="stethoscope" :size="18" /> 在线医生问诊</div>
        <span class="more-link" @click="showAlert('更多科室医生正在接入中')">更多</span>
      </div>
      <div class="glass-card consult-card">
        <!-- 7×24 小时在线横幅（任务5） -->
        <div class="consult-24h-banner">
          <div class="consult-24h-left">
            <div class="consult-24h-icon">
              <AppIcon name="shield-check" :size="20" :color="'#fff'" />
            </div>
            <div class="consult-24h-text">
              <div class="consult-24h-title">7×24 小时在线 · 随叫随到</div>
              <div class="consult-24h-sub">像家里有一位随叫随到的医生</div>
            </div>
          </div>
          <div class="consult-24h-pulse">
            <span class="pulse-dot"></span>
            <span class="pulse-text">实时在线</span>
          </div>
        </div>

        <!-- 功能特性入口（任务5） -->
        <div class="consult-features">
          <div class="consult-feature-item" @click="showAlert('常见健康问题即时解答：\n\n小康已连接全科医生团队，可即时解答：\n· 头痛、头晕、失眠等常见问题\n· 慢性病日常管理建议\n· 检验报告解读\n\n点击下方医生卡片即可发起问诊。')">
            <div class="consult-feature-icon" style="background: rgba(91,184,158,0.15)">
              <AppIcon name="message-circle" :size="18" :color="'var(--color-brand-dark)'" />
            </div>
            <div class="consult-feature-name">即时解答</div>
            <div class="consult-feature-desc">常见健康问题</div>
          </div>
          <div class="consult-feature-item" @click="showAlert('用药咨询：\n\n专业药师在线解答：\n· 药物相互作用查询\n· 用法用量确认\n· 不良反应咨询\n· 药物储存方法\n\n您也可拍照上传药品说明书，小康自动识别。')">
            <div class="consult-feature-icon" style="background: rgba(246,163,92,0.15)">
              <AppIcon name="pill" :size="18" :color="'#B8741A'" />
            </div>
            <div class="consult-feature-name">用药咨询</div>
            <div class="consult-feature-desc">专业药师</div>
          </div>
          <div class="consult-feature-item" @click="showAlert('急救指导：\n\n突发情况一键呼叫，专业医生远程指导：\n· 跌倒后处理\n· 噎食海姆立克法\n· 中风 FAST 识别\n· 心肺复苏 CPR 步骤\n\n紧急情况请先拨打 120！')">
            <div class="consult-feature-icon" style="background: rgba(231,76,60,0.12)">
              <AppIcon name="shield-alert" :size="18" :color="'#C0392B'" />
            </div>
            <div class="consult-feature-name">急救指导</div>
            <div class="consult-feature-desc">远程指导</div>
          </div>
          <div class="consult-feature-item" @click="showAlert('健康知识科普：\n\n医生为您讲解健康知识：\n· 高血压/糖尿病日常管理\n· 老年人饮食营养\n· 季节性养生要点\n· 慢性病预防\n\n更有「乐活天地-健康知识科普」为您精准推送。')">
            <div class="consult-feature-icon" style="background: rgba(111,177,217,0.15)">
              <AppIcon name="lightbulb" :size="18" :color="'#2E5A88'" />
            </div>
            <div class="consult-feature-name">健康科普</div>
            <div class="consult-feature-desc">专业讲解</div>
          </div>
        </div>

        <div class="consult-tip">
          <AppIcon name="info" :size="13" :color="'var(--color-accent2)'" />
          <span>在线医生可语音/视频答疑，无需奔波</span>
        </div>
        <div class="doctor-list">
          <div
            v-for="doc in onlineDoctors"
            :key="doc.id"
            class="doctor-card"
            :class="{ offline: !doc.online }"
            @click="openDoctorConsult(doc)"
          >
            <div class="doctor-avatar-wrap" :class="{ online: doc.online }">
              <AppIcon :name="doc.avatar" :size="22" :color="doc.online ? '#fff' : 'var(--color-text-tertiary)'" />
              <span v-if="doc.online" class="doctor-online-dot"></span>
            </div>
            <div class="doctor-info">
              <div class="doctor-name-row">
                <span class="doctor-name">{{ doc.name }}</span>
                <span class="doctor-title">{{ doc.title }}</span>
              </div>
              <div class="doctor-hospital">{{ doc.hospital }}</div>
              <div class="doctor-desc">{{ doc.desc }}</div>
              <div class="doctor-meta">
                <span class="doctor-queue" :class="{ busy: doc.queue >= 4 }">
                  <AppIcon name="users" :size="11" /> 前方{{ doc.queue }}人
                </span>
                <span class="doctor-rating">
                  <AppIcon name="star" :size="11" :color="'#F6A35C'" /> {{ doc.rating }}
                </span>
                <span class="doctor-status" :class="doc.online ? 'online' : 'offline'">
                  {{ doc.online ? '在线' : '离线' }}
                </span>
              </div>
            </div>
            <button v-if="doc.online" class="doctor-btn" @click.stop="openDoctorConsult(doc)">
              <AppIcon name="mic" :size="14" :color="'#fff'" />
              <span>问诊</span>
            </button>
            <button v-else class="doctor-btn disabled" disabled>
              <span>不在线</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 记医嘱（护理模式/子女照看模式不显示） -->
    <div class="block" v-if="!userStore.isMinimal && !userStore.isCaregiver">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="clipboard-list" :size="18" /> AI 记医嘱</div>
        <span class="more-link" @click="openMedicalOrders">全部医嘱</span>
      </div>
      <div class="glass-card orders-card">
        <div class="orders-input-row">
          <button class="orders-input-btn photo" @click="inputOrderByPhoto">
            <span class="orders-input-icon"><AppIcon name="camera" :size="20" :color="'#fff'" /></span>
            <span class="orders-input-body">
              <span class="orders-input-title">拍照录入</span>
              <span class="orders-input-desc">拍处方/医嘱单，自动识别</span>
            </span>
          </button>
          <button class="orders-input-btn voice" @click="inputOrderByVoice">
            <span class="orders-input-icon"><AppIcon name="mic" :size="20" :color="'#fff'" /></span>
            <span class="orders-input-body">
              <span class="orders-input-title">语音录入</span>
              <span class="orders-input-desc">口述医嘱，自动转写</span>
            </span>
          </button>
        </div>

        <div class="orders-summary-card">
          <div class="orders-summary-head">
            <span class="orders-summary-title"><AppIcon name="sparkles" :size="14" :color="'var(--color-brand)'" /> 小康已为您汇总记忆</span>
            <span class="orders-summary-count">{{ medicalOrders.length }}条医嘱</span>
          </div>
          <p class="orders-summary-text">{{ medicalOrderSummary }}</p>
          <div class="orders-summary-actions">
            <button class="summary-play-btn" @click="playMedicalSummary">
              <AppIcon :name="playingSummary ? 'pause' : 'play'" :size="14" :color="'#fff'" />
              <span>{{ playingSummary ? '正在朗读...' : '播放汇总' }}</span>
            </button>
            <span class="summary-tip">每日09:00 自动播报提醒</span>
          </div>
        </div>

        <div class="orders-recent-title">近期医嘱</div>
        <div class="orders-recent-list">
          <div
            v-for="order in medicalOrders.slice(0, 2)"
            :key="order.id"
            class="order-item"
            @click="openMedicalOrders"
          >
            <div class="order-item-head">
              <span class="order-source-tag" :class="order.source === '拍照录入' ? 'photo' : 'voice'">
                <AppIcon :name="order.source === '拍照录入' ? 'camera' : 'mic'" :size="11" />
                {{ order.source }}
              </span>
              <span class="order-date">{{ order.date }}</span>
            </div>
            <div class="order-doctor">{{ order.doctor }} · {{ order.hospital }}</div>
            <p class="order-content">{{ order.content.split('\n')[0] }}...</p>
            <div class="order-tags">
              <span v-for="tag in order.tags" :key="tag" class="order-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日用药 -->
    <div class="block">
      <div class="section-title"><AppIcon name="pill" :size="18" /> 今日用药</div>
      <div class="med-sync-tip">
        <AppIcon name="info" :size="13" :color="'var(--color-accent2)'" />
        <span>确认结果会同步给已授权的女儿和家庭医生</span>
      </div>
      <div class="glass-card med-card">
        <div v-for="(m, idx) in displayMedications" :key="idx" class="med-item">
          <div class="med-time">{{ m.time }}</div>
          <div class="med-info">
            <div class="med-name">{{ m.name }}</div>
            <div class="med-detail">{{ m.detail }}</div>
          </div>
          <span class="med-status" :class="m.status"><AppIcon :name="m.icon" :size="14" /> {{ m.statusText }}</span>
        </div>
        <div class="toggle-row">
          <span class="toggle-label">下次用药提醒通知</span>
          <label class="toggle-switch">
            <input type="checkbox" :checked="userStore.medReminderOn" @change="userStore.toggleMedReminder(($event.target as HTMLInputElement).checked)" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- 报告详情弹窗 -->
    <transition name="fade">
      <div v-if="showReport" class="report-mask" @click="showReport = false">
        <div class="report-dialog" @click.stop>
          <div class="report-dialog__title"><AppIcon name="clipboard-list" :size="20" /> 详细健康报告</div>
          <div class="report-dialog__body">
            <p>{{ healthReport }}</p>
            <p class="report-dialog__extra">本周共记录生命体征 42 次，整体健康趋势平稳。建议继续保持规律作息，适当增加户外活动。</p>
          </div>
          <div class="report-dialog__actions">
            <button class="report-dialog__btn ghost" @click="downloadReport">
              <AppIcon name="download" :size="16" /> 下载报告
            </button>
            <button class="report-dialog__btn ghost" @click="shareReport">
              <AppIcon name="share-2" :size="16" /> 转发
            </button>
            <button class="report-dialog__btn" @click="showReport = false">知道了</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 健康报告中心弹窗（历史/周月年报/趋势/异常预警） -->
    <transition name="fade">
      <div v-if="showReportCenter" class="report-mask" @click="showReportCenter = false">
        <div class="report-dialog report-center-dialog" @click.stop>
          <div class="report-dialog__title">
            <AppIcon name="bar-chart" :size="20" /> 健康报告中心
            <button class="report-center-close" @click="showReportCenter = false">
              <AppIcon name="x" :size="18" :color="'var(--color-text-tertiary)'" />
            </button>
          </div>

          <div class="report-center-body">
            <!-- 周期切换 -->
            <div class="period-tabs">
              <button
                v-for="tab in periodTabs"
                :key="tab.key"
                class="period-tab"
                :class="{ active: activePeriod === tab.key }"
                @click="switchPeriod(tab.key)"
              >
                <AppIcon :name="tab.icon" :size="13" />
                <span>{{ tab.label }}</span>
              </button>
            </div>

            <!-- 当前报告内容 -->
            <div class="report-content">
              <div class="report-content-head">
                <div class="report-content-title">{{ currentReport.title }}</div>
                <div class="report-content-date">{{ currentReport.date }}</div>
              </div>

              <!-- 评分与摘要 -->
              <div class="report-score-row">
                <div class="report-score-block">
                  <div class="report-score-num" :class="currentReport.scoreTrend">
                    {{ currentReport.score }}
                    <span class="report-score-unit">分</span>
                  </div>
                  <div class="report-score-trend" :class="currentReport.scoreTrend">
                    <AppIcon
                      :name="currentReport.scoreTrend === 'up' ? 'trending-up' : currentReport.scoreTrend === 'down' ? 'trending-up' : 'activity'"
                      :size="12"
                    />
                    {{ currentReport.scoreTrend === 'up' ? '环比上升' : currentReport.scoreTrend === 'down' ? '环比下降' : '环比持平' }}
                  </div>
                </div>
                <div class="report-summary">
                  <p>{{ currentReport.summary }}</p>
                </div>
              </div>

              <!-- 异常预警（红字提示） -->
              <div v-if="currentReport.abnormalities.length" class="abnormality-section">
                <div class="abnormality-title">
                  <AppIcon name="alert-triangle" :size="14" :color="'#E74C3C'" />
                  <span>异常指标预警</span>
                  <span class="abnormality-count">{{ currentReport.abnormalities.length }} 项需关注</span>
                </div>
                <div class="abnormality-list">
                  <div
                    v-for="(ab, idx) in currentReport.abnormalities"
                    :key="idx"
                    class="abnormality-item"
                    :class="ab.level"
                  >
                    <div class="abnormality-head">
                      <span class="abnormality-indicator">{{ ab.indicator }}</span>
                      <span class="abnormality-level-tag" :class="ab.level">
                        {{ ab.level === 'high' ? '高风险' : '中风险' }}
                      </span>
                    </div>
                    <div class="abnormality-values">
                      <span class="abnormality-value">当前 {{ ab.value }}</span>
                      <span class="abnormality-ref">参考 {{ ab.ref }}</span>
                    </div>
                    <div class="abnormality-suggest">
                      <AppIcon name="lightbulb" :size="11" :color="'var(--color-brand)'" />
                      <span>{{ ab.suggest }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 指标趋势图 -->
              <div class="trend-section">
                <div class="trend-section-title">
                  <AppIcon name="trending-up" :size="14" :color="'var(--color-brand)'" />
                  <span>指标趋势分析</span>
                </div>
                <div class="trend-chart-list">
                  <div
                    v-for="(trend, idx) in currentReport.vitalsTrend"
                    :key="idx"
                    class="trend-chart-card"
                  >
                    <div class="trend-chart-head">
                      <span class="trend-chart-label">{{ trend.label }}</span>
                      <span class="trend-chart-status" :class="trend.status">
                        {{ trend.status === 'warning' ? '需关注' : '正常' }}
                      </span>
                    </div>
                    <svg class="trend-chart-svg" viewBox="0 0 240 60" preserveAspectRatio="none">
                      <path
                        :d="buildTrendPath(trend.data, 240, 60, 6)"
                        :stroke="trend.status === 'warning' ? '#E74C3C' : 'var(--color-brand)'"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        :d="buildTrendPath(trend.data, 240, 60, 6) + ` L234,54 L6,54 Z`"
                        :fill="trend.status === 'warning' ? 'rgba(231,76,60,0.1)' : 'rgba(91,184,158,0.1)'"
                      />
                    </svg>
                    <div class="trend-chart-foot">
                      <span class="trend-chart-min">最低 {{ Math.min(...trend.data) }}{{ trend.unit }}</span>
                      <span class="trend-chart-max">最高 {{ Math.max(...trend.data) }}{{ trend.unit }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 医生建议 -->
              <div class="report-advice-card">
                <div class="report-advice-title">
                  <AppIcon name="lightbulb" :size="14" :color="'var(--color-brand)'" />
                  <span>小康的建议</span>
                </div>
                <p class="report-advice-text">{{ currentReport.advice }}</p>
              </div>
            </div>
          </div>

          <div class="report-dialog__actions">
            <button class="report-dialog__btn ghost" @click="downloadReport">
              <AppIcon name="download" :size="16" /> 下载
            </button>
            <button class="report-dialog__btn" @click="showReportCenter = false">关闭</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 小康详细解释弹窗 -->
    <transition name="fade">
      <div v-if="aiExplaining || aiExplainText" class="report-mask" @click="aiExplainText = ''; aiExplaining = false">
        <div class="report-dialog" @click.stop>
          <div class="report-dialog__title"><AppIcon name="bot" :size="20" /> 小康详细解释</div>
          <div class="report-dialog__body">
            <div v-if="aiExplaining" class="ai-loading">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="ai-loading-text">小康正在分析...</span>
            </div>
            <p v-else class="ai-explain-text" style="white-space: pre-line;">{{ aiExplainText }}</p>
          </div>
          <div v-if="aiExplainText" class="report-dialog__actions">
            <button class="report-dialog__btn ghost" @click="aiExplainText = ''">关闭</button>
            <button class="report-dialog__btn" @click="goChat('请帮我对刚才的健康指标做详细分析和建议')">问小康</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 风险守护详情弹窗 -->
    <transition name="fade">
      <div v-if="showRiskGuard && activeRiskGuard" class="report-mask" @click="showRiskGuard = false">
        <div class="report-dialog rg-dialog" @click.stop>
          <div class="rg-dialog-head">
            <span class="rg-dialog-icon" :class="activeRiskGuard.level"><AppIcon :name="activeRiskGuard.icon" :size="24" /></span>
            <div class="rg-dialog-title">{{ activeRiskGuard.name }}</div>
            <span class="rg-dialog-score" :class="activeRiskGuard.level">{{ activeRiskGuard.score }}分</span>
          </div>
          <div class="rg-dialog-level-tag" :class="activeRiskGuard.level">{{ activeRiskGuard.level === 'high' ? '高风险' : activeRiskGuard.level === 'mid' ? '中风险' : '低风险' }} · {{ activeRiskGuard.summary }}</div>
          <div class="rg-dialog-section">
            <div class="rg-dialog-section-title"><AppIcon name="file-text" :size="14" /> 近期详情</div>
            <p class="rg-dialog-detail">{{ activeRiskGuard.details }}</p>
          </div>
          <div class="rg-dialog-section">
            <div class="rg-dialog-section-title"><AppIcon name="lightbulb" :size="14" /> 规避建议</div>
            <p class="rg-dialog-advice">{{ activeRiskGuard.advice }}</p>
          </div>
          <button class="rg-dialog-chat" @click="goChat(`请帮我分析${activeRiskGuard.name}的情况并给出建议`)">
            <AppIcon name="message-circle" :size="16" :color="'#fff'" />
            <span>联系小康进一步咨询</span>
          </button>
          <button class="report-dialog__btn" @click="showRiskGuard = false">关闭</button>
        </div>
      </div>
    </transition>

    <!-- AI深入分析弹窗 -->
    <transition name="fade">
      <div v-if="showAnalysis" class="report-mask" @click="showAnalysis = false">
        <div class="report-dialog analysis-dialog" @click.stop>
          <div class="report-dialog__title"><AppIcon name="bot" :size="20" /> AI深入分析报告</div>
          <div class="report-dialog__body">
            <div v-if="analyzing" class="ai-loading">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="ai-loading-text">AI正在分析您的健康数据...</span>
            </div>
            <p v-else class="analysis-text" style="white-space: pre-line;">{{ analysisResult }}</p>
          </div>
          <button class="report-dialog__btn" @click="showAnalysis = false">知道了</button>
        </div>
      </div>
    </transition>

    <!-- 在线医生问诊弹窗 -->
    <transition name="fade">
      <div v-if="showDoctorConsult && activeDoctor" class="report-mask" @click="endConsult">
        <div class="report-dialog consult-dialog" @click.stop>
          <div class="consult-dialog-head">
            <div class="consult-doctor-avatar" :class="{ online: activeDoctor.online }">
              <AppIcon :name="activeDoctor.avatar" :size="28" :color="'#fff'" />
            </div>
            <div class="consult-doctor-info">
              <div class="consult-doctor-name">{{ activeDoctor.name }} · {{ activeDoctor.title }}</div>
              <div class="consult-doctor-hospital">{{ activeDoctor.hospital }}</div>
            </div>
            <button class="consult-close-btn" @click="endConsult">
              <AppIcon name="x" :size="18" :color="'var(--color-text-tertiary)'" />
            </button>
          </div>

          <div class="consult-dialog-body">
            <!-- 未接通：选择问诊方式 -->
            <div v-if="!consultConnected" class="consult-connecting">
              <div v-if="consultStarted" class="consult-connect-state">
                <div class="consult-wave">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <p class="consult-connect-text">正在为您接通{{ activeDoctor.name }}医生{{ consultMode === 'voice' ? '语音' : '视频' }}问诊...</p>
                <p class="consult-connect-sub">预计等待 {{ activeDoctor.queue }} 人 · 约 {{ activeDoctor.queue * 2 }} 分钟</p>
              </div>
              <div v-else class="consult-mode-select">
                <p class="consult-mode-tip">请选择问诊方式</p>
                <div class="consult-mode-actions">
                  <button class="consult-mode-btn voice" @click="startConsult('voice')">
                    <span class="consult-mode-icon"><AppIcon name="mic" :size="24" :color="'#fff'" /></span>
                    <span class="consult-mode-label">语音答疑</span>
                    <span class="consult-mode-sub">快速咨询</span>
                  </button>
                  <button class="consult-mode-btn video" @click="startConsult('video')">
                    <span class="consult-mode-icon"><AppIcon name="video" :size="24" :color="'#fff'" /></span>
                    <span class="consult-mode-label">视频问诊</span>
                    <span class="consult-mode-sub">面对面看诊</span>
                  </button>
                </div>
                <p class="consult-mode-note">医生可查看您的健康档案、生命体征和用药记录，提供精准建议</p>
              </div>
            </div>

            <!-- 已接通：问诊进行中 -->
            <div v-else class="consult-active">
              <div class="consult-active-head">
                <span class="consult-active-mode" :class="consultMode">
                  <AppIcon :name="consultMode === 'voice' ? 'mic' : 'video'" :size="14" :color="'#fff'" />
                  {{ consultMode === 'voice' ? '语音问诊中' : '视频问诊中' }}
                </span>
                <span class="consult-active-timer">00:08</span>
              </div>
              <div class="consult-active-wave">
                <span v-for="n in 9" :key="n" :style="{ animationDelay: (n * 0.1) + 's' }"></span>
              </div>
              <div class="consult-active-info">
                <p class="consult-active-tip">{{ activeDoctor.name }}医生正在为您答疑</p>
                <p class="consult-active-sub">{{ activeDoctor.desc }}</p>
              </div>
              <div class="consult-active-actions">
                <button class="consult-action-btn mute">
                  <AppIcon name="mic" :size="20" :color="'#fff'" />
                  <span>静音</span>
                </button>
                <button class="consult-action-btn end" @click="endConsult">
                  <AppIcon name="phone" :size="20" :color="'#fff'" />
                  <span>结束问诊</span>
                </button>
                <button class="consult-action-btn switch">
                  <AppIcon name="volume-2" :size="20" :color="'#fff'" />
                  <span>扬声器</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- AI记医嘱：全部医嘱列表弹窗 -->
    <transition name="fade">
      <div v-if="showMedicalOrders" class="report-mask" @click="showMedicalOrders = false">
        <div class="report-dialog orders-dialog" @click.stop>
          <div class="report-dialog__title">
            <AppIcon name="clipboard-list" :size="20" /> 全部医嘱记录
            <button class="orders-close-btn" @click="showMedicalOrders = false">
              <AppIcon name="x" :size="18" :color="'var(--color-text-tertiary)'" />
            </button>
          </div>
          <div class="orders-dialog-body">
            <div v-for="order in medicalOrders" :key="order.id" class="orders-dialog-item">
              <div class="orders-dialog-item-head">
                <span class="order-source-tag" :class="order.source === '拍照录入' ? 'photo' : 'voice'">
                  <AppIcon :name="order.source === '拍照录入' ? 'camera' : 'mic'" :size="11" />
                  {{ order.source }}
                </span>
                <span class="order-date">{{ order.date }}</span>
              </div>
              <div class="order-doctor">{{ order.doctor }} · {{ order.hospital }}</div>
              <p class="order-content-full" style="white-space: pre-line;">{{ order.content }}</p>
              <div class="order-tags">
                <span v-for="tag in order.tags" :key="tag" class="order-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
          <button class="report-dialog__btn" @click="showMedicalOrders = false">关闭</button>
        </div>
      </div>
    </transition>

    <!-- AI记医嘱：医嘱汇总播放弹窗 -->
    <transition name="fade">
      <div v-if="showMedicalSummary" class="report-mask" @click="stopMedicalSummary(); showMedicalSummary = false">
        <div class="report-dialog summary-dialog" @click.stop>
          <div class="report-dialog__title">
            <AppIcon name="sparkles" :size="20" :color="'var(--color-brand)'" /> 医嘱汇总朗读
          </div>
          <div class="summary-dialog-body">
            <div class="summary-play-wave" :class="{ playing: playingSummary }">
              <span v-for="n in 7" :key="n" :style="{ animationDelay: (n * 0.12) + 's' }"></span>
            </div>
            <p class="summary-play-status">{{ playingSummary ? '小康正在为您朗读医嘱汇总...' : '朗读已暂停' }}</p>
            <p class="summary-play-text" style="white-space: pre-line;">{{ medicalOrderSummary }}</p>
          </div>
          <div class="report-dialog__actions">
            <button v-if="playingSummary" class="report-dialog__btn ghost" @click="stopMedicalSummary">停止朗读</button>
            <button v-else class="report-dialog__btn ghost" @click="playMedicalSummary">继续朗读</button>
            <button class="report-dialog__btn" @click="stopMedicalSummary(); showMedicalSummary = false">关闭</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 统一提示弹窗（替代原生 alert） -->
    <transition name="fade">
      <div v-if="showAppAlert" class="app-alert-mask" @click="showAppAlert = false">
        <div class="app-alert-dialog" @click.stop>
          <div class="app-alert-icon"><AppIcon name="info" :size="36" color="var(--color-brand)" /></div>
          <div class="app-alert-content">{{ appAlertMsg }}</div>
          <button class="app-alert-btn" @click="showAppAlert = false">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.health-page {
  padding: var(--space-4) 0 var(--space-8);
}

.page-head {
  padding: var(--space-2) var(--space-5) var(--space-5);
}
.page-head__title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: var(--weight-extrabold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.page-head__sub {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.block {
  padding: 0 var(--space-5);
  margin-bottom: var(--space-5);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* 生命体征标题栏 + 同步按钮 */
.vital-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.vital-head .section-title {
  margin-bottom: 0;
}
.sync-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(91, 184, 158, 0.12);
  color: var(--color-brand-dark);
  border: 1px solid rgba(91, 184, 158, 0.25);
  border-radius: var(--radius-full);
  padding: 6px var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  font-family: var(--font-display);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.sync-btn:hover {
  background: rgba(91, 184, 158, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(91,184,158,0.15);
}
.sync-btn:active {
  transform: scale(0.96);
}
.sync-btn.syncing {
  opacity: 0.7;
  cursor: wait;
}
.sync-btn.syncing :deep(svg) {
  animation: sync-spin 1s linear infinite;
}
@keyframes sync-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 评分环 */
.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6) var(--space-5) var(--space-5);
}
.score-ring {
  position: relative;
  width: 160px;
  height: 160px;
}
.score-ring svg {
  transform: rotate(-90deg);
  width: 160px;
  height: 160px;
}
.ring-bg {
  fill: none;
  stroke: var(--color-bg-secondary);
  stroke-width: 10;
}
.ring-fill {
  fill: none;
  stroke: url(#greenGradient);
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.5s ease-out;
}
.ring-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.score-number {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: var(--weight-extrabold);
  color: var(--color-brand-dark);
  line-height: 1.1;
}
.score-unit {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--weight-medium);
}
.score-label {
  margin-top: var(--space-1);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--weight-semibold);
}
.risk-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-4);
  padding: 6px var(--space-4);
  border-radius: var(--radius-full);
  background: rgba(91, 184, 158, 0.12);
  color: var(--color-brand-dark);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  font-family: var(--font-display);
}
.report-quick-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: var(--space-4);
  padding: 10px var(--space-4);
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(91,184,158,0.3);
}
.report-quick-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(91,184,158,0.4);
}
.report-quick-btn:active {
  transform: scale(0.97);
}

/* 生命体征 */
.vital-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.vital-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  min-height: 110px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.vital-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(91,184,158,0.12);
  border-color: rgba(91,184,158,0.3);
}
.vital-card:active {
  transform: scale(0.97);
}
.vital-icon {
  display: flex;
  align-items: center;
  color: var(--color-brand);
  margin-bottom: var(--space-2);
}
.vital-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
  font-family: var(--font-display);
  font-weight: var(--weight-medium);
}
.vital-value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  line-height: 1.2;
}
.vital-trend {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  font-family: var(--font-display);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: 4px;
}
.vital-trend.normal {
  color: var(--state-success);
}
.vital-trend.warning {
  color: var(--state-warning);
}

/* 风险评估 */
.risk-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.risk-item {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  padding: 14px;
}
.risk-item.high {
  border-left: 3px solid var(--state-error);
  background: rgba(212, 107, 107, 0.06);
}
.risk-item.mid {
  border-left: 3px solid var(--state-warning);
}
.risk-item-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.risk-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.risk-dot.green {
  background: var(--state-success);
}
.risk-dot.gold {
  background: var(--state-warning);
}
.risk-dot.red {
  background: var(--state-error);
}
.risk-name {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--weight-semibold);
  font-family: var(--font-display);
}
.risk-level {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  font-family: var(--font-display);
}
.risk-level.low {
  color: var(--state-success);
}
.risk-level.mid {
  color: var(--state-warning);
}
.risk-level.high {
  color: var(--state-error);
}
.risk-advice {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(212, 107, 107, 0.08);
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.risk-advice span {
  flex: 1;
}

/* 报告 */
.report-card {
  padding: var(--space-5);
}
.report-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--color-brand);
  color: var(--color-text-on-brand);
  border: none;
  border-radius: var(--radius-full);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  font-family: var(--font-display);
  min-height: 48px;
  cursor: pointer;
  transition: transform var(--transition-fast), background var(--transition-fast);
  width: 100%;
}
.btn-primary:active {
  transform: scale(0.97);
  background: var(--color-brand-dark);
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.risk-analyze-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.3);
}
.risk-analyze-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.4);
}
.risk-analyze-btn:active { transform: scale(0.95); }

.analysis-dialog {
  max-height: 75vh;
}
.analysis-text {
  font-size: 0.9rem;
  color: var(--color-text-primary);
  line-height: 1.8;
}

/* 用药提醒 */
.med-card {
  padding: var(--space-4) var(--space-5);
}
.med-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid rgba(229, 233, 237, 0.5);
}
.med-item:last-of-type {
  border-bottom: none;
}
.med-time {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  white-space: nowrap;
  min-width: 44px;
  padding-top: 2px;
}
.med-info {
  flex: 1;
}
.med-name {
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  font-family: var(--font-display);
}
.med-detail {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
.med-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  font-family: var(--font-display);
  padding: 4px var(--space-3);
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
}
.med-status.taken {
  background: rgba(91, 184, 158, 0.12);
  color: var(--color-brand-dark);
}
.med-status.pending {
  background: rgba(232, 184, 124, 0.15);
  color: var(--color-accent3-dark);
}

/* 开关 */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) 0 var(--space-1);
}
.toggle-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
.toggle-switch {
  position: relative;
  width: 48px;
  height: 28px;
  flex-shrink: 0;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--color-border-solid);
  border-radius: var(--radius-full);
  transition: background var(--transition-fast);
}
.toggle-slider::before {
  content: '';
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform var(--transition-fast);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}
.toggle-switch input:checked + .toggle-slider {
  background-color: var(--color-brand);
}
.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* 小贴士 */
.tip-card {
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.08), rgba(111, 177, 217, 0.06));
  border: 1px solid rgba(91, 184, 158, 0.2);
  padding: var(--space-4);
}
.tip-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.tip-label {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.tip-more {
  font-size: var(--text-sm);
  color: var(--color-brand);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.2s;
}
.tip-more:hover { color: var(--color-brand-dark); transform: translateX(2px); }
.tip-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.tip-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(91, 184, 158, 0.15);
  border-radius: 12px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.tip-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.1);
  border-color: rgba(91, 184, 158, 0.3);
}
.tip-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.15), rgba(91, 184, 158, 0.08));
  flex-shrink: 0;
  margin-top: 2px;
}
.tip-body { flex: 1; min-width: 0; }
.tip-title {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.tip-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* 综合信息卡：天气/日期/节气 */
.info-card {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.08), rgba(111, 177, 217, 0.06));
  border: 1px solid rgba(91, 184, 158, 0.22);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.06);
  margin-bottom: var(--space-3);
}
.info-card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.info-block {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(91, 184, 158, 0.15);
}
.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
  flex-shrink: 0;
}
.info-body { flex: 1; min-width: 0; }
.info-main {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin-bottom: 2px;
}
.info-sub {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  line-height: 1.3;
}
.info-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(91, 184, 158, 0.25), transparent);
  margin: var(--space-3) 0;
}
.info-term-row {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
}
.info-term-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(91, 184, 158, 0.15);
}
.info-term-block.current {
  background: linear-gradient(135deg, rgba(232, 184, 124, 0.15), rgba(232, 184, 124, 0.08));
  border-color: rgba(232, 184, 124, 0.3);
}
.info-term-block.next {
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.15), rgba(91, 184, 158, 0.08));
  border-color: rgba(91, 184, 158, 0.3);
}
.info-term-tag {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}
.info-term-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.1;
}
.info-term-meta {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}
.info-term-meta b {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--color-brand-dark);
  font-weight: 800;
  margin: 0 2px;
}
.info-term-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 2px;
}

/* 报告弹窗 */
.report-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.45);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}
.report-dialog {
  width: 100%;
  max-width: 340px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-float);
}
.report-dialog__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.report-dialog__body p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-3);
}
.report-dialog__extra {
  color: var(--color-text-tertiary) !important;
}
.report-dialog__btn {
  display: block;
  width: 100%;
  min-height: 48px;
  margin-top: var(--space-2);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-brand);
  color: var(--color-text-on-brand);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(91,184,158,0.2);
}
.report-dialog__btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(91,184,158,0.32); }
.report-dialog__btn:active {
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

/* 生命体征新样式 */
.vital-card {
  position: relative;
  cursor: pointer;
}
.vital-unit {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--color-text-tertiary);
  margin-left: 3px;
}
.vital-ask {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px dashed var(--color-border);
  font-size: 0.6875rem;
  color: var(--color-brand);
  font-weight: 600;
}

/* 区块副标题 */
.block-sub {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
  margin-top: calc(-1 * var(--space-2));
}

/* 用药同步提示 */
.med-sync-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-2) var(--space-3);
  background: rgba(111, 177, 217, 0.08);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}

/* 风险守护 */
.risk-guard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.rg-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.rg-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,184,158,0.12); border-color: rgba(91,184,158,0.3); }
.rg-card:active { transform: scale(0.97); }
.rg-card.high {
  border-left: 3px solid var(--state-error);
  background: rgba(212, 107, 107, 0.05);
}
.rg-card.mid {
  border-left: 3px solid var(--state-warning);
}
.rg-icon {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-2);
}
.rg-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}
.rg-score {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-extrabold);
  line-height: 1;
}
.rg-score-unit {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  margin-left: 2px;
}
.rg-score.high { color: var(--state-error); }
.rg-score.mid { color: var(--state-warning); }
.rg-score.low { color: var(--state-success); }
.rg-level-tag {
  display: inline-block;
  margin-top: var(--space-2);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 0.625rem;
  font-weight: 600;
  font-family: var(--font-display);
}
.rg-level-tag.high { background: rgba(212, 107, 107, 0.15); color: var(--state-error); }
.rg-level-tag.mid { background: rgba(232, 184, 124, 0.15); color: var(--state-warning); }
.rg-level-tag.low { background: rgba(91, 184, 158, 0.15); color: var(--state-success); }

/* 小康解释弹窗 */
.ai-loading {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-4) 0;
}
.ai-loading .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand);
  animation: dot-bounce 1.2s ease-in-out infinite;
}
.ai-loading .dot:nth-child(2) { animation-delay: 0.2s; }
.ai-loading .dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}
.ai-loading-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-left: var(--space-1);
}
.ai-explain-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.7;
}
.report-dialog__actions {
  display: flex;
  gap: var(--space-2);
}
.report-dialog__actions .report-dialog__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 0;
  white-space: nowrap;
}
.report-dialog__btn.ghost {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid rgba(91, 184, 158, 0.25);
}
.report-dialog__btn.ghost:hover {
  background: rgba(91, 184, 158, 0.08);
  border-color: rgba(91, 184, 158, 0.4);
}

/* 风险守护详情弹窗 */
.rg-dialog {
  max-height: 80vh;
  overflow-y: auto;
}
.rg-dialog-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.rg-dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
}
.rg-dialog-icon.high { background: rgba(212, 107, 107, 0.12); color: var(--state-error); }
.rg-dialog-icon.mid { background: rgba(232, 184, 124, 0.12); color: var(--state-warning); }
.rg-dialog-icon.low { background: rgba(91, 184, 158, 0.12); color: var(--state-success); }
.rg-dialog-title {
  flex: 1;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.rg-dialog-score {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-extrabold);
}
.rg-dialog-score.high { color: var(--state-error); }
.rg-dialog-score.mid { color: var(--state-warning); }
.rg-dialog-score.low { color: var(--state-success); }
.rg-dialog-level-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  margin-bottom: var(--space-4);
  font-family: var(--font-display);
}
.rg-dialog-level-tag.high { background: rgba(212, 107, 107, 0.12); color: var(--state-error); }
.rg-dialog-level-tag.mid { background: rgba(232, 184, 124, 0.12); color: var(--state-warning); }
.rg-dialog-level-tag.low { background: rgba(91, 184, 158, 0.12); color: var(--state-success); }
.rg-dialog-section {
  margin-bottom: var(--space-4);
}
.rg-dialog-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.rg-dialog-detail {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
  padding: var(--space-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}
.rg-dialog-advice {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin: 0;
  padding: var(--space-3);
  background: rgba(91, 184, 158, 0.06);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-brand);
}
.rg-dialog-chat {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 48px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  border: none;
  color: #fff;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  margin-bottom: var(--space-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(91,184,158,0.3);
}
.rg-dialog-chat:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(91,184,158,0.4); }

/* 统一提示弹窗（替代原生 alert） */
.app-alert-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}
.app-alert-dialog {
  width: 100%;
  max-width: 320px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-5);
  box-shadow: var(--shadow-float);
  text-align: center;
  animation: dialog-pop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.app-alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto var(--space-4);
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.15), rgba(91, 184, 158, 0.08));
  border: 1px solid rgba(91, 184, 158, 0.2);
}
.app-alert-content {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
  white-space: pre-line;
  margin-bottom: var(--space-5);
}
.app-alert-btn {
  width: 100%;
  min-height: 48px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  border: none;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.app-alert-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(91, 184, 158, 0.4);
}
.app-alert-btn:active { transform: scale(0.97); }
.rg-dialog-chat:active { transform: scale(0.97); }

/* 护理模式：长者筛选器 */
.elder-filter-scroll {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  padding-bottom: var(--space-2);
}
.elder-filter-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}
.elder-filter-chip:hover { transform: translateY(-2px); border-color: rgba(91,184,158,0.4); box-shadow: 0 4px 12px rgba(91,184,158,0.1); }
.elder-filter-chip:active { transform: scale(0.96); }
.elder-filter-chip.active {
  border-color: var(--color-brand);
  background: rgba(91,184,158,0.08);
}
.elder-filter-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}
.elder-filter-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}
.elder-filter-age {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* 私家教练 */
.more-link { font-size: var(--text-sm); color: var(--color-brand); cursor: pointer; font-weight: 500; }
.coach-list { display: flex; flex-direction: column; gap: var(--space-3); }
.coach-card {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-4); border-radius: var(--radius-md);
  background: var(--color-surface-solid);
  border: 1px solid rgba(91, 184, 158, 0.1);
  box-shadow: 0 1px 2px rgba(91, 184, 158, 0.06), 0 4px 12px rgba(45, 52, 54, 0.05);
  cursor: pointer; transition: all var(--transition-normal);
}
.coach-card:hover { transform: translateY(-3px); box-shadow: 0 2px 4px rgba(91, 184, 158, 0.1), 0 8px 24px rgba(91, 184, 158, 0.12); }
.coach-card:active { transform: scale(0.98); }
.coach-icon-wrap { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(255, 142, 142, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3); }
.coach-info { flex: 1; min-width: 0; }
.coach-title { font-size: var(--text-sm); font-weight: 700; color: var(--color-text-primary); margin-bottom: 2px; }
.coach-desc { font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: 4px; }
.coach-meta { display: flex; gap: var(--space-2); }
.coach-duration { font-size: 0.625rem; color: var(--color-text-tertiary); display: flex; align-items: center; gap: 2px; }
.coach-level { font-size: 0.625rem; padding: 1px 6px; border-radius: var(--radius-full); background: rgba(91,184,158,0.1); color: var(--color-brand-dark); font-weight: 600; }
.coach-start-btn {
  padding: 6px 16px; border: none; border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff; font-size: 0.75rem; font-weight: 700; cursor: pointer; flex-shrink: 0;
  transition: all var(--transition-fast); box-shadow: 0 2px 6px rgba(91, 184, 158, 0.3);
}
.coach-start-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(91, 184, 158, 0.4); filter: brightness(1.05); }
.coach-start-btn:active { transform: scale(0.95); }

/* ===== 在线医生问诊 ===== */
.consult-card {
  padding: var(--space-3) var(--space-4);
}
.consult-tip {
  display: flex; align-items: center; gap: 6px;
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-3);
  background: rgba(111, 177, 217, 0.1);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}
.doctor-list {
  display: flex; flex-direction: column; gap: var(--space-2);
}
.doctor-card {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(91, 184, 158, 0.12);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.doctor-card:hover {
  transform: translateY(-1px);
  border-color: rgba(91, 184, 158, 0.3);
  box-shadow: 0 4px 14px rgba(45, 52, 54, 0.08);
}
.doctor-card.offline {
  opacity: 0.55;
  cursor: not-allowed;
}
.doctor-avatar-wrap {
  position: relative;
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(91, 184, 158, 0.15);
  flex-shrink: 0;
}
.doctor-avatar-wrap.online {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  box-shadow: 0 4px 10px rgba(91, 184, 158, 0.3);
}
.doctor-online-dot {
  position: absolute; right: 0; bottom: 0;
  width: 10px; height: 10px;
  background: #4ade80;
  border: 2px solid #fff;
  border-radius: 50%;
}
.doctor-info { flex: 1; min-width: 0; }
.doctor-name-row {
  display: flex; align-items: baseline; gap: 6px;
  margin-bottom: 2px;
}
.doctor-name {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.doctor-title {
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
}
.doctor-hospital {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
}
.doctor-desc {
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.doctor-meta {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.625rem;
}
.doctor-queue {
  display: inline-flex; align-items: center; gap: 2px;
  padding: 2px 6px;
  background: rgba(91, 184, 158, 0.1);
  color: var(--color-brand-dark);
  border-radius: var(--radius-full);
}
.doctor-queue.busy {
  background: rgba(246, 163, 92, 0.15);
  color: #C97A2B;
}
.doctor-rating {
  display: inline-flex; align-items: center; gap: 2px;
  color: var(--color-text-secondary);
}
.doctor-status {
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-weight: 600;
}
.doctor-status.online {
  background: rgba(74, 222, 128, 0.15);
  color: #16a34a;
}
.doctor-status.offline {
  background: rgba(148, 163, 184, 0.15);
  color: var(--color-text-tertiary);
}
.doctor-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(91, 184, 158, 0.3);
  transition: all var(--transition-fast);
}
.doctor-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.4);
  filter: brightness(1.05);
}
.doctor-btn.disabled {
  background: rgba(148, 163, 184, 0.3);
  cursor: not-allowed;
  box-shadow: none;
}

/* ===== AI 记医嘱 ===== */
.orders-card {
  padding: var(--space-3) var(--space-4);
}
.orders-input-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.orders-input-btn {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}
.orders-input-btn.photo {
  background: linear-gradient(135deg, #FFB199, #FF8E8E);
  box-shadow: 0 4px 12px rgba(255, 142, 142, 0.3);
}
.orders-input-btn.voice {
  background: linear-gradient(135deg, #C8F0E0, #5BB89E);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.orders-input-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow: 0 6px 16px rgba(91, 184, 158, 0.4);
}
.orders-input-icon {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.orders-input-body {
  display: flex; flex-direction: column; gap: 1px;
  min-width: 0;
}
.orders-input-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: #fff;
}
.orders-input-desc {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.orders-summary-card {
  padding: var(--space-3);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.08), rgba(91, 184, 158, 0.15));
  border: 1px solid rgba(91, 184, 158, 0.2);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-3);
}
.orders-summary-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-2);
}
.orders-summary-title {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-brand-dark);
}
.orders-summary-count {
  font-size: 0.625rem;
  color: var(--color-text-tertiary);
  padding: 2px 8px;
  background: rgba(91, 184, 158, 0.1);
  border-radius: var(--radius-full);
}
.orders-summary-text {
  font-size: 0.75rem;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0 0 var(--space-2);
  white-space: pre-line;
  max-height: 90px;
  overflow-y: auto;
}
.orders-summary-actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-2);
}
.summary-play-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.3);
  transition: all var(--transition-fast);
}
.summary-play-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.4);
}
.summary-tip {
  font-size: 0.625rem;
  color: var(--color-text-tertiary);
}
.orders-recent-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.orders-recent-list {
  display: flex; flex-direction: column; gap: var(--space-2);
}
.order-item {
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(91, 184, 158, 0.1);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.order-item:hover {
  transform: translateY(-1px);
  border-color: rgba(91, 184, 158, 0.3);
  box-shadow: 0 4px 12px rgba(45, 52, 54, 0.08);
}
.order-item-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.order-source-tag {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 0.625rem;
  font-weight: 600;
}
.order-source-tag.photo {
  background: rgba(255, 142, 142, 0.15);
  color: #C05050;
}
.order-source-tag.voice {
  background: rgba(91, 184, 158, 0.15);
  color: var(--color-brand-dark);
}
.order-date {
  font-size: 0.625rem;
  color: var(--color-text-tertiary);
}
.order-doctor {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}
.order-content {
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
  margin: 0 0 6px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-content-full {
  font-size: 0.75rem;
  color: var(--color-text-primary);
  margin: 0 0 6px;
  line-height: 1.6;
}
.order-tags {
  display: flex; flex-wrap: wrap; gap: 4px;
}
.order-tag {
  font-size: 0.625rem;
  padding: 1px 8px;
  background: rgba(91, 184, 158, 0.1);
  color: var(--color-brand-dark);
  border-radius: var(--radius-full);
}

/* ===== 在线医生问诊弹窗 ===== */
.consult-dialog {
  max-width: 380px;
  width: calc(100% - 32px);
}
.consult-dialog-head {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--glass-border);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.08), rgba(91, 184, 158, 0.02));
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.consult-doctor-avatar {
  width: 52px; height: 52px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
  flex-shrink: 0;
}
.consult-doctor-info { flex: 1; min-width: 0; }
.consult-doctor-name {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.consult-doctor-hospital {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-top: 2px;
}
.consult-close-btn {
  width: 32px; height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.1);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast);
}
.consult-close-btn:hover {
  background: rgba(148, 163, 184, 0.2);
  transform: rotate(90deg);
}
.consult-dialog-body {
  padding: var(--space-5) var(--space-4);
}
.consult-connecting {
  text-align: center;
}
.consult-connect-state {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
  padding: var(--space-4) 0;
}
.consult-wave {
  display: flex; align-items: center; gap: 4px;
  height: 40px;
}
.consult-wave span {
  width: 4px; height: 100%;
  background: linear-gradient(180deg, var(--color-brand), var(--color-brand-dark));
  border-radius: 2px;
  animation: consult-wave-anim 1.2s ease-in-out infinite;
}
.consult-wave span:nth-child(1) { animation-delay: 0s; height: 60%; }
.consult-wave span:nth-child(2) { animation-delay: 0.15s; height: 80%; }
.consult-wave span:nth-child(3) { animation-delay: 0.3s; height: 100%; }
.consult-wave span:nth-child(4) { animation-delay: 0.45s; height: 80%; }
.consult-wave span:nth-child(5) { animation-delay: 0.6s; height: 60%; }
@keyframes consult-wave-anim {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}
.consult-connect-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: 600;
  margin: 0;
}
.consult-connect-sub {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin: 0;
}
.consult-mode-select {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
}
.consult-mode-tip {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}
.consult-mode-actions {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);
  width: 100%;
}
.consult-mode-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: var(--space-4) var(--space-3);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.consult-mode-btn.voice {
  background: linear-gradient(135deg, #C8F0E0, #5BB89E);
  box-shadow: 0 6px 18px rgba(91, 184, 158, 0.3);
}
.consult-mode-btn.video {
  background: linear-gradient(135deg, #FFB199, #FF8E8E);
  box-shadow: 0 6px 18px rgba(255, 142, 142, 0.3);
}
.consult-mode-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}
.consult-mode-icon {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex; align-items: center; justify-content: center;
}
.consult-mode-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: #fff;
}
.consult-mode-sub {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.9);
}
.consult-mode-note {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
  margin: var(--space-2) 0 0;
  text-align: center;
  line-height: 1.5;
}
.consult-active {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
}
.consult-active-head {
  display: flex; align-items: center; gap: var(--space-3);
}
.consult-active-mode {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 600;
  color: #fff;
}
.consult-active-mode.voice {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
}
.consult-active-mode.video {
  background: linear-gradient(135deg, #FF8E8E, #FD6585);
}
.consult-active-timer {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.consult-active-wave {
  display: flex; align-items: center; justify-content: center; gap: 3px;
  height: 60px;
  margin: var(--space-2) 0;
}
.consult-active-wave span {
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-brand), var(--color-brand-dark));
  border-radius: 2px;
  animation: consult-wave-anim 1s ease-in-out infinite;
}
.consult-active-info { text-align: center; }
.consult-active-tip {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 4px;
}
.consult-active-sub {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: 0;
}
.consult-active-actions {
  display: flex; align-items: center; justify-content: center; gap: var(--space-4);
  margin-top: var(--space-3);
}
.consult-action-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: var(--space-2);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.625rem;
  color: #fff;
  font-weight: 600;
  transition: all var(--transition-fast);
  min-width: 64px;
}
.consult-action-btn.mute {
  background: rgba(111, 177, 217, 0.8);
  box-shadow: 0 4px 10px rgba(111, 177, 217, 0.3);
}
.consult-action-btn.switch {
  background: rgba(91, 184, 158, 0.8);
  box-shadow: 0 4px 10px rgba(91, 184, 158, 0.3);
}
.consult-action-btn.end {
  background: linear-gradient(135deg, #FF6B6B, #E74C3C);
  box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
}
.consult-action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

/* ===== AI记医嘱弹窗 ===== */
.orders-dialog {
  max-width: 380px;
  width: calc(100% - 32px);
  max-height: 80vh;
  display: flex; flex-direction: column;
}
.orders-dialog .report-dialog__title {
  display: flex; align-items: center; gap: 6px;
  justify-content: space-between;
}
.orders-close-btn {
  margin-left: auto;
  width: 28px; height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.1);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast);
}
.orders-close-btn:hover {
  background: rgba(148, 163, 184, 0.2);
  transform: rotate(90deg);
}
.orders-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2) var(--space-4);
  display: flex; flex-direction: column; gap: var(--space-3);
}
.orders-dialog-item {
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
}
.orders-dialog-item-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}

/* ===== 医嘱汇总播放弹窗 ===== */
.summary-dialog {
  max-width: 380px;
  width: calc(100% - 32px);
}
.summary-dialog-body {
  padding: var(--space-4);
  text-align: center;
}
.summary-play-wave {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  height: 50px;
  margin-bottom: var(--space-3);
}
.summary-play-wave span {
  width: 4px; height: 100%;
  background: linear-gradient(180deg, var(--color-brand), var(--color-brand-dark));
  border-radius: 2px;
  animation: consult-wave-anim 1.2s ease-in-out infinite;
  opacity: 0.4;
}
.summary-play-wave.playing span {
  opacity: 1;
}
.summary-play-wave:not(.playing) span {
  animation: none;
  transform: scaleY(0.4);
}
.summary-play-status {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-brand-dark);
  margin: 0 0 var(--space-3);
}
.summary-play-text {
  font-size: 0.75rem;
  color: var(--color-text-primary);
  line-height: 1.7;
  margin: 0;
  text-align: left;
  background: rgba(91, 184, 158, 0.06);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(91, 184, 158, 0.12);
}

/* ===== 在线问诊 7×24 横幅 + 功能特性（任务5） ===== */
.consult-24h-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.18), rgba(91, 184, 158, 0.06));
  border: 1px solid rgba(91, 184, 158, 0.25);
  border-radius: var(--radius-sm);
}
.consult-24h-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.consult-24h-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(91, 184, 158, 0.35);
  flex-shrink: 0;
}
.consult-24h-text {
  flex: 1;
  min-width: 0;
}
.consult-24h-title {
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-brand-dark);
  margin-bottom: 2px;
}
.consult-24h-sub {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
}
.consult-24h-pulse {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(91, 184, 158, 0.15);
  border-radius: 12px;
}
.consult-24h-pulse .pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-brand);
  box-shadow: 0 0 0 0 rgba(91, 184, 158, 0.6);
  animation: consultPulse 1.8s infinite;
}
@keyframes consultPulse {
  0% { box-shadow: 0 0 0 0 rgba(91, 184, 158, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(91, 184, 158, 0); }
  100% { box-shadow: 0 0 0 0 rgba(91, 184, 158, 0); }
}
.consult-24h-pulse .pulse-text {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-brand-dark);
}
.consult-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.consult-feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: var(--space-2) 4px;
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}
.consult-feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border-color: rgba(91, 184, 158, 0.3);
}
.consult-feature-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.consult-feature-name {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.consult-feature-desc {
  font-size: 0.6rem;
  color: var(--color-text-tertiary);
}

/* ===== 历史报告入口按钮 ===== */
.report-history-btn {
  width: 100%;
  min-height: 38px;
  margin-top: var(--space-3);
  padding: 0 var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: rgba(91, 184, 158, 0.08);
  border: 1px solid rgba(91, 184, 158, 0.25);
  border-radius: var(--radius-sm);
  color: var(--color-brand-dark);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}
.report-history-btn span {
  flex: 1;
  text-align: left;
}
.report-history-btn:hover {
  background: rgba(91, 184, 158, 0.16);
  border-color: rgba(91, 184, 158, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.18);
}

/* ===== 健康报告中心弹窗 ===== */
.report-center-dialog {
  max-width: 380px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-5);
}
.report-center-dialog .report-dialog__title {
  position: relative;
  margin-bottom: var(--space-3);
  padding-right: 32px;
}
.report-center-close {
  position: absolute;
  right: -4px;
  top: -2px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}
.report-center-close:hover {
  background: rgba(0, 0, 0, 0.06);
}
.report-center-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  margin-right: -4px;
}
.report-center-body::-webkit-scrollbar {
  width: 4px;
}
.report-center-body::-webkit-scrollbar-thumb {
  background: rgba(91, 184, 158, 0.35);
  border-radius: 2px;
}
.report-center-body::-webkit-scrollbar-track {
  background: transparent;
}

/* ===== 周期切换标签 ===== */
.period-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  padding: var(--space-2);
  background: rgba(91, 184, 158, 0.06);
  border-radius: var(--radius-sm);
}
.period-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: var(--space-2) 0;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}
.period-tab:hover {
  background: rgba(91, 184, 158, 0.12);
  color: var(--color-brand-dark);
}
.period-tab.active {
  background: var(--color-brand);
  color: var(--color-text-on-brand);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.32);
}

/* ===== 报告内容 ===== */
.report-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.report-content-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
}
.report-content-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}
.report-content-date {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

/* ===== 评分块 ===== */
.report-score-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.report-score-block {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 84px;
  padding: var(--space-3) 0;
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.12), rgba(91, 184, 158, 0.04));
  border-radius: var(--radius-sm);
  border: 1px solid rgba(91, 184, 158, 0.18);
}
.report-score-num {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: var(--weight-bold);
  line-height: 1;
  color: var(--color-brand-dark);
}
.report-score-num.up { color: #E74C3C; }
.report-score-num.down { color: var(--color-brand); }
.report-score-num.flat { color: var(--color-text-secondary); }
.report-score-unit {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  margin-left: 2px;
}
.report-score-trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  font-weight: var(--weight-medium);
}
.report-score-trend.up { color: #E74C3C; }
.report-score-trend.down { color: var(--color-brand); }
.report-score-trend.flat { color: var(--color-text-tertiary); }
.report-summary {
  flex: 1;
  min-width: 0;
}
.report-summary p {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* ===== 异常预警（红字提示） ===== */
.abnormality-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.06), rgba(231, 76, 60, 0.02));
  border: 1px solid rgba(231, 76, 60, 0.2);
  border-radius: var(--radius-sm);
}
.abnormality-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: #E74C3C;
}
.abnormality-count {
  margin-left: auto;
  font-size: 10px;
  font-weight: var(--weight-medium);
  color: #E74C3C;
  background: rgba(231, 76, 60, 0.12);
  padding: 2px 8px;
  border-radius: 10px;
}
.abnormality-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.abnormality-item {
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-solid);
  border-radius: 8px;
  border-left: 3px solid;
}
.abnormality-item.high {
  border-left-color: #E74C3C;
  background: rgba(231, 76, 60, 0.04);
}
.abnormality-item.mid {
  border-left-color: #F39C12;
  background: rgba(243, 156, 18, 0.04);
}
.abnormality-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.abnormality-indicator {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}
.abnormality-level-tag {
  font-size: 10px;
  font-weight: var(--weight-semibold);
  padding: 2px 8px;
  border-radius: 10px;
}
.abnormality-level-tag.high {
  color: #fff;
  background: #E74C3C;
}
.abnormality-level-tag.mid {
  color: #fff;
  background: #F39C12;
}
.abnormality-values {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: 4px;
  font-size: 11px;
}
.abnormality-value {
  color: #E74C3C;
  font-weight: var(--weight-semibold);
}
.abnormality-ref {
  color: var(--color-text-tertiary);
}
.abnormality-suggest {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* ===== 指标趋势图 ===== */
.trend-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.trend-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}
.trend-chart-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}
.trend-chart-card {
  padding: var(--space-2);
  background: rgba(91, 184, 158, 0.04);
  border: 1px solid rgba(91, 184, 158, 0.12);
  border-radius: 8px;
}
.trend-chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.trend-chart-label {
  font-size: 11px;
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
}
.trend-chart-status {
  font-size: 10px;
  font-weight: var(--weight-semibold);
  padding: 1px 6px;
  border-radius: 8px;
}
.trend-chart-status.warning {
  color: #E74C3C;
  background: rgba(231, 76, 60, 0.12);
}
.trend-chart-status.normal {
  color: var(--color-brand);
  background: rgba(91, 184, 158, 0.12);
}
.trend-chart-svg {
  width: 100%;
  height: 48px;
  display: block;
}
.trend-chart-foot {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  font-size: 10px;
  color: var(--color-text-tertiary);
}

/* ===== 医生建议 ===== */
.report-advice-card {
  padding: var(--space-3);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.1), rgba(91, 184, 158, 0.02));
  border: 1px solid rgba(91, 184, 158, 0.2);
  border-radius: var(--radius-sm);
}
.report-advice-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-brand-dark);
  margin-bottom: var(--space-2);
}
.report-advice-text {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.7;
  white-space: pre-line;
}
</style>
