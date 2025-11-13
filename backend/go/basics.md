---
title: basics
---
# Go 基础语法

## 切片操作

### 创建切片
```go
// 使用 make
s1 := make([]int, 5)       // 长度和容量都是 5
s2 := make([]int, 5, 10)   // 长度 5，容量 10

// 字面量
s3 := []int{1, 2, 3, 4, 5}

// 从数组创建
arr := [5]int{1, 2, 3, 4, 5}
s4 := arr[1:4]  // [2, 3, 4]
```

### 切片追加
```go
s := []int{1, 2, 3}
s = append(s, 4)
s = append(s, 5, 6, 7)

// 合并切片
s1 := []int{1, 2}
s2 := []int{3, 4}
s1 = append(s1, s2...)  // [1, 2, 3, 4]
```

### 切片复制
```go
src := []int{1, 2, 3, 4, 5}
dst := make([]int, len(src))
copy(dst, src)
```

### 切片去重
```go
func unique(slice []int) []int {
    keys := make(map[int]bool)
    result := []int{}
    
    for _, item := range slice {
        if _, exists := keys[item]; !exists {
            keys[item] = true
            result = append(result, item)
        }
    }
    return result
}
```

## Map 操作

### 创建和使用
```go
// 创建
m := make(map[string]int)
m2 := map[string]int{
    "apple": 1,
    "banana": 2,
}

// 设置
m["key"] = 100

// 获取
value := m["key"]

// 检查键是否存在
value, exists := m["key"]
if exists {
    fmt.Println(value)
}

// 删除
delete(m, "key")

// 遍历
for key, value := range m {
    fmt.Printf("%s: %d
", key, value)
}
```

### 检查 map 是否为空
```go
func isEmpty(m map[string]int) bool {
    return len(m) == 0
}
```

## 结构体

### 定义和初始化
```go
type User struct {
    ID    int
    Name  string
    Email string
}

// 初始化方式
u1 := User{ID: 1, Name: "Alice", Email: "alice@example.com"}
u2 := User{1, "Bob", "bob@example.com"}
u3 := &User{ID: 2, Name: "Charlie"}
```

### 方法
```go
func (u *User) SetName(name string) {
    u.Name = name
}

func (u User) GetName() string {
    return u.Name
}

// 使用
user := User{ID: 1}
user.SetName("Alice")
fmt.Println(user.GetName())
```

### 嵌入（组合）
```go
type Person struct {
    Name string
    Age  int
}

type Employee struct {
    Person
    EmployeeID int
}

emp := Employee{
    Person: Person{Name: "Alice", Age: 30},
    EmployeeID: 12345,
}

fmt.Println(emp.Name)  // 直接访问嵌入字段
```

## 接口

### 定义和实现
```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer
}

// 实现接口
type File struct {
    // ...
}

func (f *File) Read(p []byte) (n int, err error) {
    // ...
}

func (f *File) Write(p []byte) (n int, err error) {
    // ...
}
```

### 空接口
```go
func printAnything(v interface{}) {
    fmt.Println(v)
}

// 类型断言
func process(v interface{}) {
    switch v := v.(type) {
    case int:
        fmt.Println("Integer:", v)
    case string:
        fmt.Println("String:", v)
    default:
        fmt.Println("Unknown type")
    }
}
```

## 错误处理

### 基础错误处理
```go
import "errors"

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// 使用
result, err := divide(10, 0)
if err != nil {
    fmt.Println("Error:", err)
    return
}
fmt.Println(result)
```

### 自定义错误
```go
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error on %s: %s", e.Field, e.Message)
}

func validateUser(user User) error {
    if user.Name == "" {
        return &ValidationError{
            Field:   "Name",
            Message: "name cannot be empty",
        }
    }
    return nil
}
```

### 错误包装
```go
import "fmt"

func loadConfig() error {
    err := readFile()
    if err != nil {
        return fmt.Errorf("failed to load config: %w", err)
    }
    return nil
}
```

## 字符串操作

```go
import "strings"

// 拼接
s := strings.Join([]string{"hello", "world"}, " ")

// 分割
parts := strings.Split("a,b,c", ",")

// 替换
s = strings.Replace("hello world", "world", "Go", 1)
s = strings.ReplaceAll("hello world world", "world", "Go")

// 大小写
upper := strings.ToUpper("hello")
lower := strings.ToLower("WORLD")

// 判断
hasPrefix := strings.HasPrefix("hello", "hel")
hasSuffix := strings.HasSuffix("hello", "lo")
contains := strings.Contains("hello world", "world")

// 去除空格
trimmed := strings.TrimSpace("  hello  ")
```

## JSON 处理

```go
import "encoding/json"

type Person struct {
    Name  string `json:"name"`
    Age   int    `json:"age"`
    Email string `json:"email,omitempty"`
}

// 序列化
person := Person{Name: "Alice", Age: 30}
jsonData, err := json.Marshal(person)
if err != nil {
    log.Fatal(err)
}
fmt.Println(string(jsonData))

// 格式化输出
jsonData, _ = json.MarshalIndent(person, "", "  ")

// 反序列化
var p Person
err = json.Unmarshal(jsonData, &p)
if err != nil {
    log.Fatal(err)
}
fmt.Printf("%+v
", p)
```
