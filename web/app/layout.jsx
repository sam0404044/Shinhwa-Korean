import '../styles.css';
import '../styles-admin.css';
import LayoutSwitcher from '../components/LayoutSwitcher';

export const metadata = {
  title: '神話韓語',
  description: '神話韓語 신화 한국어 Shinhwa Korean 線上教學平臺',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>
        <LayoutSwitcher>{children}</LayoutSwitcher>
      </body>
    </html>
  );
}
