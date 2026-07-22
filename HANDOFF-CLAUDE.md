# 交班文件：樂智康疼痛自我評估系統 — 安裝指南（給 Claude）

**交班對象**：Claude（負責 Zenbu 網站建置）
**交班日期**：2026-07-18
**交班來源**：Manus（模擬建站已完成並通過驗證）

---

## 1. 你的任務

將本交班包內的「疼痛自我評估系統」部署到 Zenbu 網站，**取代現有的 /pain 頁面**：

- **目標網址**：`/pain`（同站相對路徑）
- **衛教文章位置**（系統會連向這裡）：`/blog/{slug}`（同站相對路徑）

這是一個純前端（無後端、無資料庫）的互動式評估工具。使用者點選人體圖上的疼痛部位 → 通過紅旗症狀安全篩查 → 回答症狀問題 → 獲得「最可能的問題」評估結果 → 導向對應的衛教文章與 LINE 預約。

## 2. 系統是什麼（功能總覽）

| 模組 | 說明 |
|------|------|
| 互動人體圖 | 正面/背面切換，全身 16 個可點選熱區（骨科 6 大區 + 頭臉/胸/腹非骨科引導區），hover 時顯示像素級貼合的高亮遮罩 |
| 紅旗篩查 | 點選部位後先進行 6 項危險症狀篩查，命中任一項即中止評估並引導立即就醫 |
| 決策樹問答 | 每個部位 3-6 題症狀問題，共通往 41 個疾病終點 |
| 評估結果頁 | 顯示最可能的診斷、白話說明、衛教文章 CTA、LINE 預約 CTA、同部位其他可能疾病的交叉導流、免責聲明 |
| 非骨科引導 | 頭臉/胸/腹部點選後不進入問答，直接顯示就醫科別指引（含急症警語） |

## 3. 交班包內容

```
claude-package/
├── HANDOFF-CLAUDE.md      ← 本文件
├── slug-mapping.csv       ← 41 個疾病終點的 slug 對照表（文章網址的權威來源）
├── assets/                ← 20 個圖檔（2 張人體底圖 + 16 張部位遮罩 + 1 張 logo + 1 個 favicon SVG）
├── dist-site/             ← 方案 B：已建置完成的靜態網站（可直接部署）
└── source/                ← 方案 A：完整 React 原始碼
```

## 4. 安裝方案（二選一）

先判斷 Zenbu 網站的技術架構，再選擇方案。

### 方案 A：React 原始碼整合（若 Zenbu 站本身是 React / Next.js / Vite 專案）

`source/` 是完整的 Vite + React 19 + TypeScript + Tailwind CSS 4 專案。

1. 安裝依賴並確認可運行：`pnpm install && pnpm dev`（入口 `client/src/main.tsx`，主頁面 `client/src/pages/Home.tsx`）。
2. 核心檔案只有三個，可整包搬移到既有專案：
   - `client/src/pages/Home.tsx` — 整個評估流程的頁面（landing、紅旗篩查、問答、結果頁）
   - `client/src/components/BodyMap.tsx` — 互動人體圖元件
   - `client/src/lib/decisionTree.ts` — 決策樹資料（部位、問題、41 個結果、slug、LINE utm）
3. 樣式依賴 Tailwind 與 Google Fonts（`Noto Sans TC` 700/900、`Montserrat`），請確認 `client/index.html` 內的字型引入有帶到目標專案。
4. 將路由掛在 `/pain`。

### 方案 B：靜態建置產物直接部署（通用，適合任何平台）

`dist-site/` 是已建置、驗證過的純靜態網站（HTML + JS + CSS + 圖片），無任何伺服器需求。

1. 將 `dist-site/` 全部內容部署到 `/pain` 路徑下（或子網域）。
2. 圖片已內含於 `dist-site/assets/pain/`，路徑為根目錄相對路徑 `/assets/pain/*.png`。**若系統不是部署在網域根目錄**（例如部署在 `/pain/` 子路徑），需要把 JS 內的 `/assets/pain/` 路徑改為實際可訪問的絕對路徑，或設定伺服器 rewrite。
3. 若 Zenbu 是頁面編輯器型平台無法部署整站，可改用 iframe 嵌入：把 `dist-site/` 部署到任一靜態空間後，在 /pain 頁面嵌入 `<iframe src="..." style="width:100%;min-height:100vh;border:0">`。

### 圖片資產設定（兩個方案都要做）

20 個圖檔在 `assets/` 資料夾（檔名不含 hash）。上傳到 Zenbu 可訪問的圖片空間後：

