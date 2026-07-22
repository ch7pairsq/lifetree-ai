<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import {
  menuGroups, sharedMembers, smartDevices, feedbackCategories, feedbackCases,
  healthArchive, familyShareDetail, aiInterviewDetail, orderListDetail,
  memberBenefits, reminderSettings, aiManagerSettings, memoirChapters,
} from '@/mock'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

// 退出登录
function handleLogout() {
  userStore.logout()
  router.replace('/login')
}

// 访问生命树官网
function openOfficialWebsite() {
  window.open('/official.html', '_blank')
}

// ===== 适老化意见反馈 =====
const showFeedbackPanel = ref(false)
const feedbackStep = ref<'form' | 'list'>('form')
const feedbackForm = ref({
  category: '',
  location: '',
  desc: '',
  contact: '',
})
function openFeedbackPanel() {
  feedbackStep.value = 'form'
  feedbackForm.value = { category: '', location: '', desc: '', contact: '' }
  showFeedbackPanel.value = true
}
function openFeedbackList() {
  feedbackStep.value = 'list'
  showFeedbackPanel.value = true
}
function selectFeedbackCategory(id: string) {
  feedbackForm.value.category = id
}
function submitFeedback() {
  const cat = feedbackCategories.find((c) => c.id === feedbackForm.value.category)
  if (!cat) {
    showAlert('请选择反馈类别')
    return
  }
  if (!feedbackForm.value.desc.trim()) {
    showAlert('请填写具体问题描述')
    return
  }
  showAlert(`意见反馈已提交！\n\n单号：FB${Date.now().toString().slice(-7)}\n类别：${cat.name}\n\n小康将在 24 小时内审核，3 个工作日内由专人联系相关机构协调解决。可在「我的反馈进度」中跟踪处理进展。`)
  showFeedbackPanel.value = false
}

// 菜单点击提示（标准/高龄/视障/卧床模式）
function onMenu(text: string) {
  if (text === '健康档案管理') {
    openHealthArchive()
  } else if (text === '我的用药清单') {
    openHealthArchive()
    healthArchiveTab.value = 'medication'
  } else if (text === '健康报告') {
    openInfoDialog('健康报告', '本周健康报告（7月8日-7月14日）：\n\n· 心率：均值72bpm，正常\n· 血压：均值128/82，略偏高\n· 睡眠：日均7.2小时，质量良好\n· 步数：日均3280步\n· 用药依从性：100%\n\n趋势：整体平稳，建议继续低盐饮食。')
  } else if (text === 'AI 采访') {
    openAiInterview()
  } else if (text === '记忆年轮') {
    openInfoDialog('记忆年轮', '您的人生记忆年轮：\n\n· 1960年代 童年：12条记忆\n· 1970年代 青年：8条记忆\n· 1980年代 成家：15条记忆\n· 2000年代 事业：10条记忆\n· 2010年代 退休：6条记忆\n\n点击各年代可重温对应回忆。')
  } else if (text === 'AI 管家设置') {
    openAiManager()
  } else if (text === '我的订单') {
    openOrders()
  } else if (text === '服务预约记录') {
    openOrders()
    ordersTab.value = 'service'
  } else if (text === '会员权益') {
    openMemberBenefits()
  } else if (text === '界面模式切换') {
    openInfoDialog('界面模式切换', '请在首页右上角点击模式切换按钮，选择适合您的界面模式：\n· 活力老人（标准）\n· 高龄长辈（大字大按钮）\n· 视障语音（语音优先）\n· 卧床模式（工具栏快捷）\n\n切换后自动记忆您的选择。')
  } else if (text === '提醒设置') {
    openReminderSettings()
  } else if (text === '隐私与安全') {
    openInfoDialog('隐私与安全', '隐私安全设置：\n\n· 健康数据共享：仅家庭成员\n· 位置共享：仅女儿小芳\n· 数据加密：已开启\n· 远程查看授权：2人（女儿、家庭医生）\n\n您的数据安全由我们严格守护。')
  } else if (text === '系统设置') {
    openInfoDialog('系统设置', '系统设置：\n\n· 字体大小：标准\n· 屏幕亮度：自动\n· 通知铃声：温和提示音\n· 缓存清理：建议清理（占用23MB）\n· 版本：v2.6.1\n· 检查更新：已是最新')
  } else if (text === '适老化意见反馈') {
    openFeedbackPanel()
  } else if (text === '我的反馈进度') {
    openFeedbackList()
  }
}

// 家庭共享设置
const showSharePanel = ref(false)
const memberList = ref(smartDevices.length ? sharedMembers.map((m) => ({ ...m })) : [])
function openSharePanel() {
  // 任务7：打开扩展的家庭共享设置弹窗（含成员管理、权限、邀请）
  openFamilyShare()
}

// 统一提示弹窗（替代原生 alert）
const showAppAlert = ref(false)
const appAlertMsg = ref('')
function showAlert(msg: string) {
  appAlertMsg.value = msg
  showAppAlert.value = true
}
function addMember() {
  showAlert('请扫描对方二维码或输入手机号添加共享人员')
}

// 智能设备管理
const deviceList = ref(smartDevices.map((d) => ({ ...d })))
function toggleDevice(idx: number) {
  deviceList.value[idx].on = !deviceList.value[idx].on
  if (deviceList.value[idx].on) {
    deviceList.value[idx].online = true
  } else {
    deviceList.value[idx].online = false
  }
}

// 护理模式：护理人员菜单
const careMenuGroups = [
  {
    title: '护理工作',
    items: [
      { icon: 'clipboard-list', text: '排班管理', badge: 0 },
      { icon: 'file-text', text: '护理记录', badge: 0 },
      { icon: 'users', text: '长者档案', badge: 6 },
      { icon: 'refresh-cw', text: '交接班记录', badge: 0 },
    ],
  },
  {
    title: '专业工具',
    items: [
      { icon: 'heart-pulse', text: '健康监测工具', badge: 0 },
      { icon: 'pill', text: '用药管理', badge: 0 },
      { icon: 'alert-triangle', text: '风险评估工具', badge: 0 },
      { icon: 'book-open', text: '护理知识库', badge: 0 },
    ],
  },
  {
    title: '个人',
    items: [
      { icon: 'graduation', text: '护理培训', badge: 2 },
      { icon: 'star', text: '护理评价', badge: 0 },
      { icon: 'bell', text: '提醒设置', badge: 0 },
      { icon: 'settings', text: '系统设置', badge: 0 },
    ],
  },
]

// 子女模式：女儿菜单
const caregiverMenuGroups = [
  {
    title: '妈妈健康',
    items: [
      { icon: 'heart-pulse', text: '妈妈健康档案', badge: 0 },
      { icon: 'pill', text: '妈妈用药管理', badge: 0 },
      { icon: 'bar-chart', text: '健康趋势报告', badge: 3 },
      { icon: 'shield-check', text: '健康授权管理', badge: 0 },
    ],
  },
  {
    title: '远程管理',
    items: [
      { icon: 'video', text: '远程视频设置', badge: 0 },
      { icon: 'phone', text: '远程语音设置', badge: 0 },
      { icon: 'map-pin', text: '位置查看', badge: 0 },
      { icon: 'bell', text: '提醒设置', badge: 0 },
    ],
  },
  {
    title: '家庭',
    items: [
      { icon: 'users', text: '家庭共享设置', badge: 0 },
      { icon: 'cpu', text: '智能设备管理', badge: 0 },
      { icon: 'calendar-plus', text: '代预约记录', badge: 0 },
    ],
  },
  {
    title: '其他',
    items: [
      { icon: 'shopping-bag', text: '我的订单', badge: 0 },
      { icon: 'gem', text: '会员权益', badge: 0 },
      { icon: 'settings', text: '系统设置', badge: 0 },
    ],
  },
]

// 护理人员资料
const caregiverProfile = {
  name: '小周',
  id: 'CG20260008',
  role: '护理员',
  community: '和平里社区',
  rating: 4.9,
  todayTasks: 14,
  completedTasks: 6,
}

// 女儿女婿资料
const daughterProfile = {
  name: '小芳',
  id: 'LT20260002',
  role: '女儿',
  momName: '王秀兰',
  momAge: 68,
  distance: '8.8km',
}

function onCareMenu(text: string) {
  if (text === '排班管理') {
    openInfoDialog('排班管理', '本周排班：\n周一至周五 早班 07:00-15:00\n周六 机动班\n周日 休息')
  } else if (text === '护理记录') {
    openInfoDialog('护理记录', '今日已记录 6 条护理记录\n· 王秀兰 晨间护理 ✓\n· 李建国 生命体征检测 ✓\n· 张桂英 血糖检测 ✓')
  } else if (text === '长者档案') {
    openInfoDialog('长者档案', '共管理 6 位长者\n正常 4 位 · 需关注 2 位')
  } else if (text === '交接班记录') {
    openInfoDialog('交接班记录', '上次交班：昨日 15:00\n交班人：小李\n待办事项：3项已接收')
  } else if (text === '健康监测工具') {
    openInfoDialog('健康监测工具', '专业健康监测工具箱：\n· 生命体征快速录入\n· 跌倒风险评估量表\n· 营养风险筛查量表\n· 压疮风险评估量表\n\n点击对应工具开始评估。')
  } else if (text === '用药管理') {
    openInfoDialog('用药管理', '管辖长者用药总览：\n· 王秀兰 3种药 今日2/3已服\n· 李建国 2种药 今日1/2已服\n· 张桂英 1种药 今日1/1已服\n\n有2位长者需关注漏服情况。')
  } else if (text === '风险评估工具') {
    openInfoDialog('风险评估工具', '长者风险评估总览：\n· 高风险：1位（刘德明·跌倒）\n· 中风险：3位\n· 低风险：2位\n\n建议本周完成刘德明上门评估。')
  } else if (text === '护理知识库') {
    openInfoDialog('护理知识库', '护理知识库：\n· 老年常见病护理指南\n· 压疮预防与处理\n· 跌倒预防与应急处理\n· 失能长者护理规范\n· 心理关怀技巧\n\n共收录 128 篇专业文献。')
  } else if (text === '护理培训') {
    openInfoDialog('护理培训', '待完成培训：\n· 老年人急救技能培训（2课时）\n· 压疮预防新指南（1课时）')
  } else if (text === '护理评价') {
    openInfoDialog('护理评价', '本月评价：4.9/5.0\n好评率：98%\n家属留言：小周非常细心负责！')
  } else if (text === '提醒设置') {
    openInfoDialog('提醒设置', '护理提醒设置：\n· 上门护理提醒：已开启\n· 长者用药提醒：已开启\n· 异常指标提醒：已开启\n· 交接班提醒：已开启\n· 排班变动提醒：已开启')
  } else if (text === '系统设置') {
    openInfoDialog('系统设置', '系统设置：\n· 字体大小：标准\n· 通知铃声：温和提示音\n· 数据同步：自动\n· 缓存清理：建议清理\n· 版本：v2.6.1')
  }
}

function onCaregiverMenu(text: string) {
  if (text === '妈妈健康档案') {
    openInfoDialog('妈妈健康档案', '妈妈（王秀兰 68岁）健康档案\n\n健康评分：86分\n风险等级：低风险\n最近体检：2026年6月15日')
  } else if (text === '妈妈用药管理') {
    openInfoDialog('妈妈用药管理', '妈妈今日用药：\n· 07:30 降压药 ✓已服用\n· 08:00 降糖药 ✓已服用\n· 12:30 消炎药 待服用\n· 19:00 钙片 待服用')
  } else if (text === '健康趋势报告') {
    openInfoDialog('健康趋势报告', '妈妈近30天健康趋势：\n· 血压：整体平稳，偶有波动\n· 心率：正常范围\n· 睡眠：质量有所改善\n· 步数：日均3200步')
  } else if (text === '健康授权管理') {
    openInfoDialog('健康授权管理', '已授权查看妈妈健康数据\n\n授权人：小芳（女儿）\n授权范围：全部健康数据\n授权有效期：长期')
  } else if (text === '远程视频设置') {
    // 远程视频设置：不弹窗（按约束要求）
  } else if (text === '远程语音设置') {
    // 远程语音设置：不弹窗（按约束要求）
  } else if (text === '位置查看') {
    openInfoDialog('位置查看', '妈妈当前位置：家中\n\n最后更新：2分钟前\n今日活动范围：小区内')
  } else if (text === '提醒设置') {
    openInfoDialog('提醒设置', '远程提醒设置：\n· 妈妈用药提醒推送：已开启\n· 妈妈异常指标提醒：已开启\n· 妈妈离家提醒：已开启\n· 妈妈久坐提醒：已开启\n· 夜间紧急呼叫：已开启')
  } else if (text === '家庭共享设置') {
    openSharePanel()
  } else if (text === '智能设备管理') {
    openInfoDialog('智能设备管理', '妈妈的智能设备：\n· 智能血压计 在线\n· 智能手环 在线\n· 智能药盒 在线\n· 智能床垫 在线\n· 燃气报警器 在线\n\n共5台设备正常运行，可在下方查看详情。')
  } else if (text === '代预约记录') {
    openInfoDialog('代预约记录', '近期代妈妈预约：\n· 7月18日 协和医院心内科 张主任 已确认\n· 7月22日 上门家政深度保洁 待确认\n· 7月25日 长者助餐（一周）已安排\n\n共3条预约记录。')
  } else if (text === '我的订单') {
    openInfoDialog('我的订单', '为妈妈下的订单：\n· 钙片+维生素D组合 ¥128 已签收\n· 防滑浴室地垫 ¥39 配送中\n· 智能血压计 ¥269 已签收\n\n近3个月共8笔订单。')
  } else if (text === '会员权益') {
    openInfoDialog('会员权益', '当前等级：黄金会员\n\n专属权益：\n· 远程看护不限时长\n· 代预约优先\n· 妈妈健康月报免费\n· 紧急联络3人\n\n成长值：2680 / 3000')
  } else if (text === '系统设置') {
    openInfoDialog('系统设置', '系统设置：\n· 字体大小：标准\n· 通知铃声：温和提示音\n· 数据同步：自动\n· 缓存清理：建议清理\n· 版本：v2.6.1')
  }
}

