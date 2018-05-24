let newTriangle
let triangles = []

class Mesmer {
  constructor(mag) {
    this.age = 0
    this.magnitude = createVector(0, mag)
    this.verticies = []
    this.movers = []
    this.weight = mag * 2
    // this.color = [random(0,255),random(0,255),random(0,255)]
    this.color = [frameCount / 4 % 255, random(100, 255), 200]

  }
  init(sides) {
    let angleBetween = TWO_PI / sides;
    for (let i = 0; i < sides; i++) {
      this.verticies.push({ x: this.magnitude.x, y: this.magnitude.y });
      this.magnitude.rotate(angleBetween);
      this.movers.push(new Mover(this.magnitude.copy()))
    }
  }
  draw() {
    strokeWeight(this.weight)
    fill(...this.color, 1 - this.age)
    this.age = this.age + .007
    stroke(0, 0, backgroundCol, 1 - this.age)
    beginShape()
    this.movers.forEach((mover) => {
      mover.update()
      vertex(mover.position.x, mover.position.y)
    })
    endShape(CLOSE)
  }
}
class Mover {
  constructor(vector) {
    this.position = createVector(width / 2, height / 2)
    this.velocity = vector
  }
  update() {
    this.position.add(this.velocity)
  }
  draw() {
    this.update()
  }
}