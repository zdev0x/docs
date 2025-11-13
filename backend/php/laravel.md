---
title: laravel
---
# Laravel

Laravel 框架最佳实践与常用模式。

## 路由

### 基础路由
```php
// routes/web.php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
```

### 资源路由
```php
Route::resource('users', UserController::class);

// 只包含部分方法
Route::resource('posts', PostController::class)->only([
    'index', 'show'
]);

// 排除部分方法
Route::resource('posts', PostController::class)->except([
    'create', 'edit'
]);
```

### API 路由
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
});
```

### 路由组
```php
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'users']);
});

// 命名空间
Route::namespace('Admin')->group(function () {
    Route::get('/admin', [DashboardController::class, 'index']);
});
```

## 控制器

### 基础控制器
```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('users.index', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validated);

        return redirect()->route('users.show', $user);
    }

    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }
}
```

### API 控制器
```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validated);

        return new UserResource($user);
    }
}
```

## 模型 (Eloquent)

### 基础模型
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    
    protected $hidden = ['password', 'remember_token'];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean',
    ];
}
```

### 关联关系
```php
class User extends Model
{
    // 一对一
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    // 一对多
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // 多对多
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    // 多态关联
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```

### 查询作用域
```php
class User extends Model
{
    public function scopeActive($query)
    {
        return $query->where('active', 1);
    }

    public function scopePopular($query)
    {
        return $query->where('votes', '>', 100);
    }
}

// 使用
$users = User::active()->popular()->get();
```

### 访问器和修改器
```php
class User extends Model
{
    // 访问器 (获取时)
    public function getNameAttribute($value)
    {
        return ucfirst($value);
    }

    // 修改器 (设置时)
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
}
```

## 数据库查询

### 查询构建器
```php
use Illuminate\Support\Facades\DB;

// 基础查询
$users = DB::table('users')->get();
$user = DB::table('users')->where('id', 1)->first();

// 条件查询
$users = DB::table('users')
    ->where('active', 1)
    ->where('age', '>', 18)
    ->get();

// 排序和分页
$users = DB::table('users')
    ->orderBy('created_at', 'desc')
    ->skip(10)
    ->take(5)
    ->get();

// 聚合
$count = DB::table('users')->count();
$max = DB::table('users')->max('age');
$avg = DB::table('users')->avg('age');
```

### Eloquent 查询
```php
// 获取所有
$users = User::all();

// 条件查询
$users = User::where('active', 1)->get();
$user = User::find(1);
$user = User::findOrFail(1);

// 分页
$users = User::paginate(15);
$users = User::simplePaginate(15);

// 关联查询
$users = User::with('posts')->get();
$users = User::with(['posts', 'profile'])->get();

// 条件加载
$users = User::when($request->has('status'), function ($query) use ($request) {
    return $query->where('status', $request->status);
})->get();
```

## 验证

### 表单验证
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|unique:posts|max:255',
        'body' => 'required',
        'author' => 'required|email',
        'published_at' => 'nullable|date',
    ]);

    // 数据已验证
}
```

### 自定义验证规则
```php
$request->validate([
    'email' => [
        'required',
        'email',
        Rule::unique('users')->ignore($user->id),
    ],
]);
```

### Form Request
```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|max:255',
            'body' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => '标题不能为空',
            'body.required' => '内容不能为空',
        ];
    }
}

// 使用
public function store(StorePostRequest $request)
{
    // 数据已自动验证
    $validated = $request->validated();
}
```

## 中间件

### 创建中间件
```php
namespace App\Http\Middleware;

use Closure;

class CheckAge
{
    public function handle($request, Closure $next)
    {
        if ($request->age <= 18) {
            return redirect('home');
        }

        return $next($request);
    }
}
```

### 注册中间件
```php
// app/Http/Kernel.php
protected $routeMiddleware = [
    'check.age' => \App\Http\Middleware\CheckAge::class,
];

// 使用
Route::get('/profile', function () {
    //
})->middleware('check.age');
```

## 任务调度

### 定义计划任务
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->command('emails:send')->daily();
    
    $schedule->command('backup:run')
             ->dailyAt('02:00');
    
    $schedule->job(new ProcessPodcast)
             ->everyFiveMinutes();
    
    $schedule->call(function () {
        DB::table('recent_users')->delete();
    })->daily();
}
```

## 队列

### 创建任务
```php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $podcast;

    public function __construct($podcast)
    {
        $this->podcast = $podcast;
    }

    public function handle()
    {
        // 处理播客
    }
}
```

### 分发任务
```php
ProcessPodcast::dispatch($podcast);

// 延迟执行
ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));

// 指定队列
ProcessPodcast::dispatch($podcast)->onQueue('processing');
```

## 缓存

```php
use Illuminate\Support\Facades\Cache;

// 存储
Cache::put('key', 'value', $seconds);
Cache::put('key', 'value', now()->addMinutes(10));

// 永久存储
Cache::forever('key', 'value');

// 获取
$value = Cache::get('key');
$value = Cache::get('key', 'default');

// 检查存在
if (Cache::has('key')) {
    //
}

// 获取或存储
$value = Cache::remember('users', $seconds, function () {
    return DB::table('users')->get();
});

// 删除
Cache::forget('key');
Cache::flush(); // 清空所有
```
