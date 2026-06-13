import { useState } from 'react'

function PasswordInput({ label, value, onChange, error, hint, ...inputProps }) {
  const [show, setShow] = useState(false)

  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.wrap}>
        <input
          style={{
            ...styles.input,
            borderColor: error ? '#ef4444' : '#d1d5db',
          }}
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          value={value}
          onChange={onChange}
          required
          {...inputProps}
        />
        <button type="button" style={styles.eyeBtn} onClick={() => setShow(!show)}>
          {show ? '🙈' : '👁️'}
        </button>
      </div>
      {error ? <p style={styles.errorText}>{error}</p> : hint ? <p style={styles.hint}>{hint}</p> : null}
    </div>
  )
}

const styles = {
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  wrap: { position: 'relative' },
  input: { width: '100%', padding: '10px 40px 10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  hint: { fontSize: '11px', color: '#6b7280', marginTop: '5px' },
  errorText: { fontSize: '11px', color: '#ef4444', marginTop: '5px' },
}

export default PasswordInput