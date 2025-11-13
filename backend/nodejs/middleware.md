---
title: Node.js 中间件
---
# 中间件模式

## Express 链式中间件
```ts
import express from 'express'

const app = express()

const requestLogger = (req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
}

const requireAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Missing token' })
  }
  next()
}

app.use(requestLogger)
app.use(requireAuth)

app.get('/profile', (req, res) => {
  res.json({ id: 'u_01', name: 'Coder' })
})

app.listen(3000)
```

## Koa 组合
```ts
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const cost = Date.now() - start
  ctx.set('X-Response-Time', `${cost}ms`)
})

app.use(async (ctx, next) => {
  if (!ctx.headers['x-request-id']) {
    ctx.throw(400, 'x-request-id required')
  }
  await next()
})

app.use(async ctx => {
  ctx.body = { status: 'ok' }
})

app.listen(3100)
```

## 自定义可复用中间件包
```ts
export const rateLimiter = ({ limit, windowMs }) => {
  const hits = new Map<string, { count: number; expires: number }>()

  return (req, res, next) => {
    const key = req.ip
    const bucket = hits.get(key) ?? { count: 0, expires: Date.now() + windowMs }

    if (Date.now() > bucket.expires) {
      bucket.count = 0
      bucket.expires = Date.now() + windowMs
    }

    bucket.count += 1
    hits.set(key, bucket)

    if (bucket.count > limit) {
      return res.status(429).json({ error: 'Too many requests' })
    }

    next()
  }
}
```

## 设计要点
- 保持中间件纯粹：输入 `req/res`，输出 `next()`
- 在中间件中附加的属性统一命名（如 `req.ctx`），方便下游消费
- 关注执行顺序，可利用 `app.use(path, middleware)` 分层
