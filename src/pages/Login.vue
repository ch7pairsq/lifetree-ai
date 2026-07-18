<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { loginAccounts, thirdPartyLogins } from '@/mock'
import {
  Phone, ShieldCheck, Eye, EyeOff,
  Leaf, MessageCircle, Wallet, MessageSquare, Apple, Check,
  Loader2, HeartPulse, AlertCircle, User,
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

// ===== 登录方式切换 =====
type LoginType = 'sms' | 'password'
const loginType = ref<LoginType>('sms')

// ===== 表单 =====
const phone = ref('')
const smsCode = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)

// 协议同意
const agreed = ref(true)

// 加载/错误状态
const loading = ref(false)
const errorMsg = ref('')
const successTip = ref('')

// 验证码倒计时
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 协议弹窗
const showAgreement = ref<'user' | 'privacy' | null>(null)

// ===== 切换登录方式：自动填入对应演示数据 =====
function switchLoginType(type: LoginType) {
  loginType.value = type
  errorMsg.value = ''
  if (type === 'sms') {
    phone.value = loginAccounts.demoAccount.phone
    smsCode.value = loginAccounts.demoAccount.smsCode
  } else {
    username.value = loginAccounts.demoAccount.username
    password.value = loginAccounts.demoAccount.password
  }
}

