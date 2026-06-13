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
  const [passwordError, setPasswordError] = useState('')

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const getPasswordError = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter'
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter'
    if (!/\d/.test(password)) return 'Password must include at least one number'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character'
    return ''
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setForm({ ...form, email: value })
    if (value && !value.endsWith('@adishankara.ac.in')) {
      setEmailError('Please use your college email ending with @adishankara.ac.in')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email.endsWith('@adishankara.ac.in')) {
      setEmailError('Please use your college email ending with @adishankara.ac.in')
      return
    }
    const nextPasswordError = getPasswordError(form.password)
    if (nextPasswordError) {
      setPasswordError(nextPasswordError)
      return
    }
    setPasswordError('')
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
            <label style={styles.label}>Admission Number</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your assigned admission number"
              value={form.admissionNumber}
              onChange={handle('admissionNumber')}
              required
            />
            <p style={styles.hint}></p>
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
            ) : form.email.endsWith('@adishankara.ac.in') ? (
              <p style={styles.successText}>✅ Valid college email</p>
            ) : (
              <p style={styles.hint}>Only @adishankara.ac.in emails are accepted</p>
            )}
          </div>

          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(e) => {
              handle('password')(e)
              setPasswordError(getPasswordError(e.target.value))
            }}
            error={passwordError}
            hint="Use 8+ chars with uppercase, lowercase, number, and special character"
            autoComplete="new-password"
          />

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
  btn: { width: '100%', padding: '11px', backgroundColor: '#1a3a2a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' },
  bottom: { textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6b7280' },
  link: { color: '#1a7a4a', fontWeight: '500' },
}

export default RegisterPage