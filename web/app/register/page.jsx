import Link from 'next/link';

export const metadata = { title: '會員註冊 - 神話韓語' };

const years = Array.from({ length: 88 }, (_, index) => 1940 + index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);

export default function RegisterPage() {
  return (
    <main className="page-main">
      <section className="section auth-section">
        <div className="container container--narrow">
          <h1 className="page-title">建立新帳號</h1>
          <p className="auth-form__desc">有 4 項必填，快加入我們。</p>
          <form className="auth-form" action="#" method="post">
            <div className="form-group">
              <label htmlFor="reg-name">姓名（必填，請填寫真實姓名）</label>
              <input id="reg-name" type="text" name="name" required placeholder="例：韓小龍" />
            </div>
            <fieldset className="form-fieldset">
              <legend>性別</legend>
              <label><input type="radio" name="gender" value="male" /> 男性</label>
              <label><input type="radio" name="gender" value="female" /> 女性</label>
            </fieldset>
            <div className="form-group">
              <label>生日</label>
              <div className="form-inline-grid">
                <select name="birthYear" defaultValue="">
                  <option value="" disabled>請選擇年</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
                <select name="birthMonth" defaultValue="">
                  <option value="" disabled>請選擇月</option>
                  {months.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
                <select name="birthDay" defaultValue="">
                  <option value="" disabled>請選擇日</option>
                  {days.map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">電子信箱（email）（必填）</label>
              <input id="reg-email" type="email" name="email" required placeholder="例：oppa@gmail.com" />
            </div>
            <div className="form-group">
              <label htmlFor="reg-phone">電話（必填）</label>
              <input id="reg-phone" type="tel" name="phone" required placeholder="例：0989123456" />
            </div>
            <fieldset className="form-fieldset">
              <legend>地址</legend>
              <label><input type="radio" name="addressRegion" value="taiwan" /> 臺灣</label>
              <input type="text" name="taiwanAddress" placeholder="例：臺北市中正區神話路一段 1 號 1 樓" />
              <label><input type="radio" name="addressRegion" value="overseas" /> 海外</label>
              <input type="text" name="overseasAddress" placeholder="請填寫海外地址" />
            </fieldset>
            <div className="form-group">
              <label htmlFor="reg-password">密碼（必填）</label>
              <input id="reg-password" type="password" name="password" required placeholder="建議 8 碼以上，包含大小寫和數字" />
            </div>
            <div className="form-group">
              <label htmlFor="reg-motivation">學韓語的最大動機</label>
              <select id="reg-motivation" name="motivation" defaultValue="">
                <option value="" disabled>請選擇</option>
                <option value="interest">興趣、進修</option>
                <option value="fan">追星、追劇</option>
                <option value="travel">觀光、旅遊</option>
                <option value="career">考試、工作或求學</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reg-motivation-other">其他</label>
              <textarea id="reg-motivation-other" name="motivationOther" rows={4} placeholder="例：退休後旅居世界各地，正在學多種語言" />
            </div>
            <button type="submit" className="btn btn-primary btn--block">註冊</button>
            <p className="auth-form__note">已有帳號？<Link href="/login">立即登入</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}
