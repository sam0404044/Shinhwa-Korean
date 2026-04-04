export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-top">
          <div className="footer-links">
            <a href="#" className="social-link" aria-label="Facebook">Facebook</a>
            <a href="#" className="social-link" aria-label="Instagram">Instagram</a>
          </div>
          <button type="button" className="footer-legal-btn" data-modal="legal">
            服務使用條款及隱私權聲明
          </button>
        </div>
        <div className="footer-info">
          <p>@colajp.com</p>
          <p>地址：813高雄市左營區至聖路63號</p>
          <p>電話：075507717</p>
          <p>（待確認）股份有限公司 附設神話韓語補習班</p>
        </div>
      </div>
    </footer>
  );
}
