export const metadata = { title: '點我洽詢 - 神話韓語' };

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

export default function ContactPage() {
  return (
    <main className="page-main">
      <section className="section section--pastel">
        <div className="container container--narrow">
          <h1 className="page-title section-title--green">點我洽詢</h1>
          <p className="auth-form__desc">
            如果您有任何課程、試聽、合作或其他問題，歡迎留下資料，我們會盡快與您聯繫。
          </p>
          <form className="auth-form contact-form" action="#" method="post">
            <section className="form-note-block">
              <h2>貼心交流</h2>
              <p>我們優先用電子信箱（email）回覆；您的電子信箱可能將我們的回信判讀為促銷或垃圾郵件，所以除了主要郵件，也請檢視其他郵件。感謝。</p>
            </section>
            <div className="form-group">
              <label htmlFor="contact-name">姓名 <RequiredStar /></label>
              <input id="contact-name" name="name" type="text" required placeholder="例：韓小龍" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">電子信箱（email） <RequiredStar /></label>
              <input id="contact-email" name="email" type="email" required placeholder="例：oppa@gmail.com" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-phone">電話</label>
              <input id="contact-phone" name="phone" type="tel" placeholder="例：0989123456" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-category">洽詢類別 <RequiredStar /></label>
              <select id="contact-category" name="category" required defaultValue="">
                <option value="" disabled>請選擇</option>
                <option value="course">課程相關問題</option>
                <option value="feedback">意見回饋</option>
                <option value="cooperation">合作邀約</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">內容 <RequiredStar /></label>
              <textarea id="contact-message" name="message" required rows={6} />
            </div>
            <div className="form-group">
              <label htmlFor="contact-captcha">驗證碼 <RequiredStar /></label>
              <div className="captcha-row">
                <strong className="captcha-code">59420</strong>
                <input id="contact-captcha" name="captcha" type="text" required placeholder="請輸入驗證碼" />
              </div>
              <button type="button" className="text-button">重新產生驗證碼</button>
            </div>
            <label className="checkbox-row">
              <input type="checkbox" name="agree" required />
              <span>我同意送出上述資料供神話韓語聯繫使用 <RequiredStar /></span>
            </label>
            <button type="submit" className="btn btn-primary btn--block">送出洽詢</button>
          </form>
        </div>
      </section>
    </main>
  );
}
