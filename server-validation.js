/* FUTMINNA Dash: leaderboard safety for your Render backend (Node + Express).
   1. npm i express-rate-limit
   2. Set an environment variable SCORE_SECRET on Render (any long random text).
   3. Add these routes BEFORE your existing /api/scores route, and replace the body of your
      existing POST /api/scores handler with the checks in validateScore().
   The game already sends a run token (from /api/start) with every score. */
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const SECRET = process.env.SCORE_SECRET || 'change-me';
const TIME0 = 180;            // seconds on the clock (same as the game)
const MIN_RUN_SECONDS = 30;   // fastest possible win: 500 m at keke speed is about 31 s
const MAX_RUN_SECONDS = 400;  // token is useless after this

const sign = (t) => crypto.createHmac('sha256', SECRET).update(String(t)).digest('hex');

// call once: app.use('/api/', limiter)
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 40 });

// POST /api/start  -> the server remembers when the run began
function startRoute(req, res) {
  const t = Date.now();
  res.json({ token: t + '.' + sign(t) });
}

function elapsedFromToken(token) {
  if (typeof token !== 'string') return null;
  const [t, sig] = token.split('.');
  if (!t || !sig || sign(t) !== sig) return null;
  const secs = (Date.now() - Number(t)) / 1000;
  return secs > 0 && secs < MAX_RUN_SECONDS ? secs : null;
}

// returns { ok:true, clean:{...} } or { ok:false, error:'...' }
function validateScore(body) {
  const name = String(body.name || '').replace(/[<>]/g, '').trim().slice(0, 30);
  const cgpa = Number(body.cgpa), left = Number(body.timeRemaining), win = !!body.win;
  if (name.length < 2) return { ok: false, error: 'bad name' };
  if (!body.faculty || !body.department) return { ok: false, error: 'missing faculty or department' };
  if (!(cgpa >= 0 && cgpa <= 5)) return { ok: false, error: 'bad cgpa' };
  if (!(left >= 0 && left <= TIME0 + 60)) return { ok: false, error: 'bad time' };
  const elapsed = elapsedFromToken(body.token);
  if (elapsed === null) return { ok: false, error: 'invalid or expired run token' };
  if (win && elapsed < MIN_RUN_SECONDS) return { ok: false, error: 'run too fast' };
  if (cgpa > 4.9 && elapsed < 60) return { ok: false, error: 'score not plausible' };
  return { ok: true, clean: { name, cgpa: Math.round(cgpa * 100) / 100, timeRemaining: left, win, faculty: body.faculty, department: body.department } };
}
module.exports = { limiter, startRoute, validateScore };
/* Example use in your server file:
   const { limiter, startRoute, validateScore } = require('./server-validation');
   app.use('/api/', limiter);
   app.post('/api/start', startRoute);
   app.post('/api/scores', (req, res, next) => { const v = validateScore(req.body); if (!v.ok) return res.status(400).json({ error: v.error }); req.body = Object.assign(req.body, v.clean); next(); }); */
