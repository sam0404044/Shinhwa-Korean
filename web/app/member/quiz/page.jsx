'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

async function quizRequest(action, fields = {}) {
  const response = await fetch('/api/member/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...fields }),
    cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error || '小考服務暫時無法使用。');
    error.status = response.status;
    throw error;
  }
  return result;
}

export default function MemberQuizPage() {
  const [courses, setCourses] = useState([]);
  const [history, setHistory] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([quizRequest('list'), quizRequest('history')])
      .then(([catalog, records]) => {
        if (!active) return;
        setCourses(catalog.courses);
        setHistory(records.attempts);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) setLoginRequired(true);
        else setError(err.message);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function start(chapterId) {
    setBusy(true);
    setError('');
    try {
      const next = await quizRequest('start', { chapterId });
      setAttempt(next);
      setAnswers(Array(next.questions.length).fill(null));
      setResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.status === 401) setLoginRequired(true);
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!attempt) return;
    if (answers.length !== 10 || answers.some((answer) => answer === null)) {
      setError('請先完成全部 10 題，再交卷。');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const graded = await quizRequest('submit', { attemptId: attempt.attemptId, answers });
      setResult(graded);
      const records = await quizRequest('history');
      setHistory(records.attempts);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.status === 401) setLoginRequired(true);
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const answered = answers.filter((answer) => answer !== null).length;

  return (
    <main className="page-main">
      <section className="section member-quiz">
        <div className="container container--narrow">
          <p className="member-quiz__back"><Link href="/member/#scores">返回會員中心</Link></p>
          <h1 className="page-title">單元小考</h1>
          {loading && <p>載入中…</p>}
          {loginRequired && <p>請先<Link href="/login/">登入會員</Link>，再開始小考。</p>}
          {error && <p className="auth-form__status auth-form__status--error" role="alert">{error}</p>}

          {!loading && !loginRequired && !attempt && (
            <>
              {courses.length ? courses.map((course) => (
                <section key={course.id} className="member-quiz__course">
                  <h2>{course.title}</h2>
                  <ul className="member-quiz__chapters">
                    {course.chapters.map((chapter) => (
                      <li key={chapter.id}>
                        <div>
                          <strong>{chapter.title}</strong>
                          <span>題庫 {chapter.questionCount} 題</span>
                        </div>
                        <button type="button" className="btn btn-primary btn--small" disabled={busy || chapter.questionCount < 10} onClick={() => start(chapter.id)}>開始小考</button>
                      </li>
                    ))}
                  </ul>
                </section>
              )) : <p>目前沒有可作答的課程。</p>}
            </>
          )}

          {attempt && !result && !loginRequired && (
            <form onSubmit={submit} className="member-quiz__form">
              <p className="member-quiz__course-name">{attempt.courseTitle}</p>
              <h2>{attempt.chapterTitle}</h2>
              <p className="member-quiz__progress">已答 {answered} / 10 題</p>
              {attempt.questions.map((question, index) => (
                <fieldset key={question.id} className="member-quiz__question">
                  <legend><span>{index + 1}.</span> {question.prompt}</legend>
                  <div className="member-quiz__options">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className={answers[index] === optionIndex ? 'is-selected' : ''}>
                        <input type="radio" name={`question-${index}`} value={optionIndex} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? optionIndex : answer))} />
                        <span>{'ABCD'[optionIndex]}. {option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <div className="member-quiz__actions">
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '交卷中…' : '交卷並查看成績'}</button>
              </div>
              {answered !== 10 ? <p className="member-quiz__progress">尚有題目未作答，完成 10 題後即可交卷。</p> : null}
            </form>
          )}

          {result && attempt && !loginRequired && (
            <section className="member-quiz__result" aria-live="polite">
              <p className="member-quiz__course-name">{attempt.chapterTitle}</p>
              <h2>本次成績 {result.score} / {result.total}</h2>
              <div className="member-quiz__actions">
                <button type="button" className="btn btn-primary" disabled={busy} onClick={() => start(attempt.chapterId)}>再做一次</button>
                <button type="button" className="btn btn-outline" onClick={() => { setAttempt(null); setResult(null); }}>返回單元列表</button>
              </div>
              <h3>答案與解析</h3>
              <ol className="member-quiz__review">
                {result.results.map((item, index) => (
                  <li key={index}>
                    <strong>{item.prompt}</strong>
                    <p className={item.answer === item.correctIndex ? 'is-correct' : 'is-incorrect'}>你的答案：{'ABCD'[item.answer]}　正確答案：{'ABCD'[item.correctIndex]}</p>
                    {item.explanation && <p>{item.explanation}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {!loading && !loginRequired && history.length > 0 && (
            <section className="member-quiz__history">
              <h2>最近成績</h2>
              <ul>
                {history.map((item) => (
                  <li key={item.id}>
                    <span>{item.courseTitle} · {item.chapterTitle}</span>
                    <strong>{item.score} / 10</strong>
                    <time dateTime={item.submittedAt}>{new Date(item.submittedAt).toLocaleDateString('zh-TW')}</time>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
