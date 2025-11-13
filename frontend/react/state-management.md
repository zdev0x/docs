---
title: React 状态管理
---
# 状态管理指南

## 组件内部状态
```tsx
const [form, setForm] = useState({ name: '', email: '' })

const updateField = (key: keyof typeof form) => (value: string) => {
  setForm(prev => ({ ...prev, [key]: value }))
}
```
- 优先使用局部状态，降低共享范围

## Context + Reducer
```tsx
interface ThemeState { mode: 'light' | 'dark' }
interface ThemeAction { type: 'TOGGLE' }

const ThemeContext = createContext<{ state: ThemeState; dispatch: Dispatch<ThemeAction> } | null>(null)

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  if (action.type === 'TOGGLE') {
    return { mode: state.mode === 'light' ? 'dark' : 'light' }
  }
  return state
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const value = useReducer(themeReducer, { mode: 'light' })
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('ThemeProvider missing')
  return ctx
}
```
- Reducer 适合复杂 state machine，可与 `immer` 配合

## Zustand 极简全局状态
```ts
import { create } from 'zustand'

interface UserState {
  user?: { id: string; name: string }
  setUser: (u: UserState['user']) => void
}

export const useUserStore = create<UserState>(set => ({
  user: undefined,
  setUser: user => set({ user })
}))
```
```tsx
const { user, setUser } = useUserStore()
```
- 轻量 store + selector 能减少 rerender

## 同步服务端数据
- `@tanstack/react-query` 负责远程数据，组件本地 state 处理视图
- 使用 `mutation + optimistic update` 缩短交互延迟

## 最佳实践
- 区分「服务器真相」与「视图局部」状态
- 避免把所有数据塞进单一全局 store，按领域拆分
- 编写 `useXxx` Hook 包装 store，统一暴露 API
