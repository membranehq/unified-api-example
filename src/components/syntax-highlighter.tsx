import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CodeHighlighterLanguages =
  | "typescript"
  | "javascript"
  | "jsx"
  | "tsx"
  | "json"
  | "yaml"
  | "bash"
  | "shell"
  | "python"
  | "go"
  | "java"
  | "php"
  | "ruby"
  | "css"
  | "html"
  | "xml"
  | "markdown"
  | "sql"
  | "text";

export interface CodeHighlighterProps {
  code: string;
  language?: CodeHighlighterLanguages;
  className?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  copyButtonText?: string;
  copySuccessText?: string;
}

export default function CodeHighlighter({
  code,
  language = "typescript",
  className,
  showLineNumbers = true,
  showCopyButton = true,
  copyButtonText = "Copy",
  copySuccessText = "Copied!",
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 p-2 rounded-md bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          title={copied ? copySuccessText : copyButtonText}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        lineNumberStyle={{
          color: "#6b7280",
          fontSize: "0.75rem",
        }}
      >
        {code.trimEnd()}
      </SyntaxHighlighter>
    </div>
  );
}
