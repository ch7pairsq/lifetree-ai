<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { greeting, quickHealth, todayPlan, todaySchedule, services, companionAvatar, familyContacts, lifeServices, homeInspections, userProfile } from '@/mock'
import { useUserStore } from '@/stores/user'
import AppIcon from '@/components/AppIcon.vue'
import BookingFlow from '@/components/BookingFlow.vue'

const router = useRouter()
const userStore = useUserStore()
const showBooking = ref(false)

// 今日AI生活规划：默认展示前6条，点击查看更多展示全部
const showAllSchedule = ref(false)
const displaySchedule = computed(() =>
  showAllSchedule.value ? todaySchedule : todaySchedule.slice(0, 6)
)

// 生活服务弹窗
const showLifeService = ref(false)
const activeService = ref<typeof lifeServices[number] | null>(null)
function openLifeService(svc: typeof lifeServices[number]) {
  activeService.value = svc
  showLifeService.value = true
}
function bookService(name: string) {
  showAlert(`已预约：${name}\n小康会帮您安排具体时间，请留意电话通知。`)
  showLifeService.value = false
}

function goRoute(path: string) {
  router.push(path)
}

// 统一自定义提示弹窗（替代原生 alert）
const showAppAlert = ref(false)
const appAlertMsg = ref('')
function showAlert(msg: string) {
  appAlertMsg.value = msg
  showAppAlert.value = true
}

// 长按3秒 SOS 求助（高龄长辈 / 视障语音共用）
const sosPressing = ref(false)
const sosProgress = ref(0)
let sosTimer: ReturnType<typeof setInterval> | null = null
let sosStartTime = 0

function startSosPress() {
  if (sosPressing.value) return
  sosPressing.value = true
  sosProgress.value = 0
  sosStartTime = Date.now()
  sosTimer = setInterval(() => {
    const elapsed = Date.now() - sosStartTime
    sosProgress.value = Math.min(elapsed / 3000, 1)
    if (elapsed >= 3000) {
      clearSosTimer()
      sosPressing.value = false
      sosProgress.value = 0
      showAlert('求助已发出！\n已通知女儿小芳和社区护理员，正在共享您的位置。')
    }
  }, 50)
}

function endSosPress() {
  clearSosTimer()
  sosPressing.value = false
  sosProgress.value = 0
}

function clearSosTimer() {
  if (sosTimer) {
    clearInterval(sosTimer)
    sosTimer = null
  }
}

onUnmounted(() => {
  clearSosTimer()
  if (cameraTimer) {
    clearInterval(cameraTimer)
    cameraTimer = null
  }
})

// 居家安全检查：总览与排序
const safeCount = computed(() => homeInspections.filter(i => i.status === 'safe').length)
const pendingCount = computed(() => homeInspections.filter(i => i.status !== 'safe').length)
// 待检查/逾期项置顶，再按上次检查时间升序
const sortedInspections = computed(() => {
  const order = { overdue: 0, pending: 1, safe: 2 } as const
  return [...homeInspections].sort((a, b) => order[a.status] - order[b.status])
})

function inspectionStatusText(status: string) {
  return status === 'safe' ? '安全' : status === 'pending' ? '待检查' : '已逾期'
}

function bookInspection(name: string) {
  showAlert(`已预约：${name}检查\n\n小康会帮您联系专业师傅安排具体时间，请留意电话通知。`)
}

// 核心快捷操作（极简/语音/工具模式用）
const coreActions = [
  { icon: 'phone', label: '一键呼叫', color: 'var(--color-brand)', action: () => showAlert('正在呼叫女儿小芳...') },
  { icon: 'pill', label: '用药提醒', color: 'var(--color-accent3)', action: () => showAlert('用药提醒：19:00 钙片 2片') },
  { icon: 'heart-pulse', label: '健康监测', color: 'var(--color-accent2)', action: () => goRoute('/health') },
  { icon: 'phone-call', label: '呼叫120', color: 'var(--state-error)', action: () => showAlert('正在拨打120急救电话...') },
]

// 子女照看模式：老人状态数据
const elderStatus = [
  { label: '心率', value: '72 bpm', status: 'normal', icon: 'heart-pulse' },
  { label: '血压', value: '128/82', status: 'warning', icon: 'droplet' },
  { label: '步数', value: '3,280步', status: 'normal', icon: 'footprints' },
  { label: '睡眠', value: '7.5小时', status: 'normal', icon: 'moon' },
  { label: '用药', value: '已服1/2', status: 'warning', icon: 'pill' },
  { label: '位置', value: '在家中', status: 'normal', icon: 'map-pin' },
]

// 子女照看模式：今日动态
const todayEvents = [
  { time: '07:30', event: '已服用降压药', type: 'med' },
  { time: '09:15', event: '出门散步（小区花园）', type: 'activity' },
  { time: '10:00', event: '与小康聊天 12 分钟', type: 'chat' },
  { time: '12:00', event: '午餐（营养评分 A）', type: 'meal' },
  { time: '14:30', event: '社区广场舞活动', type: 'social' },
]

// 护理模式：护理人员信息
const caregiverInfo = {
  name: '小周',
  role: '护理员',
  community: '和平里社区',
  shift: '早班进行中',
  totalElders: 6,
  attentionItems: 2,
}

// 护理模式：今日统计
const careStats = {
  pendingTasks: 14,
  completedTasks: 6,
  attentionItems: 2,
  nextVisit: {
    time: '10:30',
    elder: '王秀兰',
    location: '3号楼',
  },
}

// 护理模式：优先护理任务
const priorityTasks = [
  {
    name: '王秀兰',
    age: 68,
    initial: '王',
    status: 'normal',
    statusText: '血压平稳·晨间用药待确认',
    visitTime: '10:30上门',
    action: '开始护理',
    actionType: 'primary',
  },
  {
    name: '李建国',
    age: 76,
    initial: '李',
    status: 'warning',
    statusText: '昨夜睡眠5.1小时·建议回访',
    visitTime: '',
    action: '电话回访',
    actionType: 'secondary',
    badge: '需关注',
  },
  {
    name: '张桂英',
    age: 82,
    initial: '张',
    status: 'normal',
    statusText: '血糖偏高·需调整饮食方案',
    visitTime: '14:00上门',
    action: '开始护理',
    actionType: 'primary',
  },
  {
    name: '刘德明',
    age: 79,
    initial: '刘',
    status: 'warning',
    statusText: '跌倒风险评分高·需加强防护',
    visitTime: '',
    action: '上门评估',
    actionType: 'secondary',
    badge: '重点关注',
  },
  {
    name: '陈淑芬',
    age: 73,
    initial: '陈',
    status: 'normal',
    statusText: '心率正常·今日康复训练待完成',
    visitTime: '15:30上门',
    action: '开始护理',
    actionType: 'primary',
  },
  {
    name: '赵伟民',
    age: 85,
    initial: '赵',
    status: 'warning',
    statusText: '认知状态下降·需家属沟通',
    visitTime: '',
    action: '联系家属',
    actionType: 'secondary',
    badge: '需关注',
  },
]

// 护理模式：统计卡片详情弹窗
const showStatDetail = ref(false)
const statDetailTitle = ref('')
const statDetailItems = ref<{time: string, desc: string, status: string}[]>([])

const pendingTaskDetails = [
  { time: '10:30', desc: '王秀兰·晨间护理（洗漱、翻身）', status: '进行中' },
  { time: '11:00', desc: '李建国·电话回访·询问睡眠情况', status: '待处理' },
  { time: '14:00', desc: '张桂英·上门护理·血糖检测+饮食调整', status: '待处理' },
  { time: '15:30', desc: '陈淑芬·康复训练指导', status: '待处理' },
  { time: '16:00', desc: '刘德明·跌倒风险评估', status: '待处理' },
  { time: '17:00', desc: '赵伟民·家属沟通·认知状态反馈', status: '待处理' },
  { time: '17:30', desc: '交班记录填写', status: '待处理' },
  { time: '18:00', desc: '今日护理日志提交', status: '待处理' },
]

const attentionDetails = [
  { time: '今日', desc: '李建国·昨夜睡眠仅5.1小时，需关注', status: '需关注' },
  { time: '今日', desc: '刘德明·跌倒风险评分高，需加强防护', status: '重点关注' },
]

function showPendingTasks() {
  statDetailTitle.value = '今日待办详情'
  statDetailItems.value = pendingTaskDetails
  showStatDetail.value = true
}

function showAttentionItems() {
  statDetailTitle.value = '特殊关注详情'
  statDetailItems.value = attentionDetails
  showStatDetail.value = true
}

// 护理模式：任务按钮交互
const showActionDialog = ref(false)
const actionDialogTitle = ref('')
const actionDialogContent = ref('')
const actionDialogIcon = ref('')

function openActionDialog(title: string, content: string, icon: string) {
  actionDialogTitle.value = title
  actionDialogContent.value = content
  actionDialogIcon.value = icon
  showActionDialog.value = true
}

function handleCareTask(task: typeof priorityTasks[number]) {
  const action = task.action
  if (action === '开始护理') {
    openActionDialog(
      '开始护理服务',
      `已开始${task.name}的护理服务\n\n护理内容：\n· 生命体征检测\n· 晨间护理（洗漱、翻身）\n· 用药确认\n\n预计耗时45分钟`,
      'clipboard-list'
    )
  } else if (action === '电话回访') {
    openActionDialog(
      '电话回访',
      `正在语音呼叫${task.name}...\n\n电话号码：138****${Math.floor(1000 + Math.random() * 9000)}\n\n上次通话：昨日 15:30`,
      'phone'
    )
  } else if (action === '上门评估') {
    openActionDialog(
      '上门评估',
      `已创建${task.name}的上门评估工单\n\n评估内容：\n· 跌倒风险评估\n· 居家环境检查\n· 用药情况核查\n\n预计上门时间：明日 09:00`,
      'home'
    )
  } else if (action === '联系家属') {
    openActionDialog(
      '联系家属',
      `正在联系${task.name}的家属...\n\n家属：${task.name === '赵伟民' ? '赵先生（儿子）' : '家属'}\n电话：139****${Math.floor(1000 + Math.random() * 9000)}\n\n沟通事项：${task.statusText}`,
      'users'
    )
  }
}

// 子女模式：晨间用药未确认提醒
const showMedReminder = ref(true)

// 子女模式：语音提醒弹窗
const showVoiceReminder = ref(false)

function remindMomMed() {
  showVoiceReminder.value = true
  showMedReminder.value = false
}

// 子女模式：远程摄像头
const cameraOn = ref(false)
const cameraTime = ref('')
let cameraTimer: ReturnType<typeof setInterval> | null = null

function updateCameraTime() {
  const now = new Date()
  cameraTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
}
updateCameraTime()
cameraTimer = setInterval(updateCameraTime, 1000)

function toggleCamera() {
  cameraOn.value = !cameraOn.value
  if (cameraOn.value) {
    openFeatureDialog('开启看护', '摄像头已开启\n\n正在连接客厅摄像头...\n画面已就绪', 'video')
  } else {
    openFeatureDialog('关闭看护', '摄像头已关闭\n\n如需重新开启，请再次点击按钮。', 'video')
  }
}

// 记忆年轮
const portraitList = [
  { icon: 'camera', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)', label: '旅拍' },
  { icon: 'palette', bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)', label: '艺术照' },
  { icon: 'users', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)', label: '全家福' },
  { icon: 'calendar-heart', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)', label: '纪念日' },
]

// 肖像/摄像头 美化弹窗
const showFeatureDialog = ref(false)
const featureDialogTitle = ref('')
const featureDialogContent = ref('')
const featureDialogIcon = ref('')

