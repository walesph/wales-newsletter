// UI 라벨 + 차트 카테고리 key 번역 (7개 언어)
// 뉴스레터 '본문'은 newsletter_translations 테이블에서 오고,
// 여기 있는 것은 화면 고정 텍스트(제목/라벨/범례)입니다.

export const LANGUAGES = [
  { code: 'ja', label: '日本語', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ko', label: '한국어', dir: 'ltr' },
  { code: 'zh-Hant', label: '繁體中文', dir: 'ltr' },
  { code: 'zh-Hans', label: '简体中文', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
]

export const DEFAULT_LANG = 'ja'

export const dirOf = (lang) => (lang === 'ar' ? 'rtl' : 'ltr')
export const isRtl = (lang) => dirOf(lang) === 'rtl'

export const ui = {
  ja: {
    title: 'WALES通信', vol: '第{n}号', interview: '卒業生インタビュー', nationality: '国籍別',
    gender: '男女比', age: '年齢層', availability: '入学可能時期', staffColumn: 'スタッフコラム',
    weeks: '{n}週間', followUs: 'フォローする', dailyBaguio: '毎日バギオの情報更新', students: '名',
    nat: { JP: '日本', KR: '韓国', CN: '中国', TW: '台湾', SA: 'サウジアラビア', RU: 'ロシア', VN: 'ベトナム', OTHER: 'その他' },
    sex: { male: '男性', female: '女性', other: 'その他' },
    ageBand: { u20: '〜19歳', '20s': '20代', '30s': '30代', '40s': '40代', '50plus': '50歳〜' },
  },
  en: {
    title: 'WALES Newsletter', vol: 'Vol. {n}', interview: 'Graduate Interview', nationality: 'By Nationality',
    gender: 'Gender Ratio', age: 'Age Groups', availability: 'Enrollment Availability', staffColumn: 'Staff Column',
    weeks: '{n} weeks', followUs: 'Follow us', dailyBaguio: 'Daily Baguio Updates', students: '',
    nat: { JP: 'Japan', KR: 'Korea', CN: 'China', TW: 'Taiwan', SA: 'Saudi Arabia', RU: 'Russia', VN: 'Vietnam', OTHER: 'Other' },
    sex: { male: 'Male', female: 'Female', other: 'Other' },
    ageBand: { u20: 'Under 20', '20s': '20s', '30s': '30s', '40s': '40s', '50plus': '50+' },
  },
  ko: {
    title: 'WALES 통신', vol: '제{n}호', interview: '졸업생 인터뷰', nationality: '국적별',
    gender: '성비', age: '연령대', availability: '입학 가능 시기', staffColumn: '스태프 칼럼',
    weeks: '{n}주', followUs: '팔로우하기', dailyBaguio: '매일 바기오 소식', students: '명',
    nat: { JP: '일본', KR: '한국', CN: '중국', TW: '대만', SA: '사우디아라비아', RU: '러시아', VN: '베트남', OTHER: '기타' },
    sex: { male: '남성', female: '여성', other: '기타' },
    ageBand: { u20: '~19세', '20s': '20대', '30s': '30대', '40s': '40대', '50plus': '50세~' },
  },
  'zh-Hant': {
    title: 'WALES通訊', vol: '第{n}期', interview: '畢業生訪談', nationality: '國籍比例',
    gender: '男女比例', age: '年齡層', availability: '可入學時間', staffColumn: '員工專欄',
    weeks: '{n}週', followUs: '追蹤我們', dailyBaguio: '每日碧瑤資訊', students: '人',
    nat: { JP: '日本', KR: '韓國', CN: '中國', TW: '台灣', SA: '沙烏地阿拉伯', RU: '俄羅斯', VN: '越南', OTHER: '其他' },
    sex: { male: '男性', female: '女性', other: '其他' },
    ageBand: { u20: '20歲以下', '20s': '20多歲', '30s': '30多歲', '40s': '40多歲', '50plus': '50歲以上' },
  },
  'zh-Hans': {
    title: 'WALES通讯', vol: '第{n}期', interview: '毕业生访谈', nationality: '国籍比例',
    gender: '男女比例', age: '年龄段', availability: '可入学时间', staffColumn: '员工专栏',
    weeks: '{n}周', followUs: '关注我们', dailyBaguio: '每日碧瑶资讯', students: '人',
    nat: { JP: '日本', KR: '韩国', CN: '中国', TW: '台湾', SA: '沙特阿拉伯', RU: '俄罗斯', VN: '越南', OTHER: '其他' },
    sex: { male: '男性', female: '女性', other: '其他' },
    ageBand: { u20: '20岁以下', '20s': '20多岁', '30s': '30多岁', '40s': '40多岁', '50plus': '50岁以上' },
  },
  vi: {
    title: 'Bản tin WALES', vol: 'Số {n}', interview: 'Phỏng vấn cựu học viên', nationality: 'Theo quốc tịch',
    gender: 'Tỷ lệ giới tính', age: 'Nhóm tuổi', availability: 'Lịch nhập học còn trống', staffColumn: 'Chuyên mục nhân viên',
    weeks: '{n} tuần', followUs: 'Theo dõi', dailyBaguio: 'Cập nhật Baguio hằng ngày', students: 'học viên',
    nat: { JP: 'Nhật Bản', KR: 'Hàn Quốc', CN: 'Trung Quốc', TW: 'Đài Loan', SA: 'Ả Rập Xê Út', RU: 'Nga', VN: 'Việt Nam', OTHER: 'Khác' },
    sex: { male: 'Nam', female: 'Nữ', other: 'Khác' },
    ageBand: { u20: 'Dưới 20', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50plus': '50+' },
  },
  ar: {
    title: 'نشرة WALES', vol: 'العدد {n}', interview: 'مقابلة خريج', nationality: 'حسب الجنسية',
    gender: 'نسبة الجنسين', age: 'الفئات العمرية', availability: 'أماكن التسجيل المتاحة', staffColumn: 'زاوية الموظفين',
    weeks: '{n} أسابيع', followUs: 'تابعنا', dailyBaguio: 'أخبار باغيو اليومية', students: 'طالب',
    nat: { JP: 'اليابان', KR: 'كوريا', CN: 'الصين', TW: 'تايوان', SA: 'السعودية', RU: 'روسيا', VN: 'فيتنام', OTHER: 'أخرى' },
    sex: { male: 'ذكر', female: 'أنثى', other: 'آخر' },
    ageBand: { u20: 'أقل من 20', '20s': 'العشرينات', '30s': 'الثلاثينات', '40s': 'الأربعينات', '50plus': '50+' },
  },
}

// 간단한 보간: t(lang,'vol',{n:12})
export function t(lang, key, vars) {
  const dict = ui[lang] || ui[DEFAULT_LANG]
  let s = dict[key] ?? ui[DEFAULT_LANG][key] ?? key
  if (vars && typeof s === 'string') for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, vars[k])
  return s
}
