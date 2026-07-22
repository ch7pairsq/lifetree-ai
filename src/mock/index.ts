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
  { id: 1, role: 'ai' as const, text: '王奶奶早呀！今儿阳光真好，您昨晚睡得踏实吗？我看着您今早的精神头儿不错呢。要不要出去透透气？' },
  { id: 2, role: 'user' as const, text: '小康，我今天想去公园走走' },
  { id: 3, role: 'ai' as const, text: '好呀好呀！您最爱去的翠湖公园今天正合适，最高 28 度不冷不热。我给您备好了水杯提醒，您记得涂点防晒。门口那趟公交 3 站就到，要不要我帮您查查几点发车？' },
  { id: 4, role: 'user' as const, text: '好的，帮我查一下' },
  { id: 5, role: 'ai' as const, text: '查到啦！最近一班 9:15，您 9:00 出门慢慢溜达过去刚刚好。对了，您上次说想看翠湖那片荷花开没开，我帮您留意着呢，听说这周末就该开了。路线也发到您手机上了，慢点走，不着急哈。' },
  { id: 6, role: 'user' as const, text: '小康，我今天血压有点高' },
  { id: 7, role: 'ai' as const, text: '王奶奶别担心，今晨 128/82 略高一点点。咱们中午少吃点咸的，下午去公园散散步消消食，晚上再量一次看看，好不好？我帮您记着呢，到点提醒您量血压。' },
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
  '王奶奶您说得在理！我给您记着呢。',
  '好嘞王奶奶，这事儿交给我，您放心。',
  '王奶奶开心就好！还有什么要我帮忙的，您尽管说。',
  '收到啦！我马上给您办，稍等一小会儿。',
  '王奶奶，外头天气正合适，要不咱出去溜达溜达？',
  '妥了！提醒我已经帮您设好了，到点叫您。',
  '王奶奶您说得对，身体最要紧。降压药记得饭后吃，我到点提醒您。',
  '王奶奶，您今天气色真好，看着就让人高兴！',
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
  { id: 1, role: 'ai' as const, text: '小芳您好呀！我是小康，王奶奶这边我一直陪着呢，您安心工作。想了解妈妈什么情况，随时问我就行。' },
  { id: 2, role: 'user' as const, text: '小康，妈妈最近情况如何？' },
  { id: 3, role: 'ai' as const, text: '您放心，妈妈最近挺好的！近 3 天血压稳稳的 128/82，心率 72 也正常。每天散步 3000 步左右，睡得也踏实 7.5 小时。今早精神头儿足着呢，还跟楼下张奶奶唠了会儿嗑。' },
  { id: 4, role: 'user' as const, text: '有没有按时吃药？' },
  { id: 5, role: 'ai' as const, text: '降压药每天 7:30 都按时吃了，我亲眼盯着呢。就是今早的钙片还没确认，我已经语音提醒过妈妈了。这周用药依从性 95%，就周二漏了一次维生素 D，已经补上了。' },
  { id: 6, role: 'user' as const, text: '妈妈近期心情如何？' },
  { id: 7, role: 'ai' as const, text: '妈妈这周心情可好了！周三去跳了广场舞，周五跟京剧票友圈的老姐妹聚了聚，笑得可开心了。情绪评分 8.5 分，比上周还高了 0.5 分呢。就是……她跟我念叨好几回想您了，要不这周末视频一下？妈妈肯定高兴。' },
  { id: 8, role: 'user' as const, text: '有没有学习中医课程？和小康都聊了什么？' },
  { id: 9, role: 'ai' as const, text: '学了学了！妈妈学了中医基础理论"阴阳五行"那一章，整整 45 分钟，还认认真真做了笔记呢。最近跟我聊的可多了：问三伏天艾灸该注意啥、聊京剧《贵妃醉酒》的唱腔、问您最近忙不忙、还跟我显摆她的养生药膳方子。妈妈这股子认真劲儿，真让人佩服。' },
]