function openFeatureDialog(title: string, content: string, icon: string) {
  featureDialogTitle.value = title
  featureDialogContent.value = content
  featureDialogIcon.value = icon
  showFeatureDialog.value = true
}
</script>

<template>
  <div class="page-content" :class="`home-${userStore.activeMode.layout}`">
    <!-- ==================== 标准模式 ==================== -->
    <template v-if="userStore.isStandard">
      <!-- 问候栏 + 快捷按钮 -->
      <section class="greeting-banner">
        <div class="greeting-content">
          <div class="greeting-title">{{ greeting.title }}</div>
          <div class="greeting-subtitle">{{ greeting.subtitle }}</div>
          <div class="greeting-date">{{ greeting.date }}</div>
        </div>
        <div class="greeting-actions">
          <button class="greeting-btn health" @click="goRoute('/health')">
            <AppIcon name="heart-pulse" :size="16" :color="'#fff'" />
            <span>查看健康详情</span>
          </button>
          <button class="greeting-btn companion" @click="goRoute('/companion')">
            <AppIcon name="message-circle" :size="16" :color="'var(--color-brand-dark)'" />
            <span>问问小康</span>
          </button>
        </div>
      </section>

      <!-- 健康仪表盘 -->
      <section class="health-dashboard" @click="goRoute('/health')">
        <div class="dashboard-ring-wrap">
          <svg class="dashboard-ring" viewBox="0 0 100 100">
            <circle class="ring-bg" cx="50" cy="50" r="42" />
            <circle class="ring-fg" cx="50" cy="50" r="42"
              :stroke-dasharray="264"
              :stroke-dashoffset="264 - (264 * userProfile.healthScore / 100)"
            />
          </svg>
          <div class="dashboard-ring-inner">
            <div class="dashboard-score">{{ userProfile.healthScore }}</div>
            <div class="dashboard-score-label">健康分</div>
          </div>
        </div>
        <div class="dashboard-info">
          <div class="dashboard-name">{{ userProfile.name }} · {{ userProfile.riskLevel }}</div>
          <div class="dashboard-stats">
            <div class="dashboard-stat">
              <span class="dashboard-stat-icon" style="background: rgba(91,184,158,0.15)"><AppIcon name="heart-pulse" :size="14" :color="'var(--color-brand)'" /></span>
              <span>心率 72</span>
            </div>
            <div class="dashboard-stat">
              <span class="dashboard-stat-icon" style="background: rgba(111,177,217,0.15)"><AppIcon name="droplet" :size="14" :color="'var(--color-accent2)'" /></span>
              <span>血压 128/82</span>
            </div>
            <div class="dashboard-stat">
              <span class="dashboard-stat-icon" style="background: rgba(232,184,124,0.15)"><AppIcon name="footprints" :size="14" :color="'var(--color-accent3)'" /></span>
              <span>步数 3280</span>
            </div>
          </div>
          <div class="dashboard-trend">
            <AppIcon name="trending-up" :size="12" :color="'var(--color-brand)'" />
            <span>较昨日 +2分，状态持续改善</span>
          </div>
        </div>
      </section>

      <!-- 健康速览 -->
      <section class="section">
        <div class="section-header">
          <span class="section-title">健康速览</span>
          <span class="section-link" @click="goRoute('/health')">查看详情 ></span>
        </div>
        <div class="quick-scroll">
          <div v-for="item in quickHealth" :key="item.label" class="quick-card" @click="goRoute('/health')">
            <div class="quick-icon" :style="{ background: item.color }"><AppIcon :name="item.icon" :size="20" :color="'var(--color-brand-dark)'" /></div>
            <div class="quick-label">{{ item.label }}</div>
            <div class="quick-value">{{ item.value }}<span class="quick-unit">{{ item.unit }}</span></div>
          </div>
        </div>
      </section>

      <!-- 联系家人 -->
      <section class="section">
        <div class="section-header">
          <span class="section-title"><AppIcon name="phone" :size="18" /> 联系家人</span>
        </div>
        <div class="family-scroll no-scrollbar">
          <button v-for="(f, idx) in familyContacts" :key="idx" class="family-card" @click="showAlert(`正在呼叫${f.name}...`)">
            <span class="family-icon" :style="{ color: f.color }"><AppIcon :name="f.icon" :size="24" /></span>
            <span class="family-name">{{ f.name }}</span>
            <span class="family-role">{{ f.role }}</span>
          </button>
        </div>
      </section>

      <!-- 服务入口 -->
      <section class="section">
        <div class="section-header">
          <span class="section-title">服务入口</span>
        </div>
        <div class="service-grid">
          <div v-for="svc in services" :key="svc.id" class="service-card" @click="svc.id === 'diagnosis' ? showBooking = true : goRoute(svc.route)">
            <span class="service-icon"><AppIcon :name="svc.icon" :size="28" :color="'var(--color-brand)'" /></span>
            <span class="service-title">{{ svc.title }}</span>
            <span class="service-desc">{{ svc.desc }}</span>
          </div>
        </div>
      </section>

      <!-- 生活服务 -->
      <section class="section">
        <div class="section-header">
          <span class="section-title"><AppIcon name="sparkles" :size="18" /> 生活服务</span>
        </div>
        <div class="life-service-grid">
          <button
            v-for="svc in lifeServices"
            :key="svc.key"
            class="life-service-card"
            @click="openLifeService(svc)"
          >
            <span class="life-service-icon" :style="{ background: svc.color }">
              <AppIcon :name="svc.icon" :size="26" :color="'var(--color-brand-dark)'" />
            </span>
            <span class="life-service-title">{{ svc.title }}</span>
            <span class="life-service-desc">{{ svc.desc }}</span>
          </button>
        </div>
      </section>

      <!-- 居家安全检查 -->
      <section class="section">
        <div class="section-header">
          <span class="section-title"><AppIcon name="shield-check" :size="18" /> 居家安全检查</span>
          <span class="section-link" @click="showAlert('查看居家安全检查全部记录')">查看详情 ></span>
        </div>
        <div class="inspection-summary" :class="{ 'has-alert': pendingCount > 0 }">
          <span class="inspection-summary-icon">
            <AppIcon name="shield-check" :size="22" :color="pendingCount > 0 ? 'var(--state-error)' : 'var(--color-brand)'" />
          </span>
          <span class="inspection-summary-text">
            <span class="inspection-safe">{{ safeCount }}项安全</span>
            <span class="inspection-summary-sep">·</span>
            <span class="inspection-pending" :class="{ 'has-alert': pendingCount > 0 }">{{ pendingCount }}项待检查</span>
          </span>
        </div>
        <div class="inspection-grid">
          <div
            v-for="item in sortedInspections"
            :key="item.key"
            class="inspection-card"
            :class="item.status"
          >
            <div class="inspection-card-head">
              <span class="inspection-icon" :class="item.status">
                <AppIcon :name="item.icon" :size="22" :color="item.status === 'overdue' ? 'var(--state-error)' : item.status === 'pending' ? 'var(--color-accent3-dark)' : 'var(--color-brand)'" />
              </span>
              <span class="inspection-name">{{ item.name }}</span>
            </div>
            <span class="inspection-status" :class="item.status">{{ inspectionStatusText(item.status) }}</span>
            <span class="inspection-last">上次检查 {{ item.lastDate.slice(2) }}</span>
            <button
              v-if="item.status !== 'safe'"
              class="inspection-book-btn"
              :class="item.status"
              @click="bookInspection(item.name)"
            >
              <AppIcon name="calendar-plus" :size="14" :color="'#fff'" />
              <span>预约检查</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 今日AI生活规划（按时间临近展示） -->
      <section class="section">
        <div class="section-header">
          <span class="section-title"><AppIcon name="calendar-check" :size="18" /> 今日AI生活规划</span>
        </div>
        <div class="glass-card schedule-card">
          <div v-for="(item, idx) in displaySchedule" :key="idx" class="schedule-item" :class="item.status">
            <span class="schedule-time">{{ item.time }}</span>
            <span class="schedule-dot-wrap">
              <span class="schedule-dot"></span>
              <span v-if="idx < displaySchedule.length - 1" class="schedule-line"></span>
            </span>
            <span class="schedule-content">
              <span class="schedule-desc"><AppIcon :name="item.icon" :size="16" /> {{ item.desc }}</span>
              <span class="schedule-status" :class="item.status">{{ item.status === 'completed' ? '已完成' : item.status === 'current' ? '进行中' : '待开始' }}</span>
            </span>
          </div>
        </div>
        <button
          v-if="todaySchedule.length > 6"
          class="schedule-toggle-btn"
          @click="showAllSchedule = !showAllSchedule"
        >
          <span>{{ showAllSchedule ? '收起' : '查看更多' }}</span>
          <span class="toggle-icon" :class="{ rotated: showAllSchedule }">
            <AppIcon name="chevron-down" :size="16" />
          </span>
        </button>
      </section>

      <!-- 记忆年轮 -->
      <section class="section">
        <div class="section-header">
          <span class="section-title"><AppIcon name="camera" :size="18" /> 记忆年轮</span>
          <span class="section-link" @click="showAlert('查看更多肖像服务')">更多 ></span>
        </div>
        <div class="portrait-card">
          <div class="portrait-preview">
            <div class="portrait-frame" v-for="(p, idx) in portraitList" :key="idx" :style="{ background: p.bg }">
              <AppIcon :name="p.icon" :size="28" :color="'#fff'" />
              <div class="portrait-label">{{ p.label }}</div>
            </div>
          </div>
          <div class="portrait-actions">
            <button class="portrait-btn primary" @click="openFeatureDialog('预约旅拍', '已预约旅拍服务\n\n摄影师将于本周六上门拍摄\n\n套系包含：\n· 户外旅拍 8 张\n· 精修 4 张\n· 赠送相框 1 个', 'camera')">
              <AppIcon name="camera" :size="16" /> 预约旅拍
            </button>
            <button class="portrait-btn" @click="openFeatureDialog('艺术照预约', '已预约艺术照拍摄\n\n套系：金色年华·艺术照\n\n包含：\n· 造型 3 套\n· 拍摄 20 张\n· 精修 8 张', 'palette')">
              <AppIcon name="palette" :size="16" /> 艺术照
            </button>
            <button class="portrait-btn" @click="openFeatureDialog('历史相册', '查看历史相册（共 128 张）\n\n最近拍摄：\n· 2026年春节全家福\n· 2025年金婚纪念照\n· 2025年生日写真', 'film')">
              <AppIcon name="film" :size="16" /> 相册
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- ==================== 高龄长辈模式（大字） ==================== -->
    <template v-else-if="userStore.isElderly">
      <section class="elderly-greeting">
        <div class="elderly-greeting-main">
          <div class="elderly-greeting-text">
            <h1 class="elderly-hello">{{ greeting.title }}</h1>
            <p class="elderly-sub">{{ greeting.subtitle }}</p>
          </div>
          <div class="elderly-greeting-meta">
            <div class="elderly-meta-icon"><AppIcon name="sun" :size="22" color="#fff" /></div>
            <div class="elderly-meta-text">
              <div class="elderly-meta-date">{{ greeting.date }}</div>
              <div class="elderly-meta-lunar">农历 · {{ greeting.lunar }}</div>
            </div>
          </div>
        </div>
        <div class="elderly-greeting-strip">
          <span class="elderly-strip-item">
            <AppIcon name="thermometer-sun" :size="18" />
            <span>气温 <b>{{ greeting.temp }}</b></span>
          </span>
          <span class="elderly-strip-divider"></span>
          <span class="elderly-strip-item">
            <AppIcon name="clock" :size="18" />
            <span>{{ greeting.currentTime }}</span>
          </span>
        </div>
      </section>

      <!-- 大字健康卡片 -->
      <section class="elderly-health">
        <div v-for="item in quickHealth" :key="item.label" class="elderly-health-card" @click="goRoute('/health')">
          <span class="elderly-health-icon"><AppIcon :name="item.icon" :size="36" /></span>
          <div>
            <div class="elderly-health-label">{{ item.label }}</div>
            <div class="elderly-health-value">{{ item.value }} {{ item.unit }}</div>
          </div>
        </div>
      </section>

      <!-- 大按钮快捷操作 -->
      <section class="elderly-actions">
        <button class="elderly-action-btn primary" @click="showAlert('正在呼叫女儿小芳...')">
          <AppIcon name="phone" :size="36" />
          <span>呼叫女儿</span>
        </button>
        <button class="elderly-action-btn" @click="goRoute('/companion')">
          <AppIcon name="message-circle" :size="36" />
          <span>和小康聊天</span>
        </button>
      </section>

      <!-- 今日提醒 -->
      <section class="elderly-remind">
        <h2 class="elderly-section-title"><AppIcon name="alarm-clock" :size="24" /> 今日提醒</h2>
        <div v-for="(item, idx) in todayPlan.slice(0, 3)" :key="idx" class="elderly-remind-item">
          <span class="elderly-remind-time">{{ item.time }}</span>
          <span class="elderly-remind-desc">{{ item.desc }}</span>
        </div>
      </section>

      <!-- 居家安全检查（大字版） -->
      <section class="elderly-inspection">
        <h2 class="elderly-section-title">
          <AppIcon name="shield-check" :size="24" />
          居家安全检查
        </h2>
        <div class="elderly-inspection-summary" :class="{ 'has-alert': pendingCount > 0 }">
          <span class="elderly-inspection-summary-icon">
            <AppIcon name="shield-check" :size="28" :color="pendingCount > 0 ? 'var(--state-error)' : 'var(--color-brand)'" />
          </span>
          <span class="elderly-inspection-summary-text">
            <b>{{ safeCount }}</b> 项安全
            <span class="elderly-inspection-sep">·</span>
            <b :class="{ alert: pendingCount > 0 }">{{ pendingCount }}</b> 项该检查了
          </span>
        </div>
        <div class="elderly-inspection-grid">
          <div
            v-for="item in sortedInspections"
            :key="item.key"
            class="elderly-inspection-card"
            :class="item.status"
          >
            <span class="elderly-inspection-icon" :class="item.status">
              <AppIcon :name="item.icon" :size="32" :color="item.status === 'overdue' ? 'var(--state-error)' : item.status === 'pending' ? 'var(--color-accent3-dark)' : 'var(--color-brand)'" />
            </span>
            <span class="elderly-inspection-name">{{ item.name }}</span>
            <span class="elderly-inspection-status" :class="item.status">
              {{ item.status === 'safe' ? '安全' : item.status === 'pending' ? '该检查了' : '已逾期' }}
            </span>
            <span class="elderly-inspection-last">上次检查 {{ item.lastDate.slice(2) }}</span>
            <button
              v-if="item.status !== 'safe'"
              class="elderly-inspection-btn"
              :class="item.status"
              @click="bookInspection(item.name)"
            >
              <AppIcon name="calendar-plus" :size="18" :color="'#fff'" />
              <span>预约检查</span>
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- ==================== 视障语音模式 ==================== -->
    <template v-else-if="userStore.isVoice">
      <!-- 问候卡片 -->
      <section class="voice-greeting">
        <div class="voice-greeting-icon">
          <AppIcon name="smile" :size="40" :color="'var(--color-brand)'" />
        </div>
        <h1 class="voice-hello">您好，王奶奶</h1>
        <p class="voice-tip">今天是7月15日，星期二</p>
      </section>

      <!-- 小康自动播报按钮 -->
      <section class="voice-companion-card">
        <button class="voice-companion-btn" @click="goRoute('/companion')">
          <div class="voice-companion-icon">
            <AppIcon name="volume-2" :size="48" color="#fff" />
          </div>
          <span class="voice-companion-text">小康正在自动播报中</span>
          <span class="voice-companion-sub">可随时呼叫小康</span>
        </button>
      </section>

      <!-- 紧急求助 -->
      <section class="voice-sos-card">
        <button
          class="sos-hold-btn"
          :class="{ pressing: sosPressing }"
          @touchstart.prevent="startSosPress"
          @touchend.prevent="endSosPress"
          @touchcancel.prevent="endSosPress"
          @mousedown.prevent="startSosPress"
          @mouseup.prevent="endSosPress"
          @mouseleave="endSosPress"
        >
          <svg class="sos-ring" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="3" />
            <circle
              cx="50" cy="50" r="46" fill="none"
              stroke="#fff" stroke-width="3" stroke-linecap="round"
              :stroke-dasharray="289.03"
              :stroke-dashoffset="289.03 * (1 - sosProgress)"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div class="sos-content">
            <AppIcon name="siren" :size="32" color="#fff" />
            <span class="sos-text">{{ sosPressing ? '正在识别...' : '请连说两次求助！' }}</span>
          </div>
        </button>
        <div class="voice-sos-hint">请连续说2声求助发起救援</div>
      </section>

    </template>

    <!-- ==================== 卧床工具模式 ==================== -->
    <template v-else-if="userStore.isTool">
      <section class="tool-greeting">
        <h1 class="tool-hello">{{ greeting.title }}</h1>
      </section>

      <!-- 一键呼叫与呼叫120并排 -->
      <section class="tool-call-row">
        <button class="tool-call-btn primary" @click="showAlert('正在呼叫女儿小芳...')">
          <AppIcon name="phone" :size="32" :color="'#fff'" />
          <span class="tool-call-text">一键呼叫</span>
        </button>
        <button class="tool-call-btn danger" @click="showAlert('正在拨打120急救电话...')">
          <AppIcon name="phone-call" :size="32" :color="'#fff'" />
          <span class="tool-call-text">呼叫120</span>
        </button>
      </section>

      <!-- 今日健康小贴士（天气 · 日期 · 节气 · 健康贴士） -->
      <section class="tool-tip">
        <div class="tool-section-title">今日健康小贴士</div>

        <!-- 天气 + 日期 + 节气 综合信息卡 -->
        <div class="tool-info-card">
          <div class="tool-info-row">
            <div class="tool-info-block weather-block">
              <div class="tool-info-icon">
                <AppIcon :name="greeting.weatherIcon" :size="32" color="#F6A35C" />
              </div>
              <div class="tool-info-body">
                <div class="tool-info-main">{{ greeting.weatherText }} {{ greeting.temp }}</div>
                <div class="tool-info-sub">空气 {{ greeting.airQuality }}</div>
              </div>
            </div>
            <div class="tool-info-block date-block">
              <div class="tool-info-icon">
                <AppIcon name="calendar-days" :size="32" color="var(--color-brand)" />
              </div>
              <div class="tool-info-body">
                <div class="tool-info-main">{{ greeting.fullDate }}</div>
                <div class="tool-info-sub">农历 · {{ greeting.lunar }} · {{ greeting.weekday }}</div>
              </div>
            </div>
          </div>
          <div class="tool-info-divider"></div>
          <div class="tool-info-term">
            <div class="tool-term-block current">
              <span class="tool-term-tag">当前节气</span>
              <div class="tool-term-name">{{ greeting.solarTerm }}</div>
            </div>
            <div class="tool-term-arrow"><AppIcon name="arrow-right" :size="18" color="var(--color-text-tertiary)" /></div>
            <div class="tool-term-block next">
              <span class="tool-term-tag">下一节气</span>
              <div class="tool-term-name">{{ greeting.nextSolarTerm }}</div>
              <div class="tool-term-meta">{{ greeting.nextSolarTermDate }} · 还有 <b>{{ greeting.daysToNextTerm }}</b> 天</div>
            </div>
          </div>
        </div>

        <!-- 健康小贴士本体 -->
        <div class="tool-tip-card">
          <div class="tool-tip-icon">
            <AppIcon name="lightbulb" :size="24" :color="'var(--color-accent3)'" />
          </div>
          <div class="tool-tip-content">
            <p class="tool-tip-text">卧床护理注意事项：</p>
            <p class="tool-tip-item">① 每2小时翻身一次，预防压疮</p>
            <p class="tool-tip-item">② 每日饮水1500ml，少量多次</p>
            <p class="tool-tip-item">③ 保持房间通风，每日2次，每次15分钟</p>
            <p class="tool-tip-item">④ 适当肢体活动，预防肌肉萎缩</p>
            <p class="tool-tip-item">⑤ 注意皮肤清洁，保持干燥</p>
          </div>
        </div>
      </section>

      <!-- 今日用药 -->
      <section class="tool-med">
        <div class="tool-section-title">今日用药提醒</div>
        <div class="tool-med-list">
          <div class="tool-med-card">
            <AppIcon name="pill" :size="24" :color="'var(--color-brand)'" />
            <div class="tool-med-info">
              <div class="tool-med-name">降压药 苯磺酸氨氯地平 1片</div>
              <div class="tool-med-time">07:30 已服 · 饭后服用</div>
            </div>
            <button class="tool-med-btn done">已服</button>
          </div>
          <div class="tool-med-card">
            <AppIcon name="pill" :size="24" :color="'var(--color-accent3)'" />
            <div class="tool-med-info">
              <div class="tool-med-name">钙片 2片</div>
              <div class="tool-med-time">12:30 待服 · 饭后服用</div>
            </div>
            <button class="tool-med-btn">未服</button>
          </div>
          <div class="tool-med-card">
            <AppIcon name="pill" :size="24" :color="'var(--color-accent3)'" />
            <div class="tool-med-info">
              <div class="tool-med-name">降糖药 二甲双胍 1片</div>
              <div class="tool-med-time">18:00 待服 · 饭中服用</div>
            </div>
            <button class="tool-med-btn">未服</button>
          </div>
          <div class="tool-med-card">
            <AppIcon name="pill" :size="24" :color="'var(--color-accent3)'" />
            <div class="tool-med-info">
              <div class="tool-med-name">阿托伐他汀 1片</div>
              <div class="tool-med-time">21:00 待服 · 睡前服用</div>
            </div>
            <button class="tool-med-btn">未服</button>
          </div>
        </div>
      </section>

      <!-- 翻身提醒 -->
      <section class="tool-remind">
        <div class="tool-section-title">翻身提醒</div>
        <div class="tool-remind-card">
          <div class="tool-remind-icon">
            <AppIcon name="refresh-cw" :size="32" :color="'var(--color-accent2)'" />
          </div>
          <div class="tool-remind-info">
            <div class="tool-remind-name">建议每2小时翻身一次</div>
            <div class="tool-remind-time">上次翻身：10:30</div>
          </div>
          <button class="tool-remind-btn" @click="showAlert('已记录翻身')">已翻身</button>
        </div>
      </section>

      <!-- 喝水提醒 -->
      <section class="tool-remind">
        <div class="tool-section-title">喝水提醒</div>
        <div class="tool-remind-card">
          <div class="tool-remind-icon">
            <AppIcon name="glass-water" :size="32" :color="'var(--color-accent2)'" />
          </div>
          <div class="tool-remind-info">
            <div class="tool-remind-name">建议每1小时喝水一次</div>
            <div class="tool-remind-time">上次喝水：11:00</div>
          </div>
          <button class="tool-remind-btn" @click="showAlert('已记录喝水')">已喝水</button>
        </div>
      </section>

      <!-- 快捷服务 -->
      <section class="tool-services">
        <div class="tool-section-title">快捷服务</div>
        <div class="tool-service-list">
          <button class="tool-service-item" @click="goRoute('/companion')">
            <AppIcon name="bot" :size="24" :color="'var(--color-brand)'" />
            <span>AI 陪伴聊天</span>
            <AppIcon name="chevron-right" :size="18" />
          </button>
          <button class="tool-service-item" @click="goRoute('/health')">
            <AppIcon name="heart-pulse" :size="24" :color="'var(--color-brand)'" />
            <span>健康监测</span>
            <AppIcon name="chevron-right" :size="18" />
          </button>
        </div>
      </section>
    </template>

    <!-- ==================== 护理模式（原极简行动） ==================== -->
    <template v-else-if="userStore.isMinimal">
      <!-- 顶部信息栏 -->
      <section class="care-header">
        <div class="care-header-top">
          <span class="care-header-tag">护理工作台 · {{ caregiverInfo.community }}</span>
          <div class="care-shift-badge">
            <span class="care-shift-dot"></span>
            {{ caregiverInfo.shift }}
          </div>
        </div>
        <div class="care-greeting">
          <h1 class="care-greeting-title">上午好，{{ caregiverInfo.name }}</h1>
          <p class="care-greeting-sub">今日负责 {{ caregiverInfo.totalElders }} 位长者 · {{ caregiverInfo.attentionItems }} 项需要关注</p>
        </div>
      </section>

      <!-- 今日统计卡片 -->
      <section class="care-stats-row">
        <div class="care-stat-card" @click="showPendingTasks" style="cursor: pointer">
          <div class="care-stat-card-label">今日待办</div>
          <div class="care-stat-card-value">{{ careStats.pendingTasks }}</div>
          <div class="care-stat-card-sub">已完成 {{ careStats.completedTasks }} 项</div>
        </div>
        <div class="care-stat-card highlight" @click="showAttentionItems" style="cursor: pointer">
          <div class="care-stat-card-label">特殊关注</div>
          <div class="care-stat-card-value">{{ careStats.attentionItems }}</div>
          <div class="care-stat-card-sub">均已联系家属</div>
        </div>
        <div class="care-stat-card">
          <div class="care-stat-card-label">下一次上门</div>
          <div class="care-stat-card-value">{{ careStats.nextVisit.time }}</div>
          <div class="care-stat-card-sub">{{ careStats.nextVisit.elder }} · {{ careStats.nextVisit.location }}</div>
        </div>
      </section>

      <!-- 优先护理任务 -->
      <section class="care-task-section">
        <div class="care-task-header">
          <h2 class="care-task-title">优先护理任务</h2>
          <button class="care-task-refresh">
            <AppIcon name="refresh-cw" :size="14" /> 刷新
          </button>
        </div>
        <div class="care-task-list">
          <div v-for="(task, idx) in priorityTasks" :key="idx" class="care-task-item">
            <div class="care-task-avatar" :class="task.status">
              {{ task.initial }}
            </div>
            <div class="care-task-info">
              <div class="care-task-name">{{ task.name }} · {{ task.age }}岁</div>
              <div class="care-task-desc">{{ task.statusText }}</div>
            </div>
            <div class="care-task-actions">
              <span v-if="task.visitTime" class="care-task-time">{{ task.visitTime }}</span>
              <span v-if="task.badge" class="care-task-badge">{{ task.badge }}</span>
              <button class="care-task-btn" :class="task.actionType" @click="handleCareTask(task)">
                <AppIcon v-if="task.action === '开始护理'" name="clipboard-list" :size="16" />
                <AppIcon v-else-if="task.action === '电话回访'" name="phone" :size="16" />
                <AppIcon v-else-if="task.action === '上门评估'" name="home" :size="16" />
                <AppIcon v-else-if="task.action === '联系家属'" name="users" :size="16" />
                {{ task.action }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ==================== 子女照看模式 ==================== -->
    <template v-else-if="userStore.isCaregiver">
      <section class="caregiver-header">
        <div class="caregiver-header-info">
          <h1 class="caregiver-title">母亲状态监控</h1>
          <p class="caregiver-subtitle">王秀兰 · 最后更新 2分钟前</p>
        </div>
        <div class="caregiver-status-badge normal">
          <AppIcon name="check-circle" :size="14" /> 状态良好
        </div>
      </section>

      <!-- 母亲实时位置 -->
      <section class="caregiver-location-card">
        <div class="caregiver-location-icon">
          <AppIcon name="map-pin" :size="20" :color="'#fff'" />
        </div>
        <div class="caregiver-location-info">
          <div class="caregiver-location-title">母亲当前位置</div>
          <div class="caregiver-location-value">在家中 · 客厅</div>
        </div>
        <div class="caregiver-location-time">刚刚更新</div>
      </section>

      <!-- 晨间用药未确认提醒 -->
      <section v-if="showMedReminder" class="caregiver-med-alert">
        <div class="med-alert-icon">
          <AppIcon name="pill" :size="20" :color="'#fff'" />
        </div>
        <div class="med-alert-info">
          <div class="med-alert-title">妈妈晨间用药尚未确认</div>
          <div class="med-alert-desc">降压药 07:30 · 待确认是否已服用</div>
        </div>
        <button class="med-alert-btn" @click="remindMomMed">语音提醒</button>
      </section>

      <!-- 实时数据 -->
      <section class="caregiver-section">
        <div class="caregiver-section-title">实时健康</div>
        <div class="caregiver-stats">
          <div v-for="s in elderStatus" :key="s.label" class="caregiver-stat" :class="s.status">
            <span class="caregiver-stat-icon"><AppIcon :name="s.icon" :size="18" /></span>
            <div>
              <div class="caregiver-stat-label">{{ s.label }}</div>
              <div class="caregiver-stat-value">{{ s.value }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 今日动态 -->
      <section class="caregiver-section">
        <div class="caregiver-section-title">今日动态</div>
        <div class="caregiver-timeline">
          <div v-for="(e, idx) in todayEvents" :key="idx" class="caregiver-event">
            <span class="caregiver-event-time">{{ e.time }}</span>
            <span class="caregiver-event-dot" :class="e.type"></span>
            <span class="caregiver-event-desc">{{ e.event }}</span>
          </div>
        </div>
      </section>

      <!-- 远程操作 -->
      <section class="caregiver-section">
        <div class="caregiver-section-title">远程协助</div>
        <div class="caregiver-actions">
          <button class="caregiver-action" @click="showBooking = true">
            <AppIcon name="calendar-plus" :size="20" /> 代预约挂号
          </button>
          <button class="caregiver-action" @click="showAlert('提醒已发送：该吃降压药了')">
            <AppIcon name="bell" :size="20" /> 发送用药提醒
          </button>
          <button class="caregiver-action primary" @click="showAlert('正在发起远程视频通话...\n\n正在连接妈妈的设备...')">
            <AppIcon name="video" :size="20" /> 远程视频
          </button>
          <button class="caregiver-action primary" @click="showAlert('正在发起远程语音通话...\n\n正在连接妈妈的设备...')">
            <AppIcon name="phone" :size="20" /> 远程语音
          </button>
          <button class="caregiver-action" @click="showAlert('共享权限已更新')">
            <AppIcon name="shield" :size="20" /> 共享权限管理
          </button>
        </div>
      </section>

      <!-- 远程摄像头看护 -->
      <section class="caregiver-section">
        <div class="caregiver-section-title">远程摄像头看护</div>
        <div class="camera-monitor-card">
          <div class="camera-view">
            <div class="camera-placeholder">
              <AppIcon name="video" :size="40" :color="'rgba(255,255,255,0.6)'" />
              <div class="camera-status">客厅摄像头</div>
              <div class="camera-time">{{ cameraTime }}</div>
            </div>
            <div class="camera-live-tag">
              <span class="live-dot"></span>
              LIVE
            </div>
          </div>
          <div class="camera-controls">
            <button class="camera-btn primary" @click="toggleCamera">
              <AppIcon name="video" :size="18" />
              {{ cameraOn ? '关闭看护' : '开启看护' }}
            </button>
            <button class="camera-btn" @click="openFeatureDialog('截图保存', '已截图画面的快照已保存到相册\n\n保存时间：' + cameraTime + '\n存储位置：相册 › 看护截图', 'camera')">
              <AppIcon name="camera" :size="18" /> 截图
            </button>
            <button class="camera-btn" @click="openFeatureDialog('切换摄像头', '已切换至卧室摄像头\n\n当前画面：卧室\n可切换摄像头：客厅 / 卧室 / 厨房', 'refresh-cw')">
              <AppIcon name="refresh-cw" :size="18" /> 切换
            </button>
          </div>
          <div class="camera-tips">
            <AppIcon name="info" :size="12" :color="'var(--color-text-tertiary)'" />
            <span>妈妈已知情同意，摄像头仅用于安全看护</span>
          </div>
        </div>
      </section>

    </template>

    <!-- 子女模式：语音提醒弹窗 -->
    <transition name="fade">
      <div v-if="showVoiceReminder" class="voice-reminder-mask" @click="showVoiceReminder = false">
        <div class="voice-reminder-dialog" @click.stop>
          <div class="voice-reminder-icon">
            <AppIcon name="volume-2" :size="32" :color="'#fff'" />
          </div>
          <div class="voice-reminder-title">语音提醒已发送</div>
          <div class="voice-reminder-body">
            <div class="voice-reminder-row">
              <span class="voice-reminder-label">提醒对象</span>
              <span class="voice-reminder-value">妈妈（王秀兰）</span>
            </div>
            <div class="voice-reminder-row">
              <span class="voice-reminder-label">提醒内容</span>
              <span class="voice-reminder-value">该吃降压药了，记得饭后服用</span>
            </div>
            <div class="voice-reminder-row">
              <span class="voice-reminder-label">发送时间</span>
              <span class="voice-reminder-value">刚刚</span>
            </div>
          </div>
          <button class="voice-reminder-btn" @click="showVoiceReminder = false">知道了</button>
        </div>
      </div>
    </transition>

    <!-- 护理模式：统计详情弹窗 -->
    <transition name="fade">
      <div v-if="showStatDetail" class="stat-detail-mask" @click="showStatDetail = false">
        <div class="stat-detail-dialog" @click.stop>
          <div class="stat-detail-head">
            <div class="stat-detail-title">{{ statDetailTitle }}</div>
            <button class="stat-detail-close" @click="showStatDetail = false"><AppIcon name="x" :size="18" /></button>
          </div>
          <div class="stat-detail-list">
            <div v-for="(item, idx) in statDetailItems" :key="idx" class="stat-detail-item">
              <span class="stat-detail-time">{{ item.time }}</span>
              <span class="stat-detail-desc">{{ item.desc }}</span>
              <span class="stat-detail-status" :class="{ warning: item.status === '需关注' || item.status === '重点关注' }">{{ item.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 护理模式：动作弹窗 -->
    <transition name="fade">
      <div v-if="showActionDialog" class="action-dialog-mask" @click="showActionDialog = false">
        <div class="action-dialog" @click.stop>
          <div class="action-dialog-header"></div>
          <div class="action-dialog-body">
            <div class="action-dialog-icon-wrap">
              <div class="action-dialog-icon">
                <AppIcon :name="actionDialogIcon" :size="32" :color="'#fff'" />
              </div>
            </div>
            <div class="action-dialog-title">{{ actionDialogTitle }}</div>
            <div class="action-dialog-content">
              <div class="action-dialog-card">
                <p class="action-dialog-text">{{ actionDialogContent }}</p>
              </div>
            </div>
            <button class="action-dialog-btn" @click="showActionDialog = false">知道了</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 肖像/摄像头 美化弹窗 -->
    <transition name="fade">
      <div v-if="showFeatureDialog" class="action-dialog-mask" @click="showFeatureDialog = false">
        <div class="action-dialog" @click.stop>
          <div class="action-dialog-header"></div>
          <div class="action-dialog-body">
            <div class="action-dialog-icon-wrap">
              <div class="action-dialog-icon">
                <AppIcon :name="featureDialogIcon" :size="32" :color="'#fff'" />
              </div>
            </div>
            <div class="action-dialog-title">{{ featureDialogTitle }}</div>
            <div class="action-dialog-content">
              <div class="action-dialog-card">
                <p class="action-dialog-text">{{ featureDialogContent }}</p>
              </div>
            </div>
            <button class="action-dialog-btn" @click="showFeatureDialog = false">知道了</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 挂号流程弹窗 -->
    <BookingFlow :visible="showBooking" @close="showBooking = false" />

    <!-- 生活服务弹窗 -->
    <transition name="fade">
      <div v-if="showLifeService && activeService" class="life-svc-mask" @click="showLifeService = false">
        <div class="life-svc-dialog" @click.stop>
          <div class="life-svc-head">
            <span class="life-svc-icon" :style="{ background: activeService.color }">
              <AppIcon :name="activeService.icon" :size="28" :color="'var(--color-brand-dark)'" />
            </span>
            <div class="life-svc-info">
              <div class="life-svc-title">{{ activeService.title }}</div>
              <div class="life-svc-desc">{{ activeService.desc }}</div>
            </div>
            <button class="life-svc-close" @click="showLifeService = false"><AppIcon name="x" :size="18" /></button>
          </div>
          <div class="life-svc-list">
            <div v-for="(item, idx) in activeService.items" :key="idx" class="life-svc-item">
              <div class="life-svc-item-info">
                <div class="life-svc-item-name">{{ item.name }}</div>
                <div class="life-svc-item-desc">{{ item.desc }}</div>
              </div>
              <button class="life-svc-item-btn" @click="bookService(item.name)">预约</button>
            </div>
          </div>
          <div class="life-svc-tip">
            <AppIcon name="shield-check" :size="14" :color="'var(--color-brand)'" />
            <span>所有服务均经平台认证，小康全程跟踪订单</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 统一提示弹窗（替代原生 alert） -->
    <transition name="fade">
      <div v-if="showAppAlert" class="app-alert-mask" @click="showAppAlert = false">
        <div class="app-alert-dialog" @click.stop>
          <div class="app-alert-icon"><AppIcon name="info" :size="36" :color="'var(--color-brand)'" /></div>
          <div class="app-alert-content">{{ appAlertMsg }}</div>
          <button class="app-alert-btn" @click="showAppAlert = false">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.page-content {
  padding: 0 var(--space-4);
}

/* ============ 标准模式 ============ */
.greeting-banner {
  margin: var(--space-4) 0;
  padding: var(--space-6);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-brand-lighter) 0%, var(--color-bg-tertiary) 50%, rgba(111, 177, 217, 0.15) 100%);
  border: 1px solid var(--glass-border);
}
.greeting-content { margin-bottom: var(--space-4); }
.greeting-title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-text-primary); margin-bottom: var(--space-2); }
.greeting-subtitle { font-size: var(--text-base); color: var(--color-text-secondary); margin-bottom: var(--space-1); }
.greeting-date { font-family: var(--font-display); font-size: var(--text-sm); color: var(--color-text-tertiary); }
.greeting-actions { display: flex; gap: var(--space-3); }
.greeting-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  border-radius: var(--radius-sm);
  border: none;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.greeting-btn:hover { transform: translateY(-2px); }
