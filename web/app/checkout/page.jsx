import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMember } from '../../lib/member-session';
import { isTestCheckout } from '../../lib/payment-mode';
import { Suspense } from 'react';
import CheckoutForm from '../../components/CheckoutForm';

export const metadata = {
  title: '結帳 - 神話韓語',
};

export const dynamic = 'force-dynamic';
export default async function CheckoutPage({ searchParams }) {
  const member = await getMember({ cookies: cookies() });
  if (!member) {
    const destination = searchParams?.course ? `/checkout?course=${encodeURIComponent(searchParams.course)}` : '/checkout';
    redirect(`/login?next=${encodeURIComponent(destination)}`);
  }
  const testMode = isTestCheckout();
  return (
    <main className="page-main">
      <section className="section">
        <div className="container container--narrow">
          <h1 className="page-title">結帳</h1>
          <p className="checkout-hint">{testMode ? '測試結帳，不會實際扣款。確認後將建立訂單並開通課程。' : '完成付款後才會開通課程權限。'}</p>
          <Suspense fallback={<p className="checkout-hint">載入結帳內容…</p>}>
            <CheckoutForm testMode={testMode} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
