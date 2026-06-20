// WALES通信 — Cloudflare Worker
//   fetch     : 관리자/수동 발송 + 테스트 발송 (POST)
//   scheduled : 매월 Cron 예약 발송 (env.AUTO_SEND === 'true' 일 때만 실제 발송)
//
// 시크릿(wrangler secret put):  SUPABASE_SERVICE_ROLE_KEY  RESEND_API_KEY  ANTHROPIC_API_KEY  FUNCTION_SECRET
// 변수(wrangler.jsonc vars)  :  SUPABASE_URL  NEWSLETTER_FROM  AUTO_SEND

// ── 이메일 라벨 사전 (웹 i18n 의 축약본) ─────────────────────────────
const L = {
  ja: { title: 'WALES通信', vol: '第{n}号', interview: '卒業生インタビュー', nationality: '国籍別', gender: '男女比', age: '年齢層', availability: '入学可能時期', staffColumn: 'スタッフコラム', unit: '名', subject: 'WALES通信 第{n}号', nat: { JP: '日本', KR: '韓国', CN: '中国', VN: 'ベトナム', TW: '台湾', OTHER: 'その他' }, sex: { male: '男性', female: '女性', other: 'その他' }, ageBand: { u20: '〜19歳', '20s': '20代', '30s': '30代', '40s': '40代', '50plus': '50歳〜' } },
  ko: { title: 'WALES 통신', vol: '제{n}호', interview: '졸업생 인터뷰', nationality: '국적별', gender: '성비', age: '연령대', availability: '입학 가능 시기', staffColumn: '스태프 칼럼', unit: '명', subject: 'WALES 통신 제{n}호', nat: { JP: '일본', KR: '한국', CN: '중국', VN: '베트남', TW: '대만', OTHER: '기타' }, sex: { male: '남성', female: '여성', other: '기타' }, ageBand: { u20: '~19세', '20s': '20대', '30s': '30대', '40s': '40대', '50plus': '50세~' } },
  en: { title: 'WALES Newsletter', vol: 'Vol. {n}', interview: 'Graduate Interview', nationality: 'By Nationality', gender: 'Gender Ratio', age: 'Age Groups', availability: 'Enrollment Availability', staffColumn: 'Staff Column', unit: '', subject: 'WALES Newsletter Vol. {n}', nat: { JP: 'Japan', KR: 'Korea', CN: 'China', VN: 'Vietnam', TW: 'Taiwan', OTHER: 'Other' }, sex: { male: 'Male', female: 'Female', other: 'Other' }, ageBand: { u20: 'Under 20', '20s': '20s', '30s': '30s', '40s': '40s', '50plus': '50+' } },
  zh: { title: 'WALES通讯', vol: '第{n}期', interview: '毕业生访谈', nationality: '按国籍', gender: '男女比例', age: '年龄段', availability: '可入学时间', staffColumn: '员工专栏', unit: '人', subject: 'WALES通讯 第{n}期', nat: { JP: '日本', KR: '韩国', CN: '中国', VN: '越南', TW: '台湾', OTHER: '其他' }, sex: { male: '男性', female: '女性', other: '其他' }, ageBand: { u20: '20岁以下', '20s': '20多岁', '30s': '30多岁', '40s': '40多岁', '50plus': '50岁以上' } },
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

function barTable(data, labelFor, unit) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const total = data.reduce((s, d) => s + d.value, 0)
  const rows = data
    .map((d) => {
      const w = Math.round((d.value / max) * 240)
      const share = total ? Math.round((d.value / total) * 100) : 0
      return `<tr>
        <td style="padding:4px 8px;color:#475569;font-size:13px;white-space:nowrap">${esc(labelFor(d.key))}</td>
        <td style="padding:4px 8px;width:100%"><span style="display:inline-block;height:14px;width:${w}px;background:#7c3aed;border-radius:3px"></span></td>
        <td style="padding:4px 8px;color:#64748b;font-size:13px;white-space:nowrap;text-align:right">${d.value}${unit} (${share}%)</td>
      </tr>`
    })
    .join('')
  return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${rows}</table>`
}

function renderEmail(nl, lang) {
  const l = L[lang] ?? L.ja
  const vol = l.vol.replace('{n}', nl.vol)
  const section = (title, inner) =>
    `<tr><td style="padding:22px 28px;border-top:1px solid #f1f5f9"><h2 style="margin:0 0 12px;font-size:17px;color:#0f172a">${esc(title)}</h2>${inner}</td></tr>`
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#f1f5f9"><tr><td align="center" style="padding:24px 12px">
  <table cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border-radius:14px;overflow:hidden">
    <tr><td style="background:#6d28d9;background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px;color:#fff">
      <div style="font-size:13px;opacity:.85">${esc(vol)} · ${esc(nl.published_date)}</div>
      <div style="font-size:26px;font-weight:700;margin-top:4px">${esc(l.title)}</div>
    </td></tr>
    ${section(l.interview, `<p style="margin:0;font-weight:600;color:#0f172a">${esc(nl.interview_name)} <span style="font-weight:400;color:#64748b">— ${esc(nl.interview_role)}</span></p>${nl.interview_quote ? `<blockquote style="margin:12px 0;padding-left:14px;border-left:3px solid #a78bfa;font-size:16px;color:#1e293b">“${esc(nl.interview_quote)}”</blockquote>` : ''}<p style="margin:8px 0 0;color:#475569;line-height:1.6">${esc(nl.interview_body)}</p>`)}
    ${section(l.nationality, barTable(nl.nationality_data ?? [], (k) => l.nat[k] ?? k, l.unit))}
    ${section(l.gender, barTable(nl.gender_data ?? [], (k) => l.sex[k] ?? k, l.unit))}
    ${section(l.age, barTable(nl.age_data ?? [], (k) => l.ageBand[k] ?? k, l.unit))}
    ${nl.availability_text ? section(l.availability, `<p style="margin:0;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;color:#92400e">${esc(nl.availability_text)}</p>`) : ''}
    ${nl.staff_column ? section(l.staffColumn, `<p style="margin:0;color:#475569;line-height:1.6">${esc(nl.staff_column)}</p>`) : ''}
    <tr><td style="padding:18px 28px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center">© ${new Date(nl.published_date).getFullYear()} WALES Academy · walesportal.com</td></tr>
  </table></td></tr></table></body></html>`
}

