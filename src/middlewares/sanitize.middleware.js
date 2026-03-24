/**
 * Express 5: req.query / req.params are read-only — packages that do `req.query = ...`
 * (e.g. xss-clean, default express-mongo-sanitize) throw on assignment.
 * We only sanitize req.body after express.json() has run.
 */
const xss = require("xss");
const { sanitize: mongoSanitize } = require("express-mongo-sanitize");

function sanitizeStringsDeep(value) {
  if (value == null) return value;
  if (typeof value === "string") return xss(value);
  if (Array.isArray(value)) return value.map(sanitizeStringsDeep);
  if (typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = sanitizeStringsDeep(value[key]);
    }
    return out;
  }
  return value;
}

function sanitizeBodyMiddleware(req, res, next) {
  if (req.body != null && typeof req.body === "object") {
    let body = mongoSanitize(req.body);
    body = sanitizeStringsDeep(body);
    req.body = body;
  }
  next();
}

module.exports = sanitizeBodyMiddleware;
