
class Vehicle {

    constructor(x, y, dna) {
        this.acceleration = createVector(0, 0);

        //setting velocity
        var v = createVector(random(-2, 2), random(-2, 2));
        v.normalize();
        this.velocity = v;

        this.position = createVector(x, y);
        this.r = 4;
        this.maxspeed = 5;

        var sensor1 = this.velocity.copy();
        sensor1.normalize();
        sensor1.mult(60)
        this.sensores = [sensor1.copy().rotate(-0.2), sensor1, sensor1.copy().rotate(0.2)]

        //matriz Q
        this.dna = dna;

        this.lifeTime = 0.0;
        this.steps = 0.0;
        this.countAction1 = 0.0;
        this.countAction2 = 0.0;
    }

    getExp() {

        let exp = this.lifeTime * 0.3 + this.steps * 0.7;

        //aumentar exp se tomar todos os tipos de acoes
        let mean = (this.countAction1 + this.countAction2) / 2;
        if( abs(this.countAction1 - mean) >  0.7 ||  abs(this.countAction2 > mean) > 0.7  ){
            exp = exp / 2;
        }

        //reduzir experiencia ganha se ele viver muito mais do que andar
        if (this.lifeTime > this.steps * 3)
            exp = exp / 2;

        return exp;
    }


    // Method to update location
    update() {

        this.lifeTime += 0.001;

        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    rotate(angle) {
        this.velocity.rotate(angle);
        for (var i = 0; i < this.sensores.length; i++) {
            this.sensores[i].rotate(angle);
        }
    }


    applyForce(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    escolherAcao(state) {
        var actions = this.dna[state];

        let maiorIndex = 0;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i] > actions[maiorIndex]) {
                maiorIndex = i;
            }
        }

        //se andou para frente somar steps
        if (maiorIndex == 0) {
            this.steps += 0.001;
        } else if( maiorIndex == 1){
            this.countAction1 += 0.001;
        } else {
            this.countAction2 += 0.001;
        }

        //retorna acao mais provavel
        return maiorIndex;
    }

    display() {
        // Draw a triangle rotated in the direction of velocity
        var angle = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);

        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = gr;// lerpColor(rd, gr, this.health);

        fill(col);
        stroke(col);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();

        push();
        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = gr;//lerpColor(rd, gr, this.health);
        fill(col);
        stroke(col);
        strokeWeight(1);
        //desenhar sensores
        for (var i = 0; i < this.sensores.length; i++) {
            var sensor = this.sensores[i];
            // line(0, 0, 0, -sensor.mag());
            line(this.position.x, this.position.y, this.position.x + sensor.x, this.position.y + sensor.y);
            // console.log(this.position.x, this.position.y, this.position.x + sensor.x, this.y + sensor.y);
        }
        pop();


    }

}