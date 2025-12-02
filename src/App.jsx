import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Splitter from './components/Splitter';
import Login from './components/Login';
import { useAuth } from './utils/AuthContext';
import { api } from './utils/api';

const DEFAULT_CONTENT = `# Cheatsheet Editor - Quick Start

Welcome to the Cheatsheet Editor! This guide will help you create your first cheatsheet.

## Getting Started

### What You're Looking At
- **Left Pane**: Your markdown editor
- **Right Pane**: Live preview of your cheatsheet
- **Top Bar**: Tools and controls

### Your First Edit
Try it now! Type some text in the editor and watch it appear in the preview instantly.

## Basic Markdown

### Headers
\`\`\`markdown
# Big Header
## Medium Header
### Small Header
\`\`\`

### Lists
\`\`\`markdown
- Bullet point 1
- Bullet point 2
  - Nested item

1. Numbered item
2. Another item
\`\`\`

### Code Blocks
Use triple backticks with a language for syntax highlighting.

### Inline Code
Use single backticks: \`variableName\`

## Key Features

### Column Layouts
| Button | Description |
|--------|-------------|
| **1 Column** | Full-width single column |
| **2 Columns** | Side-by-side layout |
| **3 Columns** | Three-column layout |

The content flows naturally from one column to the next! No need to manage separate editors for each column.

### Font Size Control
| Button | Action |
|--------|--------|
| **A-** | Decrease font size |
| **A+** | Increase font size |

### Resizable Panes
- **Drag** the separator between editor and preview
- Adjust to your preferred viewing size
- Works great on any screen size

## Saving Your Work

### Auto-Save
Your work is automatically saved to your browser as you type!

### Backup (Recommended)
1. Click **Backup** button
2. Save the JSON file to your computer
3. Never lose your work!

### Restore
1. Click **Restore** button
2. Select a previously saved backup file
3. All content and settings are restored

## Export Options

### PDF Export
1. Click **Export PDF** button
2. Wait a moment for generation
3. Save the PDF to your computer
4. Perfect for printing or sharing!

## Images Support

You can now paste images directly into the editor! Just copy an image and paste it (Ctrl+V or Cmd+V) and it will be inserted into your cheatsheet.

## Tips & Tricks

### Make Better Cheatsheets
- Keep it concise and scannable
- Use headers to organize sections
- Include code examples
- Use tables for comparisons
- Test your PDF before sharing

### Markdown Tables
\`\`\`markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
\`\`\`

## Supported Languages

Syntax highlighting works for 15+ languages:
- JavaScript, TypeScript, Python
- Java, C, C++, C#, Go, Rust
- SQL, Bash, HTML, CSS
- JSON, YAML, Markdown

## Try It Yourself!

1. **Clear this content** and start fresh
2. **Write your own cheatsheet** on any topic
3. **Experiment with columns** to find the best layout
4. **Export a PDF** when you're done
5. **Backup your work** to save it permanently

---

**Now start creating! Delete this text and write your own cheatsheet.**
`;

const STORAGE_KEY = 'cheatsheet-content';
const COLUMNS_KEY = 'cheatsheet-columns';
const FONT_SIZE_KEY = 'cheatsheet-font-size';

