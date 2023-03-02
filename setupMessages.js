export function setupMessages(state) {
  // Listen for messages from the iframe
  window.addEventListener("message", function (e) {
    const message = e.data;
    if (!message) return;

    const messageSwitch = {
      ready: messageReady,
      error: messageError,
      output: messageOutput,
      debug: messageDebug,
    };

    messageSwitch[message.type](message.body);
  });

  function messageDebug(messageBody) {
    console.debug(messageBody);
  }

  function messageReady(_) {
    if (state.initialized) return;
    if (
      document.readyState === "complete" ||
      document.readyState === "loaded"
    ) {
      state.initialized = true;
      console.debug("Sketch frame is ready");
      initSketch();
    } else {
      window.addEventListener("DOMContentLoaded", init, { once: true });
    }
  }

  function messageError(messageBody) {
    console.debug(messageBody);
    state.setOutput(false, [{ type: "error", body: messageBody }]);
  }

  function messageOutput(messageBody) {
    // TODO: Should also be getting the line of the sketch that the log statement originated from
    // TODO: Better way of detecting P5 friendly errors

    console.debug(messageBody);
    messageBody = messageBody.toString();

    if (messageBody.includes("p5.js says:")) {
      state.setOutput(false, [{ type: "p5", body: messageBody }]);
      return;
    }
    if (!state.output.length) {
      state.setOutput(false, [{ type: "log", body: messageBody, count: 1 }]);
      return;
    }
    if (messageBody === state.output.at(-1).body) {
      state.output.at(-1).count += 1;
    } else {
      state.setOutput(true, { type: "log", body: messageBody, count: 1 });
    }
  }

  function initSketch() {
    state.sketchWindow.geval(`"use strict";`);
    state.evalSketch();
  }
}
