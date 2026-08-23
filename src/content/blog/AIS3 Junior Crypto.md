---
title: "AIS3 Junior Crypto "
description: "securi"
date: 2026-08-23
tags: ["AIS3", "security"]
---

# AIS3 Junior Crypto
## 1.Crypto-1
#### 1.觀察題目
首先可以看到題目他說使用shift 5 加密，所以這代表每個英文字元要往後移5格
#### 2.測試
可以看到題目給的是`VDN3{zixmtkoj}`
所以我依序把每個字母往後5格
*   **V** $\rightarrow$ W, X, Y, Z, **A** (超過 Z 繞回 A)
*   **D** $\rightarrow$ E, F, G, H, **I**
*   **N** $\rightarrow$ O, P, Q, R, **S**
*   **3** $\rightarrow$ 保留為 **3**
*   **{** $\rightarrow$ 保留為 **{**
*   **z** $\rightarrow$ a, b, c, d, **e**
*   **i** $\rightarrow$ j, k, l, m, **n**
*   **x** $\rightarrow$ y, z, a, b, **c**
*   **m** $\rightarrow$ n, o, p, q, **r**
*   **t** $\rightarrow$ u, v, w, x, **y**
*   **k** $\rightarrow$ l, m, n, o, **p**
*   **o** $\rightarrow$ p, q, r, s, **t**
*   **j** $\rightarrow$ k, l, m, n, **o**
*   **}** $\rightarrow$ 保留為 **}**

