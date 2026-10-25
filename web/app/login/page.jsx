import Link from 'next/link';
import LoginForm from '../../components/LoginForm';

export const metadata = {
  title: '會員登入 - 神話韓語',
};

export default function LoginPage() {
  return (
    <main className="page-main">
      <section className="section auth-section">
        <div className="container container--narrow">
          <h1 className="page-title">會員登入</h1>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
