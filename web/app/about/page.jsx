import { assetPath } from '../../lib/paths';
import { instructors } from '../../data/instructors';

export const metadata = { title: '關於我們 - 神話韓語' };

const sections = [
  {
    title: '平臺理念',
    heading: '一學就會的韓語課，心動，就要立刻行動',
    body: '리나（Lena）老師為韓文專業背景，韓國東國大學碩士，旅居韓國 10 年。她從事韓語教學多年，聯手出版業主編，推出一學就會的韓語線上課。只要您對韓國有興趣，不論追星、追劇、交友、戀愛、職涯或進修，不只心動，也能真正行動。',
    image: assetPath('/assets/images/about/platform-idea.png'),
  },
  {
    title: '教學特色',
    heading: '從入門到高級韓文，課程完整，一路相伴',
    body: '坊間韓語學習資源多停留在入門發音、基礎對話，但這樣的程度只夠旅行時稍微聽得懂、勉強說兩句，不足以與韓國人交流，更不可能彼此談心。因此，神話韓語投入鉅額成本，從入門發音到高級韓文都開課，課程完整，一路真心陪伴。',
    image: assetPath('/assets/images/about/teaching-features.png'),
  },
  {
    title: '品牌故事',
    heading: '從巷子裡的補習班，成為全華人的線上課',
    body: '神話韓語源自高雄市左營區至聖路的實體補習班，指導學員熟練韓語、提升能力，甚至和韓國人建立親近關係。創辦人 리나（Lena）老師深信「只要有愛，就能克服障礙」。我們開辦線上課，正式從巷弄的補習班，成為全華人的學習平臺。',
    image: assetPath('/assets/images/about/brand-story.png'),
  },
];

export default function AboutPage() {
  const visibleInstructors = instructors
    .filter((instructor) => instructor.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <div className="about-page-header">
            <p className="section-kicker">關於神話</p>
            <h1 className="page-title section-title--green about-pill-title">關於我們</h1>
          </div>
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

            <section className="about-instructors" aria-labelledby="about-instructors-title">
              <div className="about-instructors__header">
                <p className="section-kicker">專業師資</p>
                <h2 id="about-instructors-title" className="about-pill-title">師資介紹</h2>
                <p>
                  臺籍與韓籍老師一起陪伴你，從語言基礎、文化理解到真實交流，把韓語學成能開口的能力。
                </p>
              </div>
              <div className="about-instructor-list">
                {visibleInstructors.map((instructor) => (
                  <article key={instructor.id} className="about-instructor-row">
                    <div className="about-instructor-row__media">
                      <img src={instructor.image} alt={instructor.name} />
                    </div>
                    <div className="about-instructor-row__copy">
                      <p className="about-instructor-row__tagline">{instructor.tagline}</p>
                      <h3>{instructor.name}</h3>
                      <p className="about-instructor-row__meta">
                        {instructor.nationality}／{instructor.title}
                      </p>
                      <ul>
                        {instructor.education.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p>{instructor.bio}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
