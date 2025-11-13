---
title: Node.js HTTP 服务
---
# Node.js HTTP / HTTPS 服务

## 最简 HTTP 服务
```ts
import http from 'node:http'

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ message: 'Hello from Node.js' }))
})

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})
```

## HTTPS + HTTP/2
```ts
import fs from 'node:fs'
import http2 from 'node:http2'

const server = http2.createSecureServer({
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt')
})

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/plain; charset=utf-8',
    ':status': 200
  })
  stream.end('HTTP/2 response')
})

server.listen(3443)
```

## Express 快速模板
```ts
import express from 'express'

const app = express()
app.use(express.json())

app.get('/healthz', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/users', (req, res) => {
  const user = req.body
  // TODO: 持久化
  res.status(201).json(user)
})

app.listen(4000, () => console.log('API ready on http://localhost:4000'))
```

## 常见优化清单
- 使用 `compression`/`@fastify/compress` 启用 Gzip/Brotli
- 通过 `helmet` 设置基础安全头
- 将繁重任务交给队列或 Worker Threads，保持请求线程轻量
- 健康检查与 `/ready` `/live` 区分，方便 K8s 探针
