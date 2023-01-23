let theta;
let length;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  frameRate(30);
  stroke(255);
  let a = (mouseX / width) * 90;
  theta = radians(a);
  translate(width / 2, height);

  length = width / 3;
  line(0, 0, 0, -length);
  translate(0, -length);
  branch(length);
}

function branch(h) {
  h *= 0.66;

  if (h > 2) {
    push();
    rotate(theta);
    line(0, 0, 0, -h);
    translate(0, -h);
    branch(h);
    pop();
    push();
    rotate(-theta);
    line(0, 0, 0, -h);
    translate(0, -h);
    branch(h);
    pop();
  }
}
