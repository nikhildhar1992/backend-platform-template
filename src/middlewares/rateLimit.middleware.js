const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const logger = require("../utils/logger");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per IP
  message: {
    success: false,
    message: "Too many requests, please try later"
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // register attempts per IP
  message: {
    success: false,
    message: "Too many registration attempts"
  }
});

/**
 * Stricter limit for /login (and any route where req.user is not set yet).
 *
 * IMPORTANT: Prefer the TCP socket address over req.ip.
 * When trust proxy is enabled, req.ip can follow X-Forwarded-For — easy to spoof
 * or vary in Postman, which creates a NEW bucket every request → limit never fills.
 *
 * Memory store resets when the Node process restarts (nodemon, docker restart).
 *
 * Semantics (express-rate-limit): blocks when totalHits > limit, so limit:2 allows
 * the first 2 requests; the 3rd returns 429 in the same window.
 */
function normalizeClientIp(raw) {
  if (!raw || raw === "unknown") return raw || "unknown";
  const s = String(raw).trim();
  if (s === "::1" || s === "127.0.0.1" || s === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }
  return s;
}

function getClientIpForRateLimit(req) {
  const raw =
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    "unknown";
  return normalizeClientIp(raw);
}

function stableClientKey(req) {
  if (req.user?.id != null) {
    return `uid:${req.user.id}`;
  }
  const raw = getClientIpForRateLimit(req);
  return `ip:${ipKeyGenerator(raw)}`;
}

const loginRateLimitBody = {
  success: false,
  message: "Too many login attempts, please try later"
};

const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2,
  keyGenerator: stableClientKey,
  standardHeaders: "draft-6",
  legacyHeaders: true,
  message: loginRateLimitBody,
  handler: async (req, res, _next, options) => {
    logger.info({message: loginRateLimitBody.message});
    res.status(options?.statusCode ?? 429).json(loginRateLimitBody);
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  userLimiter
};