.greeting-btn:active { transform: scale(0.97); }
.greeting-btn.health {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.3);
}
.greeting-btn.health:hover { box-shadow: 0 6px 18px rgba(91, 184, 158, 0.4); }
.greeting-btn.companion {
  background: rgba(255, 255, 255, 0.8);
  border: 1.5px solid var(--color-brand);
  color: var(--color-brand-dark);
}

/* 健康仪表盘 */
.health-dashboard {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-5) var(--space-4);
  margin-bottom: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-solid);
  border: 1px solid var(--color-border-solid);
  box-shadow: 0 2px 12px rgba(91,184,158,0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.health-dashboard:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(91,184,158,0.14);
}
.health-dashboard:active { transform: scale(0.98); }
.dashboard-ring-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
}
.dashboard-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.ring-bg {
  fill: none;
  stroke: var(--color-bg-secondary);
  stroke-width: 8;
}
.ring-fg {
  fill: none;
  stroke: url(#dash-grad);
  stroke: var(--color-brand);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-out;
}
.dashboard-ring-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dashboard-score {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-brand-dark);
  line-height: 1;
}
.dashboard-score-label {
  font-size: 0.625rem;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
.dashboard-info { flex: 1; min-width: 0; }
.dashboard-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.dashboard-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.dashboard-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
.dashboard-stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
}
.dashboard-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  color: var(--color-brand);
  font-weight: 500;
}
.greeting-btn.companion:hover { background: rgba(255, 255, 255, 1); box-shadow: 0 4px 14px rgba(91, 184, 158, 0.15); }

