// ===== Mock 数据定义 =====
// 图标字段统一使用 lucide 图标名称(kebab-case)，配合 AppIcon 组件渲染

// 用户信息
export const userProfile = {
  name: '王秀兰',
  id: 'LT20260001',
  avatar: 'circle-user',
  healthScore: 86,
  memberLevel: '黄金树',
  riskLevel: '低风险' as const,
}

// 问候信息
export const greeting = {
  title: '早上好，王奶奶',
  subtitle: '今天天气晴朗，适合出去走走',
  date: '7月15日 周三',
  lunar: '六月初一',
  temp: '26°C',
  currentTime: '08:30',
  // 节气信息
  solarTerm: '小暑',
  nextSolarTerm: '大暑',
  nextSolarTermDate: '07月22日',
  daysToNextTerm: 7,
  weatherIcon: 'sun',
  weatherText: '晴朗',
  airQuality: '良',
  // 完整阳历日期
  fullDate: '2026年7月15日',
  weekday: '星期三',
}

// 首页健康速览
export const quickHealth = [
  { icon: 'heart-pulse', label: '心率', value: '72', unit: 'bpm', color: 'rgba(91,184,158,0.15)' },
  { icon: 'droplet', label: '血压', value: '128/82', unit: 'mmHg', color: 'rgba(111,177,217,0.15)' },
  { icon: 'droplets', label: '血氧', value: '98', unit: '%', color: 'rgba(91,184,158,0.15)' },
  { icon: 'thermometer', label: '体温', value: '36.5', unit: '°C', color: 'rgba(253,101,133,0.15)' },
  { icon: 'moon', label: '睡眠时长', value: '7.2', unit: '小时', color: 'rgba(111,177,217,0.15)' },
  { icon: 'footprints', label: '今日步数', value: '3,280', unit: '步', color: 'rgba(232,184,124,0.15)' },
]

// 今日规划（首页简版）
export const todayPlan = [
  { time: '07:00', icon: 'sun', desc: '起床晒太阳' },
  { time: '07:30', icon: 'pill', desc: '吃降压药' },
  { time: '09:30', icon: 'footprints', desc: '小区散步 3000步' },
  { time: '14:00', icon: 'drama', desc: '京剧票友会' },
]

// 服务入口
export const services = [
  { id: 'health', icon: 'heart-pulse', title: 'AI 健康', desc: '健康档案、风险评分、用药提醒', route: '/health' },
  { id: 'companion', icon: 'bot', title: '小康陪伴', desc: '小康管家、聊天、一句话搞定', route: '/companion' },
  { id: 'learn', icon: 'book-open', title: '乐活天地', desc: '听书、课程、养生知识', route: '/learn' },
  { id: 'diagnosis', icon: 'stethoscope', title: 'AI 问诊', desc: '智能问诊、用药咨询', route: '/health' },
  { id: 'community', icon: 'users', title: '社区圈子', desc: '兴趣圈、线下约伴交流', route: '/learn?section=community' },
  { id: 'family', icon: 'school', title: '老年课堂', desc: '智能手机、书法绘画、养生', route: '/learn?section=classroom' },
]

// === AI 健康页 ===
export const healthReport = '王奶奶今日健康状况良好。血压略偏高，建议减少盐分摄入。步数目标完成65%，建议下午再散步30分钟。'

