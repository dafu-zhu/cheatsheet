import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Splitter from './components/Splitter';

const DEFAULT_COLUMN_1 = `# Cheatsheet Editor - Quick Start

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
`;

const DEFAULT_COLUMN_2 = `## Key Features

### Column Layouts
| Button | Description |
|--------|-------------|
| **1 Column** | Full-width single column |
| **2 Columns** | Side-by-side layout |
| **3 Columns** | Three-column layout |

### Column Selector
- Click **Col 1**, **Col 2**, or **Col 3** to edit that column
- Each column has independent content
- All columns are preserved when switching layouts

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
`;

const DEFAULT_COLUMN_3 = `## Export Options

### PDF Export
1. Click **Export PDF** button
2. Wait a moment for generation
3. Save the PDF to your computer
4. Perfect for printing or sharing!

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

const STORAGE_KEY_PREFIX = 'cheatsheet-content-';
const COLUMNS_KEY = 'cheatsheet-columns';
const CURRENT_COLUMN_KEY = 'cheatsheet-current-column';
const FONT_SIZE_KEY = 'cheatsheet-font-size';

function App() {
  const [columnContents, setColumnContents] = useState(['', '', '']);
  const [columns, setColumns] = useState(2);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [wordCount, setWordCount] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedColumns = localStorage.getItem(COLUMNS_KEY);
    const savedContent1 = localStorage.getItem(STORAGE_KEY_PREFIX + '1');
    const savedContent2 = localStorage.getItem(STORAGE_KEY_PREFIX + '2');
    const savedContent3 = localStorage.getItem(STORAGE_KEY_PREFIX + '3');
    const savedCurrentColumn = localStorage.getItem(CURRENT_COLUMN_KEY);
    const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);

    if (savedContent1 || savedContent2 || savedContent3) {
      setColumnContents([
        savedContent1 || '',
        savedContent2 || '',
        savedContent3 || ''
      ]);
    } else {
      setColumnContents([DEFAULT_COLUMN_1, DEFAULT_COLUMN_2, DEFAULT_COLUMN_3]);
    }

    if (savedColumns) {
      setColumns(parseInt(savedColumns, 10));
    }

    if (savedCurrentColumn) {
      setCurrentColumn(parseInt(savedCurrentColumn, 10));
    }

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + '1', columnContents[0]);
    localStorage.setItem(STORAGE_KEY_PREFIX + '2', columnContents[1]);
    localStorage.setItem(STORAGE_KEY_PREFIX + '3', columnContents[2]);

    // Calculate total word count
    const totalWords = columnContents
      .slice(0, columns)
      .reduce((sum, content) => {
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        return sum + words;
      }, 0);
    setWordCount(totalWords);
  }, [columnContents, columns]);

  useEffect(() => {
    localStorage.setItem(COLUMNS_KEY, columns.toString());
    // Reset current column if it's out of range
    if (currentColumn >= columns) {
      setCurrentColumn(0);
    }
  }, [columns, currentColumn]);

  useEffect(() => {
    localStorage.setItem(CURRENT_COLUMN_KEY, currentColumn.toString());
  }, [currentColumn]);

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  const handleContentChange = (columnIndex, value) => {
    setColumnContents(prev => {
      const newContents = [...prev];
      newContents[columnIndex] = value;
      return newContents;
    });
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
        allowTaint: false,
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
        before: '.preview-column',
        after: [],
        avoid: ['table', 'tr', 'pre', 'code', 'blockquote']
      }
    };

    // The preview-wrapper already has fontSize applied via inline style
    // html2canvas will capture the computed CSS styles including font sizes
    html2pdf().set(opt).from(element).save();
  };

  const handleSave = () => {
    const combinedContent = columnContents
      .slice(0, columns)
      .map((content, index) => `<!-- Column ${index + 1} -->\n${content}`)
      .join('\n\n---\n\n');

    const blob = new Blob([combinedContent], { type: 'text/markdown' });
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
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const readers = files.slice(0, 3).map((file, index) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({ index, content: event.target.result });
            };
            reader.readAsText(file);
          });
        });

        Promise.all(readers).then(results => {
          const newContents = ['', '', ''];
          results.forEach(({ index, content }) => {
            newContents[index] = content;
          });
          setColumnContents(newContents);
        });
      }
    };
    input.click();
  };

  const handleExportWorkspace = () => {
    const workspace = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      columns: columns,
      currentColumn: currentColumn,
      fontSize: fontSize,
      columnContents: columnContents,
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
            if (workspace.version && workspace.columnContents) {
              setColumnContents(workspace.columnContents);
              setColumns(workspace.columns || 2);
              setCurrentColumn(workspace.currentColumn || 0);
              setFontSize(workspace.fontSize || 14);
              alert('Workspace loaded successfully!');
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
      setColumnContents(['', '', '']);
      setColumns(2);
      setCurrentColumn(0);
      setFontSize(14);
      localStorage.clear();
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('This will restore the default example content. Continue?')) {
      setColumnContents([DEFAULT_COLUMN_1, DEFAULT_COLUMN_2, DEFAULT_COLUMN_3]);
      setColumns(2);
      setCurrentColumn(0);
      setFontSize(14);
      // Update localStorage with defaults
      localStorage.setItem(STORAGE_KEY_PREFIX + '1', DEFAULT_COLUMN_1);
      localStorage.setItem(STORAGE_KEY_PREFIX + '2', DEFAULT_COLUMN_2);
      localStorage.setItem(STORAGE_KEY_PREFIX + '3', DEFAULT_COLUMN_3);
      localStorage.setItem(COLUMNS_KEY, '2');
      localStorage.setItem(CURRENT_COLUMN_KEY, '0');
      localStorage.setItem(FONT_SIZE_KEY, '14');
    }
  };

  return (
    <div className="app">
      <Header
        columns={columns}
        onColumnsChange={handleColumnsChange}
        onExportPDF={handleExportPDF}
        currentColumn={currentColumn}
        onCurrentColumnChange={setCurrentColumn}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onExportWorkspace={handleExportWorkspace}
        onImportWorkspace={handleImportWorkspace}
        onRestoreDefaults={handleRestoreDefaults}
      />
      <main className="main-content">
        <Splitter>
          <Editor
            value={columnContents[currentColumn]}
            onChange={(value) => handleContentChange(currentColumn, value)}
            columnNumber={currentColumn + 1}
            fontSize={fontSize}
          />
          <Preview
            columnContents={columnContents.slice(0, columns)}
            columns={columns}
            fontSize={fontSize}
          />
        </Splitter>
      </main>
      <footer className="footer">
        <div className="status">
          <span>Words: {wordCount}</span>
          <span>Auto-saved</span>
        </div>
        <div>Cheatsheet Editor v1.0</div>
      </footer>
    </div>
  );
}

export default App;
