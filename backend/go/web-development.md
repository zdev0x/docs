---
title: web-development
---
# Go Web 开发

## HTTP 服务器

### 基础服务器
```go
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

### 处理不同的 HTTP 方法
```go
func userHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        // 获取用户
        fmt.Fprintf(w, "GET request")
    case http.MethodPost:
        // 创建用户
        fmt.Fprintf(w, "POST request")
    case http.MethodPut:
        // 更新用户
        fmt.Fprintf(w, "PUT request")
    case http.MethodDelete:
        // 删除用户
        fmt.Fprintf(w, "DELETE request")
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}
```

### JSON 响应
```go
import "encoding/json"

type Response struct {
    Status  string `json:"status"`
    Message string `json:"message"`
    Data    any    `json:"data,omitempty"`
}

func jsonHandler(w http.ResponseWriter, r *http.Request) {
    resp := Response{
        Status:  "success",
        Message: "Operation completed",
        Data:    map[string]string{"key": "value"},
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(resp)
}
```

### 解析请求体
```go
type User struct {
    Name  string `json:"name"`
    Email string `json:"email"`
}

func createUser(w http.ResponseWriter, r *http.Request) {
    var user User
    
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    fmt.Printf("Received user: %+v
", user)
    w.WriteHeader(http.StatusCreated)
}
```

## 路由

### 使用 gorilla/mux
```go
import "github.com/gorilla/mux"

func main() {
    r := mux.NewRouter()
    
    // 基础路由
    r.HandleFunc("/", homeHandler)
    r.HandleFunc("/users", usersHandler).Methods("GET")
    r.HandleFunc("/users", createUserHandler).Methods("POST")
    
    // 路径参数
    r.HandleFunc("/users/{id}", getUserHandler).Methods("GET")
    r.HandleFunc("/users/{id}", updateUserHandler).Methods("PUT")
    r.HandleFunc("/users/{id}", deleteUserHandler).Methods("DELETE")
    
    // 查询参数
    r.HandleFunc("/search", searchHandler).Queries("q", "{query}")
    
    http.ListenAndServe(":8080", r)
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]
    fmt.Fprintf(w, "User ID: %s", id)
}
```

### 使用 chi
```go
import "github.com/go-chi/chi/v5"

func main() {
    r := chi.NewRouter()
    
    // 中间件
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    
    // 路由
    r.Get("/", homeHandler)
    r.Post("/users", createUserHandler)
    
    // 路由组
    r.Route("/api", func(r chi.Router) {
        r.Use(authMiddleware)
        r.Get("/users", listUsers)
        r.Post("/users", createUser)
    })
    
    http.ListenAndServe(":8080", r)
}
```

## 中间件

### 日志中间件
```go
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        next.ServeHTTP(w, r)
        
        log.Printf(
            "%s %s %s",
            r.Method,
            r.RequestURI,
            time.Since(start),
        )
    })
}

// 使用
http.Handle("/", loggingMiddleware(http.HandlerFunc(handler)))
```

### 认证中间件
```go
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        
        if token == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        
        // 验证 token
        if !validateToken(token) {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}
```

### CORS 中间件
```go
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}
```

## HTTP 客户端

### 基础请求
```go
import "net/http"

// GET 请求
resp, err := http.Get("https://api.example.com/users")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

body, err := io.ReadAll(resp.Body)
if err != nil {
    log.Fatal(err)
}
fmt.Println(string(body))
```

### POST 请求
```go
import "bytes"

data := map[string]string{
    "name":  "Alice",
    "email": "alice@example.com",
}

jsonData, _ := json.Marshal(data)

resp, err := http.Post(
    "https://api.example.com/users",
    "application/json",
    bytes.NewBuffer(jsonData),
)
```

### 自定义请求
```go
client := &http.Client{
    Timeout: 10 * time.Second,
}

req, err := http.NewRequest("PUT", "https://api.example.com/users/1", nil)
if err != nil {
    log.Fatal(err)
}

req.Header.Set("Authorization", "Bearer token")
req.Header.Set("Content-Type", "application/json")

resp, err := client.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
```

## 文件上传

```go
func uploadHandler(w http.ResponseWriter, r *http.Request) {
    // 限制上传大小 10MB
    r.ParseMultipartForm(10 << 20)
    
    file, handler, err := r.FormFile("file")
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    defer file.Close()
    
    fmt.Printf("Uploaded File: %+v
", handler.Filename)
    fmt.Printf("File Size: %+v
", handler.Size)
    fmt.Printf("MIME Header: %+v
", handler.Header)
    
    // 保存文件
    f, err := os.OpenFile("./uploads/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer f.Close()
    
    io.Copy(f, file)
    
    fmt.Fprintf(w, "File uploaded successfully")
}
```

## WebSocket

```go
import "github.com/gorilla/websocket"

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }
    defer conn.Close()
    
    for {
        messageType, message, err := conn.ReadMessage()
        if err != nil {
            log.Println(err)
            break
        }
        
        log.Printf("Received: %s", message)
        
        // 回显消息
        err = conn.WriteMessage(messageType, message)
        if err != nil {
            log.Println(err)
            break
        }
    }
}
```