/* 联系家人 */
.family-scroll { display: flex; gap: var(--space-3); overflow-x: auto; padding-bottom: var(--space-2); scroll-snap-type: x mandatory; }
.family-card {
  flex: 0 0 auto;
  width: 100px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-4) var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}
.family-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(91,184,158,0.14); }
.family-card:active { transform: scale(0.96); }
.family-icon { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: var(--color-bg-tertiary); }
.family-name { font-family: var(--font-display); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.family-role { font-size: var(--text-xs); color: var(--color-text-tertiary); }

/* 生活服务 */
.life-service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.life-service-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  border: none;
}
.life-service-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(91,184,158,0.14); }
.life-service-card:active { transform: scale(0.97); }
.life-service-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
}
.life-service-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}
.life-service-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* 生活服务弹窗 */
.life-svc-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}
.life-svc-dialog {
  width: 100%;
  max-width: 380px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-5) var(--space-6);
  box-shadow: var(--shadow-float);
  animation: dialog-pop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 80vh;
  overflow-y: auto;
}
@keyframes dialog-pop {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.life-svc-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.life-svc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  flex-shrink: 0;
}
.life-svc-info { flex: 1; }
.life-svc-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.life-svc-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}
.life-svc-close {
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
  transition: all var(--transition-fast);
}
.life-svc-close:hover { background: var(--color-bg-tertiary); transform: rotate(90deg); }
.life-svc-close:active { transform: scale(0.9); }
.life-svc-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.life-svc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
}
.life-svc-item-info { flex: 1; }
.life-svc-item-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.life-svc-item-desc {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.life-svc-item-btn {
  padding: 4px 14px;
  border-radius: var(--radius-full);
  background: var(--color-brand);
  color: var(--color-text-on-brand);
  border: none;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(91,184,158,0.2);
}
.life-svc-item-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(91,184,158,0.3); }
.life-svc-item-btn:active { transform: scale(0.95); }
.life-svc-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  padding: var(--space-2) var(--space-3);
  background: rgba(91, 184, 158, 0.06);
  border-radius: var(--radius-sm);
}

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

