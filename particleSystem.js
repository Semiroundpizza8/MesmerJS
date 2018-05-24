// New Triangle(x, y);

class ParticleSystem {
 constructor(x, y, magnitude, sides, size) {
   this.center = {x, y};
   this.verticies = []; // [{x, y}] : represents the invisible outter shape
   this.particles = []; // [Particles()]
   this.children = [];  // [ParticleSystem()]
   this.magnitude = createVector(0, magnitude); // y vector -->
   this.sides = sides || 3; // Sides of shape
   this.currPercent = 0
   this.size = size
 }

  // Function to figure out the location of the furthest verticies
  init() {
    // Create verticies
    this.magnitude.rotate(random(0,TWO_PI))
    let angleBetween = TWO_PI  / this.sides;
    for(let i=0; i<this.sides; i++) {
      this.verticies.push({ x:this.magnitude.x, y:this.magnitude.y });
      this.magnitude.rotate(angleBetween);
    }
    // Create inner particles
    for(let i=0; i<this.verticies.length; i++) {
      let newX = this.verticies[i].x * this.currPercent;
      let newY = this.verticies[i].y * this.currPercent;
      this.particles.push({x: newX, y: newY});
    }
    // Draw at 50%
    this.draw();

  }

  // Function that draws a shape within the particle system using the current verticies
  resize(percent) {
    // Recreate inner particles
    this.particles = [];
    this.currPercent = percent;

    for(let i=0; i<this.verticies.length; i++) {
      let newX = this.verticies[i].x * percent;
      let newY = this.verticies[i].y * percent;
      this.particles.push({x: newX, y: newY});
    }

    // Draw verticies
    this.draw();
  }

  draw() {
    translate(this.center.x, this.center.y);

    // Color shape
    let currPer = map(this.currPercent, 0, 1, 0, 8);
    strokeWeight(8)

    fill((frameCount/2) % 255, 180, 215, .4);
    stroke(backgroundCol)
    
    beginShape();
    for(let i=0; i<this.particles.length; i++) {
      vertex(this.particles[i].x, this.particles[i].y);
    }
    endShape(CLOSE);
    translate(-this.center.x, -this.center.y);
  }


}