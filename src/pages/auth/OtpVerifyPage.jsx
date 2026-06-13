import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function OtpVerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(120)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const inputsRef = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const getPasswordError = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter'
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter'
    if (!/\d/.test(password)) return 'Password must include at least one number'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character'
    return ''
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const updated = [...otp]
    updated[index] = value
    setOtp(updated)
    if (value && index < 5) inputsRef.current[index + 1].focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputsRef.current[index - 1].focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return alert('Passwords do not match!')
    const nextPasswordError = getPasswordError(newPassword)
    if (nextPasswordError) {
      setPasswordError(nextPasswordError)
      return
    }
    setPasswordError('')
    console.log('OTP:', otp.join(''), 'New password:', newPassword)
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Enter OTP</h2>
        <p style={styles.sub}>A 6-digit code was sent to your email.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.otpRow}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                style={styles.otpBox}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <p style={styles.resend}>
            Didn't receive it? <button type="button" style={styles.resendBtn} onClick={() => setTimer(120)}>Resend OTP</button>
            &nbsp;·&nbsp; Expires in <strong>{formatTime(timer)}</strong>
          </p>

          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              style={{
                ...styles.input,
                borderColor: passwordError ? '#ef4444' : '#d1d5db',
              }}
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setPasswordError(getPasswordError(e.target.value))
              }}
              required
              autoComplete="new-password"
            />
            {passwordError ? (
              <p style={styles.errorText}>{passwordError}</p>
            ) : (
              <p style={styles.hint}>Use 8+ chars with uppercase, lowercase, number, and special character</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input style={styles.input} type="password" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <button type="submit" style={styles.btn}>Reset Password</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf5', padding: '20px' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  title: { fontSize: '22px', fontWeight: '600', color: '#1a3a2a', marginBottom: '6px' },
  sub: { fontSize: '13px', color: '#6b7280', marginBottom: '24px' },
  otpRow: { display: 'flex', gap: '10px', marginBottom: '16px' },
  otpBox: { width: '48px', height: '52px', textAlign: 'center', fontSize: '20px', fontWeight: '500', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', color: '#111827' },
  resend: { fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
  resendBtn: { background: 'none', border: 'none', color: '#1a7a4a', fontWeight: '500', cursor: 'pointer', fontSize: '13px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827' },
  hint: { fontSize: '11px', color: '#6b7280', marginTop: '5px' },
  errorText: { fontSize: '11px', color: '#ef4444', marginTop: '5px' },
  btn: { width: '100%', padding: '11px', backgroundColor: '#1a3a2a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' },
}

export default OtpVerifyPage