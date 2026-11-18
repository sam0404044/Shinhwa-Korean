'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const emptyTestimonial = { name: '', role: '', industry: '', quote: '', quoteShort: '', courseRecommend: '', courseId: '', avatarUrl: '', showOnHome: false, sortOrder: 0 };

export default function AdminTestimonialEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';
  const [testimonial, setTestimonial] = useState(emptyTestimonial);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const update = (key, value) => setTestimonial((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    let active = true;
    setLoading(true);
    async function load() {
      const [courseResponse, testimonialResponse] = await Promise.all([
        fetch('/api/admin/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) }),
        isNew ? Promise.resolve(null) : fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get', id }) }),
      ]);
      const courseData = await courseResponse.json();
      if (!courseResponse.ok) throw new Error(courseData.error);
      const current = testimonialResponse ? await testimonialResponse.json() : null;
      if (testimonialResponse && !testimonialResponse.ok) throw new Error(current.error);
      if (!active) return;
      setCourses(courseData.courses);
      setTestimonial(current ? {
        ...current.testimonial,
        courseId: current.testimonial.courseId || courseData.courses.find((course) => course.title === current.testimonial.courseRecommend)?.id || '',
      } : emptyTestimonial);
    }
    load().catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, isNew]);
  async function upload(file) { const form = new FormData(); form.append('file', file); const response = await fetch('/api/admin/uploads', { method: 'POST', body: form }); const data = await response.json(); if (!response.ok) throw new Error(data.error); return data.url; }
  async function save(event) { event.preventDefault(); setError(''); setNotice(''); const response = await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save', id: isNew ? null : Number(id), testimonial }) }); const data = await response.json(); if (!response.ok) { setError(data.error || '儲存失敗。'); return; } setNotice('學員見證已儲存。'); if (isNew) router.replace(`/admin/testimonials/${data.id}/edit`); }
  if (loading) return <p>載入中…</p>;
  return <><h1 className="admin-page-title">{isNew ? '新增學員見證' : '編輯學員見證'}</h1><div className="admin-card"><form className="admin-form" onSubmit={save}><div className="form-row"><label>姓名</label><input value={testimonial.name} onChange={(event) => update('name', event.target.value)} required /></div><div className="form-row"><label>身份（職稱）</label><input value={testimonial.role || ''} onChange={(event) => update('role', event.target.value)} /></div><div className="form-row"><label>行業</label><input value={testimonial.industry || ''} onChange={(event) => update('industry', event.target.value)} /></div><div className="form-row"><label>學員照片</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { setNotice('圖片上傳中…'); update('avatarUrl', await upload(file)); setNotice('圖片已上傳，儲存見證後會套用。'); } catch (uploadError) { setError(uploadError.message); } }} />{testimonial.avatarUrl ? <img src={testimonial.avatarUrl} alt="學員照片預覽" style={{ display: 'block', width: 96, height: 96, marginTop: 8, borderRadius: '50%', objectFit: 'cover' }} /> : null}</div><div className="form-row"><label>見證全文</label><textarea rows={5} value={testimonial.quote || ''} onChange={(event) => update('quote', event.target.value)} /></div><div className="form-row"><label>摘要（列表／首頁用）</label><textarea rows={2} value={testimonial.quoteShort || ''} onChange={(event) => update('quoteShort', event.target.value)} /></div><div className="form-row"><label htmlFor="testimonial-course">推薦課程</label><select id="testimonial-course" value={testimonial.courseId || ''} onChange={(event) => {
    const selected = courses.find((course) => String(course.id) === event.target.value);
    setTestimonial((current) => ({ ...current, courseId: selected?.id || '', courseRecommend: selected?.title || '' }));
  }}><option value="">不指定推薦課程</option>{testimonial.courseId && !courses.some((course) => course.id === Number(testimonial.courseId)) ? <option value={testimonial.courseId}>原課程已刪除，請重新選擇</option> : null}{courses.map((course) => <option key={course.id} value={course.id}>{course.title}{course.published ? '' : '（已下架）'}</option>)}</select>{!testimonial.courseId && testimonial.courseRecommend ? <small>原推薦文字「{testimonial.courseRecommend}」，請選擇課程建立連結。</small> : null}</div><div className="form-row"><label>排序</label><input type="number" min="0" value={testimonial.sortOrder} onChange={(event) => update('sortOrder', event.target.value)} /></div><div className="form-row"><label><input type="checkbox" checked={testimonial.showOnHome} onChange={(event) => update('showOnHome', event.target.checked)} /> 顯示於首頁</label></div>{error ? <p className="admin-error">{error}</p> : null}{notice ? <p className="admin-notice">{notice}</p> : null}<div className="admin-actions"><button className="admin-btn admin-btn--primary">儲存</button><Link href="/admin/testimonials" className="admin-btn admin-btn--secondary">返回列表</Link></div></form></div></>;
}