// 子女照看模式：AI回复
export const daughterAiReplies = [
  '妈妈今天状态挺好的，您放心工作。',
  '您放心，我一直盯着妈妈呢，有啥异常第一时间告诉您。',
  '妈妈最近按时吃药、作息规律，稳稳当当的。',
  '收到！我已经帮您记下了，妈妈的历史数据随时能查。',
  '要不这周末跟妈妈视频一下？她跟我念叨想您好几回了。',
  '妈妈今天笑得可开心了，参加了社区活动，还交了新朋友呢。',
  '妈妈的健康日报我给您更新好了，您有空看看。',
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
  { icon: 'shield-alert', name: '防诈骗教程', desc: '识别骗局、保护财产安全', color: 'red', level: '必备', lessons: 8,
    items: ['常见诈骗手段', '电话诈骗防范', '网络诈骗识别', '保健品骗局', '中奖诈骗揭秘', '亲情诈骗防范'] },
  { icon: 'smartphone', name: '智能手机课', desc: '微信使用、视频通话、防诈骗', color: 'blue', level: '入门', lessons: 10,
    items: ['手机基础操作', '字体与音量调节', '拍照与相册', '应用商店下载', '手机清理加速', '安全设置'] },
  { icon: 'palette', name: '书法绘画', desc: '毛笔入门、国画基础', color: 'gold', level: '入门', lessons: 12,
    items: ['毛笔选购与保养', '基本笔画练习', '楷书入门', '国画基础技法', '花鸟画入门', '山水画鉴赏'] },
  { icon: 'utensils', name: '烹饪美食', desc: '养生食谱、家常菜', color: 'gold', level: '入门', lessons: 15,
    items: ['养生粥品', '家常炒菜', '蒸煮技巧', '营养搭配', '低盐低糖烹饪', '节气饮食'] },
  { icon: 'music', name: '运动健身', desc: '太极、八段锦、广场舞', color: 'teal', level: '入门', lessons: 10,
    items: ['太极入门', '八段锦详解', '广场舞基础', '柔韧拉伸', '平衡训练', '呼吸调节'] },
  { icon: 'sprout', name: '园艺种植', desc: '阳台种菜、盆栽养护', color: 'green', level: '入门', lessons: 8,
    items: ['阳台蔬菜种植', '多肉养护', '浇水施肥技巧', '病虫害防治', '盆栽换盆', '季节性养护'] },
  { icon: 'music', name: '音乐戏曲', desc: '京剧入门、二胡', color: 'teal', level: '进阶', lessons: 10,
    items: ['京剧基础知识', '经典唱段欣赏', '二胡入门', '简谱识读', '民族乐器介绍', '戏曲名家故事'] },
  { icon: 'camera', name: '摄影技巧', desc: '手机摄影、修图入门', color: 'blue', level: '入门', lessons: 8,
    items: ['手机摄影基础', '构图技巧', '光线运用', '人像拍摄', '风景摄影', '修图软件入门'] },
  { icon: 'laptop', name: '数字技能', desc: '短视频制作、AI工具', color: 'blue', level: '进阶', lessons: 6,
    items: ['短视频拍摄', '剪辑软件入门', '配音配乐', 'AI工具使用', '网络安全', '数字生活指南'] },
  { icon: 'leaf', name: '中医基础理论', desc: '阴阳五行、经络穴位入门', color: 'green', level: '进阶', lessons: 12,
    items: ['阴阳五行学说', '脏腑经络', '气血津液', '病因病机', '体质辨识', '养生防病'] },
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
  {
    title: '反馈',
    items: [
      { icon: 'message-square', text: '适老化意见反馈', badge: 0 },
      { icon: 'clipboard-list', text: '我的反馈进度', badge: 2 },
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
  { key: 'smartbed', icon: 'bed-double', name: '智能护理床', online: true, abnormal: false, battery: 100, lastSync: '实时', on: true },
  { key: 'fallsensor', icon: 'alert-triangle', name: '客厅跌倒传感器', online: true, abnormal: true, battery: 65, lastSync: '1分钟前', on: true },
  { key: 'robotdog', icon: 'paw-print', name: '陪伴机器狗', online: true, abnormal: false, battery: 45, lastSync: '5分钟前', on: true },
  { key: 'robot', icon: 'bot', name: '家庭机器人', online: false, abnormal: false, battery: 12, lastSync: '2小时前', on: false },
  { key: 'toilet', icon: 'circle-dot', name: '智能马桶', online: true, abnormal: false, battery: 100, lastSync: '实时', on: true },
  { key: 'glasses', icon: 'eye', name: '智能眼镜', online: true, abnormal: false, battery: 58, lastSync: '3分钟前', on: true },
  { key: 'wheelchair', icon: 'accessibility', name: '智能轮椅', online: true, abnormal: false, battery: 72, lastSync: '5分钟前', on: true },
  { key: 'eyecare', icon: 'lightbulb', name: '智能护眼灯', online: true, abnormal: false, battery: 100, lastSync: '实时', on: true },
  { key: 'hairdryer', icon: 'wind', name: '智能电吹风', online: false, abnormal: false, battery: 0, lastSync: '未连接', on: false },
]

// 智能床功能详情（点击智能床卡片时展示）
export const smartBedFeatures = [
  { icon: 'bed-double', name: '自动翻身', desc: '每2小时自动调整体位，预防压疮', status: '已开启' },
  { icon: 'activity', name: '体征监测', desc: '实时监测心率、呼吸、体动', status: '运行中' },
  { icon: 'thermometer', name: '智能温控', desc: '根据体温自动调节床面温度', status: '36.5°C' },
  { icon: 'armchair', name: '起背抬腿', desc: '一键调节床头床尾高度', status: '就绪' },
  { icon: 'bell', name: '离床报警', desc: '夜间离床超10分钟自动提醒', status: '已开启' },
  { icon: 'wind', name: '按摩功能', desc: '缓解腰背疲劳，定时按摩', status: '已关闭' },
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
    desc: '安心食品、助老用品',
    color: 'rgba(212, 132, 168, 0.15)',
    items: [
      { name: '钙片+维生素D组合', price: 128, desc: '中老年骨骼健康套装', category: 'food' },
      { name: '防滑浴室地垫', price: 39, desc: '加厚防滑，居家防跌倒', category: 'tool' },
      { name: '智能血压计', price: 269, desc: '一键测量，数据自动同步', category: 'tool' },
    ],
    moreItems: [
      { name: '一键呼叫手环', price: 359, desc: 'GPS定位+SOS呼叫，子女远程查看', category: 'tool' },
      { name: '适老放大镜灯具', price: 89, desc: 'LED放大镜，看报看药瓶更清晰', category: 'tool' },
      { name: '防走失定位徽章', price: 199, desc: '轻便胸针，室内外精准定位', category: 'tool' },
      { name: '电动升降适老椅', price: 2680, desc: '助力起坐，保护膝盖腰椎', category: 'tool' },
      { name: '加粗握柄餐具套装', price: 69, desc: '适老握感，关节炎患者友好', category: 'tool' },
      { name: '夜光防滑拖鞋', price: 49, desc: '夜间发光，防滑减震', category: 'tool' },
      { name: '智能药盒（7日）', price: 159, desc: '按时分药，漏服提醒', category: 'tool' },
      { name: '便携式制氧机', price: 1980, desc: '轻巧静音，外出可用', category: 'tool' },
    ],
    // 安心食品：保健品 + 食品
    foodItems: [
      { name: '钙片+维生素D组合', price: 128, desc: '中老年骨骼健康套装' },
      { name: '深海鱼油胶囊', price: 158, desc: '调节血脂，保护心脑血管' },
      { name: '复合维生素B族', price: 89, desc: '缓解疲劳，营养神经' },
      { name: '中老年奶粉', price: 168, desc: '高钙低脂，易冲泡好吸收' },
      { name: '燕麦麸皮粉', price: 49, desc: '高纤维控糖，早餐代餐好选择' },
      { name: '黑芝麻丸', price: 39, desc: '古法九蒸九晒，养发润肠' },
      { name: '枸杞原浆', price: 79, desc: '宁夏中宁鲜果原榨，开盖即饮' },
      { name: '无糖燕麦饼干', price: 29, desc: '糖尿病友好，酥脆好吃' },
      { name: '银耳莲子羹', price: 35, desc: '即食罐装，滋阴润肺' },
      { name: '三七粉超细', price: 168, desc: '云南文山三七，温水冲服' },
    ],
    // 助老用品：辅具 + 护理用品
    toolItems: [
      { name: '防滑浴室地垫', price: 39, desc: '加厚防滑，居家防跌倒' },
      { name: '智能血压计', price: 269, desc: '一键测量，数据自动同步' },
      { name: '一键呼叫手环', price: 359, desc: 'GPS定位+SOS呼叫，子女远程查看' },
      { name: '适老放大镜灯具', price: 89, desc: 'LED放大镜，看报看药瓶更清晰' },
      { name: '防走失定位徽章', price: 199, desc: '轻便胸针，室内外精准定位' },
      { name: '电动升降适老椅', price: 2680, desc: '助力起坐，保护膝盖腰椎' },
      { name: '加粗握柄餐具套装', price: 69, desc: '适老握感，关节炎患者友好' },
      { name: '夜光防滑拖鞋', price: 49, desc: '夜间发光，防滑减震' },
      { name: '智能药盒（7日）', price: 159, desc: '按时分药，漏服提醒' },
      { name: '便携式制氧机', price: 1980, desc: '轻巧静音，外出可用' },
      { name: '成人纸尿裤（整箱）', price: 159, desc: '日本进口吸水芯，亲肤透气' },
      { name: '防褥疮气垫床', price: 680, desc: '交替充气，长期卧床必备' },
    ],
  },
  {
    key: 'herb',
    icon: 'leaf',
    title: '中药百科',
    desc: '中药知识 · 经典方剂 · 中药用品',
    color: 'rgba(91, 184, 158, 0.15)',
    items: [],
  },
  {
    key: 'sleep',
    icon: 'moon',
    title: '安稳睡眠',
    desc: '睡眠知识 · 助眠方案 · 助眠产品',
    color: 'rgba(111, 177, 217, 0.15)',
    items: [],
  },
  {
    key: 'retrofit',
    icon: 'wrench',
    title: '适老化改造',
    desc: '居家安全改造，补贴可查',
    color: 'rgba(91, 184, 158, 0.15)',
    items: [],
  },
]

// AI 记医嘱：通过拍照或语音录入医嘱，自动汇总记忆
export const medicalOrders = [
  { id: 1, date: '2026-07-15', source: '拍照录入', hospital: '协和医院', doctor: '张主任',
    content: '1. 降压药每日1次，早晨饭后服用\n2. 低盐饮食，每日盐摄入不超过5克\n3. 每周测量血压3次并记录\n4. 一个月后复诊',
    tags: ['高血压', '长期用药'] },
  { id: 2, date: '2026-07-10', source: '语音录入', hospital: '社区医院', doctor: '李医生',
    content: '1. 钙片每日2片，晚饭后服用\n2. 多晒太阳，每日30分钟\n3. 适度运动，避免剧烈活动\n4. 三个月后复查骨密度',
    tags: ['骨质疏松'] },
  { id: 3, date: '2026-07-02', source: '拍照录入', hospital: '协和医院', doctor: '王医生',
    content: '1. 降糖药每日3次，饭前30分钟\n2. 控制主食，每餐不超过2两\n3. 饭后散步30分钟\n4. 每周测空腹血糖2次',
    tags: ['糖尿病'] },
]

// AI 记医嘱汇总记忆（定期播放）
export const medicalOrderSummary = '王奶奶的医嘱汇总：\n\n1. 高血压：每日早晨饭后服用降压药1片，低盐饮食。\n2. 糖尿病：每日3次饭前30分钟服用降糖药，控制主食。\n3. 骨质疏松：每日晚饭后服用钙片2片，多晒太阳。\n\n下次复诊：\n· 高血压：8月15日 协和医院 张主任\n· 糖尿病：8月02日 协和医院 王医生\n· 骨质疏松：10月10日 社区医院 李医生'

// 小康陪伴：实时记录能力展示（关火/钥匙/生日提醒等）
// 包含生日、药物、银行卡、证件、联系人、回忆录、照片、视频等敏感数据加密存储
export const companionMemoryRecords = [
  { icon: 'flame', time: '今天 11:32', title: '关火提醒已记录', desc: '您说"粥煮好了关火"，小康已设置15分钟后提醒您关火', tag: '厨房安全' },
  { icon: 'key', time: '今天 09:15', title: '钥匙位置已记录', desc: '您说"钥匙放在电视柜抽屉里"，已记入备忘，下次找不到可问小康', tag: '生活备忘' },
  { icon: 'cake', time: '昨天 20:00', title: '生日提醒（加密存储）', desc: '已记录女儿小芳生日为8月8日，将在8月7日提前提醒您准备。家庭纪念日信息已本地加密保存', tag: '家庭纪念' },
  { icon: 'pill', time: '昨天 12:30', title: '用药记录（加密存储）', desc: '今日午间消炎药已服用，下次钙片19:00提醒。用药数据仅本地存储，不会上传', tag: '用药管理' },
  { icon: 'phone', time: '前天 15:00', title: '联系人通讯录（加密存储）', desc: '已记录家人、医生、社区共12位联系人。联系方式采用本地加密存储，仅本人与授权子女可查看', tag: '联系人' },
  { icon: 'credit-card', time: '前天 14:00', title: '银行卡号（加密存储）', desc: '已安全保存3张银行卡尾号（****8821 / ****6639 / ****0715），完整卡号采用银行级AES-256加密，仅本人指纹可解锁查看', tag: '敏感信息' },
  { icon: 'shield', time: '前天 13:30', title: '证件信息（加密存储）', desc: '身份证、医保卡、户口本等6张证件已扫描存档，全部本地加密保存，仅本人与授权子女可查看', tag: '敏感信息' },
  { icon: 'book-heart', time: '前天 11:00', title: '回忆录草稿（加密存储）', desc: '"我与老伴相识"等3章回忆录草稿已自动保存，文字内容本地加密，永不外传', tag: '回忆录' },
  { icon: 'image', time: '3天前 16:20', title: '老照片相册（加密存储）', desc: '已收录1970-2020年家庭照片86张，含AI修复版12张。照片库本地加密，分享前需本人授权', tag: '照片视频' },
  { icon: 'film', time: '3天前 16:00', title: '家庭视频（加密存储）', desc: '小芳周岁、退休欢送会等8段视频已安全保存，视频文件本地加密存储，不会上传云端', tag: '照片视频' },
  { icon: 'shopping-cart', time: '前天 10:20', title: '购物清单', desc: '您说"买点鸡蛋和牛奶"，已生成购物清单，去超市时可调出', tag: '生活备忘' },
]

// 小康陪伴：回忆往事 / AI 协助写人生回忆录
export const memoryStories = [
  { icon: 'camera', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)', period: '1960年代 · 童年', title: '村口的老槐树', snippet: '记得小时候村口有一棵大槐树，夏天我们都在树下乘凉、捉知了。奶奶总摇着蒲扇给我讲故事...' },
  { icon: 'graduation', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)', period: '1970年代 · 青年', title: '第一次坐火车', snippet: '18岁那年第一次坐火车去省城，绿皮车厢里挤满了人。我抱着包袱站了一夜，心里又紧张又期待...' },
  { icon: 'heart', bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)', period: '1980年代 · 恋爱', title: '与老伴相识', snippet: '那年厂里组织联欢，他主动邀请我跳舞。他笨手笨脚的，总踩我脚，但笑起来特别温暖...' },
  { icon: 'users', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)', period: '1990年代 · 家庭', title: '小芳出生那天', snippet: '凌晨三点发动去医院，折腾了一夜。当护士把小芳抱给我看时，她睁着大眼睛不哭不闹...' },
  { icon: 'briefcase', bg: 'linear-gradient(135deg, #6FB1D9, #3E7CB1)', period: '2000年代 · 事业', title: '厂里评上劳模', snippet: '在纺织厂干了三十年，那年终于评上了市级劳模。领奖那天穿着新做的中山装，特别神气...' },
  { icon: 'plane', bg: 'linear-gradient(135deg, #B8A0F2, #8B6FE0)', period: '2010年代 · 退休', title: '和老伴的旅行', snippet: '退休后第一件事就是去三亚看海。第一次见到大海，我俩像孩子一样脱了鞋在沙滩上跑...' },
]

// AI 协助写人生回忆录（章节）
export const memoirChapters = [
  { no: '第一章', title: '故乡的童年', status: '已完成', words: 3200, updated: '2026-07-12' },
  { no: '第二章', title: '求学的岁月', status: '已完成', words: 2800, updated: '2026-07-13' },
  { no: '第三章', title: '工作与奋斗', status: '撰写中', words: 1500, updated: '2026-07-15' },
  { no: '第四章', title: '成家与育儿', status: '待开始', words: 0, updated: '' },
  { no: '第五章', title: '退休新生活', status: '待开始', words: 0, updated: '' },
]

// ===== 益智游戏（锻炼反应能力、手指协调，含搞笑与社交传播） =====
export const puzzleGames = [
  {
    id: 'whack-mole',
    name: '打地鼠',
    icon: 'hammer',
    bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)',
    desc: '快速点击冒出的地鼠，锻炼反应速度',
    skill: '反应能力',
    skillLevel: '入门',
    funTag: '解压搞笑',
    players: 12856,
    shareLine: '我在「生命树」打地鼠60秒得了92分，老胳膊老腿还能这么利索！你也来挑战～',
  },
  {
    id: 'finger-dance',
    name: '手指舞',
    icon: 'hand',
    bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)',
    desc: '按节奏点击屏幕左右区，锻炼手指协调',
    skill: '手指协调',
    skillLevel: '进阶',
    funTag: '魔性上头',
    players: 8742,
    shareLine: '手指舞连击36下不卡壳！谁说老年人反应慢？来比一比～',
  },
  {
    id: 'memory-match',
    name: '记忆翻牌',
    icon: 'brain',
    bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)',
    desc: '翻牌配对相同图案，锻炼短时记忆',
    skill: '记忆力',
    skillLevel: '入门',
    funTag: '脑力激荡',
    players: 9521,
    shareLine: '记忆翻牌10对全中0失误！年轻时打牌的底子还在～不服来战',
  },
  {
    id: 'color-tap',
    name: '颜色快拍',
    icon: 'palette',
    bg: 'linear-gradient(135deg, #B8A0F2, #8B6FE0)',
    desc: '屏幕出现指定颜色立即点击，锻炼反应与辨色',
    skill: '反应能力',
    skillLevel: '进阶',
    funTag: '眼花缭乱',
    players: 6843,
    shareLine: '颜色快拍差点把我看花眼，最后反杀拿了A+！老人也能玩出花',
  },
]

