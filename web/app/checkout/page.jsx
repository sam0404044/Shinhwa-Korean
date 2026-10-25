import { Suspense } from 'react';
import CheckoutForm from '../../components/CheckoutForm';

export const metadata = {
  title: '結帳 - 神話韓語',
};

export default function CheckoutPage() {
  return (
    <main className="page-main">
      <section className="section">
        <div className="container container--narrow">
          <h1 className="page-title">結帳</h1>
          <p className="checkout-hint">確認送出後即完成購買，課程權限會立即開通。</p>
          <Suspense fallback={<p className="checkout-hint">載入結帳內容…</p>}>
            <CheckoutForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
