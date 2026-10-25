'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const categories = [
  { value: 'pronunciation', label: '發音＋基本對話' },
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '高級' },
  { value: 'topics', label: '主題課程' },
];

const emptyCourse = () => ({
  title: '', description: '', price: '', priceOriginal: '', category: 'pronunciation',
  sortOrder: 0, published: false, hasTrial: false, chapters: [],
});
const newKey = () => crypto.randomUUID();
const emptyQuestion = () => ({ key: newKey(), prompt: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
const emptyChapter = () => ({ key: newKey(), title: '', description: '', durationMinutes: '', muxPlaybackId: '', questions: [] });

function prepareCourse(course) {
  return {
    ...course,
    price: String(course.price),
    priceOriginal: course.priceOriginal == null ? '' : String(course.priceOriginal),
    chapters: course.chapters.map((chapter) => ({
      ...chapter,
      key: `chapter-${chapter.id}`,
      durationMinutes: chapter.durationMinutes == null ? '' : String(chapter.durationMinutes),
      questions: chapter.questions.map((question) => ({ ...question, key: `question-${question.id}` })),
    })),
  };
}

async function courseRequest(payload) {
  const response = await fetch('/api/admin/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || '操作失敗。');
  return result;
}

export default function AdminCourseEditor({ routeId }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(null);
  const [course, setCourse] = useState(emptyCourse);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const rawId = routeId && routeId !== 'new' ? routeId : new URLSearchParams(window.location.search).get('id');
    if (!rawId) {
      setLoading(false);
      return;
    }
    const id = Number(rawId);
    if (!Number.isSafeInteger(id) || id < 1) {
      setError('課程 ID 無效。');
      setLoading(false);
      return;
    }
    setCourseId(id);
    courseRequest({ action: 'get', id })
      .then((result) => setCourse(prepareCourse(result.course)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [routeId]);

  const setField = (field, value) => setCourse((current) => ({ ...current, [field]: value }));
  const updateChapter = (index, field, value) => setCourse((current) => ({
    ...current,
    chapters: current.chapters.map((chapter, chapterIndex) => chapterIndex === index ? { ...chapter, [field]: value } : chapter),
  }));
  const updateQuestion = (chapterIndex, questionIndex, field, value) => setCourse((current) => ({
    ...current,
    chapters: current.chapters.map((chapter, ci) => ci === chapterIndex ? {
      ...chapter,
      questions: chapter.questions.map((question, qi) => qi === questionIndex ? { ...question, [field]: value } : question),
    } : chapter),
  }));

  async function save(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const result = await courseRequest({ action: 'save', id: courseId, course });
      setCourseId(result.id);
      const refreshed = await courseRequest({ action: 'get', id: result.id });
      setCourse(prepareCourse(refreshed.course));
      setNotice('課程、章節與題目已儲存。');
      if (!courseId) router.replace(`/admin/courses/manage?id=${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>載入中…</p>;
  if (error && courseId && !course.title) return <p className="admin-error" role="alert">{error}</p>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{courseId ? '編輯課程' : '新增課程'}</h1>
        <Link href="/admin/courses" className="admin-btn admin-btn--secondary">返回列表</Link>
      </div>
      <form className="admin-form admin-course-editor" onSubmit={save}>
        <section className="admin-card">
          <h2 className="admin-section-title">課程資料</h2>
          <div className="admin-editor-grid">
            <div className="form-row"><label htmlFor="course-title">課程名稱</label><input id="course-title" type="text" value={course.title} onChange={(event) => setField('title', event.target.value)} required /></div>
            <div className="form-row"><label htmlFor="course-category">分類</label><select id="course-category" value={course.category} onChange={(event) => setField('category', event.target.value)}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div className="form-row"><label htmlFor="course-price">售價（NT$）</label><input id="course-price" type="number" min="0" value={course.price} onChange={(event) => setField('price', event.target.value)} required /></div>
            <div className="form-row"><label htmlFor="course-original">原價（NT$）</label><input id="course-original" type="number" min="0" value={course.priceOriginal} onChange={(event) => setField('priceOriginal', event.target.value)} /></div>
            <div className="form-row"><label htmlFor="course-order">排序</label><input id="course-order" type="number" min="0" value={course.sortOrder} onChange={(event) => setField('sortOrder', event.target.value)} /></div>
            <div className="form-row admin-editor-toggles">
              <label><input type="checkbox" checked={course.published} onChange={(event) => setField('published', event.target.checked)} /> 上架</label>
              <label><input type="checkbox" checked={course.hasTrial} onChange={(event) => setField('hasTrial', event.target.checked)} /> 提供試聽</label>
            </div>
          </div>
          <div className="form-row"><label htmlFor="course-description">課程介紹</label><textarea id="course-description" value={course.description || ''} onChange={(event) => setField('description', event.target.value)} /></div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-section-title">章節與題目</h2>
            <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setField('chapters', [...course.chapters, emptyChapter()])}>新增章節</button>
          </div>
          {course.chapters.length ? course.chapters.map((chapter, chapterIndex) => (
            <details key={chapter.key} className="admin-chapter" open={chapterIndex === 0 ? true : undefined}>
              <summary>第 {chapterIndex + 1} 堂　{chapter.title || '未命名章節'} <span>題庫 {chapter.questions.length} 題</span></summary>
              <div className="admin-chapter__body">
                <div className="admin-editor-grid">
                  <div className="form-row"><label htmlFor={`chapter-title-${chapter.key}`}>章節名稱</label><input id={`chapter-title-${chapter.key}`} type="text" value={chapter.title} onChange={(event) => updateChapter(chapterIndex, 'title', event.target.value)} required /></div>
                  <div className="form-row"><label htmlFor={`chapter-duration-${chapter.key}`}>時間（分鐘）</label><input id={`chapter-duration-${chapter.key}`} type="number" min="0" value={chapter.durationMinutes} onChange={(event) => updateChapter(chapterIndex, 'durationMinutes', event.target.value)} /></div>
                  <div className="form-row"><label htmlFor={`chapter-mux-${chapter.key}`}>Mux Playback ID</label><input id={`chapter-mux-${chapter.key}`} type="text" value={chapter.muxPlaybackId || ''} onChange={(event) => updateChapter(chapterIndex, 'muxPlaybackId', event.target.value)} /></div>
                </div>
                <div className="form-row"><label htmlFor={`chapter-description-${chapter.key}`}>章節介紹</label><textarea id={`chapter-description-${chapter.key}`} value={chapter.description || ''} onChange={(event) => updateChapter(chapterIndex, 'description', event.target.value)} /></div>
                <div className="admin-actions">
                  <button type="button" className="admin-btn admin-btn--secondary" onClick={() => updateChapter(chapterIndex, 'questions', [...chapter.questions, emptyQuestion()])}>新增題目</button>
                  <button type="button" className="admin-btn admin-btn--danger" onClick={() => setField('chapters', course.chapters.filter((_, index) => index !== chapterIndex))}>刪除章節</button>
                </div>
                {chapter.questions.map((question, questionIndex) => (
                  <div key={question.key} className="admin-question">
                    <div className="admin-question__header">
                      <h3>第 {questionIndex + 1} 題</h3>
                      <button type="button" className="admin-btn admin-btn--small admin-btn--danger" onClick={() => updateChapter(chapterIndex, 'questions', chapter.questions.filter((_, index) => index !== questionIndex))}>刪除</button>
                    </div>
                    <div className="form-row"><label htmlFor={`prompt-${question.key}`}>題目</label><textarea id={`prompt-${question.key}`} value={question.prompt} onChange={(event) => updateQuestion(chapterIndex, questionIndex, 'prompt', event.target.value)} required /></div>
                    <div className="admin-editor-grid">
                      {question.options.map((option, optionIndex) => (
                        <div className="form-row" key={optionIndex}><label htmlFor={`option-${question.key}-${optionIndex}`}>選項 {optionIndex + 1}</label><input id={`option-${question.key}-${optionIndex}`} type="text" value={option} onChange={(event) => updateQuestion(chapterIndex, questionIndex, 'options', question.options.map((value, index) => index === optionIndex ? event.target.value : value))} required /></div>
                      ))}
                      <div className="form-row"><label htmlFor={`answer-${question.key}`}>正確答案</label><select id={`answer-${question.key}`} value={question.correctIndex} onChange={(event) => updateQuestion(chapterIndex, questionIndex, 'correctIndex', Number(event.target.value))}>{question.options.map((_, index) => <option key={index} value={index}>選項 {index + 1}</option>)}</select></div>
                    </div>
                    <div className="form-row"><label htmlFor={`explanation-${question.key}`}>答案解析</label><textarea id={`explanation-${question.key}`} value={question.explanation || ''} onChange={(event) => updateQuestion(chapterIndex, questionIndex, 'explanation', event.target.value)} /></div>
                  </div>
                ))}
              </div>
            </details>
          )) : <p>尚無章節。</p>}
        </section>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {notice && <p className="admin-notice" role="status">{notice}</p>}
        <div className="admin-actions admin-editor-save">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? '儲存中…' : '儲存全部'}</button>
          <Link href="/admin/courses" className="admin-btn admin-btn--secondary">返回列表</Link>
        </div>
      </form>
    </>
  );
}
