# 手搖飲筆記 (Shaken Tea Notes)

介紹台灣各家手搖飲料店的靜態知識網站:首頁是「點餐畫面」,一款飲品一格,標示哪些店推薦;另有飲料店列表,並附茶底、配料與點餐小知識。

本專案依照 [CLAUDE.md](CLAUDE.md) 的規則建立,目的是讓 AI 讀完規則後,能用同一套方式持續新增店家與頁面。

- GitHub Repository:(待補)
- 網頁連結:(待補)

## 頁面清單

| 頁面 | 說明 |
|---|---|
| `index.html` | 首頁:點餐畫面,一款飲品一格,可依類型篩選 |
| `pages/shops.html` | 飲料店列表:每家店一張卡片,點進去看店家頁 |
| `pages/shop.html?id=<shop-id>` | 單一店家頁:logo、創立年份、起源地、品牌故事、推薦飲品 |
| `pages/tea-bases.html` | 小知識:6 種常見茶底 |
| `pages/toppings.html` | 小知識:配料(附 Q 版插圖) |
| `pages/ordering-guide.html` | 小知識:點餐指南 |

## 資料

- `data/shops.json`:店家資料、品牌 logo 與各店推薦飲品(單一資料來源,資料依據的來源連結也記錄在內)。
- `data/drink-types.json`:飲品類型清單,用於首頁篩選。

目前收錄:清心福全、50嵐、可不可熟成紅茶、迷客夏、CoCo都可、麻古茶坊。

資料說明:

- 推薦飲品多來自媒體榜單、網友與員工推薦,**並非官方排名**。
- 來源未明確提及的欄位顯示「待查證」,不做推測。
- 品牌故事只寫來源明確提到的內容,不推測。
- 不收錄門市數量、價格與營養數字。

logo:

- 飲料店列表以各品牌 logo 作為圖像,僅用於識別品牌。
- 清心福全、可不可、CoCo都可、麻古茶坊已有 logo;50嵐與迷客夏為自製的 SVG 示意圖,非官方 logo。

## 專案結構

```
shaken-tea-notes/
├── CLAUDE.md          # AI 的專案規則
├── README.md
├── index.html
├── pages/             # shops、shop、tea-bases、toppings、ordering-guide
├── data/              # shops.json、drink-types.json
├── assets/            # css/style.css、js/main.js、img/(店家 logo)
└── templates/page.html
```

純 HTML + CSS + 原生 JavaScript,不使用框架或建置工具,部署於 GitHub Pages。

## 本機預覽

先進入專案資料夾,再啟動伺服器(不能直接雙擊 HTML,否則讀不到 JSON):

```
cd shaken-tea-notes
python3 -m http.server 8000
```

開啟 http://localhost:8000

## 如何新增內容

- **新增飲料店**:只需在 `data/shops.json` 加一筆資料(欄位與來源規則見 `CLAUDE.md` 第 7 節),不必改 HTML,首頁與飲料店列表會自動更新。
- **新增店家 logo**:放到 `assets/img/logo-<shop-id>.png|svg`,並填寫 `shops.json` 的 `logo` 欄位。
- **新增飲品類型**:在 `data/drink-types.json` 加一筆,並把 `shops.json` 中適合的推薦飲品歸入該類型。
- **新增小知識頁**:依 `CLAUDE.md` 第 8 節的標準流程,從 `templates/page.html` 複製,並更新導覽列與首頁。

### 給 AI 的指令範例

- 「新增一間飲料店:五桐號,請先查證資料並附來源。」
- 「新增一個小知識頁:熱量與咖啡因參考。」
