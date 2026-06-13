'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code2, Minus,
  Undo2, Redo2,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

function Divider() {
  return <div className="w-px self-stretch bg-gray-200 mx-0.5" />;
}

function Btn({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

export default function BlogEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: { class: 'tiptap-editor' },
    },
  });

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

        <Btn onClick={() => e.chain().focus().undo().run()} title="Undo">
          <Undo2 size={14} />
        </Btn>
        <Btn onClick={() => e.chain().focus().redo().run()} title="Redo">
          <Redo2 size={14} />
        </Btn>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
