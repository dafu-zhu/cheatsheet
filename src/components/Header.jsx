import React from 'react';

const Header = ({
  columns,
  onColumnsChange,
  onExportPDF,
  currentColumn,
  onCurrentColumnChange,
  fontSize,
  onFontSizeChange,
  onExportWorkspace,
  onImportWorkspace,
}) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Cheatsheet Editor</h1>
        <div className="column-selector">
          <button
            className={`column-btn ${columns === 1 ? 'active' : ''}`}
            onClick={() => onColumnsChange(1)}
          >
            1 Column
          </button>
          <button
            className={`column-btn ${columns === 2 ? 'active' : ''}`}
            onClick={() => onColumnsChange(2)}
          >
            2 Columns
          </button>
          <button
            className={`column-btn ${columns === 3 ? 'active' : ''}`}
            onClick={() => onColumnsChange(3)}
          >
            3 Columns
          </button>
        </div>
        <div className="editor-selector">
          <span className="selector-label">Edit:</span>
          {Array.from({ length: columns }).map((_, index) => (
            <button
              key={index}
              className={`editor-btn ${currentColumn === index ? 'active' : ''}`}
              onClick={() => onCurrentColumnChange(index)}
            >
              Col {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="header-controls">
        <div className="font-size-controls">
          <span className="control-label">Font:</span>
          <button
            className="font-btn"
            onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}
            title="Decrease font size"
          >
            A-
          </button>
          <span className="font-size-display">{fontSize}px</span>
          <button
            className="font-btn"
            onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
            title="Increase font size"
          >
            A+
          </button>
        </div>
        <button className="button secondary" onClick={onExportWorkspace} title="Save entire workspace to file">
          Backup
        </button>
        <button className="button secondary" onClick={onImportWorkspace} title="Load workspace from file">
          Restore
        </button>
        <button className="button success" onClick={onExportPDF}>
          Export PDF
        </button>
      </div>
    </header>
  );
};

export default Header;
