export function setupToolbar(state, toolbar) {
  toolbar.addEventListener("click", (e) => {
    if (e.target.tagName !== "SPAN") return;
    const actions = {
      examples: examples,
      save: save,
      load: load,
      copy: copyToClipboard,
    };
    actions[e.target.dataset.action]();
  });

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "text/javascript";
  document.body.appendChild(fileInput);
  fileInput.addEventListener("change", handleUpload);

  function examples() {
    console.log("examples");
  }

  function save() {
    const blob = new Blob([state.editor.getValue()], {
      type: "text/javascript",
    });
    const anchor = document.createElement("a");

    anchor.href = URL.createObjectURL(blob);
    anchor.download = "sketch.js";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  function handleUpload(e) {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.sketch = e.target.result;
      state.editor.setValue(state.sketch);
    };
    reader.readAsText(e.target.files[0]);
  }

  function load() {
    fileInput.click();
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(state.sketch);
  }
}
