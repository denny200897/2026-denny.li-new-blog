---
title: "nmap"
description: "securi"
pubDate: 2026-05-28
tags: ["hello"]
---

# nmap
# Nmap 
# Nmap 完整使用筆記

## 目錄
1. [Nmap 基礎](#nmap-基礎)
2. [常用指令](#常用指令)
3. [掃描類型](#掃描類型)
4. [常見埠號](#常見埠號)
5. [輸出格式](#輸出格式)
6. [安全評估](#安全評估)
7. [進階技巧](#進階技巧)
8. [故障排除](#故障排除)

---

## Nmap 基礎

### 什麼是 Nmap？
Nmap（Network Mapper）是一個開源的網路掃描和主機探測工具，用於：
- 發現網路中的設備
- 掃描開啟的埠
- 識別服務和版本
- 進行安全評估

### 安裝

**Linux (Ubuntu/Debian)：**
```bash
sudo apt-get update
sudo apt-get install -y nmap
```

**macOS：**
```bash
brew install nmap
```

**Windows：**
下載安裝程式：https://nmap.org/download.html

### 驗證安裝
```bash
nmap --version
```

---

## 常用指令

### 1. 基礎掃描（推薦開始用）
```bash
nmap -sC -sV 192.168.1.0/24
```

| 參數 | 說明 |
|------|------|
| `-sC` | 執行預設 NSE 指令碼掃描 |
| `-sV` | 偵測服務版本 |
| `192.168.1.0/24` | 目標 IP 範圍 |

**輸出包含：**
- 開啟的埠
- 服務名稱
- 服務版本
- NSE 指令碼發現的漏洞

---

### 2. 快速掃描（最小資訊）
```bash
nmap 192.168.1.0/24
```
- 最快速度
- 只顯示開啟的埠
- 沒有版本資訊

---

### 3. 詳細掃描（所有埠）
```bash
nmap -sC -sV -p- 192.168.1.0/24
```

| 參數 | 說明 |
|------|------|
| `-p-` | 掃描所有埠 (0-65535) |
| 其他 | 同上 |

**注意：** 時間較長（可能需要 10-30 分鐘）

---

### 4. 掃描單一主機
```bash
nmap -sC -sV 192.168.1.100
```
只掃描一台特定設備

---

### 5. 掃描特定埠
```bash
nmap -sC -sV -p 22,80,443,3306 192.168.1.0/24
```
只掃描指定的埠號

---

### 6. 掃描埠範圍
```bash
nmap -sC -sV -p 1-1000 192.168.1.0/24
```
掃描第 1 到 1000 埠

---

### 7. 激進掃描（最詳細）
```bash
nmap -A -T4 192.168.1.0/24
```

| 參數 | 說明 |
|------|------|
| `-A` | 啟用 OS 檢測、版本檢測、指令碼掃描、追蹤路由 |
| `-T4` | 掃描速度（T0-T5，越高越快） |

---

### 8. 保存掃描結果
```bash
# 普通文字格式
nmap -sC -sV 192.168.1.0/24 -oN results.txt

# XML 格式
nmap -sC -sV 192.168.1.0/24 -oX results.xml

# 所有格式
nmap -sC -sV 192.168.1.0/24 -oA results
```

| 參數 | 輸出格式 |
|------|---------|
| `-oN` | Normal（普通文字） |
| `-oX` | XML（可用於其他工具） |
| `-oG` | Grepable（便於搜尋） |
| `-oA` | 同時輸出所有格式 |

---

### 9. 詳細/詳細詳細輸出
```bash
# 詳細輸出
nmap -sC -sV -v 192.168.1.0/24

# 詳細詳細輸出
nmap -sC -sV -vv 192.168.1.0/24
```

---

### 10. 操作系統檢測
```bash
nmap -O 192.168.1.0/24
```
嘗試識別目標設備的作業系統

---

## 掃描類型

### TCP 掃描
```bash
nmap -sT 192.168.1.0/24
```
完整的 TCP 連線掃描（較慢但準確）

### SYN 掃描（預設，需要 root）
```bash
sudo nmap -sS 192.168.1.0/24
```
半開放掃描（快速且隱蔽）

### UDP 掃描
```bash
sudo nmap -sU 192.168.1.0/24
```
掃描 UDP 埠

### Ping 掃描（不掃描埠）
```bash
nmap -sn 192.168.1.0/24
```
只發現主機，不掃描埠

---

## 常見埠號

| 埠號 | 服務 | 說明 |
|------|------|------|
| 21 | FTP | 檔案傳輸協議 |
| 22 | SSH | 安全殼層 |
| 23 | Telnet | 遠端登入（不安全） |
| 25 | SMTP | 郵件發送 |
| 53 | DNS | 網域名稱系統 |
| 80 | HTTP | 網頁伺服器 |
| 110 | POP3 | 郵件接收 |
| 143 | IMAP | 郵件協議 |
| 443 | HTTPS | 安全網頁 |
| 445 | SMB | Windows 檔案共享 |
| 3306 | MySQL | 資料庫 |
| 3389 | RDP | 遠端桌面（Windows） |
| 5432 | PostgreSQL | 資料庫 |
| 5900 | VNC | 遠端桌面 |
| 6379 | Redis | 快取資料庫 |
| 8080 | HTTP Proxy | 代理伺服器 |
| 8443 | HTTPS Alt | 替代 HTTPS |
| 27017 | MongoDB | NoSQL 資料庫 |

---

## 輸出格式

### 掃描報告包含的資訊

```
Starting Nmap 7.94 ( https://nmap.org ) at 2026-05-27 14:12 UTC
Nmap scan report for 192.168.1.0/24

PORT      STATE    SERVICE     VERSION
22/tcp    open     ssh         OpenSSH 7.4
80/tcp    open     http        Apache httpd 2.4.6
443/tcp   open     https       Apache httpd 2.4.6
3306/tcp  open     mysql       MySQL 5.7.20
5900/tcp  closed   vnc
```

### 解釋
- **PORT** - 埠號和協議
- **STATE** - 埠狀態（open/closed/filtered）
- **SERVICE** - 服務名稱
- **VERSION** - 軟體版本

### 埠狀態說明
| 狀態 | 說明 |
|------|------|
| open | 埠開啟，應用程式正在監聽 |
| closed | 埠關閉，沒有應用程式監聽 |
| filtered | 被防火牆/網路過濾器阻擋 |
| unfiltered | 埠可以訪問，但無法判斷是否開啟 |
| open\|filtered | 無法確定是開啟還是被過濾 |
| closed\|filtered | 無法確定是關閉還是被過濾 |

---

## 安全評估

### 完整的安全評估掃描
```bash
nmap -A -T4 -p- 192.168.1.0/24 -v -oN security_scan.txt
```

### 快速安全檢查（推薦）
```bash
nmap -sC -sV 192.168.1.0/24 -oN security_check.txt
```

### 查看漏洞
```bash
# 掃描已知漏洞
nmap --script vuln 192.168.1.0/24
```

### 檢查弱密碼
```bash
nmap --script auth 192.168.1.0/24
```

---

## 進階技巧

### 1. 排除特定主機
```bash
nmap -sC -sV 192.168.1.0/24 --exclude 192.168.1.1,192.168.1.2
```

### 2. 只掃描在線主機
```bash
nmap -sC -sV -oG - 192.168.1.0/24 | grep "Host:"
```

### 3. 掃描並找出特定服務
```bash
# 找出所有 SSH
nmap -p 22 192.168.1.0/24 | grep "open"

# 找出所有 HTTP
nmap -p 80 192.168.1.0/24 | grep "open"
```

### 4. 檢測 WAF（Web Application Firewall）
```bash
nmap --script http-waf-detection 192.168.1.0/24
```

### 5. 暴力破解 SSH
```bash
nmap --script ssh-brute --script-args ssh.auth=password 192.168.1.0/24
```
**警告：** 只在獲得授權的系統上使用！

### 6. 掃描 SSL/TLS 漏洞
```bash
nmap --script ssl-enum-ciphers -p 443 192.168.1.0/24
```

### 7. 建立主機清單
```bash
nmap -sn -oG - 192.168.1.0/24 | grep "Host:" > hosts.txt
```

---

## 故障排除

### 問題 1：權限不足
```
Starting Nmap 7.94 ( https://nmap.org ) at 2026-05-27
nmap: must be run by root or with --unprivileged
```

**解決方案：**
```bash
# 方案 1：使用 sudo
sudo nmap -sC -sV 192.168.1.0/24

# 方案 2：以非特權模式運行
nmap --unprivileged 192.168.1.0/24
```

### 問題 2：掃描時間太長
**解決方案：**
```bash
# 增加速度（T4 或 T5）
nmap -T5 -p 22,80,443 192.168.1.0/24

# 限制埠掃描
nmap -p 1-1000 192.168.1.0/24

# 禁用 DNS 解析
nmap -n -p 22,80,443 192.168.1.0/24
```

### 問題 3：找不到任何主機
**解決方案：**
```bash
# 確認網路範圍
ip addr show

# 嘗試 ping 確認
ping 192.168.1.1

# 使用 -sn 先探測在線主機
nmap -sn 192.168.1.0/24
```

### 問題 4：結果顯示 "all ports filtered"
可能原因：
- 防火牆阻擋
- 網路連線問題
- 目標設備不在線

**解決方案：**
```bash
# 增加掃描時間
nmap --host-timeout 5m 192.168.1.0/24

# 使用 UDP 掃描
sudo nmap -sU 192.168.1.0/24
```

---

## 實用範例

### 場景 1：檢查局域網內的設備
```bash
# 第 1 步：找出所有在線設備
nmap -sn 192.168.1.0/24

# 第 2 步：掃描開啟的埠
nmap -sC -sV 192.168.1.0/24 -oN network_scan.txt

# 第 3 步：查看結果
cat network_scan.txt
```

### 場景 2：安全檢查單一伺服器
```bash
nmap -A -T4 -p- 192.168.1.100 -oN server_scan.txt
```

### 場景 3：查找特定服務（如 MySQL）
```bash
nmap -p 3306 192.168.1.0/24 | grep "open"
```

### 場景 4：生成可視化報告
```bash
# 掃描並儲存為 XML
nmap -sC -sV 192.168.1.0/24 -oX results.xml

# 使用在線工具轉換為 HTML
# 網址：https://nmap.org/tools/
```

---

## 法律和道德提醒

⚠️ **重要：**
- **只掃描您擁有或有明確授權的系統和網路**
- 未經許可掃描他人網路可能違法
- 某些掃描技術可能被防火牆偵測和記錄
- 在生產環境中謹慎使用激進掃描

---

## 常用命令快速參考

```bash
# 基礎掃描
nmap -sC -sV 192.168.1.0/24

# 快速掃描
nmap 192.168.1.0/24

# 詳細掃描
nmap -A -T4 192.168.1.0/24

# 只掃描開啟的埠
nmap -p 22,80,443 192.168.1.0/24

# 保存結果
nmap -sC -sV 192.168.1.0/24 -oN results.txt

# 檢測漏洞
nmap --script vuln 192.168.1.0/24

# 發現在線設備
nmap -sn 192.168.1.0/24

# 檢查特定埠
nmap -p 3306 192.168.1.0/24
```

---

## 資源

- 官方網站：https://nmap.org
- NSE 指令碼庫：https://nmap.org/nsedoc/
- 線上學習：https://nmap.org/book/
- 社群論壇：https://seclists.org/

---

**最後更新：2026 年 5 月 27 日**
**版本：1.0**
