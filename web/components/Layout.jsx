import Header from './Header';
import Footer from './Footer';
import ModalLegal from './ModalLegal';

export default function Layout({ children }) {
  return (
    <>
      <div className="layout-wrap">
        <Header />
        <main className="layout-main">{children}</main>
        <div className="float-cta-stack" aria-label="快速連結">
          <a href="/free-trial" className="float-trial-btn">點我試聽</a>
          <a href="/contact" className="float-contact-btn">點我洽詢</a>
        </div>
        <Footer />
      </div>
      <ModalLegal />
    </>
  );
}
