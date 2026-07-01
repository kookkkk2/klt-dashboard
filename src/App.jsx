import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'

// ── 색상 상수 ──────────────────────────────────────────────
const NAVY = '#1E3A5F'
const BLUE = '#2E5090'
const GREEN = '#1a5c36'
const PURPLE = '#6A1B9A'
const GOLD = '#B8860C'

// ── 공통 컴포넌트 ──────────────────────────────────────────
function Badge({ value }) {
  const styles = {
    '승인':         { bg: '#e8f5e9', color: '#1B5E20' },
    '대기':         { bg: '#FFFDE7', color: '#E65100' },
    '반려':         { bg: '#FFEBEE', color: '#B71C1C' },
    '발송완료':     { bg: '#E3F2FD', color: '#0D47A1' },
    '열람':         { bg: '#EDE7F6', color: '#4527A0' },
    '미팅확정':     { bg: '#E8F5E9', color: '#1B5E20' },
    '회신없음':     { bg: '#f5f5f5', color: '#757575' },
    '처리중':       { bg: '#FFF3E0', color: '#E65100' },
    '완료':         { bg: '#E8F5E9', color: '#2E7D32' },
    '신규':         { bg: '#F3E5F5', color: '#6A1B9A' },
    '문의':         { bg: '#E3F2FD', color: '#0D47A1' },
    '추가상담요청': { bg: '#FFF3E0', color: '#E65100' },
    '단순반응':     { bg: '#f5f5f5', color: '#757575' },
  }
  const s = styles[value] || { bg: '#f5f5f5', color: '#757575' }
  return (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 4,
      background: s.bg, color: s.color, fontWeight: 500, whiteSpace: 'nowrap'
    }}>
      {value}
    </span>
  )
}

function KpiCard({ label, value, sub }) {
  return (
    <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '13px 15px' }}>
      <div style={{ fontSize: 11, color: '#6c757d', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#212529' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#adb5bd', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function SectionHeader({ color, children }) {
  return (
    <div style={{
      background: color, padding: '7px 14px', borderRadius: 8,
      marginBottom: 10
    }}>
      <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{children}</span>
    </div>
  )
}

function Loading() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#6c757d' }}>
      데이터를 불러오는 중...
    </div>
  )
}

// ── 로그인 화면 ────────────────────────────────────────────
function LoginScreen({ onLogin }) {
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
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #dee2e6', fontSize: 14, marginTop: 4,
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8f9fa'
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '40px 36px',
        width: 360, boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          background: NAVY, borderRadius: 8, padding: '12px 16px', marginBottom: 28
        }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
            🏭 KLT (Pulsarlube)
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2, letterSpacing: 1 }}>
            영업 파이프라인 대시보드
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#495057', fontWeight: 500 }}>이메일</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com" required style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#495057', fontWeight: 500 }}>비밀번호</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
            />
          </div>
          {error && (
            <div style={{
              background: '#fff5f5', border: '1px solid #ffc9c9', borderRadius: 6,
              padding: '8px 12px', marginBottom: 14, fontSize: 12, color: '#c92a2a'
            }}>
              {error === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다' : error}
            </div>
          )}
          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '11px', borderRadius: 8, border: 'none',
              background: NAVY, color: '#fff', fontWeight: 600, fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: '#adb5bd', textAlign: 'center', marginTop: 20 }}>
          계정이 없으면 팀장님께 문의하세요
        </p>
      </div>
    </div>
  )
}

