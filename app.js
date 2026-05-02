require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const { generateToken, authenticate } = require('./auth');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public', { etag: false, lastModified: false, setHeaders: (res) => {
  res.setHeader('Cache-Control', 'no-store');
}}));

app.get('/', (req, res) => res.redirect('/login.html'));

const USER = process.env.APP_USER;
const PASS = process.env.APP_PASS;

if (!USER || !PASS) {
  console.error('ERROR: APP_USER and APP_PASS must be set in .env');
  process.exit(1);
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER && password === PASS) {
    return res.json({ token: generateToken(username) });
  }
  res.status(401).send("Invalid credentials");
});

app.post('/log', authenticate, (req, res) => {
  const { date, now, next, drift, score } = req.body;
  db.run(
    `INSERT INTO logs (date, now, next, drift, score) VALUES (?, ?, ?, ?, ?)`,
    [date, now, next, drift, score],
    function(err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

app.get('/logs', authenticate, (req, res) => {
  db.all(`SELECT * FROM logs ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.get('/profile', authenticate, (req, res) => {
  db.get(`SELECT full_name FROM profile WHERE username = ?`, [req.user.username], (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.json({ username: req.user.username, full_name: row?.full_name || '' });
  });
});

app.post('/profile', authenticate, (req, res) => {
  const { full_name } = req.body;
  db.run(
    `INSERT INTO profile (username, full_name) VALUES (?, ?)
     ON CONFLICT(username) DO UPDATE SET full_name = excluded.full_name`,
    [req.user.username, full_name],
    function(err) {
      if (err) return res.status(500).send(err.message);
      res.json({ ok: true });
    }
  );
});

app.get('/schedule/overrides', authenticate, (req, res) => {
  db.all(`SELECT row_idx, day_idx, label, category FROM schedule_overrides`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.post('/schedule/overrides', authenticate, (req, res) => {
  const { row_idx, day_idx, label, category } = req.body;
  db.run(
    `INSERT INTO schedule_overrides (row_idx, day_idx, label, category)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(row_idx, day_idx) DO UPDATE SET label=excluded.label, category=excluded.category`,
    [row_idx, day_idx, label, category],
    function(err) {
      if (err) return res.status(500).send(err.message);
      res.json({ ok: true });
    }
  );
});

app.delete('/schedule/overrides/:row/:day', authenticate, (req, res) => {
  db.run(
    `DELETE FROM schedule_overrides WHERE row_idx=? AND day_idx=?`,
    [req.params.row, req.params.day],
    function(err) {
      if (err) return res.status(500).send(err.message);
      res.sendStatus(204);
    }
  );
});

app.get('/scores/daily', authenticate, (req, res) => {
  db.all(
    `SELECT substr(date, 1, 10) AS day,
            ROUND(AVG(score), 2)  AS avg_score,
            COUNT(*)              AS entries
     FROM logs
     WHERE score IS NOT NULL
     GROUP BY day
     ORDER BY day ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

app.delete('/log/:id', authenticate, (req, res) => {
  db.run(`DELETE FROM logs WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(204);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
