// .env(Supabase) 가 없을 때 화면을 채우기 위한 샘플 — 실제 Vol.17 기준
export const sampleNewsletter = {
  id: 'sample',
  vol: 17,
  published_date: '2026-06-18',
  status: 'published',
  cover_message:
    'いつもお世話になっております。バギオの英語学校「WALES」日本人スタッフの佐藤です。WALESも皆様のおかげで８月９日までは満室となりました。８月９日以降は空きがございますので、お気軽にお問合せ下さいませ。',
  interview_name: 'KAZ',
  interview_gender: 'male',
  interview_weeks: 7,
  interview_role: '',
  interview_quote:
    '留学を考えている時点で、他の人よりもすでに半歩前に出ている。だからあともう半歩前に出て、留学に踏み出してほしい。',
  interview_body:
    '20代でワーキングホリディを経験したKAZさんが今回求めたのは「英語力のブラッシュアップ」。10年間さび付いた英語を、この後に行くアメリカで通用するものにするための留学でした。バギオを選んだのは、海よりも山の方が勉強に適した環境だと思ったからです。',
  interview_photo_url: '',
  interview_video_url: '',
  instagram_handle: '@walesbaguio2006',
  sns_x_url: 'https://x.com/JapanWales',
  nationality_data: [
    { key: 'TW', value: 42 },
    { key: 'SA', value: 21 },
    { key: 'KR', value: 19 },
    { key: 'JP', value: 13 },
    { key: 'CN', value: 4 },
    { key: 'RU', value: 2 },
  ],
  gender_data: [
    { key: 'male', value: 51 },
    { key: 'female', value: 49 },
  ],
  age_data: [
    { key: 'u20', value: 23 },
    { key: '20s', value: 36 },
    { key: '30s', value: 17 },
    { key: '40s', value: 9 },
    { key: '50plus', value: 15 },
  ],
  availability_text:
    '皆様のご協力のおかげで7月12日から8月9日まで満室となりました。8月9日以降はお部屋の空きがございますので、夏休みの後半に英語留学をお考えの方はご案内が可能です。',
  staff_column:
    'こんにちは。WALES日本人スタッフの佐藤です。最近のバギオは午後から雨が降り始める雨期のような天気が続いています。除湿器が大活躍する時期になりました。',
}

// 언어별 번역 오버라이드(데모용 일부). 없으면 일본어 마스터로 폴백.
export const sampleTranslations = {
  en: {
    interview_quote:
      "By the time you're thinking about studying abroad, you're already half a step ahead. Take one more half-step and go for it.",
    interview_body:
      'KAZ, who did working-holiday stints in his twenties, wanted to brush up the English that had rusted over 10 years so it would work in the US. He chose Baguio because the mountains suit studying better than the coast.',
    availability_text:
      'Thanks to everyone, we are fully booked from July 12 to August 9. Rooms open up after August 9, so we can still accommodate late-summer enrollments.',
    staff_column:
      'Hello, this is Sato, the Japanese staff at WALES. Baguio has had rainy-season weather lately, with afternoon showers — peak dehumidifier season.',
  },
  ko: {
    interview_quote:
      '유학을 생각하는 시점에 이미 남들보다 반걸음 앞서 있습니다. 거기서 반걸음만 더 나아가 유학에 도전하세요.',
    interview_body:
      '20대에 워킹홀리데이를 경험한 KAZ 씨가 이번에 원한 것은 "영어 실력 브러시업". 10년간 녹슨 영어를 미국에서 통할 수준으로 끌어올리기 위한 유학이었습니다. 바기오를 택한 건 바다보다 산이 공부에 적합하다고 생각했기 때문입니다.',
    availability_text:
      '여러분 덕분에 7월 12일부터 8월 9일까지 만실이 되었습니다. 8월 9일 이후에는 빈방이 있으니 여름방학 후반 유학을 고려 중이시면 안내 가능합니다.',
    staff_column:
      '안녕하세요. WALES 일본인 스태프 사토입니다. 요즘 바기오는 오후부터 비가 내리는 우기 같은 날씨가 이어지고 있습니다. 제습기가 활약하는 시기가 되었네요.',
  },
}
