
function Vehicle(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = 2;
    this.maxforce = 0.5;

    this.dna =  [1, 1, 1, 1]

    this.health = 2;

    // Method to update location
    this.update = function () {

        this.health -= 0.005;

        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
    }


    this.applyForce = function (force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    this.seek = function (target) {
        
        // A vector pointing from the location to the target
        var desired = p5.Vector.sub(target, this.position);

        // Scale to maximum speed
        desired.setMag(this.maxspeed);

        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force

        // return steer;
        this.applyForce(steer);
    }

    this.eat = function(list) {
        var record = Infinity;
        closest = -1;
        for(var i = 0; i < list.length; i++){
            var d = dist(this.position.x, this.position.y, list[i].x, list[i].y);

            if(d < record){
                record = d;
                closest = i;
            }
        }

        if(record < 5){
            list.splice(closest, 1);
        }

        try{
            this.seek(food[closest]);
        } catch(e) {}
        
    }


    this.dead = function () {
        return (this.health < 0)
    }

    this.display = function () {
        // Draw a triangle rotated in the direction of velocity
        var angle = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);


        // if (debug.checked()) {
          strokeWeight(3);
          stroke(0, 255, 0);
          noFill();
          line(0, 0, 0, -this.dna[0] * 25);
          strokeWeight(2);
          ellipse(0, 0, this.dna[2] * 2);
          stroke(255, 0, 0);
          line(0, 0, 0, -this.dna[1] * 25);
          ellipse(0, 0, this.dna[3] * 2);
        // }

        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = lerpColor(rd, gr, this.health);

        fill(col);
        stroke(col);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }

}