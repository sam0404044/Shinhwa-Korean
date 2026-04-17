import { assetPath } from '../lib/paths';

export const newsCategories = ['全部分類', '開課活動', '一般公告', '韓國趣聞', '韓語應用', '韓檢技巧'];

export const articles = [
  {
    id: 1,
    title: '韓文初學者必學的 30 個常用單字',
    excerpt: '從「問候、時間、地點」開始，把最常遇到的 30 個單字先背熟，看到韓文就不再空白。',
    date: '6 分鐘閱讀',
    category: '韓語應用',
    image: assetPath('/assets/images/content/01.webp'),
    content: `
      <p>從問候、時間、地點開始，把最常遇到的單字先背熟。</p>
      <p>每天用短時間重複練習，會比一次背很多更容易留在長期記憶裡。</p>
    `,
  },
  {
    id: 2,
    title: '韓文 40 音完整教學（附發音技巧）',
    excerpt: '一次搞懂母音、子音、收尾音，搭配口型與舌位提示，讓你的發音從一開始就走在正確軌道。',
    date: '10 分鐘閱讀',
    category: '韓語應用',
    image: assetPath('/assets/images/content/02.webp'),
    content: `
      <p>韓文由母音、子音與收尾音組合而成。</p>
      <p>練習時先抓口型與舌位，再慢慢提高速度。</p>
    `,
  },
  {
    id: 3,
    title: '韓國旅遊必學 20 句韓文',
    excerpt: '從問路、結帳到求助，一次準備好 20 句實用韓文，讓你在韓國不再只會說 안녕하세요。',
    date: '7 分鐘閱讀',
    category: '韓國趣聞',
    image: assetPath('/assets/images/content/03.webp'),
    content: `
      <p>旅遊韓文先從問路、點餐、結帳、求助四個情境開始。</p>
      <p>把句子整句記起來，比單字零散背誦更快能派上用場。</p>
    `,
  },
  {
    id: 4,
    title: '韓劇常出現的韓文台詞',
    excerpt: '整理韓劇裡最常聽到的 15 句台詞，搭配中文意思與情境，追劇同時也在累積聽力與口語感覺。',
    date: '8 分鐘閱讀',
    category: '韓國趣聞',
    image: assetPath('/assets/images/content/04.webp'),
    content: `
      <p>韓劇台詞常常包含日常問候、感情表達與關係稱呼。</p>
      <p>追劇時順手記下反覆出現的句子，就是很自然的聽力練習。</p>
    `,
  },
  {
    id: 5,
    title: '最有效的韓文單字記憶法',
    excerpt: '不再死背單字表。用「情境＋分組＋間隔複習」三步驟，把單字記進長期記憶。',
    date: '9 分鐘閱讀',
    category: '韓語應用',
    image: assetPath('/assets/images/content/05.webp'),
    content: `
      <p>單字要放進情境裡學，才比較容易在開口時自然想起來。</p>
      <p>分組整理，再用間隔複習回頭看，效果會比硬背清單穩定。</p>
    `,
  },
  {
    id: 6,
    title: 'TOPIK 考試準備攻略',
    excerpt: '依等級拆解 TOPIK 考題結構，提供聽力、閱讀、寫作的準備順序與推薦練習資源。',
    date: '12 分鐘閱讀',
    category: '韓檢技巧',
    image: assetPath('/assets/images/content/06.webp'),
    content: `
      <p>TOPIK 準備要先理解題型，再依照弱項安排練習順序。</p>
      <p>聽力與閱讀需要穩定累積，寫作則要熟悉題目期待的句型。</p>
    `,
  },
];

export function getArticleById(id) {
  const num = parseInt(id, 10);
  return articles.find((a) => a.id === num) || null;
}
