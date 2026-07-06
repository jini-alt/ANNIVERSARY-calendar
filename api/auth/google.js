// /api/auth/google.js
// Google OAuth 콜백 — @laftel.net 검증 후 세션 쿠키 발급

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: 'No code' });

  try {
    // 1) code → access_token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:  process.env.GOOGLE_REDIRECT_URI,
        grant_type:    'authorization_code',
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) return res.status(401).json({ error: 'Token failed', detail: token });

    // 2) 사용자 이메일 확인
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const user = await userRes.json();

    // 3) @laftel.net 만 허용
    if (!user.email?.endsWith('@laftel.net')) {
      return res.redirect('/login?error=unauthorized_domain');
    }

    // 4) 세션 쿠키 발급 (8시간)
    const session = Buffer.from(
      JSON.stringify({ email: user.email, name: user.name, ts: Date.now() })
    ).toString('base64');

    res.setHeader('Set-Cookie',
      `session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 8}`
    );
    return res.redirect('/');

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
