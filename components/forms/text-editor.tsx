"use client";

import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMediaUploadTarget } from "@/lib/actions/media.actions";
import { prepareMediaUpload } from "@/lib/media/prepare-media-upload";

type EditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};
type Format = "paragraph" | "h1" | "h2" | "h3" | "h4";

export function TextEditor({ value, onChange, disabled = false }: EditorProps) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number>();
  const [revision, setRevision] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    content: value,
    editable: !disabled,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Youtube.configure({ nocookie: true }),
      Placeholder.configure({ placeholder: "Write the article…" }),
      HorizontalRule,
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
    ],
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
      setRevision((currentRevision) => currentRevision + 1);
    },
    onSelectionUpdate: () =>
      setRevision((currentRevision) => currentRevision + 1),
    editorProps: {
      handleDrop: (_view, event) => {
        const file = event.dataTransfer?.files[0];
        if (!file) return false;
        event.preventDefault();
        void upload(file);
        return true;
      },
      attributes: {
        class:
          "min-h-100 bg-white p-5 leading-8 outline-none [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h4]:mt-5 [&_h4]:text-lg [&_h4]:font-bold [&_img]:my-5 [&_img]:max-w-full [&_iframe]:my-5 [&_iframe]:max-w-full [&_pre]:overflow-x-auto [&_pre]:bg-[#163a37] [&_pre]:p-4 [&_pre]:text-white [&_mark]:rounded-sm [&_mark]:px-0.5",
      },
    },
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);
  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);
  async function upload(file: File) {
    try {
      setProgress(0);
      const ready = await prepareMediaUpload(file);
      if (!ready.data || ready.data.kind !== "image")
        throw new Error(ready.error ?? "Choose a valid image.");
      const target = await createMediaUploadTarget({
        filename: ready.data.file.name,
        mimeType: ready.data.file.type,
        size: ready.data.file.size,
        folder: "blogs",
      });
      if (!target.data)
        throw new Error(target.error ?? "Could not prepare image upload.");
      await axios.put(target.data.uploadUrl, ready.data.file, {
        headers: { "Content-Type": ready.data.file.type },
        onUploadProgress: (event) =>
          event.total &&
          setProgress(Math.round((event.loaded / event.total) * 100)),
      });
      editor
        ?.chain()
        .focus()
        .setImage({ src: target.data.publicUrl, alt: ready.data.file.name })
        .run();
      toast.success("Image added to the article.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setProgress(undefined);
      if (input.current) input.current.value = "";
    }
  }
  if (!editor)
    return (
      <div className="border border-[#c5d4cd] bg-[#f8fbf9] p-5 text-sm text-[#61746d]">
        Loading the article editor…
      </div>
    );
  void revision;
  const format: Format = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
    ? "h3"
    : editor.isActive("heading", { level: 4 })
    ? "h4"
    : "paragraph";
  const setFormat = (next: Format | null) => {
    if (!next) return;
    const chain = editor.chain().focus();
    if (next === "paragraph") chain.setParagraph().run();
    else
      chain
        .toggleHeading({ level: Number(next.slice(1)) as 1 | 2 | 3 | 4 })
        .run();
  };
  const tool = (
    label: string,
    active: boolean,
    onClick: () => void,
    Icon: typeof Bold
  ) => (
    <Button
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      size="icon-sm"
      type="button"
      variant={active ? "default" : "outline"}
      onClick={onClick}
    >
      <Icon />
    </Button>
  );
  const highlight = editor.getAttributes("highlight").color as
    | string
    | undefined;
  return (
    <div className="overflow-hidden rounded-md border border-[#c5d4cd] bg-white">
      <div className="relative flex flex-wrap items-center gap-1 border-b border-[#c5d4cd] bg-[#f8fbf9] p-2">
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="h-8 w-29 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="h4">Heading 4</SelectItem>
          </SelectContent>
        </Select>
        {tool(
          "Bold",
          editor.isActive("bold"),
          () => editor.chain().focus().toggleBold().run(),
          Bold
        )}
        {tool(
          "Italic",
          editor.isActive("italic"),
          () => editor.chain().focus().toggleItalic().run(),
          Italic
        )}
        {tool(
          "Underline",
          editor.isActive("underline"),
          () => editor.chain().focus().toggleUnderline().run(),
          UnderlineIcon
        )}
        {tool(
          "Strike through",
          editor.isActive("strike"),
          () => editor.chain().focus().toggleStrike().run(),
          Strikethrough
        )}
        <label
          className={`grid size-8 cursor-pointer place-items-center rounded-md border ${
            editor.isActive("highlight")
              ? "bg-primary text-primary-foreground"
              : "bg-white"
          }`}
          title="Highlight colour"
        >
          <Highlighter className="size-4" />
          <input
            aria-label="Highlight colour"
            className="sr-only"
            disabled={disabled}
            type="color"
            value={highlight ?? "#f7df8e"}
            onChange={(event) =>
              editor
                .chain()
                .focus()
                .toggleHighlight({ color: event.target.value })
                .run()
            }
          />
        </label>
        {tool(
          "Subscript",
          editor.isActive("subscript"),
          () => editor.chain().focus().toggleSubscript().run(),
          SubscriptIcon
        )}
        {tool(
          "Superscript",
          editor.isActive("superscript"),
          () => editor.chain().focus().toggleSuperscript().run(),
          SuperscriptIcon
        )}
        {tool(
          "Bullet list",
          editor.isActive("bulletList"),
          () => editor.chain().focus().toggleBulletList().run(),
          List
        )}
        {tool(
          "Numbered list",
          editor.isActive("orderedList"),
          () => editor.chain().focus().toggleOrderedList().run(),
          ListOrdered
        )}
        {tool(
          "Task list",
          editor.isActive("taskList"),
          () => editor.chain().focus().toggleTaskList().run(),
          ListChecks
        )}
        {tool(
          "Quote",
          editor.isActive("blockquote"),
          () => editor.chain().focus().toggleBlockquote().run(),
          Quote
        )}
        {tool(
          "Code block",
          editor.isActive("codeBlock"),
          () => editor.chain().focus().toggleCodeBlock().run(),
          Code2
        )}
        {tool(
          "Align left",
          editor.isActive({ textAlign: "left" }),
          () => editor.chain().focus().setTextAlign("left").run(),
          AlignLeft
        )}
        {tool(
          "Align centre",
          editor.isActive({ textAlign: "center" }),
          () => editor.chain().focus().setTextAlign("center").run(),
          AlignCenter
        )}
        {tool(
          "Align right",
          editor.isActive({ textAlign: "right" }),
          () => editor.chain().focus().setTextAlign("right").run(),
          AlignRight
        )}
        {tool(
          "Add link",
          editor.isActive("link"),
          () => {
            setLinkUrl(editor.getAttributes("link").href ?? "");
            setLinkOpen(true);
          },
          Link2
        )}
        {tool("Embed YouTube", false, () => setYoutubeOpen(true), Video)}
        {tool(
          "Horizontal rule",
          false,
          () => editor.chain().focus().setHorizontalRule().run(),
          Minus
        )}
        <Button
          aria-label="Upload image"
          disabled={disabled}
          size="icon-sm"
          type="button"
          variant="outline"
          onClick={() => input.current?.click()}
        >
          <ImagePlus />
        </Button>
        <input
          ref={input}
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={(event) =>
            event.target.files?.[0] && void upload(event.target.files[0])
          }
        />
        {linkOpen ? (
          <InlineDialog
            title="Add link"
            value={linkUrl}
            onChange={setLinkUrl}
            onCancel={() => setLinkOpen(false)}
            onSubmit={() => {
              if (linkUrl.trim())
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: linkUrl.trim() })
                  .run();
              setLinkOpen(false);
            }}
          />
        ) : null}
        {youtubeOpen ? (
          <InlineDialog
            title="Embed YouTube video"
            value={youtubeUrl}
            onChange={setYoutubeUrl}
            onCancel={() => setYoutubeOpen(false)}
            onSubmit={() => {
              if (youtubeUrl.trim())
                editor.commands.setYoutubeVideo({ src: youtubeUrl.trim() });
              setYoutubeUrl("");
              setYoutubeOpen(false);
            }}
          />
        ) : null}
      </div>
      {progress !== undefined ? (
        <p
          aria-live="polite"
          className="border-b border-[#c5d4cd] bg-[#fffaf0] px-4 py-2 text-sm text-[#61746d]"
        >
          Preparing and uploading image… {progress}%
        </p>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  );
}

function InlineDialog({
  title,
  value,
  onChange,
  onCancel,
  onSubmit,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label={title}
      className="absolute right-2 top-11 z-20 w-80 rounded-md border border-[#c5d4cd] bg-white p-3 shadow-lg"
    >
      <p className="text-sm font-semibold text-[#163a37]">{title}</p>
      <input
        autoFocus
        className="mt-2 h-9 w-full rounded-md border border-[#c5d4cd] px-2 text-sm"
        placeholder="https://…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && onSubmit()}
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button size="sm" type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" type="button" onClick={onSubmit}>
          Insert
        </Button>
      </div>
    </div>
  );
}
