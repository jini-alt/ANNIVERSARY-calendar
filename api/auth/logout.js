// /api/auth/logout.js
// 세션 쿠키 삭제 후 /login으로

export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
  return res.redirect('/login');
}
