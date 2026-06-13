import http from 'node:http'
import { randomUUID } from 'node:crypto'

const PORT = Number(process.env.PORT || 4000)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const sessions = new Map()
const SESSION_COOKIE = 'canteen_admin_session'
const SESSION_TTL = 1000 * 60 * 60 * 8

// Rate limiting for login attempts (in-memory)
const loginAttempts = new Map()
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5)
const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000) // 15 minutes

// Optional IP allowlist (comma-separated IPv4/IPv6 strings)
const IP_ALLOWLIST = process.env.IP_ALLOWLIST ? process.env.IP_ALLOWLIST.split(',').map(s => s.trim()).filter(Boolean) : null

function getClientIp(req) {
  const xf = req.headers['x-forwarded-for']
  if (xf) return xf.split(',')[0].trim()
  return req.socket.remoteAddress
}

// Require non-default credentials unless explicitly allowed (encourages safe defaults)
if (ADMIN_USERNAME === 'admin' && ADMIN_PASSWORD === 'Admin@123' && process.env.ALLOW_DEFAULT_ADMIN !== 'true') {
  console.error('Refusing to start: default admin credentials are in use. Set ADMIN_USERNAME and ADMIN_PASSWORD environment variables.')
  process.exit(1)
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    ...headers,
  })
  res.end(body)
}

function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  })
  res.end(JSON.stringify(data))
}

function buildSessionCookie(sessionId, maxAgeSeconds = SESSION_TTL / 1000) {
  const isSecure = (process.env.NODE_ENV === 'production') || false
  // If running behind a proxy that terminates TLS, callers can set X-Forwarded-Proto
  // We keep Secure in production to ensure cookies are only sent over HTTPS.
  let cookie = `${SESSION_COOKIE}=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(maxAgeSeconds)}`
  if (isSecure) cookie += '; Secure'
  return cookie
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, item) => {
    const [key, ...rest] = item.trim().split('=')
    if (!key) return cookies
    cookies[key] = decodeURIComponent(rest.join('='))
    return cookies
  }, {})
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie || '')
  const sessionId = cookies[SESSION_COOKIE]
  if (!sessionId) return null

  const session = sessions.get(sessionId)
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId)
    return null
  }

  return { sessionId, ...session }
}

function requireSession(req, res) {
  const session = getSession(req)
  if (!session) {
    res.writeHead(302, { Location: '/login' })
    res.end()
    return null
  }
  return session
}

