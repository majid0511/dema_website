import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

const ToolBtn = ({ onClick, active, label, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title || label}
    className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-[#165c3d] text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

const Divider = () => (
  <span className="w-px h-5 bg-gray-200 inline-block mx-0.5 flex-shrink-0" />
);

export default function RichTextEditor({ value, onChange, placeholder = 'Tulis konten di sini...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      ImageExtension.configure({
        inline: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const prevUrl = editor.getAttributes('link').href;
    const url = window.prompt('Masukkan URL link:', prevUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Masukkan URL gambar:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-gray-200 bg-gray-50/50">
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })} label="H1" title="Heading 1" />
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })} label="H2" title="Heading 2" />
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })} label="H3" title="Heading 3" />

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} label={<strong>B</strong>} title="Bold" />
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} label={<em>I</em>} title="Italic" />
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')} label={<span className="underline">U</span>} title="Underline" />

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} label="• List" title="Bullet List" />
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} label="1. List" title="Ordered List" />
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} label={'"'} title="Blockquote" />

        <Divider />

        <ToolBtn onClick={addLink}
          active={editor.isActive('link')} label="🔗" title="Tambah Link" />
        <ToolBtn onClick={addImage} label="🖼" title="Tambah Gambar" />
      </div>

      <div className="px-4 py-3 min-h-[200px] prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
