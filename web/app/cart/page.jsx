import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMember } from '../../lib/member-session';
import CartContents from '../../components/CartContents';

export const dynamic = 'force-dynamic';
export const metadata = { title: '購物車 - 神話韓語' };

export default async function CartPage() {
  const member = await getMember({ cookies: cookies() });
  if (!member) redirect('/login?next=%2Fcart');
  return (
    <main className="page-main">
      <section className="section cart-page">
        <div className="container">
          <h1 className="page-title">購物車</h1>
          <CartContents />
        </div>
      </section>
    </main>
  );
}
