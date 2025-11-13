---
title: dom
---
# DOM 操作

## 元素选择

```javascript
// 单个元素
const el = document.querySelector('.class');
const el2 = document.getElementById('id');

// 多个元素
const els = document.querySelectorAll('.class');
const els2 = [...document.getElementsByClassName('class')];

// 最近的父元素
const parent = el.closest('.parent-class');
```

## 元素创建与插入

```javascript
// 创建元素
const div = document.createElement('div');
div.className = 'my-class';
div.textContent = 'Hello';

// 插入
parent.appendChild(div);
parent.insertBefore(div, referenceNode);
parent.append(div); // 现代方法
parent.prepend(div); // 插入到开头

// 使用模板字符串
parent.insertAdjacentHTML('beforeend', `
  <div class="item">${content}</div>
`);
```

## 类名操作

```javascript
// classList API
el.classList.add('active');
el.classList.remove('inactive');
el.classList.toggle('hidden');
el.classList.contains('active'); // 检查

// 替换
el.classList.replace('old-class', 'new-class');
```

## 样式操作

```javascript
// 内联样式
el.style.color = 'red';
el.style.backgroundColor = '#fff';

// 批量设置
Object.assign(el.style, {
  color: 'red',
  fontSize: '16px',
  marginTop: '10px'
});

// 获取计算样式
const styles = window.getComputedStyle(el);
const color = styles.getPropertyValue('color');
```

## 属性操作

```javascript
// 设置/获取
el.setAttribute('data-id', '123');
const id = el.getAttribute('data-id');

// dataset API
el.dataset.userId = '123';
const userId = el.dataset.userId;

// 删除
el.removeAttribute('data-id');
```

## 事件处理

```javascript
// 添加事件
el.addEventListener('click', handleClick);

// 移除事件
el.removeEventListener('click', handleClick);

// 一次性事件
el.addEventListener('click', handleClick, { once: true });

// 事件委托
parent.addEventListener('click', (e) => {
  if (e.target.matches('.child-class')) {
    // 处理子元素点击
  }
});

// 阻止默认行为
e.preventDefault();
// 阻止冒泡
e.stopPropagation();
```

## 元素尺寸与位置

```javascript
// 获取尺寸
const width = el.offsetWidth;
const height = el.offsetHeight;
const rect = el.getBoundingClientRect();

// 滚动位置
const scrollTop = el.scrollTop;
const scrollLeft = el.scrollLeft;

// 滚动到元素
el.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

## 内容操作

```javascript
// 文本内容
el.textContent = 'New text';
el.innerText = 'New text'; // 考虑样式

// HTML内容
el.innerHTML = '<span>HTML</span>';

// 安全的文本插入
el.textContent = userInput; // 自动转义

// 清空内容
el.innerHTML = '';
el.textContent = '';
```