// ===== 任务6：健康档案管理弹窗（4个tab） =====
const showHealthArchive = ref(false)
const healthArchiveTab = ref<'profile' | 'checkup' | 'record' | 'medication'>('profile')
function openHealthArchive() {
  healthArchiveTab.value = 'profile'
  showHealthArchive.value = true
}

// ===== 任务7：家庭共享设置弹窗（扩展） =====
const showFamilyShare = ref(false)
const familyShareTab = ref<'members' | 'permissions' | 'invite'>('members')
function openFamilyShare() {
  familyShareTab.value = 'members'
  showFamilyShare.value = true
}
function toggleMemberPermission(memberId: string, permKey: string) {
  const m = familyShareDetail.members.find((x) => x.id === memberId)
  if (!m) return
  const idx = m.permissions.indexOf(permKey)
  if (idx >= 0) m.permissions.splice(idx, 1)
  else m.permissions.push(permKey)
}
function inviteMember(type: string) {
  const map: Record<string, string> = { child: '子女', doctor: '家庭医生', nurse: '护理员' }
  showAlert(`正在生成${map[type]}邀请二维码...\n\n可将二维码发送给对方，扫码后即可绑定并查看您授权的内容。`)
}

// ===== 任务8：AI采访弹窗 =====
const showAiInterview = ref(false)
const aiInterviewTab = ref<'topics' | 'features' | 'chapters'>('topics')
function openAiInterview() {
  aiInterviewTab.value = 'topics'
  showAiInterview.value = true
}
function startInterview(topicId: string) {
  const topic = aiInterviewDetail.topics.find((t) => t.id === topicId)
  if (!topic) return
  showAlert(`小康开始陪您回忆「${topic.name}」\n\n点击下方麦克风按钮开始讲述，小康会引导提问，您的讲述将自动转为文字，整理进回忆录。\n\n已为您准备 ${topic.questions} 个引导问题，可慢慢讲述，亦可上传老照片辅助回忆。`)
}
function shareMemoir() {
  showAlert('回忆录分享链接已生成！\n\n· 链接已复制到剪贴板\n· 子女可点击链接查看并补充细节\n· 仅授权家属可查看，永久有效\n\n让亲情与记忆代代相传～')
}
function startVoiceRecord() {
  showAlert('语音录制开始...\n\n请慢慢讲述，小康会自动将您的声音转为文字。讲述过程中可随时上传老照片辅助回忆。')
}
function uploadOldPhoto() {
  showAlert('正在打开相册...\n\n选择老照片后，小康会识别时代背景，帮您更好地回忆往事。')
}

// ===== 任务9：我的订单弹窗（3类） =====
const showOrders = ref(false)
const ordersTab = ref<'shop' | 'service' | 'course'>('shop')
function openOrders() {
  ordersTab.value = 'shop'
  showOrders.value = true
}
function trackOrder(id: string) { showAlert(`订单 ${id} 物流追踪：\n\n· 已发货，预计 2026-07-12 送达\n· 当前位置：北京顺义分拣中心\n· 配送员：小张 138****1234`) }
function reviewOrder(id: string) { showAlert(`订单 ${id} 评价入口已打开\n\n感谢您的反馈，您的评价将帮助其他老人做出选择。`) }
function reorder(id: string) { showAlert(`订单 ${id} 已加入购物车\n\n可直接去康养商城结算。`) }
function reviewService(id: string) { showAlert(`服务 ${id} 评价入口已打开\n\n您对本次服务的评价对小康团队非常重要。`) }
function reviewCourse(id: string) { showAlert(`课程 ${id} 评价入口已打开\n\n您的反馈将帮助讲师优化课程内容。`) }

// ===== 任务10：会员权益弹窗 =====
const showMemberBenefits = ref(false)
const memberTab = ref<'level' | 'subscribe' | 'points'>('level')
function openMemberBenefits() {
  memberTab.value = 'level'
  showMemberBenefits.value = true
}
// 辅助函数：避免在 Vue 模板中使用 TS 类型断言
function isCurrentLevel(lv: { current?: boolean }): boolean { return !!lv.current }
function isPopularPlan(p: { popular?: boolean }): boolean { return !!p.popular }
function subscribePlan(name: string) { showAlert(`已选择「${name}」\n\n· 月费自动续费可随时取消\n· 第一个月可免费体验\n· 子女账号可在家庭套餐下绑定共享\n\n点击确认立即开通。`) }
function redeemPoints(item: string, points: number) {
  if (memberBenefits.currentPoints < points) {
    showAlert(`积分不足！\n\n兑换「${item}」需要 ${points} 积分，您当前积分 ${memberBenefits.currentPoints}。\n可通过签到、健康打卡、商城消费等获取积分。`)
    return
  }
  showAlert(`兑换成功！\n\n· 商品：${item}\n· 消耗积分：${points}\n· 剩余积分：${memberBenefits.currentPoints - points}\n\n商品将在3个工作日内送达。`)
}

// ===== 任务11：提醒设置弹窗 =====
const showReminderSettings = ref(false)
const reminderList = ref(reminderSettings.categories.map((c) => ({ ...c, methods: { ...c.methods } })))
const doNotDisturb = ref({ ...reminderSettings.doNotDisturb })
function openReminderSettings() { showReminderSettings.value = true }
function toggleReminder(idx: number) { reminderList.value[idx].enabled = !reminderList.value[idx].enabled }
function toggleReminderMethod(idx: number, key: 'voice' | 'vibrate' | 'popup') {
  reminderList.value[idx].methods[key] = !reminderList.value[idx].methods[key]
}
function saveReminders() { showAlert('提醒设置已保存！\n\n小康将按您的设置及时提醒，重要事项不会漏。') }

// ===== 任务12：AI管家设置弹窗 =====
const showAiManager = ref(false)
const aiManager = reactive({
  voiceSpeed: aiManagerSettings.voiceSpeed,
  voiceType: aiManagerSettings.voiceType,
  dialect: aiManagerSettings.dialect,
  volume: aiManagerSettings.volume,
  careFrequency: aiManagerSettings.careFrequency,
  nickname: aiManagerSettings.nickname,
})
const aiCareOptions = ref(aiManagerSettings.careOptions.map((c) => ({ ...c })))
function openAiManager() { showAiManager.value = true }
function toggleCareOption(idx: number) { aiCareOptions.value[idx].enabled = !aiCareOptions.value[idx].enabled }
function previewVoice() { showAlert(`小康正在用「${aiManager.voiceType}（${aiManager.dialect}）」向您打招呼...\n\n「${aiManager.nickname}您好，今天感觉怎么样？小康一直陪着您呢～」`) }
function saveAiManager() { showAlert('AI管家设置已保存！\n\n小康会按您的偏好贴心服务，主动关怀频率也会相应调整。') }

// 美化弹窗（从上方滑入）
const showInfoDialog = ref(false)
const infoDialogTitle = ref('')
const infoDialogMsg = ref('')

function openInfoDialog(title: string, msg: string) {
  infoDialogTitle.value = title
  infoDialogMsg.value = msg
  showInfoDialog.value = true
}
</script>

