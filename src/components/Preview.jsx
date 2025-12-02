import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import { getImage } from '../utils/imageStorage';
import 'prismjs/themes/prism.css';
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

const Preview = ({ content, columns, fontSize = 14 }) => {
  const previewRef = useRef(null);
  const [processedHTML, setProcessedHTML] = useState('');

  useEffect(() => {
    const processContent = async () => {
      // First render the markdown to HTML
      const rawHTML = marked(content || '', {
        breaks: true,
        gfm: true,
      });

      // Find and replace all indexeddb:// URLs with actual data URLs
      const indexedDBRegex = /(<img[^>]+src=["'])indexeddb:\/\/([^"']+)(["'][^>]*>)/gi;
      let html = rawHTML;
      const matches = [...rawHTML.matchAll(indexedDBRegex)];

      for (const match of matches) {
        const imageId = match[2];
        try {
          const dataUrl = await getImage(imageId);
          if (dataUrl) {
            html = html.replace(`indexeddb://${imageId}`, dataUrl);
          } else {
            console.warn(`Image not found in IndexedDB: ${imageId}`);
            // Replace with a placeholder or data URI for broken image
            html = html.replace(`indexeddb://${imageId}`, 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>')
              .replace(match[0], match[0].replace('>', ' style="border: 2px solid red;">'));
          }
        } catch (error) {
          console.error('Failed to load image:', error, imageId);
        }
      }

      // Sanitize and set the processed HTML
      const sanitized = DOMPurify.sanitize(html, {
        ADD_ATTR: ['target'],
        ALLOW_DATA_ATTR: true,
        ADD_TAGS: ['img'],
      });

      setProcessedHTML(sanitized);
    };

    processContent();
  }, [content]);

  useEffect(() => {
    if (previewRef.current) {
      Prism.highlightAllUnder(previewRef.current);
    }
  }, [processedHTML]);

  const columnStyle = {
    fontSize: `${fontSize}px`,
    columnCount: columns,
    columnGap: '12px',
  };

  return (
    <div className="preview-pane">
      <div className="pane-header">Preview ({columns} {columns === 1 ? 'Column' : 'Columns'})</div>
      <div className="preview-container">
        <div
          ref={previewRef}
          className="preview-wrapper"
          style={columnStyle}
          dangerouslySetInnerHTML={{ __html: processedHTML }}
        />
      </div>
    </div>
  );
};

export default Preview;