// ── 대시보드 뷰 ────────────────────────────────────────────
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

  const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, marginBottom: 18 }
  const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }

  return (
    <div>
      {/* 섹션 1 */}
      <SectionHeader color={NAVY}>
        1️⃣  파이프라인 진행현황 (콘텐츠 발행 → 검수 → 게시 → 전달)
      </SectionHeader>
      <div style={grid4}>
        <KpiCard label="이번달 신규 발행" value={cm.filter(c => inMon(c.created_date)).length + '건'} />
        <KpiCard label="검수대기 (전체 누적)" value={cm.filter(c => c.review_status === '대기').length + '건'} sub="연월 무관" />
        <KpiCard label="블로그 게시 완료율" value={Math.round(blogRate * 100) + '%'} sub="승인건 대비" />
        <KpiCard label="전달 완료율" value={Math.round(handoffRate * 100) + '%'} sub="승인건 대비" />
      </div>

      {/* 섹션 2 */}
      <SectionHeader color={BLUE}>
        2️⃣  소셜 셀링 성과 (LinkedIn / Remember)
      </SectionHeader>
      <div style={grid4}>
        <KpiCard label="총 발송 건수" value={socialDl.length + '건'} />
        <KpiCard label="회신·추가컨택 피드백" value={socialFi.length + '건'} />
        <KpiCard label="피드백 전환율" value={Math.round(fbRate * 100) + '%'} />
        <KpiCard label="미팅 확정" value={socialDl.filter(d => d.send_status === '미팅확정').length + '건'} sub="목표 ≥12건" />
      </div>

      {/* 섹션 3, 4 나란히 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        <div>
          <SectionHeader color={GREEN}>3️⃣  콘텐츠 허브 인입 성과 (블로그)</SectionHeader>
          <div style={grid2}>
            <KpiCard label="신규 인바운드 문의" value={blogFi.length + '건'} />
            <KpiCard label="영업 컨택 완료" value={blogFi.filter(f => f.process_status === '완료').length + '건'} />
          </div>
        </div>
        <div>
          <SectionHeader color={PURPLE}>4️⃣  다이렉트 푸시 성과 (뉴스레터 / 카드뉴스)</SectionHeader>
          <div style={grid2}>
            <KpiCard label="총 발송 거래처" value={directDl.length + '개사'} />
            <KpiCard label="회신·업셀링 연결" value={directFi.length + '건'} />
          </div>
        </div>
      </div>

      {/* 섹션 5 */}
      <SectionHeader color={GOLD}>5️⃣  영업담당자별 활동 현황</SectionHeader>
      <div style={{ background: '#f8f9fa', borderRadius: 8, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #dee2e6' }}>
              {['담당자', '발송', '피드백', '미팅전환'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: h === '담당자' ? 'left' : 'center', color: '#6c757d', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repStats.map(r => (
              <tr key={r.name} style={{ borderBottom: '1px solid #f1f3f5' }}>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: '10px 14px', textAlign: 'center', color: BLUE, fontWeight: 600 }}>{r.sent}</td>
                <td style={{ padding: '10px 14px', textAlign: 'center', color: GREEN, fontWeight: 600 }}>{r.fb}</td>
                <td style={{ padding: '10px 14px', textAlign: 'center', color: PURPLE, fontWeight: 600 }}>{r.meeting}</td>
              </tr>
            ))}
            {repStats.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#adb5bd' }}>이번달 발송 데이터가 없습니다</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── 발송기록 입력 폼 ───────────────────────────────────────
function EntryForm({ cm, onSaved, session }) {
  const [tab, setTab] = useState('dl')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')

  const [dlForm, setDlForm] = useState({
    content_id: cm[0]?.id || '', channel: '리멤버', sent_date: new Date().toISOString().slice(0, 10),
    owner_name: session.user.email, company: '', contact_name: '', position: '', send_status: '발송완료', note: ''
  })
  const [fbForm, setFbForm] = useState({
    content_id: cm[0]?.id || '', channel: '블로그', occurred_date: new Date().toISOString().slice(0, 10),
    owner_name: session.user.email, company: '', contact_name: '', feedback_type: '문의',
    detail: '', process_status: '신규', follow_up: ''
  })

  const selectStyle = {
    width: '100%', padding: '7px 10px', borderRadius: 6,
    border: '1px solid #dee2e6', fontSize: 13, background: '#fff'
  }
  const inputStyle = { ...selectStyle }

  const saveDl = async () => {
    if (!dlForm.company) return alert('거래처명을 입력해주세요')
    setSaving(true)
    const { error } = await supabase.from('distribution_log').insert({
      ...dlForm, owner_id: session.user.id
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
      ...fbForm, owner_id: session.user.id
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
      <div style={{ fontSize: 11, color: '#6c757d', marginBottom: 3 }}>{label}</div>
      {children}
    </div>
  )

  const tabBtnStyle = (active, color) => ({
    padding: '7px 16px', borderRadius: 6, border: '1px solid #dee2e6',
    background: active ? color : '#fff', color: active ? '#fff' : '#495057',
    cursor: 'pointer', fontSize: 13, fontWeight: active ? 500 : 400
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button style={tabBtnStyle(tab === 'dl', BLUE)} onClick={() => setTab('dl')}>📨 발송기록 입력</button>
        <button style={tabBtnStyle(tab === 'fb', PURPLE)} onClick={() => setTab('fb')}>💬 피드백 입력</button>
      </div>

      {tab === 'dl' && (
        <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, color: '#212529' }}>📨 발송내역 기록</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Field label="콘텐츠 ID">
              <select style={selectStyle} value={dlForm.content_id} onChange={e => setDlForm(f => ({ ...f, content_id: e.target.value }))}>
                {cm.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 16)}...</option>)}
              </select>
            </Field>
            <Field label="채널">
              <select style={selectStyle} value={dlForm.channel} onChange={e => setDlForm(f => ({ ...f, channel: e.target.value }))}>
                {['블로그','링크드인','리멤버','이메일뉴스레터','카드뉴스'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="발송일">
              <input type="date" style={inputStyle} value={dlForm.sent_date} onChange={e => setDlForm(f => ({ ...f, sent_date: e.target.value }))} />
            </Field>
            <Field label="영업담당자">
              <input type="text" style={inputStyle} value={dlForm.owner_name} onChange={e => setDlForm(f => ({ ...f, owner_name: e.target.value }))} />
            </Field>
            <Field label="거래처명 *">
              <input type="text" style={inputStyle} placeholder="예: 현대자동차 울산공장" value={dlForm.company} onChange={e => setDlForm(f => ({ ...f, company: e.target.value }))} />
            </Field>
            <Field label="담당자명">
              <input type="text" style={inputStyle} placeholder="예: 홍길동" value={dlForm.contact_name} onChange={e => setDlForm(f => ({ ...f, contact_name: e.target.value }))} />
            </Field>
            <Field label="직급">
              <input type="text" style={inputStyle} placeholder="예: 부장" value={dlForm.position} onChange={e => setDlForm(f => ({ ...f, position: e.target.value }))} />
            </Field>
            <Field label="발송상태">
              <select style={selectStyle} value={dlForm.send_status} onChange={e => setDlForm(f => ({ ...f, send_status: e.target.value }))}>
                {['발송완료','열람','미팅확정','회신없음'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
          <Field label="비고 / 향후 액션">
            <input type="text" style={{ ...inputStyle, width: '100%' }} placeholder="예: 7/10 방문 미팅 샘플 지참" value={dlForm.note} onChange={e => setDlForm(f => ({ ...f, note: e.target.value }))} />
          </Field>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={saveDl} disabled={saving} style={{
              padding: '9px 24px', borderRadius: 8, border: 'none',
              background: BLUE, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14
            }}>
              {saving ? '저장 중...' : '+ 발송기록 저장'}
            </button>
            {saved === 'dl' && <span style={{ fontSize: 13, color: GREEN }}>✓ 저장됨 — 대시보드에 즉시 반영됩니다</span>}
          </div>
        </div>
      )}

      {tab === 'fb' && (
        <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, color: '#212529' }}>💬 피드백 기록</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Field label="콘텐츠 ID">
              <select style={selectStyle} value={fbForm.content_id} onChange={e => setFbForm(f => ({ ...f, content_id: e.target.value }))}>
                {cm.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 16)}...</option>)}
              </select>
            </Field>
            <Field label="채널">
              <select style={selectStyle} value={fbForm.channel} onChange={e => setFbForm(f => ({ ...f, channel: e.target.value }))}>
                {['블로그','링크드인','리멤버','이메일뉴스레터','카드뉴스'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="발생일">
              <input type="date" style={inputStyle} value={fbForm.occurred_date} onChange={e => setFbForm(f => ({ ...f, occurred_date: e.target.value }))} />
            </Field>
            <Field label="담당 영업사원">
              <input type="text" style={inputStyle} value={fbForm.owner_name} onChange={e => setFbForm(f => ({ ...f, owner_name: e.target.value }))} />
            </Field>
            <Field label="거래처명 *">
              <input type="text" style={inputStyle} placeholder="예: 삼성디스플레이 아산캠퍼스" value={fbForm.company} onChange={e => setFbForm(f => ({ ...f, company: e.target.value }))} />
            </Field>
            <Field label="담당자명">
              <input type="text" style={inputStyle} placeholder="예: 이몽룡" value={fbForm.contact_name} onChange={e => setFbForm(f => ({ ...f, contact_name: e.target.value }))} />
            </Field>
            <Field label="피드백 유형">
              <select style={selectStyle} value={fbForm.feedback_type} onChange={e => setFbForm(f => ({ ...f, feedback_type: e.target.value }))}>
                {['단순반응','문의','추가상담요청'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="처리상태">
              <select style={selectStyle} value={fbForm.process_status} onChange={e => setFbForm(f => ({ ...f, process_status: e.target.value }))}>
                {['신규','처리중','완료'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
          <Field label="내용">
            <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }}
              placeholder="예: 가이드북 다운로드 후 자사 설비 적용 가능 여부 문의"
              value={fbForm.detail} onChange={e => setFbForm(f => ({ ...f, detail: e.target.value }))} />
          </Field>
          <div style={{ marginTop: 10 }}>
            <Field label="후속조치">
              <input type="text" style={{ ...inputStyle, width: '100%' }}
                placeholder="예: 7/6 1차 컨택 완료, 견적 준비 중"
                value={fbForm.follow_up} onChange={e => setFbForm(f => ({ ...f, follow_up: e.target.value }))} />
            </Field>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={saveFb} disabled={saving} style={{
              padding: '9px 24px', borderRadius: 8, border: 'none',
              background: PURPLE, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14
            }}>
              {saving ? '저장 중...' : '+ 피드백 저장'}
            </button>
            {saved === 'fb' && <span style={{ fontSize: 13, color: GREEN }}>✓ 저장됨 — 대시보드에 즉시 반영됩니다</span>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── 테이블 뷰 ──────────────────────────────────────────────
function TableView({ data, columns, color, title }) {
  return (
    <div style={{ borderRadius: 10, overflow: 'auto', border: '1px solid #dee2e6' }}>
      <div style={{ background: color, padding: '8px 14px' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{title}</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            {columns.map(c => (
              <th key={c.key} style={{
                padding: '8px 10px', textAlign: 'left', color: '#6c757d',
                fontWeight: 500, borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap'
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: '8px 10px', color: '#495057', whiteSpace: c.wrap ? 'normal' : 'nowrap', maxWidth: c.maxW }}>
                  {c.badge ? <Badge value={row[c.key]} /> : (row[c.key] || '—')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 24, textAlign: 'center', color: '#adb5bd' }}>데이터가 없습니다</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── 메인 앱 ────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('dashboard')
  const [ym, setYm] = useState(new Date().toISOString().slice(0, 7))
  const [cm, setCm] = useState([])
  const [dl, setDl] = useState([])
  const [fi, setFi] = useState([])

  // ── 인증 상태 감지 ──
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

  // ── 데이터 로드 ──
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

    // ── Realtime 구독 (팀장님 화면 자동 갱신) ──
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
    { id: 'dashboard',    label: '📊 대시보드' },
    { id: 'content',      label: '📋 콘텐츠 관리' },
    { id: 'distribution', label: '📨 발송 기록' },
    { id: 'feedback',     label: '💬 피드백' },
    { id: 'entry',        label: '✏️ 데이터 입력' },
  ]

  const containerStyle = { maxWidth: 1100, margin: '0 auto', padding: '0 16px 40px' }
  const navBtnStyle = (active) => ({
    padding: '7px 14px', borderRadius: 6, border: '1px solid #dee2e6', cursor: 'pointer',
    background: active ? NAVY : '#fff', color: active ? '#fff' : '#6c757d',
    fontWeight: active ? 500 : 400, fontSize: 13
  })

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ background: NAVY, padding: '0 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>🏭 KLT (Pulsarlube)  |  영업 파이프라인 다각화 성과 대시보드</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2, letterSpacing: 1.5 }}>FOR YOUR MACHINERY</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>조회 연월</span>
              <input type="month" value={ym} onChange={e => setYm(e.target.value)} style={{
                padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, cursor: 'pointer'
              }} />
            </div>
            <button onClick={() => supabase.auth.signOut()} style={{
              padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.25)',
              background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12
            }}>로그아웃</button>
          </div>
        </div>
      </div>

      <div style={containerStyle}>
        {/* 탭 */}
        <div style={{ display: 'flex', gap: 6, padding: '14px 0', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} style={navBtnStyle(view === t.id)} onClick={() => setView(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 뷰 */}
        {view === 'dashboard'    && <DashboardView cm={cm} dl={dl} fi={fi} ym={ym} />}
        {view === 'content'      && <TableView data={cm} color={NAVY} title="📋 Content_Master — 콘텐츠 발행 파이프라인 (1~6단계)" columns={[
          { key: 'id', label: 'ID' }, { key: 'title', label: '제목', wrap: true, maxW: 200 },
          { key: 'review_status', label: '검수', badge: true }, { key: 'created_date', label: '발행일' },
          { key: 'blog_date', label: '블로그' }, { key: 'linkedin_date', label: '링크드인' },
          { key: 'remember_date', label: '리멤버' }, { key: 'newsletter_date', label: '뉴스레터' },
          { key: 'handoff_date', label: '전달일' },
        ]} />}
        {view === 'distribution' && <TableView data={dl} color={BLUE} title="📨 Distribution_Log — 채널별 발송 실적 (7~8단계)" columns={[
          { key: 'content_id', label: '콘텐츠ID' }, { key: 'channel', label: '채널' },
          { key: 'sent_date', label: '발송일' }, { key: 'owner_name', label: '담당자' },
          { key: 'company', label: '거래처', wrap: true, maxW: 180 }, { key: 'contact_name', label: '연락처' },
          { key: 'send_status', label: '상태', badge: true }, { key: 'note', label: '비고', wrap: true, maxW: 160 },
        ]} />}
        {view === 'feedback'     && <TableView data={fi} color={PURPLE} title="💬 Feedback_Inbox — 채널 통합 피드백" columns={[
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
