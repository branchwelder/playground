const defaultSketch = `let num, step, heightStep, widthStep;

function setup() {
  createCanvas(windowWidth, windowHeight);
  num = 40;
  colorStep = 360 / num;
  heightStep = windowHeight / num;
  widthStep = windowWidth / num;
  maxWidth = 1000;
}

function draw() {
  clear();
  background(0, 30, 40);

  for (let pt = 0; pt < num; pt++) {
    let xCoord = pt * widthStep;
    let yCoord = pt * heightStep;

    let width = abs(mouseY - yCoord);

    redness = 255 * (1 - width / windowHeight);
    fill(redness, 42, 56);

    circle(windowWidth - xCoord, yCoord, width);
    circle(xCoord, yCoord, width);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}`;

const completions = [
  { label: "circle", type: "keyword" },
  {
    label: "windowHeight",
    type: "constant",
    info: "Height of the sketch window.",
  },
  {
    label: "windowWidth",
    type: "constant",
    info: "Width of the sketch window.",
  },

  { label: "password", type: "variable" },
];

const lintOptions = {
  esversion: 6,
};

function makeMarker(msg) {
  const marker = document.createElement("div");
  marker.classList.add("error-marker");
  marker.innerHTML = "&nbsp;";

  const error = document.createElement("div");
  error.innerHTML = msg;
  error.classList.add("error-message");
  marker.appendChild(error);

  return marker;
}

export function setupEditor(state, editorRoot) {
  if (state.useLocalStorage) {
    state.sketch = localStorage.getItem("sketch") ?? defaultSketch;
  } else {
    state.sketch = defaultSketch;
  }

  let editor = CodeMirror(editorRoot, {
    lineNumbers: true,
    tabSize: 2,
    value: state.sketch,
    mode: "javascript",
    theme: "nord",
    viewportMargin: Infinity,
    scrollbarStyle: "simple",
    gutters: ["error"],
  });

  editor.on("changes", handleChange);
  state.editor = editor;
  runLinter();

  function runLinter() {
    let sketchCode = editor.getValue();
    JSHINT(sketchCode, lintOptions);

    const errors = Array.isArray(JSHINT.errors) ? JSHINT.errors : [];
    editor.clearGutter("error");

    for (const error of errors) {
      editor.setGutterMarker(error.line - 1, "error", makeMarker(error.reason));
    }
  }

  function doChanges() {
    timeoutID = null;

    console.debug("Running linter");
    runLinter();
    state.sketch = editor.getValue();
    if (state.useLocalStorage) localStorage.setItem("sketch", state.sketch);

    state.evalSketch();
  }

  let timeoutID = null;

  function handleChange() {
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(doChanges, state.editorTimeout);
  }
}
