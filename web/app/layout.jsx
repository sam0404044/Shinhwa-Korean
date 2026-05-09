import '../styles.css';
import '../styles-admin.css';
import LayoutSwitcher from '../components/LayoutSwitcher';

export const metadata = {
  title: '神話韓語',
  description: '神話韓語 신화 한국어 Shinhwa Korean 線上學習平臺',
  icons: {
    icon: '/assets/images/LOGO/favicon-shinhwa.png?v=20260509',
    shortcut: '/favicon.ico?v=20260509',
    apple: '/assets/images/LOGO/favicon-shinhwa.png?v=20260509',
  },
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
