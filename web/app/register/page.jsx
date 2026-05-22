import RegisterForm from '../../components/RegisterForm';

export const metadata = { title: '建立新帳號 - 神話韓語' };

export default function RegisterPage() {
  return (
    <main className="page-main">
      <section className="section auth-section">
        <div className="container container--narrow">
          <h1 className="page-title">建立新帳號</h1>
          <p className="auth-form__desc">只有4項必填，快加入我們。</p>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
