---
title: array
---
# 数组操作

## 数组去重

### 使用 Set
```javascript
const unique = arr => [...new Set(arr)];

// 示例
const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(unique(numbers)); // [1, 2, 3, 4, 5]
```

### 使用 filter
```javascript
const unique = arr => arr.filter((item, index) => arr.indexOf(item) === index);
```

## 数组扁平化

```javascript
// 使用 flat
const flatten = arr => arr.flat(Infinity);

// 递归实现
const flattenDeep = arr => 
  arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), 
  []);

// 示例
const nested = [1, [2, [3, [4]]]];
console.log(flatten(nested)); // [1, 2, 3, 4]
```

## 数组分组

```javascript
const groupBy = (arr, key) => 
  arr.reduce((acc, item) => {
    const group = item[key];
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});

// 示例
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];
console.log(groupBy(users, 'age'));
// { '25': [{...}, {...}], '30': [{...}] }
```

## 数组求和

```javascript
const sum = arr => arr.reduce((acc, val) => acc + val, 0);

// 示例
console.log(sum([1, 2, 3, 4, 5])); // 15
```
