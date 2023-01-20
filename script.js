import {EditorView, basicSetup} from "codemirror";
import {javascript} from "@codemirror/lang-javascript";

let placeholder = `let myTheme = EditorView.theme(
{
"&": {
color: "var(--foreground)",
backgroundColor: "var(--background)",
},
".cm-content": {
caretColor: "#0e9",
},
"&.cm-focused .cm-cursor": {
borderLeftColor: "#0e9",
},
"&.cm-focused .cm-selectionBackground, ::selection": {
backgroundColor: "#074",
},
".cm-gutters": {
backgroundColor: "#045",
color: "#ddd",
border: "none",
},
},
{dark: true}
);`;

let myTheme = EditorView.theme(
  {
    "&": {
      color: "var(--foreground)",
      backgroundColor: "var(--background)",
    },
    ".cm-content": {
      caretColor: "#0e9",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#0e9",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#074",
    },
    ".cm-gutters": {
      backgroundColor: "var(--backgroundAccent)",
      color: "#ddd",
      border: "none",
    },
  },
  {dark: true}
);

let editor = new EditorView({
  doc: placeholder,
  extensions: [basicSetup, javascript(), myTheme],
  parent: document.querySelector(".editor"),
});
