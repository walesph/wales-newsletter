-- =============================================================
-- WALES Academy Newsletter (WALES通信) — Supabase Schema  (Phase 1)
-- =============================================================
-- 적용:  Supabase Dashboard > SQL Editor 에 붙여넣고 Run
-- 언어 7개: ja(마스터) / en / ko / zh-Hant(번체) / zh-Hans(간체) / vi / ar(아랍, RTL)
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- 1. newsletters  : 월간 뉴스레터 본체 (원문 = 일본어 마스터)
-- -------------------------------------------------------------
create table if not exists public.newsletters (
  id                uuid primary key default gen_random_uuid(),
  vol               integer      not null,
  published_date    date         not null,
  slug              text         not null unique,
  status            text         not null default 'draft'
                    check (status in ('draft','published','archived')),

  -- 커버 인사말 (이메일 본문 상단, 담당자 개인 메시지)
  cover_message     text,

  -- 卒業生インタビュー
  interview_name      text,
  interview_gender    text,                                -- male | female | other
  interview_weeks     integer,                             -- 수강 기간(주)
  interview_role      text,
  interview_quote     text,
  interview_body      text,
  interview_photo_url text,
  interview_video_url text,
  instagram_handle    text,                                -- 예: @walesbaguio2006

  -- SNS 안내 (毎日バギオ情報)
  sns_x_url         text,

  -- 통계 (언어 무관 숫자, 라벨은 안정적 key 로 저장. PDF 는 % 표기)
  -- nationality_data: [{ "key": "TW", "value": 42 }, ...]
  -- gender_data     : [{ "key": "male", "value": 51 }, { "key": "female", "value": 49 }]
  -- age_data        : [{ "key": "u20", "value": 23 }, ...]
  nationality_data  jsonb        not null default '[]'::jsonb,
  gender_data       jsonb        not null default '[]'::jsonb,
  age_data          jsonb        not null default '[]'::jsonb,

  availability_text text,                                  -- 空き状況
  staff_column      text,                                  -- スタッフコラム

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
              check (language in ('ja','en','ko','zh-Hant','zh-Hans','vi','ar')),
  country     text,
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  unique (email)
);

create index if not exists agents_active_idx   on public.agents (active);
create index if not exists agents_language_idx on public.agents (language);

