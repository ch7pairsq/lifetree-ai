<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RefreshCw } from 'lucide-vue-next'
import { vitals, medications, healthReport, healthTip, healthTips, riskGuardScores, greeting } from '@/mock'
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
</style>