function App() {
  const { user, authenticated, loading, logout } = useAuth();
  const [content, setContent] = useState('');
  const [columns, setColumns] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [wordCount, setWordCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const syncTimeoutRef = useRef(null);

  // Load content from server when authenticated
  useEffect(() => {
    if (authenticated) {
      loadContentFromServer();
    }
  }, [authenticated]);

  const loadContentFromServer = async () => {
    try {
      const data = await api.getContent();
      setContent(data.content || DEFAULT_CONTENT);
      setColumns(data.columns || 2);
      setFontSize(data.fontSize || 14);
    } catch (error) {
      console.error('Error loading content:', error);
      // Fallback to default content on error
      setContent(DEFAULT_CONTENT);
    }
  };

  // Auto-sync to server with debounce (2 seconds after last change)
  useEffect(() => {
    if (!authenticated) return;

    // Calculate word count
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout to sync after 2 seconds of no changes
    syncTimeoutRef.current = setTimeout(() => {
      syncToServer();
    }, 2000);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [content, columns, fontSize, authenticated]);

  const syncToServer = async () => {
    if (!authenticated) return;

    try {
      setSyncing(true);
      await api.updateContent({
        content,
        columns,
        fontSize,
      });
    } catch (error) {
      console.error('Error syncing content:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleColumnsChange = (newColumns) => {
    setColumns(newColumns);
  };

  const handleExportPDF = () => {
    const element = document.querySelector('.preview-wrapper');

    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: 'cheatsheet.pdf',
      image: { type: 'png', quality: 1 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        letterRendering: true,
        logging: false,
        dpi: 300,
        backgroundColor: '#ffffff',
        removeContainer: true,
        imageTimeout: 0,
        allowTaint: true,
        foreignObjectRendering: false
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: false,
        precision: 16
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: [],
        after: [],
        avoid: ['table', 'tr', 'img', 'blockquote']
      }
    };

    // The preview-wrapper already has fontSize applied via inline style
    // html2canvas will capture the computed CSS styles including font sizes and images
    html2pdf().set(opt).from(element).save();
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cheatsheet.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setContent(event.target.result);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportWorkspace = () => {
    const workspace = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      columns: columns,
      fontSize: fontSize,
      content: content,
    };

    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cheatsheet-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportWorkspace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workspace = JSON.parse(event.target.result);
            if (workspace.version === '2.0' && workspace.content !== undefined) {
              setContent(workspace.content);
              setColumns(workspace.columns || 2);
              setFontSize(workspace.fontSize || 14);
              alert('Workspace loaded successfully!');
            } else if (workspace.version && workspace.columnContents) {
              // Backward compatibility with old format
              const combinedContent = workspace.columnContents.join('\n\n');
              setContent(combinedContent);
              setColumns(workspace.columns || 2);
              setFontSize(workspace.fontSize || 14);
              alert('Workspace loaded successfully! (Converted from old format)');
            } else {
              alert('Invalid workspace file format');
            }
          } catch (error) {
            alert('Error loading workspace file');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleNewWorkspace = () => {
    if (confirm('This will clear all your current work. Are you sure?')) {
      setContent('');
      setColumns(2);
      setFontSize(14);
      localStorage.clear();
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('This will restore the default example content. Continue?')) {
      setContent(DEFAULT_CONTENT);
      setColumns(2);
      setFontSize(14);
      // Update localStorage with defaults
      localStorage.setItem(STORAGE_KEY, DEFAULT_CONTENT);
      localStorage.setItem(COLUMNS_KEY, '2');
      localStorage.setItem(FONT_SIZE_KEY, '14');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!authenticated) {
    return <Login />;
  }

  return (
    <div className="app">
      <Header
        columns={columns}
        onColumnsChange={handleColumnsChange}
        onExportPDF={handleExportPDF}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onExportWorkspace={handleExportWorkspace}
        onImportWorkspace={handleImportWorkspace}
        onRestoreDefaults={handleRestoreDefaults}
        user={user}
        onLogout={logout}
      />
      <main className="main-content">
        <Splitter>
          <Editor
            value={content}
            onChange={handleContentChange}
            fontSize={fontSize}
          />
          <Preview
            content={content}
            columns={columns}
            fontSize={fontSize}
          />
        </Splitter>
      </main>
      <footer className="footer">
        <div className="status">
          <span>Words: {wordCount}</span>
          <span>{syncing ? 'Syncing...' : 'Synced to cloud'}</span>
        </div>
        <div>Cheatsheet Editor v2.0</div>
      </footer>
    </div>
  );
}

export default App;
