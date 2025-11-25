# Cheatsheet Editor

A modern, feature-rich cheatsheet editor for developers. Create, edit, and export beautiful coding reference sheets with markdown support, multi-column layouts, and professional PDF output.

## Features

- **Single Editor View**: Edit one column at a time with column selector buttons
- **Draggable Separator**: Resize editor and preview panes by dragging the separator
- **Column Selector**: Quickly switch between editing different columns
- **Adjustable Font Size**: Increase or decrease font size for both editor and preview
- **Code Block Wrapping**: Code blocks wrap text instead of horizontal scrolling
- **Smooth Scrolling**: Smooth scroll behavior in both editor and preview panes
- **Live Preview**: Real-time rendering of all columns side-by-side
- **Multi-Column Layouts**: Switch between 1, 2, or 3 column layouts with independent content
- **PDF Export**: Generate high-quality PDF files
- **Auto-Save**: Automatically saves all columns to browser localStorage
- **Workspace Backup/Restore**: Save entire workspace (all columns + settings) to a JSON file on your computer
- **Persistent Storage**: Your work is preserved across browser sessions (refresh, close, reopen)
- **Syntax Highlighting**: Support for 15+ programming languages
- **Offline-Ready**: Works completely offline once loaded (no database or user account needed)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to GitHub Pages

See [QUICKSTART.md](./QUICKSTART.md) for a quick deployment guide, or [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Usage

### Basic Workflow

1. **Choose Layout**: Click "1 Column", "2 Columns", or "3 Columns" to select your layout
2. **Select Column to Edit**: Click "Col 1", "Col 2", or "Col 3" buttons to choose which column to edit
3. **Write Content**: Edit the selected column in the left pane
   - Content auto-saves to browser storage as you type
   - Scroll down to see more content
4. **Adjust View**:
   - Drag the vertical separator to resize editor and preview panes
   - Use A- and A+ buttons to adjust font size
5. **Preview**: The right pane shows live preview of all columns side-by-side
   - Scroll to view long content
6. **Save Your Work**:
   - **Recommended**: Click "Backup" to save workspace to your computer
   - Or use "Export PDF" for a printable version
7. **Return Later**: Your work persists in browser storage - just reopen the page!

### Markdown Support

The editor supports standard markdown syntax:

- Headers (`#`, `##`, `###`)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Tables
- Links and images
- Blockquotes
- Horizontal rules
- Inline code

### Code Blocks

Use fenced code blocks with language specification for syntax highlighting:

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

Supported languages include:
- JavaScript/TypeScript
- Python
- Java
- C/C++/C#
- Go
- Rust
- SQL
- Bash
- JSON/YAML
- And more!

### Keyboard Shortcuts

- Standard text editing shortcuts work in the editor
- Markdown formatting is applied automatically in preview

### Saving and Loading

#### Auto-Save (Browser Storage)
- Your work is **automatically saved** to browser localStorage as you type
- Data persists across:
  - Page refreshes
  - Browser restarts
  - Computer shutdowns
- No internet connection required
- No user account or database needed

#### Workspace Backup/Restore (Recommended)
- **Backup**: Click "Backup" to save your entire workspace to a JSON file on your computer
  - Includes all 3 columns (even hidden ones)
  - Saves all settings (font size, column layout, current column)
  - File format: `cheatsheet-workspace-YYYY-MM-DD.json`
- **Restore**: Click "Restore" to load a previously saved workspace
  - Select a `.json` workspace file
  - Instantly restores all content and settings
- **Use Case**: Create backups before major changes, share workspaces, or work on multiple devices


### Column Layouts

Each column has its own independent content that persists across layout changes:

- **1 Column**: Edit and view a single full-width column
- **2 Columns**: Edit columns one at a time, preview shows both side-by-side
- **3 Columns**: Edit columns individually, preview shows all three columns

**Important**: When you switch to fewer columns (e.g., 3 → 2), the third column's content is preserved in memory and will reappear when you switch back to 3 columns. Use the column selector buttons ("Col 1", "Col 2", "Col 3") to switch between editing different columns.

### Font Size Control

Use the font size controls in the header to adjust text size:
- **A-**: Decrease font size (minimum 10px)
- **A+**: Increase font size (maximum 24px)
- Current size is displayed between the buttons

Font size applies to both the editor and preview panes.

### Resizable Panes

Drag the vertical separator between editor and preview to adjust their sizes:
- Drag left to make editor smaller, preview larger
- Drag right to make editor larger, preview smaller
- Separator will highlight blue when hovering
- Size is constrained between 20% and 80%

## Project Structure

```
cheatsheet/
├── src/
│   ├── components/
│   │   ├── Editor.jsx       # Markdown editor component
│   │   ├── Preview.jsx      # Live preview component
│   │   └── Header.jsx       # Header with controls
│   ├── styles/
│   │   └── App.css          # Application styles
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                   # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Technologies Used

- **React**: UI framework
- **Vite**: Build tool and development server
- **CodeMirror**: Code editor component
- **Marked**: Markdown parsing
- **Prism.js**: Syntax highlighting
- **html2pdf.js**: PDF generation
- **DOMPurify**: HTML sanitization

## Browser Compatibility

The application works best in modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Tips for Creating Great Cheatsheets

1. **Keep it concise**: Cheatsheets should be quick reference, not tutorials
2. **Use headers**: Organize content with clear hierarchical headers
3. **Include examples**: Code examples are more useful than just descriptions
4. **Use tables**: Tables are great for comparing methods or options
5. **Leverage columns**: Multi-column layouts help fit more on one page
6. **Test print**: Always preview your PDF before sharing

## Example Cheatsheet Template

The application includes a default JavaScript cheatsheet template. You can use it as a starting point or replace it with your own content.

## Troubleshooting

### PDF Export Not Working

- Ensure you're using a modern browser
- Check that the preview pane is rendering correctly
- Try reducing complex layouts or very long content

### Content Not Saving

- Check browser localStorage permissions
- Clear browser cache if experiencing issues
- Use the Save/Load feature as a backup

### Syntax Highlighting Not Showing

- Make sure you specify the language in code blocks
- Check that the language is in the supported list
- Refresh the page if highlighting doesn't appear

## Future Enhancements

See PROPOSAL.md for planned features including:
- Custom themes (dark mode, high contrast)
- Template library
- Cloud storage and sharing
- Collaboration features
- Export to multiple formats

## License

ISC

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

Built with ❤️ for developers who love well-organized reference materials.
