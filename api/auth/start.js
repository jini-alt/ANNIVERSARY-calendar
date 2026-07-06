module.exports = function handler(req, res) {
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope:         'email profile',
    access_type:   'online',
    prompt:        'select_account',
    hd:            'laftel.net',
  });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
