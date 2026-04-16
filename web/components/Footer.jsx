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
          <p>電子信箱：待確認</p>
          <p>地址：高雄市左營區至聖路 63 號</p>
          <p>神話韓語興業有限公司（統一編號：12345678）</p>
          <p>附設神話韓語短期補習班（電話：07-5507717）</p>
        </div>
      </div>
    </footer>
  );
}
