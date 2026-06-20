// .env(Supabase) 가 없을 때 화면을 채우기 위한 샘플 — supabase_schema.sql 시드와 동일 구조
export const sampleNewsletter = {
  id: 'sample',
  vol: 12,
  published_date: '2026-06-01',
  slug: '2026-06-vol12',
  status: 'published',
  interview_name: '田中 美咲',
  interview_role: 'NCA 졸업생 / 現 통역사',
  interview_photo_url: '',
  interview_quote: 'WALES에서의 6개월이 제 인생을 바꿨습니다.',
  interview_body:
    '입학 당시 영어로 한마디도 못 했지만, 매일의 회화 수업과 따뜻한 강사진 덕분에 자신감을 얻었습니다. 지금은 통역사로 일하고 있습니다.',
  nationality_data: [
    { key: 'JP', value: 120 },
    { key: 'KR', value: 64 },
    { key: 'CN', value: 48 },
    { key: 'VN', value: 30 },
    { key: 'TW', value: 18 },
  ],
  gender_data: [
    { key: 'male', value: 140 },
    { key: 'female', value: 140 },
  ],
  age_data: [
    { key: 'u20', value: 40 },
    { key: '20s', value: 150 },
    { key: '30s', value: 60 },
    { key: '40s', value: 20 },
    { key: '50plus', value: 10 },
  ],
  availability_text: '2026년 7월·8월 입학 정원에 여유가 있습니다. 9월은 마감 임박입니다.',
  staff_column:
    '이번 달은 신규 IELTS 대비 코스를 오픈했습니다. 많은 관심 부탁드립니다 — WALES 사무국 드림.',
}

// 언어별 번역 오버라이드(있으면 본문 텍스트를 덮어씀). 데모용 일부만.
export const sampleTranslations = {
  en: {
    interview_role: 'NCA Graduate / Interpreter',
    interview_quote: 'Six months at WALES changed my life.',
    interview_body:
      "I couldn't speak a word of English when I enrolled, but daily conversation classes and warm teachers gave me confidence. Today I work as an interpreter.",
    availability_text:
      'Seats are still available for July & August 2026 intakes. September is filling up fast.',
    staff_column:
      'This month we launched a new IELTS prep course. We look forward to your interest. — WALES Office',
  },
}
