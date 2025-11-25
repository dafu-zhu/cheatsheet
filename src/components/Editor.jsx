import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';

const Editor = ({ value, onChange, columnNumber, fontSize = 14 }) => {
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
          height="100%"
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
