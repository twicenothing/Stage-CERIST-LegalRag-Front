interface ChatSessionPdfHtmlOptions {
    contentHtml: string;
    title: string;
}

interface PrintChatSessionPdfOptions {
    contentHtml: string;
    printWindow: Window;
    title: string;
}

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const createChatSessionPdfHtml = ({
    contentHtml,
    title,
}: ChatSessionPdfHtmlOptions) => {
    const safeTitle = escapeHtml(title);

    return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 16mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: #ffffff;
      color: #111827;
      font-family: Inter, Roboto, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.55;
    }

    .chat-session-pdf-document {
      width: 100%;
    }

    .chat-session-pdf-header {
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 20px;
      padding-bottom: 14px;
    }

    .chat-session-pdf-brand {
      color: #111827;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      margin: 0 0 6px;
      text-transform: uppercase;
    }

    .chat-session-pdf-title {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
      margin: 0;
    }

    .chat-session-pdf-meta {
      color: #6b7280;
      font-size: 11px;
      margin: 8px 0 0;
    }

    .chat-session-pdf-message {
      break-inside: avoid;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      margin: 0 0 12px;
      padding: 12px 14px;
    }

    .chat-session-pdf-message-user {
      background: #f9fafb;
    }

    .chat-session-pdf-message-assistant {
      background: #ffffff;
    }

    .chat-session-pdf-role {
      color: #374151;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .chat-session-pdf-date {
      color: #9ca3af;
      font-size: 10px;
      font-weight: 400;
      margin-left: 8px;
      text-transform: none;
    }

    .chat-session-pdf-user-text {
      margin: 0;
      white-space: pre-wrap;
    }

    .markdown-message {
      line-height: 1.6;
      max-width: 100%;
      overflow-x: auto;
      white-space: normal;
    }

    .markdown-message table {
      border-collapse: collapse;
      font-size: 0.95rem;
      margin: 12px 0;
      min-width: 100%;
      overflow: hidden;
    }

    .markdown-message th,
    .markdown-message td {
      border: 1px solid #d1d5db;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }

    .markdown-message th {
      background: #f3f4f6;
      font-weight: 600;
    }

    .markdown-message p {
      margin: 8px 0;
    }

    .markdown-message > *:first-child {
      margin-top: 0;
    }

    .markdown-message > *:last-child {
      margin-bottom: 0;
    }

    .markdown-message ul,
    .markdown-message ol {
      padding-left: 24px;
    }

    .markdown-message code {
      background: #f3f4f6;
      border-radius: 4px;
      padding: 2px 4px;
    }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`;
};

export const printChatSessionPdf = ({
    contentHtml,
    printWindow,
    title,
}: PrintChatSessionPdfOptions) => {
    let didPrint = false;
    const printDocument = () => {
        if (didPrint) return;
        didPrint = true;
        printWindow.focus();
        printWindow.print();
    };

    printWindow.document.open();
    printWindow.document.write(
        createChatSessionPdfHtml({
            contentHtml,
            title,
        }),
    );
    printWindow.document.close();
    printWindow.addEventListener(
        "load",
        () => window.setTimeout(printDocument, 150),
        { once: true },
    );
    window.setTimeout(printDocument, 500);
};
