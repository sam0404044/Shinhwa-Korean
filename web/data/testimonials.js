import { assetPath } from '../lib/paths';

const avatarBase = assetPath('/assets/images/testimonials');

export const testimonials = [
  {
    id: 1,
    name: '陳雅婷',
    role: '上班族',
    industry: '科技業',
    quote: '以前只看韓劇，完全聽不懂。在神話韓語從發音開始學，現在可以聽懂簡單對話，追劇更有成就感！老師很有耐心，會用生活例子解釋文法。',
    quoteShort: '從發音開始學，現在可以聽懂簡單對話，追劇更有成就感！',
    avatar: `${avatarBase}/avatar-01.webp`,
    courseRecommend: '入門發音',
    courseId: 1,
  },
  {
    id: 2,
    name: '王大明',
    role: '大學生',
    industry: '外文系',
    quote: '為了去韓國交換開始學韓文。神話的課程結構清楚，有講義也有測驗，自己複習很方便。TOPIK 初級考過了，下一目標是中級！',
    quoteShort: '課程結構清楚，有講義也有測驗，TOPIK 初級考過了！',
    avatar: `${avatarBase}/avatar-02.webp`,
    courseRecommend: '檢定準備',
    courseId: 2,
  },
  {
    id: 3,
    name: '李曉芳',
    role: '自由工作者',
    industry: '設計',
    quote: '喜歡 KPOP 和韓綜，想跟偶像用韓文互動。上了會話課之後，敢在見面會上說簡單的韓文了，雖然還是會緊張，但很有成就感。',
    quoteShort: '上了會話課之後，敢在見面會上說簡單的韓文了。',
    avatar: `${avatarBase}/avatar-03.webp`,
    courseRecommend: '會話入門',
    courseId: 3,
  },
  {
    id: 4,
    name: '林志豪',
    role: '工程師',
    industry: '軟體業',
    quote: '工作關係常跟韓國同事開會，想學商用韓語。神話有主題課程，文法講得很細，不懂的地方可以重複看影片，很適合上班族自學。',
    quoteShort: '文法講得很細，不懂可以重複看影片，適合上班族自學。',
    avatar: null,
    courseRecommend: '文法基礎',
    courseId: 1,
  },
  {
    id: 5,
    name: '張美玲',
    role: '護理師',
    industry: '醫療',
    quote: '一直想學韓文，但輪班很難配合實體課。神話的線上課程可以自己排時間，下班後看一點、週末多上一點，半年下來已經能看簡單的韓文文章。',
    quoteShort: '線上課程可以自己排時間，半年下來能看簡單的韓文文章。',
    avatar: null,
    courseRecommend: '初級閱讀',
    courseId: 2,
  },
  {
    id: 6,
    name: '吳俊偉',
    role: '高中生',
    industry: '學生',
    quote: '因為喜歡某個韓團開始學韓文。老師會用歌詞、綜藝片段當教材，學起來不無聊。現在能聽懂偶像直播裡一半的內容，超開心。',
    quoteShort: '老師用歌詞、綜藝當教材，能聽懂偶像直播一半的內容。',
    avatar: null,
    courseRecommend: '會話入門',
    courseId: 3,
  },
  {
    id: 7,
    name: '黃雅惠',
    role: '店長',
    industry: '零售業',
    quote: '店裡常有韓國觀光客，想用韓文招呼他們。在神話學了基本招呼語和數字、結帳用語，現在可以簡單溝通，客人也很驚喜。',
    quoteShort: '學了招呼語和結帳用語，現在可以跟韓國觀光客簡單溝通。',
    avatar: null,
    courseRecommend: '生活會話',
    courseId: 1,
  },
];

export function getTestimonialById(id) {
  const num = parseInt(id, 10);
  return testimonials.find((t) => t.id === num) || null;
}
