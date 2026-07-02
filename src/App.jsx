import { useState, useEffect, useRef } from 'react';

const API = import.meta.env.VITE_API_URL;

async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('ob_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res  = await fetch(`${API}${path}`, {
    method, headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({ status: 'error', message: 'Server error.' }));
  if (!res.ok || json.status === 'error' || json.status === 'fail') {
    throw new Error(json.message || 'Something went wrong.');
  }
  return json.data;
}

const S = {
  page:        { minHeight: '100dvh', background: '#f0f4fa', fontFamily: 'system-ui, sans-serif', padding: '0' },
  card:        { background: '#fff', borderRadius: 16, padding: '24px 20px', margin: '0 0 16px', boxShadow: '0 2px 12px rgba(27,43,75,0.08)' },
  header:      { background: 'linear-gradient(135deg,#1B2B4B,#243660)', padding: '20px', borderRadius: '0 0 20px 20px', marginBottom: 20 },
  label:       { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  input:       { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#f8fafc' },
  btnPrimary:  { width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#1B2B4B,#243660)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' },
  btnGold:     { width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#C8932B,#e0b254)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' },
  btnSecondary:{ width: '100%', padding: '14px', borderRadius: 12, background: '#f0f4fa', color: '#1B2B4B', fontSize: 16, fontWeight: 600, border: '1.5px solid #e2e8f0', cursor: 'pointer' },
  error:       { background: '#FBEAE9', color: '#c0392b', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 12, borderLeft: '3px solid #c0392b' },
  success:     { background: '#E7F6EC', color: '#1a7a3c', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 12, borderLeft: '3px solid #1a7a3c' },
  info:        { background: '#EEF2FF', color: '#3730a3', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 12, borderLeft: '3px solid #6366f1' },
};

const gold = '#C8932B';
const navy = '#1B2B4B';

// ── Replace this with your actual Vercel frontend URL ─────────────────────────
const PRIVACY_URL = 'https://your-domain.vercel.app/privacy';

function LoadingScreen() {
  return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: `4px solid #e2e8f0`, borderTop: `4px solid ${navy}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: 14 }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function InactiveScreen() {
  return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: navy, marginBottom: 8 }}>Service Unavailable</h1>
        <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>
          The student onboarding service is not currently active. Contact your system provider to enable it.
        </p>
      </div>
    </div>
  );
}

function LoginScreen({ teachers, onLogin }) {
  const [teacherId, setTeacherId] = useState('');
  const [pin, setPin]             = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!teacherId) return setError('Please select your name.');
    if (pin.length !== 4) return setError('PIN must be 4 digits.');
    setLoading(true); setError('');
    try { await onLogin(teacherId, pin); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8932B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <div>
            <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0 }}>Student Onboarding</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>Teacher sign-in</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <form onSubmit={handleSubmit}>
          <div style={S.card}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 20, marginTop: 0 }}>Who are you?</h2>
            {error && <div style={S.error}>{error}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Select your name</label>
              <select style={{ ...S.input, appearance: 'none' }} value={teacherId} onChange={e => setTeacherId(e.target.value)} required>
                <option value="">Choose your name…</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Your 4-digit PIN</label>
              <input
                style={{ ...S.input, fontSize: 24, letterSpacing: '0.3em', textAlign: 'center' }}
                type="tel" inputMode="numeric" maxLength={4} pattern="\d{4}" placeholder="••••"
                value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} required
              />
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Set by your admin. Contact them if you don't have one.</p>
            </div>
            <button type="submit" style={S.btnPrimary} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </div>
        </form>

        {/* Privacy policy footer */}
        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', padding: '4px 0 24px' }}>
          By using EduTrack you agree to our{' '}
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer"
            style={{ color: '#6366f1', textDecoration: 'underline' }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

function ClassSelectScreen({ teacher, classes, currentTerm, onSelect, registeredCount, onLogout }) {
  const [classId, setClassId] = useState('');
  const grouped = classes.reduce((acc, c) => {
    const lvl = c.level?.name || 'No Level';
    if (!acc[lvl]) acc[lvl] = [];
    acc[lvl].push(c);
    return acc;
  }, {});

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 2px' }}>Signed in as</p>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>{teacher?.name}</h2>
            {currentTerm && (
              <p style={{ color: gold, fontSize: 12, margin: 0 }}>
                {currentTerm.academicYear?.name} · {currentTerm.name}
              </p>
            )}
          </div>
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
        {registeredCount > 0 && (
          <div style={{ marginTop: 12, background: 'rgba(200,147,43,0.2)', borderRadius: 8, padding: '8px 12px' }}>
            <p style={{ color: gold, fontSize: 13, margin: 0, fontWeight: 600 }}>
              ✓ {registeredCount} student{registeredCount !== 1 ? 's' : ''} registered this session
            </p>
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={S.card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, marginTop: 0, marginBottom: 16 }}>Select a class to register students</h3>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Class</label>
            <select style={{ ...S.input, appearance: 'none' }} value={classId} onChange={e => setClassId(e.target.value)}>
              <option value="">Choose a class…</option>
              {Object.entries(grouped).map(([level, cls]) => (
                <optgroup key={level} label={level}>
                  {cls.map(c => (
                    <option key={c.id} value={c.id}>{c.name}{c.section ? ` (${c.section})` : ''}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <button style={{ ...S.btnGold, opacity: classId ? 1 : 0.5 }} disabled={!classId} onClick={() => classId && onSelect(classId)}>
            Start Registering →
          </button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_STUDENT  = { photo: '', firstName: '', lastName: '', email: '', phone: '', dobDay: '', dobMonth: '', dobYear: '', gender: 'MALE', address: '', residentialStatus: 'DAY', nationality: '' };
const EMPTY_GUARDIAN = { firstName: '', lastName: '', email: '', phone: '', relationship: 'Mother' };
const STEPS = ['Photo', 'Student Info', 'Guardian', 'Review'];

const AFRICAN_NATIONALITIES = {
  'West Africa':   ['Ghanaian','Nigerian','Ivorian','Senegalese','Malian','Burkinabe','Guinean','Sierra Leonean','Liberian','Togolese','Beninese','Nigerien','Gambian','Cape Verdean','Mauritanian'],
  'East Africa':   ['Kenyan','Ugandan','Tanzanian','Rwandan','Ethiopian','Somali','Sudanese','Eritrean','Djiboutian','Burundian'],
  'Central Africa':['Cameroonian','Congolese','Gabonese','Chadian','Central African','Equatorial Guinean'],
  'North Africa':  ['Egyptian','Moroccan','Algerian','Tunisian','Libyan'],
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1960 + 1 }, (_, i) => CURRENT_YEAR - i);
const DAYS  = Array.from({ length: 31 }, (_, i) => i + 1);

function RegisterScreen({ teacher, selectedClass, currentTerm, onDone, onBack }) {
  const [step, setStep]             = useState(0);
  const [student, setStudent]       = useState(EMPTY_STUDENT);
  const [guardian, setGuardian]     = useState(EMPTY_GUARDIAN);
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const photoInputRef               = useRef(null);

  function setS(field, value) { setStudent(f => ({ ...f, [field]: value })); }
  function setG(field, value) { setGuardian(f => ({ ...f, [field]: value })); }

  function getDateOfBirth() {
    if (!student.dobYear || !student.dobMonth || !student.dobDay) return '';
    return `${student.dobYear}-${String(student.dobMonth).padStart(2,'0')}-${String(student.dobDay).padStart(2,'0')}`;
  }

  function handlePhotoCapture(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 600;
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height) { if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; } }
      else { if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; } }
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      setS('photo', canvas.toDataURL('image/jpeg', 0.8));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function validateStep() {
    if (step === 0 && !student.photo) { setError('Photo is required. Please take a photo.'); return false; }
    if (step === 1) {
      if (!student.firstName || !student.lastName) { setError('First and last name are required.'); return false; }
      if (!student.email) { setError('Email is required.'); return false; }
    }
    if (step === 2) {
      if (!guardian.firstName || !guardian.lastName) { setError('Guardian first and last name are required.'); return false; }
      if (!guardian.email) { setError('Guardian email is required.'); return false; }
    }
    setError(''); return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep(s => s + 1);
  }

  async function handleSubmit() {
    setSubmitting(true); setError('');
    try {
      const data = await apiFetch('/onboarding/students', {
        method: 'POST',
        body: {
          ...student,
          dateOfBirth: getDateOfBirth(),
          guardian,
          classId: selectedClass.id,
          termId:  currentTerm?.id,
        },
      });
      onDone(data);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  }

  const StepBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              background: i < step ? gold : i === step ? navy : '#e2e8f0',
              color: i <= step ? '#fff' : '#94a3b8',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 10, color: i === step ? navy : '#94a3b8', marginTop: 3, fontWeight: i === step ? 700 : 400 }}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < step ? gold : '#e2e8f0', margin: '0 4px', marginBottom: 16 }} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ ...S.page, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: navy, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: 0 }}>{teacher?.name} · {selectedClass?.level?.name}</p>
          <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>{selectedClass?.name}{selectedClass?.section ? ` (${selectedClass.section})` : ''}</p>
        </div>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
          ← Classes
        </button>
      </div>

      <StepBar />

      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {error && <div style={S.error}>{error}</div>}

        {/* Step 0: Photo */}
        {step === 0 && (
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: '0 0 6px' }}>Take Student's Photo</h3>
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 20px' }}>This is required. Use the rear camera for best quality.</p>
            <div
              onClick={() => photoInputRef.current?.click()}
              style={{
                width: '100%', aspectRatio: '3/4', maxHeight: 340,
                borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                background: student.photo ? 'transparent' : 'linear-gradient(135deg, #f0f4fa, #e8ecf5)',
                border: `2px dashed ${student.photo ? gold : '#cbd5e1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12, marginBottom: 16,
              }}
            >
              {student.photo ? (
                <img src={student.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, textAlign: 'center' }}>Tap to open camera</p>
                </>
              )}
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} style={{ display: 'none' }} />
            {student.photo && (
              <button type="button" onClick={() => photoInputRef.current?.click()} style={{ ...S.btnSecondary, marginBottom: 12 }}>
                Retake Photo
              </button>
            )}
            <button type="button" style={{ ...S.btnPrimary, opacity: student.photo ? 1 : 0.4 }} disabled={!student.photo} onClick={nextStep}>
              {student.photo ? 'Looks Good →' : 'Photo Required'}
            </button>
          </div>
        )}

        {/* Step 1: Student Info */}
        {step === 1 && (
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: 12, background: '#f8fafc', borderRadius: 12 }}>
              <img src={student.photo} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${gold}` }} />
              <div>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Photo captured</p>
                <p style={{ fontSize: 13, color: navy, fontWeight: 600, margin: 0 }}>Enter student details below</p>
              </div>
            </div>

            {[
              { label: 'First Name *', field: 'firstName', type: 'text',  placeholder: 'e.g. Kwame' },
              { label: 'Last Name *',  field: 'lastName',  type: 'text',  placeholder: 'e.g. Mensah' },
              { label: 'Email *',      field: 'email',     type: 'email', placeholder: 'student@example.com' },
              { label: 'Phone',        field: 'phone',     type: 'tel',   placeholder: '+233 XX XXX XXXX' },
              { label: 'Address',      field: 'address',   type: 'text',  placeholder: 'Residential address' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={S.label}>{label}</label>
                <input style={S.input} type={type} placeholder={placeholder} value={student[field]} onChange={e => setS(field, e.target.value)} />
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Date of Birth</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select style={{ ...S.input, appearance: 'none', flex: 1 }} value={student.dobDay} onChange={e => setS('dobDay', e.target.value)}>
                  <option value="">Day</option>
                  {DAYS.map(d => <option key={d} value={String(d).padStart(2,'0')}>{d}</option>)}
                </select>
                <select style={{ ...S.input, appearance: 'none', flex: 1 }} value={student.dobMonth} onChange={e => setS('dobMonth', e.target.value)}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={String(i+1).padStart(2,'0')}>{m}</option>)}
                </select>
                <select style={{ ...S.input, appearance: 'none', flex: 1 }} value={student.dobYear} onChange={e => setS('dobYear', e.target.value)}>
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Nationality</label>
              <select style={{ ...S.input, appearance: 'none' }} value={student.nationality} onChange={e => setS('nationality', e.target.value)}>
                <option value="">Select nationality…</option>
                {Object.entries(AFRICAN_NATIONALITIES).map(([region, list]) => (
                  <optgroup key={region} label={region}>
                    {list.map(n => <option key={n} value={n}>{n}</option>)}
                  </optgroup>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Gender</label>
              <select style={{ ...S.input, appearance: 'none' }} value={student.gender} onChange={e => setS('gender', e.target.value)}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Residential Status</label>
              <select style={{ ...S.input, appearance: 'none' }} value={student.residentialStatus} onChange={e => setS('residentialStatus', e.target.value)}>
                <option value="DAY">Day Student</option>
                <option value="BOARDING">Boarder</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" style={{ ...S.btnSecondary, flex: 1 }} onClick={() => setStep(0)}>← Back</button>
              <button type="button" style={{ ...S.btnPrimary, flex: 2 }} onClick={nextStep}>Next: Guardian →</button>
            </div>
          </div>
        )}

        {/* Step 2: Guardian */}
        {step === 2 && (
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Guardian / Parent Details</h3>
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 20px' }}>
              For <strong style={{ color: navy }}>{student.firstName} {student.lastName}</strong>
            </p>
            {[
              { label: 'First Name *', field: 'firstName', type: 'text',  placeholder: 'Guardian first name' },
              { label: 'Last Name *',  field: 'lastName',  type: 'text',  placeholder: 'Guardian last name' },
              { label: 'Email *',      field: 'email',     type: 'email', placeholder: 'guardian@example.com' },
              { label: 'Phone',        field: 'phone',     type: 'tel',   placeholder: '+233 XX XXX XXXX' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={S.label}>{label}</label>
                <input style={S.input} type={type} placeholder={placeholder} value={guardian[field]} onChange={e => setG(field, e.target.value)} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Relationship</label>
              <select style={{ ...S.input, appearance: 'none' }} value={guardian.relationship} onChange={e => setG('relationship', e.target.value)}>
                {['Mother','Father','Guardian','Uncle','Aunt','Grandparent','Other'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" style={{ ...S.btnSecondary, flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button type="button" style={{ ...S.btnPrimary, flex: 2 }} onClick={nextStep}>Review →</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <div style={S.card}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: '0 0 16px' }}>Review & Confirm</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
                <img src={student.photo} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${gold}` }} />
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: navy, margin: 0 }}>{student.firstName} {student.lastName}</p>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>{student.email}</p>
                </div>
              </div>
              {[
                { label: 'Class',       value: `${selectedClass?.name}${selectedClass?.section ? ` (${selectedClass.section})` : ''}` },
                { label: 'Level',       value: selectedClass?.level?.name ?? '—' },
                { label: 'Term',        value: `${currentTerm?.academicYear?.name} · ${currentTerm?.name}` },
                { label: 'Gender',      value: student.gender },
                { label: 'Residential', value: student.residentialStatus === 'DAY' ? 'Day Student' : 'Boarder' },
                { label: 'Nationality', value: student.nationality || '—' },
                { label: 'DOB',         value: getDateOfBirth() || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: navy }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 12, background: '#f0f4fa', borderRadius: 10, borderLeft: `3px solid ${gold}` }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Guardian</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: navy, margin: 0 }}>{guardian.firstName} {guardian.lastName} ({guardian.relationship})</p>
                <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>{guardian.email}{guardian.phone ? ` · ${guardian.phone}` : ''}</p>
              </div>
              {error && <div style={{ ...S.error, marginTop: 16 }}>{error}</div>}
            </div>
            <div style={{ padding: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button type="button" style={{ ...S.btnGold }} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Registering…' : '✓ Confirm & Register Student'}
              </button>
              <button type="button" style={S.btnSecondary} onClick={() => setStep(2)} disabled={submitting}>← Go Back & Edit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessScreen({ lastStudent, count, selectedClass, onAddAnother, onSwitchClass, onLogout }) {
  return (
    <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E7F6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a7a3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: navy, margin: '0 0 6px' }}>Student Registered!</h2>
      <p style={{ fontSize: 15, color: '#64748b', margin: '0 0 4px' }}>
        <strong style={{ color: navy }}>{lastStudent?.name}</strong> has been added.
      </p>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px' }}>Student code: <strong>{lastStudent?.studentCode}</strong></p>
      <div style={{ background: '#f0f4fa', borderRadius: 12, padding: '10px 20px', marginBottom: 28, display: 'inline-block' }}>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
          {count} student{count !== 1 ? 's' : ''} registered in <strong style={{ color: navy }}>{selectedClass?.name}</strong> this session
        </p>
      </div>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={S.btnGold} onClick={onAddAnother}>+ Register Next Student</button>
        <button style={S.btnSecondary} onClick={onSwitchClass}>Switch Class</button>
        <button style={{ ...S.btnSecondary, color: '#94a3b8' }} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen]                   = useState('loading');
  const [teachers, setTeachers]               = useState([]);
  const [teacher, setTeacher]                 = useState(null);
  const [classes, setClasses]                 = useState([]);
  const [currentTerm, setCurrentTerm]         = useState(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [registeredCount, setRegisteredCount] = useState(0);
  const [lastStudent, setLastStudent]         = useState(null);

  useEffect(() => {
    apiFetch('/onboarding/status')
      .then(async data => {
        if (!data.active) { setScreen('inactive'); return; }
        const token = localStorage.getItem('ob_token');
        const saved = localStorage.getItem('ob_teacher');
        if (token && saved) {
          setTeacher(JSON.parse(saved));
          const [cls, term] = await Promise.all([apiFetch('/onboarding/classes'), apiFetch('/onboarding/current-term')]);
          setClasses(cls); setCurrentTerm(term);
          setScreen('class_select'); return;
        }
        const t = await apiFetch('/onboarding/teachers');
        setTeachers(t);
        setScreen('login');
      })
      .catch(() => setScreen('inactive'));
  }, []);

  async function handleLogin(teacherId, pin) {
    const data = await apiFetch('/onboarding/login', { method: 'POST', body: { teacherId, pin } });
    localStorage.setItem('ob_token', data.token);
    localStorage.setItem('ob_teacher', JSON.stringify(data.teacher));
    setTeacher(data.teacher);
    const [cls, term] = await Promise.all([apiFetch('/onboarding/classes'), apiFetch('/onboarding/current-term')]);
    setClasses(cls); setCurrentTerm(term);
    setScreen('class_select');
  }

  function handleLogout() {
    localStorage.removeItem('ob_token');
    localStorage.removeItem('ob_teacher');
    setTeacher(null); setSelectedClassId(''); setRegisteredCount(0);
    setScreen('login');
  }

  function handleStudentDone(data) {
    setLastStudent(data);
    setRegisteredCount(c => c + 1);
    setScreen('success');
  }

  const selectedClass = classes.find(c => c.id === selectedClassId);

  if (screen === 'loading')      return <LoadingScreen />;
  if (screen === 'inactive')     return <InactiveScreen />;
  if (screen === 'login')        return <LoginScreen teachers={teachers} onLogin={handleLogin} />;
  if (screen === 'class_select') return (
    <ClassSelectScreen
      teacher={teacher} classes={classes} currentTerm={currentTerm}
      onSelect={id => { setSelectedClassId(id); setScreen('register'); }}
      registeredCount={registeredCount} onLogout={handleLogout}
    />
  );
  if (screen === 'register') return (
    <RegisterScreen
      teacher={teacher} selectedClass={selectedClass} currentTerm={currentTerm}
      onDone={handleStudentDone} onBack={() => setScreen('class_select')}
    />
  );
  if (screen === 'success') return (
    <SuccessScreen
      lastStudent={lastStudent} count={registeredCount} selectedClass={selectedClass}
      onAddAnother={() => setScreen('register')}
      onSwitchClass={() => setScreen('class_select')}
      onLogout={handleLogout}
    />
  );
}