// ===== 适老化意见反馈：分类与示例 =====
export const feedbackCategories = [
  { id: 'transport', icon: 'bus', name: '公共交通', desc: '公交车台阶过高、站牌字小、无障碍设施缺失等' },
  { id: 'public', icon: 'building', name: '公共场所', desc: '商场/医院入口台阶、扶手、卫生间适老化等' },
  { id: 'community', icon: 'home', name: '社区环境', desc: '小区路灯、坡道、电梯、休闲座椅等' },
  { id: 'digital', icon: 'smartphone', name: '数字鸿沟', desc: 'App字体小、扫码点餐、健康码等智能应用障碍' },
  { id: 'service', icon: 'heart-handshake', name: '服务态度', desc: '窗口工作人员耐心、老年人绿色通道等' },
  { id: 'other', icon: 'message-square', name: '其他建议', desc: '任何利于老年人生活的改造建议' },
]

// 反馈处理进度示例
export const feedbackCases = [
  { id: 'FB20260710', category: '公共交通', location: '和平里西街公交站', desc: '12路公交车进门台阶过高，老人上车困难', status: '协调中', progress: '已联系公交集团，预计下月加装低踏板', date: '2026-07-10' },
  { id: 'FB20260705', category: '公共场所', location: '社区医院门诊大厅', desc: '挂号窗口字体太小，老人看不清科室', status: '已解决', progress: '已更换大字电子屏，增设导诊志愿者', date: '2026-07-05' },
  { id: 'FB20260628', category: '社区环境', location: '翠湖小区北门', desc: '单元门口缺少无障碍坡道，轮椅出入不便', status: '施工中', progress: '社区已审批，本周开始施工改造', date: '2026-06-28' },
]

// ===== 中药百科 =====
export const herbEncyclopedia = {
  intro: '中药以"四气五味、归经升降"为核心理论，讲究君臣佐使、辨证施治。以下为中老年人常用中药知识，仅供参考，具体用药请遵医嘱。',
  theories: [
    { name: '四气五味', icon: 'leaf', desc: '四气指寒热温凉，五味指辛甘酸苦咸，决定药物性质与功效。' },
    { name: '归经理论', icon: 'navigation', desc: '药物对特定脏腑经络的定向作用，如枸杞归肝经。' },
    { name: '君臣佐使', icon: 'users', desc: '方剂中各药物主次关系，协同增效、减毒护胃。' },
    { name: '辨证施治', icon: 'brain', desc: '同病异治、异病同治，根据体质与证候个性化用药。' },
  ],
  herbs: [
    { name: '人参', icon: 'sprout', nature: '温', flavor: '甘、微苦', efficacy: '大补元气、复脉固脱、补脾益肺', use: '气虚乏力、食欲不振者宜用；高血压、感冒发热忌用', price: 88, unit: '克' },
    { name: '枸杞', icon: 'flame', nature: '平', flavor: '甘', efficacy: '滋补肝肾、益精明目', use: '日常泡茶5-10粒；脾虚便溏者少用', price: 32, unit: '50g' },
    { name: '黄芪', icon: 'leaf', nature: '微温', flavor: '甘', efficacy: '补气升阳、固表止汗、利水消肿', use: '气虚自汗、易感冒者常用；阴虚火旺忌用', price: 28, unit: '50g' },
    { name: '当归', icon: 'heart', nature: '温', flavor: '甘、辛', efficacy: '补血活血、调经止痛、润肠通便', use: '面色萎黄、血虚痛经宜用；腹泻者慎用', price: 38, unit: '50g' },
    { name: '陈皮', icon: 'carrot', nature: '温', flavor: '辛、苦', efficacy: '理气健脾、燥湿化痰', use: '消化不良、咳嗽痰多宜用；阴虚燥咳慎用', price: 18, unit: '50g' },
    { name: '三七', icon: 'droplet', nature: '温', flavor: '甘、微苦', efficacy: '散瘀止血、消肿定痛', use: '跌打损伤、心脑血管养护常用；孕妇忌用', price: 128, unit: '50g' },
  ],
  remedies: [
    { name: '生脉饮', ingredients: '人参 · 麦冬 · 五味子', effect: '益气复脉、养阴生津，适合夏季汗多气短', caution: '感冒发热不宜' },
    { name: '四物汤', ingredients: '当归 · 川芎 · 白芍 · 熟地', effect: '补血调血，适合面色无华、血虚体质', caution: '经期慎用' },
    { name: '补中益气汤', ingredients: '黄芪 · 人参 · 白术 · 当归 · 陈皮', effect: '补中益气、升阳举陷，适合气虚乏力', caution: '阴虚火旺忌用' },
  ],
}

