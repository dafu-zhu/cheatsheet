import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

const Preview = ({ columnContents, columns, fontSize = 14 }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current) {
      Prism.highlightAllUnder(previewRef.current);
    }
  }, [columnContents]);

  const renderMarkdown = (content) => {
    const rawHTML = marked(content || '', {
      breaks: true,
      gfm: true,
    });
    return DOMPurify.sanitize(rawHTML);
  };

  return (
    <div className="preview-pane">
      <div className="pane-header">Preview ({columns} {columns === 1 ? 'Column' : 'Columns'})</div>
      <div className="preview-container">
        <div ref={previewRef} className="preview-wrapper" style={{ fontSize: `${fontSize}px` }}>
          {columnContents.map((content, index) => (
            <div
              key={index}
              className="preview-column"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
