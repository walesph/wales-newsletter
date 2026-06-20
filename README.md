# wales-newsletter — ⚠️ RETIRED PROTOTYPE (superseded)

> **이 저장소는 프로토타입입니다. 더 이상 여기서 작업하지 마세요.**
>
> 뉴스레터(WALES通信) 기능은 **WALES 운영 포털(walesportal.com)** 에 통합되어
> 이제 그쪽에서 관리·확장됩니다.

## 어디로 옮겨졌나

- **운영 코드베이스:** WALES 포털 (`walesportal.com`) — `walesph/Walesportal`
- **위치(어드민 메뉴):**
  - 뉴스레터 → **Agents ▸ Newsletter**
  - 학생 후기 → **Agents ▸ Testimonials**
  - IELTS/PTE 성적 → **Classes ▸ Exam Scores**
- **백엔드:** Supabase Edge Function `make-server-46ccf3aa`
  - `POST /ai/translate` (Anthropic 다국어 번역)
  - `POST /newsletter/send` (Resend 발송)
- **머지:** PR walesph/Walesportal#425 (+ #423/#424)

## 이 프로토타입의 역할

독립 Vite+React 앱으로 시작해 데이터 구조 / 다국어 i18n / AI 번역 / 도넛·막대 차트 /
이메일 템플릿 / Resend 발송 흐름을 검증했습니다. 그 설계가 위 포털에 이식되었습니다.
참고용 기획서: [PLAN.md](./PLAN.md).

## 앞으로

새 기능·수정은 모두 **WALES 포털(walesportal.com)** 에서 작업하세요. 이 저장소는 보관용입니다.
