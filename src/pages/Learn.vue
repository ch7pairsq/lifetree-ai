<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import {
  elderlyClasses,
  liveClasses,
  learningProgress,
  activities,
  communityCircles,
  healthKnowledge,
  elderlyCourses,
  photoRepair,
  companionSuggestions,
  puzzleGames,
} from '@/mock'

const route = useRoute()
const communitySection = ref<HTMLElement | null>(null)
const classroomSection = ref<HTMLElement | null>(null)

// 课程渐变背景映射
const gradMap: Record<string, string> = {
  teal: 'linear-gradient(135deg, var(--color-brand-lighter), var(--color-brand))',
  blue: 'linear-gradient(135deg, var(--color-accent2-light), var(--color-accent2-dark))',
  gold: 'linear-gradient(135deg, var(--color-accent3-light), var(--color-accent3-dark))',
  green: 'linear-gradient(135deg, #c8f0e0, #5BB89E)',
  red: 'linear-gradient(135deg, #FFD3D3, #D46B6B)',
}

// 直播与回放展示控制
const showAllLive = ref(false)
const displayLive = computed(() => (showAllLive.value ? liveClasses : liveClasses.slice(0, 2)))

// 老年课堂：新增课程默认隐藏，点击更多时显示
const showMoreCourses = ref(false)

// 学习开始提示
const startToast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function startCourse(name: string) {
  startToast.value = `开始学习：${name}`
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    startToast.value = ''
  }, 2000)
}

// 线下活动报名
const activityList = ref(activities.map((a) => ({ ...a })))
function joinActivity(idx: number) {
  const a = activityList.value[idx]
  if (a.joined) {
    a.joined = false
    a.members -= 1
    startToast.value = `已取消报名：${a.title}`
  } else {
    a.joined = true
    a.members += 1
    startToast.value = `报名成功：${a.title}`
  }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    startToast.value = ''
  }, 2000)
}

// 社区圈子加入
function joinCircle(title: string) {
  startToast.value = `已加入「${title}」！可在圈子内查看活动安排和成员动态。`
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    startToast.value = ''
  }, 2000)
}

// 通用 toast 提示
function showToast(msg: string) {
  startToast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    startToast.value = ''
  }, 2000)
}

// 老年课堂扩展：防诈骗教程
const elderlyClassesExtended = [...elderlyClasses]

// ===== 任务7：老年课堂扩展课程（8类）=====
const showCourseDialog = ref(false)
const activeCourse = ref<typeof elderlyCourses[number] | null>(null)
function openCourseDetail(course: typeof elderlyCourses[number]) {
  activeCourse.value = course
  showCourseDialog.value = true
}

// 默认课程打开详情弹窗
function openElderlyCourseDetail(ec: typeof elderlyClasses[number]) {
  activeCourse.value = {
    id: 0,
    icon: ec.icon,
    name: ec.name,
    desc: ec.desc,
    lessons: ec.lessons,
    level: ec.level,
    color: ec.color,
    items: ec.items,
  }
  showCourseDialog.value = true
}

// ===== 任务8：老照片智能修复 =====
const showPhotoRepair = ref(false)
const activeBookType = ref<string>('')
function openPhotoRepair() {
  showPhotoRepair.value = true
}
function selectBookType(id: string) {
  activeBookType.value = id
  showToast(`已选择：${photoRepair.bookTypes.find(b => b.id === id)?.name}`)
}
function startRepair() {
  showToast('小康正在为您修复老照片...\n\n您可在"我的-老照片相册"查看修复进度。')
}

// ===== 任务4：夕阳事迹 / 健康知识科普 切换 =====
const sunsetTab = ref<'stories' | 'knowledge'>('stories')

// ===== 任务6：智能陪伴推荐 =====
function handleSuggestion(s: typeof companionSuggestions[number]) {
  showToast(`小康已为您安排：${s.title}\n\n${s.desc}`)
}

// 老年故事
const elderlyStories = [
  { tag: '温暖故事', icon: 'camera', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)', title: '吴承言画天安门给村里老人照相', desc: '90后画家用画笔记录乡村老人的幸福笑容，为100位老人画像...' },
  { tag: '励志新闻', icon: 'trophy', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)', title: '82岁奶奶考取驾照圆梦', desc: '坚持学习三个月，成为当地最年长的驾照获得者...' },
  { tag: '科技助老', icon: 'cpu', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)', title: 'AI陪伴机器人走进养老院', desc: '智能机器人"小康"为独居老人提供24小时陪伴服务...' },
  { tag: '社会关爱', icon: 'heart-handshake', bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)', title: '社区志愿者为老人送餐上门', desc: '每天中午准时送达，还有专人陪聊解闷...' },
]

// 最新条例解读
const policies = [
  { date: '07/15', title: '北京市养老服务条例（2026修订）', desc: '新增居家适老化改造补贴条款，每户最高补贴2万元...', tags: ['补贴', '适老化'] },
  { date: '07/14', title: '长期护理保险制度试点扩大', desc: '新增15个试点城市，覆盖城镇职工和城乡居民...', tags: ['长护险', '试点'] },
  { date: '07/13', title: '社区老年助餐服务规范发布', desc: '明确助餐点建设标准、食品安全要求及补贴机制...', tags: ['助餐', '规范'] },
]

// 赛博养老
const cyberElders = [
  { tag: '养老搭子', icon: 'users', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)', title: '找到你的养老搭子', desc: '兴趣相投的老年伙伴一起生活、旅行、学习', members: 1280 },
  { tag: '不服老', icon: 'flame', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)', title: '不服老挑战赛', desc: '65岁学编程、70岁做博主、75岁跑马拉松', members: 856 },
  { tag: '旅居养老', icon: 'plane', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)', title: '候鸟式旅居养老', desc: '冬去海南夏去东北，换个城市换种生活', members: 2340 },
]

// 路由参数滚动定位
onMounted(() => {
  const section = route.query.section
  if (!section) return
  nextTick(() => {
    let target: HTMLElement | null = null
    if (section === 'community') target = communitySection.value
    else if (section === 'classroom') target = classroomSection.value
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  })
})

// ===== 益智游戏模块 =====
const showGameDialog = ref(false)
const activeGame = ref<typeof puzzleGames[number] | null>(null)
const gameScore = ref(0)
const gameTimeLeft = ref(0)
const gameRunning = ref(false)
const gameMoles = ref<boolean[]>(Array(9).fill(false))
const gameHistory = ref<{ score: number; time: string } | null>(null)
let gameTimer: ReturnType<typeof setInterval> | null = null
let moleTimer: ReturnType<typeof setTimeout> | null = null

function openGame(game: typeof puzzleGames[number]) {
  activeGame.value = game
  showGameDialog.value = true
  gameScore.value = 0
  gameTimeLeft.value = 30
  gameRunning.value = false
  gameMoles.value = Array(9).fill(false)
  gameHistory.value = null
}

function startGame() {
  if (!activeGame.value) return
  gameScore.value = 0
  gameTimeLeft.value = 30
  gameRunning.value = true
  gameMoles.value = Array(9).fill(false)
  gameTimer = setInterval(() => {
    gameTimeLeft.value -= 1
    if (gameTimeLeft.value <= 0) {
      endGame()
    }
  }, 1000)
  showMole()
}

function showMole() {
  if (!gameRunning.value) return
  const idx = Math.floor(Math.random() * 9)
  gameMoles.value = Array(9).fill(false)
  gameMoles.value[idx] = true
  moleTimer = setTimeout(() => {
    gameMoles.value = Array(9).fill(false)
    moleTimer = setTimeout(showMole, 200 + Math.random() * 400)
  }, 600 + Math.random() * 400)
}

function hitMole(idx: number) {
  if (!gameRunning.value) return
  if (gameMoles.value[idx]) {
    gameScore.value += 1
    gameMoles.value[idx] = false
  }
}

