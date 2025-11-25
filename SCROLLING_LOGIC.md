# Scrolling Logic Explained

This document shows the exact code that enables scrolling in the cheatsheet editor.

## 1. CSS Flexbox Layout Hierarchy

The scrolling works through a carefully structured flex hierarchy:

### App Structure (App.css)

```css
/* Root container - takes full viewport height */
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;  /* Full viewport height */
  background-color: #ffffff;
}

/* Header - fixed height, doesn't scroll */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #2c3e50;
  /* ... */
}

/* Main content area - takes remaining space after header */
.main-content {
  display: flex;
  flex: 1;  /* Grows to fill remaining space */
  overflow: hidden;  /* Prevents content from overflowing */
}
```

## 2. Editor Pane Scrolling

### Editor Container (App.css)

```css
/* Editor pane - left side */
.editor-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-width: 0;
  min-height: 0;  /* KEY: Allows flex child to shrink */
  overflow: hidden;  /* Clip overflow at this level */
}

/* Pane header - fixed height */
.pane-header {
  padding: 12px 16px;
  background-color: #ecf0f1;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
  flex-shrink: 0;  /* Don't shrink the header */
}

/* Editor container - scrollable area */
.editor-container {
  flex: 1;  /* Takes remaining space after header */
  overflow-y: auto;  /* Enable vertical scrolling */
  overflow-x: hidden;  /* Hide horizontal scrollbar */
  min-height: 0;  /* KEY: Allows content to overflow and trigger scrolling */
}

/* CodeMirror specific styles */
.editor-container .cm-editor {
  height: 100%;
}

.editor-container .cm-scroller {
  overflow: auto;  /* CodeMirror's internal scrolling */
}
```

### Editor Component (Editor.jsx)

```javascript
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';

const Editor = ({ value, onChange, columnNumber, fontSize = 14 }) => {
  // Create font size theme for CodeMirror
  const fontSizeTheme = EditorView.theme({
    '&': {
      fontSize: `${fontSize}px`,
    },
    '.cm-content': {
      fontSize: `${fontSize}px`,
    },
  });

  return (
    <div className="editor-pane">
      <div className="pane-header">Editing Column {columnNumber}</div>
      <div className="editor-container">
        <CodeMirror
          value={value}
          maxHeight="100%"  /* KEY: Allows editor to grow with content */
          extensions={[markdown(), fontSizeTheme]}
          onChange={onChange}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
```

## 3. Preview Pane Scrolling

### Preview Container (App.css)

```css
/* Preview pane - right side */
.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-height: 0;  /* KEY: Allows flex child to shrink */
  overflow: hidden;  /* Clip overflow at this level */
}

/* Preview container - scrollable area */
.preview-container {
  flex: 1;  /* Takes remaining space after header */
  overflow-y: auto;  /* Enable vertical scrolling */
  overflow-x: hidden;  /* Hide horizontal scrollbar */
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 0;  /* KEY: Allows content to overflow and trigger scrolling */
}

/* Preview wrapper - grows with content */
.preview-wrapper {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  min-height: min-content;  /* Grows to fit content */
}

/* Individual preview columns */
.preview-column {
  flex: 1;
  min-width: 0;
}
```

### Preview Component (Preview.jsx)

```javascript
import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

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
        {/* Apply fontSize to wrapper - all content inherits */}
        <div
          ref={previewRef}
          className="preview-wrapper"
          style={{ fontSize: `${fontSize}px` }}  /* KEY: Sets base font size */
        >
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
```

## 4. Custom Scrollbar Styling

### Scrollbar CSS (App.css)

```css
/* Custom scrollbar for webkit browsers (Chrome, Safari, Edge) */
.editor-container::-webkit-scrollbar,
.preview-container::-webkit-scrollbar {
  width: 12px;  /* Scrollbar width */
}

.editor-container::-webkit-scrollbar-track,
.preview-container::-webkit-scrollbar-track {
  background: #f1f1f1;  /* Track (background) color */
}

.editor-container::-webkit-scrollbar-thumb,
.preview-container::-webkit-scrollbar-thumb {
  background: #888;  /* Thumb (draggable part) color */
  border-radius: 6px;
}

.editor-container::-webkit-scrollbar-thumb:hover,
.preview-container::-webkit-scrollbar-thumb:hover {
  background: #555;  /* Darker on hover */
}
```

## 5. Splitter Component

The splitter divides the editor and preview with resizable panes:

### Splitter Component (Splitter.jsx)

