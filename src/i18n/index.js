// UI 라벨 + 차트 카테고리 key 번역 (ja / ko / en / zh)
// 뉴스레터 '본문'은 newsletter_translations 테이블에서 오고,
// 여기 있는 것은 화면 고정 텍스트(제목/라벨/범례)입니다.

export const LANGUAGES = [
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
]

export const DEFAULT_LANG = 'ja'

export const ui = {
  ja: {
    title: 'WALES通信',
    vol: '第{n}号',
    interview: '卒業生インタビュー',
    nationality: '国籍別',
    gender: '男女比',
    age: '年齢層',
    availability: '入学可能時期',
    staffColumn: 'スタッフコラム',
    students: '名',
    nat: { JP: '日本', KR: '韓国', CN: '中国', VN: 'ベトナム', TW: '台湾', OTHER: 'その他' },
    sex: { male: '男性', female: '女性', other: 'その他' },
    ageBand: { u20: '〜19歳', '20s': '20代', '30s': '30代', '40s': '40代', '50plus': '50歳〜' },
  },
  ko: {
    title: 'WALES 통신',
    vol: '제{n}호',
    interview: '졸업생 인터뷰',
    nationality: '국적별',
    gender: '성비',
    age: '연령대',
    availability: '입학 가능 시기',
    staffColumn: '스태프 칼럼',
    students: '명',
    nat: { JP: '일본', KR: '한국', CN: '중국', VN: '베트남', TW: '대만', OTHER: '기타' },
    sex: { male: '남성', female: '여성', other: '기타' },
    ageBand: { u20: '~19세', '20s': '20대', '30s': '30대', '40s': '40대', '50plus': '50세~' },
  },
  en: {
    title: 'WALES Newsletter',
    vol: 'Vol. {n}',
    interview: 'Graduate Interview',
    nationality: 'By Nationality',
    gender: 'Gender Ratio',
    age: 'Age Groups',
    availability: 'Enrollment Availability',
    staffColumn: 'Staff Column',
    students: 'students',
    nat: { JP: 'Japan', KR: 'Korea', CN: 'China', VN: 'Vietnam', TW: 'Taiwan', OTHER: 'Other' },
    sex: { male: 'Male', female: 'Female', other: 'Other' },
    ageBand: { u20: 'Under 20', '20s': '20s', '30s': '30s', '40s': '40s', '50plus': '50+' },
  },
  zh: {
    title: 'WALES通讯',
    vol: '第{n}期',
    interview: '毕业生访谈',
    nationality: '按国籍',
    gender: '男女比例',
    age: '年龄段',
    availability: '可入学时间',
    staffColumn: '员工专栏',
    students: '人',
    nat: { JP: '日本', KR: '韩国', CN: '中国', VN: '越南', TW: '台湾', OTHER: '其他' },
    sex: { male: '男性', female: '女性', other: '其他' },
    ageBand: { u20: '20岁以下', '20s': '20多岁', '30s': '30多岁', '40s': '40多岁', '50plus': '50岁以上' },
  },
}

// 간단한 보간: t(lang,'vol',{n:12})
export function t(lang, key, vars) {
  const dict = ui[lang] || ui[DEFAULT_LANG]
  let s = dict[key] ?? ui[DEFAULT_LANG][key] ?? key
  if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, vars[k])
  return s
}
