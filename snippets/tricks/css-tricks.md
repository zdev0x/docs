---
title: CSS 常用技巧
---

# CSS 常用技巧

## 文本超出显示省略号

```css
/* 单行文本 */
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 多行文本（2行） */
.ellipsis-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

## 滚动条样式

```css
/* 滚动条整体 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.06);
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #999;
}
```

## 悬停下划线动画

```css
.link {
    position: relative;
    text-decoration: none;
    color: #333;
}

.link::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: 0;
    height: 2px;
    background: #4285f4;
    transition: all 0.3s;
}

.link:hover::before {
    width: 100%;
    left: 0;
}
```

## CSS 三角形

```css
.triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid #ff0;
}

/* 向上的三角 */
.triangle-up {
    border-bottom: 100px solid #ff0;
}

/* 向下的三角 */
.triangle-down {
    border-top: 100px solid #ff0;
}

/* 向左的三角 */
.triangle-left {
    border-right: 100px solid #ff0;
}

/* 向右的三角 */
.triangle-right {
    border-left: 100px solid #ff0;
}
```
