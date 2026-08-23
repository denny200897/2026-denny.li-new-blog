---
title: "AIS3 Junior Reverse "
description: "securi"
date: 2026-08-21
tags: ["AIS3", "security"]
---

# AIS3 Junior Reverse
## 1.Reverse-1 
#### 1.觀察題目
這是一題逆向題看到題目有寫密碼以明碼寫在 binary 裡。請用 Ghidra 找出它，所以接下來我打開Ghidra
#### 2.測試
接下來因為題目說猜對會印 Correct!否則印 Wrong!，因為題目說 flag 是以明碼寫在 binary 裡，Ghidra 在匯入檔案時會自動掃描並辨識出可讀字串，全部列在 Defined Strings 視窗。題目有提示「從會印出來的訊息追會比較快」，所以直接搜尋 Correct! Defined Strings，因為要去找位置在哪
![截圖 2026-08-06 下午4.22.58](https://hackmd.io/_uploads/rJ0DE6b8ze.png)
然後我要找出Correct!得位置所以我在裡面輸入Correct!
![截圖 2026-08-06 下午4.28.30](https://hackmd.io/_uploads/SJ63r6WLze.png)
接下來會看到有一筆位置，然後我們點擊它
![截圖 2026-08-06 下午4.28.55](https://hackmd.io/_uploads/SyB0BaWLMe.png)
就會看到畫面上就有flag
Flag:AIS3{H3llo_Gh1dra}
## 2.Reverse-2 
#### 1.觀察題目
首先可以看到這題跟上一題一樣這支程式會跟你要密碼。猜對會印 Correct!，否則印 Wrong!，但題目有提到這次密碼不會明文直接躺在字串裡，然後題目還有提到把邏輯檢查清出，再推出正確輸入
收先我跟上一題一樣打開ghidra然後進行搜尋Correct!，因為只要能找到Correct!的地方，就能直接定位到「判斷密碼是否正確」的核心驗證邏輯
![截圖 2026-08-06 下午4.56.33](https://hackmd.io/_uploads/SkaB3TbIze.png)
:::info
### 為什麼變數一開始會叫 local_10、param_1
然後為什麼變數一開始會叫 local_10、param_1，因為寫好 C 語言並編譯成 Binary 時，編譯器會為了優化與節省空間，把原本具備意義的變數名稱全部抹除。CPU 執行時只認得記憶體位址與暫存器。Ghidra 在反編譯時，只能根據變數在堆疊中的相對位置，隨便給它一個 local_XX 的代號。
所以我把名字改成user_input，讓我能看出隱藏在代碼下的演算法模式。
:::
### 為什麼變數一開始會叫 local_10、param_1

因為寫好 C 語言並編譯成 Binary 時，編譯器會為了優化與節省空間，把原本具備意義的變數名稱全部抹除。CPU 執行時只認得記憶體位址與暫存器。Ghidra 在反編譯時，只能根據變數在堆疊中的相對位置，隨便給它一個 local_XX 的代號。
所以我把名字改成user_input，讓我能看出隱藏在代碼下的演算法模式。
接下來我們要仔細看迴圈的地方，因為在底層程式語言中，電腦無法像人腦一樣一眼看完一整句話。所以如果程式想要對你的輸入進行加密，就必須透過迴圈，來處理。

接下來，我看了一下這個迴圈裡面的邏輯。整理好變數名稱後，可以很清楚看到它在做的事情，其實就是把字串的頭跟尾巴互相交換。也就是說，這支程式會把我們輸入的密碼整個「反轉」
然後我看到迴圈下面有一行關鍵的比對邏輯：`strcmp(buffer, expected.0)`。這行明確告訴我們，程式會把反轉後的字串拿去跟一個叫`expected.0`的變數做比較
所以我就直接對著 expected.0 點兩下，追蹤過去看它記憶體。跳過去之後，發現那邊有一串藍色的 Hex 值
![截圖 2026-08-06 下午6.00.44](https://hackmd.io/_uploads/SkFLs0W8Gx.png)
所以接著我要提取這串 Hex 值，是因為前面的 strcmp 函數就是要拿我們的輸入跟這個記憶體位址的資料比對，所以這應該就是驗證密碼的答案。
接著，我就把這些 Hex 值全部提取出來，然後丟給AI轉換成 ASCII碼，然後結果是`}em4n3r{3SIA`
既然程式的加密邏輯是「把我的輸入反轉 = 目標字串」，那我就要把`}em4n3r{3SIA`倒過來寫
Flag:AIS3{r3n4me}
## 3.Reverse-3 
#### 1.觀察題目
這題一樣是一支檢查密碼的程式，會跟你要密碼，猜對會印 You are admin 並把 flag 印出來，猜錯就印 Access denied。但這次題目有特別提到：這題不是要你把密碼硬解出來，而是要我用課堂教的方法，打開 Ghidra，找到比對密碼的那段判斷，用 Patch Instruction 把規則改成對我有利。所以我這次的目標不是找密碼。
首先我一樣打開 Ghidra，把 rev03.out 匯入，然後一路 Analyze 讓它自動分析完。分析完之後我到左邊的 Symbol Tree → Functions 點進 main，右邊的 Decompile 就會把還原後的 C 邏輯秀出來。
再來我看了一下 Decompile，整理一下邏輯後可以看出來：程式會先檢查我輸入的密碼長度是不是剛好 25，然後跑一個迴圈，把內建的一串資料逐個 byte 做 XOR 0x37 還原成正確字元，再拿去跟我的輸入一個一個比對。只要比對到某個字元，就會走進 Access denied；整串都過了才會走到 You are admin 跟 print_flag()。
因為題目提示「從會印出來的訊息追會比較快」，我對照到中間的 Listing，就找到驗證密碼的關鍵那一行：
![截圖 2026-08-06 晚上7.51.14](https://hackmd.io/_uploads/SygBBgfLfx.png)
所以整個密碼驗證就卡在 0x00101318 這條 JNZ。現在先不用管密碼是什麼，我只要把這條分支改掉，讓拒絕那段永遠不會被執行就好。

接下來我在那一行按右鍵 → Patch Instruction。
接著那一行變成可以編輯，我把 JNZ 改成 JMP，後面的 0x00101330 不動。byte 也從 75 16 變成 EB 16：
![截圖 2026-08-06 晚上7.39.03.cropped](https://hackmd.io/_uploads/By0fIlzUfx.png)
改成無條件跳轉之後，等於每個字元不管對不對都直接跳去繼續迴圈，永遠不會掉進 Access denied，迴圈跑完就一定會走到 print_flag()。右邊的 Decompile 也馬上反映出來，比對的 if 不見了，迴圈變成空的，直接就是 puts("You are admin") 跟 print_flag()。
再來我進行匯出並執行
改好之後我用 File → Export Program，Format ，存到桌面。
接著我把它丟進 Linux 環境。所以我把它 copy 進 Docker container 裡跑，密碼湊滿 25 個字元就好，然後結果就會印出來了
```
Password: You are admin
AIS3{p4tch_m3}
```
Flag:AIS3{p4tch_m3}
## 4.Rev-HW-01 
#### 1.觀察題目
這題一樣是會跟你要密碼的程式，猜對印 Correct!、錯的話印 Wrong!。但題目有提到，這次密碼不是一整條在字串裡，而是被拆成好幾段，要用 Ghidra 的 Defined Strings 跟 Xref 把它拼回去。
#### 2.測試
首先我一樣先打開 Ghidra，把 hw01.out 匯入、Analyze 跑完。
再來因為題目說密碼被拆成好幾段，我先打開 Window → Defined Strings，把 binary 裡所有可讀字串列出來看。這裡我看到幾個可疑的東西：
```
AIS3{
sp1it_
xrefs}
AIS3{f4ke_part}     
password123
%s%s%s
Correct! / Wrong!
```
再來我要用 Xref 找出誰在用這些字串，題目提示「從會印出來的訊息追會比較快」，所以我在 Defined Strings 裡找到 Correct!，點兩下跳過去，再在它上面按右鍵 → References → Show References to Address（或直接看旁邊的 XREF 標註），追到是誰印出 Correct!。這樣就會跳到負責判斷密碼的函式 check_password。
![截圖 2026-08-06 晚上8.24.19](https://hackmd.io/_uploads/SJlW6ezLzx.png)
進到 check_password 的 Decompile 之後，我把local_XX、param_1 改成看得懂的名字，這樣邏輯就清楚了。可以看到它做的事情是：
```
1. 先檢查輸入長度必須是 0x11 = 17
2. 然後分三段用 strncmp 比對：
  - 開頭 5 個字元 == part_a
  - 接下來 6 個字元 == part_b
  - 再接下來 6 個字元 == part_c
3. 三段都對才會印 Correct!
```
再來我要追出每一段的內容
Decompile 裡那三段 strncmp 用到的 part_a / part_b / part_c，我直接點兩下跳過去看它們的記憶體位址
| 段 | 位址 | 長度 | 內容 |
| :--- | :--- | :--- | :--- |
| `part_a` | `0x2010` | `5` | `AIS3{` |
| `part_b` | `0x2016` | `6` | `sp1it_` |
| `part_c` | `0x201d` | `6` | `xrefs}` |

接下來我把它這三行拼起來
```
AIS3{ + sp1it_ + xrefs}  =  AIS3{sp1it_xrefs}
```
所以這樣就可以追到flag了
Flag:AIS3{sp1it_xrefs}
## 5.Rev-HW-02 
#### 1.觀察題目
這題一樣是會跟我要密碼的程式，對印 Correct!、錯印 Wrong!。但題目提醒：字串裡看到的東西不能直接拿來當密碼，因為輸入會先被「變換」再拿去比對。所以我要先讀懂它是怎麼變換的，再反推回去。

我一樣開 Ghidra 匯入 hw02.out，掃一遍字串，想看看有沒有像前幾題那種明碼 flag，結果當然沒有
所以我到 Defined Strings 找到 Correct!，點兩下跳過去，再對它按右鍵 → References → Show References，用 Xref 追是誰引用它。追過去會落在 main，看到印 Correct! / Wrong! 之前是由一支 check_password() 決定的，於是我點進 check_password
![截圖 2026-08-06 晚上8.55.40](https://hackmd.io/_uploads/HJOUVZzUzl.png)
再來我要整理變數，因為 C 編譯成 binary 時，編譯器為了優化會把原本有意義的變數名稱全部抹掉，CPU只認得記憶體位址跟暫存器，因為Ghidra只能依照堆疊上的相對位置隨便給一個 local_XX 的代號，所以我先動手把名字改清楚，我把傳進來的輸入改成 user_input，這樣才能看出藏在底下的演算法。
整理完之後，邏輯長這樣：
```

if (strlen(user_input) != 0x11) return 0;      // 長度必須剛好 17
for (i = 0; i < 17; i++)
    transformed[i] = user_input[i] + 1;        // ★ 對每個字元做變換
transformed[17] = '\0';
return strcmp(transformed, shifted) == 0;      // 變換後才拿去比對
```
到這邊我特別去看那個迴圈，因為電腦沒辦法像人看完一整句話如果程式想對輸入做加密，就得靠迴圈，這邊仔細看迴圈在做什麼
```
123a  movzx eax, byte ptr [rax]   ; 取出我輸入的一個字元
123d  add   eax, 0x1              ; ★ 把它 +1
1247  mov   [rbp+rax-0x50], dl    ; 存進 transformed 這個暫存區
```
看到這邊我大概懂了這支程式會把我輸入的每一個字元都 +1，湊成一個新字串 transformed，然後才拿 transformed 去跟一個內建字串 shifted 做 strcmp 比對。
接下來看到迴圈底下那行strcmp(transformed, shifted)，比對的目標是 shifted，我直接對 shifted 點兩下，用 Xref 跳到它的記憶體位址（0x2010），看到一串藍色的 Hex 值，總共 17 個 byte：
![截圖 2026-08-06 晚上9.35.14](https://hackmd.io/_uploads/HkK2TbzIfl.png)
```
42 4a 54 34 7c 6f 31 75 60 73 35 78 60 74 75 73 7e
```
接著我要把變換反過來，倒推正確輸入
既然規則是 輸入 + 1 == shifted，那我要的正確輸入就是把它反過來：每個 byte 各減 1（輸入 = shifted − 1）。逐個 byte -1 再轉成 ASCII：
| shifted | −1 | 字元 |
| :--- | :--- | :--- |
| `0x42` | `0x41` | `A` |
| `0x4a` | `0x49` | `I` |
| `0x54` | `0x53` | `S` |
| `0x34` | `0x33` | `3` |
| `0x7c` | `0x7b` | `{` |
| `0x6f` | `0x6e` | `n` |
| `0x31` | `0x30` | `0` |
| `0x75` | `0x74` | `t` |
| `0x60` | `0x5f` | `_` |
| `0x73` | `0x72` | `r` |
| `0x35` | `0x34` | `4` |
| `0x78` | `0x77` | `w` |
| `0x60` | `0x5f` | `_` |
| `0x74` | `0x73` | `s` |
| `0x75` | `0x74` | `t` |
| `0x73` | `0x72` | `r` |
| `0x7e` | `0x7d` | `}` |
因為一個一個算太慢，我直接丟一小段 Python 幫我把整串 -1 轉出來：
```
data = [0x42,0x4a,0x54,0x34,0x7c,0x6f,0x31,0x75,0x60,0x73,0x35,0x78,0x60,0x74,0x75,0x73,0x7e]
print(''.join(chr(b - 1) for b in data))   # AIS3{n0t_r4w_str}
```
結果是 AIS3{n0t_r4w_str}
Flag:AIS3{n0t_r4w_str}
## 6.Rev-HW-03 
#### 1.觀察題目
這題可以發現一樣是會跟我要密碼的程式，對印 Correct!、錯印 Wrong!。題目提示這次要用 Rename 把變數改好看懂轉換邏輯，再反推正確輸入，而且正確密碼本身就是 flag
#### 2.測試
接下來我開 Ghidra 匯入 hw03.out、Analyze，然後從 Correct! 的 Xref 看到 check_password
![截圖 2026-08-07 凌晨12.13.49](https://hackmd.io/_uploads/SkjTG4MUfx.png)
因為剛進去變數全是 local_XX。所以我把它們Rename改成看得懂的名字，這樣邏輯就清楚了
```c
if (strlen(user_input) != 0xe) return 0;        
strcpy(buf, user_input);
for (i = 0; i + 1 < 14; i += 2) {               
    tmp        = buf[i];                         
    buf[i]     = buf[i + 1];
    buf[i + 1] = tmp;
}
return strcmp(buf, expected) == 0;               
```
這邊我們可以對照組語看更清楚，中間那段就是把 buf[i] 存進 tmp、把 buf[i+1] 搬到 buf[i]、再把 tmp 放回 buf[i+1]，然後 i += 2：
![截圖 2026-08-07 凌晨12.23.09](https://hackmd.io/_uploads/B1pxr4MIfl.png)
所以轉換規則是：把輸入每一對相鄰字元交換（0↔1、2↔3、4↔5…），交換後才拿去跟內建字串 expected 比對。
再來我要找出目標字串

比對用的 expected（0x2008）
![截圖 2026-08-07 凌晨12.29.45](https://hackmd.io/_uploads/rkl8wEfIMg.png)


我點兩下跳過去看記憶體，是這 14 個 byte：
![截圖 2026-08-07 凌晨12.28.37.compressed](https://hackmd.io/_uploads/Skm7wNzUGx.jpg)
接下來我把每個 byte 用 ASCII 轉成字元
| hex | 字元 |
| :--- | :--- |
| `49` | `I` |
| `41` | `A` |
| `33` | `3` |
| `53` | `S` |
| `30` | `0` |
| `7b` | `{` |
| `64` | `d` |
| `64` | `d` |
| `33` | `3` |
| `5f` | `_` |
| `33` | `3` |
| `76` | `v` |
| `7d` | `}` |
| `6e` | `n` |
```
IA3S0{dd3_3v}n
```
這串就是「交換後」長成的樣子，看起來是把 flag 兩兩顛倒過的亂序。
再來我們來反推正確輸入
「兩兩相鄰交換」這個操作做兩次會變回原本，所以我只要把expected 再做一次一樣的兩兩交換，就會還原成正確輸入：
```
I A | 3 S | 0 { | d d | 3 _ | 3 v | } n
```
```
交換每一對：
```
```
A I | S 3 | { 0 | d d | _ 3 | v 3 | n }
```
拼起來就是 AIS3{0dd_3v3n}
Flag:AIS3{0dd_3v3n}
## 7.Rev-HW-04 
#### 1.觀察題目
這題一樣是猜密碼、對印 Correct! 錯印 Wrong! 的程式。題目提示這次檢查前會做兩段轉換。
接下來我開 Ghidra 匯入 hw04.out、Analyze，從 Correct! 的 Xref 追到 check_password，點進去、把 local_XX 全部 Rename 成看得懂的名字
![截圖 2026-08-07 凌晨12.52.41](https://hackmd.io/_uploads/H1vJ2VMUGx.png)

接下來我要用Rename 讀懂兩段轉換



![截圖 2026-08-07 凌晨1.09.47](https://hackmd.io/_uploads/HJY1eHMLfl.png)
整理完，邏輯分成三塊：
```
if (strlen(buf) != 0x11) return 0;     // 長度必須 17

// 轉換1：整串反轉
i = 0; j = len - 1;
while (i < j) { swap(buf[i], buf[j]); i++; j--; }

// 轉換2：每個字元 XOR 自己的位置
for (i = 0; i < len; i++)
    buf[i] = buf[i] ^ i;

// 比對
for (i = 0; i < len; i++)
    if (buf[i] != expected[i]) return 0;
return 1;
```
對照組語就是這兩個迴圈：
- 1241~1287：i 從頭、j（len-1）從尾，兩邊往中間 swap → 反轉整串。
- 1292~12b8：buf[i] = buf[i] XOR i（xor eax, edx 那行，edx 是索引）→ 每字元 XOR 索引。
接下來找出目標字串
比對用的 expected（0x2010）共 17 個 byte：
```
7d 6f 36 71 70 5a 63 6b 6a 7c 3a 6f 77 3e 5d 46 51
```
![截圖 2026-08-07 凌晨1.23.54](https://hackmd.io/_uploads/B1vVXSGIzl.png)
接下來我把它每個 byte XOR 它的索引
從 index 0 開始，expected[i] XOR i：
| i | expected | XOR i | = | 字元 |
| :--- | :--- | :--- | :--- | :--- |
| `0` | `7d` | `^0` | `7d` | `}` |
| `1` | `6f` | `^1` | `6e` | `n` |
| `2` | `36` | `^2` | `34` | `4` |
| `3` | `71` | `^3` | `72` | `r` |
| `4` | `70` | `^4` | `74` | `t` |
| `5` | `5a` | `^5` | `5f` | `_` |
| `6` | `63` | `^6` | `65` | `e` |
| `7` | `6b` | `^7` | `6c` | `l` |
| `8` | `6a` | `^8` | `62` | `b` |
| `9` | `7c` | `^9` | `75` | `u` |
| `10` | `3a` | `^a` | `30` | `0` |
| `11` | `6f` | `^b` | `64` | `d` |
| `12` | `77` | `^c` | `7b` | `{` |
| `13` | `3e` | `^d` | `33` | `3` |
| `14` | `5d` | `^e` | `53` | `S` |
| `15` | `46` | `^f` | `49` | `I` |
| `16` | `51` | `^10` | `41` | `A` |

再來我把整串反過來讀：
我把上面那串從右往左唸回來：
A I S 3 { d 0 u b l e _ t r 4 n }
拼起來就是：
AIS3{d0uble_tr4n}
Flag：AIS3{d0uble_tr4n}
## 8. Rev-HW-05
#### 1.觀察題目
首先可以發現這題是守門型的:輸入密碼,沒過印 Access denied,過了印 You are admin 並吐 flag。題目有說不用硬解密碼,要用 Patch Instruction 繞過檢查,而且還特別提醒「門不止一扇」。
首先我開 Ghidra 匯入 hw05.out、Analyze。這題 Symbol Tree → Functions 一看就有很多有意義的函式名（沒被 strip）：verify、gate_length、gate_bytes、win、deny、print_flag。光看名字我就大概有猜到有兩道 gate。
![截圖 2026-08-07 凌晨2.00.01](https://hackmd.io/_uploads/H1CisBzIMg.png)

![截圖 2026-08-07 凌晨2.02.26](https://hackmd.io/_uploads/B11r3BzUGl.png)

接下來從 main 開始追
```
main → verify → gate_length → gate_bytes → win → print_flag
                     │             │
                     └─ deny       └─ deny
```
然後我進去看每一關（第一道門）
![截圖 2026-08-07 凌晨2.08.37](https://hackmd.io/_uploads/SJW2prMUzx.png)
接下來是（第二道門）
![截圖 2026-08-07 凌晨2.09.47](https://hackmd.io/_uploads/S1YxArGLGl.png)
在這邊觀察下來，所以要吐 flag，得兩道門都過：長度剛好 64、而且前 16 個 byte 跟內建值一致。如果沒有合格就deny直接 patch 掉。
再來我要用 Patch Instruction 繞過兩道門

兩道門的關鍵都是一個條件跳轉 je（合格才跳到「放行」的位址，不合格就往下 call deny）。我把兩個 je 都改成無條件 jmp，這樣我不管輸入什麼他就會直接放行：
| 位址 | 原本 | 改成 | 作用 |
| :--- | :--- | :--- | :--- |
| `0x0010133d` | `JE 0x1346` | `JMP 0x1346` | 長度門永遠放行 → 會進 `gate_bytes` |
| `0x001012f0` | `JE 0x12f9` | `JMP 0x12f9` | 每個 `byte` 比對永遠當作相符 → 迴圈跑完呼叫 `win` |

然後我在 Ghidra，把 JE 改成 JMP（byte 是 74 → eb），然後 File → Export Program → Original File 匯出。
![截圖 2026-08-07 凌晨2.21.15](https://hackmd.io/_uploads/HJtixUG8fe.png)
再來我把patched 檔丟進 Linux 環境，密碼我是隨便打
```
echo 'whatever' | ./hw05_patched.out
# Password: You are admin
# AIS3{tw0_g4tes}
```
這邊可以發現兩道門都被繞過，直接進 win → print_flag。flag 內容 
Flag:AIS3{tw0_g4tes}
## 9.Rev-HW-06 
#### 1.觀察題目
這題他說沒過會印 Access denied,過了會印 You are admin 並吐 flag。題目提示檢查散在好幾個函式裡,main 幾乎沒事,要追進去用 Patch Instruction 改規則。
接下來我開 Ghidra 匯入 hw06.out、Analyze。看 Symbol Tree → Functions,函式一堆:main、verify、stage_one、stage_two、win、deny、print_flag,還有 junk_alpha、junk_beta。
![截圖 2026-08-07 凌晨2.40.20](https://hackmd.io/_uploads/SylQBUzUGx.png)
接下來我從 main 點進 verify,再一路點下去,理出這條:
```
main → verify → stage_one → stage_two → win → print_flag
          │          │           │
          └─ deny     └─ deny      └─ deny (×2)
```
![截圖 2026-08-07 凌晨2.43.31](https://hackmd.io/_uploads/B1mkIUfLMg.png)
這邊可以看到main只呼叫 verify。真正的檢查分散在三層,每一層通過才呼叫下一層,任何一關失敗就 deny:
- verify:junk_alpha(0) 的結果做判斷,不對就 deny,對了進 stage_one
- stage_one:算一個計數(長度、特定字元…)要等於 2,不然 deny,對了進 stage_two
- stage_two:先過 junk_beta,再要求所有字元的 ASCII 總和 == 0x2a2a,兩關都過才 win

再來我要找出每一關的放行跳轉，每一關都是一個條件跳轉:合格就跳去呼叫下一層(或 win)、不合格往下 call deny。我把每個「放行」的 JE/JNE 都改成無條件 JMP:
| 位址 | 所在 | 原本 | 改成 | 放行去哪 |
| :--- | :--- | :--- | :--- | :--- |
| `0x00101419` | `verify` | `JNE 0x1422` | `JMP` | → `stage_one` |
| `0x001013e5` | `stage_one` | `JZ 0x13ee` | `JMP` | → `stage_two` |
| `0x00101374` | `stage_two` | `JZ 0x137d` | `JMP` | → 下一個檢查 |
| `0x00101384` | `stage_two` | `JZ 0x138d` | `JMP` | → `win` |

我是每個都是右鍵 Patch Instruction → 把 JZ/JNE 改成 JMP（byte 74/75 → eb）。
再來我們四個都patch完，就可以進行匯出了，然後執行，接下來我密碼是隨便打
```
echo 'whatever' | ./hw06_patched.out
# Password: You are admin
# AIS3{sc4tt3r_jmp}
```
Flag:AIS3{sc4tt3r_jmp}













