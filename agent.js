
function Vehicle(x, y, dna) {
    this.acceleration = createVector(0, 0);
    
    //setting velocity
    var v = createVector(random(-2,2), random(-2,2));
    v.normalize();
    this.velocity = v;

    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = 5;

    var sensor1 = this.velocity.copy();
    sensor1.normalize();
    sensor1.mult(60)
    this.sensores = [ sensor1.copy().rotate(-0.15),  sensor1, sensor1.copy().rotate(0.15) ]

    //pesos para calcular funcao de decidir acao
    this.dna = dna;

    // Method to update location
    this.update = function () {

        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    this.rotate = function(angle) {
        this.velocity.rotate(angle);
        for(var i = 0; i < this.sensores.length; i++){
            this.sensores[i].rotate(angle);
        }
    }


    this.applyForce = function (force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    this.escolherAcao = function(leitura) {
        let sum = 0;

        if(leitura.length != this.dna.length){
            throw 'Erro ao escolher acao baseado na leitura! leitura.length deve ser igual ao dna.length'
        }

        for(var i = 0; i < this.sensores.length; i++){
            sum += this.dna[i] * leitura[i];
        }

        if( sum >= 0) return 1;
        else return 0;
    }

    this.display = function () {
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
            for(var i = 0; i < this.sensores.length; i++ ){
                var sensor = this.sensores[i];
                // line(0, 0, 0, -sensor.mag());
                line(this.position.x, this.position.y, this.position.x + sensor.x, this.position.y + sensor.y);
                // console.log(this.position.x, this.position.y, this.position.x + sensor.x, this.y + sensor.y);
            }
        pop();
        
       
    }

}