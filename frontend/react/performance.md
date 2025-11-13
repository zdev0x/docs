---
title: React 性能优化
---
# React 性能优化

## 渲染层优化
```tsx
import { memo } from 'react'

const TodoItem = memo(function TodoItem({ todo, onToggle }) {
  console.log('render', todo.id)
  return (
    <li>
      <label>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
        {todo.title}
      </label>
    </li>
  )
})
```
- `React.memo` + `useCallback` 组合，避免频繁 diff
- 将昂贵组件拆成更小单元以提升重用率

## 数据计算缓存
```tsx
const expensiveResult = useMemo(() => heavyCompute(input), [input])
const visibleList = useMemo(() => list.filter(matchKeyword(keyword)), [list, keyword])
```
- `useMemo` 用于稳定 Derived State
- 对象/数组依赖可以借助 `use-deep-compare` 避免浅比较误差

## 滚动列表虚拟化
```tsx
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={400}
  width={320}
  itemCount={items.length}
  itemSize={48}
>
  {({ index, style }) => (
    <div style={style}>{items[index].title}</div>
  )}
</FixedSizeList>
```
- 滚动区域只渲染可视窗口，搭配骨架屏体验更佳

## 开发排查工具
- `React.Profiler` 包裹关键组件，分析 commit 时间
- Chrome Performance 面板 + `startTransition` 分析交互阻塞
- `why-did-you-render` 揪出重复渲染原因

## 服务器渲染/Streaming
- 在 React 18+ 开启 `enableFizzExternalRuntime` 及 Suspense 边界，提升首屏
- 使用 `@tanstack/react-query` 缓存并脱水，减少重复请求
