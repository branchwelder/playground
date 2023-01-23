let num, step, heightStep, widthStep;

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
}