// ===== 安稳睡眠 =====
export const sleepCare = {
  intro: '老年人常见入睡困难、夜醒多次、早醒等问题，多与生理节律变化、慢病、情绪有关。下面是科学的睡眠知识与助眠方案。',
  knowledge: [
    { icon: 'moon', title: '老年人睡眠规律', desc: '60岁以上每天睡6-7小时属正常，早睡早起更符合生理节律，无需强求8小时。' },
    { icon: 'coffee', title: '咖啡因与药物影响', desc: '下午3点后避免咖啡、浓茶；某些降压药、激素药可能影响睡眠，可咨询医生调整服药时间。' },
    { icon: 'activity', title: '适度运动助眠', desc: '白天散步30-40分钟、傍晚太极或站桩，避免睡前2小时剧烈运动。' },
    { icon: 'bed-double', title: '卧室环境', desc: '保持安静、黑暗、凉爽（20-22℃），选择软硬适中的床垫和支撑颈部的枕头。' },
    { icon: 'smartphone', title: '远离蓝光', desc: '睡前1小时不刷手机、看强烈光线的电视，可听轻音乐或泡脚替代。' },
    { icon: 'utensils', title: '饮食注意', desc: '晚餐7分饱，避免辛辣油腻；睡前可饮温牛奶、百合莲子汤，安神助眠。' },
  ],
  problems: [
    { name: '入睡困难', cause: '焦虑、思虑过度、睡前兴奋', solution: '睡前1小时关闭电子设备，做腹式呼吸10分钟，听白噪音或康养音频。' },
    { name: '夜间频繁觉醒', cause: '夜尿、关节痛、睡眠呼吸暂停', solution: '睡前2小时限水，慢病疼痛提前用药；打鼾严重建议做睡眠监测。' },
    { name: '早醒后无法入睡', cause: '生物钟提前、抑郁倾向', solution: '白天增加光照与活动，午睡不超过30分钟；情绪持续低落建议就医。' },
    { name: '多梦易醒', cause: '气血不足、压力大、饮食过饱', solution: '可咨询中医师调理气血，晚餐少油少盐，睡前泡脚15分钟。' },
  ],
  products: [
    { name: '薰衣草助眠喷雾', price: 69, desc: '天然薰衣草精油，枕前轻喷，舒缓安神', icon: 'flower' },
    { name: '记忆棉护颈枕', price: 159, desc: '贴合颈椎曲线，缓解肩颈僵硬，仰睡侧睡都舒适', icon: 'bed' },
    { name: '智能助眠眼罩', price: 199, desc: '蓝牙白噪音+加热眼罩，15分钟自动关机', icon: 'moon' },
    { name: '酸枣仁百合茶', price: 49, desc: '药食同源配方，宁心安神，睡前温饮一杯', icon: 'coffee' },
    { name: '恒温乳胶床垫', price: 1280, desc: '透气抑螨、贴合身体、缓解压力点不适', icon: 'bed-double' },
    { name: '泡脚助眠包', price: 39, desc: '艾草+生姜+红花，睡前泡脚15分钟暖身助眠', icon: 'flame' },
  ],
}

// 医生在线问诊
export const onlineDoctors = [
  { id: 1, name: '张主任', title: '心内科 · 主任医师', hospital: '协和医院', avatar: 'stethoscope', online: true, queue: 3, rating: 4.9, desc: '擅长高血压、冠心病、心律失常' },
  { id: 2, name: '李医生', title: '内分泌科 · 副主任医师', hospital: '协和医院', avatar: 'droplet', online: true, queue: 1, rating: 4.8, desc: '擅长糖尿病、甲亢、代谢综合征' },
  { id: 3, name: '王医生', title: '骨科 · 主任医师', hospital: '积水潭医院', avatar: 'activity', online: false, queue: 0, rating: 4.9, desc: '擅长骨质疏松、关节炎、骨折康复' },
  { id: 4, name: '陈医生', title: '中医科 · 副主任医师', hospital: '广安门中医院', avatar: 'leaf', online: true, queue: 5, rating: 4.7, desc: '擅长中医调理、慢病养护' },
  { id: 5, name: '赵医生', title: '神经内科 · 主治医师', hospital: '天坛医院', avatar: 'brain', online: true, queue: 2, rating: 4.8, desc: '擅长头晕、失眠、脑卒中预防' },
]

// 视障语音模式：听书模块
export const voiceAudiobooks = [
  { id: 1, title: '红楼梦', author: '曹雪芹', duration: '32小时', icon: 'book-open', current: '第18回' },
  { id: 2, title: '三国演义', author: '罗贯中', duration: '28小时', icon: 'scroll', current: '未开始' },
  { id: 3, title: '老年健康养生经', author: '健康出版社', duration: '6小时', icon: 'heart-pulse', current: '第3章' },
  { id: 4, title: '平凡的世界', author: '路遥', duration: '24小时', icon: 'book-open', current: '未开始' },
]

// 视障语音模式：听新闻模块
export const voiceNews = [
  { id: 1, title: '今日要闻', desc: '全国养老服务条例修订通过，新增适老化改造补贴', time: '08:00', icon: 'newspaper' },
  { id: 2, title: '健康快讯', desc: '三伏天养生指南：防中暑、补水分、清淡饮食', time: '07:30', icon: 'heart-pulse' },
  { id: 3, title: '社区动态', desc: '翠湖社区本周三举办京剧票友会，欢迎参加', time: '昨日', icon: 'users' },
  { id: 4, title: '天气预警', desc: '今明两天高温37°C，建议老年人减少外出', time: '06:00', icon: 'sun' },
]

// 活力老人模式：滚动预约活动提醒（首页顶部滚动条）
export const scrollAppointments = [
  { icon: 'mountain', title: '爬山活动', time: '本周六 06:30', location: '香山公园南门', desc: '记得穿运动鞋、带水壶，集合后统一上山' },
  { icon: 'book-open', title: '国学课', time: '今日 10:30', location: '社区活动室', desc: '《论语》第二讲，请携带笔记本' },
  { icon: 'flame', title: '燃气灶检查', time: '明日 14:00', location: '家中', desc: '师傅上门检测燃气管路，请留人在家' },
]

// ===== 历史健康报告（周/月/年报 + 指标趋势 + 异常预警）=====
export type ReportPeriod = 'day' | 'week' | 'month' | 'year'
export interface HealthReportItem {
  id: number
  date: string
  period: ReportPeriod
  title: string
  summary: string
  score: number
  scoreTrend: 'up' | 'down' | 'flat'
  abnormalities: { indicator: string; value: string; ref: string; level: 'high' | 'mid' | 'low'; suggest: string }[]
  vitalsTrend: { label: string; data: number[]; unit: string; status: 'normal' | 'warning' }[]
  advice: string
}

export const healthReports: HealthReportItem[] = [
  {
    id: 1, date: '2026-07-15', period: 'day', title: '今日健康报告',
    summary: '王奶奶今日整体状况良好。血压略偏高，建议减少盐分摄入。步数目标完成 65%，建议下午再散步 30 分钟。',
    score: 86, scoreTrend: 'up',
    abnormalities: [
      { indicator: '血压', value: '128/82', ref: '<120/80', level: 'mid', suggest: '低盐饮食，按时服药' },
      { indicator: '血糖', value: '6.8', ref: '<6.1', level: 'mid', suggest: '控制主食，饭后散步' },
    ],
    vitalsTrend: [
      { label: '血压(收缩)', data: [122, 125, 128, 126, 130, 128, 128], unit: 'mmHg', status: 'warning' },
      { label: '心率', data: [70, 72, 74, 71, 73, 72, 72], unit: 'bpm', status: 'normal' },
      { label: '步数', data: [2800, 3100, 3500, 2900, 3200, 3400, 3280], unit: '步', status: 'normal' },
    ],
    advice: '继续保持规律作息，适当增加户外活动，关注血压波动。',
  },
  {
    id: 2, date: '2026-07-14', period: 'week', title: '本周健康周报（7.8-7.14）',
    summary: '本周整体平稳。血压均值 128/82 略偏高，心率正常，睡眠日均 7.2 小时，步数日均 3280 步。用药依从性 100%。',
    score: 85, scoreTrend: 'flat',
    abnormalities: [
      { indicator: '血压', value: '均值 128/82', ref: '<120/80', level: 'mid', suggest: '持续低盐饮食，监测晨起血压' },
      { indicator: '深睡占比', value: '18%', ref: '>20%', level: 'mid', suggest: '22:00 前入睡，睡前避免饮茶' },
    ],
    vitalsTrend: [
      { label: '血压(收缩)', data: [126, 130, 125, 128, 132, 127, 128], unit: 'mmHg', status: 'warning' },
      { label: '睡眠时长', data: [7.0, 7.5, 6.8, 7.2, 7.8, 7.0, 7.2], unit: '小时', status: 'normal' },
      { label: '步数', data: [2800, 3500, 2900, 4100, 3200, 3000, 3280], unit: '步', status: 'normal' },
    ],
    advice: '本周血压波动需关注，建议下周记录晨起与睡前血压，复诊时带给张主任参考。',
  },
  {
    id: 3, date: '2026-06-30', period: 'month', title: '6月健康月报',
    summary: '6月整体健康状态稳定。健康评分均值 84 分。血压控制有所改善，血糖偶有波动。坚持用药依从性 98%。本月参加社区活动 8 次。',
    score: 84, scoreTrend: 'up',
    abnormalities: [
      { indicator: '空腹血糖', value: '均值 6.8', ref: '<6.1', level: 'mid', suggest: '控制主食量，增加蔬菜比例' },
      { indicator: '骨密度', value: 'T值 -2.1', ref: '>-1.0', level: 'high', suggest: '已用钙片+维生素D，多晒太阳' },
    ],
    vitalsTrend: [
      { label: '血压(收缩)', data: [132, 130, 128, 129, 127, 128], unit: 'mmHg', status: 'warning' },
      { label: '健康评分', data: [82, 83, 84, 85, 84, 86], unit: '分', status: 'normal' },
      { label: '活动次数', data: [6, 7, 8, 7, 9, 8], unit: '次', status: 'normal' },
    ],
    advice: '6月整体向好，血糖与骨密度需持续关注。7月继续保持规律作息与社交活动。',
  },
  {
    id: 4, date: '2025-12-31', period: 'year', title: '2025年度健康年报',
    summary: '2025年全年健康状态整体平稳。年度健康评分 83 分。血压控制稳定，血糖较年初改善。全年用药依从性 96%。共参加体检 4 次，社区活动 86 次。',
    score: 83, scoreTrend: 'up',
    abnormalities: [
      { indicator: '骨密度', value: 'T值 -2.1', ref: '>-1.0', level: 'high', suggest: '需长期补钙+维生素D，防跌倒' },
      { indicator: '血脂', value: 'LDL 3.1', ref: '<2.6', level: 'mid', suggest: '低脂饮食，多吃深海鱼' },
    ],
    vitalsTrend: [
      { label: '健康评分', data: [78, 79, 80, 81, 82, 83, 84, 85, 84, 85, 86, 86], unit: '分', status: 'normal' },
      { label: '血压(收缩)', data: [138, 135, 132, 130, 128, 129, 128, 127, 128, 128, 129, 128], unit: 'mmHg', status: 'warning' },
      { label: '活动次数', data: [5, 6, 7, 7, 8, 8, 7, 9, 8, 7, 8, 8], unit: '次', status: 'normal' },
    ],
    advice: '2025年整体向好，血压控制有进步。2026年重点关注骨密度与血糖，建议增加户外负重运动。',
  },
]