/* 今日AI生活规划时间轴 */
.schedule-card { padding: var(--space-4) var(--space-5); }
.schedule-item {
  display: flex;
  gap: var(--space-3);
  min-height: 48px;
}
.schedule-time {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 42px;
  flex-shrink: 0;
  padding-top: 2px;
}
.schedule-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.schedule-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border-solid);
  flex-shrink: 0;
  margin-top: 6px;
}
.schedule-item.completed .schedule-dot { background: var(--color-brand); }
.schedule-item.current .schedule-dot {
  background: var(--color-accent3);
  animation: dot-pulse 1.5s infinite;
}
@keyframes dot-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(232,184,124,0.5); }
  50% { transform: scale(1.2); box-shadow: 0 0 0 6px rgba(232,184,124,0); }
}
.schedule-line {
  width: 2px;
  flex: 1;
  background: var(--color-border-solid);
  margin-top: 2px;
}
.schedule-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding-bottom: var(--space-3);
}
.schedule-desc {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}
.schedule-status {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}
.schedule-status.completed { background: rgba(91,184,158,0.12); color: var(--color-brand-dark); }
.schedule-status.current { background: rgba(232,184,124,0.15); color: var(--color-accent3-dark); }
.schedule-status.upcoming { background: var(--color-bg-secondary); color: var(--color-text-tertiary); }

.schedule-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  margin-top: var(--space-3);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  color: var(--color-brand);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.schedule-toggle-btn:hover {
  background: rgba(91, 184, 158, 0.08);
  border-color: rgba(91, 184, 158, 0.3);
  transform: translateY(-1px);
}
.schedule-toggle-btn:active { transform: scale(0.97); }
.toggle-icon { display: flex; align-items: center; transition: transform 0.3s ease; }
.toggle-icon.rotated { transform: rotate(180deg); }

.section { margin-bottom: var(--space-6); }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); }
.section-title { font-family: var(--font-display); font-size: var(--text-lg); font-weight: var(--weight-semibold); color: var(--color-text-primary); display: flex; align-items: center; gap: var(--space-2); }
.section-link { font-family: var(--font-display); font-size: var(--text-sm); color: var(--color-brand); font-weight: var(--weight-medium); cursor: pointer; transition: all var(--transition-fast); }
.section-link:hover { color: var(--color-brand-dark); transform: translateX(2px); }
.section-link:active { transform: scale(0.94); }

/* 居家安全检查（标准模式） */
.inspection-summary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.inspection-summary.has-alert { border-color: rgba(253, 101, 133, 0.3); }
.inspection-summary-icon { display: flex; align-items: center; justify-content: center; }
.inspection-summary-text { font-family: var(--font-display); font-size: var(--text-base); color: var(--color-text-primary); display: flex; align-items: center; gap: var(--space-2); }
.inspection-safe { color: var(--color-brand-dark); font-weight: var(--weight-semibold); }
.inspection-summary-sep { color: var(--color-text-tertiary); }
.inspection-pending { color: var(--color-text-secondary); font-weight: var(--weight-medium); }
.inspection-pending.has-alert { color: var(--state-error); font-weight: var(--weight-semibold); }

.inspection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
.inspection-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--space-4) var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}
.inspection-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(91,184,158,0.14), 0 2px 6px rgba(0,0,0,0.05); }
.inspection-card:active { transform: scale(0.97); }
.inspection-card.pending { border-color: rgba(232, 184, 124, 0.4); }
.inspection-card.overdue { border-color: rgba(253, 101, 133, 0.45); background: rgba(253, 101, 133, 0.04); }
.inspection-card-head { display: flex; align-items: center; gap: var(--space-2); }
.inspection-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.inspection-icon.safe { background: rgba(91, 184, 158, 0.12); }
.inspection-icon.pending { background: rgba(232, 184, 124, 0.15); }
.inspection-icon.overdue { background: rgba(253, 101, 133, 0.12); }
.inspection-name { font-family: var(--font-display); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.inspection-status { align-self: flex-start; font-size: var(--text-xs); font-weight: var(--weight-semibold); padding: 2px 8px; border-radius: var(--radius-full); }
.inspection-status.safe { background: rgba(91, 184, 158, 0.12); color: var(--color-brand-dark); }
.inspection-status.pending { background: rgba(232, 184, 124, 0.15); color: var(--color-accent3-dark); }
.inspection-status.overdue { background: rgba(253, 101, 133, 0.12); color: var(--state-error); }
.inspection-last { font-size: var(--text-xs); color: var(--color-text-tertiary); }
.inspection-book-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
  padding: 6px 10px;
  border: none;
  border-radius: var(--radius-full);
  color: #fff;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(232, 184, 124, 0.3);
}
.inspection-book-btn.pending { background: linear-gradient(135deg, var(--color-accent3), var(--color-accent3-dark)); }
.inspection-book-btn.overdue { background: linear-gradient(135deg, #ff7a8a, var(--state-error)); box-shadow: 0 2px 8px rgba(253, 101, 133, 0.35); }
.inspection-book-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(232, 184, 124, 0.4); }
.inspection-book-btn.overdue:hover { box-shadow: 0 6px 16px rgba(253, 101, 133, 0.45); }
.inspection-book-btn:active { transform: scale(0.96); }

.quick-scroll { display: flex; gap: var(--space-3); overflow-x: auto; padding-bottom: var(--space-2); scroll-snap-type: x mandatory; }
.quick-scroll::-webkit-scrollbar { height: 3px; }
.quick-scroll::-webkit-scrollbar-track { background: transparent; }
.quick-scroll::-webkit-scrollbar-thumb { background: rgba(91, 184, 158, 0.25); border-radius: var(--radius-full); }
.quick-card { flex: 0 0 auto; width: 140px; scroll-snap-align: start; padding: var(--space-4); border-radius: var(--radius-sm); background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.quick-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(91,184,158,0.14), 0 2px 6px rgba(0,0,0,0.05); border-color: rgba(91,184,158,0.3); }
.quick-card:active { transform: scale(0.97); }
.quick-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--color-brand-dark); margin-bottom: var(--space-3); }
.quick-label { font-family: var(--font-display); font-size: var(--text-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-1); }
.quick-value { font-family: var(--font-display); font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-text-primary); }
.quick-unit { font-size: var(--text-xs); font-weight: var(--weight-regular); color: var(--color-text-secondary); margin-left: 2px; }

