-- =============================================================
-- WALES Academy Newsletter (WALES通信) — Supabase Schema
-- =============================================================
-- 적용:  Supabase Dashboard > SQL Editor 에 붙여넣고 Run
--        또는  supabase db push  (CLI)
-- 언어 코드: ja(일본어) / ko(한국어) / en(영어) / zh(중국어)
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- 1. newsletters  : 월간 뉴스레터 본체 (원문 = 일본어 기준)
-- -------------------------------------------------------------
create table if not exists public.newsletters (
  id                uuid primary key default gen_random_uuid(),
  vol               integer      not null,                 -- 발행 호수 (예: 12)
  published_date    date         not null,
  slug              text         not null unique,          -- URL 슬러그 (예: 2026-06-vol12)
  status            text         not null default 'draft'  -- draft | published | archived
                    check (status in ('draft','published','archived')),

  -- 인터뷰 섹션
  interview_name      text,                                -- 인터뷰 대상자 이름
  interview_role      text,                                -- 직책/소속 (예: NCA 졸업생)
  interview_photo_url text,
  interview_quote     text,                                -- 대표 한마디(인용구)
  interview_body      text,                                -- 본문

  -- 통계 차트 (언어 무관 숫자 데이터, 라벨은 안정적인 key 로 저장)
  -- nationality_data: [{ "key": "JP", "value": 120 }, ...]
  -- gender_data     : [{ "key": "male", "value": 210 }, { "key": "female", "value": 180 }]
  -- age_data        : [{ "key": "u20", "value": 30 }, { "key": "20s", "value": 90 }, ...]
  nationality_data  jsonb        not null default '[]'::jsonb,
  gender_data       jsonb        not null default '[]'::jsonb,
  age_data          jsonb        not null default '[]'::jsonb,

  availability_text text,                                  -- 입학 가능 시기 안내
  staff_column      text,                                  -- 스태프 칼럼

  created_at        timestamptz  not null default now(),
  updated_at        timestamptz  not null default now()
);

create index if not exists newsletters_status_idx on public.newsletters (status);
create index if not exists newsletters_published_idx on public.newsletters (published_date desc);

-- -------------------------------------------------------------
-- 2. agents  : 수신 에이전트(파트너사)
-- -------------------------------------------------------------
create table if not exists public.agents (
  id          uuid primary key default gen_random_uuid(),
  company     text        not null,
  name        text        not null,
  email       text        not null,
  language    text        not null default 'ja'
              check (language in ('ja','ko','en','zh')),
  country     text,
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  unique (email)
);

create index if not exists agents_active_idx   on public.agents (active);
create index if not exists agents_language_idx on public.agents (language);

-- -------------------------------------------------------------
-- 3. newsletter_translations : 언어별 번역본 (ja/ko/en/zh)
-- -------------------------------------------------------------
-- translated_data(jsonb) 권장 형태:
-- {
--   "interview_role":  "...",
--   "interview_quote": "...",
--   "interview_body":  "...",
--   "availability_text":"...",
--   "staff_column":    "..."
-- }
create table if not exists public.newsletter_translations (
  id              uuid primary key default gen_random_uuid(),
  newsletter_id   uuid not null references public.newsletters (id) on delete cascade,
  language        text not null check (language in ('ja','ko','en','zh')),
  translated_data jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (newsletter_id, language)
);

create index if not exists nl_tr_newsletter_idx on public.newsletter_translations (newsletter_id);

-- -------------------------------------------------------------
-- 4. send_logs : 발송 이력
-- -------------------------------------------------------------
create table if not exists public.send_logs (
  id                uuid primary key default gen_random_uuid(),
  newsletter_id     uuid not null references public.newsletters (id) on delete cascade,
  agent_id          uuid not null references public.agents (id)      on delete cascade,
  sent_at           timestamptz not null default now(),
  status            text not null default 'sent'   -- sent | failed | skipped
                    check (status in ('sent','failed','skipped')),
  resend_message_id text,
  error_message     text,
  created_at        timestamptz not null default now()
);

