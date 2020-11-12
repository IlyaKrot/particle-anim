let cnv = document.getElementById('cnv');
let ctx = cnv.getContext('2d');
let h = cnv.height = innerHeight;
let w = cnv.width = innerWidth;
let mouse = {x: w / 2, y: h / 2}
let particles = []

let prop = {
  particleColor: 'rgba(255, 40, 40, 0.5)',
  particleRad: 5,
  particleCount: 100,
  particleMaxVel: 0.5,
  lineLength: 150
}

window.onresize = () => {
  h = cnv.height = innerHeight;
  w = cnv.width = innerWidth;
}

class Particle {
  constructor() {
    this.x = Math.random()*w
    this.y = Math.random()*h
    this.velX = Math.random()*(prop.particleMaxVel*2) - prop.particleMaxVel;
    this.velY = Math.random()*(prop.particleMaxVel*2) - prop.particleMaxVel;
  }

  position() {
    this.x + this.velX > w && this.velX > 0 || this.x + this.velX < 0 && this.velX < 0 ? this.velX *= -1 : this.velX
    this.y + this.velY > h && this.velY > 0 || this.y + this.velY < 0 && this.velY < 0 ? this.velY *= -1 : this.velY
    this.x += this.velX
    this.y += this.velY
  }

  reDraw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, prop.particleRad, 0, Math.PI*2)
    ctx.closePath();
    ctx.fillStyle = prop.particleColor;
    ctx.fill()
  }
}

//    METHODS

function reDrawParticles() {
  for (let i in particles) {
    particles[i].position()
    particles[i].reDraw()
  }
}

function getLines() {
  let x1, y1, x2, y2, length
  for (let i in particles) {
    for (let j in particles) {
      x1 = particles[i].x
      y1 = particles[i].y
      x2 = particles[j].x
      y2 = particles[j].y
      length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
      drawLines(x1, y1, x2, y2, length)
    }
  }
}

function getMouseLines() {
  let x1, y1, length
  for (let i in particles) {
    x1 = particles[i].x
    y1 = particles[i].y
    length = Math.sqrt(Math.pow(mouse.x - x1, 2) + Math.pow(mouse.y - y1, 2))
    drawLines(x1, y1, mouse.x, mouse.y, length)
  }
}

function drawLines(x1, y1, x2, y2, length) {
  let opacity
  if(length < prop.lineLength) {
    opacity = 1-length / prop.lineLength
    ctx.lineWidth = '0.5'
    ctx.strokeStyle = `rgba(255, 40, 40, ${opacity})`
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.stroke()
  }
}

function mousePos({layerX, layerY}) {
  [mouse.x, mouse.y] = [layerX, layerY]
}

cnv.addEventListener('mousemove', mousePos)

function loop() {
  ctx.clearRect(0, 0, w, h);
  reDrawParticles()
  getLines()
  getMouseLines()
  requestAnimationFrame(loop)
}

function init() {
  for (let i = 0; i < prop.particleCount; i++) {
    particles.push(new Particle)
  }
  loop()
}

init()
