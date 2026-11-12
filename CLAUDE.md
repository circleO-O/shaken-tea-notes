# CLAUDE.md — 手搖飲筆記 (Shaken Tea Notes)

本文件是 AI 在此專案工作時的唯一規則來源。新增或修改任何內容前,請先完整讀完。

## 1. 專案目的

一個介紹「台灣各家手搖飲料店」的靜態知識網站,內容分為三區(首頁、飲料店、小知識):

- **首頁(點餐畫面)**:以「飲品」為單位,一款飲品一格,標示哪幾間店推薦,可依類型篩選。
- **飲料店**(`shops.html` → `shop.html?id=<shop-id>`):列表頁每家店一張可點擊的卡片(品牌 logo、店名、創立年份、起源地);點進去的店家頁顯示 logo、創立年份、起源地、品牌故事與依類型分組的推薦飲品。頁面上不顯示來源與 logo 出處。
- **飲料小知識**(輔助):茶底、配料、點餐指南,協助讀者看懂菜單。

推薦飲品只在 `shops.json` 記錄一次,首頁的飲品格由程式反向整理,不得另外手寫。

目標讀者:想快速認識各家飲料店、點餐不踩雷的一般讀者。
專案同時是課程作業:重點是「規則可重複使用」,之後只要告訴 AI「新增某某店」或「新增某某主題頁」,就能依本文件產出風格一致的內容。

## 2. 技術限制

- 純靜態網站:HTML + CSS + 少量原生 JavaScript。
- **不使用**建置工具、框架、npm 套件、CDN 腳本。字型僅可用系統字型。
- 部署:GitHub Pages(從 `main` 分支根目錄發佈)。
- 所有連結使用**相對路徑**,確保在 `https://<user>.github.io/shaken-tea-notes/` 子路徑下正常運作。
- 語言:頁面內容為繁體中文(台灣用語);`<html lang="zh-Hant-TW">`。

## 3. 目錄結構

```
shaken-tea-notes/
├── CLAUDE.md            # 本文件
├── README.md            # 專案簡介、網址、頁面清單
├── index.html           # 首頁:點餐畫面(飲品格 + 類型篩選)+ 其他頁面入口
├── pages/               # 內容頁,一個主題一個檔案
│   ├── shops.html           # 飲料店列表(卡片可點,連到 shop.html)
│   ├── shop.html            # 單一店家頁,由網址 ?id= 與 shops.json 渲染
│   ├── tea-bases.html       # 小知識:茶底
│   ├── toppings.html        # 小知識:配料
│   └── ordering-guide.html  # 小知識:點餐指南
├── data/
│   ├── shops.json       # 飲料店資料與各店推薦飲品(單一資料來源)
│   └── drink-types.json # 飲品類型清單(首頁篩選用)
├── assets/
│   ├── css/style.css    # 唯一樣式表
│   ├── js/main.js       # 唯一腳本(渲染飲料店列表、店家頁與首頁飲品格)
│   └── img/             # 圖片:店家 logo(logo-<shop-id>.png|svg)、配料插圖(topping-<name>.svg)
└── templates/
    └── page.html        # 新頁面的樣板,新增頁面時複製此檔
```

結構以此為準;新增檔案前先確認是否符合上表,不要自創頂層目錄。

### 資料渲染的約定

- 需要資料的容器用 `data-*` 屬性標記,由 `main.js` 填入:`data-menu`(首頁飲品格)、`data-menu-filter`(首頁篩選列)、`data-shop-list`(店家列表)、`data-shop-detail`(店家頁)。
- 店家頁網址格式固定為 `pages/shop.html?id=<shop-id>`,`id` 對應 `shops.json`。
- 每個容器以 `data-base` 指定資料夾的**相對路徑**:根目錄的 `index.html` 用 `data/`,`pages/` 底下的頁面用 `../data/`。
- 動態內容一律用 `textContent` / `createElement` 建立,不使用 `innerHTML` 拼接資料。

## 4. 命名規則

- 檔名:小寫英文、單字以 `-` 連接(`ordering-guide.html`),不使用中文、空白或大寫。
- 圖片:`<類別>-<名稱>.<副檔名>`,類別為 `logo`(店家 logo)或 `topping`(配料插圖),單檔 < 300 KB。
- CSS class:kebab-case,以用途命名(`.card`、`.tag`),不用無意義名稱。
- `shops.json` 的 `id`:品牌英文名或拼音,小寫 kebab-case,全檔唯一(例如 `coco`、`macu-tea`)。

## 5. 頁面規範

每個 `pages/*.html` 必須:

