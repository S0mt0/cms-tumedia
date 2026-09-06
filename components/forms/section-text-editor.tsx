"use client";

import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { RichTextDocument } from "@/lib/rich-text";

type SectionTextEditorProps = {
  id: string;
  label: string;
  value: RichTextDocument;
  onChange: (value: RichTextDocument) => void;
  readOnly?: boolean;
  description?: string;
};

const highlightColors = [
  { label: "Honey", value: "#f7df8e" },
  { label: "Mint", value: "#bfe6d3" },
  { label: "Sky", value: "#bfe3f4" },
  { label: "Lavender", value: "#ded1ff" },
  { label: "Blush", value: "#f6c2d7" },
];

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      aria-label={label}
      aria-pressed={active}
      className={
        active ? "bg-[#176d64] text-white hover:bg-[#176d64]" : undefined
      }
      disabled={disabled}
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      size="icon-sm"
      title={label}
      type="button"
      variant="outline"
    >
      {children}
    </Button>
  );
}

export function SectionTextEditor({
  id,
  label,
  value,
  onChange,
  readOnly = false,
  description,
}: SectionTextEditorProps) {
  const [highlightPaletteOpen, setHighlightPaletteOpen] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    content: value.html,
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        orderedList: false,
        strike: false,
      }),
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["paragraph"] }),
      Highlight.configure({ multicolor: true }),
    ],
    editorProps: {
      attributes: {
        "aria-labelledby": `${id}-label`,
        class:
          "min-h-48 p-4 text-sm leading-7 text-[#234640] outline-none [&_mark]:rounded-sm [&_mark]:bg-[#f7df8e] [&_mark]:px-0.5 [&_p]:mb-4 [&_p:last-child]:mb-0",
      },
    },
    onUpdate: ({ editor: nextEditor }) =>
      onChange({
        json: nextEditor.getJSON() as RichTextDocument["json"],
        html: nextEditor.getHTML(),
      }),
  });

  useEffect(() => {
    if (editor) editor.setEditable(!readOnly);
  }, [editor, readOnly]);
  useEffect(() => {
    if (editor && editor.getHTML() !== value.html)
      editor.commands.setContent(value.html, { emitUpdate: false });
  }, [editor, value.html, value.json]);

  const formatting = useEditorState({
    editor,
    selector: (context) => {
      const currentEditor = context.editor;
      return {
        alignment:
          currentEditor?.getAttributes("paragraph").textAlign ?? "left",
        bold: currentEditor?.isActive("bold") ?? false,
        highlight: currentEditor?.isActive("highlight") ?? false,
        highlightColor:
          currentEditor?.getAttributes("highlight").color ?? undefined,
        italic: currentEditor?.isActive("italic") ?? false,
        subscript: currentEditor?.isActive("subscript") ?? false,
        superscript: currentEditor?.isActive("superscript") ?? false,
        underline: currentEditor?.isActive("underline") ?? false,
      };
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label id={`${id}-label`} htmlFor={id}>
            {label}
          </Label>
          {description ? (
            <p className="mt-1 text-xs text-[#61746d]">{description}</p>
          ) : null}
        </div>
        <div
          aria-label={`${label} formatting tools`}
          className="flex items-center gap-1 rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-1"
          role="toolbar"
        >
          <ToolbarButton
            active={formatting?.bold}
            disabled={!editor || readOnly}
            label="Bold"
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
            }}
          >
            <Bold className="size-4" aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={formatting?.italic}
            disabled={!editor || readOnly}
            label="Italic"
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
            }}
          >
            <Italic className="size-4" aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={formatting?.underline}
            disabled={!editor || readOnly}
            label="Underline"
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
            }}
          >
            <UnderlineIcon className="size-4" aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={formatting?.superscript}
            disabled={!editor || readOnly}
            label="Superscript"
            onClick={() => {
              editor?.chain().focus().toggleSuperscript().run();
            }}
          >
            <SuperscriptIcon className="size-4" aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={formatting?.subscript}
            disabled={!editor || readOnly}
            label="Subscript"
            onClick={() => {
              editor?.chain().focus().toggleSubscript().run();
            }}
          >
            <SubscriptIcon className="size-4" aria-hidden />
          </ToolbarButton>
          <ToolbarButton active={formatting?.alignment === "left"} disabled={!editor || readOnly} label="Align left" onClick={() => { editor?.chain().focus().setTextAlign("left").run(); }}><AlignLeft className="size-4" aria-hidden /></ToolbarButton>
          <ToolbarButton active={formatting?.alignment === "center"} disabled={!editor || readOnly} label="Align centre" onClick={() => { editor?.chain().focus().setTextAlign("center").run(); }}><AlignCenter className="size-4" aria-hidden /></ToolbarButton>
          <ToolbarButton active={formatting?.alignment === "right"} disabled={!editor || readOnly} label="Align right" onClick={() => { editor?.chain().focus().setTextAlign("right").run(); }}><AlignRight className="size-4" aria-hidden /></ToolbarButton>
          <ToolbarButton active={formatting?.alignment === "justify"} disabled={!editor || readOnly} label="Justify" onClick={() => { editor?.chain().focus().setTextAlign("justify").run(); }}><AlignJustify className="size-4" aria-hidden /></ToolbarButton>
          <div className="relative">
            <ToolbarButton active={formatting?.highlight} disabled={!editor || readOnly} label="Highlight colour" onClick={() => setHighlightPaletteOpen((open) => !open)}><Highlighter className="size-4" style={{ color: formatting?.highlightColor }} aria-hidden /></ToolbarButton>
            {highlightPaletteOpen ? <div aria-label="Highlight colour palette" className="absolute right-0 top-11 z-10 flex gap-1 rounded-sm border border-[#b8cec4] bg-white p-2 shadow-none" role="group">
              {highlightColors.map((color) => <Button aria-label={color.label} aria-pressed={formatting?.highlightColor === color.value} className="size-7 rounded-sm border border-[#d5e0da] p-0" key={color.value} onClick={() => { editor?.chain().focus().setHighlight({ color: color.value }).run(); setHighlightPaletteOpen(false); }} style={{ backgroundColor: color.value }} type="button" variant="outline"><span className="sr-only">{color.label}</span></Button>)}
              <Button aria-label="Remove highlight" className="size-7 rounded-sm p-0 text-xs" onClick={() => { editor?.chain().focus().unsetHighlight().run(); setHighlightPaletteOpen(false); }} type="button" variant="outline">×</Button>
            </div> : null}
          </div>
        </div>
      </div>
      <div className="mt-2 overflow-hidden rounded-sm border border-[#b8cec4] bg-white focus-within:border-[#176d64] focus-within:ring-2 focus-within:ring-[#176d64]/15">
        <EditorContent editor={editor} id={id} />
      </div>
    </div>
  );
}
