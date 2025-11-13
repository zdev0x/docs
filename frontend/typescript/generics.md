---
title: generics
---
# 泛型技巧

## 基础泛型

### 泛型函数
```typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(123); // number
const str = identity('hello'); // string
```

### 泛型接口
```typescript
interface Response<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: Response<User> = {
  data: { id: 1, name: 'Alice' },
  status: 200,
  message: 'Success'
};
```

### 泛型类
```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

const myNumber = new GenericNumber<number>();
myNumber.zeroValue = 0;
myNumber.add = (x, y) => x + y;
```

## 泛型约束

### extends 约束
```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength('hello'); // OK
logLength([1, 2, 3]); // OK
// logLength(123); // Error: number 没有 length
```

### keyof 约束
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alice' };
const name = getProperty(user, 'name'); // OK
// getProperty(user, 'age'); // Error
```

## 高级泛型模式

### 泛型工厂
```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function createInstance<T>(ctor: Constructor<T>): T {
  return new ctor();
}

class User {
  name = 'default';
}

const user = createInstance(User);
```

### 递归泛型
```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

interface Config {
  server: {
    host: string;
    port: number;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
```

### 条件泛型
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number
```

## 实用泛型示例

### API 请求封装
```typescript
async function request<T>(url: string): Promise<Response<T>> {
  const res = await fetch(url);
  const data = await res.json();
  return {
    data: data as T,
    status: res.status,
    message: res.statusText
  };
}

interface User {
  id: number;
  name: string;
}

const result = await request<User>('/api/user/1');
// result.data 类型为 User
```

### 类型安全的事件系统
```typescript
type EventMap = {
  click: MouseEvent;
  change: Event;
  custom: { data: string };
};

class TypedEventEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void) {
    // ...
  }
  
  emit<K extends keyof T>(event: K, payload: T[K]) {
    // ...
  }
}

const emitter = new TypedEventEmitter<EventMap>();
emitter.on('click', (e) => {
  // e 类型为 MouseEvent
  console.log(e.clientX);
});
```

### 类型安全的状态管理
```typescript
type Actions<S> = {
  [K: string]: (state: S, payload?: any) => S;
};

function createStore<S, A extends Actions<S>>(
  initialState: S,
  actions: A
) {
  let state = initialState;
  
  return {
    getState: () => state,
    dispatch<K extends keyof A>(
      action: K,
      payload?: Parameters<A[K]>[1]
    ) {
      state = actions[action](state, payload);
    }
  };
}
```