這樣就可以依序把它拼出來AIS3{encrypto}
這邊順便補充一下，這題也可以用工具解，我使用的是CyberChef這個工具，然後上課有提到說凱薩密碼跟ROT 13的原理是一樣的，所以我就把它丟進去CyberChef，然後因為他說他是shift 5，所以我這邊輸入5
![截圖 2026-08-06 上午10.34.52](https://hackmd.io/_uploads/Bk50fObIfe.png)

Flag:AIS3{encrypto}
## 2.Crypto-2
#### 1.觀察題目
首先可以看到題目他說使用shift 6 解密，所以這代表每個英文字元要往前移6格
#### 2.測試
可以看到題目給的是`GOY3{3tIxevzu}`
所以我依序把每個字母往前移6格＝-6
*   **G** $\rightarrow$ F, E, D, C, B, **A**
*   **O** $\rightarrow$ N, M, L, K, J, **I**
*   **Y** $\rightarrow$ X, W, V, U, T, **S**
*   **3** $\rightarrow$ 保留為 **3**
*   **{** $\rightarrow$ 保留為 **{**
*   **3** $\rightarrow$ 保留為 **3**
*   **t** $\rightarrow$ s, r, q, p, o, **n**
*   **I** $\rightarrow$ H, G, F, E, D, **C** 
*   **x** $\rightarrow$ w, v, u, t, s, **r**
*   **e** $\rightarrow$ d, c, b, a, z, **y** (超過 a 繞回 z)
*   **v** $\rightarrow$ u, t, s, r, q, **p**
*   **z** $\rightarrow$ y, x, w, v, u, **t**
*   **u** $\rightarrow$ t, s, r, q, p, **o**
*   **}** $\rightarrow$ 保留為 **}**
這樣就可以依序把它拼出來AIS3{3nCrypto}
這邊順便補充一下，這題也可以用工具解，我使用的是CyberChef這個工具，然後上課有提到說凱薩密碼跟ROT 13的原理是一樣的，所以我就把它丟進去CyberChef，然後因為他說他是shift 6解密，所以我這邊輸入-6
![截圖 2026-08-06 上午11.17.38](https://hackmd.io/_uploads/Syk1pu-Ufx.png)
Flag:{3nCrypto}
## 3.Crypto-4 
#### 1.觀察題目
首先可以看到這次題目沒有任何提示，但我現在知道Flag開頭是AIS3，所以
```
密文的 L 對應明文的 A
密文的 T 對應明文的 I
密文的 D 對應明文的 S
```
再來我們可以計算一下字母在字母表上的距離從 L 往回推算到 A，需要往前移動 11 格，從 T 往回推算到 I，也是往前移動 11 格
從 D 往回推算 11 格，由次可知規律是往前移動11格。
#### 2.測試
所以：
*   **L** → 往回 11 格 → K, J, I, H, G, F, E, D, C, B, **A**
*   **T** → 往回 11 格 → S, R, Q, P, O, N, M, L, K, J, **I**
*   **D** → 往回 11 格 → C, B, A, Z, Y, X, W, V, U, T, **S**
*   **3** → 保留為 **3**
*   **{** → 保留為 **{**
*   **m** → 往回 11 格 → l, k, j, i, h, g, f, e, d, c, **b**
*   **c** → 往回 11 格 → b, a, z, y, x, w, v, u, t, s, **r**
*   **f** → 往回 11 格 → e, d, c, b, a, z, y, x, w, v, **u**
*   **e** → 往回 11 格 → d, c, b, a, z, y, x, w, v, u, **t**
*   **3** → 保留為 **3**
*   **_** → 保留為 **_**
*   **q** → 往回 11 格 → p, o, n, m, l, k, j, i, h, g, **f**
*   **0** → 保留為 **0**
*   **c** → 往回 11 格 → b, a, z, y, x, w, v, u, t, s, **r**
*   **n** → 往回 11 格 → m, l, k, j, i, h, g, f, e, d, **c**
*   **p** → 往回 11 格 → o, n, m, l, k, j, i, h, g, f, **e**
*   **}** → 保留為 **}**

所以最結果AIS3{brut3_f0rce}，但這題其實有更快的做法他跟前幾題依樣可以直接丟進CyberChef然後可以得知是往回11格所以輸入-11
![截圖 2026-08-06 中午12.21.43](https://hackmd.io/_uploads/BJXJ3tZ8Gl.png)
Flag:AIS3{brut3_f0rce}
## 4. Crypto-3 
#### 1.觀察題目
題目說已知flag開頭是AIS3。然後他這題沒有說shift多少，所以要找出 shift，並解密：
因為他說開頭是AIS3所以我把JRB3{tw0fw_y1jrwcngc}往前推9格就可以推到AIS3，由此可知規律是往前推9格
#### 2.測試
*   **J** → 往回 9 格 → I, H, G, F, E, D, C, B, **A**
*   **R** → 往回 9 格 → Q, P, O, N, M, L, K, J, **I**
*   **B** → 往回 9 格 → A, Z, Y, X, W, V, U, T, **S**
*   **3** → 保留為 **3**
*   **{** → 保留為 **{**
*   **t** → 往回 9 格 → s, r, q, p, o, n, m, l, **k**
*   **w** → 往回 9 格 → v, u, t, s, r, q, p, o, **n**
*   **0** → 保留為 **0**
*   **f** → 往回 9 格 → e, d, c, b, a, z, y, x, **w**
*   **w** → 往回 9 格 → v, u, t, s, r, q, p, o, **n**
*   **_** → 保留為 **_**
*   **y** → 往回 9 格 → x, w, v, u, t, s, r, q, **p**
*   **1** → 保留為 **1**
*   **j** → 往回 9 格 → i, h, g, f, e, d, c, b, **a**
*   **r** → 往回 9 格 → q, p, o, n, m, l, k, j, **i**
*   **w** → 往回 9 格 → v, u, t, s, r, q, p, o, **n**
*   **c** → 往回 9 格 → b, a, z, y, x, w, v, u, **t**
*   **n** → 往回 9 格 → m, l, k, j, i, h, g, f, **e**
*   **g** → 往回 9 格 → f, e, d, c, b, a, z, y, **x**
*   **c** → 往回 9 格 → b, a, z, y, x, w, v, u, **t**
*   **}** → 保留為 **}**
推回來是：AIS3{kn0wn_p1aintext}
Flag:AIS3{kn0wn_p1aintext}
其實這題跟前幾題依樣都可以使用CyberChef這個工具來解，前面知道規律是往前推9所以我在這邊輸入`-9`
![截圖 2026-08-06 中午12.38.33](https://hackmd.io/_uploads/rJURJqbLzg.png)
## 5.Crypto-5 
#### 1.觀察題目
雖然這題是密碼學題目，但我是web狗，所以我發現這是一個純前端的網站，我就打開網頁原始碼，結果就看到題目的邏輯以及，被替換的數字
#### 2.測試
![截圖 2026-08-06 中午12.43.28](https://hackmd.io/_uploads/HkRx-5ZUzg.png)
Flag:AIS3{FA_1s_COOL!}

但其實這題的正規解是要算字母頻率 + 找短字。
且密文中 M 出現最多 → 猜英文最高頻的 E。單字母 R → 英文單字母只有 A/I,配合上下文選 A。三字母高頻 SJRS 這種 _ ?_ ?樣式 + ROM、QHS 幫忙定位
再來是用常見的字來當範本
```
  - ROM → ARE（R=A, O=R, M=E）
  - QHS → NOT（Q=N, H=O, S=T）
  - SJRS → THAT（S=T, J=H）
  - FB → IS（F=I, B=S）
  - ZJI → WHY（Z=W, I=Y）
```
接著就是把剩下的字填完
```
 - MQDEFBJ → ENGLISH（補 D=G）
  - GHWWHQ → COMMON（G=C, W=M）
  - UOMYTMQGI → FREQUENCY（U=F, Y=Q, T=U）
  - RQREIBFB → ANALYSIS
  - POMRV → BREAK（P=B, V=K）
  - BFWXEM → SIMPLE（X=P）
  - BTPBSFSTSFHQ → SUBSTITUTION
  - GFXJMO → CIPHER
```
這樣我們就可以還原全文
```
ENGLISH LETTERS ARE NOT EQUALLY COMMON. THAT IS WHY FREQUENCY ANALYSIS CAN BREAK A SIMPLE SUBSTITUTION CIPHER.
```

## 6.Crypto-6 
#### 1.觀察題目
這次題目說給我 RSA 的 n、其中一個質因數 p、公開指數 e，還有密文 c。

n = 5767
p = 73
e = 7
c = 4780

要先找回另一個質因數，算出私鑰，再把 c 解回來
首先我要先算出q，所以q = n // p，現在有了p、q就能算`φ(n)`
有了`φ(n)`就能從題目給的e跟反推d，這裡的N是`5767=73x79=p x q`，再來我們要算`phi`，`phi`的算法是
```
(p - 1) * (q - 1)
```
也就是73-1 x 79-1 = 5616，它的用途來自尤拉定理：若 gcd(a, n) = 1 ，則：
$$a^{\varphi(n)} \equiv 1 \pmod{n}$$

換句話說，指數是在模 φ(n) 的世界運算的。
再來是我們要算私鑰 d。RSA 的加解密關係是：
$$c \equiv m^e \pmod n, \qquad m \equiv c^d \pmod n$$
要讓這兩個互逆，必須滿足 $(m^e)^d = m^{ed} \equiv m \pmod n$。因為剛剛提到「指數在模 φ(n) 的世界運算」，所以我們不需要 $ed = 1$，只需要：

$$e \cdot d \equiv 1 \pmod{\varphi(n)}$$

也就是 d 是 e 在模 φ(n) 下的乘法反元素。代入這題就是解：

$$7d \equiv 1 \pmod{5616}$$
```
d = pow(e, -1, phi)
```
接下來我們有了d就能還原明文
```
m = pow(c, d, n)
```
$$m = 4780^{2407} \bmod 5767 = 1337$$
然後最後我們把m印出來
```
print(m)
```
完整的腳本就是：
```python
n = 5767
p = 73
q = n // p
e = 7
c = 4780
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, n)
print(m)
```
輸出：
![截圖 2026-08-06 下午4.09.32](https://hackmd.io/_uploads/ByqrZabIGx.png)
所以flag是：
Flag:AIS3{1337}
## 7.Crypto-7 
#### 1.觀察題目
首先題目給我了RSA的三樣東西
```
n = 10807
e = 7
c = 1220
```
觀察這題我發現 n = 10807 非常小，小到可以直接分解。只要把 p、q 拆出來，就能算出私鑰 d，整個 RSA 就被打開了。所以：分解 n → 算 φ(n) → 求私鑰 d → 解密 c。
首先在寫之前我先把邏輯在紙上推一遍，確認流程沒問題
```
(1) 分解 n
從小質數試除，找到：
10807 = 101 × 107     →  p = 101, q = 107

(2) 算 φ(n)
φ(n) = (p−1)(q−1) = 100 × 106 = 10600

(3) 求私鑰 d
d 是 e 對 φ(n) 的模反元素，要滿足 e·d ≡ 1 (mod φ)：
7 · d ≡ 1 (mod 10600)   →   d = 4543
驗證：7 × 4543 = 31801 = 3 × 10600 + 1，餘數是 1 

(4) 解密
m = c^d mod n = 1220^4543 mod 10807
（因為手算太大，所以我交給程式）
```
#### 2.測試
再來我把上面的流程寫了一個腳本
```python
n = 10807; e = 7; c = 1220
p = next(i for i in range(2, n) if n % i == 0)
q = n // p                    
phi = (p - 1) * (q - 1)         
d = pow(e, -1, phi)              
m = pow(c, d, n)                
print("m =", m)
print(f"{{{m}}}")
```
執行後結果是7331，所以flag是AIS3{7331}
Flag:AIS3{7331}
## 8.Crypto-8 
#### 1.觀察題目
題目一樣給了 RSA 的 n、e、c，但這次有兩個關鍵提示：沒有 padding，而且 明文滿足 m³ < n。
```
n = 10000000000000000000000006692600000000000000000000673971373
e = 3
c = 104113716851630291574772668658086347914139279774012288613

RSA 加密是 c = m^e mod n。這題 e = 3，而且題目說 m³ < n——這代表加密時的 mod n 根本沒有作用（因為 m³ 比 n 還小，取餘數等於沒取）。所以：
```
c = m³ mod n = m³
```
既然 c 就是 m 的立方，那我其實n 都不用分解、私鑰也不用算，直接對 c 開整數立方根就能還原 m。
```
接下來我寫了一個腳本
對 c 開整數立方根，再把整數轉回 bytes：
```python
n = 10000000000000000000000006692600000000000000000000673971373
e = 3
c = 104113716851630291574772668658086347914139279774012288613
print("n =", n)
print("e =", e)
print("c =", c)
m = round(c ** (1 / 3))          
while m ** 3 < c: m += 1        
while m ** 3 > c: m -= 1
print("m =", m)
flag = m.to_bytes((m.bit_length() + 7) // 8, "big")
print("Flag:", flag.decode())
```
輸出：Flag:AIS3{e3}
Flag:AIS3{e3}
## 9. Crypto-HW-01 
#### 1.觀察題目
題目給了一張名為 `key.png` 的圖片，裡面有一串由幾何符號與數字混雜的密文。

這邊我一眼就認出了這是經典的豬圈密碼，而且這題很巧妙地結合了數字與底線等明文字元來增加變化。

既然我們確認是豬圈密碼，這題不需要寫腳本，只要找一張豬圈密碼的對照表，直接看圖對應就能還原出明文。

#### 2. 逐步解密
接下來我對著密碼表，把圖片裡的符號逐字拆解出來：
![圖片](https://hackmd.io/_uploads/ryYMtIMUze.png)

**前半段字首：**
* `┘` = A（第一組無點方格，左上角）
* `┌` = I（第一組無點方格，右下角）
* `\/` = S（第三組無點交叉，上方）
* `3` = 3（明文數字）
* `{` = {（明文符號）

=> 字首解出來是 `AIS3{`。

**後半段內容：**
* `┐·` = P（第二組有點方格，左下角）
* `1` = 1（明文數字）
* `┐` = G（第一組無點方格，左下角）
* `┐·` = P（第二組有點方格，左下角）
* `□` = E（第一組無點方格，正中間）
* `□·` = N（第二組有點方格，正中間）
* `_` = _（明文底線）
* `└·` = L（第二組有點方格，右上角）
* `0` = 0（明文數字）
* `0` = 0（明文數字）
* `⊔·` = K（第二組有點方格，正上方）
* `<` = U（第三組無點交叉，右側）
* `┐·` = P（第二組有點方格，左下角）
* `}` = }（明文符號）

=> 內容解出來是 `P1GPEN_L00KUP}`。
把兩段組合起來，flag就出來了
Flag:AIS3{P1GPEN_L00KUP}
## 10.Crypto-HW-02 
#### 1.觀察題目
題目丟給我一個 ciphertext.txt，打開看到一整串這樣的東西：

QkZXWEVNIEJUUEJTRlNUU0ZIUSBKRktNQiBFTVNTTU9CIFBUUyBFTVJWQiBF...==

我觀察到兩個特徵：只有大小寫英文字母加數字，而且結尾是 ==。這是 Base64的特徵。所以我認為這串不是最終密碼，而是被 Base64 包了一層，所以我先解開來看裡面是什麼。
![截圖 2026-08-06 晚上10.31.08](https://hackmd.io/_uploads/Sy2h5Mf8Mx.png)

解出來是：
```
BFWXEM BTPBSFSTSFHQ JFKMB EMSSMOB PTS EMRVB ERQDTRDM BSRSFBSFGB.
KMGHKM SJM PRBM64 ERIMO UFOBS SJMQ BHEAM SJM GFXJMO.
SJM UERD FB RFB3{P64_SJMQ_UR}.
```
首先觀察：它是有空格分隔的大寫英文單字，看起來像句子但每個字都不是英文——所以我感覺這是典型的單表替換密碼，每個字母被固定換成另一個字母。而且最後面有 RFB3{...}，看起來像是被替換過的flag。

接下來我要來替換密碼，首先我知道flag格式一定是AIS3{}
，而密文對應的位置是 RFB3{...}
R → A,  F → I,  B → S

接著我用英文的高頻字繼續推。文中一直出現 SJM，最常見的三字母字就是 THE，所以 S→T、J→H、M→E；又看到 FB 對應 IS。然後我再一個字一個字對：
```
 UERD FB → ????  IS，前面接 flag，猜 FLAG → U→F, E→L, D→G
- ERQDTRDM → LAN_UA_E → LANGUAGE，補上 Q→N
- BTPBSFSTSFHQ → S_?STITUTION → SUBSTITUTION，補上 T→U, P→B, H→O
- BFWXEM → SI??LE → SIMPLE，補上 W→M, X→P
- GFXJMO → ?IPHER → CIPHER，補上 G→C
```
接著我把整張表套回去
```python
m = {'R':'A','F':'I','B':'S','S':'T','J':'H','M':'E','U':'F','E':'L',
     'D':'G','Q':'N','P':'B','W':'M','X':'P','T':'U','H':'O','K':'D',
     'O':'R','V':'K','G':'C','I':'Y','A':'V'}
print(''.join(m.get(c, c) for c in ct))
```
輸出：
```
 SIMPLE SUBSTITUTION HIDES LETTERS BUT LEAKS LANGUAGE STATISTICS. DECODE THE BASE64 LAYER FIRST THEN SOLVE THE CIPHER. THE FLAG IS AIS3{B64_THEN_FA}.
```
Flag:AIS3{B64_THEN_FA}
## 11.Crypto-HW-03 
#### 1.觀察題目
題目給了一個 challenge.txt，我先看了他的內容發現這個檔案內容超多，首先我觀察到每一行都是一串看不懂的英文單字，但長得像句子，看起來是凱撒位移，只是把字母平移，每一行中間都藏著一個 flag，格式像 MUE3{...}、RZJ3{...}、ZHR3{...}——前綴每行都不一樣，代表每行的位移量不同。
flag 前綴雖然是這些開頭，但真正的 flag開頭是AIS3{...}。所以每一行的 flag 前綴其實就是 AIS 被位移後的樣子。
所以我現在有了想法每一行都用「把 flag 前綴對回 AIS」來反推出該行的位移量，再把 flag 解出來，但有超級多行，所以我不能手解
首先我先驗證一下我的想法，我先隨手挑第一行的 flag MUE3{rmwq_rxms} 驗證位移假設：M 要變回 A，位移量是 12（M 是第 12 個字母）。把 rmwq_rxms 一起往回移 12 位：
結果解出來是fake_flag，那這就證明了一件事，就是位移量正確，但大多都是假flag
#### 2.測試
因為我懶得手寫腳本，所以此腳本交給ai幫我寫邏輯
```python
import re
from collections import Counter

def dec(s, k):                      
    r = ''
    for c in s:
        if c.isupper():   r += chr((ord(c) - 65 - k) % 26 + 65)
        elif c.islower(): r += chr((ord(c) - 97 - k) % 26 + 97)
        else:             r += c
    return r

pat = re.compile(r'([A-Za-z]{3})3\{([A-Za-z0-9_]+)\}')   
cnt = Counter()
for line in open('challenge.txt'):
    m = pat.search(line)
    if not m:
        continue
    prefix = m.group(1)
    k = (ord(prefix[0].upper()) - ord('A')) % 26 
    if dec(prefix.upper(), k) != 'AIS':         
        continue
    cnt[dec(m.group(0), k)] += 1
for f, c in cnt.most_common():                   
    print(c, f)
```
這隻腳本得作法是：每行用正則抓出 XXX3{...}，用前綴第一個字母算出位移量 k，確認整個前綴解回來真的是 AIS，再把 flag 整個解密，最後用 Counter 統計。
輸出結果是：
```
9999 AIS3{fake_flag}
1    AIS3{c4es_ar0k}
```
這代表10000 行裡有 9999 行是誘餌 AIS3{fake_flag}，只有一行解出來是AIS3{c4es_ar0k}，與其他不同，所以他就是真正的flag
Flag:AIS3{c4es_ar0k}
## 12.Crypto-HW-04
#### 1.觀察題目
這題他付了一個output.txt，可以看到裡面有RSA的三個東西
```
n = 21968021
e = 17
c = 5854946
```
觀察這題我發現 n = 21968021 只有 8 位數，非常小，所以
我可以暴力試圖破解，只要把 p、q 拆出來，我就能算出 φ(n)、進而算出私鑰 d，這樣整把鑰匙就可以拿到。所以我現在有了攻擊路線：分解 n → 算 φ(n) → 求 d → 解密 c。
在我開始寫腳本之前我先手推一遍流程
```
(1) 分解 n
從 2 開始試除，找到第一個能整除 n 的數就是 p，另一個是 n / p：
21968021 = 4127 × 5323   →  p = 4127, q = 5323

(2) 算 φ(n)
φ(n) = (p−1)(q−1) = 4126 × 5322 = 21958572

(3) 求私鑰 d
d 是 e 對 φ(n) 的模反元素，要滿足 e·d ≡ 1 (mod φ)：
17 · d ≡ 1 (mod 21958572)  →  d = 9041765

(4) 解密
m = c^d mod n = 5854946^9041765 mod 21968021
這步次方太大，我打算直接交給程式算。
```
接下來我就開始寫腳本
```
n = 21968021; e = 17; c = 5854946
p = next(i for i in range(2, n) if n % i == 0)
q = n // p                       
phi = (p - 1) * (q - 1)          
d = pow(e, -1, phi)              
m = pow(c, d, n)                
print("m =", m)
print(f"AIS3{{{m}}}")
```
最後執行結果：
m = 90210
AIS3{90210}
Flag:AIS3{90210}
## Crypto-HW-05 
#### 1.觀察題目
題目附了 output.txt，裡面一樣是 RSA：
```
n = 468359974447286090812229949402868393194905269978966009744154040701149709191284286159384127221110732613
e = 3
c = 138390867184400671369429485315529066403913401512756077717260811128013885680231233545090894181
```
首先我觀察到n的數字非常大所以不能像上一題一樣暴力試除分解，這邊我發現當公開指數e很小，明文又沒有padding、而且明文本身很短時，有可能還沒超過n，這時候加密裡的 mod n 等於沒作用，也就是說密文 c 其實就是 m 的立方，所以我不用去碰n，私鑰也不用算，我可以直接對c開整數立方根就能還原m，再解之前我想要知道怎麼驗證假設對不對，如果 c 真的等於 m³，那我對 c 開立方根算出來的整數，再立方回去應該剛好等於 c（完全立方、沒有餘數）。如果不是完全立方，代表 m³ 其實有超過 n、被 mod 過，那就得換別的解法。所以我的程式除了開根，還要加一個 m³ == c 的檢查。
接下來我要寫腳本，我使用的是二分搜尋法這樣比較快
```python
n = 468359974447286090812229949402868393194905269978966009744154040701149709191284286159384127221110732613
e = 3
c = 138390867184400671369429485315529066403913401512756077717260811128013885680231233545090894181
def integer_cube_root(n):
    low, high = 0, n
    while low <= high:
        mid = (low + high) // 2
        if mid**3 == n:
            return mid
        elif mid**3 < n:
            low = mid + 1
        else:
            high = mid - 1
    return None
m = integer_cube_root(c)
flag = m.to_bytes((m.bit_length() + 7) // 8, "big")
print(flag.decode())
```
結果是：AIS3{cu6e_rt}
Flag:AIS3{cu6e_rt}