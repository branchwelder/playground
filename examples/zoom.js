let gridSize = 35;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  background(0);

  for (let x = gridSize; x <= width - gridSize; x += gridSize) {
    for (let y = gridSize; y <= height - gridSize; y += gridSize) {
      noStroke();
      fill(255);
      rect(x - 1, y - 1, 3, 3);
      stroke(255, 50);
      line(x, y, mouseX, mouseY);
    }
  }
}