.plan-card { padding: var(--space-5); }
.plan-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-solid); }
.plan-item:last-of-type { border-bottom: none; }
.plan-time { font-family: var(--font-display); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-brand-dark); min-width: 42px; flex-shrink: 0; }
.plan-emoji { flex-shrink: 0; }
.plan-desc { font-size: var(--text-base); color: var(--color-text-primary); }
.plan-btn { display: block; width: 100%; margin-top: var(--space-4); padding: var(--space-3) var(--space-4); border: none; border-radius: var(--radius-sm); background: var(--color-brand); color: var(--color-text-on-brand); font-family: var(--font-display); font-size: var(--text-sm); font-weight: var(--weight-semibold); text-align: center; min-height: 48px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(91,184,158,0.2); }
.plan-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(91,184,158,0.32); }
.plan-btn:active { background: var(--color-brand-dark); transform: scale(0.98); }

.service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.service-card { padding: var(--space-4); border-radius: var(--radius-md); background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: var(--space-2); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.service-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(91,184,158,0.14); border-color: rgba(91,184,158,0.3); }
.service-card:active { transform: scale(0.97); box-shadow: var(--shadow-md); }
.service-icon { display: flex; align-items: center; }
.service-title { font-family: var(--font-display); font-size: var(--text-base); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.service-desc { font-size: var(--text-xs); color: var(--color-text-secondary); line-height: var(--leading-normal); }

.companion-quick { padding: var(--space-5); border-radius: var(--radius-md); background: linear-gradient(135deg, rgba(91, 184, 158, 0.12) 0%, rgba(111, 177, 217, 0.08) 100%); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border: 1px solid rgba(91, 184, 158, 0.25); box-shadow: var(--shadow-md); cursor: pointer; position: relative; overflow: hidden; }
.companion-quick::after { content: ''; position: absolute; inset: -2px; border-radius: inherit; border: 2px solid transparent; animation: companion-pulse 2.5s ease-in-out infinite; pointer-events: none; }
.companion-title { font-family: var(--font-display); font-size: var(--text-lg); font-weight: var(--weight-semibold); color: var(--color-brand-dark); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2); }
.companion-bubble { padding: var(--space-3) var(--space-4); border-radius: 0 12px 12px 12px; background: rgba(255, 255, 255, 0.85); border: 1px solid var(--glass-border); font-size: var(--text-base); color: var(--color-text-secondary); max-width: 85%; }

/* ============ 高龄长辈模式 ============ */
.home-elderly { padding: 0 var(--space-4); }
.elderly-greeting {
  margin: var(--space-6) 0;
  padding: var(--space-6) var(--space-5);
  border-radius: 24px;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  box-shadow: 0 6px 24px rgba(91,184,158,0.3);
  position: relative;
  overflow: hidden;
}
.elderly-greeting::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}
.elderly-greeting::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
}
.elderly-greeting-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  position: relative;
  z-index: 1;
}
.elderly-greeting-text { flex: 1; min-width: 0; }
.elderly-hello {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: var(--space-2);
  line-height: 1.2;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.elderly-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.92);
  line-height: 1.3;
  white-space: nowrap;
}
.elderly-greeting-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  padding: var(--space-2);
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.elderly-meta-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
}
.elderly-meta-text { display: flex; flex-direction: column; gap: 2px; }
.elderly-meta-date {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  white-space: nowrap;
}
.elderly-meta-lunar {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}
.elderly-greeting-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  position: relative;
  z-index: 1;
}
.elderly-strip-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}
.elderly-strip-item b {
  font-family: var(--font-display);
  font-weight: 700;
  color: #fff;
  font-size: 1.05rem;
  margin-left: 2px;
}
.elderly-strip-divider {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.3);
}
.elderly-health { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6); }
.elderly-health-card { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-5); background: #fff; border: 2px solid rgba(91,184,158,0.25); border-radius: 20px; box-shadow: 0 4px 16px rgba(91,184,158,0.08); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.elderly-health-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,184,158,0.16); border-color: rgba(91,184,158,0.4); }
.elderly-health-card:active { transform: scale(0.98); }
.elderly-health-icon { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 18px; background: linear-gradient(135deg, var(--color-brand-lighter), var(--color-brand-light)); color: var(--color-brand-dark); }
.elderly-health-label { font-size: 1.15rem; color: var(--color-text-secondary); margin-bottom: 4px; }
.elderly-health-value { font-family: var(--font-display); font-size: 1.7rem; font-weight: 800; color: var(--color-text-primary); }
.elderly-actions { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-6); }
.elderly-action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-6) var(--space-4); min-height: 130px; border: 2px solid rgba(91,184,158,0.25); border-radius: 20px; background: #fff; color: var(--color-text-primary); font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 12px rgba(91,184,158,0.06); }
.elderly-action-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,184,158,0.14); border-color: rgba(91,184,158,0.4); }
.elderly-action-btn:active { transform: scale(0.96); box-shadow: 0 1px 6px rgba(91,184,158,0.08); }
.elderly-action-btn.primary { background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark)); border-color: var(--color-brand-dark); color: #fff; box-shadow: 0 4px 16px rgba(91,184,158,0.3); }
.elderly-action-btn.danger { background: linear-gradient(135deg, var(--state-error), #B85555); border-color: #B85555; color: #fff; box-shadow: 0 4px 16px rgba(212,107,107,0.3); }

/* ===== 长按3秒 SOS 求助按钮（高龄长辈 / 视障语音共用）===== */
.sos-hold-section { margin-bottom: var(--space-6); display: flex; justify-content: center; }
.sos-hold-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  aspect-ratio: 1;
  flex-shrink: 0;
  min-height: auto !important;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--state-error), #B85555);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(212,107,107,0.35);
  transition: transform var(--transition-fast);
  user-select: none;
  -webkit-user-select: none;
  overflow: visible;
}
.sos-hold-btn:active { transform: scale(0.95); }
.sos-hold-btn.pressing { animation: sos-pulse 0.8s ease-in-out infinite; }
.sos-ring {
  position: absolute;
  inset: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 16px);
  pointer-events: none;
}
.sos-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.sos-text { font-size: 0.9rem; font-weight: 700; white-space: nowrap; }
@keyframes sos-pulse {
  0%, 100% { box-shadow: 0 6px 24px rgba(212,107,107,0.35); }
  50% { box-shadow: 0 6px 32px rgba(212,107,107,0.6); }
}

.elderly-remind { margin-bottom: var(--space-6); }
.elderly-section-title { display: flex; align-items: center; gap: var(--space-2); font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-4); }
.elderly-remind-item { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4) 0; border-bottom: 2px solid rgba(91,184,158,0.15); }
.elderly-remind-time { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--color-brand-dark); min-width: 85px; }
.elderly-remind-desc { font-size: 1.15rem; color: var(--color-text-primary); }

/* 居家安全检查（高龄长辈模式 - 大字版） */
.elderly-inspection { margin-bottom: var(--space-6); }
.elderly-inspection-summary {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
  border-radius: 20px;
  background: #fff;
  border: 2px solid rgba(91,184,158,0.25);
  box-shadow: 0 4px 16px rgba(91,184,158,0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.elderly-inspection-summary.has-alert { border-color: rgba(253, 101, 133, 0.4); box-shadow: 0 4px 16px rgba(253, 101, 133, 0.1); }
.elderly-inspection-summary-icon { display: flex; align-items: center; justify-content: center; }
.elderly-inspection-summary-text { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary); display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
.elderly-inspection-summary-text b { color: var(--color-brand-dark); }
.elderly-inspection-summary-text b.alert { color: var(--state-error); }
.elderly-inspection-sep { color: var(--color-text-tertiary); margin: 0 2px; }
.elderly-inspection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}
.elderly-inspection-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4);
  border-radius: 20px;
  background: #fff;
  border: 2px solid rgba(91,184,158,0.25);
  box-shadow: 0 4px 16px rgba(91,184,158,0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.elderly-inspection-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,184,158,0.16); border-color: rgba(91,184,158,0.4); }
.elderly-inspection-card:active { transform: scale(0.97); }
.elderly-inspection-card.pending { border-color: rgba(232, 184, 124, 0.45); box-shadow: 0 4px 16px rgba(232, 184, 124, 0.1); }
.elderly-inspection-card.overdue { border-color: rgba(253, 101, 133, 0.5); background: rgba(253, 101, 133, 0.03); box-shadow: 0 4px 16px rgba(253, 101, 133, 0.12); }
.elderly-inspection-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-brand-lighter), var(--color-brand-light));
}
.elderly-inspection-icon.safe { background: linear-gradient(135deg, var(--color-brand-lighter), var(--color-brand-light)); }
.elderly-inspection-icon.pending { background: linear-gradient(135deg, #FCE9C0, #F6C77A); }
.elderly-inspection-icon.overdue { background: linear-gradient(135deg, #FFD3D8, #FF9DA8); }
.elderly-inspection-name { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--color-text-primary); }
.elderly-inspection-status {
  font-size: 1.1rem;
  font-weight: 700;
  padding: 4px 16px;
  border-radius: var(--radius-full);
}
.elderly-inspection-status.safe { background: rgba(91,184,158,0.15); color: var(--color-brand-dark); }
.elderly-inspection-status.pending { background: rgba(232,184,124,0.18); color: var(--color-accent3-dark); }
.elderly-inspection-status.overdue { background: rgba(253,101,133,0.15); color: var(--state-error); }
.elderly-inspection-last { font-size: 1rem; color: var(--color-text-secondary); }
.elderly-inspection-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-1);
  padding: var(--space-3) var(--space-5);
  min-height: 52px;
  border: none;
  border-radius: var(--radius-full);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(232, 184, 124, 0.3);
}
.elderly-inspection-btn.pending { background: linear-gradient(135deg, var(--color-accent3), var(--color-accent3-dark)); }
.elderly-inspection-btn.overdue { background: linear-gradient(135deg, #ff7a8a, var(--state-error)); box-shadow: 0 4px 16px rgba(253, 101, 133, 0.35); }
.elderly-inspection-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(232, 184, 124, 0.4); }
.elderly-inspection-btn.overdue:hover { box-shadow: 0 8px 20px rgba(253, 101, 133, 0.45); }
.elderly-inspection-btn:active { transform: scale(0.96); }

/* ============ 视障语音模式 ============ */
.home-voice { padding: 0 var(--space-5); padding-bottom: 120px; }

/* 问候卡片 */
.voice-greeting {
  margin: var(--space-6) 0;
  text-align: center;
  padding: var(--space-6) var(--space-4);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(91,184,158,0.15) 0%, rgba(111,177,217,0.1) 100%);
  border: 2px solid rgba(91,184,158,0.2);
}
.voice-greeting-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(91,184,158,0.15);
}
.voice-hello {
  font-family: var(--font-display);
  font-size: 2.1rem;
  font-weight: 800;
  color: var(--color-brand-darker);
  margin-bottom: var(--space-2);
}
.voice-tip {
  font-size: 1.15rem;
  color: var(--color-text-secondary);
}

