import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownMessageProps {
    content: string;
}

const MarkdownMessage = ({ content }: MarkdownMessageProps) => {
    return (
        <div className="markdown-message">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || ""}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownMessage;
