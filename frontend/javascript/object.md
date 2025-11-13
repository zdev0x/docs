---
title: object
---
# 对象处理

## 对象深拷贝

### 使用 JSON
```javascript
const deepClone = obj => JSON.parse(JSON.stringify(obj));

// 注意：不能处理函数、undefined、Symbol、循环引用
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
```

### 递归实现
```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return null;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== 'object') return obj;
  
  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);
  
  const cloneObj = new obj.constructor();
  hash.set(obj, cloneObj);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

### 使用 structuredClone (现代浏览器)
```javascript
const cloned = structuredClone(obj);
```

## 对象合并

```javascript
// 浅合并
const merged = { ...obj1, ...obj2 };
const merged2 = Object.assign({}, obj1, obj2);

// 深合并
function deepMerge(target, source) {
  for (let key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return Object.assign(target || {}, source);
}
```

## 对象属性过滤

```javascript
// 删除 null/undefined 属性
const removeEmpty = obj => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
};

// 示例
const data = { a: 1, b: null, c: undefined, d: 'text' };
console.log(removeEmpty(data)); // { a: 1, d: 'text' }
```

## 对象键值转换

```javascript
// 交换键值
const invertObj = obj => 
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

// 示例
const map = { a: '1', b: '2' };
console.log(invertObj(map)); // { '1': 'a', '2': 'b' }
```

## 对象扁平化

```javascript
function flattenObj(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObj(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
}

// 示例
const nested = {
  a: 1,
  b: { c: 2, d: { e: 3 } }
};
console.log(flattenObj(nested));
// { a: 1, 'b.c': 2, 'b.d.e': 3 }
```
