"use client";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@hookform/error-message";
import Placeholder from "@tiptap/extension-placeholder";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorContent,
  EditorRoot,
  JSONContent,
} from "novel";
import { CharacterCount, handleCommandNavigation } from "novel/extensions";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { HtmlParser } from "../html-parser";
import { ColorSelector } from "./color-selector";
import { defaultExtensions } from "./extensions";
import { Image } from "./image";
import { LinkSelector } from "./link-selector";
import NodeSelector from "./node-selector";
import { slashCommand, suggestionItems } from "./slash-command";
import { TextButtons } from "./text-slector";
import { Video } from "./video";

type Props = {
  content: JSONContent | undefined;
  setContent: Dispatch<SetStateAction<JSONContent | undefined>>;
  min: number;
  max: number;
  name: string;
  errors: FieldErrors;
  textContent: string | undefined;
  setTextContent: Dispatch<SetStateAction<string | undefined>>;
  onEdit?: boolean;
  inline?: boolean;
  disabled?: boolean;
  htmlContent?: string | undefined;
  setHtmlContent?: Dispatch<SetStateAction<string | undefined>>;
};

const BlockTextEditor = ({
  setContent,
  content,
  min,
  max,
  name,
  errors,
  setTextContent,
  textContent,
  onEdit,
  inline,
  disabled,
  htmlContent,
  setHtmlContent,
}: Props) => {
  const [openNode, setOpenNode] = useState<boolean>(false);
  const [openLink, setOpenLink] = useState<boolean>(false);
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [characters, setCharacters] = useState<number | undefined>(
    textContent?.length || undefined,
  );

  useEffect(() => {
    const inputElement = document.querySelector("suggestion");
    if (inputElement) {
      inputElement.addEventListener("keydown", function (e) {
        e.preventDefault();
      });
    }
  }, []);

  return (
    <div className="z-40">
      {htmlContent && !onEdit && inline ? (
        <HtmlParser html={htmlContent} />
      ) : (
        <EditorRoot>
          <EditorContent
            className={`z-40 ${cn(
              inline
                ? onEdit && "mb-5"
                : "border-[1px] rounded-xl px-10 py-5 text-base border-themeGray bg-themeBlack w-full",
            )}`}
            initialContent={content}
            editorProps={{
              editable: () => !disabled as boolean,
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              attributes: {
                class: `prose prose-lg dark:prose-invert focus:outline-none max-w-full [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl text-themeTextGray z-40`,
              },
            }}
            extensions={[
              // @ts-ignore
              ...defaultExtensions,
              // @ts-ignore
              slashCommand,
              // @ts-ignore
              CharacterCount.configure({
                limit: max,
              }),
              // @ts-ignore
              Placeholder.configure({
                placeholder: "Type / to insert element...",
              }),
              // @ts-ignore
              Video,
              // @ts-ignore
              Image,
            ]}
            onUpdate={({ editor }) => {
              const json = editor.getJSON();
              const text = editor.getText();

              if (setHtmlContent) {
                const html = editor.getHTML();
                setHtmlContent(html);
              }
              setContent(json);
              setTextContent(text);
              setCharacters(text.length);
            }}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground z-50">
                No results
              </EditorCommandEmpty>
              {suggestionItems.map((item: any) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent z-50 cursor-pointer`}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background z-50">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium z-50">{item.title}</p>
                    <p className="text-xs text-muted-foreground z-50">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
              <EditorBubble
                tippyOptions={{
                  placement: "top",
                }}
                className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-themeBlack text-themeTextGray shadow-xl z-50"
              >
                <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                <TextButtons />
                <ColorSelector open={openColor} onOpenChange={setOpenColor} />
              </EditorBubble>
            </EditorCommand>
          </EditorContent>
          {inline ? (
            onEdit && (
              <div className="flex justify-between py-2 z-40">
                <p
                  className={`z-40 ${cn(
                    "text-xs",
                    characters &&
                      (characters < min || characters > max) &&
                      "text-red-500",
                  )}`}
                >
                  {characters || 0} / {max}
                </p>
                <ErrorMessage
                  errors={errors}
                  name={name}
                  render={({ message }) => (
                    <p className="text-red-400 mt-2 z-40">
                      {message === "Required" ? "" : message}
                    </p>
                  )}
                />
              </div>
            )
          ) : (
            <div className="flex justify-between py-2 z-40">
              <p
                className={`z-50 ${cn(
                  "text-xs",
                  characters &&
                    (characters < min || characters > max) &&
                    "text-red-500",
                )}`}
              >
                {characters || 0} / {max}
              </p>
              <ErrorMessage
                errors={errors}
                name={name}
                render={({ message }) => (
                  <p className="text-red-400 mt-2 z-40">
                    {message === "Required" ? "" : message}
                  </p>
                )}
              />
            </div>
          )}
        </EditorRoot>
      )}
    </div>
  );
};

export default BlockTextEditor;