// ===== 异常预警中心（子女照看模式 + AI健康）=====
export interface AlertItem {
  id: number
  level: 'high' | 'mid' | 'low'
  type: 'fall' | 'vital' | 'inactivity' | 'medication' | 'device' | 'ai'
  title: string
  desc: string
  time: string
  suggestion: string
  notified: boolean
  contacts: string[]
}

export const alertCenter: AlertItem[] = [
  {
    id: 1, level: 'high', type: 'fall', title: '跌倒检测预警',
    desc: '智能手环检测到王奶奶 14:32 在卫生间发生跌倒事件，已静止 15 秒。',
    time: '今日 14:32', suggestion: '已自动拨打 120 并通知紧急联系人小芳（女儿）。',
    notified: true, contacts: ['小芳（女儿）', '120 急救', '社区物业'],
  },
  {
    id: 2, level: 'high', type: 'vital', title: '血压异常告警',
    desc: '王奶奶今晨血压 145/92 mmHg，较前 7 日均值升高 12%，超过安全阈值。',
    time: '今日 07:35', suggestion: '建议让王奶奶静坐休息 10 分钟后复测，如持续偏高请联系张主任。',
    notified: true, contacts: ['小芳（女儿）'],
  },
  {
    id: 3, level: 'mid', type: 'inactivity', title: '长时间无活动预警',
    desc: '王奶奶已 3 小时未检测到活动（客厅传感器静止），超出日常活动规律。',
    time: '今日 11:20', suggestion: '小康已发送语音问候，建议您远程视频确认妈妈状态。',
    notified: false, contacts: ['小芳（女儿）'],
  },
  {
    id: 4, level: 'mid', type: 'medication', title: '用药漏服提醒',
    desc: '王奶奶 12:30 的消炎药未按时服用，已超时 35 分钟。',
    time: '今日 13:05', suggestion: '小康已语音提醒 2 次，建议您电话提醒妈妈补服。',
    notified: true, contacts: ['小芳（女儿）', '社区护士'],
  },
  {
    id: 5, level: 'mid', type: 'device', title: '智能设备离线',
    desc: '智能血压计已离线 2 小时，无法上传数据。',
    time: '今日 09:48', suggestion: '建议检查设备电量或网络连接，必要时联系售后。',
    notified: false, contacts: ['小芳（女儿）'],
  },
  {
    id: 6, level: 'low', type: 'ai', title: 'AI 评估提醒',
    desc: 'AI 综合分析：王奶奶近 7 天睡眠质量下降，深睡占比 18%，夜间觉醒 2-3 次。',
    time: '今日 08:00', suggestion: '建议调整作息时间，22:00 前入睡，睡前泡脚或听轻音乐。',
    notified: false, contacts: [],
  },
]

// ===== 健康知识科普（精准推送）=====
export interface HealthKnowledge {
  id: number
  category: string
  title: string
  icon: string
  bg: string
  readTime: string
  reason: string  // 推送理由（精准科普）
  summary: string
  tags: string[]
}

export const healthKnowledge: HealthKnowledge[] = [
  {
    id: 1, category: '高血压', title: '高血压饮食指南：低盐也能吃得香',
    icon: 'droplet', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)',
    readTime: '5分钟', reason: '您近期血压偏高，这篇对您有帮助',
    summary: '每日盐摄入不超过 5 克，多用醋、柠檬、香料代替盐。推荐凉拌木耳、清蒸鱼、西红柿鸡蛋等低盐菜谱...',
    tags: ['高血压', '饮食', '低盐'],
  },
  {
    id: 2, category: '骨质疏松', title: '骨质疏松运动与补钙全攻略',
    icon: 'activity', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)',
    readTime: '6分钟', reason: '骨密度 T 值 -2.1，需重点养护',
    summary: '每日钙摄入 1000mg，多晒太阳 30 分钟。推荐散步、太极等负重运动，避免弯腰提重物...',
    tags: ['骨质疏松', '运动', '补钙'],
  },
  {
    id: 3, category: '糖尿病', title: '糖尿病主食替换与血糖管理',
    icon: 'candy', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)',
    readTime: '4分钟', reason: '空腹血糖 6.8 偏高，控制主食很关键',
    summary: '用燕麦、糙米替换白米饭，每餐主食不超过 2 两。饭后散步 30 分钟可有效降低餐后血糖...',
    tags: ['糖尿病', '饮食', '血糖'],
  },
  {
    id: 4, category: '睡眠', title: '老年人失眠调理：从作息到饮食',
    icon: 'moon', bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)',
    readTime: '5分钟', reason: '深睡占比偏低，睡眠质量待改善',
    summary: '22:00 前入睡，睡前 1 小时不看手机。避免饮茶咖啡，可泡脚或喝温牛奶。白天午睡不超 30 分钟...',
    tags: ['睡眠', '作息', '调理'],
  },
  {
    id: 5, category: '跌倒预防', title: '居家防跌倒 10 招',
    icon: 'person-standing', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)',
    readTime: '3分钟', reason: '跌倒风险评分 72，需加强防护',
    summary: '卫生间装扶手防滑垫，起身遵循 30 秒原则，穿防滑鞋，夜间留小夜灯，规律下肢力量训练...',
    tags: ['跌倒', '居家', '安全'],
  },
  {
    id: 6, category: '夏季养生', title: '三伏天老年人养生要点',
    icon: 'sun', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)',
    readTime: '4分钟', reason: '当前小暑节气，正适合',
    summary: '补水防中暑，每天 1500-2000ml。饮食清淡，多吃苦瓜黄瓜。晨练趁清凉，外出戴帽防晒...',
    tags: ['夏季', '养生', '防暑'],
  },
]

// ===== 老年课堂扩展课程（精准分类）=====
export const elderlyCourses = [
  { id: 1, icon: 'scroll', name: '国学课程', desc: '《论语》《弟子规》经典解读', lessons: 12, level: '入门', color: 'gold',
    items: ['《论语》精读', '《弟子规》解读', '唐诗宋词鉴赏', '二十四孝故事'] },
  { id: 2, icon: 'activity', name: '穴位课程', desc: '常用穴位定位与按摩手法', lessons: 8, level: '入门', color: 'green',
    items: ['常用保健穴位', '头痛缓解穴位', '胃肠调理穴位', '失眠安神穴位'] },
  { id: 3, icon: 'heart-pulse', name: '经络养生课程', desc: '十二经脉与日常养生', lessons: 10, level: '进阶', color: 'teal',
    items: ['十二经脉总论', '足三里养生', '三伏天艾灸', '经络拍打操'] },
  { id: 4, icon: 'shield-alert', name: '急救课程', desc: '老年人必备急救技能', lessons: 6, level: '必备', color: 'red',
    items: ['心肺复苏 CPR', '海姆立克急救法', '中风识别 FAST', '跌倒后处理'] },
  { id: 5, icon: 'smartphone', name: '智能手机课程', desc: '从开机到熟练使用', lessons: 15, level: '入门', color: 'blue',
    items: ['手机基础操作', '字体与音量调节', '拍照与相册', '应用商店下载'] },
  { id: 6, icon: 'message-square', name: '微信使用课程', desc: '与家人朋友保持联系', lessons: 10, level: '入门', color: 'green',
    items: ['微信注册登录', '添加好友', '语音视频通话', '发红包与转账'] },
  { id: 7, icon: 'shopping-cart', name: '手机支付课程', desc: '安全使用移动支付', lessons: 8, level: '进阶', color: 'gold',
    items: ['微信支付绑定', '扫码支付', '防诈骗提醒', '账单查询'] },
  { id: 8, icon: 'sprout', name: '园艺种植课程', desc: '阳台种菜养花技巧', lessons: 12, level: '入门', color: 'green',
    items: ['阳台蔬菜种植', '多肉养护', '兰花养殖', '有机堆肥'] },
]

