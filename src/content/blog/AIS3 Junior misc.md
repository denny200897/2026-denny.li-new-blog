---
title: "AIS3 Junior misc "
description: "securi"
date: 2026-08-23
tags: ["AIS3", "security"]
---

# AIS3 Junior misc
## 1.Misc-HW-07 
##### 1.觀察題目
首先題目給了一張圖片，然後說這是一張來自交大的照片
![photo](https://hackmd.io/_uploads/ByATFJmIGe.jpg)
接下來我透過題目給的提示去google搜尋了交大公共鋼琴
![截圖 2026-08-07 上午10.27.52](https://hackmd.io/_uploads/SJBG5JXIzg.png)
搜尋到了圖書館中的鋼琴這個文章
![截圖 2026-08-07 上午10.27.31.compressed](https://hackmd.io/_uploads/SySysJ7LMg.jpg)
觀察了一下有點像圖片中的場景，跟這篇文章有點似曾相似的感覺
所以我就直接去google map查詢交大圖書館
![截圖 2026-08-07 下午1.23.17](https://hackmd.io/_uploads/BJzRiJ7UGl.png)
然後就查到了他的全名
國立陽明交通大學浩然圖書館
所以Flag:AIS3{國立陽明交通大學浩然圖書館}
## 2.MISC - 01 
#### 1.觀察題目
首先點了連結他會下載了一張圖片
![chall](https://hackmd.io/_uploads/r1LLIZQ8Ge.jpg)
會看到是一隻可愛的狗狗可是主要不是看狗狗，所以我就先用exiftool這個工具先看照片基本資料
![截圖 2026-08-07 下午3.55.11](https://hackmd.io/_uploads/HJ0vyMmUMl.png)
可以看到基本上都是照片基本資訊沒有什麼有用的資料，所以接下來我要用steghide這個工具來看看這照片有沒有隱藏的檔案，然後把他提起出來
![截圖 2026-08-07 下午4.01.34](https://hackmd.io/_uploads/HJ61WzXUMg.png)
這邊可以看到他提取出了secret.txt
所以接下來我們就可以把secret.txt印出來
![截圖 2026-08-07 晚上7.27.39](https://hackmd.io/_uploads/Skv4brQIMl.png)
Flag:AIS3{steghide_demo}
## 3.Misc-HW-05 
#### 1.觀察題目
首先這題很明確，因為題目直接說了附檔是一張 JPEG，裡面藏了東西。 
但我還是先把它照片的基本資訊用exiftool印出來
![截圖 2026-08-07 晚上7.31.44](https://hackmd.io/_uploads/HkyVGBmLGl.png)
這次仔細看可以發現Comment欄位有一串password : hw05misc
所以我先把這串記起來，我們拿到密碼了，再來我還是要檢查一下這剛圖片有沒有藏其他檔案，如果有的話把它提取出來，所以我一樣用steghide這個工具來看看這照片有沒有隱藏的檔案，然後把他提起出來
![截圖 2026-08-07 晚上7.35.06](https://hackmd.io/_uploads/H1DlXHXIGx.png)
這邊可以發現這張圖片跟上一題一樣都藏有secret.txt這個檔案，接下來我們一樣用cat這個指令把裡面內容印出來
![截圖 2026-08-07 晚上7.36.38](https://hackmd.io/_uploads/H1QU7rQUMg.png)
Flag:AIS3{m3ta_p4ssw0rd}
## 4.Misc-HW-04 
#### 1.觀察題目
接下來看這題一樣是個圖片，我一樣先把照片的基礎資訊都列出來
![截圖 2026-08-07 晚上7.54.33](https://hackmd.io/_uploads/r1uFPSmIzg.png)
但可以發現完全沒有任何相關有用的資訊，裡面也沒有密碼，但可以觀察到這題檔案是`.png`，所以我就沒用steghide這個工具，因為steghide這個工具只能用在JPEG、BMP、WAV、AU這幾種格式，於是我就試了strings，然後直接grep flag的開頭AIS3
```
strings chall.png | grep AIS3
```
然後flag就出來了
![截圖 2026-08-07 晚上9.18.46](https://hackmd.io/_uploads/H1mro8mUMe.png)
Flag:AIS3{h1dd3n_1n_pla1n}
## 5.Misc-HW-03 
首先可以看到這題跟前幾題很不一樣，這題是pdf檔，所以我就沒用前面那些看圖片的工具來看這個檔案，而我是用strings把chall.pdf的檔案資訊列出來
![截圖 2026-08-07 晚上9.38.23](https://hackmd.io/_uploads/SJ3CJvmUzg.png)
在這裡面我可以看到有一個地方怪怪的就是最底下的`secret.txtPK`，而且正常來說pdf擋到%%EOF就要結束了，但下面還有東西，然後尾巴出現了 `secret.txt` 這個檔名，還有 PK 這兩個字母，在這邊可以判斷這個pdf後面夾帶了zip檔，然後裡面有一個叫 `secret.txt` 的檔案，因為這邊我知道他是個pdf檔，所以我就直接用upzip解壓縮這個pdf檔
![截圖 2026-08-07 晚上9.50.02](https://hackmd.io/_uploads/Hku9MwX8zx.png)
解壓出來可以看到有一個.txt檔，然後我把它cat出來看.txt裡面內容
![截圖 2026-08-07 晚上9.50.57](https://hackmd.io/_uploads/HkCTGw7UGx.png)
Flag:AIS3{b1nw4lk_pdf}
## 6. Misc-HW-01 
#### 1.觀察題目
題目說請你去調查一個叫林子安的人，他的社交帳號是zi_an_lin_420 二月的時候他曾經有出國玩請問他的英文名字跟座位號碼是什麼？
所以我就直接去google搜尋這個社群帳號
![截圖 2026-08-07 晚上9.56.50](https://hackmd.io/_uploads/B1ZNVPmLMx.png)
在畫面中可以看到這個人的貼文於是我點去他的主頁
![截圖 2026-08-07 晚上10.00.04](https://hackmd.io/_uploads/ryGlBP78ze.png)
進到主頁我看到了關鍵字"出國玩"所以我點進去了他的精選限動裡
![截圖 2026-08-07 晚上10.05.58](https://hackmd.io/_uploads/BJE8LvmUze.png)
這邊我發現有個飛機票的條碼，因為我沒搭過飛機，所以根本不知道，這個東西可以掃的，直到我問助教我才恍然大悟這是可以掃的，所以我去手機下載了Boarding Pass這個軟體來掃這張機票，掃完後可以看到
![截圖 2026-08-07 22.13.43.compressed](https://hackmd.io/_uploads/ryTUODXLzx.jpg)
從畫面上可以看到他這張機票的名字，以及座位這樣我們就可以把flag拼起來了
Flag:AIS3{JACKIE_LIN_35A}

## 7.Misc-HW-02 
#### 1.觀察題目
可以看到這個題目承上題，他繼續要我們找林子安11/4的時候，人在哪裡？
於是我把剛剛打開的主頁每篇貼文翻了一遍都沒看到11/4號的日期，然後我又看了他的精選限動也沒找到11/4號相關日期，於是我切到有人標注他的那個畫面，然後我就看到了有一篇11/4號的影片
![截圖 2026-08-07 晚上10.26.27.compressed](https://hackmd.io/_uploads/BkhNowQUGe.jpg)
於是我把他的背景放進去google查
![截圖 2026-08-07 晚上10.27.51](https://hackmd.io/_uploads/B1dOowX8fe.png)
可以看到這邊是國立中正紀念堂，所以11/4號林子安在國立中正紀念堂
Flag:AIS3{國立中正紀念堂}
## 8.Misc-HW-06 
#### 1.觀察題目
我發現到這題跟前面幾題變有點難，因為我要實作一個直譯器，首先我先讀了`judge.py`
```
if run_bf(SAMPLE) != 'Hello':       # 第一關：sample_hello.bf 要印出 Hello
    return False, 'sample_hello.bf 未通過'
return True, run_bf(FLAG_BF)         # 第二關：跑 flag.bf，回傳值 flag
```
所以只要我的直譯器正確，先讓 sample_hello.bf 印 Hello，validator 就會拿 flag.bf 餵給它、把輸出當 flag 回傳。
然後接下來我要搞懂 Brainfuck 規則
Brainfuck 靠一條記憶體帶加一個資料指標運作，所以我要實作 7 個指令：
| 指令 | 動作 |
| :--- | :--- |
| `>` / `<` | 資料指標右移 / 左移一格 |
| `+` / `-` | 當前格的值 `+1` / `-1` |
| `.` | 把當前格的值當 `ASCII` 輸出 |
| `[` | 當前格為 `0` → 跳到對應 `]` 之後（跳過迴圈） |
| `]` | 當前格非 `0` → 跳回對應 `[`（重跑迴圈） |

這邊可以看到：
- 每格是 8-bit（0~255），加減會回繞（255+1→0、0−1→255），所以運算後要 & 0xFF。
 `- [ ]` 成對，像迴圈的大括號。若每次跳轉都現場掃描找配對括號，遇到大迴圈會慢到超時，所以我先建一張「括號配對表」，跳轉然後直接查表。

接下來我寫了一隻腳本 :
```python
def run_bf(code: str) -> str:
    jump, stack = {}, []
    for i, ch in enumerate(code):
        if ch == '[':
            stack.append(i)
        elif ch == ']':
            start = stack.pop()
            jump[start] = i    
            jump[i] = start    

    tape = bytearray(30000)   
    ptr = 0                    
    ip = 0                     
    out = []                   
    while ip < len(code):
        ch = code[ip]
        if ch == '>':   ptr += 1
        elif ch == '<': ptr -= 1
        elif ch == '+': tape[ptr] = (tape[ptr] + 1) & 0xFF   
        elif ch == '-': tape[ptr] = (tape[ptr] - 1) & 0xFF
        elif ch == '.': out.append(chr(tape[ptr]))           
        elif ch == '[':
            if tape[ptr] == 0: ip = jump[ip]     
        elif ch == ']':
            if tape[ptr] != 0: ip = jump[ip]    
        ip += 1
    return ''.join(out)
```
這隻邏輯就是模擬：ip 一格一格往後讀指令，ptr 指著記憶體帶當前格；碰到 . 就把該格 byte 轉字元收進 out；碰到 [ ] 用一開始建好的 jump 表決定要不要跳。跑完把 out 接成字串回傳。

接下來我驗證一下 sample 為什麼會印 Hello：sample_hello.bf 開頭 -[------->+<]>-. 這種寫法，是用迴圈把某格快速累加到 H(72) 的 ASCII 附近再微調，然後 . 印出，後面每段各自湊出 e、l、l、o。所以我的直譯器只要正確執行加減與迴圈，就會吐出 Hello。

接下來我把這隻腳本上傳上去`http://165.154.226.158:8767/`

![截圖 2026-08-07 晚上11.22.40](https://hackmd.io/_uploads/rk1LOuQIMe.png)
Flag:AIS3{brainfuck_is_C001!}















