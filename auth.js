const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  console.error('ERROR: JWT_SECRET must be set in .env');
  process.exit(1);
}

function generateToken(username) {
  return jwt.sign({ username }, SECRET, { expiresIn: "1d" });
}

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

module.exports = { generateToken, authenticate };
