import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { initialChatMessages, aiReplies, nurseInitialChatMessages, nurseAiReplies, daughterInitialChatMessages, daughterAiReplies } from '@/mock'
import { useUserStore } from '@/stores/user'

export interface ChatMessage {
  id: number
  role: 'ai' | 'user'
  text: string
}

// 关键词匹配回复规则
const keywordRules: { keywords: string[], replies: string[] }[] = [
  {
    keywords: ['吃药', '用药', '服药', '药'],
    replies: [
      '王奶奶今日降压药已按时服用（7:30），钙片待确认。本周用药依从性95%，建议继续保持。',
      '根据记录，王奶奶降压药每日7:30按时服用，情况良好。只有周二漏服一次维生素D，已补服。',
    ],
  },
  {
    keywords: ['血压', '心率', '心跳'],
    replies: [
      '王奶奶近3天血压平稳，今晨128/82mmHg，心率72bpm，均在正常范围内。',
      '血压最近一周整体平稳，偶有轻微波动但无需担心。建议继续保持低盐饮食。',
    ],
  },
  {
    keywords: ['睡眠', '睡不着', '失眠'],
    replies: [
      '王奶奶昨晚睡眠7.5小时，质量良好。中途醒来1次，5分钟后继续入睡。',
      '近期睡眠质量有所改善，日均7小时以上。建议睡前泡脚有助于安眠。',
    ],
  },
  {
    keywords: ['散步', '运动', '走路', '遛弯', '锻炼'],
    replies: [
      '王奶奶今日已散步3280步，在小区花园活动了约20分钟，运动量达标！',
      '今天步数目标完成65%，建议下午再散步30分钟就完美了。',
    ],
  },
  {
    keywords: ['心情', '情绪', '开心', '心情'],
    replies: [
      '王奶奶本周心情愉快！情绪评分8.5/10，参加了社区广场舞和京剧票友聚会。',
      '妈妈今天心情很好，和邻居聊了会天，还分享了她新学的养生药膳。',
    ],
  },
  {
    keywords: ['中医', '课程', '学习', '上课'],
    replies: [
      '王奶奶学习了中医基础理论的"阴阳五行"章节，学时45分钟，还做了笔记！学习积极性很高。',
      '妈妈最近对中医课程很感兴趣，已经完成2个章节学习，还和我聊了三伏天艾灸的注意事项。',
    ],
  },
  {
    keywords: ['吃饭', '饮食', '午餐', '晚餐', '早餐'],
    replies: [
      '王奶奶今日早餐营养评分A，午餐摄入了优质蛋白和蔬菜，饮食结构合理。',
      '近期饮食规律，营养均衡。建议多补充富含钙质的食物，如牛奶、豆制品。',
    ],
  },
  {
    keywords: ['天气', '出去', '出门'],
    replies: [
      '今天天气晴朗，气温26°C，空气良好，很适合出去走走呢！',
      '今天阳光不错，记得带妈妈出去晒晒太阳，有助于维生素D吸收哦。',
    ],
  },
]

function matchKeyword(text: string, mode: string): string | null {
  const lowerText = text.toLowerCase()
  for (const rule of keywordRules) {
    if (rule.keywords.some(kw => lowerText.includes(kw))) {
      // 子女照看模式使用更详细的回复
      if (mode === 'caregiver') {
        return rule.replies[0]
      }
      return rule.replies[Math.floor(Math.random() * rule.replies.length)]
    }
  }
  return null
}

// 陪伴页聊天状态
export const useChatStore = defineStore('chat', () => {
  const userStore = useUserStore()
  const STORAGE_KEY = 'zz_chat_messages'

  function getModeKey(): string {
    return userStore.activeModeKey
  }

  function getInitialMessages(): ChatMessage[] {
    if (userStore.isMinimal) {
      return nurseInitialChatMessages.map((m) => ({ id: m.id, role: m.role, text: m.text }))
    }
    if (userStore.isCaregiver) {
      return daughterInitialChatMessages.map((m) => ({ id: m.id, role: m.role, text: m.text }))
    }
    return initialChatMessages.map((m) => ({ id: m.id, role: m.role, text: m.text }))
  }

  function getReplies(): string[] {
    if (userStore.isMinimal) return nurseAiReplies
    if (userStore.isCaregiver) return daughterAiReplies
    return aiReplies
  }

  // 从 localStorage 恢复
  function loadFromStorage(): ChatMessage[] | null {
    if (typeof localStorage === 'undefined') return null
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return null
      const data = JSON.parse(saved)
      if (data && data.mode === getModeKey() && Array.isArray(data.messages) && data.messages.length > 0) {
        return data.messages
      }
    } catch { /* 忽略解析错误 */ }
    return null
  }

  function saveToStorage(msgs: ChatMessage[]) {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: getModeKey(), messages: msgs }))
    } catch { /* 忽略存储错误 */ }
  }

  function initMessages(): ChatMessage[] {
    const stored = loadFromStorage()
    if (stored) return stored
    return getInitialMessages()
  }

  const messages = ref<ChatMessage[]>(initMessages())
  const isReplying = ref(false)
  let nextId = messages.value.length + 1

  // 监听消息变化，自动保存
  watch(messages, (msgs) => {
    saveToStorage(msgs)
  }, { deep: true })

  // 切换模式时重置消息
  function resetMessages() {
    const stored = loadFromStorage()
    if (stored) {
      messages.value = stored
    } else {
      messages.value = getInitialMessages()
    }
    nextId = messages.value.length + 1
    isReplying.value = false
  }

  function sendUserMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    messages.value.push({ id: nextId++, role: 'user', text: trimmed })
    triggerAiReply(trimmed)
  }

  // 直接发送 AI 消息（不触发自动回复）
  function sendAiMessage(text: string) {
    messages.value.push({ id: nextId++, role: 'ai', text })
  }

  function triggerAiReply(userText?: string) {
    isReplying.value = true

    // 先尝试关键词匹配
    let reply: string | null = null
    if (userText) {
      reply = matchKeyword(userText, getModeKey())
    }

    // 没匹配到则随机选取
    if (!reply) {
      const replies = getReplies()
      reply = replies[Math.floor(Math.random() * replies.length)]
    }

    setTimeout(() => {
      messages.value.push({ id: nextId++, role: 'ai', text: reply! })
      isReplying.value = false
    }, 900)
  }

  return { messages, isReplying, sendUserMessage, sendAiMessage, resetMessages }
})
