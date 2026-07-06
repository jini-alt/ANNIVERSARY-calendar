module.exports = async function handler(req, res) {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: 'No code' });

  try {
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
    if (!token.access_token) {
      console.error('Token failed:', token);
      return res.redirect('/login?error=token_failed');
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const user = await userRes.json();

    if (!user.email?.endsWith('@laftel.net')) {
      return res.redirect('/login?error=unauthorized_domain');
    }

    const session = Buffer.from(
      JSON.stringify({ email: user.email, name: user.name, ts: Date.now() })
    ).toString('base64');

    res.setHeader('Set-Cookie',
      `session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 8}`
    );
    return res.redirect('/');

  } catch (err) {
    console.error('OAuth error:', err);
    return res.redirect('/login?error=server_error');
  }
}
