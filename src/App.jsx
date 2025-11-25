import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Splitter from './components/Splitter';

const DEFAULT_COLUMN_1 = `# JavaScript Cheatsheet

## Variables & Data Types

### Variable Declaration
\`\`\`javascript
let mutable = "can change";
const immutable = "cannot change";
var oldStyle = "avoid using";
\`\`\`

### Primitive Types
- **String**: \`"text"\` or \`'text'\`
- **Number**: \`42\`, \`3.14\`
- **Boolean**: \`true\`, \`false\`
- **Null**: \`null\`
- **Undefined**: \`undefined\`

## Arrays

### Creating Arrays
\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
const empty = [];
\`\`\`

### Common Methods
| Method | Description |
|--------|-------------|
| \`push()\` | Add to end |
| \`pop()\` | Remove from end |
| \`shift()\` | Remove from start |
| \`unshift()\` | Add to start |
| \`map()\` | Transform elements |
| \`filter()\` | Filter elements |
`;

const DEFAULT_COLUMN_2 = `## Functions

### Function Declaration
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Arrow Functions
\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
const add = (a, b) => a + b;
\`\`\`

## Objects

### Creating Objects
\`\`\`javascript
const person = {
  name: "John",
  age: 30,
  greet() {
    console.log("Hi!");
  }
};
\`\`\`

### Accessing Properties
\`\`\`javascript
person.name        // Dot notation
person["age"]      // Bracket notation
\`\`\`
`;

const DEFAULT_COLUMN_3 = `## Control Flow

### Conditionals
\`\`\`javascript
if (condition) {
  // do something
} else if (otherCondition) {
  // do something else
} else {
  // default
}
\`\`\`

### Loops
\`\`\`javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// While loop
while (condition) {
  // code
}

// For...of
for (const item of array) {
  console.log(item);
}
\`\`\`

## Useful Tips

> **Pro Tip**: Use \`const\` by default, only use \`let\` when you need to reassign.

> **Remember**: JavaScript is case-sensitive!
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
      margin: [0.5, 0.5],
      filename: 'cheatsheet.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

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
