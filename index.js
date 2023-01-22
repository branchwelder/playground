const editorRoot = document.getElementById("editor");
const sketchRoot = document.getElementById("sketch");
const outputRoot = document.getElementById("output");
const sketchWindow = sketchRoot.contentWindow;
sketchWindow.geval = sketchWindow.eval;

const defaultSketch = `function setup() {
  createCanvas(windowWidth, windowHeight);
}

function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function draw() {
  clear()
  let xPts = makeArr(0, windowWidth, 30)
  let yPts = makeArr(0, windowHeight, 30)

  for (const pt of xPts) {
    line(pt, 0, mouseX, mouseY);
    line(pt, windowHeight, mouseX, mouseY);
  }
  for (const pt of yPts) {
    line(0, pt, mouseX, mouseY);
    line(windowWidth, pt, mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}`;

let state = {
  output: "",
  sketch: defaultSketch,
  resizing: false,
  initialized: false,
};

const sketchEditor = CodeMirror(editorRoot, {
  lineNumbers: true,
  tabSize: 2,
  value: state.sketch,
  mode: "javascript",
  theme: "nord",
  viewportMargin: Infinity,
  scrollbarStyle: "simple",
});

function setOutput() {
  outputRoot.innerHTML = state.output;
}

window.addEventListener("message", function (e) {
  const msgData = e.data;

  if (typeof msgData === "string") {
    state.output = msgData;
    setOutput();
    return;
  }

  if (msgData.status === "ready") {
    if (state.initialized) return;
    if (
      document.readyState === "complete" ||
      document.readyState === "loaded"
    ) {
      state.initialized = true;
      init();
    } else {
      window.addEventListener("DOMContentLoaded", init, { once: true });
    }
  } else if (msgData.status === "error") {
    state.output = msgData.body;
    setOutput();
  }
});

function evalSketch() {
  if (state.resizing) return;
  const code = sketchEditor.getValue();
  state.output = "";
  try {
    sketchWindow.geval(
      `remove();
      console.log = (function(){
        let originallog = console.log;

        return function (txt) {
          window.parent.postMessage(txt);
          originallog.apply(console, arguments);
        };
      })();

      function runSketch() {
        return function() {
          ${code};
          window.setup = setup;
          window.draw = draw;
        }
      }
      runSketch()();
      new p5();`
    );
  } catch (e) {
    state.output = e;
  }
  setOutput();
}

function init() {
  sketchWindow.geval(`new p5();`);
  evalSketch();
}

function handleKeyUp(e) {
  evalSketch();
}

function setPointerEvents(eventsOn, elements) {
  for (const el of elements) {
    if (eventsOn) {
      el.classList.remove("disablePointerEvents");
    } else {
      el.classList.add("disablePointerEvents");
    }
  }
}

function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

function resizePanel(e) {
  clearSelection();
  state.resizing = true;
  const ignore = [editorRoot, sketchRoot, outputRoot];
  setPointerEvents(false, ignore);
  const elToResize = document.getElementById(e.target.dataset.resize);
  const resizeDir = e.target.dataset.resizedir;

  const moveListener = (e) => {
    if (resizeDir === "ns") {
      elToResize.style.height = `${elToResize.offsetHeight - e.movementY}px`;
    } else if (resizeDir === "ew") {
      elToResize.style.width = `${elToResize.offsetWidth + e.movementX}px`;
    }
  };

  window.addEventListener("pointermove", moveListener);
  window.addEventListener("pointerup", (e) => {
    window.removeEventListener("pointermove", moveListener);
    state.resizing = false;
    setPointerEvents(true, ignore);
  });
}

document.querySelectorAll(".resize-bar").forEach((el) => {
  el.addEventListener("pointerdown", resizePanel);
});

editorRoot.addEventListener("keyup", handleKeyUp);