// ── Supabase PostgREST (service_role) ───────────────────────────────
function sb(env, path, init = {}) {
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
}

async function sendResend(env, to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.NEWSLETTER_FROM, to, subject, html }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.message || `Resend ${res.status}`)
  return body?.id
}

// 핵심 발송 로직 — fetch(수동)·scheduled(예약) 공용
async function sendNewsletter(env, { newsletter_id, only_language }) {
  const nlRes = await sb(env, `newsletters?id=eq.${newsletter_id}&select=*`)
  const nlRows = await nlRes.json()
  const nl = nlRows[0]
  if (!nl) throw new Error('newsletter not found')

  const trs = await (
    await sb(env, `newsletter_translations?newsletter_id=eq.${newsletter_id}&select=language,translated_data`)
  ).json()
  const trByLang = {}
  for (const r of trs ?? []) trByLang[r.language] = r.translated_data
  const localized = (lang) => ({ ...nl, ...(trByLang[lang] ?? {}) })
  const subjectFor = (lang) => (L[lang] ?? L.ja).subject.replace('{n}', nl.vol)

  let agentsPath = `agents?active=eq.true&select=*`
  if (only_language) agentsPath += `&language=eq.${only_language}`
  const agents = await (await sb(env, agentsPath)).json()

  const results = []
  for (const a of agents ?? []) {
    const lang = a.language ?? 'ja'
    try {
      const id = await sendResend(env, a.email, subjectFor(lang), renderEmail(localized(lang), lang))
      await sb(env, 'send_logs', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ newsletter_id, agent_id: a.id, status: 'sent', resend_message_id: id }),
      })
      results.push({ agent: a.email, status: 'sent', id })
    } catch (e) {
      await sb(env, 'send_logs', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ newsletter_id, agent_id: a.id, status: 'failed', error_message: String(e) }),
      })
      results.push({ agent: a.email, status: 'failed', error: String(e) })
    }
  }
  const sent = results.filter((r) => r.status === 'sent').length
  return { total: results.length, sent, failed: results.length - sent, results }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } })
}

async function authorized(req, env) {
  if (!env.FUNCTION_SECRET) return false
  const got = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/, '')
  const a = new TextEncoder().encode(got)
  const b = new TextEncoder().encode(env.FUNCTION_SECRET)
  if (a.byteLength !== b.byteLength) return false
  return crypto.subtle.timingSafeEqual(a, b)
}

export default {
  async fetch(req, env, ctx) {
    if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)
    if (!(await authorized(req, env))) return json({ error: 'unauthorized' }, 401)

    let payload
    try {
      payload = await req.json()
    } catch {
      return json({ error: 'bad json' }, 400)
    }
    const { newsletter_id, test_email, only_language } = payload ?? {}
    if (!newsletter_id) return json({ error: 'newsletter_id required' }, 400)

    try {
      // 테스트 발송 — 단일 수신자, 로그 미기록
      if (test_email) {
        const lang = only_language ?? 'ja'
        const nlRows = await (await sb(env, `newsletters?id=eq.${newsletter_id}&select=*`)).json()
        const nl = nlRows[0]
        if (!nl) return json({ error: 'newsletter not found' }, 404)
        const trs = await (
          await sb(env, `newsletter_translations?newsletter_id=eq.${newsletter_id}&select=language,translated_data`)
        ).json()
        const tr = (trs ?? []).find((r) => r.language === lang)?.translated_data ?? {}
        const subject = (L[lang] ?? L.ja).subject.replace('{n}', nl.vol)
        const id = await sendResend(env, test_email, subject, renderEmail({ ...nl, ...tr }, lang))
        return json({ ok: true, test: true, message_id: id })
      }

      const result = await sendNewsletter(env, { newsletter_id, only_language })
      ctx.waitUntil(
        Promise.resolve(console.log(JSON.stringify({ evt: 'send', newsletter_id, ...result, results: undefined }))),
      )
      return json({ ok: true, ...result })
    } catch (e) {
      console.error(JSON.stringify({ evt: 'send_error', error: String(e) }))
      return json({ ok: false, error: String(e) }, 500)
    }
  },

  async scheduled(event, env, ctx) {
    if (env.AUTO_SEND !== 'true') {
      console.log(JSON.stringify({ evt: 'cron_skip', reason: 'AUTO_SEND!=true' }))
      return
    }
    // 가장 최근 발행 뉴스레터를 대상으로 발송 (send_logs 유니크 인덱스가 중복 'sent' 차단)
    const run = async () => {
      const rows = await (
        await sb(env, `newsletters?status=eq.published&select=id,vol&order=published_date.desc&limit=1`)
      ).json()
      const nl = rows?.[0]
      if (!nl) {
        console.log(JSON.stringify({ evt: 'cron_nothing' }))
        return
      }
      const result = await sendNewsletter(env, { newsletter_id: nl.id })
      console.log(JSON.stringify({ evt: 'cron_send', newsletter_id: nl.id, sent: result.sent, failed: result.failed }))
    }
    ctx.waitUntil(run())
  },
}
