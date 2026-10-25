# 神話韓語 - 後端與資料庫說明

依 **規格 5. 網站技術架構圖** 架設：

- **應用程式層**：Next.js（React + Next.js）→ 使用 **Next.js API Routes**（`app/api/`）
- **資料層**：**MySQL**
  - 正式環境：Linode Managed DB
  - 開發環境：MySQL（XAMPP 本機）

---

## 1. 技術棧

| 項目     | 說明 |
|----------|------|
| ORM      | Prisma |
| 資料庫   | MySQL |
| 密碼雜湊 | bcryptjs |
| API      | Next.js App Router `app/api/*/route.js` |

---

## 2. 環境設定

1. 複製環境變數範例：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env`，設定 **DATABASE_URL** 與 **ADMIN_SESSION_SECRET**（至少 32 位隨機字元）：
   - **XAMPP 本機**（預設 root、無密碼、port 3306）：
     ```
     DATABASE_URL="mysql://root:@localhost:3306/shenhua_korean"
     ```
   - 若 MySQL 有設密碼：
     ```
     DATABASE_URL="mysql://root:你的密碼@localhost:3306/shenhua_korean"
     ```
   - **正式環境**（Linode Managed MySQL）：向主機商取得連線字串後填入。

3. 在 MySQL 建立資料庫（本機 XAMPP 範例）：
   ```sql
   CREATE DATABASE shenhua_korean CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

## 3. 安裝依賴與 Prisma

```bash
npm install
npm run db:generate
```

---

## 4. 資料庫結構（建立表）

**開發環境**（不產生 migration 檔，直接同步 schema）：

```bash
npm run db:push
```

**或使用 migration（建議正式環境）**：

```bash
npm run db:migrate
```

依提示輸入 migration 名稱（例如 `init`）。

---

## 5. 種子資料與後台登入

建立「零基礎韓語入門」課程與正式 Unit 1 單元（可重複執行）：

```bash
npm run db:seed:test-course
```

內容來源是 `data/test-course.json`；課程詳情頁也使用這份資料，因此 GitHub Pages 的靜態版本可以預覽相同章節。

將正式 Google Sheet 的 Unit 1 題庫（12 題）匯入 MySQL；題目來源 ID 可讓匯入重複執行：

```bash
npm run db:seed:official-quiz
```

每堂課題庫沒有題數上限。登入會員可在 `/member/quiz/` 從已購買課程的單元題庫隨機抽取不重複的 10 題作答；題庫不足 10 題時不能開始。標記「提供試聽」且已上架的課程開放會員試作。交卷後由伺服器計分並將成績存入 `QuizAttempt`。

首次建立後台管理員（輸出一次性的隨機密碼；若已存在則不更改密碼）：

```bash
npm run db:seed:admin
```

可在執行前設定 `ADMIN_SEED_EMAIL`、`ADMIN_SEED_PASSWORD` 自訂首次帳密。啟動 `npm run dev` 後，到 `/admin/login/` 登入，再到 `/admin/courses/` 新增、編輯或刪除課程。課程編輯器可新增章節與四選一題庫、正確答案及解析；一次儲存到 MySQL。刪除課程也會刪除它的章節與題目。

寫入後台管理者、範例會員、課程、文章、學員見證等：

```bash
npm run db:seed
```

這個完整範例種子也會建立後台管理員；首次建立時會在終端顯示隨機密碼，不再使用固定示範密碼。

---

## 6. API 一覽

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/auth/login` | 會員登入 |
| POST | `/api/auth/register` | 會員註冊 |
| POST | `/api/auth/session` | 檢查或登出會員工作階段 |
| POST | `/api/member/quiz` | 小考單元列表、隨機出題、交卷與成績紀錄（需登入） |
| POST | `/api/admin/login` | 後台登入（設定 HttpOnly Cookie） |
| POST | `/api/admin/session` | 檢查或登出後台工作階段 |
| POST | `/api/admin/courses` | 後台課程、章節及題目的列表、讀取、儲存、刪除（需登入） |
| GET  | `/api/courses` | 課程列表（上架） |
| GET  | `/api/courses/[id]` | 課程詳情 |
| GET  | `/api/articles` | 文章列表 |
| GET  | `/api/articles/[id]` | 文章詳情 |
| GET  | `/api/testimonials` | 學員見證列表 |
| GET  | `/api/testimonials/[id]` | 單一見證 |
| GET  | `/api/instructors` | 師資列表 |
| GET  | `/api/instructors/[id]` | 師資詳情 |
| GET  | `/api/admin/orders` | 訂單列表（需後台 token） |
| GET  | `/api/admin/members` | 會員列表（需後台 token） |

新課程管理 API 使用已登入的 HttpOnly Cookie。上表其餘舊 API 尚未全部改用此工作階段；勿將它們視為已完成的後台功能。

**部署限制**：目前 `next.config.js` 使用靜態匯出，GitHub Pages 不執行 API Routes，也不能直接連 MySQL。後台與學員小考僅能在本機 `next dev` 或未來的 Next.js 伺服器環境運作；要正式上線，需部署可執行 Node.js/API 的環境並設定資料庫連線和密鑰。公開課程頁目前仍使用靜態資料，不會因後台修改 MySQL 而立即更新；付款流程尚未串接，因此正式購課權限仍待金流整合。

---

## 7. Prisma Studio（檢視/除錯用）

```bash
npm run db:studio
```

瀏覽器會開啟 Prisma Studio，可查看與手動編輯資料表。

---

## 8. 後續可擴充

- **金流**：藍新/綠界 Webhook 接收單次購課付款結果，更新 `Order`
- **影片**：課程章節的 `muxPlaybackId` 由 Mux 取得後寫入
- **檔案**：課程封面、文章圖片可上傳至 Linode Object Storage，網址存進對應欄位
- **通知**：SendGrid / Mailgun / SES 發送忘記密碼、交易通知
