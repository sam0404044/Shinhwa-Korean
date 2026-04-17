import Link from 'next/link';

export const metadata = { title: '重設密碼 - 神話韓語' };

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

export default function ResetPasswordPage() {
  return (
    <main className="page-main">
      <section className="section auth-section">
        <div className="container container--narrow">
          <h1 className="page-title">重設密碼</h1>
          <form className="auth-form" action="#" method="post">
            <div className="form-group">
              <label>新密碼 <RequiredStar /></label>
              <input type="password" name="password" required placeholder="請輸入新密碼" />
            </div>
            <div className="form-group">
              <label>確認新密碼 <RequiredStar /></label>
              <input type="password" name="password2" required placeholder="再輸入一次" />
            </div>
            <button type="submit" className="btn btn-primary btn--block">重設密碼</button>
            <p className="auth-form__note"><Link href="/login">返回登入</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}
