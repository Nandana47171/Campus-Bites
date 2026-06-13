import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const navigate = useNavigate()

  const emailPattern = /^[0-9]{2}[A-Za-z]+[0-9]{3}@adishankara\.ac\.in$/

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (value && !emailPattern.test(value)) {
      setEmailError('Enter valid college email e.g. 23BCT001@adishankara.ac.in')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!emailPattern.test(email)) {
      setEmailError('Enter valid college email e.g. 23BCT001@adishankara.ac.in')
      return
    }
    console.log('OTP sent to', email)
    navigate('/verify-otp')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Link to="/login" style={styles.back}>← Back to login</Link>

        <h2 style={styles.title}>Forgot Password?</h2>
        <p style={styles.sub}>Enter your college email to reset your password.</p>

        <div style={styles.infoBox}>
          ℹ️ An OTP will be sent to your college email address.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>College Email</label>
            <input
              style={{
                ...styles.input,
                borderColor: emailError ? '#ef4444' : '#d1d5db',
              }}
              type="email"
              placeholder="23BCT289@adishankara.ac.in"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError ? (
              <p style={styles.errorText}>❌ {emailError}</p>
            ) : emailPattern.test(email) ? (
              <p style={styles.successText}>✅ Valid college email</p>
            ) : (
              <p style={styles.hint}>Only @adishankara.ac.in emails are accepted</p>
            )}
          </div>

          <button type="submit" style={styles.btn}>Send OTP</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf5', padding: '20px' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  back: { fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '600', color: '#1a3a2a', marginBottom: '6px' },
  sub: { fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
  infoBox: { backgroundColor: '#f0faf5', border: '1px solid #9fd6b9', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#1a3a2a', marginBottom: '20px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827' },
  hint: { fontSize: '11px', color: '#6b7280', marginTop: '5px' },
  errorText: { fontSize: '11px', color: '#ef4444', marginTop: '5px' },
  successText: { fontSize: '11px', color: '#16a34a', marginTop: '5px' },
  btn: { width: '100%', padding: '11px', backgroundColor: '#1a3a2a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' },
}

export default ForgotPasswordPage