1. 由 `templates/page.html` 複製而來,保留 `<head>` 的 meta、viewport 與 CSS 連結。
2. `<title>` 格式:`<頁面名稱> | 手搖飲筆記`。
3. 結構順序:導覽列 → `<h1>`(整頁唯一)→ 一句話摘要(`.lead`)→ 內容區段(`<h2>` 起)→ 「相關頁面」連結 → 頁尾。
4. 導覽列與頁尾與其他頁面完全相同,導覽項目為:首頁、飲料店、茶底、配料、點餐指南;目前頁面連結加上 `aria-current="page"`。新增頁面時,**同步**更新 `index.html` 卡片與所有頁面導覽列。
5. 圖片一定要有有意義的 `alt`。
6. 使用語意標籤(`<nav>`、`<main>`、`<section>`、`<article>`、`<footer>`)。

## 6. 視覺風格

- 整體氛圍:清爽、溫暖、有手搖飲的輕鬆感,不花俏。
- 色彩(定義為 `style.css` 的 `:root` CSS 變數,不得在其他地方寫死色碼):
  - `--color-bg: #fffaf3`(奶茶米白)
  - `--color-text: #3b2a20`(焦糖咖啡)
  - `--color-primary: #c8793c`(黑糖)
  - `--color-accent: #6fa57a`(綠茶)
  - `--color-card: #ffffff`
- 版面:單欄置中,內容最大寬度 `860px`;卡片圓角 `12px`、淡陰影。
- 字體:`"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif`。
- 必須支援手機寬度(360px 起),不得出現橫向捲軸。
- 不新增樣式表,所有樣式寫在 `assets/css/style.css`。

## 7. 內容與資料格式

### 飲料店資料 (`data/shops.json`)

飲料店列表與首頁一律從此檔與 `drink-types.json` 渲染,**不要把同一筆資料手寫複製到多個頁面**。每筆欄位:

```json
{
  "id": "coco",
  "name": "CoCo都可",
  "founded": 1997,
  "origin": null,
  "story": "2 到 4 句品牌故事,只寫來源明確寫到的內容。",
  "logo": {
    "file": "logo-coco.png",
    "alt": "CoCo都可 logo",
    "source": "https://www.coco-tea.com/"
  },
  "recommended": [
    { "name": "百香雙響炮", "type": "fruit-tea" },
    { "name": "珍珠奶茶", "type": "pearl-milk-tea" }
  ],
  "sources": [
    { "title": "來源名稱", "url": "https://..." }
  ]
}
```

- `name` 使用品牌**現行官方名稱**(例如「迷客夏」,不是「迷客夫」)。
- `founded`(數字)與 `origin`(字串)查不到或各來源不一致時填 `null`,頁面顯示「待查證」。
- `story`:品牌故事(約 2–4 句,繁體中文)。只寫來源**明確寫到**的創辦人、創立經過、名稱由來、里程碑與年份;來源沒寫的就不寫,不推測、不浪漫化。不放門市數量、價格、政治或爭議事件。各來源說法不一致的年份,寧可不寫。
- `recommended` 只收錄來源**明確點名**的飲品(榜單、員工推薦、編輯推薦皆可),不寫排名名次;每個項目的 `type` 必須是 `drink-types.json` 裡存在的 `id`。
- `sources` **至少一筆**;URL 必須是實際讀過、且內容確實支持該筆資料的頁面。來源**只存在資料檔中供查核,不顯示在頁面上**(榜單類來源並非官方排名,維護時要記得)。
- `logo`:店家品牌 logo,沒有時填 `null`,頁面會以店名文字佔位,不得用其他圖片湊數。
- 不收錄門市數量、價格、營養數字:這些變動快、各來源差異大。
- 新增店家時:先查資料 → 確認來源 → 再寫入 JSON;飲料店列表與首頁會自動更新。

### 飲品類型 (`data/drink-types.json`)

```json
{ "id": "pearl-milk-tea", "name": "珍珠奶茶／拿鐵", "description": "一句通則性說明" }
```

- 這是分類清單,不含店家資訊;首頁飲品格由程式從 `shops.json` 的 `recommended` 依名稱整理;店家頁則依類型分組顯示該店的推薦。
- 只放常見、多數人認得的飲品類型;`id` 小寫 kebab-case。
- 新增類型後,要把 `shops.json` 中適合的推薦項目歸入該類型。

### 店家 logo

- 每家店以品牌 logo 作為圖像,**不使用門市照片**;飲品不放圖。(使用者已決定允許使用品牌 logo,僅用於識別該品牌。)
- logo 取自品牌官方網站或 Wikimedia Commons;不得修改、變形或搭配暗示官方合作的文字。
- 檔案放 `assets/img/`,命名 `logo-<shop-id>.png|svg`,單檔 < 300 KB。
- `logo.source` 記錄取得的網址,供日後查核,頁面不顯示。
- 找不到 logo 的店家,可自製簡化的 SVG 示意圖(`logo-<shop-id>.svg`,`alt` 與 `logo.source` 註明「示意圖」「自製」),不得向其他品牌借圖;之後取得官方 logo 時再替換。

