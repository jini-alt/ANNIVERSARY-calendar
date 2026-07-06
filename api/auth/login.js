module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;

  if (password !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ ok: false });
  }

  const session = Buffer.from(
    JSON.stringify({ auth: true, ts: Date.now() })
  ).toString('base64');

  res.setHeader('Set-Cookie',
    `session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  );
  return res.status(200).json({ ok: true });
}