<template>
  <div>
    <!-- 护理模式：护理人员"我的"页面 -->
    <div v-if="userStore.isMinimal" class="profile-page care-profile">
    <!-- 护理人员资料卡 -->
    <div class="profile-card glass-card">
      <div class="avatar"><AppIcon name="circle-user" :size="40" color="var(--color-brand-dark)" /></div>
      <div class="profile-name">{{ caregiverProfile.name }}</div>
      <div class="profile-id">{{ caregiverProfile.role }} · {{ caregiverProfile.community }}</div>
      <div class="profile-badges">
        <span class="badge"><AppIcon name="star" :size="12" /> 评分 {{ caregiverProfile.rating }}</span>
        <span class="badge badge-gold"><AppIcon name="clipboard-list" :size="12" /> 今日 {{ caregiverProfile.completedTasks }}/{{ caregiverProfile.todayTasks }}</span>
      </div>
    </div>

    <!-- 护理菜单 -->
    <div v-for="group in careMenuGroups" :key="group.title" class="menu-group">
      <div class="section-title">{{ group.title }}</div>
      <div class="glass-card">
        <div class="menu-list">
          <a
            v-for="item in group.items"
            :key="item.text"
            class="menu-item"
            @click="onCareMenu(item.text)"
          >
            <span class="menu-icon"><AppIcon :name="item.icon" :size="20" color="var(--color-brand)" /></span>
            <span class="menu-text">{{ item.text }}</span>
            <span v-if="item.badge > 0" class="menu-badge">{{ item.badge }}</span>
            <span class="menu-arrow"><AppIcon name="chevron-right" :size="16" color="var(--color-text-tertiary)" /></span>
          </a>
        </div>
      </div>
    </div>

    <!-- 生命树官网入口 -->
    <div class="official-section">
      <a class="official-card" @click="openOfficialWebsite">
        <span class="official-logo">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="13" r="8" fill="url(#offCrownCare)" />
            <circle cx="12" cy="19" r="5.5" fill="url(#offCrownCare)" opacity="0.85" />
            <circle cx="28" cy="19" r="5.5" fill="url(#offCrownCare)" opacity="0.85" />
            <path d="M18 21 L18 33 L22 33 L22 21 Z" fill="#3E9A80" />
            <path d="M13 33 Q20 35.5 27 33" stroke="#3E9A80" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M20 8.5 C18.8 7 16.8 7.5 16.8 9.5 C16.8 11.2 20 13 20 13 C20 13 23.2 11.2 23.2 9.5 C23.2 7.5 21.2 7 20 8.5 Z" fill="#fff" opacity="0.92" />
            <defs>
              <linearGradient id="offCrownCare" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7DCEAF" />
                <stop offset="100%" stop-color="#3E9A80" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span class="official-info">
          <span class="official-title">生命树官网</span>
          <span class="official-desc">了解产品 · 合作咨询 · 公益计划</span>
        </span>
        <span class="official-arrow"><AppIcon name="link" :size="18" color="var(--color-brand-dark)" /></span>
      </a>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        <AppIcon name="log-out" :size="18" color="var(--state-error)" />
        <span>退出登录</span>
      </button>
    </div>

    <div class="bottom-space"></div>
  </div>

  <!-- 子女模式：女儿"我的"页面 -->
  <div v-else-if="userStore.isCaregiver" class="profile-page daughter-profile">
    <!-- 女儿资料卡 -->
    <div class="profile-card glass-card">
      <div class="avatar"><AppIcon name="circle-user" :size="40" color="var(--color-brand-dark)" /></div>
      <div class="profile-name">{{ daughterProfile.name }}</div>
      <div class="profile-id">{{ daughterProfile.role }} · 距妈妈 {{ daughterProfile.distance }}</div>
      <div class="profile-badges">
        <span class="badge"><AppIcon name="heart-pulse" :size="12" /> 妈妈{{ daughterProfile.momName }}</span>
        <span class="badge badge-gold"><AppIcon name="shield-check" :size="12" /> 已授权</span>
      </div>
    </div>

    <!-- 妈妈状态快览 -->
    <div class="mom-status-card glass-card">
      <div class="mom-status-title">妈妈今日状态</div>
      <div class="mom-status-grid">
        <div class="mom-status-item">
          <div class="mom-status-label">健康评分</div>
          <div class="mom-status-value">86<span class="mom-status-unit">分</span></div>
        </div>
        <div class="mom-status-item">
          <div class="mom-status-label">用药</div>
          <div class="mom-status-value">2/4<span class="mom-status-unit">已服</span></div>
        </div>
        <div class="mom-status-item">
          <div class="mom-status-label">活动</div>
          <div class="mom-status-value">3,280<span class="mom-status-unit">步</span></div>
        </div>
        <div class="mom-status-item">
          <div class="mom-status-label">位置</div>
          <div class="mom-status-value mom-status-pos">在家中</div>
        </div>
      </div>
    </div>

    <!-- 女儿菜单 -->
    <div v-for="group in caregiverMenuGroups" :key="group.title" class="menu-group">
      <div class="section-title">{{ group.title }}</div>
      <div class="glass-card">
        <div class="menu-list">
          <a
            v-for="item in group.items"
            :key="item.text"
            class="menu-item"
            @click="onCaregiverMenu(item.text)"
          >
            <span class="menu-icon"><AppIcon :name="item.icon" :size="20" color="var(--color-brand)" /></span>
            <span class="menu-text">{{ item.text }}</span>
            <span v-if="item.badge > 0" class="menu-badge">{{ item.badge }}</span>
            <span class="menu-arrow"><AppIcon name="chevron-right" :size="16" color="var(--color-text-tertiary)" /></span>
          </a>
        </div>
      </div>
    </div>

    <!-- 家庭共享设置（复用原有弹窗） -->
    <div class="share-section">
      <div class="section-title"><AppIcon name="users" :size="16" /> 家庭共享设置</div>
      <div class="glass-card share-card" @click="openSharePanel">
        <div class="share-summary">
          <div class="share-avatars">
            <span v-for="(m, idx) in sharedMembers.slice(0, 4)" :key="idx" class="share-avatar-mini" :style="{ background: m.color }">
              <AppIcon :name="m.avatar" :size="16" color="#fff" />
            </span>
          </div>
          <div class="share-info">
            <div class="share-info-title">{{ sharedMembers.length }} 位共享人员</div>
            <div class="share-info-desc">家庭医生、社区护理员等</div>
          </div>
          <span class="share-arrow"><AppIcon name="chevron-right" :size="18" color="var(--color-text-tertiary)" /></span>
        </div>
      </div>
    </div>

    <!-- 智能设备管理 -->
    <div class="device-section">
      <div class="section-title"><AppIcon name="cpu" :size="16" /> 妈妈的智能设备</div>
      <div class="device-list">
        <div v-for="(d, idx) in deviceList" :key="d.key" class="device-card glass-card" :class="{ abnormal: d.abnormal, off: !d.on }">
          <div class="device-head">
            <span class="device-icon" :class="{ offline: !d.online }"><AppIcon :name="d.icon" :size="22" :color="d.online ? 'var(--color-brand)' : 'var(--color-text-tertiary)'" /></span>
            <div class="device-info">
              <div class="device-name">{{ d.name }}</div>
              <div class="device-status">
                <span class="device-status-dot" :class="{ online: d.online, offline: !d.online }"></span>
                <span :class="{ online: d.online, offline: !d.online }">{{ d.online ? '在线' : '离线' }}</span>
                <span v-if="d.abnormal" class="device-abnormal-tag">异常</span>
              </div>
            </div>
            <label class="device-switch" @click.stop>
              <input type="checkbox" :checked="d.on" @change="toggleDevice(idx)" />
              <span class="device-switch-slider"></span>
            </label>
          </div>
          <div class="device-meta">
            <span class="device-battery" :class="{ low: d.battery < 20 }">
              <AppIcon name="battery" :size="13" />
              {{ d.battery }}%
            </span>
            <span class="device-sync"><AppIcon name="refresh-cw" :size="13" /> {{ d.lastSync }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 生命树官网入口 -->
    <div class="official-section">
      <a class="official-card" @click="openOfficialWebsite">
        <span class="official-logo">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="13" r="8" fill="url(#offCrownDaughter)" />
            <circle cx="12" cy="19" r="5.5" fill="url(#offCrownDaughter)" opacity="0.85" />
            <circle cx="28" cy="19" r="5.5" fill="url(#offCrownDaughter)" opacity="0.85" />
            <path d="M18 21 L18 33 L22 33 L22 21 Z" fill="#3E9A80" />
            <path d="M13 33 Q20 35.5 27 33" stroke="#3E9A80" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M20 8.5 C18.8 7 16.8 7.5 16.8 9.5 C16.8 11.2 20 13 20 13 C20 13 23.2 11.2 23.2 9.5 C23.2 7.5 21.2 7 20 8.5 Z" fill="#fff" opacity="0.92" />
            <defs>
              <linearGradient id="offCrownDaughter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7DCEAF" />
                <stop offset="100%" stop-color="#3E9A80" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span class="official-info">
          <span class="official-title">生命树官网</span>
          <span class="official-desc">了解产品 · 合作咨询 · 公益计划</span>
        </span>
        <span class="official-arrow"><AppIcon name="link" :size="18" color="var(--color-brand-dark)" /></span>
      </a>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        <AppIcon name="log-out" :size="18" color="var(--state-error)" />
        <span>退出登录</span>
      </button>
    </div>

    <div class="bottom-space"></div>

    <!-- 家庭共享设置详情弹窗 -->
    <transition name="fade">
      <div v-if="showSharePanel" class="share-mask" @click="showSharePanel = false">
        <div class="share-dialog" @click.stop>
          <div class="share-dialog-head">
            <div class="share-dialog-title">家庭共享设置</div>
            <button class="share-dialog-close" @click="showSharePanel = false"><AppIcon name="x" :size="18" /></button>
          </div>
          <div class="share-dialog-list">
            <div v-for="(m, idx) in sharedMembers" :key="idx" class="share-member-item">
              <span class="share-member-avatar" :style="{ background: m.color }">
                <AppIcon :name="m.avatar" :size="22" color="#fff" />
              </span>
              <div class="share-member-info">
                <div class="share-member-name">
                  {{ m.name }}
                  <span class="share-member-role">{{ m.role }}</span>
                </div>
                <div class="share-member-phone"><AppIcon name="phone" :size="12" /> {{ m.phone }}</div>
                <div class="share-member-location"><AppIcon name="map-pin" :size="12" /> {{ m.location }}</div>
              </div>
              <div class="share-member-right">
                <span class="share-member-status" :class="{ online: m.online, offline: !m.online }">
                  <span class="status-dot" :class="{ online: m.online, offline: !m.online }"></span>
                  {{ m.online ? '在线' : '离线' }}
                </span>
                <span v-if="m.online && m.distance" class="share-member-distance">距您 {{ m.distance }}</span>
              </div>
            </div>
          </div>
          <button class="share-add-btn" @click="addMember">
            <AppIcon name="plus" :size="18" color="var(--color-brand)" />
            <span>添加共享人员</span>
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- 默认：标准/高龄/视障/卧床模式 -->
  <div v-else class="profile-page">
    <!-- 1. 用户资料卡 -->
    <div class="profile-card glass-card">
      <div class="avatar"><AppIcon :name="userStore.profile.avatar" :size="40" color="var(--color-brand-dark)" /></div>
      <div class="profile-name">{{ userStore.profile.name }}</div>
      <div class="profile-id">ID: {{ userStore.profile.id }}</div>
      <div class="profile-badges">
        <span class="badge"><AppIcon name="heart-pulse" :size="12" /> 健康评分 {{ userStore.profile.healthScore }}</span>
        <span class="badge badge-gold"><AppIcon name="gem" :size="12" /> {{ userStore.profile.memberLevel }}</span>
      </div>
    </div>

    <!-- 3. 菜单组 -->
    <div v-for="group in menuGroups" :key="group.title" class="menu-group">
      <div class="section-title">{{ group.title }}</div>
      <div class="glass-card">
        <div class="menu-list">
          <a
            v-for="item in group.items"
            :key="item.text"
            class="menu-item"
            @click="onMenu(item.text)"
          >
            <span class="menu-icon"><AppIcon :name="item.icon" :size="20" color="var(--color-brand)" /></span>
            <span class="menu-text">{{ item.text }}</span>
            <span v-if="item.badge > 0" class="menu-badge">{{ item.badge }}</span>
            <span class="menu-arrow"><AppIcon name="chevron-right" :size="16" color="var(--color-text-tertiary)" /></span>
          </a>
        </div>
      </div>
    </div>

    <!-- 4. 家庭共享设置 -->
    <div class="share-section">
      <div class="section-title"><AppIcon name="users" :size="16" /> 家庭共享设置</div>
      <div class="glass-card share-card" @click="openSharePanel">
        <div class="share-summary">
          <div class="share-avatars">
            <span v-for="(m, idx) in sharedMembers.slice(0, 4)" :key="idx" class="share-avatar-mini" :style="{ background: m.color }">
              <AppIcon :name="m.avatar" :size="16" color="#fff" />
            </span>
          </div>
          <div class="share-info">
            <div class="share-info-title">{{ sharedMembers.length }} 位共享人员</div>
            <div class="share-info-desc">女儿、家庭医生、社区护理员等</div>
          </div>
          <span class="share-arrow"><AppIcon name="chevron-right" :size="18" color="var(--color-text-tertiary)" /></span>
        </div>
      </div>
    </div>

    <!-- 5. 智能设备管理 -->
    <div class="device-section">
      <div class="section-title"><AppIcon name="cpu" :size="16" /> 智能设备管理</div>
      <div class="device-list">
        <div v-for="(d, idx) in deviceList" :key="d.key" class="device-card glass-card" :class="{ abnormal: d.abnormal, off: !d.on }">
          <div class="device-head">
            <span class="device-icon" :class="{ offline: !d.online }"><AppIcon :name="d.icon" :size="22" :color="d.online ? 'var(--color-brand)' : 'var(--color-text-tertiary)'" /></span>
            <div class="device-info">
              <div class="device-name">{{ d.name }}</div>
              <div class="device-status">
                <span class="device-status-dot" :class="{ online: d.online, offline: !d.online }"></span>
                <span :class="{ online: d.online, offline: !d.online }">{{ d.online ? '在线' : '离线' }}</span>
                <span v-if="d.abnormal" class="device-abnormal-tag">异常</span>
              </div>
            </div>
            <label class="device-switch" @click.stop>
              <input type="checkbox" :checked="d.on" @change="toggleDevice(idx)" />
              <span class="device-switch-slider"></span>
            </label>
          </div>
          <div class="device-meta">
            <span class="device-battery" :class="{ low: d.battery < 20 }">
              <AppIcon name="battery" :size="13" />
              {{ d.battery }}%
            </span>
            <span class="device-sync"><AppIcon name="refresh-cw" :size="13" /> {{ d.lastSync }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 生命树官网入口 -->
    <div class="official-section">
      <a class="official-card" @click="openOfficialWebsite">
        <span class="official-logo">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="13" r="8" fill="url(#offCrown)" />
            <circle cx="12" cy="19" r="5.5" fill="url(#offCrown)" opacity="0.85" />
            <circle cx="28" cy="19" r="5.5" fill="url(#offCrown)" opacity="0.85" />
            <path d="M18 21 L18 33 L22 33 L22 21 Z" fill="#3E9A80" />
            <path d="M13 33 Q20 35.5 27 33" stroke="#3E9A80" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M20 8.5 C18.8 7 16.8 7.5 16.8 9.5 C16.8 11.2 20 13 20 13 C20 13 23.2 11.2 23.2 9.5 C23.2 7.5 21.2 7 20 8.5 Z" fill="#fff" opacity="0.92" />
            <defs>
              <linearGradient id="offCrown" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7DCEAF" />
                <stop offset="100%" stop-color="#3E9A80" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span class="official-info">
          <span class="official-title">生命树官网</span>
          <span class="official-desc">了解产品 · 合作咨询 · 公益计划</span>
        </span>
        <span class="official-arrow"><AppIcon name="link" :size="18" color="var(--color-brand-dark)" /></span>
      </a>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        <AppIcon name="log-out" :size="18" color="var(--state-error)" />
        <span>退出登录</span>
      </button>
    </div>

    <!-- 底部占位 -->
    <div class="bottom-space"></div>

    <!-- 家庭共享设置详情弹窗 -->
    <transition name="fade">
      <div v-if="showSharePanel" class="share-mask" @click="showSharePanel = false">
        <div class="share-dialog" @click.stop>
          <div class="share-dialog-head">
            <div class="share-dialog-title">家庭共享设置</div>
            <button class="share-dialog-close" @click="showSharePanel = false"><AppIcon name="x" :size="18" /></button>
          </div>
          <div class="share-dialog-list">
            <div v-for="(m, idx) in sharedMembers" :key="idx" class="share-member-item">
              <span class="share-member-avatar" :style="{ background: m.color }">
                <AppIcon :name="m.avatar" :size="22" color="#fff" />
              </span>
              <div class="share-member-info">
                <div class="share-member-name">
                  {{ m.name }}
                  <span class="share-member-role">{{ m.role }}</span>
                </div>
                <div class="share-member-phone"><AppIcon name="phone" :size="12" /> {{ m.phone }}</div>
                <div class="share-member-location"><AppIcon name="map-pin" :size="12" /> {{ m.location }}</div>
              </div>
              <div class="share-member-right">
                <span class="share-member-status" :class="{ online: m.online, offline: !m.online }">
                  <span class="status-dot" :class="{ online: m.online, offline: !m.online }"></span>
                  {{ m.online ? '在线' : '离线' }}
                </span>
                <span v-if="m.online && m.distance" class="share-member-distance">距您 {{ m.distance }}</span>
              </div>
            </div>
          </div>
          <button class="share-add-btn" @click="addMember">
            <AppIcon name="plus" :size="18" color="var(--color-brand)" />
            <span>添加共享人员</span>
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- 美化信息弹窗（从上方滑入） -->
  <transition name="fade">
    <div v-if="showInfoDialog" class="info-dialog-mask" @click="showInfoDialog = false">
      <div class="info-dialog" @click.stop>
        <div class="info-dialog-head">
          <div class="info-dialog-title">{{ infoDialogTitle }}</div>
          <button class="info-dialog-close" @click="showInfoDialog = false">
            <AppIcon name="x" :size="18" />
          </button>
        </div>
        <div class="info-dialog-body">
          <p class="info-dialog-text">{{ infoDialogMsg }}</p>
        </div>
        <button class="info-dialog-btn" @click="showInfoDialog = false">知道了</button>
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

  <!-- 适老化意见反馈弹窗 -->
  <transition name="fade">
    <div v-if="showFeedbackPanel" class="feedback-mask" @click="showFeedbackPanel = false">
      <div class="feedback-dialog" @click.stop>
        <div class="feedback-head">
          <div class="feedback-title">
            <AppIcon :name="feedbackStep === 'form' ? 'message-square' : 'clipboard-list'" :size="20" color="var(--color-brand)" />
            <span>{{ feedbackStep === 'form' ? '适老化意见反馈' : '我的反馈进度' }}</span>
          </div>
          <button class="feedback-close" @click="showFeedbackPanel = false"><AppIcon name="x" :size="18" /></button>
        </div>

        <!-- 表单 -->
        <div v-if="feedbackStep === 'form'" class="feedback-body">
          <div class="feedback-intro">
            <AppIcon name="heart-handshake" :size="14" color="var(--color-brand)" />
            <span>反馈社会中需要适老化改造的问题，专人收集后统一联系相关机构协调解决</span>
          </div>

          <div class="feedback-section-label">选择反馈类别</div>
          <div class="feedback-cat-grid">
            <button
              v-for="c in feedbackCategories"
              :key="c.id"
              class="feedback-cat-item"
              :class="{ active: feedbackForm.category === c.id }"
              @click="selectFeedbackCategory(c.id)"
            >
              <span class="feedback-cat-icon"><AppIcon :name="c.icon" :size="20" color="var(--color-brand)" /></span>
              <span class="feedback-cat-name">{{ c.name }}</span>
              <span class="feedback-cat-desc">{{ c.desc }}</span>
            </button>
          </div>

          <div class="feedback-section-label">具体位置（可选）</div>
          <input v-model="feedbackForm.location" class="feedback-input" placeholder="如：和平里西街12路公交站" />

          <div class="feedback-section-label">问题描述</div>
          <textarea v-model="feedbackForm.desc" class="feedback-textarea" rows="6" placeholder="请详细描述遇到的问题，例如：公交车进门台阶过高，老人上不去；站牌字体太小看不清等"></textarea>

          <div class="feedback-section-label">联系方式（可选）</div>
          <input v-model="feedbackForm.contact" class="feedback-input" placeholder="手机号，便于工作人员跟进反馈" />

          <div class="feedback-tip">
            <AppIcon name="shield-check" :size="13" color="var(--color-brand)" />
            <span>提交后专人 24 小时内审核，3 个工作日内联系相关机构协调处理</span>
          </div>

          <button class="feedback-submit-btn" @click="submitFeedback">
            <AppIcon name="send" :size="16" color="#fff" />
            <span>提交反馈</span>
          </button>
        </div>

        <!-- 反馈进度列表 -->
        <div v-else class="feedback-body">
          <div class="feedback-intro">
            <AppIcon name="info" :size="14" color="var(--color-brand)" />
            <span>以下为您的反馈处理进度，专人持续跟进直至解决</span>
          </div>
          <div class="feedback-case-list">
            <div v-for="c in feedbackCases" :key="c.id" class="feedback-case-item">
              <div class="feedback-case-head">
                <span class="feedback-case-id">{{ c.id }}</span>
                <span class="feedback-case-status" :class="c.status">{{ c.status }}</span>
              </div>
              <div class="feedback-case-meta">
                <span><AppIcon name="target" :size="11" /> {{ c.category }}</span>
                <span><AppIcon name="map-pin" :size="11" /> {{ c.location }}</span>
                <span><AppIcon name="clock" :size="11" /> {{ c.date }}</span>
              </div>
              <div class="feedback-case-desc">{{ c.desc }}</div>
              <div class="feedback-case-progress">
                <AppIcon name="refresh-cw" :size="12" color="var(--color-brand)" />
                <span>{{ c.progress }}</span>
              </div>
            </div>
          </div>
          <button class="feedback-submit-btn ghost" @click="feedbackStep = 'form'">
            <AppIcon name="plus" :size="16" color="var(--color-brand)" />
            <span>提交新反馈</span>
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- 任务6：健康档案管理弹窗 -->
  <transition name="fade">
    <div v-if="showHealthArchive" class="ha-mask" @click="showHealthArchive = false">
      <div class="ha-dialog" @click.stop>
        <div class="ha-head">
          <div class="ha-title"><AppIcon name="clipboard-list" :size="20" color="var(--color-brand)" /> 健康档案管理</div>
          <button class="ha-close" @click="showHealthArchive = false"><AppIcon name="x" :size="18" /></button>
        </div>
        <div class="ha-tabs">
          <button class="ha-tab" :class="{ active: healthArchiveTab === 'profile' }" @click="healthArchiveTab = 'profile'">个人档案</button>
          <button class="ha-tab" :class="{ active: healthArchiveTab === 'checkup' }" @click="healthArchiveTab = 'checkup'">体检报告</button>
          <button class="ha-tab" :class="{ active: healthArchiveTab === 'record' }" @click="healthArchiveTab = 'record'">病历记录</button>
          <button class="ha-tab" :class="{ active: healthArchiveTab === 'medication' }" @click="healthArchiveTab = 'medication'">用药清单</button>
        </div>
        <div class="ha-body">
          <!-- 个人档案 -->
          <div v-if="healthArchiveTab === 'profile'" class="ha-profile">
            <div class="ha-profile-header">
              <div class="ha-profile-avatar"><AppIcon name="circle-user" :size="36" color="var(--color-brand-dark)" /></div>
              <div>
                <div class="ha-profile-name">{{ healthArchive.profile.name }} · {{ healthArchive.profile.age }}岁 · {{ healthArchive.profile.gender }}</div>
                <div class="ha-profile-id">档案编号：{{ healthArchive.profile.id }}</div>
              </div>
              <div class="ha-profile-score">
                <div class="ha-score-num">{{ healthArchive.profile.healthScore }}</div>
                <div class="ha-score-label">健康评分</div>
              </div>
            </div>
            <div class="ha-info-grid">
              <div class="ha-info-item"><span class="ha-info-label">血型</span><span class="ha-info-val">{{ healthArchive.profile.bloodType }}型</span></div>
              <div class="ha-info-item"><span class="ha-info-label">身高</span><span class="ha-info-val">{{ healthArchive.profile.height }}</span></div>
              <div class="ha-info-item"><span class="ha-info-label">体重</span><span class="ha-info-val">{{ healthArchive.profile.weight }}</span></div>
              <div class="ha-info-item"><span class="ha-info-label">风险等级</span><span class="ha-info-val ha-tag-safe">{{ healthArchive.profile.riskLevel }}</span></div>
              <div class="ha-info-item ha-info-full"><span class="ha-info-label">过敏史</span><span class="ha-info-val ha-tag-warn">{{ healthArchive.profile.allergies }}</span></div>
              <div class="ha-info-item ha-info-full"><span class="ha-info-label">慢性病</span><span class="ha-info-val">{{ healthArchive.profile.chronic }}</span></div>
              <div class="ha-info-item ha-info-full"><span class="ha-info-label">家族病史</span><span class="ha-info-val">{{ healthArchive.profile.familyHistory }}</span></div>
              <div class="ha-info-item ha-info-full"><span class="ha-info-label">手术史</span><span class="ha-info-val">{{ healthArchive.profile.surgery }}</span></div>
              <div class="ha-info-item ha-info-full"><span class="ha-info-label">最近体检</span><span class="ha-info-val">{{ healthArchive.profile.lastCheckup }}</span></div>
            </div>
          </div>

          <!-- 体检报告 -->
          <div v-else-if="healthArchiveTab === 'checkup'" class="ha-checkup">
            <div v-for="(c, idx) in healthArchive.checkups" :key="idx" class="ha-checkup-card">
              <div class="ha-checkup-head">
                <div class="ha-checkup-date">{{ c.date }}</div>
                <div class="ha-checkup-hosp">{{ c.hospital }} · {{ c.type }}</div>
              </div>
              <div class="ha-checkup-summary">{{ c.summary }}</div>
              <div class="ha-checkup-items">
                <div v-for="(item, i) in c.items" :key="i" class="ha-checkup-item">
                  <div class="ha-cu-name">{{ item.name }}</div>
                  <div class="ha-cu-value">{{ item.value }} <span class="ha-cu-unit">{{ item.unit }}</span></div>
                  <div class="ha-cu-normal">参考：{{ item.normal }}</div>
                  <span class="ha-cu-status" :class="{ normal: item.status === '正常', warn: item.status === '偏高' || item.status === '偏低' }">{{ item.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 病历记录 -->
          <div v-else-if="healthArchiveTab === 'record'" class="ha-record">
            <div v-for="(r, idx) in healthArchive.records" :key="idx" class="ha-record-card">
              <div class="ha-record-head">
                <span class="ha-record-date">{{ r.date }}</span>
                <span class="ha-record-dept">{{ r.hospital }} · {{ r.dept }}</span>
                <span class="ha-record-doctor"><AppIcon name="stethoscope" :size="12" /> {{ r.doctor }}</span>
              </div>
              <div class="ha-record-diag"><AppIcon name="alert-triangle" :size="13" color="var(--state-error)" /> 诊断：{{ r.diagnosis }}</div>
              <div class="ha-record-prescription"><AppIcon name="pill" :size="13" color="var(--color-brand)" /> 处方：{{ r.prescription }}</div>
              <div class="ha-record-note"><AppIcon name="info" :size="13" color="var(--color-text-tertiary)" /> 备注：{{ r.note }}</div>
            </div>
          </div>

          <!-- 用药清单 -->
          <div v-else-if="healthArchiveTab === 'medication'" class="ha-medication">
            <div class="ha-med-tip">
              <AppIcon name="info" :size="13" color="var(--color-brand)" />
              <span>当前共 {{ healthArchive.medications.length }} 种长期用药，请遵医嘱按时服用</span>
            </div>
            <div v-for="(m, idx) in healthArchive.medications" :key="idx" class="ha-med-card">
              <div class="ha-med-icon"><AppIcon name="pill" :size="20" color="#fff" /></div>
              <div class="ha-med-info">
                <div class="ha-med-name">{{ m.name }} <span class="ha-med-purpose">{{ m.purpose }}</span></div>
                <div class="ha-med-meta">
                  <span><AppIcon name="clock" :size="11" /> {{ m.time }}</span>
                  <span><AppIcon name="refresh-cw" :size="11" /> {{ m.frequency }}</span>
                  <span><AppIcon name="calendar-days" :size="11" /> 起始 {{ m.startDate }}</span>
                </div>
              </div>
              <div class="ha-med-side">
                <div class="ha-med-dose">{{ m.dose }}</div>
                <span class="ha-med-status">{{ m.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 任务7：家庭共享设置弹窗（扩展） -->
  <transition name="fade">
    <div v-if="showFamilyShare" class="fs-mask" @click="showFamilyShare = false">
      <div class="fs-dialog" @click.stop>
        <div class="fs-head">
          <div class="fs-title"><AppIcon name="users" :size="20" color="var(--color-brand)" /> 家庭共享设置</div>
          <button class="fs-close" @click="showFamilyShare = false"><AppIcon name="x" :size="18" /></button>
        </div>
        <div class="fs-tabs">
          <button class="fs-tab" :class="{ active: familyShareTab === 'members' }" @click="familyShareTab = 'members'">成员关系</button>
          <button class="fs-tab" :class="{ active: familyShareTab === 'permissions' }" @click="familyShareTab = 'permissions'">共享权限</button>
          <button class="fs-tab" :class="{ active: familyShareTab === 'invite' }" @click="familyShareTab = 'invite'">邀请加入</button>
        </div>
        <div class="fs-body">
          <!-- 成员关系 -->
          <div v-if="familyShareTab === 'members'" class="fs-members">
            <div class="fs-intro">
              <AppIcon name="info" :size="13" color="var(--color-brand)" />
              <span>管理家庭成员关系，已绑定 {{ familyShareDetail.members.length }} 位共享人员</span>
            </div>
            <div v-for="m in familyShareDetail.members" :key="m.id" class="fs-member">
              <div class="fs-member-avatar" :style="{ background: m.color }"><AppIcon :name="m.avatar" :size="22" color="#fff" /></div>
              <div class="fs-member-info">
                <div class="fs-member-name">{{ m.name }} <span class="fs-member-relation">{{ m.relation }}</span></div>
                <div class="fs-member-perms">
                  <span v-for="p in m.permissions" :key="p" class="fs-perm-chip">{{ familyShareDetail.permissionOptions.find((o) => o.key === p)?.name }}</span>
                </div>
              </div>
              <div class="fs-member-side">
                <span class="fs-member-status" :class="{ online: m.online, offline: !m.online }">{{ m.online ? '在线' : '离线' }}</span>
                <span v-if="m.distance" class="fs-member-dist">{{ m.distance }}</span>
              </div>
            </div>
          </div>

          <!-- 共享权限 -->
          <div v-else-if="familyShareTab === 'permissions'" class="fs-perms">
            <div class="fs-intro">
              <AppIcon name="shield-check" :size="13" color="var(--color-brand)" />
              <span>为每位成员设置可见的数据范围，敏感信息需本人指纹验证</span>
            </div>
            <table class="fs-perm-table">
              <thead>
                <tr>
                  <th>成员</th>
                  <th v-for="opt in familyShareDetail.permissionOptions" :key="opt.key" class="fs-perm-th">
                    <AppIcon :name="opt.icon" :size="13" color="var(--color-brand)" />
                    <span>{{ opt.name }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in familyShareDetail.members" :key="m.id">
                  <td class="fs-perm-member">
                    <span class="fs-perm-avatar" :style="{ background: m.color }"><AppIcon :name="m.avatar" :size="14" color="#fff" /></span>
                    <span>{{ m.name }}<br /><small>{{ m.relation }}</small></span>
                  </td>
                  <td v-for="opt in familyShareDetail.permissionOptions" :key="opt.key" class="fs-perm-cell">
                    <label class="fs-perm-switch" @click="toggleMemberPermission(m.id, opt.key)">
                      <input type="checkbox" :checked="m.permissions.includes(opt.key)" readonly />
                      <span class="fs-perm-slider"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 邀请加入 -->
          <div v-else-if="familyShareTab === 'invite'" class="fs-invite">
            <div class="fs-intro">
              <AppIcon name="user-plus" :size="13" color="var(--color-brand)" />
              <span>选择邀请类型，生成邀请二维码发给对方扫码绑定</span>
            </div>
            <div v-for="inv in familyShareDetail.inviteTypes" :key="inv.type" class="fs-invite-card" @click="inviteMember(inv.type)">
              <div class="fs-invite-icon"><AppIcon :name="inv.icon" :size="24" color="var(--color-brand)" /></div>
              <div class="fs-invite-info">
                <div class="fs-invite-name">{{ inv.name }}</div>
                <div class="fs-invite-desc">{{ inv.desc }}</div>
              </div>
              <AppIcon name="chevron-right" :size="18" color="var(--color-text-tertiary)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 任务8：AI采访弹窗 -->
  <transition name="fade">
    <div v-if="showAiInterview" class="ai-mask" @click="showAiInterview = false">
      <div class="ai-dialog" @click.stop>
        <div class="ai-head">
          <div class="ai-title"><AppIcon name="brain" :size="20" color="var(--color-brand)" /> AI 采访 · 人生回忆录</div>
          <button class="ai-close" @click="showAiInterview = false"><AppIcon name="x" :size="18" /></button>
        </div>
        <div class="ai-tabs">
          <button class="ai-tab" :class="{ active: aiInterviewTab === 'topics' }" @click="aiInterviewTab = 'topics'">回忆主题</button>
          <button class="ai-tab" :class="{ active: aiInterviewTab === 'features' }" @click="aiInterviewTab = 'features'">功能特色</button>
          <button class="ai-tab" :class="{ active: aiInterviewTab === 'chapters' }" @click="aiInterviewTab = 'chapters'">回忆录章节</button>
        </div>
        <div class="ai-body">
          <!-- 主题 -->
          <div v-if="aiInterviewTab === 'topics'" class="ai-topics">
            <div class="ai-intro">
              <AppIcon name="heart-handshake" :size="13" color="var(--color-brand)" />
              <span>小康以聊天方式引导您回忆：童年、青春、工作、爱情、育儿，让亲情与记忆代代相传</span>
            </div>
            <div class="ai-topic-grid">
              <button v-for="t in aiInterviewDetail.topics" :key="t.id" class="ai-topic-card" @click="startInterview(t.id)">
                <div class="ai-topic-icon" :style="{ background: t.bg }"><AppIcon :name="t.icon" :size="22" color="#fff" /></div>
                <div class="ai-topic-info">
                  <div class="ai-topic-name">{{ t.name }}</div>
                  <div class="ai-topic-desc">{{ t.desc }}</div>
                  <div class="ai-topic-progress">已录 {{ t.recorded }} / {{ t.questions }} 问</div>
                </div>
                <AppIcon name="chevron-right" :size="16" color="var(--color-text-tertiary)" />
              </button>
            </div>
            <div class="ai-actions">
              <button class="ai-action-btn primary" @click="startVoiceRecord">
                <AppIcon name="mic" :size="18" color="#fff" />
                <span>开始语音讲述</span>
              </button>
              <button class="ai-action-btn" @click="uploadOldPhoto">
                <AppIcon name="image" :size="18" color="var(--color-brand)" />
                <span>上传老照片辅助</span>
              </button>
              <button class="ai-action-btn" @click="shareMemoir">
                <AppIcon name="share" :size="18" color="var(--color-brand)" />
                <span>分享给子女协作</span>
              </button>
            </div>
          </div>

          <!-- 功能特色 -->
          <div v-else-if="aiInterviewTab === 'features'" class="ai-features">
            <div class="ai-feature-grid">
              <div v-for="(f, idx) in aiInterviewDetail.features" :key="idx" class="ai-feature-card">
                <div class="ai-feature-icon"><AppIcon :name="f.icon" :size="22" color="var(--color-brand)" /></div>
                <div class="ai-feature-name">{{ f.name }}</div>
                <div class="ai-feature-desc">{{ f.desc }}</div>
              </div>
            </div>
            <div class="ai-collab">
              <div class="ai-collab-title"><AppIcon name="users" :size="14" color="var(--color-brand)" /> 子女协作补充</div>
              <div class="ai-collab-list">
                <div v-for="(c, idx) in aiInterviewDetail.collaborators" :key="idx" class="ai-collab-item">
                  <span class="ai-collab-name">{{ c.name }}<small>{{ c.role }}</small></span>
                  <span class="ai-collab-num">补充 {{ c.contributed }} 处</span>
                  <span class="ai-collab-time">{{ c.lastTime }}</span>
                </div>
              </div>
              <button class="ai-action-btn primary" @click="shareMemoir">
                <AppIcon name="share" :size="16" color="#fff" />
                <span>一键分享给子女，邀请协作补充</span>
              </button>
            </div>
          </div>

          <!-- 章节列表 -->
          <div v-else-if="aiInterviewTab === 'chapters'" class="ai-chapters">
            <div class="ai-intro">
              <AppIcon name="book-heart" :size="13" color="var(--color-brand)" />
              <span>AI 协助整理的人生回忆录，共 {{ memoirChapters.length }} 章，让后代了解先辈故事</span>
            </div>
            <div v-for="(c, idx) in memoirChapters" :key="idx" class="ai-chapter">
              <div class="ai-chapter-no">{{ c.no }}</div>
              <div class="ai-chapter-info">
                <div class="ai-chapter-title">{{ c.title }}</div>
                <div class="ai-chapter-meta">
                  <span><AppIcon name="file-text" :size="11" /> {{ c.words }}字</span>
                  <span v-if="c.updated"><AppIcon name="clock" :size="11" /> 更新于 {{ c.updated }}</span>
                </div>
              </div>
              <span class="ai-chapter-status" :class="{ done: c.status === '已完成', doing: c.status === '撰写中', todo: c.status === '待开始' }">{{ c.status }}</span>
            </div>
            <button class="ai-action-btn primary" @click="shareMemoir">
              <AppIcon name="share" :size="16" color="#fff" />
              <span>分享完整回忆录给子女</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 任务9：我的订单弹窗（3类） -->
  <transition name="fade">
    <div v-if="showOrders" class="od-mask" @click="showOrders = false">
      <div class="od-dialog" @click.stop>
        <div class="od-head">
          <div class="od-title"><AppIcon name="shopping-bag" :size="20" color="var(--color-brand)" /> 我的订单</div>
          <button class="od-close" @click="showOrders = false"><AppIcon name="x" :size="18" /></button>
        </div>
        <div class="od-tabs">
          <button class="od-tab" :class="{ active: ordersTab === 'shop' }" @click="ordersTab = 'shop'">商城订单</button>
          <button class="od-tab" :class="{ active: ordersTab === 'service' }" @click="ordersTab = 'service'">服务预约</button>
          <button class="od-tab" :class="{ active: ordersTab === 'course' }" @click="ordersTab = 'course'">课程报名</button>
        </div>
        <div class="od-body">
          <!-- 商城订单 -->
          <div v-if="ordersTab === 'shop'" class="od-shop">
            <div v-for="o in orderListDetail.shopOrders" :key="o.id" class="od-card">
              <div class="od-card-head">
                <span class="od-card-id">{{ o.id }}</span>
                <span class="od-card-status" :class="{ done: o.status === '已签收', doing: o.status === '配送中' }">{{ o.status }}</span>
              </div>
              <div class="od-card-info">
                <div class="od-card-name">{{ o.name }}</div>
                <div class="od-card-spec">{{ o.spec }}</div>
                <div class="od-card-meta"><AppIcon name="calendar-days" :size="11" /> {{ o.date }}</div>
              </div>
              <div class="od-card-amount">¥{{ o.amount }}</div>
              <div class="od-card-actions">
                <button v-if="o.canTrack" class="od-action" @click="trackOrder(o.id)"><AppIcon name="navigation" :size="12" /> 追踪</button>
                <button v-if="o.canReview && !o.reviewed" class="od-action" @click="reviewOrder(o.id)"><AppIcon name="star" :size="12" /> 评价</button>
                <button v-if="o.canReorder" class="od-action primary" @click="reorder(o.id)"><AppIcon name="refresh-cw" :size="12" /> 复购</button>
              </div>
            </div>
          </div>

          <!-- 服务预约 -->
          <div v-else-if="ordersTab === 'service'" class="od-service">
            <div v-for="o in orderListDetail.serviceOrders" :key="o.id" class="od-card">
              <div class="od-card-head">
                <span class="od-card-id">{{ o.id }}</span>
                <span class="od-card-type">{{ o.type }}</span>
                <span class="od-card-status" :class="{ done: o.status === '已完成', doing: o.status === '待服务' || o.status === '施工中' }">{{ o.status }}</span>
              </div>
              <div class="od-card-info">
                <div class="od-card-name">{{ o.name }}</div>
                <div class="od-card-meta"><AppIcon name="calendar-days" :size="11" /> {{ o.date }}</div>
                <div class="od-card-meta"><AppIcon name="user" :size="11" /> {{ o.staff }}</div>
              </div>
              <div class="od-card-amount">¥{{ o.amount }}</div>
              <div class="od-card-actions">
                <button v-if="o.canTrack" class="od-action" @click="trackOrder(o.id)"><AppIcon name="navigation" :size="12" /> 追踪</button>
                <button v-if="o.canReview" class="od-action primary" @click="reviewService(o.id)"><AppIcon name="star" :size="12" /> 评价</button>
              </div>
            </div>
          </div>

          <!-- 课程报名 -->
          <div v-else-if="ordersTab === 'course'" class="od-course">
            <div v-for="o in orderListDetail.courseOrders" :key="o.id" class="od-card">
              <div class="od-card-head">
                <span class="od-card-id">{{ o.id }}</span>
                <span class="od-card-status" :class="{ done: o.status === '已完成', doing: o.status === '已报名' }">{{ o.status }}</span>
              </div>
              <div class="od-card-info">
                <div class="od-card-name">{{ o.name }}</div>
                <div class="od-card-meta"><AppIcon name="calendar-days" :size="11" /> {{ o.date }}</div>
                <div class="od-card-meta"><AppIcon name="map-pin" :size="11" /> {{ o.location }}</div>
              </div>
              <div class="od-card-actions">
                <button v-if="o.canReview" class="od-action primary" @click="reviewCourse(o.id)"><AppIcon name="star" :size="12" /> 评价</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 任务10：会员权益弹窗 -->
  <transition name="fade">
    <div v-if="showMemberBenefits" class="mb-mask" @click="showMemberBenefits = false">
      <div class="mb-dialog" @click.stop>
        <div class="mb-head">
          <div class="mb-title"><AppIcon name="gem" :size="20" color="var(--color-brand)" /> 会员权益</div>
          <button class="mb-close" @click="showMemberBenefits = false"><AppIcon name="x" :size="18" /></button>
        </div>
        <div class="mb-tabs">
          <button class="mb-tab" :class="{ active: memberTab === 'level' }" @click="memberTab = 'level'">会员等级</button>
          <button class="mb-tab" :class="{ active: memberTab === 'subscribe' }" @click="memberTab = 'subscribe'">订阅管理</button>
          <button class="mb-tab" :class="{ active: memberTab === 'points' }" @click="memberTab = 'points'">积分商城</button>
        </div>
        <div class="mb-body">
          <!-- 会员等级 -->
          <div v-if="memberTab === 'level'" class="mb-level">
            <div class="mb-current">
              <div class="mb-current-level">当前等级：<span :style="{ color: '#FFD700' }">{{ memberBenefits.currentLevel }}</span></div>
              <div class="mb-current-progress">
                <div class="mb-progress-bar"><div class="mb-progress-fill" :style="{ width: (memberBenefits.currentPoints / 3000 * 100) + '%' }"></div></div>
                <div class="mb-progress-text">{{ memberBenefits.currentPoints }} / 3000 成长值，距 {{ memberBenefits.nextLevel }} 还差 {{ memberBenefits.growthToNext }}</div>
              </div>
            </div>
            <div class="mb-level-list">
              <div v-for="(lv, idx) in memberBenefits.levels" :key="idx" class="mb-level-card" :class="{ current: isCurrentLevel(lv) }">
                <div class="mb-level-head">
                  <div class="mb-level-name" :style="{ color: lv.color }">{{ lv.name }}</div>
                  <span v-if="isCurrentLevel(lv)" class="mb-level-tag">当前</span>
                </div>
                <div class="mb-level-threshold">{{ lv.threshold }}</div>
                <div class="mb-level-benefits">
                  <div v-for="(b, i) in lv.benefits" :key="i" class="mb-level-benefit"><AppIcon name="check-circle" :size="11" color="var(--color-brand)" /> {{ b }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 订阅管理 -->
          <div v-else-if="memberTab === 'subscribe'" class="mb-subscribe">
            <div class="mb-intro">
              <AppIcon name="info" :size="13" color="var(--color-brand)" />
              <span>家庭套餐支持子女与父母绑定共享，尊享全家健康守护</span>
            </div>
            <div class="mb-plan-grid">
              <div v-for="(p, idx) in memberBenefits.subscriptions" :key="idx" class="mb-plan-card" :class="{ popular: isPopularPlan(p) }">
                <div v-if="isPopularPlan(p)" class="mb-plan-badge">推荐</div>
                <div class="mb-plan-name">{{ p.name }}</div>
                <div class="mb-plan-price">¥{{ p.price }}<small>/{{ p.period }}</small></div>
                <div class="mb-plan-features">
                  <div v-for="(f, i) in p.features" :key="i" class="mb-plan-feature"><AppIcon name="check-circle" :size="11" color="var(--color-brand)" /> {{ f }}</div>
                </div>
                <button class="mb-plan-btn" :class="{ primary: isPopularPlan(p) }" @click="subscribePlan(p.name)">立即订阅</button>
              </div>
            </div>
          </div>

          <!-- 积分商城 -->
          <div v-else-if="memberTab === 'points'" class="mb-points">
            <div class="mb-points-summary">
              <div class="mb-points-num">{{ memberBenefits.currentPoints }}</div>
              <div class="mb-points-label">可用积分</div>
            </div>
            <div class="mb-points-section-title"><AppIcon name="gift" :size="14" color="var(--color-brand)" /> 积分兑换</div>
            <div class="mb-points-shop">
              <div v-for="(item, idx) in memberBenefits.pointsShop" :key="idx" class="mb-points-item">
                <div class="mb-points-icon"><AppIcon :name="item.icon" :size="24" color="var(--color-brand)" /></div>
                <div class="mb-points-info">
                  <div class="mb-points-name">{{ item.name }}</div>
                  <div class="mb-points-original">价值 ¥{{ item.original }}</div>
                </div>
                <div class="mb-points-side">
                  <div class="mb-points-cost">{{ item.points }} 积分</div>
                  <button class="mb-points-btn" @click="redeemPoints(item.name, item.points)">兑换</button>
                </div>
              </div>
            </div>
            <div class="mb-points-section-title"><AppIcon name="clock" :size="14" color="var(--color-brand)" /> 积分明细</div>
            <div class="mb-points-history">
              <div v-for="(h, idx) in memberBenefits.pointsHistory" :key="idx" class="mb-points-row">
                <span class="mb-points-date">{{ h.date }}</span>
                <span class="mb-points-desc">{{ h.desc }}</span>
                <span class="mb-points-change">{{ h.points }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 任务11：提醒设置弹窗 -->
  <transition name="fade">
    <div v-if="showReminderSettings" class="rs-mask" @click="showReminderSettings = false">
      <div class="rs-dialog" @click.stop>
        <div class="rs-head">
          <div class="rs-title"><AppIcon name="bell" :size="20" color="var(--color-brand)" /> 提醒设置</div>
          <button class="rs-close" @click="showReminderSettings = false"><AppIcon name="x" :size="18" /></button>
        </div>
        <div class="rs-body">
          <div class="rs-intro">
            <AppIcon name="info" :size="13" color="var(--color-brand)" />
            <span>为每类提醒自定义提示方式（语音/震动/弹窗）与频率</span>
          </div>
          <div v-for="(r, idx) in reminderList" :key="r.key" class="rs-item">
            <div class="rs-item-head">
              <div class="rs-item-icon"><AppIcon :name="r.icon" :size="20" color="var(--color-brand)" /></div>
              <div class="rs-item-info">
                <div class="rs-item-name">{{ r.name }}</div>
                <div class="rs-item-freq">{{ r.frequency }}</div>
              </div>
              <label class="rs-switch" @click="toggleReminder(idx)">
                <input type="checkbox" :checked="r.enabled" readonly />
                <span class="rs-slider"></span>
              </label>
            </div>
            <div v-if="r.enabled" class="rs-item-methods">
              <span class="rs-method-label">提示方式：</span>
              <button v-for="opt in reminderSettings.methodOptions" :key="opt.key" class="rs-method" :class="{ active: (r.methods as Record<string, boolean>)[opt.key] }" @click="toggleReminderMethod(idx, opt.key as 'voice' | 'vibrate' | 'popup')">
                <AppIcon :name="opt.icon" :size="13" />
                <span>{{ opt.name }}</span>
              </button>
            </div>
          </div>
          <div class="rs-dnd">
            <div class="rs-dnd-head">
              <AppIcon name="moon" :size="18" color="var(--color-brand)" />
              <div class="rs-dnd-info">
                <div class="rs-dnd-name">夜间免打扰</div>
                <div class="rs-dnd-time">{{ doNotDisturb.start }} - {{ doNotDisturb.end }}</div>
              </div>
              <label class="rs-switch" @click="doNotDisturb.enabled = !doNotDisturb.enabled">
                <input type="checkbox" :checked="doNotDisturb.enabled" readonly />
                <span class="rs-slider"></span>
              </label>
            </div>
          </div>
          <button class="rs-save" @click="saveReminders">
            <AppIcon name="check" :size="16" color="#fff" />
            <span>保存设置</span>
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- 任务12：AI管家设置弹窗 -->
  <transition name="fade">
    <div v-if="showAiManager" class="am-mask" @click="showAiManager = false">
      <div class="am-dialog" @click.stop>
        <div class="am-head">
          <div class="am-title"><AppIcon name="mic" :size="20" color="var(--color-brand)" /> AI 管家设置</div>
          <button class="am-close" @click="showAiManager = false"><AppIcon name="x" :size="18" /></button>
        </div>
        <div class="am-body">
          <!-- 语音设置 -->
          <div class="am-section">
            <div class="am-section-title"><AppIcon name="volume-2" :size="16" color="var(--color-brand)" /> 语音设置</div>
            <div class="am-row">
              <span class="am-row-label">语速</span>
              <div class="am-seg">
                <button v-for="opt in aiManagerSettings.voiceSpeedOptions" :key="opt" class="am-seg-btn" :class="{ active: aiManager.voiceSpeed === opt }" @click="aiManager.voiceSpeed = opt">{{ opt }}</button>
              </div>
            </div>
            <div class="am-row">
              <span class="am-row-label">音色</span>
              <div class="am-voice-list">
                <button v-for="opt in aiManagerSettings.voiceTypeOptions" :key="opt.value" class="am-voice-btn" :class="{ active: aiManager.voiceType === opt.value }" @click="aiManager.voiceType = opt.value">
                  <span class="am-voice-name">{{ opt.value }}</span>
                  <span class="am-voice-desc">{{ opt.desc }}</span>
                </button>
              </div>
            </div>
            <div class="am-row">
              <span class="am-row-label">方言</span>
              <div class="am-seg am-seg-wrap">
                <button v-for="opt in aiManagerSettings.dialectOptions" :key="opt" class="am-seg-btn" :class="{ active: aiManager.dialect === opt }" @click="aiManager.dialect = opt">{{ opt }}</button>
              </div>
            </div>
            <div class="am-row">
              <span class="am-row-label">音量</span>
              <input type="range" min="0" max="100" v-model.number="aiManager.volume" class="am-slider" />
              <span class="am-row-value">{{ aiManager.volume }}%</span>
            </div>
            <button class="am-preview" @click="previewVoice"><AppIcon name="play" :size="14" color="var(--color-brand)" /> 试听效果</button>
          </div>

          <!-- 主动关怀频率 -->
          <div class="am-section">
            <div class="am-section-title"><AppIcon name="heart-handshake" :size="16" color="var(--color-brand)" /> 主动关怀频率</div>
            <div class="am-freq-list">
              <button v-for="opt in aiManagerSettings.careFrequencyOptions" :key="opt.value" class="am-freq-btn" :class="{ active: aiManager.careFrequency === opt.value }" @click="aiManager.careFrequency = opt.value">
                <span class="am-freq-name">{{ opt.value }}</span>
                <span class="am-freq-desc">{{ opt.desc }}</span>
              </button>
            </div>
          </div>

          <!-- 关怀选项 -->
          <div class="am-section">
            <div class="am-section-title"><AppIcon name="sparkles" :size="16" color="var(--color-brand)" /> 关怀内容</div>
            <div v-for="(c, idx) in aiCareOptions" :key="c.key" class="am-care">
              <div class="am-care-info">
                <div class="am-care-name">{{ c.name }}</div>
                <div class="am-care-desc">{{ c.desc }}</div>
              </div>
              <label class="rs-switch" @click="toggleCareOption(idx)">
                <input type="checkbox" :checked="c.enabled" readonly />
                <span class="rs-slider"></span>
              </label>
            </div>
          </div>

          <!-- 称呼 -->
          <div class="am-section">
            <div class="am-section-title"><AppIcon name="user" :size="16" color="var(--color-brand)" /> 个性化称呼</div>
            <div class="am-row">
              <span class="am-row-label">小康称呼您为</span>
              <input v-model="aiManager.nickname" class="am-input" placeholder="如：王奶奶" />
            </div>
          </div>

          <button class="am-save" @click="saveAiManager">
            <AppIcon name="check" :size="16" color="#fff" />
            <span>保存设置</span>
          </button>
        </div>
      </div>
    </div>
  </transition>

  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--space-4) var(--space-4) var(--space-8);
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
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin: var(--space-6) 0 var(--space-3);
  padding-left: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.section-title:first-child {
  margin-top: 0;
}

/* 资料卡 */
.profile-card {
  text-align: center;
  padding: var(--space-8) var(--space-5) var(--space-6);
  margin-bottom: var(--space-4);
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-brand-lighter), var(--color-accent2-light));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-3);
  box-shadow: 0 4px 16px rgba(91, 184, 158, 0.25);
  border: 3px solid var(--color-surface-solid);
  color: var(--color-brand-dark);
}
.profile-name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}
.profile-id {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-3);
}
.profile-badges {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  background: var(--color-bg-tertiary);
  color: var(--color-brand-dark);
}
.badge-gold {
  background: linear-gradient(135deg, var(--color-accent3-light), var(--color-accent3));
  color: var(--color-text-primary);
}

/* 家庭关爱 */
.family-section {
  margin-bottom: var(--space-4);
}
.family-row {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-3);
  overflow-x: auto;
}
.family-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  min-width: 64px;
  cursor: pointer;
}
.family-avatar-wrap {
  position: relative;
}
.family-avatar {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-surface-solid);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
  color: var(--color-text-secondary);
}
.family-item:active .family-avatar {
  transform: scale(0.92);
}
.family-add {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}
.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background: var(--state-success);
  border: 2px solid var(--color-surface-solid);
}
.family-name {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
.family-bound {
  color: var(--state-success);
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

/* 菜单 */
.menu-group {
  margin-bottom: var(--space-4);
}
.menu-list {
  padding: var(--space-2) 0;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  min-height: 56px;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
  border-bottom: 1px solid rgba(229, 233, 237, 0.5);
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:hover {
  background: var(--color-surface-hover);
}
.menu-item:active {
  background: var(--color-bg-secondary);
  transform: scale(0.985);
  transform-origin: left center;
}
.menu-icon {
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-brand);
}
.menu-text {
  flex: 1;
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  margin-left: var(--space-2);
}
.menu-arrow {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  margin-left: var(--space-2);
  display: flex;
  align-items: center;
}
.menu-badge {
  background: var(--state-error);
  color: var(--color-text-inverse);
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  margin-left: var(--space-2);
  font-weight: var(--weight-semibold);
}

/* 家庭共享设置 */
.share-section {
  margin-bottom: var(--space-4);
}
.share-card {
  padding: var(--space-4);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.share-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(91,184,158,0.12); }
.share-card:active { transform: scale(0.98); }
.share-summary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.share-avatars {
  display: flex;
}
.share-avatar-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-surface-solid);
  margin-left: -8px;
}
.share-avatar-mini:first-child {
  margin-left: 0;
}
.share-info {
  flex: 1;
}
.share-info-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.share-info-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* 智能设备管理 */
.device-section {
  margin-bottom: var(--space-4);
}
.device-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 340px;
  overflow-y: auto;
  padding-right: 6px;
  /* 美化滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(91, 184, 158, 0.4) transparent;
}
.device-list::-webkit-scrollbar {
  width: 6px;
}
.device-list::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}
.device-list::-webkit-scrollbar-thumb {
  background: rgba(91, 184, 158, 0.35);
  border-radius: 3px;
  transition: background var(--transition-fast);
}
.device-list::-webkit-scrollbar-thumb:hover {
  background: rgba(91, 184, 158, 0.55);
}
.device-card {
  padding: var(--space-4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.device-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(91,184,158,0.1); }
.device-card.abnormal {
  border-color: rgba(212, 107, 107, 0.4);
  background: rgba(212, 107, 107, 0.04);
}
.device-card.off {
  opacity: 0.6;
}
.device-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}
.device-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-bg-tertiary);
  flex-shrink: 0;
}
.device-icon.offline {
  background: var(--color-bg-secondary);
}
.device-info {
  flex: 1;
}
.device-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 4px;
}
.device-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
}
.device-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.device-status-dot.online {
  background: var(--state-success);
}
.device-status-dot.offline {
  background: var(--color-text-tertiary);
}
.device-status .online {
  color: var(--state-success);
}
.device-status .offline {
  color: var(--color-text-tertiary);
}
.device-abnormal-tag {
  margin-left: 6px;
  padding: 1px 6px;
  background: var(--state-error);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 0.625rem;
  font-weight: 600;
}
.device-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
}
.device-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.device-switch-slider {
  position: absolute;
  inset: 0;
  background: var(--color-border-solid);
  border-radius: 24px;
  transition: var(--transition-fast);
}
.device-switch-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: var(--transition-fast);
}
.device-switch input:checked + .device-switch-slider {
  background: var(--color-brand);
}
.device-switch input:checked + .device-switch-slider::before {
  transform: translateX(20px);
}
.device-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.device-battery,
.device-sync {
  display: flex;
  align-items: center;
  gap: 4px;
}
.device-battery.low {
  color: var(--state-error);
}

/* 家庭共享弹窗 */
.share-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.share-dialog {
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
.share-dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.share-dialog-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.share-dialog-close {
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
.share-dialog-close:hover { background: var(--color-bg-tertiary); transform: rotate(90deg); }
.share-dialog-close:active { transform: scale(0.9); }
.share-dialog-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.share-member-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}
.share-member-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}
.share-member-info {
  flex: 1;
}
.share-member-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.share-member-role {
  font-size: 0.625rem;
  font-weight: 500;
  padding: 1px 6px;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
}
.share-member-phone,
.share-member-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
.share-member-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}
.share-member-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  font-weight: 500;
}
.share-member-status .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.share-member-status .status-dot.online {
  background: var(--state-success);
}
.share-member-status .status-dot.offline {
  background: var(--color-text-tertiary);
}
.share-member-status.online {
  color: var(--state-success);
}
.share-member-status.offline {
  color: var(--color-text-tertiary);
}
.share-member-distance {
  font-size: 0.625rem;
  color: var(--color-brand);
  font-weight: 600;
}
.share-add-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 48px;
  border-radius: var(--radius-sm);
  background: rgba(91, 184, 158, 0.1);
  border: 1.5px dashed var(--color-brand);
  color: var(--color-brand-dark);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.share-add-btn:hover { background: rgba(91, 184, 158, 0.16); transform: translateY(-2px); box-shadow: 0 4px 14px rgba(91,184,158,0.12); }