### 小知識頁的內容與插圖

- `tea-bases.html`:固定 6 種茶底(紅茶、綠茶、茉莉綠茶、烏龍茶、普洱茶、麥茶),每種標示是否含咖啡因;新增茶底時維持卡片格式。
- `toppings.html`:配料以表格呈現,每列第一欄帶一張 Q 版插圖。
- 配料插圖為**自製 SVG**:64×64 viewBox、圓潤造型、簡單臉孔(眼睛、微笑、腮紅)、無外框描邊以外的細節;檔名 `assets/img/topping-<kebab-name>.svg`(例如 `topping-pearl.svg`),需有 `role="img"` 與 `aria-label`,HTML 的 `alt` 寫「<配料名> Q版插圖」。新增配料時要一併新增插圖。
- 通則性說法(口感、搭配)不得寫成品牌專屬的事實。

### 首頁(點餐畫面)

- `index.html` 的「今天想喝什麼?」區做成像點餐選單:**一款飲品一格**(例如珍珠奶茶、多多綠、百香雙響炮),顯示飲品名稱、類型與推薦它的店家;飲品清單由 `shops.json` 的 `recommended` 依名稱合併而來(同名飲品合併成一格,多家推薦的排前面)。上方有依 `drink-types.json` 產生的類型篩選按鈕,飲品格上的店名連到 `pages/shop.html?id=<shop-id>`。
- 資料由 `drink-types.json` 與 `shops.json` 渲染,不手寫卡片。

### 文字內容

- 事實性內容(年份、歷史、成分)必須有依據;不確定的資訊**寧可省略**,不得編造。
- 小知識頁的通則性說法(如甜度比例)需註明「各店定義不同」。
- 心得類內容需明確標示為「個人心得」,與事實分開。
- 語氣:親切、簡潔,每段不超過 4 句;善用清單與表格。

## 8. AI 工作規則

### 必做

- 動手前先讀本文件與相關既有頁面,風格與既有頁面保持一致。
- **新增飲料店**:依第 7 節只改 `data/shops.json`,不需新增 HTML。
- **新增飲品類型**:只改 `data/drink-types.json`,並調整 `shops.json` 的 `type`。
- **新增小知識頁**的標準流程:
  1. 複製 `templates/page.html` 至 `pages/<kebab-case>.html`
  2. 填入內容並遵守第 5、7 節
  3. 更新 `index.html` 卡片與所有頁面的導覽列
  4. 在 `README.md` 的頁面清單加一行
  5. 以瀏覽器開啟檢查:連結可點、手機寬度無跑版
- 修改資料後,用 `python3 -m json.tool data/shops.json` 確認 JSON 格式正確,並確認每個 `type` 都存在於 `drink-types.json`。
- 修改後說明「改了哪些檔案、為什麼」。

### 禁止

- 禁止引入框架、套件、外部腳本或追蹤碼。
- 禁止在 HTML 寫行內樣式(`style="..."`)與行內事件(`onclick=...`)。
- 禁止捏造品牌資料、年份、價格、營養數字;無法查證就填 `null` 或省略。
- 禁止引用沒讀過的來源;來源網站無法開啟時,不可當作佐證。
- 除第 7 節「店家 logo」允許的品牌 logo 外,禁止使用受版權保護的圖片;其他圖片須為自拍、自製或可商用授權(並標註作者與授權)。
- 禁止對店家做主觀排名或貶低性評論;評價類內容僅限標示為「個人心得」。
- 禁止刪除或改名既有頁面而不更新所有連結。
- 禁止用 `innerHTML` 插入資料內容。
- 未經要求,不重構既有頁面、不更動第 6 節的視覺規範。

### 不確定時

- 規則沒涵蓋的情況:選擇最簡單、與既有頁面最一致的做法,並在回覆中說明所做的假設。
- 需求有重大歧義時才詢問使用者,不要為小事中斷。

## 9. 本機預覽與部署

- 預覽:先 `cd shaken-tea-notes`(必須在專案根目錄),再執行 `python3 -m http.server 8000`,開啟 `http://localhost:8000`。不可直接雙擊開啟 HTML,否則 `fetch` 讀取 JSON 會失敗。
- Repository:`https://github.com/circleO-O/shaken-tea-notes`。
- 部署:push 到 `main`,GitHub Pages 自動發佈(Settings → Pages → Deploy from branch → `main` / root)。

## 10. Git 規範

- Commit 訊息使用英文,描述具體變更(例如 `Add Milksha entry to shops data`),不加 Co-Authored-By 之類的署名行。
- 一個 commit 只做一件事;新增資料與修改樣式分開提交。
- 不要提交 `.DS_Store`、暫存檔、未壓縮的大型圖片。
- 未經使用者要求,不要自行 commit 或 push。