- **方案 A**：修改 `client/src/components/BodyMap.tsx` 頂部的 `ASSET_BASE` 常數（預設 `"/assets/pain"`）、`client/src/pages/Home.tsx` 的 `LOGO` 常數，以及 `client/index.html` 的 favicon 路徑。已在程式碼中以 `★ 交班設定` 註解標明。
- 補充：`source/vite.config.ts` 內有一段 `manus-storage-proxy` 開發用 middleware，部署後不會生效，可放心忽略或刪除。
- **方案 B**：若维持 `dist-site/assets/pain/` 的目錄結構原样部署，不需要改任何東西。

## 5. 兩個關鍵常數（`source/client/src/lib/decisionTree.ts` 頂部）

```ts
export const BLOG_BASE = "/blog";
export const LINE_BASE =
  "https://line.me/R/ti/p/@wjs1014p?utm_source=new_site&utm_medium=pain&utm_campaign=";
```

- `BLOG_BASE`：衛教文章網址前綴。結果頁的文章連結 = `BLOG_BASE + "/" + slug`。**已對準正式站，若網域改變才需要修改。**
- `LINE_BASE`：LINE 預約連結前綴，每個部位帶不同的 `utm_campaign`（見 slug-mapping.csv 的 `line_campaign` 欄），用於追蹤各部位的轉換來源。**請勿更動 utm 架構**，這與站上其他頁面的追蹤體系一致。

## 6. 衛教文章的開通機制（最重要的維運工作）

系統交付時，**41 個疾病終點全部處於「文章即將上線」狀態**（`hasArticle: false`）。這是刻意的：blog 目前是空的，此設定保證上線第一天零死連結，結果頁會以 LINE 預約 CTA 作為主要轉換出口。

之後院方每發布一篇衛教文章到 `blog/{slug}`，你只需要做一件事：

1. 打開 `client/src/lib/decisionTree.ts`
2. 搜尋該文章的 slug（例如 `slug: "frozen-shoulder"`）
3. 把同一個結果物件中的 `hasArticle: false` 改為 `hasArticle: true`
4. 重新建置部署

改為 `true` 後，結果頁會自動出現「深入了解」文章卡片（連向 `BLOG_BASE/{slug}`），同部位交叉導流區的該疾病也會變成可點擊連結。

> **發文規則（請轉知院方遵守）**：文章網址必須完全等於 `blog/{slug}`，slug 以 `slug-mapping.csv` 為準，全小寫、連字號分隔，不可改動，否則連結會失效。

## 7. 驗收清單

部署完成後請逐項確認：

1. `/pain` 頁面載入正常，人體圖正面/背面切換順暢，hover 各部位有 teal 色高亮且邊界貼合身體輪廓（20 個圖檔皆載入成功，無 404）。
2. 點選「肩頸肩膀」→ 紅旗篩查全部選「沒有」→ 回答問題 → 到達結果頁，LINE 按鈕連結包含 `utm_campaign=pain-shoulder-neck`。
3. 紅旗篩查任選一項「有」→ 顯示緊急就醫引導（LINE campaign 為 `pain-redflag`）。
4. 點選「胸部」（非骨科區）→ 顯示就醫科別指引，不進入問答。
5. 結果頁顯示「文章即將上線」灰色卡（因為目前全部 `hasArticle: false`）。
6. 手機viewport（375px 寬）版面正常，人體圖可點選。
7. 任選一個 slug 將 `hasArticle` 改為 `true` 重新建置，確認結果頁出現文章連結卡且指向 `BLOG_BASE/{slug}`，確認後改回 `false`。

## 8. 技術規格摘要

| 項目 | 內容 |
|------|------|
| 框架 | Vite 7 + React 19 + TypeScript + Tailwind CSS 4 + wouter |
| 後端需求 | 無（純靜態，無 API、無資料庫、無環境變數） |
| 字型 | Noto Sans TC（700/900）、Montserrat，經 Google Fonts CDN |
| 品牌色 | 主色 teal `#009B8D`、深色 `#1F2D2A`、文字 `#4A4A4A` |
| 圖片 | 人體底圖 1440×1920 RGB、遮罩 816×1088 RGBA（與 SVG viewBox 816×1088 對齊） |
| 檢查指令 | `pnpm check`（tsc --noEmit，交付時零錯誤） |

## 9. 未來的第二批工作（預告）

院方之後會用另一個「文章上架交班包」給你 41 篇衛教文章（Markdown + HTML + Schema JSON-LD + 圖片 + metadata.json 的標準格式），屆時的工作是：把文章上架到 `blog/{slug}`，然後依本文件第 6 節逐篇開通 `hasArticle`。格式細節屆時見該包的 `UPLOAD-GUIDE-CLAUDE.md`。
