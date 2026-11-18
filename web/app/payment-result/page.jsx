import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMember } from '../../lib/member-session';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';
export const metadata = { title: '結帳結果 - 神話韓語' };

export default async function PaymentResultPage({ searchParams }) {
  const member = await getMember({ cookies: cookies() });
  if (!member) redirect('/login');
  const ids = [...new Set(String(searchParams?.orders || '').split(',').map(Number)
    .filter((id) => Number.isSafeInteger(id) && id > 0))];
  const orders = ids.length ? await prisma.order.findMany({
    where: { id: { in: ids }, userId: member.id, status: 'paid' },
    include: { course: { select: { title: true } } },
  }) : [];
  const success = orders.length > 0 && orders.length === ids.length;
  const testMode = success && orders.every((order) => order.orderNo.startsWith('TEST'));
  return (
    <main className="page-main">
      <section className="section">
        <div className="container container--narrow">
          <h1 className="page-title">結帳結果</h1>
          <div className={`payment-result${success ? ' payment-result--success' : ''}`}>
            <p className="payment-result__msg">
              {success ? (testMode ? '測試結帳成功！課程權限已開通，本次沒有實際扣款。' : '付款成功！課程權限已開通。') : '找不到這次已完成的訂單，請查看會員購買紀錄。'}
            </p>
            {success && <ul>{orders.map((order) => <li key={order.id}>{order.course.title} · NT$ {order.amount.toLocaleString('zh-TW')}</li>)}</ul>}
            <p><Link href="/member#my-courses" className="btn btn-primary">前往我的課程</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
