import Link from 'next/link';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';
import ModalLegal from './ModalLegal';

export default function Layout({ children }) {
  return (
    <>
      <div className="layout-wrap">
        <Header />
        <Breadcrumb />
        <main className="layout-main">{children}</main>
        <div className="float-cta-stack" aria-label="快速連結">
          <Link href="/free-trial" className="float-trial-btn">點我試聽</Link>
          <Link href="/contact" className="float-contact-btn">點我洽詢</Link>
        </div>
        <Footer />
      </div>
      <ModalLegal />
    </>
  );
}
