---
title: file-operations
---
# Node.js 文件操作

## 读写文件

### 同步读取
```javascript
const fs = require('fs');

// 读取文本文件
const content = fs.readFileSync('file.txt', 'utf-8');
console.log(content);

// 读取JSON
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
```

### 异步读取
```javascript
const fs = require('fs').promises;

// async/await
async function readFile() {
  try {
    const content = await fs.readFile('file.txt', 'utf-8');
    console.log(content);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

// Promise
fs.readFile('file.txt', 'utf-8')
  .then(content => console.log(content))
  .catch(error => console.error(error));
```

### 写入文件
```javascript
const fs = require('fs').promises;

// 写入文本
await fs.writeFile('output.txt', 'Hello World', 'utf-8');

// 写入JSON
const data = { name: 'Alice', age: 25 };
await fs.writeFile('data.json', JSON.stringify(data, null, 2));

// 追加内容
await fs.appendFile('log.txt', 'New log entry
');
```

## 目录操作

```javascript
const fs = require('fs').promises;
const path = require('path');

// 创建目录
await fs.mkdir('new-folder', { recursive: true });

// 读取目录
const files = await fs.readdir('folder');
console.log(files);

// 读取目录（含详细信息）
const entries = await fs.readdir('folder', { withFileTypes: true });
for (const entry of entries) {
  console.log(entry.name, entry.isDirectory() ? 'DIR' : 'FILE');
}

// 删除目录
await fs.rmdir('folder');
await fs.rm('folder', { recursive: true, force: true }); // 递归删除
```

## 文件信息

```javascript
const fs = require('fs').promises;

// 获取文件状态
const stats = await fs.stat('file.txt');
console.log({
  size: stats.size,
  isFile: stats.isFile(),
  isDirectory: stats.isDirectory(),
  created: stats.birthtime,
  modified: stats.mtime
});

// 检查文件是否存在
const exists = await fs.access('file.txt')
  .then(() => true)
  .catch(() => false);
```

## 文件流

### 读取流
```javascript
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt', 'utf-8');

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

readStream.on('end', () => {
  console.log('Finished reading');
});

readStream.on('error', (error) => {
  console.error('Error:', error);
});
```

### 写入流
```javascript
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Line 1
');
writeStream.write('Line 2
');
writeStream.end('Final line
');

writeStream.on('finish', () => {
  console.log('Finished writing');
});
```

### 管道
```javascript
const fs = require('fs');

// 复制文件
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// 压缩文件
const zlib = require('zlib');

fs.createReadStream('file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('file.txt.gz'));
```

## 实用函数

### 递归读取目录
```javascript
const fs = require('fs').promises;
const path = require('path');

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

// 使用
for await (const file of walk('./src')) {
  console.log(file);
}
```

### 确保目录存在
```javascript
const fs = require('fs').promises;
const path = require('path');

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}
```

### 复制文件/目录
```javascript
const fs = require('fs').promises;
const path = require('path');

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}
```
