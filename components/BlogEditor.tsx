'use client';

import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code2, Minus,
  Undo2, Redo2, ImagePlus, Loader2,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function Divider() {
  return <div className="w-px self-stretch bg-gray-200 mx-0.5" />;
}

function Btn({
  onClick, active, title, disabled, children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

export default function BlogEditor({ content, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image.configure({ inline: false, allowBase64: false })],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: { class: 'tiptap-editor' },
    },
  });

  async function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setUploadError('Cloudinary env vars are not configured.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', UPLOAD_PRESET);

    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body });
      const data = await res.json();

      if (data.secure_url) {
        editor?.chain().focus().setImage({ src: data.secure_url }).run();
      } else {
        setUploadError(data.error?.message ?? 'Upload failed.');
      }
    } catch {
      setUploadError('Upload failed — check your connection and Cloudinary settings.');
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = '';
  }

  if (!editor) return null;

  const e = editor;

  return (
    <div className="tiptap-editor border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <Btn onClick={() => e.chain().focus().toggleBold().run()} active={e.isActive('bold')} title="Bold">
          <Bold size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleItalic().run()} active={e.isActive('italic')} title="Italic">
          <Italic size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleUnderline().run()} active={e.isActive('underline')} title="Underline">
          <UnderlineIcon size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleStrike().run()} active={e.isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </Btn>

        <Divider />

        <Btn onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()} active={e.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()} active={e.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleHeading({ level: 3 }).run()} active={e.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={14} />
        </Btn>

        <Divider />

        <Btn onClick={() => e.chain().focus().toggleBulletList().run()} active={e.isActive('bulletList')} title="Bullet list">
          <List size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleOrderedList().run()} active={e.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleBlockquote().run()} active={e.isActive('blockquote')} title="Blockquote">
          <Quote size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().toggleCodeBlock().run()} active={e.isActive('codeBlock')} title="Code block">
          <Code2 size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus size={14} />
        </Btn>

        <Divider />

        <Btn onClick={() => fileRef.current?.click()} disabled={uploading} title="Insert image">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
        </Btn>

        <Divider />

        <Btn onClick={() => e.chain().focus().undo().run()} title="Undo">
          <Undo2 size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().redo().run()} title="Redo">
          <Redo2 size={14} />
        </Btn>
      </div>

      {uploadError && (
        <div className="px-3 py-1.5 text-xs text-red-600 bg-red-50 border-b border-red-100">
          {uploadError}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

      <EditorContent editor={editor} />
    </div>
  );
}
