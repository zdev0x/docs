---
title: utility-types
---
# 类型工具

## 内置工具类型

### Partial - 所有属性可选
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// 使用场景：更新操作
function updateUser(id: number, updates: Partial<User>) {
  // ...
}
```

### Required - 所有属性必填
```typescript
type RequiredUser = Required<PartialUser>;
// 所有属性变为必填
```

### Pick - 选择部分属性
```typescript
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
```

### Omit - 排除部分属性
```typescript
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; }
```

### Record - 构造对象类型
```typescript
type Role = 'admin' | 'user' | 'guest';
type Permissions = Record<Role, string[]>;
// { admin: string[]; user: string[]; guest: string[]; }

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};
```

### Readonly - 只读
```typescript
type ReadonlyUser = Readonly<User>;
// 所有属性只读

const user: ReadonlyUser = { id: 1, name: 'Alice', email: 'a@b.c' };
// user.name = 'Bob'; // Error
```

## 自定义工具类型

### DeepPartial - 深度可选
```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  server: {
    host: string;
    port: number;
  };
  database: {
    host: string;
    port: number;
  };
}

type PartialConfig = DeepPartial<Config>;
```

### NonNullable - 排除 null/undefined
```typescript
type T = string | number | null | undefined;
type NonNull = NonNullable<T>; // string | number
```

### ReturnType - 获取函数返回类型
```typescript
function getUser() {
  return { id: 1, name: 'Alice' };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; }
```

### Parameters - 获取函数参数类型
```typescript
function createUser(name: string, age: number) {
  // ...
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number]
```

### Awaited - 获取 Promise 返回类型
```typescript
async function fetchUser() {
  return { id: 1, name: 'Alice' };
}

type User = Awaited<ReturnType<typeof fetchUser>>;
// { id: number; name: string; }
```

## 条件类型

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// 实用示例：提取数组元素类型
type ArrayElement<T> = T extends (infer E)[] ? E : T;

type Num = ArrayElement<number[]>; // number
type Str = ArrayElement<string>; // string
```

## 映射类型

```typescript
// 将所有属性变为可选且只读
type ReadonlyPartial<T> = {
  readonly [P in keyof T]?: T[P];
};

// 添加前缀
type Prefixed<T, Prefix extends string> = {
  [P in keyof T as `${Prefix}${Capitalize<string & P>}`]: T[P];
};

type User = { name: string; age: number; };
type GetUser = Prefixed<User, 'get'>;
// { getName: string; getAge: number; }
```
