import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (previewRef.current) {
      Prism.highlightAllUnder(previewRef.current);

      // Load images from IndexedDB
      const loadImages = async () => {
        const images = previewRef.current.querySelectorAll('img');
        console.log('Found images:', images.length);

        for (const img of images) {
          console.log('Image src:', img.src);
          // Check if the src contains indexeddb:// protocol
          if (img.src.includes('indexeddb://')) {
            // Extract the image ID from the URL
            const match = img.src.match(/indexeddb:\/\/([^/]+)/);
            if (match) {
              const imageId = match[1];
              console.log('Loading image from IndexedDB:', imageId);
              try {
                const dataUrl = await getImage(imageId);
                if (dataUrl) {
                  console.log('Image loaded successfully:', imageId);
                  img.src = dataUrl;
                } else {
                  // Image not found in IndexedDB
                  console.warn(`Image not found in IndexedDB: ${imageId}`);
                  img.alt = `${img.alt} (Image not found)`;
                  img.style.border = '2px solid red';
                }
              } catch (error) {
                console.error('Failed to load image:', error, imageId);
              }
            }
          }
        }
      };

      loadImages();
    }
  }, [content]);

  const renderMarkdown = (content) => {
    const rawHTML = marked(content || '', {
      breaks: true,
      gfm: true,
    });
    // Configure DOMPurify to allow data URIs and custom indexeddb:// protocol for images
    return DOMPurify.sanitize(rawHTML, {
      ADD_ATTR: ['target'],
      ALLOW_DATA_ATTR: true,
      ADD_TAGS: ['img'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|indexeddb|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  };

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
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </div>
    </div>
  );
};

export default Preview;
