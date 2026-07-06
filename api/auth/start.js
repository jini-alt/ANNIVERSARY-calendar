// /api/auth/start.js
// Google 로그인 동의 화면으로 리다이렉트

export default function handler(req, res) {
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope:         'email profile',
    access_type:   'online',
    prompt:        'select_account',
    hd:            'laftel.net',   // @laftel.net 계정 힌트 (서버에서 실제로 검증)
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