function loginPage(message = '') {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Sign In</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
        color: #111827;
      }
      .card {
        width: min(420px, calc(100vw - 32px));
        background: #fff;
        border-radius: 18px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
      }
      .badge {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: #7c2d12;
        background: #ffedd5;
        padding: 6px 10px;
        border-radius: 999px;
        margin-bottom: 12px;
      }
      h1 { margin: 0; font-size: 26px; }
      p { color: #6b7280; line-height: 1.5; }
      .warning {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 13px;
        color: #92400e;
        margin: 18px 0 20px;
      }
      label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
      input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        margin-bottom: 16px;
      }
      button {
        width: 100%;
        padding: 12px;
        border: 0;
        border-radius: 10px;
        background: #111827;
        color: white;
        font-weight: 700;
        cursor: pointer;
      }
      .error { color: #dc2626; font-size: 12px; margin-bottom: 12px; }
      .helper { font-size: 12px; color: #6b7280; margin: -10px 0 14px; }
      .hint { margin-top: 16px; font-size: 13px; text-align: center; }
      .hint a { color: #b45309; text-decoration: none; font-weight: 700; }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="badge">Admin access</span>
      <h1>Admin Sign In</h1>
      <p>Sign in with your admin credentials and email.</p>
      <div class="warning">This area is restricted to authorized administrators.</div>
      ${message ? `<div class="error">${message}</div>` : ''}
      <form method="POST" action="/api/login">
        <label for="username">Admin Username</label>
        <input id="username" name="username" autocomplete="username" required />
        <label for="email">Admin Email</label>
        <input id="email" type="email" name="email" autocomplete="email" placeholder="admin@example.com" />
        <p class="helper">Use this if your admin account is tied to an email address.</p>
        <label for="password">Admin Password</label>
        <input id="password" type="password" name="password" autocomplete="current-password" required />
        <button type="submit">Sign In as Admin</button>
      </form>
      <p class="hint">The user app is separate. This server only serves admin access.</p>
    </main>
  </body>
</html>`
}

function dashboardPage(adminUser) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Dashboard</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        color: #111827;
        display: grid;
        place-items: center;
        padding: 20px;
      }
      .card {
        width: min(960px, 100%);
        background: #fff;
        border-radius: 18px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
      }
      .badge {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: #0f766e;
        background: #ccfbf1;
        padding: 6px 10px;
        border-radius: 999px;
        margin-bottom: 12px;
      }
      h1 { margin: 0; font-size: 30px; }
      p { color: #6b7280; line-height: 1.5; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 14px;
        margin: 24px 0;
      }
      .panel {
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 18px;
        background: #f9fafb;
      }
      .panel h3 { margin: 0 0 6px; font-size: 15px; }
      .panel p { margin: 0; font-size: 13px; }
      .actions { display: flex; gap: 12px; flex-wrap: wrap; }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 18px;
        border-radius: 10px;
        border: 0;
        background: #111827;
        color: white;
        text-decoration: none;
        font-weight: 700;
        cursor: pointer;
      }
      .secondary {
        background: #e5e7eb;
        color: #111827;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="badge">Authenticated admin</span>
      <h1>Admin Dashboard</h1>
      <p>Welcome, ${adminUser}. This dashboard runs on a separate admin server.</p>
      <div class="grid">
        <section class="panel"><h3>Manage Menu</h3><p>Add, update, or remove items.</p></section>
        <section class="panel"><h3>Orders</h3><p>Review and process incoming orders.</p></section>
        <section class="panel"><h3>Users</h3><p>Manage access and roles.</p></section>
        <section class="panel"><h3>Reports</h3><p>Monitor usage and performance.</p></section>
      </div>
      <div class="actions">
        <button class="btn" id="logout">Logout</button>
        <a class="btn secondary" href="/">Reload dashboard</a>
      </div>
    </main>
    <script>
      document.getElementById('logout').addEventListener('click', async () => {
        await fetch('/api/logout', { method: 'POST' })
        window.location.href = '/login'
      })
    </script>
  </body>
</html>`
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/login')) {
      send(res, 200, loginPage())
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/login') {
      const clientIp = getClientIp(req)

      // IP allowlist check
      if (IP_ALLOWLIST && !IP_ALLOWLIST.includes(clientIp)) {
        send(res, 403, loginPage('Access denied'))
        return
      }

      // Rate limit check
      const attempts = loginAttempts.get(clientIp) || { count: 0, firstAt: Date.now() }
      if (Date.now() - attempts.firstAt < RATE_LIMIT_WINDOW && attempts.count >= RATE_LIMIT_MAX) {
        send(res, 429, loginPage('Too many login attempts. Try again later.'))
        return
      }

      const body = await readBody(req)
      const payload = new URLSearchParams(body)
      const username = payload.get('username')?.trim() || ''
      const email = payload.get('email')?.trim() || ''
      const password = payload.get('password')?.trim() || ''

      const emailMatches = !ADMIN_EMAIL || email === ADMIN_EMAIL

      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD || !emailMatches) {
        // increment attempts
        if (Date.now() - attempts.firstAt > RATE_LIMIT_WINDOW) {
          loginAttempts.set(clientIp, { count: 1, firstAt: Date.now() })
        } else {
          loginAttempts.set(clientIp, { count: attempts.count + 1, firstAt: attempts.firstAt })
        }
        send(res, 401, loginPage('Invalid admin credentials.'))
        return
      }

      // successful login -> reset attempts
      loginAttempts.delete(clientIp)

      const sessionId = randomUUID()
      sessions.set(sessionId, {
        adminUser: username,
        expiresAt: Date.now() + SESSION_TTL,
      })

      res.writeHead(302, {
        Location: '/dashboard',
        'Set-Cookie': buildSessionCookie(sessionId),
      })
      res.end()
      return
    }

    if (req.method === 'GET' && url.pathname === '/dashboard') {
      const session = requireSession(req, res)
      if (!session) return
      send(res, 200, dashboardPage(session.adminUser))
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/logout') {
      const cookies = parseCookies(req.headers.cookie || '')
      const sessionId = cookies[SESSION_COOKIE]
      if (sessionId) sessions.delete(sessionId)
      res.writeHead(204, {
        'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      })
      res.end()
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/me') {
      const session = getSession(req)
      if (!session) {
        sendJson(res, 401, { authenticated: false })
        return
      }
      sendJson(res, 200, {
        authenticated: true,
        adminUser: session.adminUser,
        expiresAt: session.expiresAt,
      })
      return
    }

    send(res, 404, '<h1>404</h1><p>Not found</p>')
  } catch (error) {
    send(res, 500, `<h1>500</h1><p>${error.message}</p>`)
  }
})

async function startServer() {
  let currentPort = PORT

  const tryListen = () => {
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        currentPort += 1
        tryListen()
        return
      }

      throw error
    })

    server.listen(currentPort, () => {
      console.log(`Admin server running on http://localhost:${currentPort}`)
      console.log(`Admin username: ${ADMIN_USERNAME}`)
      if (currentPort !== PORT) {
        console.log(`Port ${PORT} was busy, so the server switched to ${currentPort}`)
      }
    })
  }

  tryListen()
}

startServer()