/* 小康播报卡片 */
.voice-companion-card { margin-bottom: var(--space-5); }
.voice-companion-btn {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-family: var(--font-display);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(91,184,158,0.35);
}
.voice-companion-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(91,184,158,0.45); }
.voice-companion-btn:active { transform: scale(0.97); }
.voice-companion-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
}
.voice-companion-text {
  font-size: 1.35rem;
  font-weight: 700;
}
.voice-companion-sub {
  font-size: 1rem;
  opacity: 0.85;
}

/* SOS 卡片 */
.voice-sos-card {
  margin-bottom: var(--space-5);
  padding: var(--space-6) var(--space-4);
  border-radius: 20px;
  background: rgba(212,107,107,0.08);
  border: 2px solid rgba(212,107,107,0.15);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}
.voice-sos-hint {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

/* 健康提醒卡片 */
.voice-health-card {
  margin-bottom: var(--space-5);
  padding: var(--space-5) var(--space-4);
  border-radius: 20px;
  background: #fff;
  border: 2px solid rgba(91,184,158,0.2);
  box-shadow: 0 2px 12px rgba(91,184,158,0.06);
}
.voice-health-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.voice-health-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}
.voice-health-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.voice-health-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 1.1rem;
  color: var(--color-text-primary);
}
.voice-health-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-brand);
  flex-shrink: 0;
}

/* ============ 卧床工具模式 ============ */
.home-tool { padding: 0 var(--space-4); }
.tool-greeting { margin: var(--space-4) 0; }
.tool-hello { font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary); }
.tool-call-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-6); }
.tool-call-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-4); min-height: 100px; border: none; border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.tool-call-btn:hover { transform: translateY(-2px); }
.tool-call-btn:active { transform: scale(0.96); }
.tool-call-btn.primary { background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark)); color: #fff; box-shadow: 0 4px 16px rgba(91,184,158,0.3); }
.tool-call-btn.primary:hover { box-shadow: 0 8px 24px rgba(91,184,158,0.42); }
.tool-call-btn.danger { background: linear-gradient(135deg, var(--state-error), #B85555); color: #fff; box-shadow: 0 4px 16px rgba(212,107,107,0.3); }
.tool-call-btn.danger:hover { box-shadow: 0 8px 24px rgba(212,107,107,0.42); }
.tool-call-text { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; }
.tool-services { margin-bottom: var(--space-6); }
.tool-section-title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-3); }
.tool-service-list { display: flex; flex-direction: column; gap: var(--space-2); }
.tool-service-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border: none; border-radius: 12px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); cursor: pointer; font-size: var(--text-base); color: var(--color-text-primary); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.tool-service-item:hover { transform: translateX(3px); background: rgba(91,184,158,0.08); }
.tool-service-item:active { background: var(--color-surface-hover); transform: scale(0.98); }
.tool-service-item span { flex: 1; text-align: left; }
.tool-med { margin-bottom: var(--space-6); }
.tool-med-list { display: flex; flex-direction: column; gap: var(--space-2); }
.tool-med-card { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-radius: 12px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); }
.tool-med-info { flex: 1; }
.tool-med-name { font-size: var(--text-base); font-weight: 600; color: var(--color-text-primary); }
.tool-med-time { font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: 2px; }
.tool-med-btn { padding: var(--space-2) var(--space-4); border: none; border-radius: var(--radius-full); background: var(--color-accent3); color: #fff; font-size: var(--text-sm); font-weight: 600; cursor: pointer; flex-shrink: 0; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(232,184,124,0.3); }
.tool-med-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232,184,124,0.4); }
.tool-med-btn:active { transform: scale(0.94); }
.tool-med-btn.done { background: var(--color-brand); }
.tool-remind { margin-bottom: var(--space-6); }
.tool-remind-card { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-radius: 12px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); }
.tool-remind-icon { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 14px; background: rgba(111,177,217,0.1); }
.tool-remind-info { flex: 1; }
.tool-remind-name { font-size: var(--text-base); font-weight: 600; color: var(--color-text-primary); }
.tool-remind-time { font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: 2px; }
.tool-remind-btn { padding: var(--space-2) var(--space-4); border: none; border-radius: var(--radius-full); background: var(--color-accent2); color: #fff; font-size: var(--text-sm); font-weight: 600; cursor: pointer; flex-shrink: 0; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(111,177,217,0.3); }
.tool-remind-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(111,177,217,0.4); }
.tool-remind-btn:active { transform: scale(0.94); }

.tool-tip { margin-bottom: var(--space-6); }

/* 天气 + 日期 + 节气 综合信息卡 */
.tool-info-card {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.08), rgba(111, 177, 217, 0.06));
  border: 1px solid rgba(91, 184, 158, 0.22);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.06);
  margin-bottom: var(--space-3);
}
.tool-info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.tool-info-block {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(91, 184, 158, 0.15);
}
.tool-info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
  flex-shrink: 0;
}
.tool-info-body { flex: 1; min-width: 0; }
.tool-info-main {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin-bottom: 2px;
  white-space: nowrap;
}
.tool-info-sub {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  line-height: 1.3;
}
.tool-info-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(91, 184, 158, 0.25), transparent);
  margin: var(--space-3) 0;
}
.tool-info-term {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
}
.tool-term-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-2) var(--space-3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(91, 184, 158, 0.15);
}
.tool-term-block.current {
  background: linear-gradient(135deg, rgba(232, 184, 124, 0.15), rgba(232, 184, 124, 0.08));
  border-color: rgba(232, 184, 124, 0.3);
}
.tool-term-block.next {
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.15), rgba(91, 184, 158, 0.08));
  border-color: rgba(91, 184, 158, 0.3);
}
.tool-term-tag {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}
.tool-term-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.1;
}
.tool-term-meta {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
.tool-term-meta b {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--color-brand-dark);
  font-weight: 800;
  margin: 0 2px;
}
.tool-term-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 2px;
}

.tool-tip-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(232,184,124,0.08), rgba(91,184,158,0.06));
  border: 1px solid rgba(232,184,124,0.2);
}
.tool-tip-icon {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(232,184,124,0.12);
  flex-shrink: 0;
}
.tool-tip-content {
  flex: 1;
}
.tool-tip-text {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.tool-tip-item {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin: 0;
}

/* ============ 护理模式（原极简行动） ============ */
.home-minimal { padding: 0 var(--space-4); background: linear-gradient(135deg, rgba(91,184,158,0.06) 0%, rgba(111,177,217,0.04) 100%); min-height: 100vh; }

/* 顶部信息栏 */
.care-header { margin-bottom: var(--space-4); }
.care-header-top { display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) 0; }
.care-header-tag { font-size: 0.8rem; color: var(--color-text-secondary); }
.care-shift-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: rgba(91,184,158,0.15);
  color: var(--color-brand-dark);
  font-size: 0.8rem;
  font-weight: 600;
}
.care-shift-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand);
  animation: care-pulse 2s ease-in-out infinite;
}
@keyframes care-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.care-greeting { padding: var(--space-4) var(--space-5); background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(91,184,158,0.06); }
.care-greeting-title { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--color-text-primary); margin-bottom: var(--space-2); }
.care-greeting-sub { font-size: 1rem; color: var(--color-text-secondary); }

/* 统计卡片 */
.care-stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-5); }
.care-stat-card {
  padding: var(--space-4) var(--space-3);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(91,184,158,0.06);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.care-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,184,158,0.14); }
.care-stat-card:active { transform: scale(0.97); }
.care-stat-card.highlight {
  background: rgba(91,184,158,0.08);
  border: 2px solid rgba(91,184,158,0.2);
}
.care-stat-card-label { font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: var(--space-1); }
.care-stat-card-value { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--color-text-primary); margin-bottom: 2px; }
.care-stat-card-sub { font-size: 0.75rem; color: var(--color-text-secondary); }

/* 优先护理任务 */
.care-task-section { margin-bottom: var(--space-6); }
.care-task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
.care-task-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary); }
.care-task-refresh {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-brand);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.care-task-refresh:hover { background: rgba(91,184,158,0.1); }
.care-task-refresh:active { transform: scale(0.94); }
.care-task-list { background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(91,184,158,0.06); overflow: hidden; }
.care-task-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid rgba(91,184,158,0.1);
}
.care-task-item:last-child { border-bottom: none; }
.care-task-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}
.care-task-avatar.normal { background: linear-gradient(135deg, var(--color-accent3), var(--color-accent3-dark)); }
.care-task-avatar.warning { background: linear-gradient(135deg, var(--color-accent2), var(--color-accent2-dark)); }
.care-task-info { flex: 1; min-width: 0; }
.care-task-name { font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 2px; white-space: nowrap; }
.care-task-desc { font-size: 0.8rem; color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.care-task-actions { display: flex; align-items: center; gap: var(--space-2); }
.care-task-time {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(91,184,158,0.12);
  color: var(--color-brand-dark);
  font-size: 0.75rem;
  font-weight: 600;
}
.care-task-badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(239,167,96,0.15);
  color: var(--color-accent3-dark);
  font-size: 0.75rem;
  font-weight: 600;
}
.care-task-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}
.care-task-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}
.care-task-btn:hover::before {
  left: 100%;
}
.care-task-btn.primary {
  background: linear-gradient(135deg, #4CAF8A, #2E7D5E);
  color: #fff;
  box-shadow: 
    0 6px 20px rgba(76,175,138,0.4),
    0 2px 8px rgba(76,175,138,0.2),
    inset 0 1px 0 rgba(255,255,255,0.15);
}
.care-task-btn.primary:hover {
  background: linear-gradient(135deg, #5BC49B, #3A9A6F);
  box-shadow: 
    0 8px 25px rgba(76,175,138,0.5),
    0 3px 12px rgba(76,175,138,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transform: translateY(-2px);
}
.care-task-btn.secondary {
  background: rgba(255,255,255,0.9);
  color: var(--color-text-primary);
  border: 1px solid rgba(200,205,215,0.6);
  backdrop-filter: blur(10px);
}
.care-task-btn.secondary:hover {
  background: rgba(255,255,255,1);
  border-color: rgba(91,184,158,0.4);
  box-shadow: 
    0 6px 20px rgba(91,184,158,0.15),
    0 2px 8px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}
.care-task-btn:active {
  transform: scale(0.96);
}

/* 护理模式：动作弹窗 */
.action-dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(20, 25, 30, 0.6);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}
.action-dialog {
  width: 100%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.15),
    0 10px 30px rgba(0,0,0,0.1),
    0 1px 0 rgba(255,255,255,0.8) inset;
  overflow: hidden;
  animation: dialog-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255,255,255,0.5);
}

/* 头部色条 */
.action-dialog-header {
  height: 6px;
  background: linear-gradient(90deg, #4CAF8A, #5BC49B, #4CAF8A);
  position: relative;
  overflow: hidden;
}
.action-dialog-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  animation: header-shine 2s infinite;
}
@keyframes header-shine {
  0% { left: -50%; }
  100% { left: 150%; }
}

