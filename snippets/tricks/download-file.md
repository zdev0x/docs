---
title: 前端文件下载
---

# 前端文件下载

## 纯前端下载

使用 Blob 创建文件并触发下载。

```javascript
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// 使用示例
const data = JSON.stringify({ name: 'test', value: 123 }, null, 2);
downloadFile(data, 'data.json', 'application/json');
```

## 下载远程文件

```javascript
async function downloadRemoteFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// 使用示例
downloadRemoteFile('https://example.com/file.pdf', 'document.pdf');
```

## Canvas 导出图片

```javascript
function downloadCanvas(canvas, filename = 'image.png') {
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    });
}

// 使用示例
const canvas = document.getElementById('myCanvas');
downloadCanvas(canvas, 'chart.png');
```
