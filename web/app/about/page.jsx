import Link from 'next/link';
import { assetPath } from '../../lib/paths';

export const metadata = { title: '關於我們 - 神話韓語' };

const sections = [
  {
    title: '平臺理念',
    heading: '一學就會的韓語課，心動，就要立刻行動',
    body: '리나（Lena）老師為韓文專業背景，韓國東國大學碩士，旅居韓國 10 年。她從事韓語教學多年，聯手出版業主編，推出一學就會的韓語線上課。只要您對韓國有興趣，不論追星、追劇、交友、戀愛、職涯或進修，不只心動，也能真正行動。',
    image: assetPath('/assets/images/content/01.webp'),
  },
  {
    title: '教學特色',
    heading: '從入門到高級韓文，課程完整，一路相伴',
    body: '坊間韓語學習資源多停留在入門發音、基礎對話，但這樣的程度只夠旅行時稍微聽得懂、勉強說兩句，不足以與韓國人交流，更不可能彼此談心。因此，神話韓語投入鉅額成本，從入門發音到高級韓文都開課，課程完整，一路真心陪伴。',
    image: assetPath('/assets/images/content/02.webp'),
  },
  {
    title: '品牌故事',
    heading: '從巷子裡的補習班，成為全華人的線上課',
    body: '神話韓語源自高雄市左營區至聖路的實體補習班，指導學員熟練韓語、提升能力，甚至和韓國人建立親近關係。創辦人 리나（Lena）老師深信「只要有愛，就能克服障礙」。我們開辦線上課，正式從巷弄的補習班，成為全華人的學習平臺。',
    image: assetPath('/assets/images/content/03.webp'),
  },
];

const contacts = [
  '電子信箱：待確認',
  '地址：高雄市左營區至聖路 63 號',
  '神話韓語興業有限公司（統一編號：12345678）',
  '附設神話韓語短期補習班（電話：07-5507717）',
];

export default function AboutPage() {
  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <h1 className="page-title section-title--green">關於我們</h1>
          <p className="section-desc">
            從一學就會的韓語課，到一路相伴的學習旅程，神話韓語想陪你把喜歡真正變成實力。
          </p>

          <div className="about-content about-content--rich">
            {sections.map((section) => (
              <article key={section.title} className="about-section-card">
                <img src={section.image} alt={section.title} />
                <div>
                  <h2>{section.title}</h2>
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </div>
              </article>
            ))}

            <section className="about-contact">
              <h2>聯絡資訊</h2>
              {contacts.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </section>
          </div>

          <p>
            <Link href="/instructors">查看師資介紹</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