.action-dialog-body {
  padding: var(--space-5) var(--space-6) var(--space-6);
  text-align: center;
}

/* 图标动画 */
.action-dialog-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
}
.action-dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF8A, #2E7D5E);
  box-shadow: 
    0 8px 28px rgba(76,175,138,0.4),
    0 4px 12px rgba(76,175,138,0.2),
    inset 0 1px 0 rgba(255,255,255,0.2);
  animation: icon-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
  position: relative;
}
.action-dialog-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
}
@keyframes icon-pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.action-dialog-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: #1A1A2E;
  margin-bottom: var(--space-3);
  letter-spacing: -0.5px;
}

/* 内容分区卡片 */
.action-dialog-content {
  margin-bottom: var(--space-5);
}
.action-dialog-card {
  background: rgba(245, 247, 250, 0.8);
  border-radius: 14px;
  padding: var(--space-4);
  border: 1px solid rgba(200,205,215,0.3);
  backdrop-filter: blur(10px);
}
.action-dialog-text {
  font-size: 0.9rem;
  color: #4A5568;
  line-height: 1.8;
  white-space: pre-line;
  margin: 0;
  text-align: left;
}

/* 按钮 */
.action-dialog-btn {
  width: 100%;
  padding: 14px;
  border: none;
  background: linear-gradient(135deg, #4CAF8A, #2E7D5E);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 6px 20px rgba(76,175,138,0.4),
    0 3px 10px rgba(76,175,138,0.2);
  position: relative;
  overflow: hidden;
}
.action-dialog-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}
.action-dialog-btn:hover::before {
  left: 100%;
}
.action-dialog-btn:hover {
  background: linear-gradient(135deg, #5BC49B, #3A9A6F);
  box-shadow: 
    0 8px 25px rgba(76,175,138,0.5),
    0 4px 14px rgba(76,175,138,0.3);
  transform: translateY(-1px);
}
.action-dialog-btn:active {
  transform: scale(0.97);
}

/* 统计详情弹窗 */
.stat-detail-mask {
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
.stat-detail-dialog {
  width: 100%;
  max-width: 380px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-float);
  animation: dialog-pop 0.3s ease-out;
}
.stat-detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.stat-detail-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.stat-detail-close {
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
  transition: all var(--transition-fast);
}
.stat-detail-close:hover { background: var(--color-bg-tertiary); transform: rotate(90deg); }
.stat-detail-close:active { transform: scale(0.9); }
.stat-detail-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.stat-detail-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}
.stat-detail-time {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-brand-dark);
  min-width: 44px;
  flex-shrink: 0;
}
.stat-detail-desc {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}
.stat-detail-status {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(91,184,158,0.12);
  color: var(--color-brand-dark);
  flex-shrink: 0;
}
.stat-detail-status.warning {
  background: rgba(239,167,96,0.15);
  color: var(--color-accent3-dark);
}

/* ============ 子女照看模式 ============ */
.home-caregiver { padding: 0 var(--space-3); background: #F5F6FA; min-height: 100vh; }
.caregiver-header { display: flex; align-items: flex-start; justify-content: space-between; padding: var(--space-4) 0; border-bottom: 1px solid #E0E3EB; margin-bottom: var(--space-4); }
.caregiver-title { font-size: 1.2rem; font-weight: 700; color: #1A1A2E; }
.caregiver-subtitle { font-size: 0.8rem; color: #6C7293; margin-top: 2px; }
.caregiver-status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; }
.caregiver-status-badge.normal { background: rgba(91,184,158,0.15); color: var(--color-brand-dark); }

/* 母亲实时位置卡片 */
.caregiver-location-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: linear-gradient(135deg, rgba(91,184,158,0.1), rgba(111,177,217,0.08));
  border: 1px solid rgba(91,184,158,0.2);
  border-radius: 14px;
  margin-bottom: var(--space-4);
}
.caregiver-location-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  flex-shrink: 0;
}
.caregiver-location-info { flex: 1; }
.caregiver-location-title { font-size: 0.75rem; color: var(--color-text-tertiary); margin-bottom: 2px; }
.caregiver-location-value { font-size: 0.9rem; font-weight: 700; color: var(--color-text-primary); }
.caregiver-location-time { font-size: 0.7rem; color: var(--color-text-tertiary); flex-shrink: 0; }

/* 用药提醒横幅 */
.caregiver-med-alert {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(135deg, rgba(232,184,124,0.15), rgba(239,167,96,0.1));
  border: 1px solid rgba(232,184,124,0.3);
  border-radius: 12px;
  margin-bottom: var(--space-4);
}
.med-alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-accent3), var(--color-accent3-dark));
  flex-shrink: 0;
}
.med-alert-info { flex: 1; }
.med-alert-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1A1A2E;
  margin-bottom: 2px;
}
.med-alert-desc {
  font-size: 0.72rem;
  color: #6C7293;
}
.med-alert-btn {
  padding: 6px 14px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-accent3);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(232,184,124,0.3);
}
.med-alert-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232,184,124,0.4); }
.med-alert-btn:active { transform: scale(0.95); }

/* 语音提醒弹窗 */
.voice-reminder-mask {
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
.voice-reminder-dialog {
  width: 100%;
  max-width: 340px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-5);
  box-shadow: var(--shadow-float);
  animation: dialog-pop 0.3s ease-out;
  text-align: center;
}
.voice-reminder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  margin: 0 auto var(--space-4);
  box-shadow: 0 4px 16px rgba(91, 184, 158, 0.3);
}
.voice-reminder-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}
.voice-reminder-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
  text-align: left;
}
.voice-reminder-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}
.voice-reminder-label {
  flex-shrink: 0;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-tertiary);
  min-width: 60px;
}
.voice-reminder-value {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.5;
}
.voice-reminder-btn {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.voice-reminder-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(91, 184, 158, 0.4); }
.voice-reminder-btn:active { transform: scale(0.97); }

.caregiver-section { margin-bottom: var(--space-4); }
.caregiver-section-title { font-size: 0.85rem; font-weight: 700; color: #6C7293; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-3); }
.caregiver-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
.caregiver-stat { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2); background: #fff; border-radius: 10px; border: 1px solid #E0E3EB; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.caregiver-stat:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); border-color: rgba(91,184,158,0.3); }
.caregiver-stat.warning { border-left: 3px solid var(--color-accent3); }
.caregiver-stat.normal { border-left: 3px solid var(--color-brand); }
.caregiver-stat-icon { display: flex; color: #6C7293; }
.caregiver-stat-label { font-size: 0.65rem; color: #6C7293; }
.caregiver-stat-value { font-size: 0.8rem; font-weight: 700; color: #1A1A2E; }
.caregiver-timeline { background: #fff; border-radius: 10px; border: 1px solid #E0E3EB; padding: var(--space-3); }
.caregiver-event { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) 0; border-bottom: 1px solid #F0F2F5; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.caregiver-event:hover { padding-left: var(--space-2); background: rgba(91,184,158,0.04); }
.caregiver-event:last-child { border-bottom: none; }
.caregiver-event-time { font-size: 0.75rem; color: #6C7293; min-width: 40px; font-weight: 600; }
.caregiver-event-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.caregiver-event-dot.med { background: var(--color-accent3); }
.caregiver-event-dot.activity { background: var(--color-brand); }
.caregiver-event-dot.chat { background: var(--color-accent2); }
.caregiver-event-dot.meal { background: var(--color-accent3-dark); }
.caregiver-event-dot.social { background: var(--color-brand-dark); }
.caregiver-event-desc { font-size: 0.8rem; color: #1A1A2E; flex: 1; }
.caregiver-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
.caregiver-action { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-3); border: 1px solid #E0E3EB; border-radius: 12px; background: #fff; font-size: 0.85rem; font-weight: 600; color: #1A1A2E; cursor: pointer; white-space: nowrap; transition: all var(--transition-fast); }
.caregiver-action:hover { border-color: rgba(91,184,158,0.4); box-shadow: 0 4px 12px rgba(91,184,158,0.1); transform: translateY(-1px); }
.caregiver-action:active { background: #F5F6FA; transform: scale(0.97); }
.caregiver-action.danger { color: var(--state-error); border-color: rgba(212,107,107,0.3); }
.caregiver-action.primary {
  background: rgba(91,184,158,0.08);
  border-color: rgba(91,184,158,0.3);
  color: var(--color-brand-dark);
}

/* ============ 远程摄像头看护 ============ */
.camera-monitor-card {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: var(--space-3);
  border: 1px solid rgba(91,184,158,0.15);
}
.camera-view {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a2e;
}
.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}
.camera-status {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
}
.camera-time {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
}
.camera-live-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(239,68,68,0.9);
  color: #fff;
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 1px;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: live-pulse 1s infinite;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.camera-controls {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.camera-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 8px;
  border: 1px solid rgba(200,205,215,0.6);
  border-radius: 14px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}
.camera-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: left 0.5s ease;
}
.camera-btn:hover::before { left: 100%; }
.camera-btn:hover {
  background: rgba(255,255,255,1);
  border-color: rgba(91,184,158,0.4);
  box-shadow: 0 6px 20px rgba(91,184,158,0.15), 0 2px 8px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}
.camera-btn:active { transform: scale(0.96); }
.camera-btn.primary {
  background: linear-gradient(135deg, #4CAF8A, #2E7D5E);
  color: #fff;
  border-color: transparent;
  box-shadow:
    0 6px 20px rgba(76,175,138,0.4),
    0 2px 8px rgba(76,175,138,0.2),
    inset 0 1px 0 rgba(255,255,255,0.15);
}
.camera-btn.primary:hover {
  background: linear-gradient(135deg, #5BC49B, #3A9A6F);
  box-shadow:
    0 8px 25px rgba(76,175,138,0.5),
    0 3px 12px rgba(76,175,138,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transform: translateY(-2px);
}
.camera-tips {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: var(--space-2);
  font-size: 0.625rem;
  color: var(--color-text-tertiary);
}

/* ============ 记忆年轮 ============ */
.portrait-card {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: var(--space-3);
  border: 1px solid rgba(91,184,158,0.15);
}
.portrait-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.portrait-frame {
  aspect-ratio: 1;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(255, 142, 142, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: transform var(--transition-normal);
}
.portrait-frame:hover {
  transform: translateY(-2px) scale(1.03);
}
.portrait-label {
  font-size: 0.625rem;
  font-weight: 700;
  color: #fff;
}
.portrait-actions {
  display: flex;
  gap: var(--space-2);
}
.portrait-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 8px;
  border: 1px solid rgba(200,205,215,0.6);
  border-radius: 14px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}
.portrait-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: left 0.5s ease;
}
.portrait-btn:hover::before { left: 100%; }
.portrait-btn:hover {
  background: rgba(255,255,255,1);
  border-color: rgba(91,184,158,0.4);
  box-shadow: 0 6px 20px rgba(91,184,158,0.15), 0 2px 8px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}
.portrait-btn:active { transform: scale(0.96); }
.portrait-btn.primary {
  background: linear-gradient(135deg, #4CAF8A, #2E7D5E);
  color: #fff;
  border-color: transparent;
  box-shadow:
    0 6px 20px rgba(76,175,138,0.4),
    0 2px 8px rgba(76,175,138,0.2),
    inset 0 1px 0 rgba(255,255,255,0.15);
}
.portrait-btn.primary:hover {
  background: linear-gradient(135deg, #5BC49B, #3A9A6F);
  box-shadow:
    0 8px 25px rgba(76,175,138,0.5),
    0 3px 12px rgba(76,175,138,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transform: translateY(-2px);
}
</style>
