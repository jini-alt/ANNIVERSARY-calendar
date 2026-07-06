module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const cookies = req.headers.cookie || '';
  const hasSession = cookies.split(';').some(c => c.trim().startsWith('session='));
  if (hasSession) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
}
