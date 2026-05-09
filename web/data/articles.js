import { assetPath } from '../lib/paths';

export const newsCategories = [
  '全部分類',
  '開課活動',
  '一般公告',
  '韓國趣聞',
  '韓語應用',
  '韓檢技巧',
];

export const articles = [
  {
    id: 1,
    title: '零基礎也能開始的 30 天韓語暖身計畫',
    excerpt: '從發音、常用句到日常練習，陪你把韓語變成真的能開口的習慣。',
    date: '2026-04-06',
    category: '韓語應用',
    image: assetPath('/assets/images/content/01.webp'),
    content: `
      <p>神話韓語為剛開始接觸韓語的學員設計 30 天暖身節奏，讓你每天都有清楚的小步驟可以完成。</p>
      <p>只要穩穩跟著節奏前進，就能把陌生的韓文字母與常用句型慢慢變成熟悉的日常語感。</p>
    `,
  },
  {
    id: 2,
    title: '四月新課預告：初級韓語（上）正式開放報名',
    excerpt: '從基礎句型到生活應用，帶你一步一步把初級韓語學紮實。',
    date: '2026-04-10',
    category: '開課活動',
    image: assetPath('/assets/images/content/02.webp'),
    content: `
      <p>初級韓語（上）將帶大家進入最實用的日常會話與文法練習，讓學習不只停留在記憶。</p>
      <p>如果你想從規律節奏重新建立韓語基礎，這會是一門很適合開始的課。</p>
    `,
  },
  {
    id: 3,
    title: '學韓語時，最容易忽略的 20 個小細節',
    excerpt: '發音、語氣、句尾變化常常就是讓表達更自然的關鍵。',
    date: '2026-04-07',
    category: '韓語應用',
    image: assetPath('/assets/images/content/03.webp'),
    content: `
      <p>很多學員會把重心放在單字和文法，但真正讓韓語更自然的，往往是那些不起眼的小地方。</p>
      <p>我們整理出最常被忽略的細節，幫助你更快靠近真實使用者的表達方式。</p>
    `,
  },
  {
    id: 4,
    title: '韓國旅遊會話整理：出發前先學這些最有用',
    excerpt: '從機場、餐廳到交通問路，先把最常用的場景準備好。',
    date: '2026-04-08',
    category: '韓國趣聞',
    image: assetPath('/assets/images/content/04.webp'),
    content: `
      <p>旅遊時能自己開口問路、點餐、購物，整趟旅程的自在感會完全不同。</p>
      <p>這篇幫你整理出旅遊前最值得先學會的會話重點，讓韓國行更順利。</p>
    `,
  },
  {
    id: 5,
    title: '公告：網站內容與課程資訊持續更新中',
    excerpt: '我們會陸續補上最新課程、師資與聯絡資訊，謝謝你的耐心等候。',
    date: '2026-04-09',
    category: '一般公告',
    image: assetPath('/assets/images/content/05.webp'),
    content: `
      <p>神話韓語網站正在持續整理與更新中，部分資訊會在近期陸續補齊。</p>
      <p>若你想先了解課程或合作內容，也可以直接透過洽詢頁與我們聯繫。</p>
    `,
  },
  {
    id: 6,
    title: 'TOPIK 準備方向：先把這些基本功顧好',
    excerpt: '不急著一直刷題，先把聽力、閱讀與字彙基本盤穩住。',
    date: '2026-04-12',
    category: '韓檢技巧',
    image: assetPath('/assets/images/content/06.webp'),
    content: `
      <p>TOPIK 檢定的關鍵不只是大量做題，更重要的是先把基礎語感和題型邏輯建立起來。</p>
      <p>掌握正確方向之後，準備起來會更有節奏，也更能看見進步。</p>
    `,
  },
];

export function getArticleById(id) {
  const num = parseInt(id, 10);
  return articles.find((article) => article.id === num) || null;
}
