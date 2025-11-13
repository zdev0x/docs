---
title: database
---
# PHP 数据库操作

## PDO 基础

### 连接数据库
```php
try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=mydb',
        'username',
        'password',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}
```

### 查询数据
```php
// 简单查询
$stmt = $pdo->query('SELECT * FROM users');
$users = $stmt->fetchAll();

// 单行
$user = $stmt->fetch();

// 单个值
$count = $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
```

### 预处理语句
```php
// 使用问号占位符
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([1]);
$user = $stmt->fetch();

// 使用命名占位符
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => 'user@example.com']);
$user = $stmt->fetch();
```

### 插入数据
```php
$stmt = $pdo->prepare('INSERT INTO users (name, email) VALUES (?, ?)');
$stmt->execute(['Alice', 'alice@example.com']);

// 获取插入ID
$lastId = $pdo->lastInsertId();
```

### 更新数据
```php
$stmt = $pdo->prepare('UPDATE users SET name = :name WHERE id = :id');
$stmt->execute([
    'name' => 'Bob',
    'id' => 1
]);

$affectedRows = $stmt->rowCount();
```

### 删除数据
```php
$stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
$stmt->execute([1]);

$affectedRows = $stmt->rowCount();
```

### 事务处理
```php
try {
    $pdo->beginTransaction();
    
    $pdo->exec('INSERT INTO users (name) VALUES ("Alice")');
    $pdo->exec('INSERT INTO posts (user_id) VALUES (1)');
    
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    throw $e;
}
```

## Laravel Eloquent

### 基础 CRUD

#### 查询
```php
use App\Models\User;

// 获取所有
$users = User::all();

// 查询条件
$users = User::where('active', 1)->get();
$user = User::where('email', 'user@example.com')->first();

// 按主键查找
$user = User::find(1);
$users = User::find([1, 2, 3]);
$user = User::findOrFail(1); // 找不到抛异常

// 第一个或创建
$user = User::firstOrCreate(
    ['email' => 'user@example.com'],
    ['name' => 'Alice']
);

// 更新或创建
$user = User::updateOrCreate(
    ['email' => 'user@example.com'],
    ['name' => 'Alice', 'active' => 1]
);
```

#### 创建
```php
// 方式1: create
$user = User::create([
    'name' => 'Alice',
    'email' => 'alice@example.com',
    'password' => bcrypt('secret'),
]);

// 方式2: new + save
$user = new User;
$user->name = 'Alice';
$user->email = 'alice@example.com';
$user->save();

// 批量插入
User::insert([
    ['name' => 'Alice', 'email' => 'alice@example.com'],
    ['name' => 'Bob', 'email' => 'bob@example.com'],
]);
```

#### 更新
```php
// 查找并更新
$user = User::find(1);
$user->name = 'Bob';
$user->save();

// 直接更新
User::where('id', 1)->update(['name' => 'Bob']);

// 批量更新
User::where('active', 0)
    ->update(['status' => 'inactive']);

// 递增/递减
$user->increment('login_count');
$user->decrement('credits', 5);
User::where('id', 1)->increment('views');
```

#### 删除
```php
// 软删除（需要在模型中使用 SoftDeletes trait）
$user = User::find(1);
$user->delete();

// 强制删除
$user->forceDelete();

// 批量删除
User::where('active', 0)->delete();

// 恢复软删除
$user->restore();

// 查询包含软删除的数据
$users = User::withTrashed()->get();
$users = User::onlyTrashed()->get();
```

### 关联查询

#### 预加载（避免 N+1 问题）
```php
// 预加载单个关联
$users = User::with('posts')->get();

// 预加载多个关联
$users = User::with(['posts', 'profile'])->get();

// 嵌套预加载
$users = User::with('posts.comments')->get();

// 条件预加载
$users = User::with(['posts' => function ($query) {
    $query->where('published', 1);
}])->get();

// 延迟预加载
$users = User::all();
$users->load('posts');
```

#### 关联查询
```php
// Has 查询（存在关联）
$users = User::has('posts')->get();
$users = User::has('posts', '>=', 3)->get();

// whereHas（带条件的关联查询）
$users = User::whereHas('posts', function ($query) {
    $query->where('published', 1);
})->get();

// doesntHave（不存在关联）
$users = User::doesntHave('posts')->get();

// 统计关联
$users = User::withCount('posts')->get();
foreach ($users as $user) {
    echo $user->posts_count;
}
```

### 查询技巧

#### 条件构建
```php
// when 条件
$users = User::when($request->has('role'), function ($query) use ($request) {
    return $query->where('role', $request->role);
})->get();

// unless
$users = User::unless($request->has('include_inactive'), function ($query) {
    return $query->where('active', 1);
})->get();
```

#### 子查询
```php
use Illuminate\Support\Facades\DB;

$users = User::select([
    'users.*',
    DB::raw('(SELECT COUNT(*) FROM posts WHERE posts.user_id = users.id) as posts_count')
])->get();

// 或使用
$users = User::addSelect([
    'posts_count' => Post::selectRaw('count(*)')
        ->whereColumn('user_id', 'users.id')
])->get();
```

#### 原始查询
```php
// 原始 where
User::whereRaw('age > ?', [18])->get();

// 原始 select
User::selectRaw('count(*) as user_count, status')
    ->groupBy('status')
    ->get();

// 原始 order
User::orderByRaw('updated_at - created_at DESC')->get();
```

### 分页

```php
// 简单分页
$users = User::paginate(15);

// 简化分页（只有上一页/下一页）
$users = User::simplePaginate(15);

// 自定义分页
$users = User::paginate(15, ['*'], 'page', 2);

// 在视图中显示
{{ $users->links() }}

// 带查询参数
$users = User::where('active', 1)->paginate(15);
{{ $users->appends(['sort' => 'votes'])->links() }}
```

### 查询优化

```php
// 只选择需要的列
$users = User::select('id', 'name', 'email')->get();

// 分块处理大量数据
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // 处理用户
    }
});

// 游标处理（内存友好）
foreach (User::cursor() as $user) {
    // 处理用户
}

// 懒加载集合
User::lazy()->each(function ($user) {
    // 处理用户
});
```
