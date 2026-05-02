const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      now TEXT,
      next TEXT,
      drift TEXT,
      score INTEGER
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS profile (
      username TEXT PRIMARY KEY,
      full_name TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS schedule_overrides (
      row_idx  INTEGER NOT NULL,
      day_idx  INTEGER NOT NULL,
      label    TEXT    NOT NULL,
      category TEXT    NOT NULL,
      PRIMARY KEY (row_idx, day_idx)
    )
  `);
});

module.exports = db;
