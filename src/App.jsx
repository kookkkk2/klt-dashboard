import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

/* ══════════════════════════════════════════════════════════════
   Wanted Design System · 디자인 토큰
   (Wanted Design System (Community).fig 에서 추출한 실제 팔레트)
══════════════════════════════════════════════════════════════ */
const C = {
  // Primary — Wanted Blue
  blue0: '#F7FBFF', blue10: '#EAF2FE', blue20: '#C9DEFE', blue40: '#4F95FF',
  blue: '#0066FF', blueHover: '#005EEB', bluePressed: '#0054D1',
  // Neutral
  n0: '#FFFFFF', n5: '#F7F7F8', n10: '#F4F4F5', n20: '#EAEBEC', n30: '#E1E2E4',
  n40: '#DBDCDF', n50: '#C2C4C8', n60: '#989BA2', n70: '#70737C', n80: '#46474C',
  n90: '#37383C', n99: '#171719',
  // Status
  green: '#00BF40', greenBg: '#E6FFD4', greenText: '#009632',
  red: '#E52222', redBg: '#FEECEC', redText: '#B20C0C',
  orange: '#FF9200', orangeBg: '#FEF4E6', orangeText: '#D47800',
  violet: '#6541F2', violetBg: '#F0ECFE', violetText: '#4F29E5',
  cyan: '#00BDDE', cyanBg: '#E5F6FE', cyanText: '#0098B2',
}
// 시맨틱 별칭
const TEXT = C.n99, SUB = C.n70, MUTED = C.n60, FAINT = C.n50
const BORDER = C.n30, BORDER_SUB = C.n20, SURFACE = C.n0, PAGE = C.n5
const R = { card: 16, ctl: 12, inner: 10, badge: 8 }
const SHADOW = '0 1px 2px rgba(23,23,25,0.04), 0 4px 14px rgba(23,23,25,0.04)'
const FONT = '"Wanted Sans Variable","Wanted Sans",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",Pretendard,sans-serif'

// 섹션별 강조색
const ACCENT = {
  navy: C.blue, blue: C.cyan, green: C.green, purple: C.violet, gold: C.orange,
}

/* ── 공통 컴포넌트 ────────────────────────────────────────── */
function Badge({ value }) {
  const styles = {
    '승인':         { bg: C.greenBg, color: C.greenText },
    '대기':         { bg: C.orangeBg, color: C.orangeText },
    '반려':         { bg: C.redBg, color: C.redText },
    '발송완료':     { bg: C.blue10, color: C.bluePressed },
    '열람':         { bg: C.violetBg, color: C.violetText },
    '미팅확정':     { bg: C.greenBg, color: C.greenText },
    '회신없음':     { bg: C.n10, color: C.n70 },
    '처리중':       { bg: C.orangeBg, color: C.orangeText },
    '완료':         { bg: C.greenBg, color: C.greenText },
    '신규':         { bg: C.violetBg, color: C.violetText },
    '문의':         { bg: C.blue10, color: C.bluePressed },
    '추가상담요청': { bg: C.orangeBg, color: C.orangeText },
    '단순반응':     { bg: C.n10, color: C.n70 },
  }
  const s = styles[value] || { bg: C.n10, color: C.n70 }
  return (
    <span style={{
      display: 'inline-block', fontSize: 12, lineHeight: '16px', padding: '3px 9px',
      borderRadius: R.badge, background: s.bg, color: s.color, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {value}
    </span>
  )
}

function KpiCard({ label, value, sub, accent = C.blue }) {
  return (
    <div className="wds-card wds-kpi" style={{
      background: SURFACE, borderRadius: R.card, padding: '18px 18px 16px',
      border: `1px solid ${BORDER}`, boxShadow: SHADOW, position: 'relative', overflow: 'hidden',
    }}>
      <span style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: accent, opacity: 0.9 }} />
      <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 27, fontWeight: 700, color: TEXT, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: FAINT, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
    </div>
  )
}

function SectionHeader({ accent, no, title, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, background: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
      }}>{no}</div>
      <div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: TEXT, letterSpacing: '-0.3px' }}>{title}</div>
        {desc && <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{desc}</div>}
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: MUTED, fontSize: 14, fontFamily: FONT, background: PAGE,
    }}>
      데이터를 불러오는 중…
    </div>
  )
}

