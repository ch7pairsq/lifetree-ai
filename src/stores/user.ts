import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userProfile } from '@/mock'

// 界面模式定义
export interface UIModeConfig {
  key: string
  label: string
  desc: string
  icon: string
  // 布局骨架类型：决定导航/字号/间距
  layout: 'standard' | 'elderly' | 'voice' | 'tool' | 'minimal' | 'caregiver'
  // 字号缩放
  fontScale: number
  // 触控目标最小尺寸
  touchTarget: number
  // 导航栏样式
  navStyle: 'bottom-tabs' | 'voice-bar' | 'side-tools' | 'minimal-nav' | 'caregiver-tabs'
  // 是否显示毛玻璃效果（低性能/高对比度时关闭）
  glassEffect: boolean
  // 是否高对比度
  highContrast: boolean
  // 信息密度：high/normal/low/ultra-low
  density: 'high' | 'normal' | 'low' | 'ultra-low'
  // 推荐标记
  recommend?: boolean
}

export const UI_MODES: UIModeConfig[] = [
  {
    key: 'standard',
    label: '活力老人',
    desc: '标准界面，完整功能',
    icon: 'accessibility',
    layout: 'standard',
    fontScale: 1,
    touchTarget: 48,
    navStyle: 'bottom-tabs',
    glassEffect: true,
    highContrast: false,
    density: 'normal',
  },
  {
    key: 'elderly',
    label: '高龄长辈',
    desc: '大字大按钮，高对比',
    icon: 'search',
    layout: 'elderly',
    fontScale: 1.3,
    touchTarget: 64,
    navStyle: 'bottom-tabs',
    glassEffect: false,
    highContrast: true,
    density: 'low',
    recommend: true,
  },
  {
    key: 'voice',
    label: '视障语音',
    desc: '语音优先，极简按钮',
    icon: 'mic',
    layout: 'voice',
    fontScale: 1.2,
    touchTarget: 72,
    navStyle: 'voice-bar',
    glassEffect: false,
    highContrast: true,
    density: 'ultra-low',
  },
  {
    key: 'tool',
    label: '卧床模式',
    desc: '工具栏快捷操作',
    icon: 'bed',
    layout: 'tool',
    fontScale: 1.1,
    touchTarget: 56,
    navStyle: 'side-tools',
    glassEffect: true,
    highContrast: false,
    density: 'normal',
  },
  {
    key: 'minimal',
    label: '护理模式',
    desc: '护理工作台，任务管理',
    icon: 'clipboard-list',
    layout: 'minimal',
    fontScale: 1,
    touchTarget: 44,
    navStyle: 'caregiver-tabs',
    glassEffect: true,
    highContrast: false,
    density: 'high',
  },
  {
    key: 'caregiver',
    label: '子女照看',
    desc: '数据监控，远程管理',
    icon: 'users',
    layout: 'caregiver',
    fontScale: 0.95,
    touchTarget: 44,
    navStyle: 'caregiver-tabs',
    glassEffect: true,
    highContrast: false,
    density: 'high',
  },
]

// 用户状态：资料、心情、用药提醒开关、界面模式
export const useUserStore = defineStore('user', () => {
  const profile = ref({ ...userProfile })
  const selectedMood = ref<string | null>(null)
  const medReminderOn = ref(true)

  // 当前模式 key（从 localStorage 恢复）
  const savedMode = typeof localStorage !== 'undefined' ? localStorage.getItem('zz_active_mode') : null
  const activeModeKey = ref(savedMode || 'standard')

  // 当前模式配置（computed）
  const activeMode = computed<UIModeConfig>(
    () => UI_MODES.find((m) => m.key === activeModeKey.value) || UI_MODES[0]
  )

  // 是否标准模式
  const isStandard = computed(() => activeModeKey.value === 'standard')
  const isElderly = computed(() => activeModeKey.value === 'elderly')
  const isVoice = computed(() => activeModeKey.value === 'voice')
  const isTool = computed(() => activeModeKey.value === 'tool')
  const isMinimal = computed(() => activeModeKey.value === 'minimal')
  const isCaregiver = computed(() => activeModeKey.value === 'caregiver')

  function selectMood(label: string) {
    selectedMood.value = label
  }

  function toggleMedReminder(value: boolean) {
    medReminderOn.value = value
  }

  function setMode(key: string) {
    activeModeKey.value = key
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('zz_active_mode', key)
    }
  }

  return {
    profile,
    selectedMood,
    medReminderOn,
    activeModeKey,
    activeMode,
    isStandard,
    isElderly,
    isVoice,
    isTool,
    isMinimal,
    isCaregiver,
    selectMood,
    toggleMedReminder,
    setMode,
  }
})
