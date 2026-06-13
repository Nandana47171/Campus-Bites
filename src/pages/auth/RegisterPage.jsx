import { useState } from 'react'
import { Link } from 'react-router-dom'
import PasswordInput from '../../components/auth/PasswordInput'

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    admissionNumber: '',
    email: '',
    password: '',
  })
  const [emailError, setEmailError] = useState('')

  const emailPattern = /^[0-9]{2}[A-Za-z]+[0-9]{3}@adishankara\.ac\.in$/

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleEmailChange = (e) => {
    const value = e.target.value
    setForm({ ...form, email: value })
    if (value && !emailPattern.test(value)) {
      setEmailError('Enter valid college email e.g. 23BCT289@adishankara.ac.in')
    } else {
      setEmailError('')
    }
  }

  const getStrength = (pwd) => {
    if (!pwd) return null
    const hasLength = pwd.length >= 8
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    const hasUpper = /[A-Z]/.test(pwd)
    if (hasLength && hasNumber && hasSpecial && hasUpper) return 'strong'
    if (hasLength && (hasNumber || hasSpecial)) return 'medium'
    return 'weak'
  }

  const checkRequirements = (pwd) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!emailPattern.test(form.email)) {
      setEmailError('Enter valid college email e.g. 23BCT289@adishankara.ac.in')
      return
    }
    if (getStrength(form.password) !== 'strong') {
      alert('Please create a strong password — must have 8+ characters, uppercase, number and special character!')
      return
    }
    console.log(form)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.sub}>Register with your college credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Arjun"
                value={form.firstName}
                onChange={handle('firstName')}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Menon"
                value={form.lastName}
                onChange={handle('lastName')}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Admission Number / Faculty ID</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. 23BCT289 or FAX001"
              value={form.admissionNumber}
              onChange={handle('admissionNumber')}
              required
            />
            <p style={styles.hint}>
              ℹ️ Students enter admission number (e.g. 23BCT289), Faculty enter faculty ID (e.g. FAX001). Your role will be detected automatically.
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>College Email</label>
            <input
              style={{
                ...styles.input,
                borderColor: emailError ? '#ef4444' : '#d1d5db',
              }}
              type="email"
              placeholder="23BCT289@adishankara.ac.in"
              value={form.email}
              onChange={handleEmailChange}
              required
            />
            {emailError ? (
              <p style={styles.errorText}>❌ {emailError}</p>
            ) : emailPattern.test(form.email) ? (
              <p style={styles.successText}>✅ Valid college email</p>
            ) : (
              <p style={styles.hint}>Only @adishankara.ac.in emails are accepted</p>
            )}
          </div>

          <PasswordInput
            label="Password"
            value={form.password}
            onChange={handle('password')}
            showStrength={true}
          />

          {form.password && (
            <div style={styles.requirementsBox}>
              <p style={styles.requirementsTitle}>Password Requirements:</p>
              <div style={styles.requirementsList}>
                <div style={styles.requirement}>
                  <span style={{ ...styles.checkIcon, color: checkRequirements(form.password).length ? '#16a34a' : '#d1d5db' }}>
                    {checkRequirements(form.password).length ? '✓' : '○'}
                  </span>
                  <span style={{ color: checkRequirements(form.password).length ? '#16a34a' : '#6b7280' }}>8+ characters</span>
                </div>
                <div style={styles.requirement}>
                  <span style={{ ...styles.checkIcon, color: checkRequirements(form.password).uppercase ? '#16a34a' : '#d1d5db' }}>
                    {checkRequirements(form.password).uppercase ? '✓' : '○'}
                  </span>
                  <span style={{ color: checkRequirements(form.password).uppercase ? '#16a34a' : '#6b7280' }}>Uppercase</span>
                </div>
                <div style={styles.requirement}>
                  <span style={{ ...styles.checkIcon, color: checkRequirements(form.password).number ? '#16a34a' : '#d1d5db' }}>
                    {checkRequirements(form.password).number ? '✓' : '○'}
                  </span>
                  <span style={{ color: checkRequirements(form.password).number ? '#16a34a' : '#6b7280' }}>Number</span>
                </div>
                <div style={styles.requirement}>
                  <span style={{ ...styles.checkIcon, color: checkRequirements(form.password).special ? '#16a34a' : '#d1d5db' }}>
                    {checkRequirements(form.password).special ? '✓' : '○'}
                  </span>
                  <span style={{ color: checkRequirements(form.password).special ? '#16a34a' : '#6b7280' }}>Special character</span>
                </div>
              </div>
            </div>
          )}

          <button type="submit" style={styles.btn}>Create Account</button>
        </form>

        <p style={styles.bottom}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf5', padding: '20px' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  header: { marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '600', color: '#1a3a2a' },
  sub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827' },
  hint: { fontSize: '11px', color: '#6b7280', marginTop: '5px' },
  errorText: { fontSize: '11px', color: '#ef4444', marginTop: '5px' },
  successText: { fontSize: '11px', color: '#16a34a', marginTop: '5px' },
  requirementsBox: { backgroundColor: '#f9fdf9', border: '1px solid #d1e7d8', borderRadius: '8px', padding: '12px 14px', marginTop: '12px', marginBottom: '16px' },
  requirementsTitle: { fontSize: '12px', fontWeight: '600', color: '#1a3a2a', marginBottom: '8px', margin: '0 0 8px 0' },
  requirementsList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  requirement: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
  checkIcon: { fontSize: '16px', fontWeight: 'bold', minWidth: '16px' },
  btn: { width: '100%', padding: '11px', backgroundColor: '#1a3a2a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' },
  bottom: { textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6b7280' },
  link: { color: '#1a7a4a', fontWeight: '500' },
}

export default RegisterPage