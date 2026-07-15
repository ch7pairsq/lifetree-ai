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

// 老年课堂图标颜色映射
function iconToColor(icon: string): string {
  if (icon === 'smartphone') return 'blue'
  if (icon === 'palette') return 'gold'
  if (icon === 'shield-alert') return 'red'
  if (icon === 'leaf') return 'green'
  return 'teal'
}

// 直播与回放展示控制
const showAllLive = ref(false)
const displayLive = computed(() => (showAllLive.value ? liveClasses : liveClasses.slice(0, 2)))

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
      <div class="section-title"><AppIcon name="school" :size="18" /> 老年课堂 <span class="more-link">更多 ></span></div>
      <div class="elderly-grid">
        <div
          v-for="ec in elderlyClassesExtended"
          :key="ec.name"
          class="elderly-card"
          @click="startCourse(ec.name)"
        >
          <div class="elderly-header">
            <span class="elderly-dot" :style="{ background: gradMap[iconToColor(ec.icon)] }"></span>
            <span class="elderly-name">{{ ec.name }}</span>
          </div>
          <div class="elderly-desc">{{ ec.desc }}</div>
        </div>
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

    <!-- 夕阳事迹 -->
    <section class="block">
      <div class="section-title-row">
        <div class="section-title"><AppIcon name="book-heart" :size="18" /> 夕阳事迹</div>
        <span class="more-link" @click="showToast('查看更多夕阳事迹')">更多</span>
      </div>
      <div class="story-list">
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
</style>