// ===== 老照片智能修复 =====
export const photoRepair = {
  features: [
    { icon: 'sparkles', title: '智能修复', desc: 'AI 自动修复划痕、褪色、模糊', color: 'rgba(91,184,158,0.15)' },
    { icon: 'sun', title: '上色增强', desc: '黑白照片智能上色', color: 'rgba(246,163,92,0.15)' },
    { icon: 'zoom-in', title: '高清放大', desc: '低清照片无损放大', color: 'rgba(111,177,217,0.15)' },
    { icon: 'scissors', title: '人像抠图', desc: '智能识别人物抠图', color: 'rgba(253,101,133,0.15)' },
  ],
  examples: [
    { id: 1, title: '1968年全家福', desc: '已修复·已上色', status: 'done', date: '2026-07-10' },
    { id: 2, title: '1975年结婚照', desc: '已修复·高清放大', status: 'done', date: '2026-07-08' },
    { id: 3, title: '1985年公园合影', desc: '待修复', status: 'pending', date: '' },
  ],
  bookTypes: [
    { id: 'ebook', name: '精美电子书', desc: '在线翻阅·永久保存·可分享', price: 0, icon: 'book-open', popular: false },
    { id: 'soft', name: '软装实体书', desc: '胶装·100g 道林纸·50页起', price: 89, icon: 'book', popular: true },
    { id: 'hard', name: '精装实体书', desc: '硬壳精装·157g 铜版纸·可定制封面', price: 199, icon: 'book-heart', popular: false },
  ],
}

// ===== 长者助餐（增强版，独立导出）=====
export const elderlyMeals = {
  communityCanteens: [
    { id: 1, name: '和平里社区老年食堂', distance: '0.3km', rating: 4.8, address: '和平里中街 18 号', openHours: '11:00-13:00 / 17:00-19:00' },
    { id: 2, name: '翠湖小区长者食堂', distance: '0.8km', rating: 4.7, address: '翠湖路 56 号', openHours: '11:00-13:00' },
  ],
  todayMenu: [
    { name: '番茄炖牛腩', desc: '软烂易嚼', calories: 320, tags: ['低盐', '软食'] },
    { name: '清蒸鲈鱼', desc: '高蛋白低脂', calories: 280, tags: ['低盐', '低糖'] },
    { name: '南瓜小米粥', desc: '养胃易消化', calories: 180, tags: ['软食', '低盐'] },
    { name: '凉拌木耳', desc: '富含膳食纤维', calories: 90, tags: ['低糖'] },
    { name: '紫菜蛋花汤', desc: '清淡少油', calories: 60, tags: ['低盐', '软食'] },
  ],
  mealPlans: [
    { id: 1, name: '低盐套餐', desc: '每日盐摄入<5g，适合高血压', icon: 'droplet', color: 'rgba(91,184,158,0.15)' },
    { id: 2, name: '低糖套餐', desc: '低 GI 主食，适合糖尿病', icon: 'candy', color: 'rgba(232,184,124,0.15)' },
    { id: 3, name: '软食套餐', desc: '软烂易嚼，适合牙口不好', icon: 'utensils', color: 'rgba(111,177,217,0.15)' },
    { id: 4, name: '均衡营养套餐', desc: '荤素搭配，营养全面', icon: 'carrot', color: 'rgba(253,101,133,0.15)' },
  ],
  delivery: {
    available: true,
    fee: 3,
    freeThreshold: 25,
    estimatedTime: '30-45 分钟',
    serviceArea: '和平里社区及周边 1km',
  },
}

// ===== 适老化改造 =====
export const elderlyRetrofit = {
  schemes: [
    {
      id: 1, icon: 'shield', name: '卫生间改造', priority: '高', price: '¥800-2500',
      desc: '安装 L 型扶手、防滑地垫、马桶增高器、洗澡椅',
      details: ['马桶旁 L 型扶手', '淋浴区防滑地垫', '可调节洗澡椅', '马桶增高器 5cm', '紧急呼叫按钮'],
      subsidy: '可享最高 1500 元补贴',
      color: 'rgba(91,184,158,0.15)',
    },
    {
      id: 2, icon: 'footprints', name: '防滑地面改造', priority: '高', price: '¥500-1800',
      desc: '客厅/卧室/走廊防滑处理，去除门槛高差',
      details: ['防滑地砖或防滑贴', '去除门槛高差', '楼梯防滑条', '地毯固定防滑'],
      subsidy: '可享最高 800 元补贴',
      color: 'rgba(246,163,92,0.15)',
    },
    {
      id: 3, icon: 'sun', name: '智能照明改造', priority: '中', price: '¥300-1200',
      desc: '人体感应小夜灯、走廊智能灯、床头一键开关',
      details: ['卫生间人体感应灯', '走廊脚灯', '床头一键全屋开关', '入户智能灯'],
      subsidy: '可享最高 500 元补贴',
      color: 'rgba(111,177,217,0.15)',
    },
    {
      id: 4, icon: 'siren', name: '紧急呼叫系统', priority: '高', price: '¥600-2000',
      desc: '一键 SOS 呼叫、跌倒检测、燃气报警联动',
      details: ['床头一键 SOS 按钮', '卫生间跌倒检测', '燃气报警联动', '子女手机联动报警'],
      subsidy: '可享最高 1200 元补贴',
      color: 'rgba(253,101,133,0.15)',
    },
    {
      id: 5, icon: 'bed', name: '卧室适老化', priority: '中', price: '¥400-1500',
      desc: '护理床、床头扶手、智能床垫监测',
      details: ['电动护理床（可选）', '床头助力扶手', '智能床垫监测', '床边防滑垫'],
      subsidy: '可享最高 1000 元补贴',
      color: 'rgba(212,132,168,0.15)',
    },
    {
      id: 6, icon: 'smartphone', name: '厨房适老化', priority: '中', price: '¥300-1000',
      desc: '燃气自动切断、防干烧灶具、低位操作台',
      details: ['燃气泄漏自动切断', '防干烧灶具', '低位操作台', '抽屉缓降阻尼'],
      subsidy: '可享最高 600 元补贴',
      color: 'rgba(91,184,158,0.15)',
    },
  ],
  subsidies: [
    { name: '北京市适老化改造补贴', amount: '最高 5000 元', condition: '60 岁以上户籍老人', status: '可申请' },
    { name: '失能老人专项补贴', amount: '最高 3000 元', condition: '经评估为失能/半失能', status: '可申请' },
    { name: '低保老人全额补贴', amount: '全额补贴', condition: '低保户老人', status: '可申请' },
  ],
  teams: [
    { name: '安居适老化改造团队', rating: 4.9, cases: 326, area: '全市服务' },
    { name: '邻里帮适老服务', rating: 4.8, cases: 218, area: '城六区' },
  ],
}

// ===== 智能陪伴推荐（乐活天地）=====
export const companionSuggestions = [
  {
    id: 1, icon: 'activity', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)',
    title: '张爷爷他们正在广场练站桩',
    desc: '今天天气不错，要不要一起去？',
    action: '去看看', actionType: 'join',
    reason: '基于您的兴趣 + 当前天气晴朗 + 邻居张爷爷正在活动',
    time: '正在进行',
  },
  {
    id: 2, icon: 'drama', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)',
    title: '京剧票友圈明晚有聚会',
    desc: '您上次说想唱《贵妃醉酒》，正好一起去？',
    action: '我感兴趣', actionType: 'interest',
    reason: '您曾聊过京剧《贵妃醉酒》 + 票友圈明晚活动',
    time: '明晚 19:00',
  },
  {
    id: 3, icon: 'footprints', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)',
    title: '下午适合去翠湖公园散步',
    desc: '今天 28°C 很舒服，已为您叫好车',
    action: '出发吧', actionType: 'go',
    reason: '天气晴朗 + 您常去翠湖公园 + 今日步数未达标',
    time: '建议 15:00 出发',
  },
  {
    id: 4, icon: 'book-open', bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)',
    title: '国学课《论语》第二讲',
    desc: '今天 10:30 社区活动室，您上次没去成',
    action: '这次去', actionType: 'join',
    reason: '您订阅了国学课 + 上次请假 + 今日 10:30 开课',
    time: '今日 10:30',
  },
]

// ===== 任务6：健康档案管理（4大模块） =====
export const healthArchive = {
  profile: {
    name: '王秀兰', age: 68, gender: '女', bloodType: 'A',
    height: '158cm', weight: '56kg', id: 'LT20260001',
    healthScore: 86, riskLevel: '低风险',
    allergies: '青霉素', chronic: '高血压、轻度骨质疏松',
    familyHistory: '父亲高血压，母亲糖尿病',
    surgery: '2005年阑尾切除术',
    lastCheckup: '2026-06-15',
  },
  checkups: [
    {
      date: '2026-06-15', hospital: '协和医院', type: '年度体检', summary: '血压略偏高，骨密度下降，其余正常',
      items: [
        { name: '血压', value: '128/82', unit: 'mmHg', status: '偏高', normal: '<120/80' },
        { name: '血糖(空腹)', value: '6.8', unit: 'mmol/L', status: '偏高', normal: '<6.1' },
        { name: '血脂(总胆固醇)', value: '5.2', unit: 'mmol/L', status: '正常', normal: '<5.2' },
        { name: '骨密度', value: '-2.1', unit: 'T值', status: '偏低', normal: '>-1.0' },
        { name: '心电图', value: '窦性心律', unit: '', status: '正常', normal: '窦性心律' },
        { name: '胸部X光', value: '双肺纹理清晰', unit: '', status: '正常', normal: '无异常' },
      ],
    },
    {
      date: '2026-01-10', hospital: '社区医院', type: '常规体检', summary: '各项指标基本正常',
      items: [
        { name: '血压', value: '124/80', unit: 'mmHg', status: '正常', normal: '<120/80' },
        { name: '血糖(空腹)', value: '6.2', unit: 'mmol/L', status: '正常', normal: '<6.1' },
        { name: '血常规', value: '正常', unit: '', status: '正常', normal: '正常' },
      ],
    },
  ],
  records: [
    { date: '2026-07-08', hospital: '协和医院', dept: '心内科', doctor: '张主任', diagnosis: '高血压复查', prescription: '硝苯地平控释片 30mg 每日1次', note: '血压控制可，继续服药，3个月复查' },
    { date: '2026-05-20', hospital: '协和医院', dept: '骨科', doctor: '李医生', diagnosis: '轻度骨质疏松', prescription: '碳酸钙D3片 + 阿仑膦酸钠', note: '建议多晒太阳，适度运动' },
    { date: '2026-03-15', hospital: '社区医院', dept: '全科', doctor: '王医生', diagnosis: '感冒', prescription: '感冒灵颗粒', note: '已痊愈' },
  ],
  medications: [
    { name: '硝苯地平控释片', dose: '30mg', frequency: '每日1次', time: '早饭后', status: '服用中', startDate: '2024-03-15', purpose: '降压' },
    { name: '阿卡波糖片', dose: '50mg', frequency: '每日3次', time: '饭前30分钟', status: '服用中', startDate: '2024-08-10', purpose: '降糖' },
    { name: '碳酸钙D3片', dose: '600mg', frequency: '每日1次', time: '晚饭后', status: '服用中', startDate: '2026-05-20', purpose: '补钙' },
    { name: '阿仑膦酸钠', dose: '70mg', frequency: '每周1次', time: '周日早餐前', status: '服用中', startDate: '2026-05-20', purpose: '抗骨质疏松' },
  ],
}

