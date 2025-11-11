"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

import { sanitizeMarkdown } from "@/helpers/markdown";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
        components={{
          // Headings with proper sizing
          h1({ children, ...props }: any) {
            return (
              <h1 className="text-3xl font-bold mt-6 mb-4" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            return (
              <h2 className="text-2xl font-bold mt-5 mb-3" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            return (
              <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>
                {children}
              </h3>
            );
          },
          h4({ children, ...props }: any) {
            return (
              <h4 className="text-lg font-semibold mt-3 mb-2" {...props}>
                {children}
              </h4>
            );
          },
          h5({ children, ...props }: any) {
            return (
              <h5 className="text-base font-semibold mt-2 mb-1" {...props}>
                {children}
              </h5>
            );
          },
          h6({ children, ...props }: any) {
            return (
              <h6 className="text-sm font-semibold mt-2 mb-1" {...props}>
                {children}
              </h6>
            );
          },
          // Paragraphs with proper spacing
          p({ children, ...props }: any) {
            return (
              <p className="mb-4 leading-7" {...props}>
                {children}
              </p>
            );
          },
          // Lists with proper styling
          ul({ children, ...props }: any) {
            return (
              <ul className="list-disc list-inside mb-4 space-y-2" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: any) {
            return (
              <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>
                {children}
              </ol>
            );
          },
          li({ children, ...props }: any) {
            return (
              <li className="ml-4" {...props}>
                {children}
              </li>
            );
          },
          // Blockquotes
          blockquote({ children, ...props }: any) {
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic bg-gray-50 dark:bg-gray-800" {...props}>
                {children}
              </blockquote>
            );
          },
          // Tables
          table({ children, ...props }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead({ children, ...props }: any) {
            return (
              <thead className="bg-gray-100 dark:bg-gray-700" {...props}>
                {children}
              </thead>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th className="px-4 py-2 text-left font-semibold" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td className="px-4 py-2 border-t border-gray-200" {...props}>
                {children}
              </td>
            );
          },
          // Horizontal rule
          hr({ ...props }: any) {
            return <hr className="my-6 border-gray-300" {...props} />;
          },
          // Links
          a({ children, href, ...props }: any) {
            return (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Strong/Bold
          strong({ children, ...props }: any) {
            return (
              <strong className="font-bold" {...props}>
                {children}
              </strong>
            );
          },
          // Emphasis/Italic
          em({ children, ...props }: any) {
            return (
              <em className="italic" {...props}>
                {children}
              </em>
            );
          },
          // Code blocks and inline code
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const inline = !match;
            return !inline && match ? (
              <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto my-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {sanitizeMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
