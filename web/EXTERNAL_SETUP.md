# 正式串接前的外部帳號準備

本專案已完成可自行部署的 MySQL、會員、訂單、資料庫內容管理與本機持久圖片上傳。下列服務須由業主建立帳號、簽約或提供金鑰後才能啟用。

## 1. 網域與 HTTPS

1. 購買網域。
2. 在 DNS 新增 A 紀錄到目前伺服器的 IPv4 位址。
3. 網域解析完成後，以 Caddy 或 Nginx + Let's Encrypt 設定 HTTPS。
4. 將 `COOKIE_SECURE` 改為 `true`，重新部署。

## 2. 金流

1. 選定藍新金流或綠界並以公司資料申請正式商店帳號。
2. 提供正式環境 Merchant ID、Hash Key、Hash IV，以及付款通知／回傳網址的規格。
3. 金流平台後台設定 HTTPS 網址的付款通知 Webhook。專案收到成功通知後才會把訂單設為 `paid`，並開通會員課程。

## 3. Google、Facebook、LINE 登入

1. Google Cloud Console：建立 OAuth 同意畫面與 Web client。
2. Meta for Developers：建立 App 並啟用 Facebook Login。
3. LINE Developers：建立 Login Channel。
4. 三個平台都需填入正式 HTTPS Callback URL；建立後提供 Client ID / Secret，不要傳到 Git 或公開聊天紀錄。

## 4. Mux 影音

1. 建立 Mux 組織與 Project，開通計費。
2. 建立權限最小化的 API Token，取得 `MUX_TOKEN_ID` 與 `MUX_TOKEN_SECRET`。
3. 填入伺服器 `.env` 後重新部署。課程章節目前已保留 `Mux Playback ID` 欄位；在完整直傳流程啟用前，可先於 Mux 上傳影片後把 Playback ID 貼入後台。
4. 若需限制只有已購課會員可看，另建立 Mux Signing Key，播放端使用 signed playback token。

## 5. 圖片與備份

目前後台課程、文章、師資與學員見證都可上傳 JPG、PNG、WebP，存放在 Docker named volume `uploads_data`，資料庫只保存圖片網址。這不需要第三方帳號。

正式營運建議建立每日資料庫備份及 uploads volume 備份；圖片量或流量增加後，再遷移到 Linode Object Storage、Cloudflare R2 或 S3。