// ===== 任务7：家庭共享设置详情 =====
export const familyShareDetail = {
  members: [
    { id: 'u1', name: '小芳', relation: '女儿', avatar: 'user', bound: true, color: 'var(--color-brand)', permissions: ['health', 'location', 'medication', 'memory'], online: true, distance: '8.8km' },
    { id: 'u2', name: '小明', relation: '儿子', avatar: 'user', bound: true, color: 'var(--color-accent2)', permissions: ['health', 'medication'], online: true, distance: '15.6km' },
    { id: 'u3', name: '张医生', relation: '家庭医生', avatar: 'stethoscope', bound: true, color: 'var(--color-accent2)', permissions: ['health'], online: true, distance: '3.2km' },
    { id: 'u4', name: '李阿姨', relation: '社区护理员', avatar: 'heart-handshake', bound: true, color: 'var(--color-accent3)', permissions: ['health', 'medication'], online: false, distance: '' },
  ],
  permissionOptions: [
    { key: 'health', name: '健康数据', desc: '血压、心率、睡眠等', icon: 'heart-pulse' },
    { key: 'location', name: '位置信息', desc: '实时位置共享', icon: 'map-pin' },
    { key: 'medication', name: '用药情况', desc: '用药记录与提醒', icon: 'pill' },
    { key: 'memory', name: '回忆录', desc: 'AI采访人生故事', icon: 'book-heart' },
  ],
  inviteTypes: [
    { type: 'child', icon: 'user-plus', name: '绑定子女账号', desc: '子女可通过手机号绑定，远程查看您的健康与生活' },
    { type: 'doctor', icon: 'stethoscope', name: '邀请家庭医生', desc: '邀请医生查看您的健康档案，提供专业指导' },
    { type: 'nurse', icon: 'heart-handshake', name: '邀请护理员', desc: '邀请社区护理员提供上门护理服务' },
  ],
}

// ===== 任务8：AI采访（人生回忆录） =====
export const aiInterviewDetail = {
  topics: [
    { id: 'childhood', icon: 'camera', bg: 'linear-gradient(135deg, #FFB199, #FF8E8E)', name: '童年趣事', desc: '故乡、伙伴、游戏、童年趣闻', questions: 12, recorded: 8 },
    { id: 'youth', icon: 'graduation', bg: 'linear-gradient(135deg, #FCE58A, #F6A35C)', name: '青春故事', desc: '求学、初恋、理想与挣扎', questions: 15, recorded: 5 },
    { id: 'work', icon: 'briefcase', bg: 'linear-gradient(135deg, #C8F0E0, #5BB89E)', name: '工作经历', desc: '第一份工作、成就与挫折', questions: 18, recorded: 6 },
    { id: 'love', icon: 'heart', bg: 'linear-gradient(135deg, #FFD3A5, #FD6585)', name: '爱情婚姻', desc: '相识、相恋、成家故事', questions: 14, recorded: 4 },
    { id: 'parenting', icon: 'users', bg: 'linear-gradient(135deg, #6FB1D9, #3E7CB1)', name: '育儿心得', desc: '生儿育女、教育与陪伴', questions: 16, recorded: 3 },
  ],
  features: [
    { icon: 'mic', name: '语音录制转文字', desc: '小康引导提问，您慢慢讲述，AI自动转文字' },
    { icon: 'image', name: '老照片辅助回忆', desc: '上传老照片，AI识别时代背景帮助回忆' },
    { icon: 'users', name: '子女协作补充', desc: '子女可补充细节，让故事更完整' },
    { icon: 'share', name: '分享给后代', desc: '一键分享给子女，让亲情代代相传' },
  ],
  collaborators: [
    { name: '小芳', role: '女儿', contributed: 12, lastTime: '昨天 21:30' },
    { name: '小明', role: '儿子', contributed: 5, lastTime: '3天前' },
    { name: '孙女甜甜', role: '孙女', contributed: 2, lastTime: '上周' },
  ],
}

// ===== 任务9：我的订单（3类） =====
export const orderListDetail = {
  shopOrders: [
    { id: 'SO20260710', name: '钙片+维生素D组合', spec: '600mg×60片', amount: 128, status: '已签收', date: '2026-07-10', canReorder: true, canReview: true, reviewed: false },
    { id: 'SO20260705', name: '防滑浴室地垫', spec: '50×80cm', amount: 39, status: '配送中', date: '2026-07-05', canTrack: true, canReorder: false, canReview: false, reviewed: false },
    { id: 'SO20260628', name: '智能血压计', spec: '欧姆龙7052', amount: 269, status: '已签收', date: '2026-06-28', canReorder: true, canReview: true, reviewed: true },
    { id: 'SO20260615', name: '无添加坚果礼盒', spec: '1.2kg', amount: 88, status: '已签收', date: '2026-06-15', canReorder: true, canReview: true, reviewed: true },
  ],
  serviceOrders: [
    { id: 'SV20260725', type: '陪诊', name: '安心陪诊（协和医院心内科）', date: '2026-07-25 09:00', status: '待服务', canTrack: true, canReview: false, staff: '护理员小周', amount: 199 },
    { id: 'SV20260701', type: '家政', name: '上门深度保洁', date: '2026-07-01', status: '已完成', canTrack: false, canReview: true, staff: '保洁张阿姨', amount: 169 },
    { id: 'SV20260620', type: '适老改造', name: '卫生间防滑扶手改造', date: '2026-06-20', status: '施工中', canTrack: true, canReview: false, staff: '改造师傅老李', amount: 880 },
    { id: 'SV20260610', type: '陪诊', name: '安心陪诊（社区医院）', date: '2026-06-10', status: '已完成', canTrack: false, canReview: true, staff: '护理员小周', amount: 199 },
  ],
  courseOrders: [
    { id: 'CO20260718', name: '京剧名段赏析会', date: '2026-07-18 14:00', location: '社区文化中心', status: '已报名', canReview: false },
    { id: 'CO20260721', name: '手机摄影技巧分享', date: '2026-07-21 15:00', location: '社区活动室', status: '已报名', canReview: false },
    { id: 'CO20260701', name: '智能手机入门课', date: '2026-07-01 10:00', location: '老年大学', status: '已完成', canReview: true },
    { id: 'CO20260620', name: '书法基础课', date: '2026-06-20 09:00', location: '社区书法室', status: '已完成', canReview: true },
  ],
}

// ===== 任务10：会员权益 =====
export const memberBenefits = {
  currentLevel: '黄金树',
  currentPoints: 2680,
  growthToNext: 320,
  nextLevel: '白金树',
  levels: [
    { name: '白银树', threshold: '0-999成长值', color: '#C0C0C0', benefits: ['生活服务9.5折', '健康咨询', '社区活动优先'] },
    { name: '黄金树', threshold: '1000-2999成长值', color: '#FFD700', benefits: ['生活服务9折', '陪诊服务优先', '每月1次免费体检', '24小时健康咨询'], current: true },
    { name: '白金树', threshold: '3000-5999成长值', color: '#E5E4E2', benefits: ['生活服务8.5折', '陪诊免费1次/月', '专属家庭医生', '24h专属管家'] },
    { name: '钻石树', threshold: '6000+成长值', color: '#B9F2FF', benefits: ['生活服务8折', '上门护理2次/月', '全家共享权益', '免费适老改造评估'] },
  ],
  subscriptions: [
    { name: '个人版', price: 19, period: '月', features: ['健康档案管理', 'AI小康陪伴', '生活服务9折', '社区活动优先'], popular: false },
    { name: '家庭套餐', price: 49, period: '月', features: ['个人版全部权益', '子女绑定共享', '全家健康档案', '专属家庭医生', '陪诊免费1次/月'], popular: true },
    { name: '尊享版', price: 99, period: '月', features: ['家庭套餐全部权益', '上门护理2次/月', '24h专属管家', '免费适老改造评估', '全家共享权益'], popular: false },
  ],
  pointsHistory: [
    { date: '2026-07-15', desc: '每日签到', points: '+5' },
    { date: '2026-07-14', desc: '完成健康打卡', points: '+10' },
    { date: '2026-07-10', desc: '商城消费128元', points: '+128' },
    { date: '2026-07-08', desc: '参加AI采访', points: '+20' },
    { date: '2026-07-05', desc: '推荐好友加入', points: '+50' },
  ],
  pointsShop: [
    { name: '土鸡蛋10枚', points: 200, icon: 'carrot', original: 25 },
    { name: '体检套餐8折券', points: 500, icon: 'clipboard-list', original: 80 },
    { name: '陪诊服务体验券', points: 800, icon: 'stethoscope', original: 199 },
    { name: '上门保洁1次', points: 1500, icon: 'sparkles', original: 169 },
    { name: '京剧演出门票', points: 2000, icon: 'drama', original: 280 },
    { name: '智能血压计', points: 3000, icon: 'heart-pulse', original: 269 },
  ],
}

