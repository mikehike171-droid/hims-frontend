"use client"

import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Quill assets from CDN
    if (typeof window !== 'undefined' && !window.hasOwnProperty('Quill')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js';
      script.onload = () => {
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else if (typeof window !== 'undefined' && (window as any).Quill) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && editorRef.current && !quillRef.current) {
      const Quill = (window as any).Quill;
      if (!Quill) return;

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: placeholder || 'Write your content here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video', 'clean'],
          ],
        },
      });

      // Set initial value
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Handle changes
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html === '<p><br></p>' ? '' : html);
      });
    }
  }, [isLoaded, placeholder]);

  // Handle external value changes (e.g., during fetch)
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      // Only update if it's not the same content (to avoid cursor jump)
      // We wrap it in a check to prevent infinite loops
      const currentHTML = quillRef.current.root.innerHTML;
      if (value !== currentHTML) {
        quillRef.current.root.innerHTML = value || '';
      }
    }
  }, [value]);

  return (
    <div className="rich-text-editor-container border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div ref={editorRef} style={{ minHeight: '500px' }} />
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-50/50 flex items-center justify-center animate-pulse">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Editor Resources...</span>
        </div>
      )}
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
          padding: 12px 15px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
        }
        .ql-editor {
          min-height: 500px;
          font-family: 'Georgia', 'Times New Roman', serif !important;
          font-size: 1.25rem !important;
          line-height: 1.8 !important;
          color: #334155 !important;
          padding: 40px !important;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          font-family: inherit !important;
          margin-top: 2em !important;
          margin-bottom: 0.8em !important;
          font-weight: 900 !important;
          color: #0f172a !important;
        }
        .ql-editor h2 { font-size: 2rem !important; }
        .ql-editor h3 { font-size: 1.5rem !important; }
        .ql-editor p {
          margin-bottom: 1.5em !important;
        }
        .ql-editor ul, .ql-editor ol {
          margin-bottom: 1.5em !important;
          padding-left: 1.5em !important;
        }
        .ql-editor li {
          margin-bottom: 0.5em !important;
        }
        .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 1rem !important;
          margin: 1.5em auto !important;
          display: block !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8 !important;
          font-style: normal !important;
          left: 20px !important;
        }
      `}</style>
    </div>
  );
}