-- -------------------------------------------------------------
-- 3. newsletter_translations : 언어별 번역본 + 검수 상태
-- -------------------------------------------------------------
-- translated_data(jsonb): { cover_message, interview_role, interview_quote,
--                           interview_body, availability_text, staff_column }
create table if not exists public.newsletter_translations (
  id              uuid primary key default gen_random_uuid(),
  newsletter_id   uuid not null references public.newsletters (id) on delete cascade,
  language        text not null check (language in ('ja','en','ko','zh-Hant','zh-Hans','vi','ar')),
  translated_data jsonb not null default '{}'::jsonb,
  review_status   text  not null default 'draft'           -- draft(AI번역) | approved(검수완료)
                  check (review_status in ('draft','approved')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (newsletter_id, language)
);

create index if not exists nl_tr_newsletter_idx on public.newsletter_translations (newsletter_id);

-- -------------------------------------------------------------
-- 4. send_logs : 발송 이력 (분할 발송 추적)
-- -------------------------------------------------------------
create table if not exists public.send_logs (
  id                uuid primary key default gen_random_uuid(),
  newsletter_id     uuid not null references public.newsletters (id) on delete cascade,
  agent_id          uuid not null references public.agents (id)      on delete cascade,
  sent_at           timestamptz not null default now(),
  status            text not null default 'sent'
                    check (status in ('sent','failed','skipped')),
  resend_message_id text,
  error_message     text,
  created_at        timestamptz not null default now()
);

create index if not exists send_logs_newsletter_idx on public.send_logs (newsletter_id);
create index if not exists send_logs_agent_idx      on public.send_logs (agent_id);
-- 같은 뉴스레터를 같은 에이전트에게 중복 'sent' 방지 → 분할 발송 시 이미 보낸 사람 자동 제외
create unique index if not exists send_logs_once_idx
  on public.send_logs (newsletter_id, agent_id)
  where status = 'sent';

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
-- 이미지 Storage 버킷 (인터뷰/칼럼 사진) — 공개 읽기
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('newsletter-images', 'newsletter-images', true)
on conflict (id) do nothing;

-- -------------------------------------------------------------
-- RLS
-- -------------------------------------------------------------
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
-- agents / send_logs : anon 정책 없음 → service_role(Worker)만 접근.

-- -------------------------------------------------------------
-- 시드 데이터 — 실제 Vol.17 (2026.06)
-- -------------------------------------------------------------
insert into public.newsletters
  (vol, published_date, slug, status, cover_message,
   interview_name, interview_gender, interview_weeks, interview_quote, interview_body,
   instagram_handle, sns_x_url,
   nationality_data, gender_data, age_data, availability_text, staff_column)
values
  (17, '2026-06-18', '2026-06-vol17', 'published',
   'いつもお世話になっております。バギオにあります英語学校「WALES」の日本人スタッフの佐藤です。夏休みのご留学に向けてお忙しい時期かと思います。WALESも皆様のおかげで８月９日までは満室となりました。どうもありがとうございます。８月９日以降は空きがございますので、夏休みの後半にご留学をお考えの方がおりましたら、お気軽にお問合せ下さいませ。こちらのメールにWALES通信の６月号を添付しております。お仕事に疲れたお時間にでも、お読みいただけましたら幸いです。',
   'KAZ', 'male', 7,
   '留学を考えている時点で、他の人よりもすでに半歩前に出ている。だからあともう半歩前に出て、留学に踏み出してほしい。',
   '20代の時にワーキングホリディでオーストラリア、ニュージーランド、カナダの3ヵ国に1年ずつ滞在した経験のあるKAZさんが今回の留学に求めたのは「英語力のブラッシュアップ」。10年間海外から離れてさび付いた英語を、この後に行くアメリカで通用するものにするための留学でした。フィリピンを選んだ理由はもちろん費用。その中でもバギオを選んだのは、海よりも山の方が勉強に適した環境で、学生の年齢層も高めではないかと思ったからです。',
   '@walesbaguio2006', 'https://x.com/JapanWales',
   '[{"key":"TW","value":42},{"key":"SA","value":21},{"key":"KR","value":19},{"key":"JP","value":13},{"key":"CN","value":4},{"key":"RU","value":2}]'::jsonb,
   '[{"key":"male","value":51},{"key":"female","value":49}]'::jsonb,
   '[{"key":"u20","value":23},{"key":"20s","value":36},{"key":"30s","value":17},{"key":"40s","value":9},{"key":"50plus","value":15}]'::jsonb,
   '5月は夏休みに向けて多くのお申込みをいただきましてありがとうございます。皆様のご協力のおかげで7月12日から8月9日まで満室となり、お部屋のご案内が出来なくなりました。8月9日以降はお部屋の空きがございますので、夏休みの後半に英語留学をお考えの方がおりましたら、ご案内が可能ですのでどうぞよろしくお願いいたします。',
   'こんにちは。WALES日本人スタッフの佐藤です。最近のバギオは午後から雨が降り始めるという雨期のような天気が続くようになりました。除湿器が大活躍する時期になったようです。スタジオタイプとプレミアムスタジオのお部屋には除湿器が設置されております。')
on conflict (slug) do nothing;

-- 샘플 에이전트 (언어별 1명씩)
insert into public.agents (company, name, email, language, country, active) values
  ('Tokyo Study Abroad', '佐藤 健',   'sato@example.com',  'ja',      'Japan',        true),
  ('Global Path',        'John Lee',  'john@example.com',  'en',      'USA',          true),
  ('서울유학원',          '김민준',    'kim@example.com',   'ko',      'Korea',        true),
  ('台北遊學中心',        '陳大文',    'chen@example.com',  'zh-Hant', 'Taiwan',       true),
  ('上海留学中心',        '王芳',      'wang@example.com',  'zh-Hans', 'China',        true),
  ('Hanoi Du Học',       'Nguyen An', 'nguyen@example.com','vi',      'Vietnam',      true),
  ('Riyadh Study',       'Al Saud',   'saud@example.com',  'ar',      'Saudi Arabia', true)
on conflict (email) do nothing;
