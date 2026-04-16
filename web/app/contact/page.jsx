export const metadata = { title: '點我洽詢 - 神話韓語' };

export default function ContactPage() {
  return (
    <main className="page-main">
      <section className="section section--pastel">
        <div className="container container--narrow">
          <h1 className="page-title section-title--green">點我洽詢</h1>
          <p className="auth-form__desc">
            親愛的朋友，안녕하세요（an-nyeong-ha-se-yo，您好）～
            如果您有任何問題，請填寫以下訊息，我們將在收到訊息後盡速與您聯繫。感謝。
          </p>
          <form className="auth-form contact-form" action="#" method="post">
            <section className="form-note-block">
              <h2>貼心交流</h2>
              <p>我們優先用電子信箱（email）回覆；您的電子信箱可能將我們的回信判讀為促銷或垃圾郵件，所以除了主要郵件，也請檢視其他郵件。感謝。</p>
            </section>
            <div className="form-group">
              <label htmlFor="contact-name">姓名（必填）</label>
              <input id="contact-name" name="name" type="text" required placeholder="例：韓小龍" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">電子信箱（email）（必填）</label>
              <input id="contact-email" name="email" type="email" required placeholder="例：oppa@gmail.com" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-phone">電話</label>
              <input id="contact-phone" name="phone" type="tel" placeholder="例：0989123456" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-category">洽詢類別（必填）</label>
              <select id="contact-category" name="category" required defaultValue="">
                <option value="" disabled>請選擇</option>
                <option value="course">課程或教材問題</option>
                <option value="feedback">意見或建議事項</option>
                <option value="cooperation">合作或活動邀約</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">內容（必填）</label>
              <textarea id="contact-message" name="message" required rows={6} />
            </div>
            <div className="form-group">
              <label htmlFor="contact-captcha">驗證碼（必填）</label>
              <div className="captcha-row">
                <strong className="captcha-code">59420</strong>
                <input id="contact-captcha" name="captcha" type="text" required placeholder="請輸入驗證碼" />
              </div>
              <button type="button" className="text-button">看不清楚驗證碼，換一個</button>
            </div>
            <label className="checkbox-row">
              <input type="checkbox" name="agree" required />
              <span>了解且同意服務使用條款與個人訊息處理之規範。</span>
            </label>
            <button type="submit" className="btn btn-primary btn--block">送出洽詢</button>
          </form>
        </div>
      </section>
    </main>
  );
}
