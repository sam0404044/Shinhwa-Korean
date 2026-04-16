import { assetPath } from '../lib/paths';

export const instructors = [
  {
    id: 1,
    name: '리나（Lena，周妍馨）老師',
    nationality: '臺籍',
    title: '神話韓語創辦人',
    education: ['文化大學韓國語文學系', '東國大學影像研究所文化訊息學系碩士（與李昇基同科系）'],
    tagline: '來，我們一起精通韓語！',
    bio: '周老師旅居韓國 10 年，神話韓語創辦人，各大院校韓語課程講師，韓語翻譯員，多次訪問韓國大明星。她用生動技巧，讓母語不是韓語的華人，輕易學會韓語，更在課程分享韓國經驗，知性、感性兼具。',
    image: assetPath('/assets/images/testimonials/avatar-01.png'),
    published: true,
    sortOrder: 1,
    courseIds: [1, 2, 3],
  },
  {
    id: 2,
    name: '김수민（Kim Sumin，金洙珉）老師',
    nationality: '韓籍',
    title: '韓流文化講師',
    education: ['首爾大學工商管理學系'],
    tagline: '來，我們一起體驗韓流！',
    bio: '金洙珉老師畢業於韓國首爾大學，學識豐富，能說中文、英語、日語。他除了任職神話韓語，更是韓國最有潛力的網紅。他環遊世界，心胸開闊；他沒有不良習慣，做事認真。洙珉老師全方面有口皆碑。',
    image: assetPath('/assets/images/testimonials/avatar-02.png'),
    published: true,
    sortOrder: 2,
    courseIds: [2, 7, 8],
  },
  {
    id: 3,
    name: '어윤규（Eo Yungyu，魚允規）老師',
    nationality: '韓籍',
    title: '生活韓語講師',
    education: ['瑞逸大學護理學系'],
    tagline: '來，我們一起愛上韓國！',
    bio: '魚允規老師在韓國是護理師，他比誰都有耐心。不論在韓國醫療院所，還是在臺灣神話韓語，他都是同事、學生口中最溫暖的鄰家男孩，看起來帥帥、壞壞，但他其實很可愛，很熱心想和您一起學韓語。',
    image: assetPath('/assets/images/testimonials/avatar-03.png'),
    published: true,
    sortOrder: 3,
    courseIds: [1, 8],
  },
];

export function getInstructorById(id) {
  const num = parseInt(id, 10);
  return instructors.find((i) => i.id === num) || null;
}
