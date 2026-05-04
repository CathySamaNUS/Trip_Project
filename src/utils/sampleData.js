import { uid } from './id.js'
import { saveTrip, getAllTrips } from './storage.js'
import { composeLocationMemory } from './mockGenerator.js'

const SAMPLE_FLAG = 'trip_memory_sample_seeded_v1'

const placeholder = (seed, w = 480, h = 320) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`

export const SAMPLE_TRIP_ID = 'trip_sample_taiwan_rain'

export const buildSampleTrip = () => {
  const tripId = SAMPLE_TRIP_ID

  const loc1 = {
    id: 'loc_sample_minsu',
    tripId,
    locationName: '民宿',
    locationType: '住宿',
    locationTime: '第一天傍晚',
    order: 1,
    mapLocation: null,
    photos: [
      { id: uid('p'), url: '/photos/mountain.jpeg', name: '阳台外的山', isCover: true }
    ],
    memoryInput: {
      oneLineMemory: '到民宿时下着小雨，老板娘留了一盏灯。',
      memorableDetailsText: '推门进去，木地板很温暖，桌上有一壶热茶。窗外的雨声变得很远。',
      memorableDetailTags: ['下雨了', '遇到热情的人'],
      moodTags: ['温暖', '松弛'],
      moodText: '像是被这场雨悄悄收留了。',
      people: [],
      keepsakes: ['民宿名片'],
      quote: ''
    },
    memorySpots: [],
    generatedContent: null,
    generated: true
  }
  loc1.generatedContent = composeLocationMemory(loc1)

  const loc2 = {
    id: 'loc_sample_shrine',
    tripId,
    locationName: '雨中的神社路线',
    locationType: '街道',
    locationTime: '第二天上午',
    order: 2,
    mapLocation: null,
    photos: [
      { id: 'p_shrine_temple', url: '/photos/temple.jpeg', name: '雨里的神社', isCover: true },
      { id: 'p_shrine_rail', url: '/photos/rail.jpeg', name: '走过的小路' }
    ],
    memoryInput: {
      oneLineMemory: '一路在雨里走，灯笼一盏一盏亮起来。',
      memorableDetailsText: '石板路有点滑，伞一直歪。我们走错了一段路，但反而看到了别的风景。',
      memorableDetailTags: ['下雨了', '走错路'],
      moodTags: ['安静', '有电影感'],
      moodText: '雨像是一直在替这条路打节拍。',
      people: [],
      keepsakes: [],
      quote: ''
    },
    memorySpots: [
      {
        id: uid('ms'),
        title: '走错的那一段',
        shortText: '走错的小巷里有一只在屋檐下避雨的小狗。',
        photoIds: ['p_shrine_rail'],
        moodTags: ['治愈'],
        keepsakes: [],
        people: [],
        quote: ''
      }
    ],
    generatedContent: null,
    generated: true
  }
  loc2.generatedContent = composeLocationMemory(loc2)

  const loc3 = {
    id: 'loc_sample_temple',
    tripId,
    locationName: '关公庙',
    locationType: '寺庙',
    locationTime: '第二天下午',
    order: 3,
    mapLocation: null,
    photos: [
      { id: uid('p'), url: '/photos/neko2.jpeg', name: '庙里遇到的猫', isCover: true }
    ],
    memoryInput: {
      oneLineMemory: '香火气很重，外面雨刚停。',
      memorableDetailsText: '我们求了一支签，签文意思是：慢慢来。',
      memorableDetailTags: ['偶然路过'],
      moodTags: ['安静', '怀旧'],
      moodText: '像在一个旧的下午里待了一会儿。',
      people: [],
      keepsakes: ['一支签'],
      quote: ''
    },
    memorySpots: [],
    generatedContent: null,
    generated: true
  }
  loc3.generatedContent = composeLocationMemory(loc3)

  const loc4 = {
    id: 'loc_sample_congyou',
    tripId,
    locationName: '彩虹葱油饼店',
    locationType: '美食',
    locationTime: '傍晚',
    order: 4,
    mapLocation: null,
    photos: [
      { id: 'p_congyou_door', url: '/photos/congyoubing.jpeg', name: '店门口', isCover: true },
      { id: 'p_congyou_cat', url: '/photos/neko3.jpeg', name: '店里的猫' },
      { id: 'p_congyou_tea', url: '/photos/tea.jpeg', name: '老板请的茶' }
    ],
    memoryInput: {
      oneLineMemory: '老板请我们喝茶，店里有很多猫，我买了一个小挂件。',
      memorableDetailsText:
        '刚才还关着的店突然开了，雨声被留在门外，老板倒了茶，猫懒懒地趴在角落。',
      memorableDetailTags: [
        '下雨了', '被别人推荐', '遇到店主', '遇到猫', '喝了茶/饮料', '买了纪念品'
      ],
      moodTags: ['温暖', '治愈', '惊喜'],
      moodText: '像是在一场雨里误打误撞得到了一点温柔。',
      people: [
        {
          id: uid('per'),
          personName: '葱油饼店老板',
          personAction: '请我们喝茶，讲了自己为什么在这里开店',
          personFeeling: '热情、温暖、很有故事'
        }
      ],
      keepsakes: ['老板请的茶', '葱油饼店的小挂件'],
      quote: '老板说：“我就是喜欢这个地方，所以在这里开店。”'
    },
    memorySpots: [
      {
        id: uid('ms'),
        title: '老板请茶',
        shortText: '茶杯放在桌上，热气慢慢升起来，外面的雨声突然远了一点。',
        photoIds: ['p_congyou_tea'],
        moodTags: ['温暖'],
        keepsakes: ['老板请的茶'],
        people: [],
        quote: ''
      },
      {
        id: uid('ms'),
        title: '店里的猫',
        shortText: '几只猫懒懒地窝在角落，好像早就习惯了旅人带着雨气进门。',
        photoIds: ['p_congyou_cat'],
        moodTags: ['治愈'],
        keepsakes: [],
        people: [],
        quote: ''
      },
      {
        id: uid('ms'),
        title: '买下小挂件',
        shortText: '你买了一个小挂件，像是把这段绕远的雨天路线轻轻收起来。',
        photoIds: ['p_congyou_door'],
        moodTags: ['惊喜'],
        keepsakes: ['葱油饼店的小挂件'],
        people: [],
        quote: ''
      }
    ],
    generatedContent: null,
    generated: true
  }
  loc4.generatedContent = composeLocationMemory(loc4)

  const trip = {
    id: tripId,
    tripTitle: '台湾雨天旅行',
    startDate: '2024-04-18',
    endDate: '2024-04-23',
    tripStyle: ['温暖手账', '雨天氛围', '文艺怀旧'],
    companions: ['小林', '阿鱼'],
    locations: [loc1, loc2, loc3, loc4],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  return trip
}

export const ensureSampleTrip = () => {
  saveTrip(buildSampleTrip())
  return SAMPLE_TRIP_ID
}

export const seedOnce = () => {
  if (localStorage.getItem(SAMPLE_FLAG)) return
  ensureSampleTrip()
  localStorage.setItem(SAMPLE_FLAG, '1')
}
