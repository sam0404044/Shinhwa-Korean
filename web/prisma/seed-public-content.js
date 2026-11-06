const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const articles = [
  { title: '零基礎也能開始的 30 天韓語暖身計畫', excerpt: '從發音、常用句到日常練習，陪你把韓語變成真的能開口的習慣。', date: new Date('2026-04-06'), category: '韓語應用', imageUrl: '/assets/images/content/01.webp', content: '<p>神話韓語為剛開始接觸韓語的學員設計 30 天暖身節奏，讓你每天都有清楚的小步驟可以完成。</p><p>只要穩穩跟著節奏前進，就能把陌生的韓文字母與常用句型慢慢變成熟悉的日常語感。</p>' },
  { title: '四月新課預告：初級韓語（上）正式開放報名', excerpt: '從基礎句型到生活應用，帶你一步一步把初級韓語學紮實。', date: new Date('2026-04-10'), category: '開課活動', imageUrl: '/assets/images/content/02.webp', content: '<p>初級韓語（上）將帶大家進入最實用的日常會話與文法練習，讓學習不只停留在記憶。</p><p>如果你想從規律節奏重新建立韓語基礎，這會是一門很適合開始的課。</p>' },
  { title: '學韓語時，最容易忽略的 20 個小細節', excerpt: '發音、語氣、句尾變化常常就是讓表達更自然的關鍵。', date: new Date('2026-04-07'), category: '韓語應用', imageUrl: '/assets/images/content/03.webp', content: '<p>很多學員會把重心放在單字和文法，但真正讓韓語更自然的，往往是那些不起眼的小地方。</p><p>我們整理出最常被忽略的細節，幫助你更快靠近真實使用者的表達方式。</p>' },
];

const testimonials = [
  { name: '陳雅婷', role: '上班族', industry: '科技業', quote: '以前只看韓劇，完全聽不懂。在神話韓語從發音開始學，現在可以聽懂簡單對話，追劇更有成就感！老師很有耐心，會用生活例子解釋文法。', quoteShort: '從發音開始學，現在可以聽懂簡單對話，追劇更有成就感！', avatarUrl: '/assets/images/testimonials/avatar-01.webp', courseRecommend: '入門發音', showOnHome: true, sortOrder: 1 },
  { name: '王大明', role: '大學生', industry: '外文系', quote: '為了去韓國交換開始學韓文。神話的課程結構清楚，有講義也有測驗，自己複習很方便。TOPIK 初級考過了，下一目標是中級！', quoteShort: '課程結構清楚，有講義也有測驗，TOPIK 初級考過了！', avatarUrl: '/assets/images/testimonials/avatar-02.webp', courseRecommend: '檢定準備', showOnHome: true, sortOrder: 2 },
  { name: '李曉芳', role: '自由工作者', industry: '設計', quote: '喜歡 KPOP 和韓綜，想跟偶像用韓文互動。上了會話課之後，敢在見面會上說簡單的韓文了，雖然還是會緊張，但很有成就感。', quoteShort: '上了會話課之後，敢在見面會上說簡單的韓文了。', avatarUrl: '/assets/images/testimonials/avatar-03.webp', courseRecommend: '會話入門', showOnHome: true, sortOrder: 3 },
];

const instructors = [
  { name: '리나（Lena，周妍馨）老師（臺籍）', title: '神話韓語創辦人', bio: '周老師旅居韓國 10 年，神話韓語創辦人、韓語翻譯員與課程講師。她用生動的學習技巧，陪華語學員輕鬆建立韓語基礎。', avatarUrl: '/assets/images/instructors/lena.webp', sortOrder: 1 },
  { name: '김수민（Kim Sumin，金洙珉）老師（韓籍）', title: '首爾大學工商管理學系', bio: '金洙珉老師畢業於韓國首爾大學，能說中文、英語與日語，為學員帶來自然且貼近生活的韓語練習。', avatarUrl: '/assets/images/instructors/kim-sumin.webp', sortOrder: 2 },
  { name: '어윤규（Eo Yungyu，魚允規）老師（韓籍）', title: '瑞逸大學護理學系', bio: '魚允規老師是韓國護理師，耐心溫暖，擅長把實際生活情境帶進韓語課堂。', avatarUrl: '/assets/images/instructors/eo-yungyu.webp', sortOrder: 3 },
];

async function createIfMissing(model, data) {
  const existing = await model.findFirst({ where: { name: data.name } });
  if (!existing) await model.create({ data });
}

async function main() {
  for (const article of articles) {
    const existing = await prisma.article.findFirst({ where: { title: article.title } });
    if (!existing) await prisma.article.create({ data: { ...article, published: true } });
  }
  for (const testimonial of testimonials) await createIfMissing(prisma.testimonial, testimonial);
  for (const instructor of instructors) await createIfMissing(prisma.instructor, { ...instructor, published: true });
  console.log('公開內容初始資料已確認。');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
