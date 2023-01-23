import { setupToolbar } from "./setupToolbar.js";
import { setupEditor } from "./setupEditor.js";
import { setupResize } from "./setupResize.js";
import { setupMessages } from "./setupMessages.js";
import { html, render } from "https://unpkg.com/lit-html?module";

const globalState = {
  output: [],
  sketch: null,
  resizing: false,
  initialized: false,
  editor: null,
  sketchWindow: null,
  evalSketch: evalSketch,
  editorTimeout: 500,
  useLocalStorage: false,
  outputBuffer: 100,
};

function evalSketch() {
  if (globalState.resizing) return;
  console.debug("Evaluating sketch");
  // TODO: should the ouput get reset here? It would be nice to have it persistent.
  globalState.output = [];

  try {
    globalState.sketchWindow.geval(
      `
      try { remove() } catch (e) { window.parent.postMessage({ type: "debug", body: "remove() failed"}); }

      (() => {
        return () => {
          console.log = (function(){
            return function (txt) {
              window.parent.postMessage({ type: "output", body: txt});
            };
          })();
          ${globalState.sketch};
          try { window.setup = setup } catch (e) { window.parent.postMessage({ type: "error", body: e.toString() }); };
          try { window.draw = draw } catch (e) { window.parent.postMessage({ type: "error", body: e.toString() }); };
        }
      })()()

      new p5();
      `
    );
  } catch (e) {
    console.debug(e);
    globalState.output = [{ type: "error", body: e.toString() }];
  }
}

function renderOutput(state) {
  let out = [];
  for (const line of state.output) {
    if (line.type === "log") {
      out.push(
        html`<div class="output-line">
          ${line.count > 1 ? html`<span>${line.count}</span>` : ""}${line.body}
        </div>`
      );
    } else if (line.type === "p5") {
      out.push(html`<div class="p5-friendly">${line.body}</div>`);
    } else if (line.type === "error") {
      out.push(
        html`<div class="error-line"><span>error</span>${line.body}</div>`
      );
    }
  }
  return out;
}

function view(state) {
  let pointerEvents = state.resizing ? "disablePointerEvents" : "";
  return html`<div id="workspace">
    <div id="sidebar-container">
      <div id="sidebar">
        <div class="green bar">
          <span class="bar-title">playground</span>
          <div id="toolbar" class="bar-buttons">
            <!-- <span data-action="examples">examples</span> -->
            <span data-action="save">save</span>
            <span data-action="load">load</span>
            <span data-action="copy">copy</span>
          </div>
        </div>
        <div id="editor" class=${pointerEvents}></div>
        <div class="purple bar">
          <span class="bar-title">output</span>
        </div>
        <div
          data-resize="output"
          data-resizedir="ns"
          class="resize-bar ns"></div>
        <div id="output" class=${pointerEvents}>${renderOutput(state)}</div>
      </div>
      <div
        data-resize="sidebar"
        data-resizedir="ew"
        class="resize-bar ew"></div>
    </div>
    <iframe id="sketch" class=${pointerEvents} src="sketch.html"></iframe>
  </div>`;
}

function renderLoop() {
  render(view(globalState), document.body);
  window.requestAnimationFrame(renderLoop);
}

function setup() {
  render(view(globalState), document.body);

  globalState.sketchWindow = document.getElementById("sketch").contentWindow;
  globalState.sketchWindow.geval = globalState.sketchWindow.eval;

  setupToolbar(globalState, document.getElementById("toolbar"));
  setupEditor(globalState, document.getElementById("editor"));
  setupResize(globalState, document.getElementById("sidebar-container"));
  setupMessages(globalState);

  window.requestAnimationFrame(renderLoop);
}

window.onload = setup;
