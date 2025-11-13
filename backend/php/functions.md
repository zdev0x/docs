---
title: functions
---
# PHP 常用函数

## 数组操作

### 数组过滤
```php
// array_filter
$numbers = [1, 2, 3, 4, 5, 6];
$even = array_filter($numbers, function($n) {
    return $n % 2 === 0;
});
// [2, 4, 6]

// 删除空值
$data = ['', 'hello', null, 'world', 0, false];
$filtered = array_filter($data);
// ['hello', 'world']
```

### 数组映射
```php
$numbers = [1, 2, 3, 4, 5];
$squared = array_map(function($n) {
    return $n * $n;
}, $numbers);
// [1, 4, 9, 16, 25]

// 多个数组
$names = ['Alice', 'Bob', 'Charlie'];
$ages = [25, 30, 35];
$combined = array_map(function($name, $age) {
    return ['name' => $name, 'age' => $age];
}, $names, $ages);
```

### 数组归约
```php
$numbers = [1, 2, 3, 4, 5];
$sum = array_reduce($numbers, function($carry, $item) {
    return $carry + $item;
}, 0);
// 15
```

### 数组排序
```php
// 普通排序
$numbers = [3, 1, 4, 1, 5, 9];
sort($numbers);        // 升序
rsort($numbers);       // 降序

// 保持键值关联
$assoc = ['c' => 3, 'a' => 1, 'b' => 2];
asort($assoc);         // 按值排序
ksort($assoc);         // 按键排序

// 自定义排序
usort($numbers, function($a, $b) {
    return $a <=> $b;  // PHP 7+ 太空船操作符
});
```

### 数组去重
```php
$numbers = [1, 2, 2, 3, 3, 3];
$unique = array_unique($numbers);
// [1, 2, 3]
```

### 数组合并
```php
$arr1 = ['a' => 1, 'b' => 2];
$arr2 = ['b' => 3, 'c' => 4];

$merged = array_merge($arr1, $arr2);
// ['a' => 1, 'b' => 3, 'c' => 4]

// 使用 + 操作符（保留第一个数组的键）
$combined = $arr1 + $arr2;
// ['a' => 1, 'b' => 2, 'c' => 4]
```

## 字符串操作

### 字符串处理
```php
// 大小写
$str = "Hello World";
strtoupper($str);      // "HELLO WORLD"
strtolower($str);      // "hello world"
ucfirst($str);         // "Hello world"
ucwords($str);         // "Hello World"

// 去除空格
$str = "  hello  ";
trim($str);            // "hello"
ltrim($str);           // "hello  "
rtrim($str);           // "  hello"

// 替换
str_replace('world', 'PHP', 'Hello world');
str_ireplace('WORLD', 'PHP', 'Hello world'); // 不区分大小写

// 分割与连接
$parts = explode(',', 'a,b,c');
$str = implode('-', ['a', 'b', 'c']);
```

### 字符串查找
```php
$str = "Hello World";

// 位置
strpos($str, 'World');     // 6
strrpos($str, 'o');        // 7（最后一次出现）

// 判断
str_contains($str, 'World');   // PHP 8+
str_starts_with($str, 'Hello'); // PHP 8+
str_ends_with($str, 'World');   // PHP 8+

// 提取
substr($str, 0, 5);        // "Hello"
substr($str, -5);          // "World"
```

### 正则表达式
```php
// 匹配
preg_match('/\d+/', 'abc123', $matches);
// $matches[0] = '123'

// 全部匹配
preg_match_all('/\d+/', 'a1b2c3', $matches);
// $matches[0] = ['1', '2', '3']

// 替换
preg_replace('/\d+/', 'X', 'a1b2c3');
// 'aXbXcX'

// 分割
preg_split('/\s+/', 'hello  world   foo');
// ['hello', 'world', 'foo']
```

## 日期时间

### DateTime
```php
// 创建
$date = new DateTime();
$date = new DateTime('2024-01-01');
$date = DateTime::createFromFormat('Y-m-d', '2024-01-01');

// 格式化
$date->format('Y-m-d H:i:s');
$date->format('l, F j, Y');

// 修改
$date->modify('+1 day');
$date->modify('-1 week');
$date->add(new DateInterval('P1D'));  // 加1天
$date->sub(new DateInterval('P1M'));  // 减1月

// 比较
$date1 = new DateTime('2024-01-01');
$date2 = new DateTime('2024-12-31');
$diff = $date1->diff($date2);
echo $diff->days;  // 天数差
```

### Carbon (推荐使用)
```php
use Carbon\Carbon;

$now = Carbon::now();
$today = Carbon::today();
$tomorrow = Carbon::tomorrow();

// 链式操作
$date = Carbon::now()
    ->addDays(5)
    ->subHours(3)
    ->format('Y-m-d H:i:s');

// 人性化时间
Carbon::now()->subDays(5)->diffForHumans();
// "5 days ago"
```

## 文件操作

### 读写文件
```php
// 读取整个文件
$content = file_get_contents('file.txt');

// 逐行读取
$lines = file('file.txt');

// 写入文件
file_put_contents('file.txt', 'content');
file_put_contents('file.txt', 'append', FILE_APPEND);

// 检查文件
file_exists('file.txt');
is_file('file.txt');
is_dir('directory');
is_readable('file.txt');
is_writable('file.txt');
```

### 目录操作
```php
// 创建目录
mkdir('path/to/dir', 0755, true);

// 删除目录
rmdir('path/to/dir');

// 扫描目录
$files = scandir('directory');

// 遍历目录
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator('directory')
);

foreach ($iterator as $file) {
    if ($file->isFile()) {
        echo $file->getPathname() . "
";
    }
}
```

## JSON 处理

```php
// 编码
$data = ['name' => 'Alice', 'age' => 25];
$json = json_encode($data);
$json = json_encode($data, JSON_PRETTY_PRINT);

// 解码
$json = '{"name":"Alice","age":25}';
$data = json_decode($json, true);  // 返回数组
$data = json_decode($json);         // 返回对象

// 错误处理
$data = json_decode($json);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_last_error_msg();
}
```

## 密码哈希

```php
// 哈希密码
$hash = password_hash('password123', PASSWORD_DEFAULT);

// 验证密码
if (password_verify('password123', $hash)) {
    echo 'Password is valid';
}

// 检查是否需要重新哈希
if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
    $hash = password_hash('password123', PASSWORD_DEFAULT);
}
```

## HTTP 请求

### cURL
```php
$ch = curl_init('https://api.example.com/data');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer token'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);
```

### Guzzle (推荐)
```php
use GuzzleHttp\Client;

$client = new Client();

$response = $client->request('GET', 'https://api.example.com/users');
$body = $response->getBody();
$data = json_decode($body, true);

// POST 请求
$response = $client->request('POST', 'https://api.example.com/users', [
    'json' => [
        'name' => 'Alice',
        'email' => 'alice@example.com'
    ]
]);
```

## 其他实用函数

### 数组与对象转换
```php
// 数组转对象
$array = ['name' => 'Alice', 'age' => 25];
$object = (object) $array;

// 对象转数组
$array = (array) $object;
$array = json_decode(json_encode($object), true);
```

### 生成随机字符串
```php
function generateRandomString($length = 10) {
    return bin2hex(random_bytes($length / 2));
}

// 或使用
$random = Str::random(16); // Laravel
```

### 数组分页
```php
function paginate($items, $perPage, $page) {
    $offset = ($page - 1) * $perPage;
    return array_slice($items, $offset, $perPage);
}
```