// ===== 发送验证码 =====
function sendSmsCode() {
  if (countdown.value > 0) return
  if (!phone.value || phone.value.replace(/\s/g, '').length !== 11) {
    errorMsg.value = '请输入正确的 11 位手机号'
    return
  }
  errorMsg.value = ''
  // 模拟发送，自动带入演示验证码
  if (phone.value.replace(/\s/g, '') === loginAccounts.phoneAccount.phonePlain) {
    smsCode.value = loginAccounts.phoneAccount.smsCode
  }
  successTip.value = '验证码已发送，请查收短信'
  setTimeout(() => (successTip.value = ''), 3000)
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      if (countdownTimer) clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

// ===== 初始化：默认带入验证码登录演示数据 =====
phone.value = loginAccounts.demoAccount.phone
smsCode.value = loginAccounts.demoAccount.smsCode

// ===== 表单校验 =====
const phonePlain = computed(() => phone.value.replace(/\s/g, ''))

const canSubmit = computed(() => {
  if (!agreed.value) return false
  if (loginType.value === 'sms') {
    return phonePlain.value.length === 11 && smsCode.value.length >= 4
  }
  // 密码登录：需用户名 + 密码
  return username.value.trim().length >= 2 && password.value.length >= 6
})

// ===== 登录提交 =====
async function handleLogin() {
  if (!canSubmit.value) {
    if (!agreed.value) {
      errorMsg.value = '请先阅读并同意用户协议与隐私政策'
    } else if (loginType.value === 'sms' && phonePlain.value.length !== 11) {
      errorMsg.value = '请输入正确的 11 位手机号'
    } else if (loginType.value === 'sms' && smsCode.value.length < 4) {
      errorMsg.value = '请输入正确的验证码'
    } else if (loginType.value === 'password' && username.value.trim().length < 2) {
      errorMsg.value = '请输入用户名'
    } else {
      errorMsg.value = '密码至少 6 位'
    }
    return
  }
  errorMsg.value = ''
  loading.value = true
  // 模拟登录请求
  await new Promise((r) => setTimeout(r, 900))
  loading.value = false
  userStore.login()
  router.replace('/')
}

// ===== 第三方登录 =====
function handleThirdParty(id: string) {
  if (!agreed.value) {
    errorMsg.value = '请先阅读并同意用户协议与隐私政策'
    return
  }
  errorMsg.value = ''
  successTip.value = `${thirdPartyLogins.find((t) => t.id === id)?.name} 登录演示中，已直接登录`
  setTimeout(() => {
    successTip.value = ''
    userStore.login()
    router.replace('/')
  }, 800)
}

// ===== 手机号格式化（每 3-4 位加空格）=====
function formatPhone(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`
}
function onPhoneInput(e: Event) {
  const target = e.target as HTMLInputElement
  phone.value = formatPhone(target.value)
}

// 图标映射
const thirdPartyIcons: Record<string, typeof MessageCircle> = {
  wechat: MessageCircle,
  alipay: Wallet,
  qq: MessageSquare,
  apple: Apple,
}
</script>

<template>
  <div class="login-page">
    <!-- ===== 背景：渐变网格 + 浮动叶子 ===== -->
    <div class="bg-mesh" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
    </div>
    <div class="leaves" aria-hidden="true">
      <Leaf v-for="i in 7" :key="i" :class="`leaf leaf-${i}`" :size="i % 2 ? 18 : 14" />
    </div>

    <!-- ===== 顶部品牌区 ===== -->
    <header class="brand-area">
      <div class="logo-wrap">
        <div class="logo-ring">
          <svg viewBox="0 0 64 64" class="logo-svg" aria-hidden="true">
            <!-- 光晕 -->
            <circle cx="32" cy="32" r="30" fill="url(#haloGrad)" opacity="0.5" />
            <!-- 树冠：三层渐变圆形 -->
            <circle cx="32" cy="20" r="12" fill="url(#crownGrad)" />
            <circle cx="20" cy="29" r="8" fill="url(#crownGrad)" opacity="0.9" />
            <circle cx="44" cy="29" r="8" fill="url(#crownGrad)" opacity="0.9" />
            <!-- 树干 -->
            <path d="M29 30 L29 50 L35 50 L35 30 Z" fill="#3E9A80" />
            <!-- 根部 -->
            <path d="M21 50 Q32 54 43 50" stroke="#3E9A80" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <!-- 心形点缀 -->
            <path d="M32 14 C30 11.5 27 12 27 15 C27 17.5 32 20.5 32 20.5 C32 20.5 37 17.5 37 15 C37 12 34 11.5 32 14 Z" fill="#fff" opacity="0.95" />
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7DCEAF" />
                <stop offset="100%" stop-color="#3E9A80" />
              </linearGradient>
              <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#B8E5D4" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#B8E5D4" stop-opacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-glow" aria-hidden="true"></span>
      </div>
      <h1 class="brand-name">LifeTree<span class="dash">-</span>AI</h1>
      <p class="brand-slogan">智能养老 · 健康相伴 · 生命如树</p>

      <!-- 信任指标 -->
      <div class="trust-row">
        <span class="trust-item">
          <ShieldCheck :size="14" /> 银行级加密
        </span>
        <span class="trust-divider">·</span>
        <span class="trust-item">
          <HeartPulse :size="14" /> 已服务 12 万+ 长者家庭
        </span>
      </div>
    </header>

    <!-- ===== 登录卡片 ===== -->
    <section class="login-card">
      <!-- Tab 切换 -->
      <div class="tab-bar">
        <button
          class="tab"
          :class="{ active: loginType === 'sms' }"
          @click="switchLoginType('sms')"
        >
          验证码登录
          <span class="tab-indicator" v-if="loginType === 'sms'"></span>
        </button>
        <button
          class="tab"
          :class="{ active: loginType === 'password' }"
          @click="switchLoginType('password')"
        >
          密码登录
          <span class="tab-indicator" v-if="loginType === 'password'"></span>
        </button>
      </div>

      <!-- 手机号输入（仅验证码登录显示） -->
      <div v-if="loginType === 'sms'" class="input-group">
        <div class="input-prefix">
          <Phone :size="18" />
        </div>
        <div class="phone-wrap">
          <span class="country-code">+86</span>
          <span class="code-divider"></span>
          <input
            class="text-input"
            type="tel"
            maxlength="13"
            placeholder="请输入手机号"
            :value="phone"
            @input="onPhoneInput"
            inputmode="numeric"
          />
        </div>
      </div>

      <!-- 验证码输入 -->
      <div v-if="loginType === 'sms'" class="input-group">
        <div class="input-prefix">
          <ShieldCheck :size="18" />
        </div>
        <input
          class="text-input code-input"
          type="text"
          maxlength="6"
          placeholder="请输入验证码"
          v-model="smsCode"
          inputmode="numeric"
        />
        <button
          class="code-btn"
          :disabled="countdown > 0"
          @click="sendSmsCode"
        >
          {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
        </button>
      </div>

      <!-- 用户名输入（仅密码登录显示） -->
      <div v-if="loginType === 'password'" class="input-group">
        <div class="input-prefix">
          <User :size="18" />
        </div>
        <input
          class="text-input"
          type="text"
          placeholder="请输入用户名"
          v-model="username"
          @keyup.enter="handleLogin"
          autocomplete="username"
        />
      </div>

      <!-- 密码输入 -->
      <div v-if="loginType === 'password'" class="input-group">
        <div class="input-prefix">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <input
          class="text-input"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入密码（不少于 6 位）"
          v-model="password"
          @keyup.enter="handleLogin"
          autocomplete="current-password"
        />
        <button
          class="eye-btn"
          type="button"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? '隐藏密码' : '显示密码'"
        >
          <Eye v-if="showPassword" :size="18" />
          <EyeOff v-else :size="18" />
        </button>
      </div>

      <!-- 错误 / 成功提示 -->
      <transition name="fade-slide">
        <div v-if="errorMsg" class="tip tip-error">
          <AlertCircle :size="14" />
          <span>{{ errorMsg }}</span>
        </div>
        <div v-else-if="successTip" class="tip tip-success">
          <Check :size="14" />
          <span>{{ successTip }}</span>
        </div>
      </transition>

      <!-- 登录按钮 -->
      <button
        class="submit-btn"
        :class="{ disabled: !canSubmit || loading }"
        :disabled="loading"
        @click="handleLogin"
      >
        <Loader2 v-if="loading" :size="20" class="spin" />
        <span v-else>登 录</span>
      </button>

      <!-- 辅助链接 -->
      <div class="aux-row">
        <button class="link-btn" @click="showAgreement = 'user'">忘记密码？</button>
        <span class="aux-divider">|</span>
        <button class="link-btn">新用户注册</button>
      </div>

      <!-- 协议同意 -->
      <label class="agreement" :class="{ checked: agreed }">
        <span class="checkbox" @click.prevent="agreed = !agreed">
          <Check v-if="agreed" :size="12" />
        </span>
        <span class="agreement-text">
          我已阅读并同意
          <a class="agreement-link" @click.prevent="showAgreement = 'user'">《用户协议》</a>
          与
          <a class="agreement-link" @click.prevent="showAgreement = 'privacy'">《隐私政策》</a>
        </span>
      </label>
    </section>

    <!-- ===== 第三方登录 ===== -->
    <footer class="third-party">
      <div class="divider">
        <span class="divider-line"></span>
        <span class="divider-text">其他登录方式</span>
        <span class="divider-line"></span>
      </div>
      <div class="third-list">
        <button
          v-for="item in thirdPartyLogins"
          :key="item.id"
          class="third-item"
          :aria-label="`使用${item.name}登录`"
          @click="handleThirdParty(item.id)"
        >
          <span
            class="third-icon"
            :style="{ '--brand-color': item.color } as Record<string, string>"
          >
            <component :is="thirdPartyIcons[item.id]" :size="22" />
          </span>
          <span class="third-name">{{ item.name }}</span>
        </button>
      </div>

      <p class="copyright">
        © 2026 LifeTree-AI · 让科技温暖每一位长者
      </p>
    </footer>

    <!-- ===== 协议弹窗 ===== -->
    <transition name="fade">
      <div v-if="showAgreement" class="modal-mask" @click.self="showAgreement = null">
        <div class="modal-card">
          <header class="modal-header">
            <h3>{{ showAgreement === 'user' ? '用户协议' : '隐私政策' }}</h3>
            <button class="modal-close" @click="showAgreement = null" aria-label="关闭">×</button>
          </header>
          <div class="modal-body">
            <template v-if="showAgreement === 'user'">
              <p><strong>欢迎您使用 LifeTree-AI 智能养老服务平台。</strong></p>
              <p>本协议是您与 LifeTree-AI 之间关于使用本平台服务所订立的契约。使用本平台服务即视为您已阅读并同意本协议全部条款。</p>
              <p><strong>一、服务内容</strong></p>
              <p>本平台为长者及其家庭提供 AI 健康管理、智能陪伴、紧急呼叫、居家服务预约、社区活动等综合养老服务。</p>
              <p><strong>二、用户责任</strong></p>
              <p>您应保证注册信息真实有效，妥善保管账号密码，不得将账号转让或出借给他人使用。使用本平台服务时应遵守法律法规及公序良俗。</p>
              <p><strong>三、服务变更</strong></p>
              <p>本平台有权根据运营情况对服务内容进行调整，并将通过应用内通知或短信方式告知您。</p>
              <p><strong>四、免责声明</strong></p>
              <p>本平台提供的健康建议、AI 问诊结果仅供参考，不能替代专业医疗诊断。如出现紧急健康状况，请立即拨打 120 或前往医院就诊。</p>
            </template>
            <template v-else>
              <p><strong>我们深知个人信息对您的重要性。</strong></p>
              <p>本政策将向您说明我们如何收集、使用、存储和保护您的个人信息。我们严格遵循《个人信息保护法》等相关法律法规。</p>
              <p><strong>一、信息收集</strong></p>
              <p>我们仅收集为提供服务所必需的信息，包括手机号码、健康数据（由您主动上传）、设备信息等。</p>
              <p><strong>二、信息使用</strong></p>
              <p>您的信息仅用于提供养老服务、健康监测、紧急救援、服务改进等目的，未经您同意不会用于其他用途。</p>
              <p><strong>三、信息保护</strong></p>
              <p>我们采用银行级 SSL 加密传输、数据脱敏存储、访问权限控制等多重技术手段保护您的信息安全。</p>
              <p><strong>四、信息删除</strong></p>
              <p>您有权随时申请查看、更正或删除您的个人信息，请联系客服 400-888-XXXX。</p>
            </template>
          </div>
          <footer class="modal-footer">
            <button class="modal-btn" @click="showAgreement = null">关闭</button>
            <button class="modal-btn primary" @click="agreed = true; showAgreement = null">已阅读并同意</button>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============ 页面容器 ============ */
.login-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 0 24px 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(120% 60% at 50% 0%, rgba(184, 229, 212, 0.35) 0%, transparent 60%),
    linear-gradient(180deg, #FBFAF8 0%, #F4F0EA 100%);
  font-family: var(--font-body);
}

/* ============ 背景：渐变网格 ============ */
.bg-mesh {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  animation: floatBlob 18s ease-in-out infinite;
}
.blob-1 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, #7DCEAF 0%, transparent 70%);
  top: -80px; left: -60px;
}
.blob-2 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, #E8B87C 0%, transparent 70%);
  top: 120px; right: -80px;
  animation-delay: -4s;
}
.blob-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, #9CC8E5 0%, transparent 70%);
  bottom: 200px; left: -60px;
  animation-delay: -8s;
}
.blob-4 {
  width: 240px; height: 240px;
  background: radial-gradient(circle, #B8E5D4 0%, transparent 70%);
  bottom: -60px; right: -40px;
  animation-delay: -12s;
}
@keyframes floatBlob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -30px) scale(1.05); }
  66% { transform: translate(-15px, 20px) scale(0.95); }
}

/* ============ 浮动叶子 ============ */
.leaves {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.leaf {
  position: absolute;
  color: rgba(91, 184, 158, 0.35);
  animation: leafFloat 14s linear infinite;
}
.leaf-1 { top: 12%; left: 8%; animation-duration: 16s; }
.leaf-2 { top: 28%; right: 12%; animation-duration: 18s; animation-delay: -3s; color: rgba(232, 184, 124, 0.35); }
.leaf-3 { top: 45%; left: 6%; animation-duration: 20s; animation-delay: -6s; }
.leaf-4 { top: 62%; right: 10%; animation-duration: 15s; animation-delay: -9s; color: rgba(111, 177, 217, 0.35); }
.leaf-5 { top: 78%; left: 14%; animation-duration: 17s; animation-delay: -2s; }
.leaf-6 { top: 88%; right: 18%; animation-duration: 19s; animation-delay: -7s; color: rgba(232, 184, 124, 0.3); }
.leaf-7 { top: 35%; left: 50%; animation-duration: 22s; animation-delay: -10s; }
@keyframes leafFloat {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-40px) rotate(360deg); opacity: 0; }
}

/* ============ 顶部品牌区 ============ */
.brand-area {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 56px 0 28px;
}
.logo-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.logo-ring {
  position: relative;
  z-index: 2;
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 24px rgba(91, 184, 158, 0.2),
    0 2px 8px rgba(45, 52, 54, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  animation: logoFloat 4s ease-in-out infinite;
}
.logo-svg {
  width: 56px;
  height: 56px;
}
.logo-glow {
  position: absolute;
  z-index: 1;
  inset: -8px;
  border-radius: 32px;
  background: radial-gradient(circle, rgba(125, 206, 175, 0.4) 0%, transparent 70%);
  filter: blur(12px);
  animation: glowPulse 3s ease-in-out infinite;
}
@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
}
.brand-name {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #3E9A80 0%, #2D7A64 60%, #4A8FB5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  line-height: 1.2;
}
.brand-name .dash {
  font-weight: 400;
  margin: 0 1px;
}
.brand-slogan {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
  margin-bottom: 14px;
}
.trust-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}
.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
}
.trust-item :deep(svg) {
  color: var(--color-brand);
}
.trust-divider {
  color: var(--color-text-tertiary);
  opacity: 0.6;
}

/* ============ 登录卡片 ============ */
.login-card {
  position: relative;
  z-index: 2;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 22px 20px 18px;
  box-shadow:
    0 12px 40px rgba(45, 52, 54, 0.08),
    0 4px 16px rgba(91, 184, 158, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* ============ Tab 切换 ============ */
.tab-bar {
  display: flex;
  background: rgba(244, 240, 234, 0.6);
  border-radius: var(--radius-md);
  padding: 4px;
  margin-bottom: 18px;
  position: relative;
}
.tab {
  flex: 1;
  position: relative;
  padding: 10px 0;
  background: transparent;
  border: none;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 12px;
  transition: all var(--transition-fast);
  font-family: inherit;
}
.tab.active {
  color: var(--color-brand-darker);
  background: #fff;
  box-shadow:
    0 2px 8px rgba(45, 52, 54, 0.06),
    0 1px 2px rgba(91, 184, 158, 0.1);
  font-weight: 600;
}
.tab-indicator {
  display: none;
}

/* ============ 输入框组 ============ */
.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px solid rgba(229, 233, 237, 0.8);
  border-radius: var(--radius-md);
  padding: 0 14px;
  height: 52px;
  margin-bottom: 12px;
  transition: all var(--transition-fast);
}
.input-group:focus-within {
  border-color: var(--color-brand);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(91, 184, 158, 0.12);
}
.input-prefix {
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}
.input-group:focus-within .input-prefix {
  color: var(--color-brand);
}
.phone-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
}
.country-code {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
.code-divider {
  width: 1px;
  height: 16px;
  background: var(--color-border-solid);
}
.text-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  font-family: inherit;
  height: 100%;
  min-width: 0;
}
.text-input::placeholder {
  color: var(--color-text-tertiary);
}
.code-input {
  letter-spacing: 2px;
  font-weight: 600;
}
.eye-btn {
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
  flex-shrink: 0;
}
.eye-btn:hover {
  color: var(--color-brand);
}
.code-btn {
  flex-shrink: 0;
  background: rgba(91, 184, 158, 0.1);
  border: 1px solid rgba(91, 184, 158, 0.3);
  color: var(--color-brand-darker);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
  white-space: nowrap;
}
.code-btn:hover:not(:disabled) {
  background: rgba(91, 184, 158, 0.18);
  transform: translateY(-1px);
}
.code-btn:disabled {
  color: var(--color-text-tertiary);
  background: rgba(244, 240, 234, 0.6);
  border-color: var(--color-border-solid);
  cursor: not-allowed;
}

/* ============ 提示信息 ============ */
.tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}
.tip-error {
  color: var(--state-error);
  background: rgba(212, 107, 107, 0.08);
}
.tip-success {
  color: var(--color-brand-darker);
  background: rgba(91, 184, 158, 0.1);
}
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all var(--transition-fast);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ============ 登录按钮 ============ */
.submit-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #7DCEAF 0%, #5BB89E 50%, #3E9A80 100%);
  background-size: 200% 200%;
  color: #fff;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: 4px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 8px 20px rgba(91, 184, 158, 0.35),
    0 2px 6px rgba(62, 154, 128, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all var(--transition-normal);
}
.submit-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}
.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  background-position: 100% 100%;
  box-shadow:
    0 12px 28px rgba(91, 184, 158, 0.45),
    0 4px 10px rgba(62, 154, 128, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.submit-btn:hover:not(.disabled)::before {
  left: 100%;
}
.submit-btn:active:not(.disabled) {
  transform: translateY(0);
}
.submit-btn.disabled {
  background: linear-gradient(135deg, #B8E5D4, #9CC8E5);
  cursor: not-allowed;
  box-shadow: 0 4px 12px rgba(45, 52, 54, 0.08);
  opacity: 0.75;
}
.spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============ 辅助链接 ============ */
.aux-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.link-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.84rem;
  cursor: pointer;
  padding: 4px;
  transition: color var(--transition-fast);
  font-family: inherit;
}
.link-btn:hover {
  color: var(--color-brand-darker);
}
.aux-divider {
  color: var(--color-text-tertiary);
  opacity: 0.5;
}

/* ============ 协议同意 ============ */
.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.checkbox {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid var(--color-border-solid);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all var(--transition-fast);
  margin-top: 1px;
}
.checkbox :deep(svg) {
  stroke-width: 3;
}
.agreement.checked .checkbox {
  background: var(--color-brand);
  border-color: var(--color-brand);
}
.agreement-text {
  font-size: 0.76rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.agreement-link {
  color: var(--color-brand-darker);
  text-decoration: none;
  cursor: pointer;
}
.agreement-link:hover {
  text-decoration: underline;
}

/* ============ 第三方登录 ============ */
.third-party {
  position: relative;
  z-index: 2;
  margin-top: 28px;
}
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-solid), transparent);
}
.divider-text {
  font-size: 0.76rem;
  color: var(--color-text-tertiary);
  letter-spacing: 1px;
}
.third-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}
.third-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: transform var(--transition-fast);
}
.third-item:hover {
  transform: translateY(-3px);
}
.third-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-color, #5BB89E);
  box-shadow:
    0 4px 12px rgba(45, 52, 54, 0.08),
    0 1px 3px rgba(45, 52, 54, 0.04);
  transition: all var(--transition-fast);
}
.third-item:hover .third-icon {
  box-shadow:
    0 8px 20px rgba(45, 52, 54, 0.12),
    0 0 0 4px var(--glass-bg);
}
.third-name {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
}
.copyright {
  text-align: center;
  font-size: 0.72rem;
  color: var(--color-text-tertiary);
  letter-spacing: 0.5px;
}

/* ============ 协议弹窗 ============ */
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(45, 52, 54, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.modal-card {
  width: 100%;
  max-width: 380px;
  max-height: 80vh;
  background: #fff;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 52, 54, 0.25);
  animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-solid);
}
.modal-header h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-display);
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: var(--color-text-tertiary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-fast);
  font-family: inherit;
  line-height: 1;
}
.modal-close:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  font-size: 0.84rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
}
.modal-body p {
  margin-bottom: 10px;
}
.modal-body strong {
  color: var(--color-text-primary);
  font-weight: 600;
}
.modal-footer {
  display: flex;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border-solid);
}
.modal-btn {
  flex: 1;
  height: 42px;
  border: 1px solid var(--color-border-solid);
  background: #fff;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition-fast);
}
.modal-btn:hover {
  background: var(--color-bg-secondary);
}
.modal-btn.primary {
  background: linear-gradient(135deg, #5BB89E, #3E9A80);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(91, 184, 158, 0.3);
}
.modal-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(91, 184, 158, 0.4);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity var(--transition-fast);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ============ 适配大屏 / 安全区 ============ */
@media (min-height: 760px) {
  .brand-area { padding-top: 72px; }
}
@supports (padding: env(safe-area-inset-bottom)) {
  .login-page {
    padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
