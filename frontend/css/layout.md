---
title: layout
---
# CSS 布局技巧

## Flexbox 布局

### 基础用法
```css
.container {
  display: flex;
  justify-content: center; /* 主轴对齐 */
  align-items: center;     /* 交叉轴对齐 */
  gap: 16px;               /* 间距 */
}
```

### 常用模式

#### 水平垂直居中
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

#### 等宽列
```css
.columns {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1; /* 等宽 */
}
```

#### 自适应导航
```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  gap: 16px;
}

.nav-right {
  margin-left: auto;
}
```

## Grid 布局

### 基础网格
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### 自适应列
```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

### 复杂布局
```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 20px;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

## 定位技巧

### 粘性定位
```css
.sticky-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
```

### 绝对定位居中
```css
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

## 响应式设计

### 容器查询
```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

### 流式排版
```css
.text {
  font-size: clamp(1rem, 2.5vw, 2rem);
  line-height: 1.6;
  max-width: 65ch; /* 字符宽度 */
}
```

## 常用技巧

### 宽高比
```css
.aspect-ratio {
  aspect-ratio: 16 / 9;
}

/* 兼容写法 */
.aspect-ratio-old {
  position: relative;
  padding-bottom: 56.25%; /* 9/16 = 0.5625 */
}

.aspect-ratio-old > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### 文本省略
```css
/* 单行 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行 */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 滚动吸附
```css
.scroll-container {
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  display: flex;
}

.scroll-item {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 100%;
}
```
