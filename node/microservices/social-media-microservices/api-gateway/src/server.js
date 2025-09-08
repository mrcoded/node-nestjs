require("dotenv").config();
const cors = require('cors');
const Redis = require('ioredis');
const helmet = require('helmet');
const express = require('express');
const logger = require('./utils/logger');
const proxy = require('express-http-proxy');
const { RedisStore } = require('rate-limit-redis');
const { rateLimit } = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const { validateToken } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.REDIS_URL) {
  logger.error('REDIS_URL environment variable is not set');
  process.exit(1);
}

if (!process.env.IDENTITY_SERVICE_URL) {
  logger.error('IDENTITY_SERVICE_URL environment variable is not set');
  process.exit(1);
}

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
})

app.use(cors())
app.use(helmet());
app.use(express.json())

// rate limiting
// IP-based rate limiting for sensitive endpoints
const rateLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (req, res, next) => {
    try {
      logger.warn(`Sensitive endpoint rate limit exceeded for IP:${req.ip}`)
      res.status(429).json({
        success: false,
        message: `Too many requests`
      })
    } catch (err) {
      logger.error('Rate limiter error:', err);
      res.status(500).json({
        message: "Internal server error", error: err.message
      })
    }
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args)
  })
})

app.use(rateLimiter);

// logger
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next()
});

// create proxy redirect
const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, '/api');
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error: ${err}`);
    res.status(500).json({
      message: "Internal server error", error: err.code
    });
  }
}

// Setting proxy for identity service
app.use("/v1/auth", proxy(process.env.IDENTITY_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json"
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(`Proxy response status:, ${proxyRes.statusCode}, ${proxyRes}`)
    logger.info(`Proxy response from Identity service:, ${proxyResData.message}`)
    return proxyResData;
  }
}));

//setting proxy for post service
app.use("/v1/post", validateToken, proxy(process.env.POST_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;

    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(`Proxy response status:, ${proxyRes.statusCode}, ${proxyRes}`)
    logger.info(`Proxy response from Post service:, ${proxyResData}`)
    return proxyResData;
  }
}))

//setting proxy for search service
app.use("/v1/search", validateToken, proxy(process.env.SEARCH_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;

    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(`Proxy response status:, ${proxyRes.statusCode}, ${proxyRes}`)
    logger.info(`Proxy response from Search service:, ${proxyResData}`)
    return proxyResData;
  }
}))

//setting proxy for media service
app.use("/v1/media", validateToken, proxy(process.env.MEDIA_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
    if (!srcReq.headers["content-type"].startsWith("multipart/form-data")) {
      proxyReqOpts.headers["Content-Type"] = "application/json";
    }

    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(`Proxy response status:, ${proxyRes.statusCode}, ${proxyRes}`)
    logger.info(`Proxy response from Media service:, ${proxyResData}`)
    return proxyResData;
  },
  parseReqBody: false
}))

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API gateway running on port ${PORT}`);
  logger.info(`Redis Url: ${process.env.REDIS_URL}`);
  logger.info(`Post service is running on port ${process.env.POST_SERVICE_URL}`);
  logger.info(`Media service is running on port ${process.env.MEDIA_SERVICE_URL}`);
  logger.info(`Search service is running on port ${process.env.SEARCH_SERVICE_URL}`);
  logger.info(`Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`);
});