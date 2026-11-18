export default function CoursePlayLoading() {
  return (
    <main className="page-main">
      <section className="section course-play">
        <div className="container" role="status" aria-live="polite" aria-busy="true">
          <h1 className="page-title">正在載入課程…</h1>
          <p>正在讀取課程與章節，請稍候。</p>
        </div>
      </section>
    </main>
  );
}