create index if not exists send_logs_newsletter_idx on public.send_logs (newsletter_id);
create index if not exists send_logs_agent_idx      on public.send_logs (agent_id);
create unique index if not exists send_logs_once_idx
  on public.send_logs (newsletter_id, agent_id)
  where status = 'sent';   -- 같은 뉴스레터를 같은 에이전트에게 중복 'sent' 방지

-- -------------------------------------------------------------
-- updated_at 자동 갱신 트리거
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_newsletters_updated on public.newsletters;
create trigger trg_newsletters_updated before update on public.newsletters
  for each row execute function public.set_updated_at();

drop trigger if exists trg_nl_tr_updated on public.newsletter_translations;
create trigger trg_nl_tr_updated before update on public.newsletter_translations
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- RLS (Row Level Security)
-- -------------------------------------------------------------
-- 웹(anon)에는 '발행된' 뉴스레터와 그 번역만 읽기 허용.
-- agents / send_logs / 비공개 뉴스레터 쓰기는 service_role(서버)만.
alter table public.newsletters             enable row level security;
alter table public.newsletter_translations enable row level security;
alter table public.agents                  enable row level security;
alter table public.send_logs               enable row level security;

drop policy if exists "public read published newsletters" on public.newsletters;
create policy "public read published newsletters"
  on public.newsletters for select
  using (status = 'published');

drop policy if exists "public read translations of published" on public.newsletter_translations;
create policy "public read translations of published"
  on public.newsletter_translations for select
  using (
    exists (
      select 1 from public.newsletters n
      where n.id = newsletter_translations.newsletter_id
        and n.status = 'published'
    )
  );

-- agents / send_logs : anon 정책 없음 → service_role 키로만 접근(서버/Edge Function).

-- -------------------------------------------------------------
-- 시드 데이터 (개발용 샘플 1건)
-- -------------------------------------------------------------
insert into public.newsletters
  (vol, published_date, slug, status,
   interview_name, interview_role, interview_quote, interview_body,
   nationality_data, gender_data, age_data, availability_text, staff_column)
values
  (12, '2026-06-01', '2026-06-vol12', 'published',
   '田中 美咲', 'NCA 졸업생 / 現 통역사',
   'WALES에서의 6개월이 제 인생을 바꿨습니다.',
   '입학 당시 영어로 한마디도 못 했지만, 매일의 회화 수업과 따뜻한 강사진 덕분에 자신감을 얻었습니다. 지금은 통역사로 일하고 있습니다.',
   '[{"key":"JP","value":120},{"key":"KR","value":64},{"key":"CN","value":48},{"key":"VN","value":30},{"key":"TW","value":18}]'::jsonb,
   '[{"key":"male","value":140},{"key":"female","value":140}]'::jsonb,
   '[{"key":"u20","value":40},{"key":"20s","value":150},{"key":"30s","value":60},{"key":"40s","value":20},{"key":"50plus","value":10}]'::jsonb,
   '2026년 7월·8월 입학 정원에 여유가 있습니다. 9월은 마감 임박입니다.',
   '이번 달은 신규 IELTS 대비 코스를 오픈했습니다. 많은 관심 부탁드립니다 — WALES 사무국 드림.')
on conflict (slug) do nothing;

-- 샘플 에이전트
insert into public.agents (company, name, email, language, country, active) values
  ('Tokyo Study Abroad', '佐藤 健',  'sato@example.com',   'ja', 'Japan',  true),
  ('서울유학원',          '김민준',   'kim@example.com',    'ko', 'Korea',  true),
  ('Global Path',        'John Lee', 'john@example.com',   'en', 'USA',    true),
  ('上海留学中心',        '王芳',     'wang@example.com',   'zh', 'China',  true)
on conflict (email) do nothing;
