# 上線前資安檢查清單

## 已確認

- MySQL 沒有透過 Compose `ports` 對外發布，只能由 Docker 內部網路的網站服務連線。
- `.env` 已被 Git 忽略，不會隨 Git push 上傳。
- SSH 已使用金鑰登入，並已停用 root 與 SSH 密碼登入。
- 後台登入 Cookie 是 `HttpOnly`、`SameSite=Strict`，而且有八小時有效期限。
- 圖片上傳僅允許 JPG、PNG、WebP、上限 5 MB，並檢查實際檔案標頭。

## 上線前必做

1. 購買網域並完成 HTTPS。完成後把伺服器 `.env` 的 `COOKIE_SECURE=true`，再重新部署。HTTP 期間不要讓正式會員或管理員使用真實密碼登入。
2. 立即輪替曾出現在截圖或聊天紀錄的後台、MySQL、Session Secret 密碼。
3. 確認 `.env` 只屬於部署帳號且不可被其他使用者讀取：`chmod 600 .env`。
4. 確認 Linode Firewall 只開放 TCP 22、80；HTTPS 完成後再開 TCP 443。資料庫 3306 不應開放。

## 建議近期完成

- 為 SSH 加裝 fail2ban。因為手機網路 IP 會變動，暫時保留 SSH 對 IPv4 開放較實際，但應由 fail2ban 降低暴力嘗試風險。
- 檢查自動安全更新：`systemctl status unattended-upgrades`。
- 每日備份 MySQL 與 `uploads_data` Docker volume，並將備份放在不同於這台主機的位置。
- 準備金流、OAuth、Mux 金鑰後，放入伺服器 `.env`，不要貼入 Git、圖片或聊天紀錄。
- 將後台登入與付款通知加上 reverse proxy rate limit；這需要 HTTPS 網域完成後一起設定。

## MySQL 密碼處理原則

- `MYSQL_ROOT_PASSWORD` 只給 MySQL 容器管理用，絕不放在網站程式碼或前台環境。
- `MYSQL_PASSWORD` 是網站服務的資料庫帳密；目前只在 Docker 內部網路使用。
- 先用 `sudo docker compose exec db mysql -uroot -p` 連進資料庫，查看帳號主機範圍後才輪替密碼；不要直接猜測 MySQL 使用者設定。
- MySQL 官方建議採最小權限，且不得讓非管理帳號讀寫 `mysql` 系統資料庫。