.share-add-btn:active { transform: scale(0.97); }

/* 弹窗过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 妈妈状态快览 */
.mom-status-card {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}
.mom-status-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}
.mom-status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.mom-status-item {
  padding: var(--space-3);
  background: var(--color-bg-secondary);
  border-radius: 12px;
  text-align: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.mom-status-item:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.mom-status-label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
}
.mom-status-value {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-brand-dark);
}
.mom-status-unit {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-text-tertiary);
  margin-left: 2px;
}
.mom-status-pos {
  font-size: 1rem;
  color: var(--state-success);
}

/* 美化信息弹窗（从上方滑入） */
.info-dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}
.info-dialog {
  width: 100%;
  max-width: 380px;
  background: var(--color-surface-solid);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float);
  animation: slide-down 0.3s ease-out;
  overflow: hidden;
}
@keyframes slide-down {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.info-dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
}
.info-dialog-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.info-dialog-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  min-height: auto !important;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.info-dialog-close:hover {
  background: var(--color-bg-tertiary);
  transform: rotate(90deg);
}
.info-dialog-close:active { transform: scale(0.9); }
.info-dialog-body {
  padding: var(--space-5);
  max-height: 50vh;
  overflow-y: auto;
}
.info-dialog-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
  white-space: pre-line;
  margin: 0;
}
.info-dialog-btn {
  display: block;
  width: 100%;
  padding: var(--space-3);
  border: none;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(91,184,158,0.3);
}
.info-dialog-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(91,184,158,0.4);
}
.info-dialog-btn:active {
  transform: scale(0.97);
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

/* ============ 生命树官网入口 ============ */
.official-section {
  margin: var(--space-4) 0 var(--space-3);
  padding: 0 4px;
}
.official-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.12), rgba(111, 177, 217, 0.08));
  border: 1px solid rgba(91, 184, 158, 0.3);
  box-shadow: 0 2px 10px rgba(91, 184, 158, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.official-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(91, 184, 158, 0.2);
  border-color: rgba(91, 184, 158, 0.5);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.18), rgba(111, 177, 217, 0.12));
}
.official-card:active {
  transform: scale(0.98);
}
.official-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-surface-solid);
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.2);
  flex-shrink: 0;
}
.official-logo svg {
  width: 30px;
  height: 30px;
}
.official-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.official-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-brand-dark);
  line-height: 1.3;
}
.official-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
}
.official-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}
.official-card:hover .official-arrow {
  background: var(--color-surface-solid);
  transform: translate(2px, -2px);
  box-shadow: 0 4px 10px rgba(91, 184, 158, 0.2);
}

