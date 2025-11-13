---
title: decorators
---
# 装饰器

::: warning 实验性特性
装饰器目前是 TypeScript 的实验性特性，需要在 tsconfig.json 中启用：
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```
:::

## 类装饰器

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}
```

### 装饰器工厂
```typescript
function logger(prefix: string) {
  return function(constructor: Function) {
    console.log(`${prefix}: ${constructor.name}`);
  };
}

@logger('Created')
class User {
  constructor(public name: string) {}
}
```

## 方法装饰器

```typescript
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3); // 会打印日志
```

### 性能测量
```typescript
function measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };
  
  return descriptor;
}

class DataService {
  @measure
  async fetchData() {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: 'result' };
  }
}
```

## 属性装饰器

```typescript
function format(formatString: string) {
  return function(target: any, propertyKey: string) {
    let value: string;
    
    const getter = () => value;
    const setter = (newVal: string) => {
      value = formatString.replace('%s', newVal);
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @format('Hello, %s!')
  name: string;
}

const user = new User();
user.name = 'Alice';
console.log(user.name); // "Hello, Alice!"
```

## 参数装饰器

```typescript
function required(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  const existingParameters = 
    Reflect.getMetadata('required', target, propertyKey) || [];
  existingParameters.push(parameterIndex);
  Reflect.defineMetadata('required', existingParameters, target, propertyKey);
}

function validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const requiredParameters = 
      Reflect.getMetadata('required', target, propertyKey) || [];
    
    for (const index of requiredParameters) {
      if (args[index] === undefined) {
        throw new Error(`Parameter at index ${index} is required`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @validate
  createUser(@required name: string, age?: number) {
    return { name, age };
  }
}
```

## 实用装饰器示例

### 缓存装饰器
```typescript
function cache(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cacheMap = new Map();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cacheMap.has(key)) {
      console.log('Returning cached result');
      return cacheMap.get(key);
    }
    
    const result = originalMethod.apply(this, args);
    cacheMap.set(key, result);
    return result;
  };
  
  return descriptor;
}

class ExpensiveCalculator {
  @cache
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
```

### 防抖装饰器
```typescript
function debounce(delay: number) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    let timeoutId: NodeJS.Timeout;
    
    descriptor.value = function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };
    
    return descriptor;
  };
}

class SearchBox {
  @debounce(300)
  handleSearch(query: string) {
    console.log('Searching for:', query);
  }
}
```

### 权限检查装饰器
```typescript
function requireRole(role: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      // 假设有一个获取当前用户的方法
      const currentUser = getCurrentUser();
      
      if (!currentUser.roles.includes(role)) {
        throw new Error(`Requires ${role} role`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class AdminPanel {
  @requireRole('admin')
  deleteUser(userId: string) {
    console.log('Deleting user:', userId);
  }
}
```
