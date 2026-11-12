'use client';

import { useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

export default function ArticleEditor({ content, onChange, upload, onError, onUploading }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Image,
    ],
    content,
    editorProps: { attributes: { class: 'article-editor__body', 'aria-label': '文章正文' } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  });

  if (!editor) return null;

  function editLink() {
    const href = window.prompt('輸入連結網址，留空可移除連結', editor.getAttributes('link').href || '');
    if (href === null) return;
    const chain = editor.chain().focus().extendMarkRange('link');
    if (href.trim()) chain.setLink({ href: href.trim() }).run();
    else chain.unsetLink().run();
  }

  async function insertImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    onUploading(true);
    onError('');
    try {
      const src = await upload(file);
      editor.chain().focus().setImage({ src }).run();
    } catch (error) {
      onError(error.message || '圖片上傳失敗。');
    } finally {
      setUploading(false);
      onUploading(false);
    }
  }

  const tools = [
    ['標題', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
    ['小標題', editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run()],
    ['粗體', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run()],
    ['斜體', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run()],
    ['項目清單', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run()],
    ['編號清單', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run()],
    ['連結', editor.isActive('link'), editLink],
  ];

  return (
    <div className="article-editor">
      <div className="article-editor__tools" role="group" aria-label="正文格式">
        {tools.map(([label, active, command]) => (
          <button key={label} type="button" aria-pressed={active} onClick={command}>{label}</button>
        ))}
        <button type="button" disabled={uploading} onClick={() => fileInput.current?.click()}>
          {uploading ? '圖片上傳中…' : '插入圖片'}
        </button>
        <input ref={fileInput} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={insertImage} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