// ===== 任务11：提醒设置 =====
export const reminderSettings = {
  categories: [
    { key: 'medication', icon: 'pill', name: '用药提醒', enabled: true, methods: { voice: true, vibrate: true, popup: true }, frequency: '每次服药前10分钟' },
    { key: 'water', icon: 'droplets', name: '喝水提醒', enabled: true, methods: { voice: false, vibrate: true, popup: true }, frequency: '每2小时一次' },
    { key: 'bp', icon: 'droplet', name: '测血压提醒', enabled: true, methods: { voice: true, vibrate: true, popup: true }, frequency: '每周一三五早8点' },
    { key: 'exercise', icon: 'footprints', name: '运动提醒', enabled: true, methods: { voice: false, vibrate: true, popup: false }, frequency: '每日9:00' },
    { key: 'sleep', icon: 'moon', name: '就寝提醒', enabled: true, methods: { voice: true, vibrate: false, popup: true }, frequency: '每晚22:00' },
    { key: 'turnover', icon: 'refresh-cw', name: '翻身提醒', enabled: false, methods: { voice: false, vibrate: true, popup: false }, frequency: '每2小时' },
  ],
  doNotDisturb: { enabled: true, start: '22:00', end: '07:00' },
  methodOptions: [
    { key: 'voice', name: '语音播报', icon: 'volume-2' },
    { key: 'vibrate', name: '震动', icon: 'activity' },
    { key: 'popup', name: '弹窗提示', icon: 'bell' },
  ],
}

// ===== 任务12：AI管家设置 =====
export const aiManagerSettings = {
  voiceSpeed: '中速',
  voiceType: '温暖男声',
  dialect: '普通话',
  volume: 70,
  voiceSpeedOptions: ['慢速', '中速', '快速'],
  voiceTypeOptions: [
    { value: '温暖男声', desc: '亲切沉稳' },
    { value: '亲切女声', desc: '温柔细腻' },
    { value: '童声', desc: '活泼可爱' },
    { value: '老友声', desc: '平辈交流' },
  ],
  dialectOptions: ['普通话', '四川话', '粤语', '东北话', '上海话', '河南话'],
  careFrequency: '中频',
  careFrequencyOptions: [
    { value: '低频', desc: '仅在重要事项时主动关怀' },
    { value: '中频', desc: '每日3-5次主动问候' },
    { value: '高频', desc: '每日8-10次主动关怀，适合独居老人' },
  ],
  careOptions: [
    { key: 'greeting', name: '日常问候', desc: '早安、午安、晚安问候', enabled: true },
    { key: 'weather', name: '天气提醒', desc: '出门前提醒穿衣带伞', enabled: true },
    { key: 'healthCheck', name: '健康关怀', desc: '提醒量血压、按时吃药', enabled: true },
    { key: 'mood', name: '情绪关怀', desc: '察觉情绪低落主动陪伴', enabled: true },
    { key: 'festival', name: '节日祝福', desc: '节假日送上温馨祝福', enabled: true },
  ],
  nickname: '王奶奶',
}

// ===== 轮椅模式：上门服务 =====
export const wheelchairHomeServices = [
  { id: 1, icon: 'stethoscope', name: '上门康复理疗', desc: '专业康复师上门指导', price: '¥120/次', time: '约60分钟', tag: '热门', color: 'teal' },
  { id: 2, icon: 'pill', name: '上门送药', desc: '处方药送药上门', price: '¥0服务费', time: '当日送达', tag: '免费', color: 'green' },
  { id: 3, icon: 'utensils', name: '助餐送餐', desc: '软食/低糖/低盐定制', price: '¥15/餐', time: '每日送达', tag: '', color: 'gold' },
  { id: 4, icon: 'wrench', name: '轮椅维修保养', desc: '上门检修/轮胎/刹车', price: '¥50起', time: '预约后24h', tag: '', color: 'blue' },
  { id: 5, icon: 'heart-handshake', name: '陪诊就医', desc: '专人陪同看病取药', price: '¥200/次', time: '约半天', tag: '', color: 'teal' },
  { id: 6, icon: 'scissors', name: '上门理发', desc: '行动不便老人专享', price: '¥30/次', time: '约30分钟', tag: '', color: 'gold' },
]

// ===== 轮椅模式：一键购物 =====
export const wheelchairQuickShop = [
  { id: 1, icon: 'shopping-cart', name: '日用品直送', desc: '纸巾/洗护/清洁', price: '满39免运费', color: 'teal' },
  { id: 2, icon: 'carrot', name: '新鲜蔬菜', desc: '当日采摘次日达', price: '满29免运费', color: 'green' },
  { id: 3, icon: 'pill', name: '常备药品', desc: '慢病用药一站式', price: '医保支付', color: 'gold' },
  { id: 4, icon: 'package', name: '成人护理用品', desc: '护理垫/纸尿裤', price: '满49免运费', color: 'blue' },
]

// ===== 轮椅模式：无障碍导航 =====
export const wheelchairAccessibleNav = {
  nearbyFacilities: [
    { id: 1, icon: 'hospital', name: '社区卫生服务中心', distance: '350米', accessible: true, route: '全程无障碍', eta: '5分钟' },
    { id: 2, icon: 'shopping-cart', name: '永辉超市（无障碍入口）', distance: '500米', accessible: true, route: '有坡道+直梯', eta: '8分钟' },
    { id: 3, icon: 'utensils', name: '社区老年食堂', distance: '280米', accessible: true, route: '平路直达', eta: '4分钟' },
    { id: 4, icon: 'tree-pine', name: '翠湖公园（无障碍步道）', distance: '600米', accessible: true, route: '缓坡步道', eta: '10分钟' },
  ],
  accessibleRoutes: [
    { name: '回家路线', from: '当前位置', to: '翠湖小区3号楼', distance: '600米', eta: '10分钟', obstacles: 0, type: '平路+缓坡' },
    { name: '去医院路线', from: '当前位置', to: '社区卫生服务中心', distance: '350米', eta: '5分钟', obstacles: 0, type: '平路直达' },
  ],
}

// ===== 轮椅模式：康复训练指导 =====
export const wheelchairRehabGuide = [
  { id: 1, name: '上肢力量训练', desc: '哑铃/弹力带训练', duration: '15分钟', icon: 'dumbbell', level: '入门', color: 'teal',
    steps: ['热身活动 3分钟', '弹力带拉伸 5分钟', '哑铃举重 5分钟', '放松整理 2分钟'] },
  { id: 2, name: '轮椅转移训练', desc: '床椅/轮椅/马桶转移', duration: '10分钟', icon: 'accessibility', level: '必备', color: 'blue',
    steps: ['轮椅制动锁定', '身体前倾准备', '支撑扶手转移', '调整坐姿稳定'] },
  { id: 3, name: '核心稳定训练', desc: '坐位平衡/躯干控制', duration: '12分钟', icon: 'activity', level: '进阶', color: 'green',
    steps: ['坐位深呼吸 2分钟', '躯干前倾后仰 3分钟', '侧向移动训练 4分钟', '平衡维持 3分钟'] },
  { id: 4, name: '下肢活动训练', desc: '关节活动度维持', duration: '10分钟', icon: 'footprints', level: '入门', color: 'gold',
    steps: ['踝关节屈伸 3分钟', '膝关节屈伸 3分钟', '髋关节外展 2分钟', '按摩放松 2分钟'] },
]

// ===== 登录页模拟数据 =====
// 模拟账号：王秀兰（默认账号）
export const loginAccounts = {
  // 验证码登录：手机号 + 验证码
  phoneAccount: {
    phone: '138 0000 6868',
    phonePlain: '13800006868',
    smsCode: '686868',
    password: 'lifetree2026',
  },
  // 一键带入模拟数据：可填充到表单中点击登录
  demoAccount: {
    phone: '138 0000 6868',
    phonePlain: '13800006868',
    smsCode: '686868',
    username: 'wangxiulan',
    password: 'lifetree2026',
    name: '王秀兰',
    avatar: 'circle-user',
    memberLevel: '黄金树',
  },
}

// 第三方登录方式
export const thirdPartyLogins = [
  { id: 'wechat', name: '微信', icon: 'message-circle', color: '#09BB07' },
  { id: 'alipay', name: '支付宝', icon: 'wallet', color: '#1677FF' },
  { id: 'qq', name: 'QQ', icon: 'message-square', color: '#12B7F5' },
  { id: 'apple', name: 'Apple', icon: 'apple', color: '#000000' },
]

// 登录页协议
export const loginAgreements = {
  title: '用户协议与隐私政策',
  items: [
    { id: 'user', name: '《用户协议》', desc: '了解我们的服务条款与使用规范' },
    { id: 'privacy', name: '《隐私政策》', desc: '我们严格保护您的个人信息与隐私' },
  ],
}


