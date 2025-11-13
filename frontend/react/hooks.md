---
title: hooks
---
# Hooks 技巧

## 自定义 Hooks

### useLocalStorage
```typescript
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// 使用
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');
  
  return (
    <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
  );
}
```

### useDebounce
```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // 执行搜索
      fetch(`/api/search?q=${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

### useFetch
```typescript
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        
        if (!cancelled) {
          setState({ data: json, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

// 使用
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return <div>{data.name}</div>;
}
```

### useIntersectionObserver
```typescript
import { useEffect, useRef, useState } from 'react';

function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isIntersecting] as const;
}

// 使用：懒加载图片
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1
  });

  return (
    <div ref={ref}>
      {isVisible && <img src={src} alt={alt} />}
    </div>
  );
}
```

## Hooks 最佳实践

### 1. 条件渲染中避免 Hooks
```typescript
// ❌ 错误
function Component({ shouldShow }: { shouldShow: boolean }) {
  if (!shouldShow) return null;
  
  const [count, setCount] = useState(0); // Hooks 在条件中
  return <div>{count}</div>;
}

// ✅ 正确
function Component({ shouldShow }: { shouldShow: boolean }) {
  const [count, setCount] = useState(0);
  
  if (!shouldShow) return null;
  return <div>{count}</div>;
}
```

### 2. 使用 useCallback 优化函数
```typescript
import { useCallback, useMemo } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ 每次渲染都会创建新函数
  const handleClick = () => {
    setCount(c => c + 1);
  };
  
  // ✅ 只在依赖变化时重新创建
  const handleClickOptimized = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <Child onClick={handleClickOptimized} />;
}
```

### 3. 使用 useMemo 优化计算
```typescript
function ExpensiveComponent({ items }: { items: Item[] }) {
  // ❌ 每次渲染都会计算
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // ✅ 只在 items 变化时重新计算
  const totalOptimized = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
  
  return <div>Total: {totalOptimized}</div>;
}
```
