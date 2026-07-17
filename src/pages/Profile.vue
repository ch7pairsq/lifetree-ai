<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { menuGroups, sharedMembers, smartDevices } from '@/mock'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 菜单点击提示（标准/高龄/视障/卧床模式）
function onMenu(text: string) {
  if (text === '健康档案管理') {
    openInfoDialog('健康档案管理', '王秀兰 · 68岁 · 女\n\n健康评分：86分\n风险等级：低风险\n血型：A型\n过敏史：青霉素\n慢性病：高血压、轻度骨质疏松\n最近体检：2026年6月15日')
  } else if (text === '我的用药清单') {
    openInfoDialog('我的用药清单', '当前长期用药：\n· 降压药 每日1次 早饭后\n· 降糖药 每日3次 饭前30分钟\n· 钙片 每日2片 晚饭后\n\n下周需复诊开药：降压药（剩余8天用量）')
  } else if (text === '健康报告') {
    openInfoDialog('健康报告', '本周健康报告（7月8日-7月14日）：\n\n· 心率：均值72bpm，正常\n· 血压：均值128/82，略偏高\n· 睡眠：日均7.2小时，质量良好\n· 步数：日均3280步\n· 用药依从性：100%\n\n趋势：整体平稳，建议继续低盐饮食。')
  } else if (text === 'AI 采访') {
    openInfoDialog('AI 采访', '小康定期采访您的 life story：\n\n· 上次采访：7月10日「退休后的旅行记忆」\n· 下次采访：7月20日「与老伴的故事」\n\n小康会用聊天的方式，慢慢引导您回忆往事，自动整理成人生故事集。')
  } else if (text === '记忆年轮') {
    openInfoDialog('记忆年轮', '您的人生记忆年轮：\n\n· 1960年代 童年：12条记忆\n· 1970年代 青年：8条记忆\n· 1980年代 成家：15条记忆\n· 2000年代 事业：10条记忆\n· 2010年代 退休：6条记忆\n\n点击各年代可重温对应回忆。')
  } else if (text === 'AI 管家设置') {
    openInfoDialog('AI 管家设置', '小康AI管家个性化设置：\n\n· 语音播报语速：中速\n· 称呼方式：王奶奶\n· 主动提醒：已开启\n· 健康守护：已开启\n· 夜间免打扰：22:00-07:00\n\n小康会按您的习惯贴心服务。')
  } else if (text === '我的订单') {
    openInfoDialog('我的订单', '近期订单：\n\n· 钙片+维生素D组合 ¥128 已签收\n· 防滑浴室地垫 ¥39 配送中\n· 上门家政（深度保洁）¥169 已完成\n\n近3个月共12笔订单。')
  } else if (text === '服务预约记录') {
    openInfoDialog('服务预约记录', '近期预约：\n\n· 7月18日 京剧名段赏析会 已报名\n· 7月19日 公园花卉摄影采风 待定\n· 7月25日 安心陪诊（协和医院）已预约\n\n点击对应预约可查看详情或取消。')
  } else if (text === '会员权益') {
    openInfoDialog('会员权益', '当前等级：黄金会员\n\n专属权益：\n· 生活服务9折\n· 陪诊服务优先预约\n· 每月1次免费上门体检\n· 24小时健康咨询\n\n成长值：2680 / 3000（距白金还差320）')
  } else if (text === '界面模式切换') {
    openInfoDialog('界面模式切换', '请在首页右上角点击模式切换按钮，选择适合您的界面模式：\n· 活力老人（标准）\n· 高龄长辈（大字大按钮）\n· 视障语音（语音优先）\n· 卧床模式（工具栏快捷）\n\n切换后自动记忆您的选择。')
  } else if (text === '提醒设置') {
    openInfoDialog('提醒设置', '提醒方式设置：\n\n· 用药提醒：已开启（语音+震动）\n· 喝水提醒：已开启（每2小时）\n· 测血压提醒：已开启（每周一三五）\n· 运动提醒：已开启（每日9:00）\n· 夜间免打扰：22:00-07:00')
  } else if (text === '隐私与安全') {
    openInfoDialog('隐私与安全', '隐私安全设置：\n\n· 健康数据共享：仅家庭成员\n· 位置共享：仅女儿小芳\n· 数据加密：已开启\n· 远程查看授权：2人（女儿、家庭医生）\n\n您的数据安全由我们严格守护。')
  } else if (text === '系统设置') {
    openInfoDialog('系统设置', '系统设置：\n\n· 字体大小：标准\n· 屏幕亮度：自动\n· 通知铃声：温和提示音\n· 缓存清理：建议清理（占用23MB）\n· 版本：v2.6.1\n· 检查更新：已是最新')
  }
}

// 家庭共享设置
const showSharePanel = ref(false)
const memberList = ref(smartDevices.length ? sharedMembers.map((m) => ({ ...m })) : [])
function openSharePanel() {
  showSharePanel.value = true
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
</style>
