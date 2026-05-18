import Link from 'next/link';
import BirthdayInput from '../../components/BirthdayInput';
import MotivationField from '../../components/MotivationField';

export const metadata = { title: '會員註冊 - 神話韓語' };

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

export default function RegisterPage() {
  return (
    <main className="page-main">
      <section className="section auth-section">
        <div className="container container--narrow">
          <h1 className="page-title">會員註冊</h1>
          <p className="auth-form__desc">只有4 項必填，快加入我們。</p>
          <form className="auth-form" action="#" method="post">
            <div className="form-group">
              <label htmlFor="reg-name">姓名 <RequiredStar /> <span className="label-hint">請填寫真實姓名</span></label>
              <input id="reg-name" type="text" name="name" required placeholder="例：韓小龍" />
            </div>
            <fieldset className="form-fieldset">
              <legend>性別</legend>
              <label><input type="radio" name="gender" value="male" /> 男性</label>
              <label><input type="radio" name="gender" value="female" /> 女性</label>
            </fieldset>
            <div className="form-group">
              <label htmlFor="reg-birthday">生日</label>
              <BirthdayInput />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">電子信箱（email） <RequiredStar /></label>
              <input id="reg-email" type="email" name="email" required placeholder="例：oppa@gmail.com" />
            </div>
            <div className="form-group">
              <label htmlFor="reg-phone">電話 <RequiredStar /></label>
              <input id="reg-phone" type="tel" name="phone" required placeholder="例：0989123456" />
            </div>
            <fieldset className="form-fieldset">
              <legend>地址</legend>
              <label><input type="radio" name="addressRegion" value="taiwan" /> 台灣</label>
              <input type="text" name="taiwanAddress" placeholder="例：臺北市中正區神話路一段1號1樓" />
              <label><input type="radio" name="addressRegion" value="overseas" /> 海外</label>
              <input type="text" name="overseasAddress" placeholder="請填寫海外地址" />
            </fieldset>
            <div className="form-group">
              <label htmlFor="reg-password">密碼 <RequiredStar /></label>
              <input id="reg-password" type="password" name="password" required placeholder="建議 8 碼以上，包含大小寫和數字" />
            </div>
            <MotivationField />
            <button type="submit" className="btn btn-primary btn--block">註冊</button>
            <p className="auth-form__note">已經有帳號？<Link href="/login">前往登入</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}