```javascript
import React, { useState, useCallback, useEffect } from 'react';

const Splitter = ({ children, initialSplit = 50 }) => {
  const [split, setSplit] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const container = document.querySelector('.main-content');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 20% and 80%
    if (newSplit >= 20 && newSplit <= 80) {
      setSplit(newSplit);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const [leftChild, rightChild] = React.Children.toArray(children);

  return (
    <>
      {/* Left pane (Editor) */}
      <div style={{ flex: `0 0 ${split}%`, minWidth: 0 }}>
        {leftChild}
      </div>

      {/* Draggable splitter */}
      <div
        className="splitter"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'col-resize' }}
      />

      {/* Right pane (Preview) */}
      <div style={{ flex: `0 0 ${100 - split}%`, minWidth: 0 }}>
        {rightChild}
      </div>
    </>
  );
};

export default Splitter;
```

### Splitter CSS (App.css)

```css
.splitter {
  width: 4px;
  background-color: #95a5a6;
  cursor: col-resize;
  transition: background-color 0.2s;
  flex-shrink: 0;  /* Don't shrink the splitter */
}

.splitter:hover {
  background-color: #3498db;
}
```

## 6. Visual Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│ .app (height: 100vh, flex column)                  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ .header (fixed height)                          │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ .main-content (flex: 1, overflow: hidden)       │ │
│ │ ┌──────────────────┬──┬───────────────────────┐ │ │
│ │ │ Editor Pane      │S │ Preview Pane          │ │ │
│ │ │ (flex: 1)        │P │ (flex: 1)             │ │ │
│ │ │ ┌──────────────┐ │L │ ┌───────────────────┐ │ │ │
│ │ │ │ Header       │ │I │ │ Header            │ │ │ │
│ │ │ │ (fixed)      │ │T │ │ (fixed)           │ │ │ │
│ │ │ ├──────────────┤ │T │ ├───────────────────┤ │ │ │
│ │ │ │              │ │E │ │                   │ │ │ │
│ │ │ │ .editor-     │ │R │ │ .preview-         │ │ │ │
│ │ │ │ container    │ │  │ │ container         │ │ │ │
│ │ │ │              │ │  │ │                   │ │ │ │
│ │ │ │ overflow-y:  │↕│  │ │ overflow-y:       │↕│ │ │
│ │ │ │ auto         │ │  │ │ auto              │ │ │ │
│ │ │ │              │ │  │ │                   │ │ │ │
│ │ │ │ SCROLLS HERE │ │  │ │ SCROLLS HERE      │ │ │ │
│ │ │ │              │ │  │ │                   │ │ │ │
│ │ │ └──────────────┘ │  │ └───────────────────┘ │ │ │
│ │ └──────────────────┴──┴───────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 7. Key Concepts

### Why `min-height: 0` is Critical

```css
/* WITHOUT min-height: 0 */
.editor-pane {
  flex: 1;
  /* Content can grow infinitely, no scrolling */
}

/* WITH min-height: 0 */
.editor-pane {
  flex: 1;
  min-height: 0;  /* Allows child to shrink below content size */
  /* Now overflow: auto on child will trigger scrolling */
}
```

### Flexbox Height Constraint Chain

1. **Root**: `.app` has `height: 100vh` (viewport height)
2. **Header**: Fixed height, doesn't shrink
3. **Main**: `flex: 1` takes remaining space
4. **Panes**: `flex: 1` split main area, `min-height: 0` allows shrinking
5. **Containers**: `flex: 1` take pane space, `overflow-y: auto` enables scrolling
6. **Content**: Can grow beyond container, triggering scroll

### Overflow Strategy

```
Parent:     overflow: hidden    (clip at boundary)
            ↓
Child:      overflow-y: auto    (scroll when content exceeds height)
            ↓
Content:    grows naturally      (triggers parent's scrollbar)
```

## 8. Browser Compatibility

The scrolling logic works in:
- ✅ Chrome/Edge (webkit scrollbar styling)
- ✅ Firefox (default scrollbar styling)
- ✅ Safari (webkit scrollbar styling)
- ✅ All modern browsers supporting CSS flexbox

## 9. Testing Scrolling

To verify scrolling works:

```javascript
// In browser console:

// Check if containers are scrollable
const editor = document.querySelector('.editor-container');
const preview = document.querySelector('.preview-container');

console.log('Editor scrollable:', editor.scrollHeight > editor.clientHeight);
console.log('Preview scrollable:', preview.scrollHeight > preview.clientHeight);

// Force scroll to test
editor.scrollTop = 100;
preview.scrollTop = 100;
```

## Summary

The scrolling works through:
1. **Height constraints** via flexbox (`height: 100vh` → `flex: 1` chain)
2. **min-height: 0** allowing flex children to shrink
3. **overflow-y: auto** on containers to enable scrolling
4. **overflow: hidden** on parents to clip content
5. **CodeMirror** configured with `maxHeight="100%"` to allow growth
6. **Custom scrollbars** for better UX

This creates independent, smoothly scrolling editor and preview panes!