function endGame() {
  gameRunning.value = false
  if (gameTimer) { clearInterval(gameTimer); gameTimer = null }
  if (moleTimer) { clearTimeout(moleTimer); moleTimer = null }
  gameMoles.value = Array(9).fill(false)
  const now = new Date()
  gameHistory.value = {
    score: gameScore.value,
    time: `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
  }
}

function closeGame() {
  endGame()
  showGameDialog.value = false
}

// 一键分享
const showShareSheet = ref(false)
function openShareSheet() {
  showShareSheet.value = true
}
// 从游戏卡片直接打开分享面板（不进入游戏）
function openGameShare(game: typeof puzzleGames[number]) {
  activeGame.value = game
  gameHistory.value = null
  showShareSheet.value = true
}
function shareToWeChatMoments() {
  if (!activeGame.value) return
  const text = activeGame.value.shareLine + (gameHistory.value ? ` 本局得分：${gameHistory.value.score}分` : '')
  // 模拟分享到微信朋友圈
  showToast(`已复制分享文案，正在跳转微信朋友圈...\n\n${text}`)
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {})
  showShareSheet.value = false
}
function shareToWeChatChat() {
  if (!activeGame.value) return
  const text = activeGame.value.shareLine + (gameHistory.value ? ` 本局得分：${gameHistory.value.score}分` : '')
  showToast(`已复制分享文案，正在跳转微信对话...\n\n${text}`)
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {})
  showShareSheet.value = false
}
</script>

<template>
  <div class="learn-page">
    <!-- 标题 -->
    <div class="page-head">
      <h1 class="page-head__title"><AppIcon name="book-open" :size="24" color="var(--color-brand)" /> 乐活天地</h1>
    </div>

    <!-- 1. 直播与回放 -->
    <section class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="video" :size="18" /> 直播与回放</div>
        <span v-if="liveClasses.length > 2" class="more-link" @click="showAllLive = !showAllLive">
          {{ showAllLive ? '收起' : '查看更多' }}
        </span>
      </div>
      <div class="live-grid">
        <div
          v-for="live in displayLive"
          :key="live.name"
          class="live-card-v2"
          :class="{ 'is-live': live.live, 'is-replay': !live.live }"
          @click="startCourse(live.name)"
        >
          <div class="live-icon-v2">
            <AppIcon :name="live.icon" :size="20" :color="'#fff'" />
          </div>
          <div class="live-info-v2">
            <div class="live-name-v2">{{ live.name }}</div>
            <div class="live-meta-v2">{{ live.meta }}</div>
          </div>
          <span v-if="live.live" class="live-badge-inline">
            <span class="live-pulse-dot"></span> 直播中
          </span>
          <span v-else class="replay-badge-inline">
            <AppIcon name="film" :size="11" :color="'#fff'" /> 回放
          </span>
          <button class="live-btn-v2" :class="{ 'live-btn-primary-v2': live.live }">
            {{ live.live ? '进入' : '观看' }}
          </button>
        </div>
      </div>
    </section>

    <!-- 2. 老年课堂（合并学习分类） -->
    <section ref="classroomSection" class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="school" :size="18" /> 老年课堂</div>
        <span class="more-link" @click="showMoreCourses = !showMoreCourses">
          {{ showMoreCourses ? '收起' : '更多' }}
        </span>
      </div>

      <!-- 精品课程（8 大类，默认隐藏，点击更多时显示） -->
      <transition name="expand">
        <div v-if="showMoreCourses" class="course-grid">
          <div
            v-for="course in elderlyCourses"
            :key="course.id"
            class="course-card"
            :class="course.color"
            @click="openCourseDetail(course)"
          >
            <div class="course-icon-wrap" :style="{ background: gradMap[course.color] }">
              <AppIcon :name="course.icon" :size="22" :color="'#fff'" />
            </div>
            <div class="course-info">
              <div class="course-name-row">
                <span class="course-name">{{ course.name }}</span>
                <span class="course-level" :class="course.color">{{ course.level }}</span>
              </div>
              <div class="course-desc">{{ course.desc }}</div>
              <div class="course-meta">
                <span><AppIcon name="book-open" :size="10" /> {{ course.lessons }} 课</span>
                <span class="course-arrow"><AppIcon name="chevron-right" :size="11" /></span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 默认课程（图形图标，可点击查看详情） -->
      <div class="course-grid">
        <div
          v-for="ec in elderlyClassesExtended"
          :key="ec.name"
          class="course-card"
          :class="ec.color"
          @click="openElderlyCourseDetail(ec)"
        >
          <div class="course-icon-wrap" :style="{ background: gradMap[ec.color] }">
            <AppIcon :name="ec.icon" :size="22" :color="'#fff'" />
          </div>
          <div class="course-info">
            <div class="course-name-row">
              <span class="course-name">{{ ec.name }}</span>
              <span class="course-level" :class="ec.color">{{ ec.level }}</span>
            </div>
            <div class="course-desc">{{ ec.desc }}</div>
            <div class="course-meta">
              <span><AppIcon name="book-open" :size="10" /> {{ ec.lessons }} 课</span>
              <span class="course-arrow"><AppIcon name="chevron-right" :size="11" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 智能陪伴广场（任务6：AI 智能推荐） -->
    <section class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="sparkles" :size="18" /> 智能陪伴广场</div>
        <span class="companion-ai-tag"><AppIcon name="bot" :size="10" /> AI 智能推荐</span>
      </div>
      <p class="block-sub">小康会根据您的兴趣、身体状况、天气、时间智能推荐，让陪伴自然发生</p>
      <div class="companion-suggest-list">
        <div
          v-for="s in companionSuggestions"
          :key="s.id"
          class="companion-suggest-card"
          @click="handleSuggestion(s)"
        >
          <div class="companion-suggest-icon" :style="{ background: s.bg }">
            <AppIcon :name="s.icon" :size="22" :color="'#fff'" />
          </div>
          <div class="companion-suggest-body">
            <div class="companion-suggest-title">{{ s.title }}</div>
            <div class="companion-suggest-desc">{{ s.desc }}</div>
            <div class="companion-suggest-reason">
              <AppIcon name="info" :size="10" :color="'var(--color-text-tertiary)'" />
              <span>{{ s.reason }}</span>
            </div>
            <div class="companion-suggest-foot">
              <span class="companion-suggest-time"><AppIcon name="clock" :size="10" /> {{ s.time }}</span>
              <button class="companion-suggest-btn">{{ s.action }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 老照片智能修复（任务8） -->
    <section class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="book-heart" :size="18" /> 老照片智能修复</div>
        <span class="more-link" @click="openPhotoRepair">立即制作 ></span>
      </div>
      <p class="block-sub">AI 修复老旧照片，生成精美电子书/实体书，留住珍贵回忆</p>
      <div class="photo-repair-card" @click="openPhotoRepair">
        <div class="photo-repair-features">
          <div v-for="f in photoRepair.features" :key="f.title" class="photo-repair-feature">
            <div class="photo-repair-feature-icon" :style="{ background: f.color }">
              <AppIcon :name="f.icon" :size="18" :color="'var(--color-brand-dark)'" />
            </div>
            <div class="photo-repair-feature-title">{{ f.title }}</div>
            <div class="photo-repair-feature-desc">{{ f.desc }}</div>
          </div>
        </div>
        <div class="photo-repair-examples">
          <div class="photo-repair-examples-title">
            <AppIcon name="camera" :size="12" /> 已修复示例
          </div>
          <div class="photo-repair-examples-list">
            <div
              v-for="ex in photoRepair.examples"
              :key="ex.id"
              class="photo-repair-example-item"
              :class="ex.status"
            >
              <div class="photo-repair-example-thumb">
                <AppIcon name="image" :size="20" :color="'var(--color-text-tertiary)'" />
              </div>
              <div class="photo-repair-example-info">
                <div class="photo-repair-example-title">{{ ex.title }}</div>
                <div class="photo-repair-example-desc">{{ ex.desc }}</div>
              </div>
              <span v-if="ex.status === 'done'" class="photo-repair-example-status done">已完成</span>
              <span v-else class="photo-repair-example-status pending">待修复</span>
            </div>
          </div>
        </div>
        <button class="photo-repair-cta" @click.stop="openPhotoRepair">
          <AppIcon name="sparkles" :size="14" :color="'#fff'" /> 立即修复老照片 · 制作电子书/实体书
        </button>
      </div>
    </section>

    <!-- 3. 我的学习 -->
    <section class="block">
      <div class="section-title"><AppIcon name="trending-up" :size="18" /> 我的学习</div>
      <div class="my-learning glass-card">
        <div class="progress-header">
          <span class="progress-label">本周学习 {{ learningProgress.weeklyHours }} 小时 / 目标 {{ learningProgress.weeklyGoal }} 小时</span>
          <span class="progress-value">{{ learningProgress.percent }}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: learningProgress.percent + '%' }"></div>
        </div>
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-icon"><AppIcon name="book-open" :size="20" color="var(--color-brand)" /></span>
            <span class="stat-value">{{ learningProgress.learnedCourses }}</span>
            <span class="stat-label">已学课程</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon"><AppIcon name="flame" :size="20" color="var(--color-accent3)" /></span>
            <span class="streak-badge">{{ learningProgress.streakDays }}天连续</span>
            <span class="stat-label">连续学习</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 社区圈子 -->
    <section ref="communitySection" class="block">
      <div class="section-title"><AppIcon name="users" :size="18" /> 社区圈子 <span class="more-link">更多 ></span></div>
      <p class="block-sub">围绕周围小区，因共同爱好加入圈子，约线下交流</p>
      <div class="circle-list">
        <div v-for="c in communityCircles" :key="c.title" class="circle-card" @click="joinCircle(c.title)">
          <div class="circle-head">
            <span class="circle-icon"><AppIcon :name="c.icon" :size="24" :color="'var(--color-brand)'" /></span>
            <div class="circle-info">
              <div class="circle-title">
                {{ c.title }}
                <span v-if="c.live" class="live-badge small">活动中</span>
              </div>
              <div class="circle-desc">{{ c.desc }}</div>
            </div>
          </div>
          <div class="circle-meta">
            <span><AppIcon name="users" :size="12" /> {{ c.members }}人</span>
            <span><AppIcon name="map-pin" :size="12" /> {{ c.distance }}</span>
            <span class="join-btn">加入</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 线下活动 -->
    <section class="block">
      <div class="section-title"><AppIcon name="calendar-heart" :size="18" /> 线下活动 <span class="more-link">更多 ></span></div>
      <p class="block-sub">戏曲、摄影等兴趣活动，点击报名参加</p>
      <div class="activity-list">
        <div
          v-for="(a, idx) in activityList"
          :key="idx"
          class="activity-card"
          :class="{ joined: a.joined }"
        >
          <div class="activity-head">
            <span class="activity-icon" :class="a.category"><AppIcon :name="a.icon" :size="26" :color="a.category === '戏曲' ? 'var(--color-accent3)' : 'var(--color-accent2)'" /></span>
            <span class="activity-cat" :class="a.category">{{ a.category }}</span>
          </div>
          <div class="activity-title">{{ a.title }}</div>
          <div class="activity-meta">
            <span class="activity-meta-item"><AppIcon name="clock" :size="13" /> {{ a.time }}</span>
            <span class="activity-meta-item"><AppIcon name="map-pin" :size="13" /> {{ a.location }}</span>
          </div>
          <div class="activity-footer">
            <span class="activity-members">
              <AppIcon name="users" :size="13" />
              <span class="members-text">{{ a.members }}/{{ a.total }}人</span>
              <span class="members-bar-wrap">
                <span class="members-bar-fill" :style="{ width: (a.members / a.total * 100) + '%' }"></span>
              </span>
            </span>
            <button class="activity-btn" :class="{ joined: a.joined }" @click="joinActivity(idx)">
              {{ a.joined ? '已报名' : '报名参加' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 夕阳事迹 / 健康知识科普（任务4：点击切换 + 精准推送） -->
    <section class="block">
      <div class="section-title-row">
        <div class="sunset-tabs">
          <button
            class="sunset-tab"
            :class="{ active: sunsetTab === 'stories' }"
            @click="sunsetTab = 'stories'"
          >
            <AppIcon name="book-heart" :size="14" /> 夕阳事迹
          </button>
          <button
            class="sunset-tab"
            :class="{ active: sunsetTab === 'knowledge' }"
            @click="sunsetTab = 'knowledge'"
          >
            <AppIcon name="lightbulb" :size="14" /> 健康知识科普
          </button>
        </div>
        <span class="more-link" @click="showToast(sunsetTab === 'stories' ? '查看更多夕阳事迹' : '查看更多健康知识')">
          更多
        </span>
      </div>

      <!-- 夕阳事迹列表 -->
      <div v-if="sunsetTab === 'stories'" class="story-list">
        <div v-for="(story, idx) in elderlyStories" :key="idx" class="story-card" @click="showToast(story.title)">
          <div class="story-image" :style="{ background: story.bg }">
            <AppIcon :name="story.icon" :size="32" :color="'#fff'" />
          </div>
          <div class="story-content">
            <div class="story-tag">{{ story.tag }}</div>
            <div class="story-title">{{ story.title }}</div>
            <div class="story-desc">{{ story.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 健康知识科普（精准推送） -->
      <div v-else class="knowledge-list">
        <div class="knowledge-push-banner">
          <AppIcon name="sparkles" :size="14" :color="'var(--color-brand-dark)'" />
          <span>小康根据您的健康状况，为您精准推送以下知识</span>
        </div>
        <div
          v-for="k in healthKnowledge"
          :key="k.id"
          class="knowledge-card"
          @click="showToast(`正在阅读：${k.title}\n\n${k.summary}`)"
        >
          <div class="knowledge-icon" :style="{ background: k.bg }">
            <AppIcon :name="k.icon" :size="22" :color="'#fff'" />
          </div>
          <div class="knowledge-body">
            <div class="knowledge-title-row">
              <span class="knowledge-category">{{ k.category }}</span>
              <span class="knowledge-read-time"><AppIcon name="clock" :size="10" /> {{ k.readTime }}</span>
            </div>
            <div class="knowledge-title">{{ k.title }}</div>
            <div class="knowledge-summary">{{ k.summary }}</div>
            <div class="knowledge-reason">
              <AppIcon name="heart" :size="10" :color="'#E74C3C'" />
              <span>{{ k.reason }}</span>
            </div>
            <div class="knowledge-tags">
              <span v-for="tag in k.tags" :key="tag" class="knowledge-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新条例解读 -->
    <section class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="scroll-text" :size="18" /> 最新条例解读</div>
        <span class="more-link" @click="showToast('查看更多条例解读')">更多</span>
      </div>
      <div class="policy-list">
        <div v-for="(p, idx) in policies" :key="idx" class="policy-card" @click="showToast(p.title)">
          <div class="policy-date">{{ p.date }}</div>
          <div class="policy-content">
            <div class="policy-title">{{ p.title }}</div>
            <div class="policy-desc">{{ p.desc }}</div>
            <div class="policy-tags">
              <span v-for="tag in p.tags" :key="tag" class="policy-tag">{{ tag }}</span>
            </div>
          </div>
          <AppIcon name="chevron-right" :size="16" :color="'var(--color-text-tertiary)'" />
        </div>
      </div>
    </section>

    <!-- 益智游戏：锻炼反应能力+手指协调，含搞笑元素与一键分享 -->
    <section class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="gamepad" :size="18" /> 益智游戏</div>
        <span class="more-link" @click="showToast('更多益智游戏开发中...')">更多</span>
      </div>
      <p class="block-sub">锻炼反应能力与手指协调，老少皆宜，玩出好心情，玩出好脑力</p>
      <div class="game-grid">
        <div
          v-for="g in puzzleGames"
          :key="g.id"
          class="game-card"
          @click="openGame(g)"
        >
          <div class="game-banner" :style="{ background: g.bg }">
            <AppIcon :name="g.icon" :size="32" :color="'#fff'" />
            <span class="game-fun-tag">{{ g.funTag }}</span>
          </div>
          <div class="game-body">
            <div class="game-name">{{ g.name }}</div>
            <div class="game-desc">{{ g.desc }}</div>
            <div class="game-meta">
              <span class="game-skill"><AppIcon name="zap" :size="11" /> {{ g.skill }} · {{ g.skillLevel }}</span>
              <span class="game-players"><AppIcon name="users" :size="11" /> {{ g.players }}人在玩</span>
            </div>
          </div>
          <div class="game-card-actions">
            <button class="game-play-btn" @click.stop="openGame(g)">
              <AppIcon name="play" :size="12" :color="'#fff'" /> 开始
            </button>
            <button class="game-share-btn" @click.stop="openGameShare(g)">
              <AppIcon name="share" :size="12" :color="'var(--color-brand)'" /> 分享
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 赛博养老 -->
    <section class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="rocket" :size="18" /> 赛博养老</div>
        <span class="more-link" @click="showToast('查看更多赛博养老')">更多</span>
      </div>
      <div class="cyber-list">
        <div v-for="(c, idx) in cyberElders" :key="idx" class="cyber-card" @click="showToast(c.title)">
          <div class="cyber-banner" :style="{ background: c.bg }">
            <AppIcon :name="c.icon" :size="28" :color="'#fff'" />
            <span class="cyber-tag">{{ c.tag }}</span>
          </div>
          <div class="cyber-body">
            <div class="cyber-title">{{ c.title }}</div>
            <div class="cyber-desc">{{ c.desc }}</div>
            <div class="cyber-footer">
              <span class="cyber-members"><AppIcon name="users" :size="12" /> {{ c.members }}人参与</span>
              <button class="cyber-join-btn" @click.stop="showToast(`已加入：${c.title}`)">加入</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 课程详情弹窗（任务7） -->
    <transition name="fade">
      <div v-if="showCourseDialog && activeCourse" class="course-dialog-mask" @click="showCourseDialog = false">
        <div class="course-dialog" @click.stop>
          <div class="course-dialog-head" :style="{ background: gradMap[activeCourse.color] }">
            <div class="course-dialog-icon">
              <AppIcon :name="activeCourse.icon" :size="28" :color="'#fff'" />
            </div>
            <div class="course-dialog-title-wrap">
              <div class="course-dialog-name">{{ activeCourse.name }}</div>
              <div class="course-dialog-meta">
                <span class="course-dialog-level">{{ activeCourse.level }}</span>
                <span class="course-dialog-lessons">{{ activeCourse.lessons }} 课时</span>
              </div>
            </div>
            <button class="course-dialog-close" @click="showCourseDialog = false">
              <AppIcon name="x" :size="18" :color="'#fff'" />
            </button>
          </div>
          <div class="course-dialog-body">
            <div class="course-dialog-desc">{{ activeCourse.desc }}</div>
            <div class="course-dialog-subtitle">
              <AppIcon name="list" :size="14" :color="'var(--color-brand)'" />
              <span>课程章节</span>
            </div>
            <div class="course-dialog-items">
              <div
                v-for="(item, idx) in activeCourse.items"
                :key="idx"
                class="course-dialog-item"
                @click="startCourse(`${activeCourse.name} · ${item}`)"
              >
                <span class="course-dialog-item-num">{{ idx + 1 }}</span>
                <span class="course-dialog-item-name">{{ item }}</span>
                <AppIcon name="play" :size="12" :color="'var(--color-brand)'" />
              </div>
            </div>
          </div>
          <div class="course-dialog-foot">
            <button class="course-dialog-btn primary" @click="startCourse(activeCourse.name); showCourseDialog = false">
              <AppIcon name="play" :size="14" :color="'#fff'" /> 开始学习
            </button>
            <button class="course-dialog-btn ghost" @click="showToast(`已收藏：${activeCourse.name}`)">
              <AppIcon name="star" :size="14" /> 收藏
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 老照片智能修复弹窗（任务8） -->
    <transition name="fade">
      <div v-if="showPhotoRepair" class="photo-repair-mask" @click="showPhotoRepair = false">
        <div class="photo-repair-dialog" @click.stop>
          <div class="photo-repair-dialog-head">
            <div class="photo-repair-dialog-title">
              <AppIcon name="book-heart" :size="18" :color="'var(--color-brand)'" />
              <span>老照片智能修复</span>
            </div>
            <button class="photo-repair-dialog-close" @click="showPhotoRepair = false">
              <AppIcon name="x" :size="18" :color="'var(--color-text-tertiary)'" />
            </button>
          </div>
          <div class="photo-repair-dialog-body">
            <!-- 功能列表 -->
            <div class="repair-features-grid">
              <div v-for="f in photoRepair.features" :key="f.title" class="repair-feature-item">
                <div class="repair-feature-icon" :style="{ background: f.color }">
                  <AppIcon :name="f.icon" :size="20" :color="'var(--color-brand-dark)'" />
                </div>
                <div class="repair-feature-title">{{ f.title }}</div>
                <div class="repair-feature-desc">{{ f.desc }}</div>
              </div>
            </div>

            <!-- 上传区 -->
            <div class="repair-upload-area" @click="showToast('请选择需要修复的老照片（支持拍照或从相册选择）')">
              <AppIcon name="camera" :size="32" :color="'var(--color-text-tertiary)'" />
              <div class="repair-upload-title">上传老照片</div>
              <div class="repair-upload-desc">支持 JPG/PNG，AI 自动修复划痕、褪色、模糊</div>
            </div>

            <!-- 成书方式 -->
            <div class="repair-book-section">
              <div class="repair-book-title">
                <AppIcon name="book" :size="14" :color="'var(--color-brand)'" />
                <span>选择成书方式</span>
              </div>
              <div class="repair-book-list">
                <div
                  v-for="b in photoRepair.bookTypes"
                  :key="b.id"
                  class="repair-book-item"
                  :class="{ active: activeBookType === b.id, popular: b.popular }"
                  @click="selectBookType(b.id)"
                >
                  <span v-if="b.popular" class="repair-book-popular">热门</span>
                  <div class="repair-book-icon">
                    <AppIcon :name="b.icon" :size="20" :color="'var(--color-brand)'" />
                  </div>
                  <div class="repair-book-info">
                    <div class="repair-book-name">{{ b.name }}</div>
                    <div class="repair-book-desc">{{ b.desc }}</div>
                    <div class="repair-book-price">
                      <span v-if="b.price === 0" class="free">免费</span>
                      <span v-else class="price">¥{{ b.price }}</span>
                    </div>
                  </div>
                  <span class="repair-book-radio" :class="{ active: activeBookType === b.id }"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="photo-repair-dialog-foot">
            <button class="repair-dialog-btn primary" @click="startRepair">
              <AppIcon name="sparkles" :size="14" :color="'#fff'" /> 开始修复 · 生成相册
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 益智游戏弹窗 -->
    <transition name="fade">
      <div v-if="showGameDialog && activeGame" class="game-dialog-mask" @click="closeGame">
        <div class="game-dialog" @click.stop>
          <div class="game-dialog-head" :style="{ background: activeGame.bg }">
            <div class="game-dialog-icon">
              <AppIcon :name="activeGame.icon" :size="28" :color="'#fff'" />
            </div>
            <div class="game-dialog-title-wrap">
              <div class="game-dialog-name">{{ activeGame.name }}</div>
              <div class="game-dialog-meta">
                <span class="game-dialog-skill">{{ activeGame.skill }} · {{ activeGame.skillLevel }}</span>
                <span class="game-dialog-fun">{{ activeGame.funTag }}</span>
              </div>
            </div>
            <button class="game-dialog-close" @click="closeGame">
              <AppIcon name="x" :size="20" :color="'#fff'" />
            </button>
          </div>

          <div class="game-dialog-body">
            <div class="game-desc-row">
              <AppIcon name="info" :size="13" :color="'var(--color-brand)'" />
              <span>{{ activeGame.desc }}</span>
            </div>

            <!-- 游戏区（打地鼠统一玩法） -->
            <div class="game-stage">
              <div class="game-status-bar">
                <span class="game-stat">
                  <AppIcon name="zap" :size="14" :color="'var(--color-brand)'" />
                  <span>得分：<b>{{ gameScore }}</b></span>
                </span>
                <span class="game-stat">
                  <AppIcon name="clock" :size="14" :color="'var(--color-brand)'" />
                  <span>剩余：<b>{{ gameTimeLeft }}s</b></span>
                </span>
              </div>

              <div v-if="!gameRunning && !gameHistory" class="game-ready">
                <div class="game-ready-icon" :style="{ background: activeGame.bg }">
                  <AppIcon :name="activeGame.icon" :size="48" :color="'#fff'" />
                </div>
                <div class="game-ready-title">准备好了吗？</div>
                <div class="game-ready-desc">30秒内点击冒出的图标，每点中一个+1分<br/>锻炼反应速度，老人也能玩出花～</div>
                <button class="game-start-btn" @click="startGame">
                  <AppIcon name="play" :size="16" :color="'#fff'" /> 开始游戏
                </button>
              </div>

              <div v-else-if="gameRunning" class="mole-grid">
                <div
                  v-for="(m, idx) in gameMoles"
                  :key="idx"
                  class="mole-cell"
                  :class="{ active: m }"
                  @click="hitMole(idx)"
                >
                  <span v-if="m" class="mole-icon" :style="{ background: activeGame.bg }">
                    <AppIcon :name="activeGame.icon" :size="28" :color="'#fff'" />
                  </span>
                </div>
              </div>

              <div v-else-if="gameHistory" class="game-result">
                <div class="result-trophy">
                  <AppIcon name="trophy" :size="56" :color="'#F6A35C'" />
                </div>
                <div class="result-title">游戏结束！</div>
                <div class="result-score">本局得分 <b>{{ gameHistory.score }}</b> 分</div>
                <div class="result-time">挑战时间：{{ gameHistory.time }}</div>
                <div class="result-fun-tip">
                  <AppIcon name="sparkles" :size="13" :color="'var(--color-brand)'" />
                  <span>{{ activeGame.shareLine }}</span>
                </div>
                <div class="result-actions">
                  <button class="result-btn primary" @click="startGame">
                    <AppIcon name="refresh-cw" :size="14" :color="'#fff'" /> 再来一局
                  </button>
                  <button class="result-btn ghost" @click="openShareSheet">
                    <AppIcon name="send" :size="14" :color="'var(--color-brand)'" /> 一键分享
                  </button>
                </div>
              </div>
            </div>

            <!-- 历史最佳 -->
            <div class="game-tip-row">
              <AppIcon name="shield-check" :size="13" :color="'var(--color-brand)'" />
              <span>适度游戏健脑，每次不超过15分钟，注意休息眼睛</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 分享面板 -->
    <transition name="fade">
      <div v-if="showShareSheet" class="share-sheet-mask" @click="showShareSheet = false">
        <div class="share-sheet" @click.stop>
          <div class="share-sheet-handle"></div>
          <div class="share-sheet-title">分享到</div>
          <div class="share-sheet-grid">
            <button class="share-sheet-item" @click="shareToWeChatMoments">
              <span class="share-sheet-icon moments">
                <AppIcon name="image" :size="26" :color="'#fff'" />
              </span>
              <span>微信朋友圈</span>
            </button>
            <button class="share-sheet-item" @click="shareToWeChatChat">
              <span class="share-sheet-icon chat">
                <AppIcon name="message-circle" :size="26" :color="'#fff'" />
              </span>
              <span>微信对话</span>
            </button>
          </div>
          <div class="share-sheet-preview" v-if="activeGame">
            <div class="share-preview-title">分享文案预览</div>
            <div class="share-preview-text">{{ activeGame.shareLine }}<span v-if="gameHistory"> 本局得分：{{ gameHistory.score }}分</span></div>
          </div>
          <button class="share-sheet-cancel" @click="showShareSheet = false">取消</button>
        </div>
      </div>
    </transition>

    <!-- 开始学习提示 -->
    <transition name="toast">
      <div v-if="startToast" class="toast">{{ startToast }}</div>
    </transition>
  </div>
</template>

<style scoped>
.learn-page {
  padding: var(--space-4) var(--space-4) var(--space-8);
}

.page-head {
  padding: 0 var(--space-1) var(--space-3);
}
.page-head__title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: var(--weight-extrabold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.block {
  margin-bottom: var(--space-6);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--leading-tight);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.more-link {
  margin-left: auto;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.more-link:hover {
  color: var(--color-brand);
  transform: translateX(2px);
}
.more-link:active {
  transform: scale(0.94);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.block-sub {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
  margin-top: calc(-1 * var(--space-2));
}

/* 直播与回放 V2（社区圈子复用 live-badge） */
.live-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: var(--state-error);
  color: var(--color-text-inverse);
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: var(--weight-semibold);
  padding: 1px 6px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 3px;
  animation: live-pulse 1.5s ease-in-out infinite;
  box-shadow: 0 1px 3px rgba(212, 107, 107, 0.4);
}
.live-badge::before {
  content: '';
  width: 5px;
  height: 5px;
  background: #fff;
  border-radius: 50%;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* 直播与回放 V2（紧凑横向布局） */
.live-grid { display: flex; flex-direction: column; gap: var(--space-3); }
.live-card-v2 {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md); overflow: hidden;
  background: var(--color-surface-solid); border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(45, 52, 54, 0.06); cursor: pointer;
  transition: all var(--transition-normal);
}
.live-card-v2:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(45, 52, 54, 0.1); }
.live-card-v2:active { transform: scale(0.98); }
.live-card-v2.is-live { border-color: rgba(212, 107, 107, 0.3); }
.live-card-v2.is-replay { border-color: rgba(91, 184, 158, 0.2); }

.live-icon-v2 {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.live-card-v2.is-live .live-icon-v2 {
  background: linear-gradient(135deg, #D46B6B, #E88888);
  box-shadow: 0 2px 8px rgba(212, 107, 107, 0.3);
}
.live-card-v2.is-replay .live-icon-v2 {
  background: linear-gradient(135deg, var(--color-brand-light), var(--color-brand));
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.25);
}
.live-info-v2 { flex: 1; min-width: 0; }
.live-name-v2 {
  font-size: var(--text-base); font-weight: 700; color: var(--color-text-primary);
  margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.live-meta-v2 {
  font-size: var(--text-xs); color: var(--color-text-secondary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.live-badge-inline {
  display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
  background: rgba(212, 107, 107, 0.12); color: #D46B6B;
  font-size: 0.625rem; font-weight: 700;
  padding: 3px 8px; border-radius: var(--radius-full);
}
.live-pulse-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #D46B6B;
  animation: live-pulse 1.2s ease-in-out infinite;
}
.replay-badge-inline {
  display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;
  background: rgba(91, 184, 158, 0.12); color: var(--color-brand);
  font-size: 0.625rem; font-weight: 600;
  padding: 3px 8px; border-radius: var(--radius-full);
}
.live-btn-v2 {
  padding: 6px var(--space-3);
  border: 1px solid var(--color-border-solid); border-radius: var(--radius-full);
  background: var(--color-surface-solid); color: var(--color-text-primary);
  font-size: var(--text-sm); font-weight: 600; cursor: pointer;
  box-sizing: border-box; transition: all var(--transition-fast); flex-shrink: 0;
}
.live-btn-v2:hover { border-color: var(--color-brand); color: var(--color-brand); }
.live-btn-primary-v2 {
  background: linear-gradient(135deg, #D46B6B, #E88888); color: #fff; border: none;
  box-shadow: 0 2px 8px rgba(212, 107, 107, 0.3);
}
.live-btn-primary-v2:hover { filter: brightness(1.05); box-shadow: 0 4px 12px rgba(212, 107, 107, 0.4); color: #fff; }

/* 老年课堂（图标改为小点） */
.elderly-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
.elderly-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 64px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.elderly-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(91,184,158,0.1); }
.elderly-card:active {
  transform: scale(0.97);
}
.elderly-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.elderly-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.elderly-name {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}
.elderly-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/* 社区圈子 */
.circle-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.circle-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  cursor: pointer;
  transition: transform var(--transition-fast);
}
.circle-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(91, 184, 158, 0.12);
  border-color: rgba(91, 184, 158, 0.3);
}
.circle-card:active { transform: scale(0.98); }
.circle-head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.circle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-bg-tertiary);
  flex-shrink: 0;
}
.circle-info { flex: 1; }
.circle-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.circle-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
.circle-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.circle-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.join-btn {
  margin-left: auto;
  padding: 4px 14px;
  background: var(--color-brand);
  color: #fff !important;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  transition: all var(--transition-fast);
}
.join-btn:hover {
  transform: translateY(-1px);
  background: var(--color-brand-dark);
  box-shadow: 0 4px 10px rgba(91, 184, 158, 0.35);
}
.join-btn:active { transform: scale(0.95); }

/* 线下活动 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.activity-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  transition: transform var(--transition-fast);
}
.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border-color: rgba(91, 184, 158, 0.25);
}
.activity-card:active {
  transform: scale(0.98);
}
.activity-card.joined {
  border-color: rgba(91, 184, 158, 0.4);
  background: rgba(91, 184, 158, 0.06);
}
.activity-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-bg-tertiary);
}
.activity-icon.戏曲 {
  background: rgba(232, 184, 124, 0.15);
}
.activity-icon.摄影 {
  background: rgba(111, 177, 217, 0.15);
}
.activity-cat {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}
.activity-cat.戏曲 {
  background: rgba(232, 184, 124, 0.2);
  color: var(--color-accent3-dark);
}
.activity-cat.摄影 {
  background: rgba(111, 177, 217, 0.2);
  color: var(--color-accent2-dark);
}
.activity-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}
.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--space-3);
}
.activity-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}
.activity-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.activity-members {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  flex: 1;
}
.members-text {
  white-space: nowrap;
}
.members-bar-wrap {
  flex: 1;
  height: 4px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-left: 4px;
}
.members-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand), var(--color-brand-light));
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}
.activity-btn {
  flex-shrink: 0;
  min-height: 36px;
  padding: 0 var(--space-4);
  background: var(--color-brand);
  color: var(--color-text-on-brand);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.activity-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.35);
  filter: brightness(1.05);
}
.activity-btn:active {
  transform: scale(0.95);
}
.activity-btn.joined {
  background: var(--color-bg-secondary);
  color: var(--color-brand-dark);
}

/* 我的学习 */
.my-learning {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.progress-label {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
}
.progress-value {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-brand);
}
.progress-bar-bg {
  width: 100%;
  height: 10px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand), var(--color-brand-light));
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}
.stats-row {
  display: flex;
  gap: var(--space-3);
}
.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-2);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}
.stat-icon {
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}
.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}
.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, var(--color-accent3-light), var(--color-accent3));
  color: var(--color-text-inverse);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  padding: 4px var(--space-3);
  border-radius: var(--radius-full);
}

/* 提示 toast */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(45, 52, 54, 0.88);
  color: #fff;
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  z-index: 1500;
  white-space: nowrap;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

/* section标题行（带更多链接） */
.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.more-link {
  font-size: var(--text-sm);
  color: var(--color-brand-dark);
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  background: rgba(91,184,158,0.08);
  transition: all var(--transition-fast);
}
.more-link:hover {
  background: rgba(91,184,158,0.16);
  transform: translateX(2px);
}
.more-link:active {
  transform: scale(0.94);
}

/* 老年故事 */
.story-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.story-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-solid);
  border: 1px solid rgba(255, 177, 153, 0.12);
  box-shadow:
    0 1px 2px rgba(255, 142, 142, 0.06),
    0 4px 12px rgba(45, 52, 54, 0.05);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}
.story-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 209, 165, 0.08), rgba(255, 142, 142, 0.04));
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}
.story-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 2px 4px rgba(255, 142, 142, 0.1),
    0 8px 24px rgba(255, 142, 142, 0.12);
}
.story-card:hover::before { opacity: 1; }
.story-card:active { transform: scale(0.98); }
.story-image {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(255, 142, 142, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.story-content { flex: 1; min-width: 0; }
.story-tag {
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(91,184,158,0.1);
  color: var(--color-brand-dark);
  margin-bottom: 4px;
}
.story-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.story-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 最新条例解读 */
.policy-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.policy-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-solid);
  border: 1px solid rgba(232, 184, 124, 0.12);
  box-shadow:
    0 1px 2px rgba(232, 184, 124, 0.06),
    0 4px 12px rgba(45, 52, 54, 0.05);
  cursor: pointer;
  transition: all var(--transition-normal);
}
.policy-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 2px 4px rgba(232, 184, 124, 0.1),
    0 8px 24px rgba(232, 184, 124, 0.12);
}
.policy-card:active { transform: scale(0.98); }
.policy-date {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 800;
  color: var(--color-accent3-dark);
  text-align: center;
  min-width: 44px;
  padding: 6px 4px;
  border-radius: 10px;
  background: rgba(232, 184, 124, 0.1);
  flex-shrink: 0;
}
.policy-content { flex: 1; min-width: 0; }
.policy-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.policy-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.policy-tags { display: flex; gap: 4px; }
.policy-tag {
  font-size: 0.625rem;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  background: rgba(232,184,124,0.12);
  color: var(--color-accent3-dark);
  font-weight: 600;
}

/* 赛博养老 */
.cyber-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
}
.cyber-card {
  border-radius: var(--radius-md);
  background: var(--color-surface-solid);
  border: 1px solid rgba(255, 177, 153, 0.1);
  box-shadow:
    0 1px 2px rgba(255, 142, 142, 0.06),
    0 4px 12px rgba(45, 52, 54, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
}
.cyber-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 2px 4px rgba(255, 142, 142, 0.1),
    0 8px 24px rgba(255, 142, 142, 0.14);
}
.cyber-card:active { transform: scale(0.98); }
.cyber-banner {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-3);
  gap: var(--space-2);
  position: relative;
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.15);
}
.cyber-tag {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(45, 52, 54, 0.15);
  color: rgba(255,255,255,0.95);
  backdrop-filter: blur(4px);
}
.cyber-body { padding: var(--space-3); }
.cyber-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.cyber-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-2);
}
.cyber-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cyber-members {
  font-size: 0.625rem;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: 2px;
}
.cyber-join-btn {
  padding: 4px 14px;
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(91, 184, 158, 0.3);
  transition: all var(--transition-fast);
}
.cyber-join-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.45);
  filter: brightness(1.05);
}
.cyber-join-btn:active {
  transform: scale(0.95);
}

/* ===== 任务7：老年课堂精品课程 ===== */
.course-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.course-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(91, 184, 158, 0.3);
}
.course-icon-wrap {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.course-info {
  flex: 1;
  min-width: 0;
}
.course-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 2px;
}
.course-name {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.course-level {
  font-size: 0.6rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 8px;
  flex-shrink: 0;
}
.course-level.gold { color: #B8741A; background: rgba(246, 163, 92, 0.15); }
.course-level.green { color: var(--color-brand-dark); background: rgba(91, 184, 158, 0.15); }
.course-level.teal { color: var(--color-brand-dark); background: rgba(91, 184, 158, 0.15); }
.course-level.red { color: #C0392B; background: rgba(231, 76, 60, 0.12); }
.course-level.blue { color: #2E5A88; background: rgba(111, 177, 217, 0.15); }
.course-desc {
  font-size: 0.68rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin-bottom: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.course-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.62rem;
  color: var(--color-text-tertiary);
}
.course-meta span {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

/* ===== 课程详情弹窗 ===== */
.course-dialog-mask {
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
.course-dialog {
  width: 100%;
  max-width: 430px;
  max-height: 85vh;
  background: var(--color-surface-solid);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: courseFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes courseFadeIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.course-dialog-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: 20px 20px 0 0;
  position: relative;
}
.course-dialog-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.course-dialog-title-wrap {
  flex: 1;
  min-width: 0;
}
.course-dialog-name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.course-dialog-meta {
  display: flex;
  gap: var(--space-2);
}
.course-dialog-level,
.course-dialog-lessons {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}
.course-dialog-close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}
.course-dialog-close:hover { background: rgba(255, 255, 255, 0.35); }
.course-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}
.course-dialog-body::-webkit-scrollbar {
  width: 4px;
}
.course-dialog-body::-webkit-scrollbar-thumb {
  background: rgba(91, 184, 158, 0.35);
  border-radius: 2px;
}
.course-dialog-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: rgba(91, 184, 158, 0.06);
  border-radius: 8px;
}
.course-dialog-subtitle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.course-dialog-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.course-dialog-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.course-dialog-item:hover {
  background: rgba(91, 184, 158, 0.06);
  border-color: rgba(91, 184, 158, 0.3);
  transform: translateX(2px);
}
.course-dialog-item-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(91, 184, 158, 0.12);
  color: var(--color-brand-dark);
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
}
.course-dialog-item-name {
  flex: 1;
  font-size: 0.8rem;
  color: var(--color-text-primary);
  font-weight: 500;
}
.course-dialog-foot {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.course-dialog-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.course-dialog-btn.primary {
  flex: 1;
  background: var(--color-brand);
  color: #fff;
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.course-dialog-btn.primary:hover {
  background: var(--color-brand-dark);
  transform: translateY(-1px);
}
.course-dialog-btn.ghost {
  background: rgba(91, 184, 158, 0.1);
  color: var(--color-brand-dark);
}
.course-dialog-btn.ghost:hover {
  background: rgba(91, 184, 158, 0.18);
}

/* ===== 任务6：智能陪伴广场 ===== */
.companion-ai-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.15), rgba(91, 184, 158, 0.05));
  border: 1px solid rgba(91, 184, 158, 0.25);
  border-radius: 10px;
  color: var(--color-brand-dark);
  font-size: 0.65rem;
  font-weight: 600;
}
.companion-suggest-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.companion-suggest-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.companion-suggest-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(91, 184, 158, 0.3);
}
.companion-suggest-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.companion-suggest-body {
  flex: 1;
  min-width: 0;
}
.companion-suggest-title {
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.companion-suggest-desc {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
}
.companion-suggest-reason {
  display: flex;
  align-items: flex-start;
  gap: 3px;
  padding: 4px 8px;
  background: rgba(91, 184, 158, 0.06);
  border-radius: 6px;
  font-size: 0.68rem;
  color: var(--color-text-tertiary);
  line-height: 1.4;
  margin-bottom: 6px;
}
.companion-suggest-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.companion-suggest-time {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.68rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}
.companion-suggest-btn {
  padding: 5px 14px;
  background: var(--color-brand);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(91, 184, 158, 0.3);
}
.companion-suggest-btn:hover {
  background: var(--color-brand-dark);
  transform: translateY(-1px);
}

/* ===== 任务8：老照片智能修复 ===== */
.photo-repair-card {
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: var(--space-3);
  cursor: pointer;
  transition: all 0.25s ease;
}
.photo-repair-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.photo-repair-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.photo-repair-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  text-align: center;
}
.photo-repair-feature-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo-repair-feature-title {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.photo-repair-feature-desc {
  font-size: 0.62rem;
  color: var(--color-text-tertiary);
  line-height: 1.4;
}
.photo-repair-examples {
  padding: var(--space-2) var(--space-3);
  background: rgba(91, 184, 158, 0.04);
  border-radius: 10px;
  margin-bottom: var(--space-3);
}
.photo-repair-examples-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
.photo-repair-examples-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.photo-repair-example-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 8px;
  background: var(--color-surface-solid);
  border-radius: 8px;
}
.photo-repair-example-thumb {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.photo-repair-example-info {
  flex: 1;
  min-width: 0;
}
.photo-repair-example-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.photo-repair-example-desc {
  font-size: 0.65rem;
  color: var(--color-text-tertiary);
}
.photo-repair-example-status {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 8px;
  flex-shrink: 0;
}
.photo-repair-example-status.done {
  color: var(--color-brand-dark);
  background: rgba(91, 184, 158, 0.15);
}
.photo-repair-example-status.pending {
  color: #B8741A;
  background: rgba(246, 163, 92, 0.15);
}
.photo-repair-cta {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.photo-repair-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(91, 184, 158, 0.4);
}

/* ===== 老照片修复弹窗 ===== */
.photo-repair-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.photo-repair-dialog {
  width: 100%;
  max-width: 430px;
  max-height: 85vh;
  background: var(--color-surface-solid);
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
  animation: courseSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.photo-repair-dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.photo-repair-dialog-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}
.photo-repair-dialog-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
.photo-repair-dialog-close:hover { background: rgba(0, 0, 0, 0.06); }
.photo-repair-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-4);
}
.photo-repair-dialog-body::-webkit-scrollbar {
  width: 4px;
}
.photo-repair-dialog-body::-webkit-scrollbar-thumb {
  background: rgba(91, 184, 158, 0.35);
  border-radius: 2px;
}
.repair-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.repair-feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  text-align: center;
}
.repair-feature-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.repair-feature-title {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.repair-feature-desc {
  font-size: 0.62rem;
  color: var(--color-text-tertiary);
  line-height: 1.4;
}
.repair-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--space-4);
  border: 2px dashed rgba(91, 184, 158, 0.3);
  border-radius: 12px;
  background: rgba(91, 184, 158, 0.03);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: var(--space-3);
}
.repair-upload-area:hover {
  border-color: var(--color-brand);
  background: rgba(91, 184, 158, 0.08);
}
.repair-upload-title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.repair-upload-desc {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  text-align: center;
}
.repair-book-section {
  margin-bottom: var(--space-2);
}
.repair-book-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.repair-book-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.repair-book-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 2px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.repair-book-item:hover {
  border-color: rgba(91, 184, 158, 0.3);
}
.repair-book-item.active {
  border-color: var(--color-brand);
  background: rgba(91, 184, 158, 0.06);
}
.repair-book-popular {
  position: absolute;
  top: -6px;
  right: 10px;
  padding: 1px 7px;
  background: linear-gradient(135deg, #FFB199, #FF8E8E);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 600;
  border-radius: 8px;
}
.repair-book-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(91, 184, 158, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.repair-book-info {
  flex: 1;
  min-width: 0;
}
.repair-book-name {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.repair-book-desc {
  font-size: 0.65rem;
  color: var(--color-text-tertiary);
  line-height: 1.4;
  margin-bottom: 2px;
}
.repair-book-price .free {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-brand);
}
.repair-book-price .price {
  font-size: 0.78rem;
  font-weight: 700;
  color: #C0392B;
}
.repair-book-radio {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}
.repair-book-radio.active {
  border-color: var(--color-brand);
  background: var(--color-brand);
  box-shadow: inset 0 0 0 3px #fff;
}
.photo-repair-dialog-foot {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.repair-dialog-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}
.repair-dialog-btn.primary {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.repair-dialog-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(91, 184, 158, 0.4);
}

/* ===== 任务4：夕阳事迹 / 健康知识科普 切换 ===== */
.sunset-tabs {
  display: flex;
  gap: 4px;
  padding: 3px;
  background: rgba(91, 184, 158, 0.08);
  border-radius: 12px;
}
.sunset-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.sunset-tab:hover {
  color: var(--color-brand-dark);
}
.sunset-tab.active {
  background: var(--color-brand);
  color: #fff;
  box-shadow: 0 2px 6px rgba(91, 184, 158, 0.3);
}

/* 健康知识科普 */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.knowledge-push-banner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(135deg, rgba(91, 184, 158, 0.12), rgba(91, 184, 158, 0.04));
  border: 1px solid rgba(91, 184, 158, 0.2);
  border-radius: 10px;
  font-size: 0.72rem;
  color: var(--color-brand-dark);
  font-weight: 500;
  margin-bottom: var(--space-2);
}
.knowledge-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.knowledge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(91, 184, 158, 0.3);
}
.knowledge-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.knowledge-body {
  flex: 1;
  min-width: 0;
}
.knowledge-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.knowledge-category {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-brand-dark);
  background: rgba(91, 184, 158, 0.12);
  padding: 1px 8px;
  border-radius: 8px;
}
.knowledge-read-time {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.62rem;
  color: var(--color-text-tertiary);
}
.knowledge-title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 3px;
}
.knowledge-summary {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.knowledge-reason {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(231, 76, 60, 0.06);
  border-radius: 6px;
  font-size: 0.68rem;
  color: #C0392B;
  font-weight: 500;
  margin-bottom: 6px;
}
.knowledge-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.knowledge-tag {
  font-size: 0.6rem;
  color: var(--color-text-tertiary);
  background: rgba(0, 0, 0, 0.04);
  padding: 1px 6px;
  border-radius: 6px;
}

/* ===== 益智游戏卡片 ===== */
.game-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.game-card {
  background: var(--color-surface-solid);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}
.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 184, 158, 0.15);
}
.game-banner {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.game-fun-tag {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 0.62rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #1A1A2E;
  backdrop-filter: blur(4px);
}
.game-body {
  padding: 10px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.game-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-display);
}
.game-desc {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
  flex: 1;
}
.game-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.66rem;
  color: var(--color-text-tertiary);
}
.game-skill, .game-players {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.game-card-actions {
  display: flex;
  gap: 6px;
  padding: 0 12px 12px;
}
.game-play-btn {
  flex: 1;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(91, 184, 158, 0.3);
  transition: all 0.2s ease;
}
.game-play-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.4);
}
.game-share-btn {
  flex: 1;
  padding: 6px 12px;
  background: var(--color-surface-solid);
  color: var(--color-brand);
  border: 1.5px solid var(--color-brand);
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;
}
.game-share-btn:hover {
  transform: translateY(-1px);
  background: rgba(91, 184, 158, 0.08);
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.15);
}

/* ===== 游戏弹窗 ===== */
.game-dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.55);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}
.game-dialog {
  width: 100%;
  max-width: 430px;
  max-height: 90vh;
  background: #F5F6FA;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  animation: gameFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes gameFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.game-dialog-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: var(--space-4);
  color: #fff;
}
.game-dialog-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.game-dialog-title-wrap { flex: 1; }
.game-dialog-name {
  font-size: 1.05rem;
  font-weight: 700;
  font-family: var(--font-display);
}
.game-dialog-meta {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  font-size: 0.7rem;
}
.game-dialog-skill, .game-dialog-fun {
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.25);
}
.game-dialog-close {
  width: 32px;
  height: 32px;
  min-height: 32px !important;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.game-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.game-desc-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(91, 184, 158, 0.08);
  border-radius: 10px;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.game-stage {
  background: #fff;
  border-radius: 16px;
  padding: var(--space-3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.game-status-bar {
  display: flex;
  justify-content: space-around;
  padding: 8px 0 12px;
  border-bottom: 1px dashed #E0E3EB;
  margin-bottom: 12px;
}
.game-stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--color-text-primary);
}
.game-stat b {
  color: var(--color-brand-dark);
  font-family: var(--font-display);
  font-size: 1rem;
  margin: 0 2px;
}
.game-ready {
  padding: var(--space-4) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.game-ready-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 6px 20px rgba(91, 184, 158, 0.25);
}
.game-ready-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-display);
}
.game-ready-desc {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.game-start-btn {
  margin-top: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(91, 184, 158, 0.35);
  min-height: 44px;
  transition: all 0.2s ease;
}
.game-start-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(91, 184, 158, 0.45);
}
.mole-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 4px 0;
}
.mole-cell {
  aspect-ratio: 1 / 1;
  background: rgba(91, 184, 158, 0.06);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 2px solid transparent;
}
.mole-cell.active {
  background: rgba(91, 184, 158, 0.12);
}
.mole-icon {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: molePop 0.2s ease-out;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}
@keyframes molePop {
  from { transform: scale(0.3); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.game-result {
  padding: var(--space-4) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.result-trophy {
  margin-bottom: 4px;
}
.result-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-display);
}
.result-score {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}
.result-score b {
  font-size: 1.5rem;
  color: #F6A35C;
  font-family: var(--font-display);
  margin: 0 4px;
}
.result-time {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}
.result-fun-tip {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(246, 163, 92, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.75rem;
  color: #8a4a14;
  line-height: 1.5;
  max-width: 95%;
}
.result-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
.result-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  min-height: 40px;
}
.result-btn.primary {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  box-shadow: 0 4px 14px rgba(91, 184, 158, 0.3);
}
.result-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(91, 184, 158, 0.4);
}
.result-btn.ghost {
  background: #fff;
  color: var(--color-brand-dark);
  border: 1.5px solid rgba(91, 184, 158, 0.4);
}
.game-tip-row {
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

/* ===== 分享面板 ===== */
.share-sheet-mask {
  position: fixed;
  inset: 0;
  background: rgba(45, 52, 54, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.share-sheet {
  width: 100%;
  max-width: 430px;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: var(--space-4);
  animation: shareSheetUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes shareSheetUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.share-sheet-handle {
  width: 36px;
  height: 4px;
  background: #E0E3EB;
  border-radius: 2px;
  margin: 0 auto var(--space-3);
}
.share-sheet-title {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  font-family: var(--font-display);
}
.share-sheet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.share-sheet-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: var(--space-3);
  background: rgba(91, 184, 158, 0.04);
  border: 1px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.82rem;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}
.share-sheet-item:hover {
  border-color: rgba(91, 184, 158, 0.3);
  background: rgba(91, 184, 158, 0.08);
  transform: translateY(-1px);
}
.share-sheet-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.share-sheet-icon.moments {
  background: linear-gradient(135deg, #FFB199, #FD6585);
}
.share-sheet-icon.chat {
  background: linear-gradient(135deg, #C8F0E0, #5BB89E);
}
.share-sheet-preview {
  padding: var(--space-3);
  background: rgba(91, 184, 158, 0.05);
  border-radius: 12px;
  margin-bottom: var(--space-3);
}
.share-preview-title {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  margin-bottom: 6px;
  font-weight: 600;
}
.share-preview-text {
  font-size: 0.8rem;
  color: var(--color-text-primary);
  line-height: 1.5;
}
.share-sheet-cancel {
  width: 100%;
  padding: 12px;
  background: #F5F6FA;
  color: var(--color-text-secondary);
  border: none;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  min-height: 44px;
}
.share-sheet-cancel:hover {
  background: #E0E3EB;
}
</style>
