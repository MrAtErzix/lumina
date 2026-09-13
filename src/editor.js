import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { html } from '@codemirror/lang-html'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { oneDark } from '@codemirror/theme-one-dark'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { bracketMatching } from '@codemirror/language'

const luminaTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: '#e8e6de',
      height: '100%',
      fontSize: '13.5px',
    },
    '.cm-scroller': {
      fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      lineHeight: '1.65',
      overflow: 'auto',
    },
    '.cm-content': { caretColor: '#d6ff4a', padding: '16px 0' },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: '#4a4a58',
      border: 'none',
      minWidth: '48px',
    },
    '.cm-activeLine': { backgroundColor: 'rgba(214,255,74,0.04)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#d6ff4a' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(214,255,74,0.22) !important',
    },
    '.cm-cursor': { borderLeftColor: '#d6ff4a' },
    '.cm-line': { padding: '0 20px 0 8px' },
  },
  { dark: true },
)

export function createEditor(parent, { doc, onChange }) {
  let skip = false
  const view = new EditorView({
    state: EditorState.create({
      doc: doc || '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        highlightSelectionMatches(),
        bracketMatching(),
        history(),
        html(),
        oneDark,
        luminaTheme,
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab]),
        EditorView.updateListener.of((u) => {
          if (skip) return
          if (u.docChanged) onChange(u.state.doc.toString())
        }),
        EditorView.lineWrapping,
      ],
    }),
    parent,
  })

  return {
    get value() {
      return view.state.doc.toString()
    },
    setValue(text) {
      const cur = view.state.doc.toString()
      if (cur === text) return
      skip = true
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text || '' },
      })
      skip = false
    },
    focus() {
      view.focus()
    },
    destroy() {
      view.destroy()
    },
  }
}