/* ============ 退出登录按钮 ============ */
.logout-section {
  margin: 16px 0 0;
  padding: 0 4px;
}
.logout-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(212, 107, 107, 0.25);
  border-radius: var(--radius-md);
  color: var(--state-error);
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.logout-btn:hover {
  background: rgba(212, 107, 107, 0.06);
  border-color: rgba(212, 107, 107, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(212, 107, 107, 0.15);
}
.logout-btn:active {
  transform: translateY(0);
}

/* ===== 适老化意见反馈弹窗 ===== */
.feedback-mask {
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
.feedback-dialog {
  width: 100%;
  max-width: 430px;
  max-height: 85vh;
  background: #F5F6FA;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: feedbackFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
@keyframes feedbackFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.feedback-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: #fff;
  border-bottom: 1px solid #E0E3EB;
}
.feedback-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: #1A1A2E;
}
.feedback-close {
  width: 28px;
  height: 28px;
  min-height: 28px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
.feedback-close:hover { background: rgba(0, 0, 0, 0.06); }
.feedback-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.feedback-intro {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: var(--space-3);
  background: rgba(91, 184, 158, 0.08);
  border-radius: 12px;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.feedback-section-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 4px;
}
.feedback-cat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.feedback-cat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px;
  background: #fff;
  border: 1.5px solid #E0E3EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
}
.feedback-cat-item:hover {
  border-color: rgba(91, 184, 158, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.12);
}
.feedback-cat-item.active {
  border-color: var(--color-brand);
  background: rgba(91, 184, 158, 0.08);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.2);
}
.feedback-cat-icon {
  display: inline-flex;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(91, 184, 158, 0.12);
  align-items: center;
  justify-content: center;
}
.feedback-cat-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.feedback-cat-desc {
  font-size: 0.68rem;
  color: var(--color-text-tertiary);
  line-height: 1.4;
}
.feedback-input,
.feedback-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #E0E3EB;
  border-radius: 10px;
  font-size: 0.85rem;
  font-family: inherit;
  color: var(--color-text-primary);
  background: #fff;
  transition: border 0.2s ease;
  box-sizing: border-box;
}
.feedback-input:focus,
.feedback-textarea:focus {
  outline: none;
  border-color: var(--color-brand);
}
.feedback-textarea {
  resize: vertical;
  line-height: 1.6;
  min-height: 140px;
  font-size: 0.9rem;
}
.feedback-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(91, 184, 158, 0.06);
  border-radius: 8px;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.feedback-submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 4px 14px rgba(91, 184, 158, 0.3);
  transition: all 0.2s ease;
  min-height: 44px;
}
.feedback-submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(91, 184, 158, 0.4);
}
.feedback-submit-btn.ghost {
  background: #fff;
  color: var(--color-brand-dark);
  border: 1.5px solid rgba(91, 184, 158, 0.4);
  box-shadow: none;
}
.feedback-case-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.feedback-case-item {
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  border-left: 4px solid var(--color-brand);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.feedback-case-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.feedback-case-id {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-brand-dark);
  font-family: var(--font-display);
}
.feedback-case-status {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}
.feedback-case-status.已解决 { background: rgba(91, 184, 158, 0.15); color: #3E9A80; }
.feedback-case-status.协调中 { background: rgba(246, 163, 92, 0.15); color: #E8853A; }
.feedback-case-status.施工中 { background: rgba(111, 177, 217, 0.15); color: #3E7CB1; }
.feedback-case-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  margin-bottom: 6px;
}
.feedback-case-meta span { display: inline-flex; align-items: center; gap: 3px; }
.feedback-case-desc {
  font-size: 0.82rem;
  color: var(--color-text-primary);
  line-height: 1.5;
  margin-bottom: 6px;
}
.feedback-case-progress {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(91, 184, 158, 0.06);
  border-radius: 8px;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* ============ 7大弹窗共享样式（任务6-12） ============ */
.ha-mask, .fs-mask, .ai-mask, .od-mask, .mb-mask, .rs-mask, .am-mask {
  position: fixed; inset: 0; background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; padding: var(--space-4); animation: fadeIn 0.25s;
}
.ha-dialog, .fs-dialog, .ai-dialog, .od-dialog, .mb-dialog, .rs-dialog, .am-dialog {
  background: var(--color-surface-solid);
  border-radius: 20px; max-width: 560px; width: 100%;
  max-height: 85vh; display: flex; flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.ha-head, .fs-head, .ai-head, .od-head, .mb-head, .rs-head, .am-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px; background: var(--color-surface-solid);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}
.ha-title, .fs-title, .ai-title, .od-title, .mb-title, .rs-title, .am-title {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-display); font-size: var(--text-lg);
  font-weight: var(--weight-semibold); color: var(--color-text-primary);
}
.ha-close, .fs-close, .ai-close, .od-close, .mb-close, .rs-close, .am-close {
  border: none; background: transparent; cursor: pointer;
  width: 32px; height: 32px; min-height: 32px !important;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-tertiary); transition: all 0.2s;
}
.ha-close:hover, .fs-close:hover, .ai-close:hover, .od-close:hover,
.mb-close:hover, .rs-close:hover, .am-close:hover {
  background: rgba(0, 0, 0, 0.06);
}
.ha-tabs, .fs-tabs, .ai-tabs, .od-tabs, .mb-tabs {
  display: flex; gap: 4px; padding: 10px 14px 0;
  background: var(--color-surface-solid);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto; flex-shrink: 0;
}
.ha-tab, .fs-tab, .ai-tab, .od-tab, .mb-tab {
  flex-shrink: 0; border: none; background: transparent;
  padding: 8px 14px; cursor: pointer; border-radius: 10px 10px 0 0;
  font-size: var(--text-sm); color: var(--color-text-secondary);
  border-bottom: 2px solid transparent; transition: all 0.2s;
  white-space: nowrap;
}
.ha-tab.active, .fs-tab.active, .ai-tab.active, .od-tab.active, .mb-tab.active {
  color: var(--color-brand); border-bottom-color: var(--color-brand);
  font-weight: var(--weight-semibold);
}
.ha-body, .fs-body, .ai-body, .od-body, .mb-body, .rs-body, .am-body {
  flex: 1; overflow-y: auto; padding: 16px 18px; min-height: 0;
}
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes fadeInUp { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }

/* === 任务6 健康档案 === */
.ha-profile-header { display: flex; align-items: center; gap: 12px; padding: 12px; background: linear-gradient(135deg, rgba(91,184,158,0.08), rgba(111,177,217,0.08)); border-radius: 12px; margin-bottom: 12px; }
.ha-profile-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--color-brand-lighter), var(--color-accent2-light)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ha-profile-name { font-family: var(--font-display); font-size: var(--text-base); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.ha-profile-id { font-size: var(--text-xs); color: var(--color-text-tertiary); margin-top: 2px; }
.ha-profile-score { margin-left: auto; text-align: center; }
.ha-score-num { font-size: 28px; font-weight: var(--weight-bold); color: var(--color-brand); line-height: 1; }
.ha-score-label { font-size: 10px; color: var(--color-text-tertiary); margin-top: 2px; }
.ha-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ha-info-item { padding: 10px; background: var(--color-bg-tertiary); border-radius: 10px; }
.ha-info-full { grid-column: span 2; }
.ha-info-label { display: block; font-size: 11px; color: var(--color-text-tertiary); margin-bottom: 4px; }
.ha-info-val { display: block; font-size: var(--text-sm); color: var(--color-text-primary); font-weight: var(--weight-medium); }
.ha-tag-safe { color: var(--state-success); }
.ha-tag-warn { color: var(--state-error); }
.ha-checkup-card { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 10px; }
.ha-checkup-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.ha-checkup-date { font-weight: var(--weight-semibold); color: var(--color-brand-dark); font-size: var(--text-sm); }
.ha-checkup-hosp { font-size: 11px; color: var(--color-text-tertiary); }
.ha-checkup-summary { font-size: var(--text-xs); color: var(--color-text-secondary); margin-bottom: 10px; padding: 6px 10px; background: rgba(91,184,158,0.08); border-radius: 8px; }
.ha-checkup-items { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.ha-checkup-item { padding: 8px; background: var(--color-surface-solid); border-radius: 8px; position: relative; }
.ha-cu-name { font-size: 11px; color: var(--color-text-tertiary); }
.ha-cu-value { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); margin: 2px 0; }
.ha-cu-unit { font-size: 10px; color: var(--color-text-tertiary); font-weight: normal; }
.ha-cu-normal { font-size: 10px; color: var(--color-text-tertiary); }
.ha-cu-status { position: absolute; top: 6px; right: 6px; font-size: 10px; padding: 1px 6px; border-radius: 8px; background: var(--color-bg-tertiary); }
.ha-cu-status.normal { color: var(--state-success); }
.ha-cu-status.warn { color: var(--state-error); background: rgba(253,101,133,0.12); }
.ha-record-card { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 10px; }
.ha-record-head { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; font-size: 11px; color: var(--color-text-tertiary); }
.ha-record-date { color: var(--color-brand-dark); font-weight: var(--weight-semibold); }
.ha-record-diag, .ha-record-prescription, .ha-record-note { display: flex; gap: 6px; align-items: flex-start; font-size: var(--text-xs); color: var(--color-text-secondary); margin-bottom: 4px; }
.ha-med-tip { display: flex; gap: 6px; align-items: center; padding: 10px; background: rgba(91,184,158,0.08); border-radius: 10px; margin-bottom: 10px; font-size: 11px; color: var(--color-brand-dark); }
.ha-med-card { display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 8px; }
.ha-med-icon { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ha-med-info { flex: 1; }
.ha-med-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.ha-med-purpose { font-size: 10px; color: var(--color-brand); padding: 1px 6px; background: rgba(91,184,158,0.12); border-radius: 8px; margin-left: 6px; }
.ha-med-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: 11px; color: var(--color-text-tertiary); margin-top: 4px; }
.ha-med-meta span { display: inline-flex; align-items: center; gap: 3px; }
.ha-med-side { text-align: right; }
.ha-med-dose { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.ha-med-status { font-size: 10px; color: var(--state-success); padding: 1px 6px; background: rgba(91,184,158,0.12); border-radius: 8px; }

/* === 任务7 家庭共享 === */
.fs-intro, .mb-intro, .ai-intro, .rs-intro { display: flex; gap: 6px; align-items: center; padding: 10px; background: rgba(91,184,158,0.08); border-radius: 10px; margin-bottom: 12px; font-size: 11px; color: var(--color-brand-dark); }
.fs-member { display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 8px; }
.fs-member-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fs-member-info { flex: 1; }
.fs-member-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.fs-member-relation { font-size: 10px; color: var(--color-text-tertiary); padding: 1px 6px; background: var(--color-bg-secondary); border-radius: 8px; margin-left: 6px; }
.fs-member-perms { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
.fs-perm-chip { font-size: 10px; color: var(--color-brand); padding: 1px 6px; background: rgba(91,184,158,0.1); border-radius: 8px; }
.fs-member-side { text-align: right; font-size: 11px; }
.fs-member-status { display: block; }
.fs-member-status.online { color: var(--state-success); }
.fs-member-status.offline { color: var(--color-text-tertiary); }
.fs-member-dist { color: var(--color-text-tertiary); }
.fs-perm-table { width: 100%; border-collapse: collapse; font-size: 11px; table-layout: fixed; }
.fs-perm-table th { padding: 8px 4px; text-align: center; color: var(--color-text-tertiary); font-weight: var(--weight-medium); border-bottom: 1px solid var(--color-border); vertical-align: middle; }
.fs-perm-table th:first-child { width: 28%; text-align: left; }
.fs-perm-table th:not(:first-child) { width: 18%; }
.fs-perm-th { text-align: center; line-height: 1.4; }
.fs-perm-th :deep(svg), .fs-perm-th svg { display: block; margin: 0 auto 2px; }
.fs-perm-member { text-align: left; padding: 8px; }
.fs-perm-avatar { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.fs-perm-member small { color: var(--color-text-tertiary); }
.fs-perm-cell { text-align: center; padding: 8px; }
.fs-perm-switch { display: inline-block; width: 36px; height: 20px; position: relative; cursor: pointer; }
.fs-perm-switch input { opacity: 0; width: 0; height: 0; }
.fs-perm-slider { position: absolute; inset: 0; background: #ccc; border-radius: 20px; transition: 0.3s; }
.fs-perm-slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 2px; top: 2px; background: #fff; border-radius: 50%; transition: 0.3s; }
.fs-perm-switch input:checked + .fs-perm-slider { background: var(--color-brand); }
.fs-perm-switch input:checked + .fs-perm-slider::before { transform: translateX(16px); }
.fs-invite-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
.fs-invite-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(91,184,158,0.15); }
.fs-invite-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(91,184,158,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fs-invite-info { flex: 1; }
.fs-invite-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.fs-invite-desc { font-size: 11px; color: var(--color-text-tertiary); margin-top: 2px; }

/* === 任务8 AI采访 === */
.ai-topic-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.ai-topic-card { display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--color-bg-tertiary); border-radius: 12px; border: none; cursor: pointer; text-align: left; transition: all 0.2s; width: 100%; }
.ai-topic-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(91,184,158,0.15); }
.ai-topic-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-topic-info { flex: 1; }
.ai-topic-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.ai-topic-desc { font-size: 11px; color: var(--color-text-tertiary); margin-top: 2px; }
.ai-topic-progress { font-size: 10px; color: var(--color-brand); margin-top: 2px; }
.ai-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.ai-action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 20px; border: 1px solid var(--color-border); background: var(--color-surface-solid); cursor: pointer; font-size: 12px; color: var(--color-text-primary); transition: all 0.2s; }
.ai-action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.ai-action-btn.primary { background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark)); color: #fff; border-color: transparent; }
.ai-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.ai-feature-card { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; text-align: center; }
.ai-feature-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(91,184,158,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; }
.ai-feature-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.ai-feature-desc { font-size: 11px; color: var(--color-text-tertiary); margin-top: 4px; line-height: 1.5; }
.ai-collab { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; }
.ai-collab-title { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); margin-bottom: 8px; }
.ai-collab-list { margin-bottom: 10px; }
.ai-collab-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--color-border); font-size: 11px; }
.ai-collab-item:last-child { border-bottom: none; }
.ai-collab-name { color: var(--color-text-primary); font-weight: var(--weight-medium); }
.ai-collab-name small { color: var(--color-text-tertiary); margin-left: 4px; }
.ai-collab-num { color: var(--color-brand); }
.ai-collab-time { color: var(--color-text-tertiary); }
.ai-chapter { display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 8px; }
.ai-chapter-no { font-size: 11px; color: var(--color-brand); font-weight: var(--weight-semibold); padding: 2px 8px; background: rgba(91,184,158,0.1); border-radius: 8px; flex-shrink: 0; }
.ai-chapter-info { flex: 1; }
.ai-chapter-title { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.ai-chapter-meta { display: flex; gap: 8px; font-size: 11px; color: var(--color-text-tertiary); margin-top: 2px; }
.ai-chapter-meta span { display: inline-flex; align-items: center; gap: 3px; }
.ai-chapter-status { font-size: 10px; padding: 2px 8px; border-radius: 8px; }
.ai-chapter-status.done { color: var(--state-success); background: rgba(91,184,158,0.12); }
.ai-chapter-status.doing { color: #F6A35C; background: rgba(246,163,92,0.12); }
.ai-chapter-status.todo { color: var(--color-text-tertiary); background: var(--color-bg-secondary); }
.ai-action-btn { width: 100%; justify-content: center; margin-top: 8px; }

/* === 任务9 我的订单 === */
.od-card { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 10px; position: relative; }
.od-card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.od-card-id { font-size: 11px; color: var(--color-text-tertiary); }
.od-card-type { font-size: 10px; color: var(--color-brand); padding: 1px 6px; background: rgba(91,184,158,0.1); border-radius: 8px; }
.od-card-status { margin-left: auto; font-size: 11px; padding: 2px 8px; border-radius: 8px; }
.od-card-status.done { color: var(--state-success); background: rgba(91,184,158,0.12); }
.od-card-status.doing { color: #F6A35C; background: rgba(246,163,92,0.12); }
.od-card-info { margin-bottom: 8px; }
.od-card-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.od-card-spec { font-size: 11px; color: var(--color-text-tertiary); margin-top: 2px; }
.od-card-meta { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: var(--color-text-tertiary); margin-top: 4px; margin-right: 10px; }
.od-card-amount { position: absolute; top: 12px; right: 14px; font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--state-error); }
.od-card-actions { display: flex; gap: 6px; padding-top: 8px; border-top: 1px solid var(--color-border); }
.od-action { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 16px; border: 1px solid var(--color-border); background: var(--color-surface-solid); cursor: pointer; font-size: 11px; color: var(--color-text-secondary); transition: all 0.2s; }
.od-action:hover { transform: translateY(-1px); }
.od-action.primary { background: var(--color-brand); color: #fff; border-color: transparent; }

/* === 任务10 会员权益 === */
.mb-current { padding: 14px; background: linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04)); border-radius: 12px; margin-bottom: 14px; }
.mb-current-level { font-size: var(--text-base); color: var(--color-text-primary); margin-bottom: 8px; }
.mb-progress-bar { height: 8px; background: var(--color-bg-secondary); border-radius: 8px; overflow: hidden; margin-bottom: 4px; }
.mb-progress-fill { height: 100%; background: linear-gradient(90deg, #FFD700, #FFA500); border-radius: 8px; transition: width 0.5s; }
.mb-progress-text { font-size: 11px; color: var(--color-text-tertiary); }
.mb-level-list { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mb-level-card { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; position: relative; }
.mb-level-card.current { border: 2px solid #FFD700; }
.mb-level-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.mb-level-name { font-family: var(--font-display); font-size: var(--text-base); font-weight: var(--weight-bold); }
.mb-level-tag { font-size: 10px; color: #fff; background: #FFD700; padding: 1px 6px; border-radius: 8px; }
.mb-level-threshold { font-size: 11px; color: var(--color-text-tertiary); margin-bottom: 6px; }
.mb-level-benefits { font-size: 11px; color: var(--color-text-secondary); }
.mb-level-benefit { display: flex; align-items: center; gap: 4px; margin: 2px 0; }
.mb-plan-grid { display: flex; flex-direction: column; gap: 10px; }
.mb-plan-card { padding: 16px; background: var(--color-bg-tertiary); border-radius: 14px; position: relative; border: 2px solid transparent; }
.mb-plan-card.popular { border-color: var(--color-brand); }
.mb-plan-badge { position: absolute; top: -8px; right: 12px; font-size: 10px; color: #fff; background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark)); padding: 2px 10px; border-radius: 10px; }
.mb-plan-name { font-family: var(--font-display); font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--color-text-primary); }
.mb-plan-price { font-size: 24px; font-weight: var(--weight-bold); color: var(--color-brand); margin: 6px 0; }
.mb-plan-price small { font-size: 11px; color: var(--color-text-tertiary); font-weight: normal; }
.mb-plan-features { margin-bottom: 10px; }
.mb-plan-feature { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--color-text-secondary); margin: 3px 0; }
.mb-plan-btn { width: 100%; padding: 8px; border-radius: 10px; border: 1px solid var(--color-brand); background: var(--color-surface-solid); color: var(--color-brand); cursor: pointer; font-size: var(--text-sm); }
.mb-plan-btn.primary { background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark)); color: #fff; }
.mb-points-summary { padding: 16px; background: linear-gradient(135deg, rgba(91,184,158,0.12), rgba(91,184,158,0.04)); border-radius: 12px; text-align: center; margin-bottom: 14px; }
.mb-points-num { font-size: 32px; font-weight: var(--weight-bold); color: var(--color-brand); }
.mb-points-label { font-size: 11px; color: var(--color-text-tertiary); margin-top: 4px; }
.mb-points-section-title { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); margin: 14px 0 8px; }
.mb-points-shop { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mb-points-item { padding: 10px; background: var(--color-bg-tertiary); border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.mb-points-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(91,184,158,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
.mb-points-info { flex: 1; }
.mb-points-name { font-size: 11px; font-weight: var(--weight-medium); color: var(--color-text-primary); }
.mb-points-original { font-size: 10px; color: var(--color-text-tertiary); margin-top: 2px; }
.mb-points-side { margin-top: 6px; }
.mb-points-cost { font-size: 11px; color: var(--color-brand); font-weight: var(--weight-semibold); }
.mb-points-btn { margin-top: 4px; padding: 4px 12px; border-radius: 12px; border: none; background: var(--color-brand); color: #fff; cursor: pointer; font-size: 11px; }
.mb-points-history { padding: 8px 10px; background: var(--color-bg-tertiary); border-radius: 10px; }
.mb-points-row { display: flex; gap: 8px; padding: 4px 0; font-size: 11px; border-bottom: 1px solid var(--color-border); }
.mb-points-row:last-child { border-bottom: none; }
.mb-points-date { color: var(--color-text-tertiary); width: 70px; flex-shrink: 0; }
.mb-points-desc { flex: 1; color: var(--color-text-primary); }
.mb-points-change { color: var(--state-success); font-weight: var(--weight-semibold); }

/* === 任务11 提醒设置 === */
.rs-item { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 8px; }
.rs-item-head { display: flex; align-items: center; gap: 10px; }
.rs-item-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(91,184,158,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rs-item-info { flex: 1; }
.rs-item-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.rs-item-freq { font-size: 11px; color: var(--color-text-tertiary); margin-top: 2px; }
.rs-switch { display: inline-block; width: 40px; height: 22px; position: relative; cursor: pointer; flex-shrink: 0; }
.rs-switch input { opacity: 0; width: 0; height: 0; }
.rs-slider { position: absolute; inset: 0; background: #ccc; border-radius: 22px; transition: 0.3s; }
.rs-slider::before { content: ''; position: absolute; width: 18px; height: 18px; left: 2px; top: 2px; background: #fff; border-radius: 50%; transition: 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.rs-switch input:checked + .rs-slider { background: var(--color-brand); }
.rs-switch input:checked + .rs-slider::before { transform: translateX(18px); }
.rs-item-methods { display: flex; align-items: center; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--color-border); flex-wrap: wrap; }
.rs-method-label { font-size: 11px; color: var(--color-text-tertiary); }
.rs-method { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 14px; border: 1px solid var(--color-border); background: var(--color-surface-solid); cursor: pointer; font-size: 11px; color: var(--color-text-secondary); }
.rs-method.active { background: var(--color-brand); color: #fff; border-color: transparent; }
.rs-dnd { display: flex; align-items: center; gap: 10px; padding: 12px; background: linear-gradient(135deg, rgba(111,177,217,0.08), rgba(111,177,217,0.04)); border-radius: 12px; margin: 10px 0; }
.rs-dnd-head { display: flex; align-items: center; gap: 10px; flex: 1; }
.rs-dnd-info { flex: 1; }
.rs-dnd-name { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.rs-dnd-time { font-size: 11px; color: var(--color-text-tertiary); }
.rs-save, .am-save { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; border-radius: 12px; border: none; background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark)); color: #fff; cursor: pointer; font-size: var(--text-base); font-weight: var(--weight-semibold); margin-top: 10px; }
.rs-save:hover, .am-save:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(91,184,158,0.3); }

/* === 任务12 AI管家设置 === */
.am-section { padding: 12px; background: var(--color-bg-tertiary); border-radius: 12px; margin-bottom: 10px; }
.am-section-title { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); margin-bottom: 10px; }
.am-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.am-row-label { font-size: var(--text-sm); color: var(--color-text-secondary); min-width: 70px; }
.am-row-value { font-size: var(--text-sm); color: var(--color-brand); font-weight: var(--weight-semibold); }
.am-seg { display: inline-flex; background: var(--color-bg-secondary); border-radius: 10px; padding: 2px; }
.am-seg-wrap { flex-wrap: wrap; }
.am-seg-btn { padding: 6px 12px; border: none; background: transparent; border-radius: 8px; cursor: pointer; font-size: 11px; color: var(--color-text-secondary); transition: all 0.2s; white-space: nowrap; }
.am-seg-btn.active { background: var(--color-brand); color: #fff; }
.am-voice-list { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; flex: 1; }
.am-voice-btn { padding: 8px 10px; border: 1px solid var(--color-border); background: var(--color-surface-solid); border-radius: 10px; cursor: pointer; text-align: left; transition: all 0.2s; }
.am-voice-btn.active { border-color: var(--color-brand); background: rgba(91,184,158,0.08); }
.am-voice-name { display: block; font-size: 11px; font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.am-voice-desc { display: block; font-size: 10px; color: var(--color-text-tertiary); margin-top: 2px; }
.am-slider { flex: 1; accent-color: var(--color-brand); }
.am-preview { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 16px; border: 1px solid var(--color-brand); background: var(--color-surface-solid); color: var(--color-brand); cursor: pointer; font-size: 11px; }
.am-freq-list { display: flex; flex-direction: column; gap: 6px; }
.am-freq-btn { padding: 10px; border: 1px solid var(--color-border); background: var(--color-surface-solid); border-radius: 10px; cursor: pointer; text-align: left; transition: all 0.2s; }
.am-freq-btn.active { border-color: var(--color-brand); background: rgba(91,184,158,0.08); }
.am-freq-name { display: block; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.am-freq-desc { display: block; font-size: 11px; color: var(--color-text-tertiary); margin-top: 2px; }
.am-care { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--color-border); }
.am-care:last-child { border-bottom: none; }
.am-care-info { flex: 1; }
.am-care-name { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
.am-care-desc { font-size: 11px; color: var(--color-text-tertiary); margin-top: 2px; }
.am-input { flex: 1; padding: 6px 10px; border: 1px solid var(--color-border); border-radius: 8px; font-size: var(--text-sm); background: var(--color-surface-solid); }
</style>