/* ── 로그인 화면 ──────────────────────────────────────────── */
function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: R.ctl,
    border: `1px solid ${BORDER}`, fontSize: 14, marginTop: 6,
    boxSizing: 'border-box', color: TEXT, background: SURFACE,
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: PAGE, fontFamily: FONT, padding: 20,
    }}>
      <div style={{
        background: SURFACE, borderRadius: 20, padding: '40px 36px',
        width: 380, maxWidth: '100%', border: `1px solid ${BORDER}`,
        boxShadow: '0 10px 40px rgba(23,23,25,0.08)',
      }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.blue, borderRadius: 10, padding: '8px 14px',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>
              KLT · Pulsarlube
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginTop: 18, letterSpacing: '-0.5px' }}>
            영업 파이프라인 대시보드
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
            로그인하여 성과 현황을 확인하세요
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: C.n80, fontWeight: 600 }}>이메일</label>
            <input
              className="wds-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com" required style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 13, color: C.n80, fontWeight: 600 }}>비밀번호</label>
            <input
              className="wds-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
            />
          </div>
          {error && (
            <div style={{
              background: C.redBg, border: `1px solid ${C.red}33`, borderRadius: R.inner,
              padding: '10px 14px', marginBottom: 16, fontSize: 13, color: C.redText, fontWeight: 500,
            }}>
              {error === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다' : error}
            </div>
          )}
          <button
            className="wds-btn wds-btn-primary" type="submit" disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: R.ctl, border: 'none',
              background: C.blue, color: '#fff', fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <p style={{ fontSize: 12.5, color: FAINT, textAlign: 'center', marginTop: 22 }}>
          계정이 없으면 팀장님께 문의하세요
        </p>
      </div>
    </div>
  )
}

/* ── 카드 래퍼 ────────────────────────────────────────────── */
function Panel({ children, style }) {
  return (
    <div className="wds-card" style={{
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: R.card,
      boxShadow: SHADOW, overflow: 'hidden', ...style,
    }}>{children}</div>
  )
}

