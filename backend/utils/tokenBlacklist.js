// Simple in-memory blacklist for JWT tokens
const blacklist = new Set();

function add(token) {
  blacklist.add(token);
}

function has(token) {
  return blacklist.has(token);
}

module.exports = { add, has }; 