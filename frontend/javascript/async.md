---
title: async
---
# 异步编程

## Promise 基础

### 创建 Promise
```javascript
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 使用
await delay(1000);
console.log('1秒后执行');
```

### Promise.all - 并发执行
```javascript
const fetchUsers = async () => {
  const [user1, user2, user3] = await Promise.all([
    fetch('/api/user/1').then(r => r.json()),
    fetch('/api/user/2').then(r => r.json()),
    fetch('/api/user/3').then(r => r.json())
  ]);
  return [user1, user2, user3];
};
```

### Promise.race - 竞速
```javascript
const timeout = (ms, promise) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
};

// 使用
try {
  const data = await timeout(5000, fetch('/api/data'));
} catch (err) {
  console.error('请求超时或失败');
}
```

## async/await 模式

### 错误处理
```javascript
// 方式1: try-catch
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// 方式2: 统一错误处理
const to = promise => 
  promise.then(data => [null, data]).catch(err => [err, null]);

const [err, data] = await to(fetch('/api/data'));
if (err) {
  // 处理错误
}
```

### 并发控制
```javascript
// 限制并发数量
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);
    
    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

// 使用：最多同时3个请求
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
await asyncPool(3, urls, async url => {
  return await fetch(url);
});
```

## 重试机制

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 使用
const data = await retry(() => fetch('/api/data'), 3, 2000);
```

## 队列执行

```javascript
class AsyncQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }
  
  add(fn) {
    this.queue.push(fn);
    if (!this.running) {
      this.run();
    }
  }
  
  async run() {
    this.running = true;
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      await fn();
    }
    this.running = false;
  }
}

// 使用
const queue = new AsyncQueue();
queue.add(async () => console.log('Task 1'));
queue.add(async () => console.log('Task 2'));
```
