import { useRef } from 'react'

function OtpInput({ otp, onChange }) {
  const inputsRef = useRef([])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const updated = [...otp]
    updated[index] = value
    onChange(updated)
    if (value && index < otp.length - 1) inputsRef.current[index + 1].focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputsRef.current[index - 1].focus()
  }

  return (
    <div style={styles.row}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          style={styles.box}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  )
}

const styles = {
  row: { display: 'flex', gap: '10px', marginBottom: '16px' },
  box: { width: '48px', height: '52px', textAlign: 'center', fontSize: '20px', fontWeight: '500', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', color: '#111827' },
}

export default OtpInput