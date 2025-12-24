import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { RichTextBlock } from "@/types/generated";

interface RichTextProps {
  data: RichTextBlock;
}

export default function RichText({ data }: RichTextProps) {
  // TODO: STYLE THE MARKDOWN
  return (
    <section className="rich-text py-6 dark:bg-black dark:text-gray-50 ">
      <Markdown remarkPlugins={[remarkGfm]}>{data.body}</Markdown>
    </section>
  );
}