/* ── 대시보드 뷰 ──────────────────────────────────────────── */
function DashboardView({ cm, dl, fi, ym }) {
  const social = ['링크드인', '리멤버']
  const direct = ['이메일뉴스레터', '카드뉴스']
  const inMon = (d) => d && d.startsWith(ym)

  const approved = cm.filter(c => c.review_status === '승인')
  const socialDl = dl.filter(d => inMon(d.sent_date) && social.includes(d.channel))
  const socialFi = fi.filter(f => inMon(f.occurred_date) && social.includes(f.channel))
  const blogFi   = fi.filter(f => inMon(f.occurred_date) && f.channel === '블로그')
  const directDl = dl.filter(d => inMon(d.sent_date) && direct.includes(d.channel))
  const directFi = fi.filter(f => inMon(f.occurred_date) && direct.includes(f.channel))

  const owners = [...new Set(dl.map(d => d.owner_name).filter(Boolean))]
  const repStats = owners.map(name => ({
    name,
    sent:    dl.filter(d => inMon(d.sent_date) && d.owner_name === name).length,
    fb:      fi.filter(f => inMon(f.occurred_date) && f.owner_name === name).length,
    meeting: dl.filter(d => inMon(d.sent_date) && d.owner_name === name && d.send_status === '미팅확정').length,
  }))

  const blogRate    = approved.length ? approved.filter(c => c.blog_date).length / approved.length : 0
  const handoffRate = approved.length ? approved.filter(c => c.handoff_date).length / approved.length : 0
  const fbRate      = socialDl.length ? socialFi.length / socialDl.length : 0

  const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginBottom: 30 }
  const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }

  const th = { padding: '13px 18px', color: MUTED, fontWeight: 600, fontSize: 12.5 }
  const td = { padding: '14px 18px', fontSize: 14 }

  return (
    <div>
      {/* 섹션 1 */}
      <SectionHeader accent={ACCENT.navy} no="1"
        title="파이프라인 진행현황" desc="콘텐츠 발행 → 검수 → 게시 → 전달" />
      <div style={grid4}>
        <KpiCard accent={ACCENT.navy} label="이번달 신규 발행" value={cm.filter(c => inMon(c.created_date)).length + '건'} />
        <KpiCard accent={ACCENT.navy} label="검수대기 (전체 누적)" value={cm.filter(c => c.review_status === '대기').length + '건'} />
        <KpiCard accent={ACCENT.navy} label="블로그 게시 완료율" value={Math.round(blogRate * 100) + '%'} />
        <KpiCard accent={ACCENT.navy} label="전달 완료율" value={Math.round(handoffRate * 100) + '%'} />
      </div>

      {/* 섹션 2 */}
      <SectionHeader accent={ACCENT.blue} no="2"
        title="소셜 셀링 성과" desc="LinkedIn · Remember" />
      <div style={grid4}>
        <KpiCard accent={ACCENT.blue} label="총 발송 건수" value={socialDl.length + '건'} />
        <KpiCard accent={ACCENT.blue} label="회신·추가컨택 피드백" value={socialFi.length + '건'} />
        <KpiCard accent={ACCENT.blue} label="피드백 전환율" value={Math.round(fbRate * 100) + '%'} />
        <KpiCard accent={ACCENT.blue} label="미팅 확정" value={socialDl.filter(d => d.send_status === '미팅확정').length + '건'} sub="목표 ≥ 12건" />
      </div>

      {/* 섹션 3, 4 나란히 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 30 }}>
        <div>
          <SectionHeader accent={ACCENT.green} no="3" title="콘텐츠 허브 인입 성과" desc="블로그" />
          <div style={grid2}>
            <KpiCard accent={ACCENT.green} label="신규 인바운드 문의" value={blogFi.length + '건'} />
            <KpiCard accent={ACCENT.green} label="영업 컨택 완료" value={blogFi.filter(f => f.process_status === '완료').length + '건'} />
          </div>
        </div>
        <div>
          <SectionHeader accent={ACCENT.purple} no="4" title="다이렉트 푸시 성과" desc="뉴스레터 · 카드뉴스" />
          <div style={grid2}>
            <KpiCard accent={ACCENT.purple} label="총 발송 거래처" value={directDl.length + '개사'} />
            <KpiCard accent={ACCENT.purple} label="회신·업셀링 연결" value={directFi.length + '건'} />
          </div>
        </div>
      </div>

      {/* 섹션 5 */}
      <SectionHeader accent={ACCENT.gold} no="5" title="영업담당자별 활동 현황" desc={ym + ' 기준'} />
      <Panel>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: PAGE, borderBottom: `1px solid ${BORDER}` }}>
              {['담당자', '발송', '피드백', '미팅전환'].map(h => (
                <th key={h} style={{ ...th, textAlign: h === '담당자' ? 'left' : 'center' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repStats.map(r => (
              <tr key={r.name} className="wds-trow" style={{ borderBottom: `1px solid ${BORDER_SUB}` }}>
                <td style={{ ...td, fontWeight: 600, color: TEXT }}>{r.name}</td>
                <td style={{ ...td, textAlign: 'center', color: C.blue, fontWeight: 700 }}>{r.sent}</td>
                <td style={{ ...td, textAlign: 'center', color: C.green, fontWeight: 700 }}>{r.fb}</td>
                <td style={{ ...td, textAlign: 'center', color: C.violet, fontWeight: 700 }}>{r.meeting}</td>
              </tr>
            ))}
            {repStats.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 28, textAlign: 'center', color: FAINT, fontSize: 14 }}>이번달 발송 데이터가 없습니다</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}

/* ── 발송기록 · 피드백 입력 폼 ────────────────────────────── */
function EntryForm({ cm, onSaved, session }) {
  const [tab, setTab] = useState('dl')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')

  const [dlForm, setDlForm] = useState({
    content_id: cm[0]?.id || '', channel: '리멤버', sent_date: new Date().toISOString().slice(0, 10),
    owner_name: session.user.email, company: '', contact_name: '', position: '', send_status: '발송완료', note: '',
  })
  const [fbForm, setFbForm] = useState({
    content_id: cm[0]?.id || '', channel: '블로그', occurred_date: new Date().toISOString().slice(0, 10),
    owner_name: session.user.email, company: '', contact_name: '', feedback_type: '문의',
    detail: '', process_status: '신규', follow_up: '',
  })

  const ctlStyle = {
    width: '100%', padding: '10px 12px', borderRadius: R.inner,
    border: `1px solid ${BORDER}`, fontSize: 13.5, background: SURFACE, color: TEXT, boxSizing: 'border-box',
  }

  const saveDl = async () => {
    if (!dlForm.company) return alert('거래처명을 입력해주세요')
    setSaving(true)
    const { error } = await supabase.from('distribution_log').insert({
      ...dlForm, owner_id: session.user.id,
    })
    setSaving(false)
    if (error) { alert('저장 실패: ' + error.message); return }
    setSaved('dl')
    setDlForm(f => ({ ...f, company: '', contact_name: '', position: '', note: '' }))
    onSaved()
    setTimeout(() => setSaved(''), 3000)
  }

  const saveFb = async () => {
    if (!fbForm.company) return alert('거래처명을 입력해주세요')
    setSaving(true)
    const { error } = await supabase.from('feedback_inbox').insert({
      ...fbForm, owner_id: session.user.id,
    })
    setSaving(false)
    if (error) { alert('저장 실패: ' + error.message); return }
    setSaved('fb')
    setFbForm(f => ({ ...f, company: '', contact_name: '', detail: '', follow_up: '' }))
    onSaved()
    setTimeout(() => setSaved(''), 3000)
  }

  const Field = ({ label, children }) => (
    <div>
      <div style={{ fontSize: 12, color: SUB, marginBottom: 5, fontWeight: 600 }}>{label}</div>
      {children}
    </div>
  )

  const tabBtnStyle = (active) => ({
    padding: '9px 18px', borderRadius: R.ctl, border: `1px solid ${active ? C.blue : BORDER}`,
    background: active ? C.blue : SURFACE, color: active ? '#fff' : SUB,
    cursor: 'pointer', fontSize: 14, fontWeight: active ? 700 : 500,
  })

  const saveBtn = {
    padding: '11px 26px', borderRadius: R.ctl, border: 'none',
    background: C.blue, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14.5,
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button className="wds-tab" style={tabBtnStyle(tab === 'dl')} onClick={() => setTab('dl')}>발송기록 입력</button>
        <button className="wds-tab" style={tabBtnStyle(tab === 'fb')} onClick={() => setTab('fb')}>피드백 입력</button>
      </div>

      {tab === 'dl' && (
        <Panel style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 20, color: TEXT, fontSize: 16, letterSpacing: '-0.3px' }}>발송내역 기록</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="콘텐츠 ID">
              <select className="wds-input" style={ctlStyle} value={dlForm.content_id} onChange={e => setDlForm(f => ({ ...f, content_id: e.target.value }))}>
                {cm.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 16)}…</option>)}
              </select>
            </Field>
            <Field label="채널">
              <select className="wds-input" style={ctlStyle} value={dlForm.channel} onChange={e => setDlForm(f => ({ ...f, channel: e.target.value }))}>
                {['블로그','링크드인','리멤버','이메일뉴스레터','카드뉴스'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="발송일">
              <input className="wds-input" type="date" style={ctlStyle} value={dlForm.sent_date} onChange={e => setDlForm(f => ({ ...f, sent_date: e.target.value }))} />
            </Field>
            <Field label="영업담당자">
              <input className="wds-input" type="text" style={ctlStyle} value={dlForm.owner_name} onChange={e => setDlForm(f => ({ ...f, owner_name: e.target.value }))} />
            </Field>
            <Field label="거래처명 *">
              <input className="wds-input" type="text" style={ctlStyle} placeholder="예: 현대자동차 울산공장" value={dlForm.company} onChange={e => setDlForm(f => ({ ...f, company: e.target.value }))} />
            </Field>
            <Field label="담당자명">
              <input className="wds-input" type="text" style={ctlStyle} placeholder="예: 홍길동" value={dlForm.contact_name} onChange={e => setDlForm(f => ({ ...f, contact_name: e.target.value }))} />
            </Field>
            <Field label="직급">
              <input className="wds-input" type="text" style={ctlStyle} placeholder="예: 부장" value={dlForm.position} onChange={e => setDlForm(f => ({ ...f, position: e.target.value }))} />
            </Field>
            <Field label="발송상태">
              <select className="wds-input" style={ctlStyle} value={dlForm.send_status} onChange={e => setDlForm(f => ({ ...f, send_status: e.target.value }))}>
                {['발송완료','열람','미팅확정','회신없음'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
          <Field label="비고 / 향후 액션">
            <input className="wds-input" type="text" style={ctlStyle} placeholder="예: 7/10 방문 미팅 샘플 지참" value={dlForm.note} onChange={e => setDlForm(f => ({ ...f, note: e.target.value }))} />
          </Field>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="wds-btn wds-btn-primary" onClick={saveDl} disabled={saving} style={{ ...saveBtn, opacity: saving ? 0.6 : 1 }}>
              {saving ? '저장 중…' : '발송기록 저장'}
            </button>
            {saved === 'dl' && <span style={{ fontSize: 13.5, color: C.greenText, fontWeight: 600 }}>✓ 저장됨 — 대시보드에 즉시 반영됩니다</span>}
          </div>
        </Panel>
      )}

      {tab === 'fb' && (
        <Panel style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 20, color: TEXT, fontSize: 16, letterSpacing: '-0.3px' }}>피드백 기록</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="콘텐츠 ID">
              <select className="wds-input" style={ctlStyle} value={fbForm.content_id} onChange={e => setFbForm(f => ({ ...f, content_id: e.target.value }))}>
                {cm.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 16)}…</option>)}
              </select>
            </Field>
            <Field label="채널">
              <select className="wds-input" style={ctlStyle} value={fbForm.channel} onChange={e => setFbForm(f => ({ ...f, channel: e.target.value }))}>
                {['블로그','링크드인','리멤버','이메일뉴스레터','카드뉴스'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="발생일">
              <input className="wds-input" type="date" style={ctlStyle} value={fbForm.occurred_date} onChange={e => setFbForm(f => ({ ...f, occurred_date: e.target.value }))} />
            </Field>
            <Field label="담당 영업사원">
              <input className="wds-input" type="text" style={ctlStyle} value={fbForm.owner_name} onChange={e => setFbForm(f => ({ ...f, owner_name: e.target.value }))} />
            </Field>
            <Field label="거래처명 *">
              <input className="wds-input" type="text" style={ctlStyle} placeholder="예: 삼성디스플레이 아산캠퍼스" value={fbForm.company} onChange={e => setFbForm(f => ({ ...f, company: e.target.value }))} />
            </Field>
            <Field label="담당자명">
              <input className="wds-input" type="text" style={ctlStyle} placeholder="예: 이몽룡" value={fbForm.contact_name} onChange={e => setFbForm(f => ({ ...f, contact_name: e.target.value }))} />
            </Field>
            <Field label="피드백 유형">
              <select className="wds-input" style={ctlStyle} value={fbForm.feedback_type} onChange={e => setFbForm(f => ({ ...f, feedback_type: e.target.value }))}>
                {['단순반응','문의','추가상담요청'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="처리상태">
              <select className="wds-input" style={ctlStyle} value={fbForm.process_status} onChange={e => setFbForm(f => ({ ...f, process_status: e.target.value }))}>
                {['신규','처리중','완료'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
          <Field label="내용">
            <textarea className="wds-input" style={{ ...ctlStyle, minHeight: 72, resize: 'vertical' }}
              placeholder="예: 가이드북 다운로드 후 자사 설비 적용 가능 여부 문의"
              value={fbForm.detail} onChange={e => setFbForm(f => ({ ...f, detail: e.target.value }))} />
          </Field>
          <div style={{ marginTop: 12 }}>
            <Field label="후속조치">
              <input className="wds-input" type="text" style={ctlStyle}
                placeholder="예: 7/6 1차 컨택 완료, 견적 준비 중"
                value={fbForm.follow_up} onChange={e => setFbForm(f => ({ ...f, follow_up: e.target.value }))} />
            </Field>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="wds-btn wds-btn-primary" onClick={saveFb} disabled={saving} style={{ ...saveBtn, opacity: saving ? 0.6 : 1 }}>
              {saving ? '저장 중…' : '피드백 저장'}
            </button>
            {saved === 'fb' && <span style={{ fontSize: 13.5, color: C.greenText, fontWeight: 600 }}>✓ 저장됨 — 대시보드에 즉시 반영됩니다</span>}
          </div>
        </Panel>
      )}
    </div>
  )
}

/* ── 테이블 뷰 ────────────────────────────────────────────── */
function TableView({ data, columns, title }) {
  return (
    <Panel>
      <div style={{ padding: '15px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: TEXT, fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px' }}>{title}</span>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: PAGE }}>
              {columns.map(c => (
                <th key={c.key} style={{
                  padding: '11px 14px', textAlign: 'left', color: MUTED,
                  fontWeight: 600, fontSize: 12.5, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap',
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="wds-trow" style={{ borderBottom: `1px solid ${BORDER_SUB}` }}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '11px 14px', color: C.n80, whiteSpace: c.wrap ? 'normal' : 'nowrap', maxWidth: c.maxW }}>
                    {c.badge ? <Badge value={row[c.key]} /> : (row[c.key] || '—')}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={columns.length} style={{ padding: 28, textAlign: 'center', color: FAINT, fontSize: 14 }}>데이터가 없습니다</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* ── 콘텐츠 관리 뷰 (카드형) ──────────────────────────────── */
function ContentManageView({ cm, onSaved }) {
  const [busy, setBusy] = useState('')
  const today = () => new Date().toISOString().slice(0, 10)

  const update = async (id, patch, key) => {
    setBusy(key)
    const { error } = await supabase.from('content_master').update(patch).eq('id', id)
    setBusy('')
    if (error) { alert('저장 실패: ' + error.message); return }
    onSaved()
  }
  const approve = (c) => {
    if (!window.confirm(`"${c.title}"\n\n검수 승인하시겠습니까? 발행일이 오늘로 기록됩니다.`)) return
    update(c.id, { review_status: '승인', published_date: today() }, c.id + '-approve')
  }
  const reject = (c) => {
    if (!window.confirm(`"${c.title}"\n\n반려 처리하시겠습니까?`)) return
    update(c.id, { review_status: '반려' }, c.id + '-reject')
  }

  // 파일 뱃지 → 실제 파일 (public/contents/<폴더>/*)
  const FILE_DEFS = [
    ['main_file', '메인', '01_main.html'],
    ['blog_file', '블로그', '02_blog.html'],
    ['linkedin_file', '소셜', '03_social.html'],
    ['remember_file', '타겟팅', '04_targeting.html'],
    ['newsletter_file', '뉴스레터', '05_newsletter.html'],
    ['cardnews_file', '카드', '06_cardnews_slides.html'],
  ]
  const fileHref = (c, fname) =>
    c.folder_name ? `/contents/${encodeURIComponent(c.folder_name)}/${fname}` : null

  const badgeBase = {
    fontSize: 11.5, padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap',
    fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
  }
  const renderFileBadges = (c) => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {FILE_DEFS.map(([key, label, fname]) => {
        const made = !!c[key]
        const href = made ? fileHref(c, fname) : null
        if (href) {
          return (
            <a key={key} href={href} target="_blank" rel="noreferrer" title={label + ' 파일 열기'}
              className="wds-linkbtn"
              style={{ ...badgeBase, background: C.blue10, color: C.bluePressed, cursor: 'pointer' }}>
              {label} ↗
            </a>
          )
        }
        return (
          <span key={key} title={made ? label + ' 생성됨 (폴더명 미등록)' : label + ' 미생성'}
            style={{ ...badgeBase, background: made ? C.greenBg : C.n10, color: made ? C.greenText : C.n50,
              fontWeight: made ? 600 : 500, textDecoration: made ? 'none' : 'line-through' }}>
            {label}
          </span>
        )
      })}
    </div>
  )

  // 채널별 게시일 (+ 일부 게시 링크)
  const DATE_DEFS = [
    ['blog_date', '블로그', 'blog_url'],
    ['linkedin_date', '소셜(링크드인)', 'linkedin_url'],
    ['remember_date', '타겟팅(리멤버)', 'remember_url'],
    ['newsletter_date', '뉴스레터', null],
    ['cardnews_date', '카드뉴스', null],
    ['handoff_date', '전달', null],
  ]
  const ctlBase = { borderRadius: 8, padding: '6px 8px', fontSize: 12, boxSizing: 'border-box' }
  const dateInput = (c, field) => (
    <input className="wds-input" type="date" value={c[field] || ''}
      onChange={e => update(c.id, { [field]: e.target.value || null }, c.id + field)}
      style={{ ...ctlBase, width: '100%',
        border: `1px solid ${c[field] ? C.green + '55' : BORDER}`,
        background: c[field] ? '#F2FFF6' : SURFACE, color: c[field] ? C.greenText : FAINT }}
    />
  )
  const urlInput = (c, field) => (
    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
      <input className="wds-input" type="url" placeholder="게시 링크 URL" defaultValue={c[field] || ''}
        onBlur={e => { const v = e.target.value.trim(); if ((v || null) !== (c[field] || null)) update(c.id, { [field]: v || null }, c.id + field) }}
        style={{ ...ctlBase, flex: 1, minWidth: 0, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT }}
      />
      {c[field] && (
        <a href={c[field]} target="_blank" rel="noreferrer" title="게시글 열기" className="wds-linkbtn"
          style={{ ...ctlBase, flexShrink: 0, background: C.blue10, color: C.bluePressed, fontWeight: 700,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          열기 ↗
        </a>
      )}
    </div>
  )

  const btn = (bg) => ({
    padding: '5px 12px', borderRadius: 8, border: 'none', background: bg,
    color: '#fff', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
  })

  return (
    <div>
      <SectionHeader accent={C.blue} no="📋" title="콘텐츠 관리"
        desc="검수 승인 · 파일 열기 · 채널별 게시일/링크 기록" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cm.map(c => (
          <Panel key={c.id} style={{ padding: 18 }}>
            {/* 윗줄: ID · 제목 · 검수 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 76 }}>
                <div style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>ID</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.bluePressed }}>{c.id}</div>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 2 }}>제목</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, lineHeight: 1.4 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 5 }}>
                  {c.theme ? '테마 ' + c.theme : '테마 —'}
                  {'  ·  등록 '}{c.created_date || '—'}
                  {'  ·  발행 '}
                  <span style={{ color: c.published_date ? C.greenText : FAINT, fontWeight: 600 }}>{c.published_date || '—'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <Badge value={c.review_status} />
                {c.review_status === '대기' && (
                  <>
                    <button className="wds-btn" style={btn(C.green)} disabled={busy === c.id + '-approve'} onClick={() => approve(c)}>승인</button>
                    <button className="wds-btn" style={btn(C.red)} disabled={busy === c.id + '-reject'} onClick={() => reject(c)}>반려</button>
                  </>
                )}
              </div>
            </div>

            <div style={{ height: 1, background: BORDER_SUB, margin: '14px 0' }} />

            {/* 파일 열기 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 6 }}>파일 (클릭 시 새 탭으로 열기)</div>
              {renderFileBadges(c)}
            </div>

            {/* 채널별 게시일 · 게시 링크 */}
            <div>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 8 }}>채널별 게시일 · 게시 링크</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
                {DATE_DEFS.map(([field, label, urlField]) => (
                  <div key={field} style={{ background: PAGE, borderRadius: 10, padding: 10 }}>
                    <div style={{ fontSize: 11.5, color: SUB, fontWeight: 600, marginBottom: 5 }}>{label}</div>
                    {dateInput(c, field)}
                    {urlField && urlInput(c, urlField)}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        ))}
        {cm.length === 0 && (
          <Panel style={{ padding: 28, textAlign: 'center', color: FAINT, fontSize: 14 }}>데이터가 없습니다</Panel>
        )}
      </div>

      <p style={{ fontSize: 12, color: FAINT, marginTop: 12, lineHeight: 1.6 }}>
        ※ 발행일은 [승인] 클릭 시 자동 기록 · 파일은 public/contents 에 배포된 HTML을 새 탭으로 엽니다 · 게시일/게시 링크는 각 채널 게시 후 직접 입력
      </p>
    </div>
  )
}

/* ── 메인 앱 ──────────────────────────────────────────────── */
export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('dashboard')
  const [ym, setYm] = useState(new Date().toISOString().slice(0, 7))
  const [cm, setCm] = useState([])
  const [dl, setDl] = useState([])
  const [fi, setFi] = useState([])

  // 인증 상태 감지
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // 데이터 로드
  const loadData = async () => {
    const [cmRes, dlRes, fiRes] = await Promise.all([
      supabase.from('content_master').select('*').order('created_date', { ascending: false }),
      supabase.from('distribution_log').select('*').order('sent_date', { ascending: false }),
      supabase.from('feedback_inbox').select('*').order('occurred_date', { ascending: false }),
    ])
    if (cmRes.data) setCm(cmRes.data)
    if (dlRes.data) setDl(dlRes.data)
    if (fiRes.data) setFi(fiRes.data)
  }

  useEffect(() => {
    if (!session) return
    loadData()

    // Realtime 구독 (팀장님 화면 자동 갱신)
    const channel = supabase
      .channel('klt-pipeline-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'distribution_log' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback_inbox' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_master' }, loadData)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [session])

  if (loading) return <Loading />
  if (!session) return <LoginScreen />

  const TABS = [
    { id: 'dashboard',    label: '대시보드' },
    { id: 'content',      label: '콘텐츠 관리' },
    { id: 'distribution', label: '발송 기록' },
    { id: 'feedback',     label: '피드백' },
    { id: 'entry',        label: '데이터 입력' },
  ]

  const containerStyle = { maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }
  const navBtnStyle = (active) => ({
    padding: '9px 16px', borderRadius: R.ctl, border: `1px solid ${active ? 'transparent' : BORDER}`,
    cursor: 'pointer', background: active ? C.blue10 : SURFACE, color: active ? C.bluePressed : SUB,
    fontWeight: active ? 700 : 500, fontSize: 13.5,
  })

  return (
    <div style={{ fontFamily: FONT, background: PAGE, minHeight: '100vh', color: TEXT }}>
      {/* 헤더 */}
      <header style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              background: C.blue, borderRadius: 10, padding: '7px 12px',
              color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px', whiteSpace: 'nowrap',
            }}>KLT · Pulsarlube</div>
            <div>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.4px' }}>영업 파이프라인 다각화 성과 대시보드</div>
              <div style={{ color: FAINT, fontSize: 11, marginTop: 1, letterSpacing: '1px', fontWeight: 600 }}>FOR YOUR MACHINERY</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: MUTED, fontSize: 12.5, fontWeight: 500 }}>조회 연월</span>
              <input className="wds-input" type="month" value={ym} onChange={e => setYm(e.target.value)} style={{
                padding: '7px 12px', borderRadius: R.inner, border: `1px solid ${BORDER}`,
                background: SURFACE, color: TEXT, fontSize: 13, cursor: 'pointer',
              }} />
            </div>
            <button className="wds-btn wds-btn-ghost" onClick={() => supabase.auth.signOut()} style={{
              padding: '8px 14px', borderRadius: R.inner, border: `1px solid ${BORDER}`,
              background: SURFACE, color: SUB, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>로그아웃</button>
          </div>
        </div>
      </header>

      <div style={containerStyle}>
        {/* 탭 */}
        <nav style={{ display: 'flex', gap: 8, padding: '20px 0 24px', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} className={`wds-tab ${view === t.id ? 'active' : ''}`} style={navBtnStyle(view === t.id)} onClick={() => setView(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* 뷰 */}
        {view === 'dashboard'    && <DashboardView cm={cm} dl={dl} fi={fi} ym={ym} />}
        {view === 'content'      && <ContentManageView cm={cm} onSaved={loadData} />}
        {view === 'distribution' && <TableView data={dl} title="Distribution Log — 채널별 발송 실적" columns={[
          { key: 'content_id', label: '콘텐츠ID' }, { key: 'channel', label: '채널' },
          { key: 'sent_date', label: '발송일' }, { key: 'owner_name', label: '담당자' },
          { key: 'company', label: '거래처', wrap: true, maxW: 180 }, { key: 'contact_name', label: '연락처' },
          { key: 'send_status', label: '상태', badge: true }, { key: 'note', label: '비고', wrap: true, maxW: 160 },
        ]} />}
        {view === 'feedback'     && <TableView data={fi} title="Feedback Inbox — 채널 통합 피드백" columns={[
          { key: 'content_id', label: '콘텐츠ID' }, { key: 'channel', label: '채널' },
          { key: 'occurred_date', label: '발생일' }, { key: 'company', label: '거래처', wrap: true, maxW: 160 },
          { key: 'feedback_type', label: '유형', badge: true }, { key: 'detail', label: '내용', wrap: true, maxW: 180 },
          { key: 'owner_name', label: '담당영업' }, { key: 'process_status', label: '처리', badge: true },
          { key: 'follow_up', label: '후속조치', wrap: true, maxW: 160 },
        ]} />}
        {view === 'entry'        && <EntryForm cm={cm} onSaved={loadData} session={session} />}
      </div>
    </div>
  )
}
