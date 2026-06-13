import { useState } from 'react'
import { Link } from 'react-router-dom'
import PasswordInput from '../../components/auth/PasswordInput'

const REGISTERED_USER_KEY = 'campus_bites_registered_user'

function LoginPage() {
  const storedUser = (() => {
    try {
      if (typeof localStorage === 'undefined') return null
      const raw = localStorage.getItem(REGISTERED_USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const [admissionNumber, setAdmissionNumber] = useState('')
  const [password, setPassword] = useState('')
  const registeredEmail = storedUser?.email || ''

  const handleLogin = (e) => {
    e.preventDefault()
    if (!registeredEmail) {
      alert('Please register first with your college email')
      return
    }
    console.log({ admissionNumber, email: registeredEmail, password })
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🍽️</span>
          <div>
            <h2 style={styles.logoTitle}>Campus Bites</h2>
            <p style={styles.logoSub}>Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Admission Number</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your assigned admission number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              required
            />
            <p style={styles.hint}></p>
          </div>

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" style={styles.btn}>Sign In</button>
        </form>

        <div style={styles.links}>
          <span style={styles.linkText}>No account? <Link to="/register" style={styles.link}>Register</Link></span>
          <Link to="/forgot-password" style={styles.link}>Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf5', padding: '20px' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' },
  logoIcon: { fontSize: '36px' },
  logoTitle: { fontSize: '20px', fontWeight: '600', color: '#1a3a2a' },
  logoSub: { fontSize: '13px', color: '#6b7280' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827' },
  hint: { fontSize: '11px', color: '#6b7280', marginTop: '5px' },
  btn: { width: '100%', padding: '11px', backgroundColor: '#1a3a2a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' },
  links: { display: 'flex', justifyContent: 'space-between', marginTop: '16px' },
  linkText: { fontSize: '13px', color: '#6b7280' },
  link: { color: '#1a7a4a', fontWeight: '500', fontSize: '13px' },
}

export default LoginPage