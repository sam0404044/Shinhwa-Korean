import Link from 'next/link';

export const metadata = { title: '忘記密碼 - 神話韓語' };

function RequiredStar() {
  return <span className="required-star" aria-label="必填">*</span>;
}

export default function ForgotPasswordPage() {
  return (
    <main className="page-main">
      <section className="section auth-section">
        <div className="container container--narrow">
          <h1 className="page-title">忘記密碼</h1>
          <p className="auth-form__desc">輸入註冊時使用的 Email，我們將寄送重設密碼連結。</p>
          <form className="auth-form" action="#" method="post">
            <div className="form-group">
              <label>Email <RequiredStar /></label>
              <input type="email" name="email" required placeholder="請輸入 Email" />
            </div>
            <button type="submit" className="btn btn-primary btn--block">寄送重設連結</button>
            <p className="auth-form__note"><Link href="/login">返回登入</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}
