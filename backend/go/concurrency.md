---
title: concurrency
---
# Go 并发编程

## Goroutine

### 基础使用
```go
// 启动 goroutine
go func() {
    fmt.Println("Hello from goroutine")
}()

// 带参数
go func(msg string) {
    fmt.Println(msg)
}("Hello")

// 等待 goroutine 完成
import "sync"

var wg sync.WaitGroup

wg.Add(1)
go func() {
    defer wg.Done()
    fmt.Println("Working...")
}()
wg.Wait()
```

### WaitGroup 批量等待
```go
func main() {
    var wg sync.WaitGroup
    
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            fmt.Printf("Worker %d starting
", id)
            time.Sleep(time.Second)
            fmt.Printf("Worker %d done
", id)
        }(i)
    }
    
    wg.Wait()
    fmt.Println("All workers completed")
}
```

## Channel

### 无缓冲 Channel
```go
ch := make(chan int)

// 发送
go func() {
    ch <- 42
}()

// 接收
value := <-ch
fmt.Println(value)
```

### 有缓冲 Channel
```go
ch := make(chan int, 3)

ch <- 1
ch <- 2
ch <- 3

fmt.Println(<-ch)
fmt.Println(<-ch)
fmt.Println(<-ch)
```

### 关闭 Channel
```go
ch := make(chan int, 3)

ch <- 1
ch <- 2
ch <- 3
close(ch)

// 遍历已关闭的 channel
for value := range ch {
    fmt.Println(value)
}

// 检查 channel 是否关闭
value, ok := <-ch
if !ok {
    fmt.Println("Channel closed")
}
```

### Select 多路复用
```go
ch1 := make(chan string)
ch2 := make(chan string)

go func() {
    time.Sleep(1 * time.Second)
    ch1 <- "one"
}()

go func() {
    time.Sleep(2 * time.Second)
    ch2 <- "two"
}()

for i := 0; i < 2; i++ {
    select {
    case msg1 := <-ch1:
        fmt.Println("Received", msg1)
    case msg2 := <-ch2:
        fmt.Println("Received", msg2)
    case <-time.After(3 * time.Second):
        fmt.Println("Timeout")
    }
}
```

## 并发模式

### Worker Pool
```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d started job %d
", id, job)
        time.Sleep(time.Second)
        fmt.Printf("Worker %d finished job %d
", id, job)
        results <- job * 2
    }
}

func main() {
    const numJobs = 5
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    
    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // 发送任务
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)
    
    // 收集结果
    for a := 1; a <= numJobs; a++ {
        <-results
    }
}
```

### Pipeline
```go
func generator(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    // 构建 pipeline
    c := generator(2, 3, 4)
    out := square(c)
    
    // 消费输出
    for result := range out {
        fmt.Println(result)
    }
}
```

### Fan-out Fan-in
```go
func fanOut(in <-chan int, n int) []<-chan int {
    channels := make([]<-chan int, n)
    for i := 0; i < n; i++ {
        channels[i] = worker(in)
    }
    return channels
}

func fanIn(channels ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                out <- v
            }
        }(ch)
    }
    
    go func() {
        wg.Wait()
        close(out)
    }()
    
    return out
}
```

## 并发安全

### Mutex
```go
import "sync"

type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.v[key]++
}

func (c *SafeCounter) Value(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.v[key]
}
```

### RWMutex
```go
type Cache struct {
    mu    sync.RWMutex
    items map[string]string
}

func (c *Cache) Get(key string) (string, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    value, exists := c.items[key]
    return value, exists
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = value
}
```

### sync.Once
```go
var (
    instance *Database
    once     sync.Once
)

func GetDatabase() *Database {
    once.Do(func() {
        instance = &Database{}
        instance.connect()
    })
    return instance
}
```

### atomic 原子操作
```go
import "sync/atomic"

var counter int64

func increment() {
    atomic.AddInt64(&counter, 1)
}

func getCounter() int64 {
    return atomic.LoadInt64(&counter)
}
```

## Context

### 基础使用
```go
import "context"

func main() {
    ctx := context.Background()
    ctx, cancel := context.WithCancel(ctx)
    defer cancel()
    
    go doWork(ctx)
    
    time.Sleep(2 * time.Second)
    cancel() // 取消操作
}

func doWork(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            fmt.Println("Work cancelled")
            return
        default:
            fmt.Println("Working...")
            time.Sleep(500 * time.Millisecond)
        }
    }
}
```

### WithTimeout
```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

select {
case <-time.After(3 * time.Second):
    fmt.Println("Operation completed")
case <-ctx.Done():
    fmt.Println("Timeout:", ctx.Err())
}
```

### WithValue
```go
type key string

func main() {
    ctx := context.WithValue(context.Background(), key("userID"), 123)
    
    processRequest(ctx)
}

func processRequest(ctx context.Context) {
    if userID, ok := ctx.Value(key("userID")).(int); ok {
        fmt.Println("User ID:", userID)
    }
}
```