export const vitals = [
  { icon: 'heart-pulse', label: '心率', value: '72', unit: 'bpm', trend: 'normal' as const, trendText: '正常', trendIcon: 'arrow-down' },
  { icon: 'droplet', label: '血压', value: '128/82', unit: 'mmHg', trend: 'warning' as const, trendText: '偏高', trendIcon: 'arrow-right' },
  { icon: 'droplets', label: '血氧', value: '98%', unit: '', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
  { icon: 'thermometer', label: '体温', value: '36.5', unit: '°C', trend: 'normal' as const, trendText: '正常', trendIcon: 'check' },
  { icon: 'moon', label: '睡眠时长', value: '7.2', unit: '小时', trend: 'normal' as const, trendText: '达标', trendIcon: 'check' },
  { icon: 'bed-double', label: '睡眠质量', value: '良', unit: '', trend: 'warning' as const, trendText: '一般', trendIcon: 'arrow-right' },
]

// 风险守护：8项评分（点击查看详情+建议+小康连接）
export const riskGuardScores = [
  {
    key: 'fall',
    name: '跌倒风险',
    icon: 'person-standing',
    score: 72,
    level: 'high' as const,
    summary: '跌倒风险较高',
    details: '近30天检测到3次夜间起身活动异常，平衡能力测试评分偏低。居家环境评估显示卫生间缺少扶手。',
    advice: '①卫生间安装防滑扶手和防滑垫；②起身遵循"30秒原则"——先坐30秒再站起；③穿防滑鞋，避免穿拖鞋；④夜间保留小夜灯；⑤规律进行下肢力量训练，如靠墙静蹲。',
  },
  {
    key: 'emotion',
    name: '情绪状态',
    icon: 'smile',
    score: 85,
    level: 'low' as const,
    summary: '情绪状态良好',
    details: '近期情绪监测平稳，社交活动频率正常（每周3-4次），睡眠规律，无明显焦虑抑郁倾向。',
    advice: '继续保持积极的社交活动；多参加社区兴趣圈子；每天保持30分钟以上户外活动；与家人保持定期联系。',
  },
  {
    key: 'cognition',
    name: '认知状态',
    icon: 'brain',
    score: 88,
    level: 'low' as const,
    summary: '认知功能正常',
    details: 'MMSE量表评分28/30，记忆力和定向力正常。近期认知训练完成率90%，反应速度稳定。',
    advice: '坚持每天15分钟认知训练；多阅读、下棋、学习新技能；保持充足睡眠有助于大脑修复；适当补充Omega-3脂肪酸。',
  },
  {
    key: 'bp',
    name: '血压情况',
    icon: 'droplet',
    score: 68,
    level: 'mid' as const,
    summary: '血压控制一般',
    details: '近7天平均血压128/82mmHg，收缩压略偏高。晨起血压波动较大（最高145/88），需关注。',
    advice: '①低盐饮食，每日盐摄入<5g；②按时服用降压药，不自行停药；③定期监测血压，记录晨起和睡前数值；④控制体重，适度运动；⑤避免情绪激动和过度劳累。',
  },
  {
    key: 'sleep',
    name: '睡眠状态',
    icon: 'moon',
    score: 65,
    level: 'mid' as const,
    summary: '睡眠质量待改善',
    details: '近7天平均睡眠时长7.2小时，但深睡占比偏低（18%），夜间觉醒2-3次。入睡时间偏晚（23:30后）。',
    advice: '①固定就寝时间，建议22:00前入睡；②睡前1小时避免使用手机；③睡前避免饮茶、咖啡；④白天午睡不超过30分钟；⑤营造安静、黑暗的睡眠环境；⑥睡前可泡脚或听轻音乐。',
  },
  {
    key: 'glucose',
    name: '血糖风险',
    icon: 'candy',
    score: 70,
    level: 'mid' as const,
    summary: '血糖控制尚可',
    details: '空腹血糖6.8mmol/L（正常<6.1），餐后2小时血糖9.2mmol/L。糖化血红蛋白6.2%，处于糖尿病前期。',
    advice: '①控制主食量，每餐不超过2两；②少食多餐，避免暴饮暴食；③选择低GI食物，如燕麦、糙米；④饭后散步30分钟；⑤定期监测血糖，按时服用降糖药。',
  },
  {
    key: 'lipid',
    name: '血脂风险',
    icon: 'droplets',
    score: 78,
    level: 'low' as const,
    summary: '血脂基本正常',
    details: '总胆固醇5.2mmol/L，低密度脂蛋白3.1mmol/L，高密度脂蛋白1.4mmol/L，甘油三酯1.6mmol/L。各项指标接近正常上限。',
    advice: '继续保持低脂饮食；多吃深海鱼、坚果等富含不饱和脂肪酸的食物；适量运动；定期复查血脂。',
  },
  {
    key: 'anxiety',
    name: '焦虑倾向',
    icon: 'cloud-rain',
    score: 82,
    level: 'low' as const,
    summary: '无明显焦虑倾向',
    details: 'GAD-7量表评分4分（<5为正常范围）。近期生活事件评估无重大应激源，家庭支持良好。',
    advice: '保持规律作息和适量运动；学习放松技巧如深呼吸、冥想；多与家人朋友交流；如出现持续焦虑可联系小康寻求帮助。',
  },
]

export const risks = [
  { name: '心血管', level: 'low' as const, dot: 'green', advice: '' },
  { name: '脑卒中', level: 'low' as const, dot: 'green', advice: '' },
  { name: '跌倒', level: 'high' as const, dot: 'red', advice: '居家安装扶手、防滑垫；起身先坐30秒；穿防滑鞋；避免夜间独自如厕。' },
  { name: '糖尿病', level: 'mid' as const, dot: 'gold', advice: '控制主食量，少食多餐；定期监测血糖；适量运动，饭后散步30分钟。' },
  { name: '骨质疏松', level: 'high' as const, dot: 'red', advice: '补充钙片和维生素D；多晒太阳；做负重运动如散步；居家防跌倒，避免提重物。' },
  { name: '营养', level: 'low' as const, dot: 'green', advice: '' },
  { name: '心理', level: 'low' as const, dot: 'green', advice: '' },
  { name: '睡眠', level: 'mid' as const, dot: 'gold', advice: '规律作息，固定就寝时间；睡前避免饮茶咖啡；白天适量运动，午睡不超过30分钟。' },
]

export const medications = [
  { time: '07:30', name: '降压药 1片', detail: '饭后服用', status: 'taken' as const, statusText: '已服用', icon: 'check-circle' },
  { time: '08:00', name: '降糖药 1片', detail: '饭前30分钟', status: 'taken' as const, statusText: '已服用', icon: 'check-circle' },
  { time: '12:30', name: '消炎药 1片', detail: '饭后服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
  { time: '19:00', name: '钙片 2片', detail: '饭后服用', status: 'pending' as const, statusText: '待服用', icon: 'clock' },
]

export const healthTips = [
  { icon: 'droplets', title: '补水防中暑', desc: '每天饮水1500-2000ml，少量多次，避免猛喝冰水' },
  { icon: 'carrot', title: '饮食宜清淡', desc: '多吃苦瓜、黄瓜、西瓜等清热食材，少油少盐' },
  { icon: 'sun', title: '晨练趁清凉', desc: '建议6-7点出门，避免烈日下活动，外出戴帽防晒' },
]

export const healthTip = '夏季养生三注意：\n补水防中暑，每天饮水1500-2000ml，少量多次，避免猛喝冰水；\n饮食宜清淡，多吃苦瓜、黄瓜、西瓜等清热食材，少油少盐；\n晨练趁清凉，建议6-7点出门，避免烈日下活动，外出戴帽防晒。'

// === AI 陪伴页 ===
export const companionAvatar = {
  name: '小康',
  status: '在线 · 随时陪伴',
  greeting: '王奶奶，今天心情怎么样？',
}

export const initialChatMessages = [
  { id: 1, role: 'ai' as const, text: '早上好王奶奶！今天天气真不错，阳光明媚的。您今天有什么打算吗？' },
  { id: 2, role: 'user' as const, text: '小康，我今天想去公园走走' },
  { id: 3, role: 'ai' as const, text: '好呀！今天最高温度28度，很适合出门。记得带好水杯，涂防晒霜。您小区门口的公交站有去翠湖公园的车，3站就到了。需要我帮您查一下发车时间吗？' },
  { id: 4, role: 'user' as const, text: '好的，帮我查一下' },
  { id: 5, role: 'ai' as const, text: '查到了！最近一班是9:15，建议您9:00出门，慢慢走过去刚刚好。我已经把路线发到您手机上了。' },
]

// 社区圈子：围绕周围小区，因共同爱好加入圈子，约线下交流
export const communityCircles = [
  { icon: 'drama', title: '京剧票友圈', desc: '翠湖小区 · 周三周六活动', members: 28, live: true, distance: '0.3km' },
  { icon: 'activity', title: '太极养生圈', desc: '晨练站桩，花园集合', members: 45, live: true, distance: '0.5km' },
  { icon: 'music', title: '广场舞圈', desc: '每晚7点，中心广场', members: 62, live: false, distance: '0.8km' },
  { icon: 'target', title: '象棋棋友圈', desc: '社区活动室，下午对弈', members: 18, live: false, distance: '0.2km' },
  { icon: 'footprints', title: '逛公园圈', desc: '结伴逛公园，拍照赏花', members: 35, live: false, distance: '1.2km' },
  { icon: 'leaf', title: '园艺种植圈', desc: '阳台种菜，经验交流', members: 22, live: false, distance: '0.6km' },
]

// 快捷功能（从智能体合并）
export const quickActions = [
  { icon: 'hospital', label: '挂号就诊' },
  { icon: 'pill', label: '用药提醒' },
  { icon: 'car', label: '叫车出行' },
  { icon: 'phone', label: '打电话给子女' },
  { icon: 'shopping-cart', label: '买东西' },
  { icon: 'alarm-clock', label: '设置提醒' },
]

// 今日日程（从智能体合并）
export const todaySchedule = [
  { time: '07:00', icon: 'sun', desc: '起床晒太阳 20分钟', status: 'completed' as const },
  { time: '07:30', icon: 'pill', desc: '吃降压药 (饭后)', status: 'completed' as const },
  { time: '08:00', icon: 'coffee', desc: '早餐建议：小米粥+水煮蛋', status: 'current' as const },
  { time: '09:00', icon: 'phone', desc: '给女儿小芳打电话', status: 'upcoming' as const },
  { time: '09:30', icon: 'footprints', desc: '小区散步 3000步', status: 'upcoming' as const },
  { time: '10:30', icon: 'book-open', desc: '国学课：《论语》第二讲', status: 'upcoming' as const },
  { time: '14:00', icon: 'drama', desc: '京剧票友会', status: 'upcoming' as const },
  { time: '16:00', icon: 'activity', desc: '站桩练习 15分钟', status: 'upcoming' as const },
  { time: '21:00', icon: 'moon', desc: '早点休息', status: 'upcoming' as const },
]

// 模拟 AI 回复
export const aiReplies = [
  '王奶奶说得对！您真有道理。',
  '好的王奶奶，我记下了，会帮您安排好的。',
  '王奶奶您开心就好！还有什么需要我帮忙的吗？',
  '收到！我马上帮您处理，请稍等一下哦。',
  '王奶奶，今天天气不错，要不要出去走走呀？',
  '没问题！我已经帮您设置好了提醒。',
  '您说得对，健康最重要！记得按时吃药哦。',
  '王奶奶，您今天气色真好！',
]

// 护理模式：小康陪护头像信息
export const nurseCompanionAvatar = {
  name: '小康',
  status: '在线 · 护理助手',
  greeting: '小周，今天有6位长者待巡访，需要了解哪位的情况？',
}

// 护理模式：小康陪护初始对话（护理人员与小康）
export const nurseInitialChatMessages = [
  { id: 1, role: 'ai' as const, text: '小周您好！我是小康，您的护理助手。今天共有6位长者待巡访，随时可以帮您了解各位的近况。请问想查看哪位长者的情况？' },
  { id: 2, role: 'user' as const, text: '王奶奶最近情况如何？有没有按时吃药？' },
  { id: 3, role: 'ai' as const, text: '王奶奶（王秀兰）近3天血压平稳，128/82mmHg，降压药每日7:30按时服用，已确认。今晨体温36.5°C，精神状态不错。她提到膝盖有点疼，建议10:30上门时顺便做一次康复评估。' },
  { id: 4, role: 'user' as const, text: '李大爷有没有遛弯？昨天睡眠怎么样？' },
  { id: 5, role: 'ai' as const, text: '李大爷（李建国）今早7:40在小区花园散步约20分钟，步数1500步。昨夜睡眠5.1小时，比前天少了1.2小时，中途醒来2次。建议今日电话回访了解一下，必要时调整晚间作息。' },
]

// 护理模式：AI回复
export const nurseAiReplies = [
  '根据记录，该长者今日各项指标正常，请放心。',
  '好的，我已帮您更新护理记录，随时可以查看。',
  '该长者近期状态稳定，建议继续当前护理方案。',
  '收到！我会持续关注这位长者的健康数据变化。',
  '已查到相关信息，如有异常我会第一时间提醒您。',
  '建议今日增加一次巡访，确认长者状况。',
  '护理记录已同步，交班时可以查看完整报告。',
  '该长者今日三次服药均已按时确认，用药记录完整。',
  '我已将这位长者列入今日重点关注，有变化会立即通知您。',
]

// 子女照看模式：女儿和小康的初始对话
export const daughterInitialChatMessages = [
  { id: 1, role: 'ai' as const, text: '小芳您好！我是小康，随时可以帮您了解妈妈的情况。请问想了解什么呢？' },
  { id: 2, role: 'user' as const, text: '小康，妈妈最近情况如何？' },
  { id: 3, role: 'ai' as const, text: '王奶奶最近整体状态良好！近3天血压平稳（128/82mmHg），心率72bpm正常。每天散步3000步左右，睡眠7.5小时。今早精神状态不错，和邻居聊了会天。' },
  { id: 4, role: 'user' as const, text: '有没有按时吃药？' },
  { id: 5, role: 'ai' as const, text: '降压药每日7:30按时服用，已确认。今早的钙片还未确认，我已发送提醒。本周用药依从性95%，只有周二漏服一次维生素D，已补服。' },
  { id: 6, role: 'user' as const, text: '妈妈近期心情如何？' },
  { id: 7, role: 'ai' as const, text: '王奶奶本周心情愉快！周三参加了社区广场舞活动，周五和京剧票友圈的朋友聚会。情绪评分8.5/10，比上周提升了0.5分。她提到很想您，建议本周末视频通话。' },
  { id: 8, role: 'user' as const, text: '有没有学习中医课程？和小康都聊了什么？' },
  { id: 9, role: 'ai' as const, text: '王奶奶学习了中医基础理论的"阴阳五行"章节，学时45分钟，还做了笔记！最近和我聊了：1. 询问三伏天艾灸注意事项 2. 聊了京剧《贵妃醉酒》的唱腔 3. 问了您的近况 4. 分享了她的养生药膳心得。' },
]

// 子女照看模式：AI回复
export const daughterAiReplies = [
  '妈妈今天状态不错，请放心。',
  '好的，我会持续关注妈妈的情况，有异常第一时间通知您。',
  '妈妈最近按时服药、规律作息，整体很稳定。',
  '收到！我已帮您记录，随时可以查看妈妈的历史数据。',
  '建议本周末和妈妈视频通话，她很想您。',
  '妈妈今天心情很好，参加了社区活动，还交了新朋友。',
  '已为您更新妈妈的健康日报，请查看详情。',
]

// === 智能体页 ===
export const agentDemoChat = [
  { id: 1, role: 'user' as const, text: '小康，帮我预约明天协和医院心内科的号' },
  {
    id: 2,
    role: 'ai' as const,
    text: '好的王奶奶！正在为您处理...',
    actions: [
      '已预约挂号（协和医院 · 张主任 · 9:30）',
      '已叫车：明早 8:30 出发',
      '已通知女儿小芳',
      '明早 8:00 叫您起床',
      '导航路线已发送',
    ],
  },
  { id: 3, role: 'user' as const, text: '太好了谢谢小康！' },
  { id: 4, role: 'ai' as const, text: '不客气王奶奶！记得带医保卡和检查报告，早点休息，晚安~' },
]

export const shortcuts = [
  { icon: 'hospital', label: '挂号就诊' },
  { icon: 'pill', label: '用药提醒' },
  { icon: 'car', label: '叫车出行' },
  { icon: 'phone', label: '打电话给子女' },
  { icon: 'shopping-cart', label: '买东西' },
  { icon: 'alarm-clock', label: '设置提醒' },
]

export const schedule = [
  { time: '07:00', icon: 'sun', desc: '起床晒太阳 20分钟', status: 'completed' as const },
  { time: '07:30', icon: 'pill', desc: '吃降压药 (饭后)', status: 'completed' as const },
  { time: '08:00', icon: 'coffee', desc: '早餐建议：小米粥+水煮蛋', status: 'current' as const },
  { time: '09:00', icon: 'phone', desc: '给女儿小芳打电话', status: 'upcoming' as const },
  { time: '09:30', icon: 'footprints', desc: '小区散步 3000步', status: 'upcoming' as const },
  { time: '10:30', icon: 'book-open', desc: '国学课：《论语》第二讲', status: 'upcoming' as const },
  { time: '14:00', icon: 'drama', desc: '京剧票友会', status: 'upcoming' as const },
  { time: '16:00', icon: 'activity', desc: '站桩练习 15分钟', status: 'upcoming' as const },
  { time: '21:00', icon: 'moon', desc: '早点休息', status: 'upcoming' as const },
]

export const capabilities = [
  { icon: 'mic', title: '一句话搞定', desc: '语音指令，方言识别' },
  { icon: 'link', title: '全链路打通', desc: '预约→导航→打车→提醒→通知' },
  { icon: 'users', title: '家庭联动', desc: '自动通知子女' },
  { icon: 'alarm-clock', title: '主动提醒', desc: '全程贴心陪伴' },
]

// === 学习中心页 ===
export const categories = [
  { icon: 'headphones', label: '听书' },
  { icon: 'book-open', label: '读书' },
  { icon: 'graduation', label: '课程' },
  { icon: 'tv', label: '北京卫视\n健康' },
  { icon: 'leaf', label: '中医养生' },
  { icon: 'scroll', label: '国学经典' },
  { icon: 'map-pin', label: '穴位经络' },
  { icon: 'dumbbell', label: '运动养生' },
  { icon: 'life-buoy', label: '急救知识' },
  { icon: 'school', label: '老年课堂' },
  { icon: 'stethoscope', label: '名医讲座' },
  { icon: 'palette', label: '兴趣课程' },
]

export const courses = [
  { name: '八段锦入门教学', teacher: '王老师', duration: '45分钟', students: '2.3万人已学', icon: 'activity', grad: 'teal' },
  { name: '三伏天养生指南', teacher: '李大夫', duration: '30分钟', students: '1.8万人已学', icon: 'leaf', grad: 'blue' },
  { name: '京剧入门欣赏', teacher: '张老师', duration: '60分钟', students: '9,600人已学', icon: 'drama', grad: 'gold' },
  { name: '智能手机使用技巧', teacher: '刘老师', duration: '25分钟', students: '3.1万人已学', icon: 'smartphone', grad: 'green' },
]

export const elderlyClasses = [
  { icon: 'shield-alert', name: '防诈骗教程', desc: '识别骗局、保护财产安全' },
  { icon: 'smartphone', name: '智能手机课', desc: '微信使用、视频通话、防诈骗' },
  { icon: 'palette', name: '书法绘画', desc: '毛笔入门、国画基础' },
  { icon: 'utensils', name: '烹饪美食', desc: '养生食谱、家常菜' },
  { icon: 'music', name: '运动健身', desc: '太极、八段锦、广场舞' },
  { icon: 'sprout', name: '园艺种植', desc: '阳台种菜、盆栽养护' },
  { icon: 'music', name: '音乐戏曲', desc: '京剧入门、二胡' },
  { icon: 'camera', name: '摄影技巧', desc: '手机摄影、修图入门' },
  { icon: 'laptop', name: '数字技能', desc: '短视频制作、AI工具' },
  { icon: 'leaf', name: '中医基础理论', desc: '阴阳五行、经络穴位入门' },
]

export const liveClasses = [
  { icon: 'heart-pulse', name: '跟名医学稳血压', meta: '张主任 · 2,108人观看', live: true },
  { icon: 'dumbbell', name: '每天十分钟舒展操', meta: '刘教练 · 1,576人观看', live: true },
  { icon: 'activity', name: '八段锦晨练', meta: '王老师 · 1,234人观看', live: false },
  { icon: 'leaf', name: '三伏天艾灸养生', meta: '李大夫 · 856人观看', live: false },
  { icon: 'utensils', name: '养生药膳制作', meta: '陈大厨 · 652人观看', live: false },
  { icon: 'palette', name: '国画山水入门', meta: '赵老师 · 438人观看', live: false },
]

export const learningProgress = {
  weeklyHours: 3.5,
  weeklyGoal: 5,
  percent: 70,
  learnedCourses: 12,
  streakDays: 7,
}

// === 个人中心页 ===
export const family = [
  { avatar: 'circle-user', name: '女儿小芳', bound: true, online: true },
  { avatar: 'circle-user', name: '女婿', bound: true, online: true },
  { avatar: 'circle-user', name: '孙女囡囡', bound: true, online: true },
]

export const menuGroups = [
  {
    title: '健康管理',
    items: [
      { icon: 'clipboard-list', text: '健康档案管理', badge: 0 },
      { icon: 'pill', text: '我的用药清单', badge: 0 },
      { icon: 'bar-chart', text: '健康报告', badge: 3 },
    ],
  },
  {
    title: 'AI 功能',
    items: [
      { icon: 'brain', text: 'AI 采访', badge: 0 },
      { icon: 'book-open', text: '记忆年轮', badge: 0 },
      { icon: 'mic', text: 'AI 管家设置', badge: 0 },
    ],
  },
  {
    title: '服务',
    items: [
      { icon: 'shopping-bag', text: '我的订单', badge: 0 },
      { icon: 'package', text: '服务预约记录', badge: 0 },
      { icon: 'gem', text: '会员权益', badge: 0 },
    ],
  },
  {
    title: '设置',
    items: [
      { icon: 'smartphone', text: '界面模式切换', badge: 0 },
      { icon: 'bell', text: '提醒设置', badge: 0 },
      { icon: 'lock', text: '隐私与安全', badge: 0 },
      { icon: 'settings', text: '系统设置', badge: 0 },
    ],
  },
]

export const uiModes = [
  { icon: 'smartphone', label: '普通模式' },
  { icon: 'accessibility', label: '老人模式', active: true, recommend: true },
  { icon: 'search', label: '超大字体' },
  { icon: 'contrast', label: '高对比模式' },
  { icon: 'mic', label: '语音模式' },
  { icon: 'users', label: '子女模式' },
]

export const emergencyContact = {
  name: '女儿小芳',
  phone: '138****6789',
  emergencyLine: '120',
}

// 学习中心 - 线下活动（戏曲/摄影等，可报名）
export const activities = [
  { icon: 'drama', category: '戏曲', title: '京剧名段赏析会', time: '7月18日 14:00', location: '社区文化中心三楼', members: 32, total: 50, joined: false },
  { icon: 'camera', category: '摄影', title: '公园花卉摄影采风', time: '7月19日 08:00', location: '植物园南门集合', members: 25, total: 40, joined: false },
  { icon: 'drama', category: '戏曲', title: '越剧教唱入门', time: '7月20日 09:30', location: '翠湖公园戏曲角', members: 18, total: 30, joined: false },
  { icon: 'camera', category: '摄影', title: '手机摄影技巧分享', time: '7月21日 15:00', location: '社区活动室', members: 38, total: 60, joined: true },
  { icon: 'drama', category: '戏曲', title: '黄梅戏经典选段', time: '7月22日 14:00', location: '老年大学教室', members: 22, total: 35, joined: false },
  { icon: 'camera', category: '摄影', title: '夕阳风景摄影赛', time: '7月23日 17:00', location: '湖边观景台', members: 45, total: 50, joined: false },
]

// 首页 - 居家安全检查（家庭基础设施巡检）
// status: safe 安全 / pending 待检查 / overdue 逾期
export const homeInspections = [
  { key: 'gas', icon: 'flame', name: '燃气灶具', lastDate: '2025-03-12', cycleMonths: 12, status: 'pending' as const, desc: '燃气管路、阀门、灶具老化检测' },
  { key: 'heating', icon: 'droplet', name: '暖气水管', lastDate: '2024-11-08', cycleMonths: 12, status: 'pending' as const, desc: '暖气片、水管接口渗漏检查' },
  { key: 'roof', icon: 'home', name: '房顶墙面', lastDate: '2024-05-20', cycleMonths: 24, status: 'safe' as const, desc: '房顶开裂、墙皮脱落、渗水检查' },
  { key: 'drain', icon: 'waves', name: '下水管道', lastDate: '2026-01-15', cycleMonths: 6, status: 'safe' as const, desc: '下水道堵塞、反味检查' },
  { key: 'glass', icon: 'square', name: '门窗玻璃', lastDate: '2023-08-10', cycleMonths: 24, status: 'overdue' as const, desc: '玻璃老化、门窗密封、锁具检查' },
  { key: 'electric', icon: 'zap', name: '电气线路', lastDate: '2025-06-30', cycleMonths: 12, status: 'safe' as const, desc: '漏电、插座老化、空开检查' },
  { key: 'smoke', icon: 'alert-triangle', name: '烟雾报警器', lastDate: '2026-02-28', cycleMonths: 6, status: 'safe' as const, desc: '烟感/一氧化碳报警器、电池检查' },
  { key: 'handrail', icon: 'accessibility', name: '防滑扶手', lastDate: '2025-12-05', cycleMonths: 6, status: 'pending' as const, desc: '卫生间防滑垫、扶手稳固检查' },
  { key: 'balcony', icon: 'fence', name: '阳台护栏', lastDate: '2024-09-18', cycleMonths: 24, status: 'safe' as const, desc: '护栏锈蚀、稳固性检查' },
]

// 首页 - 联系家人快捷方式
export const familyContacts = [
  { icon: 'phone', name: '女儿小芳', role: '女儿', desc: '138****6789', color: 'var(--color-brand)' },
  { icon: 'phone', name: '儿子小明', role: '儿子', desc: '139****1234', color: 'var(--color-accent2)' },
  { icon: 'phone', name: '孙女甜甜', role: '孙女', desc: '137****5678', color: 'var(--color-accent3)' },
]

// 家庭共享设置：共享人员
export const sharedMembers = [
  { name: '小芳', role: '女儿', phone: '138****6789', avatar: 'user', online: true, distance: '8.8km', location: '朝阳区望京街道', color: 'var(--color-brand)' },
  { name: '张医生', role: '家庭医生', phone: '139****2233', avatar: 'stethoscope', online: true, distance: '3.2km', location: '协和医院门诊楼', color: 'var(--color-accent2)' },
  { name: '李阿姨', role: '社区护理员', phone: '137****8899', avatar: 'heart-handshake', online: false, distance: '', location: '翠湖社区服务中心', color: 'var(--color-accent3)' },
  { name: '小明', role: '儿子', phone: '139****1234', avatar: 'user', online: true, distance: '15.6km', location: '海淀区中关村', color: 'var(--color-brand)' },
]

// 智能设备管理
export const smartDevices = [
  { key: 'bracelet', icon: 'watch', name: '生命树健康手环', online: true, abnormal: false, battery: 78, lastSync: '2分钟前', on: true },
  { key: 'sleepmat', icon: 'bed-double', name: '睡眠监测垫', online: true, abnormal: false, battery: 92, lastSync: '刚刚', on: true },
  { key: 'fallsensor', icon: 'alert-triangle', name: '客厅跌倒传感器', online: true, abnormal: true, battery: 65, lastSync: '1分钟前', on: true },
  { key: 'robotdog', icon: 'paw-print', name: '陪伴机器狗', online: true, abnormal: false, battery: 45, lastSync: '5分钟前', on: true },
  { key: 'robot', icon: 'bot', name: '家庭机器人', online: false, abnormal: false, battery: 12, lastSync: '2小时前', on: false },
  { key: 'toilet', icon: 'circle-dot', name: '智能马桶', online: true, abnormal: false, battery: 100, lastSync: '实时', on: true },
  { key: 'glasses', icon: 'eye', name: '智能眼镜', online: true, abnormal: false, battery: 58, lastSync: '3分钟前', on: true },
  { key: 'wheelchair', icon: 'accessibility', name: '智能轮椅', online: true, abnormal: false, battery: 72, lastSync: '5分钟前', on: true },
  { key: 'eyecare', icon: 'lightbulb', name: '智能护眼灯', online: true, abnormal: false, battery: 100, lastSync: '实时', on: true },
  { key: 'hairdryer', icon: 'wind', name: '智能电吹风', online: false, abnormal: false, battery: 0, lastSync: '未连接', on: false },
]

// 生活服务：安心陪诊、上门家政、长者助餐、康养商城
export const lifeServices = [
  {
    key: 'escort',
    icon: 'stethoscope',
    title: '安心陪诊',
    desc: '专业陪诊师全程陪伴就医',
    color: 'rgba(91, 184, 158, 0.15)',
    items: [
      { name: '半日陪诊（4小时）', price: 199, desc: '挂号、候诊、取药全程陪同' },
      { name: '全日陪诊（8小时）', price: 359, desc: '全天就医陪伴，含检查引导' },
      { name: '复诊陪护', price: 149, desc: '简单复诊快速陪护' },
    ],
  },
  {
    key: 'housekeeping',
    icon: 'home',
    title: '上门家政',
    desc: '保洁、收纳、做饭一键预约',
    color: 'rgba(111, 177, 217, 0.15)',
    items: [
      { name: '日常保洁（2小时）', price: 89, desc: '客厅、卧室、厨房基础清洁' },
      { name: '深度保洁（4小时）', price: 169, desc: '含油烟机、卫生间深度清洁' },
      { name: '上门做饭', price: 99, desc: '专业阿姨上门烹饪一餐' },
    ],
  },
  {
    key: 'meal',
    icon: 'utensils',
    title: '长者助餐',
    desc: '营养适老餐，送餐上门',
    color: 'rgba(232, 184, 124, 0.15)',
    items: [
      { name: '单日午餐套餐', price: 25, desc: '三菜一汤，软烂易消化' },
      { name: '一周午餐（5天）', price: 119, desc: '周一至周五送餐上门' },
      { name: '糖尿病专享餐', price: 32, desc: '低糖低脂，营养均衡' },
    ],
  },
  {
    key: 'shop',
    icon: 'shopping-bag',
    title: '康养商城',
    desc: '保健品、辅具、护理用品',
    color: 'rgba(212, 132, 168, 0.15)',
    items: [
      { name: '钙片+维生素D组合', price: 128, desc: '中老年骨骼健康套装' },
      { name: '防滑浴室地垫', price: 39, desc: '加厚防滑，居家防跌倒' },
      { name: '智能血压计', price: 269, desc: '一键测量，数据自动同步' },
    ],
  },
]
