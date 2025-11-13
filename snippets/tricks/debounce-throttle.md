---
title: 防抖和节流
---

# 防抖和节流

## 防抖 (Debounce)

一个需要频繁触发的函数，在规定时间内，只让最后一次生效。

```javascript
function debounce(fn, delay) {
    let timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
}

// 使用示例
document.getElementById('input').oninput = debounce(function() {
    console.log('搜索：', this.value);
}, 500);
```

## 节流 (Throttle)

一个函数执行一次后，只有大于设定的执行周期才会执行第二次。

```javascript
function throttle(fn, delay) {
    let lastTime = 0;
    return function() {
        const nowTime = Date.now();
        if (nowTime - lastTime > delay) {
            fn.apply(this, arguments);
            lastTime = nowTime;
        }
    };
}

// 使用示例
window.onscroll = throttle(function() {
    console.log('滚动位置：', window.scrollY);
}, 200);
```
