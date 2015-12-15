var particles = [];
var beijingImage;

//Class Particle
var Particle = function(pos){
	this.size = 3;
	this.position = pos;
	this.rotation = random(0,TWO_PI);
	this.img = loadImage("texture/smoke.png");
}

Particle.prototype.move = function() {
	this.position.add(random(-1,1),random(-1,1));
}

Particle.prototype.display = function(){
	push();
	translate(this.position.x, this.position.y);
	rotate(this.rotation);
	image(this.img,0,0,this.img.width * this.size, this.img.height * this.size);
	pop();
}


//main thread
function setup(){
	if(Modernizr.webgl){
		createCanvas(window.innerWidth,window.innerHeight,WEBGL);
	}else{
		createCanvas(window.innerWidth,window.innerHeight);
	}
	// beijingImage = loadImage("img/beijing.jpg");
	beijingImage = document.getElementById('beijingpicture');
}


function draw(){
	clear();

	// image(beijingImage);
	var ParticleNumber = map(currentAQI,0,100,10,0);

	if(particles.length > ParticleNumber){
		particles.pop();
	}else if(particles.length < ParticleNumber){
		particles.push(new Particle(createVector(random(0,windowWidth),random(0,windowHeight),random(0,500))));
	}




	// fill(0,map(currentAQI,0,100,255,0));
	fill(150,map(currentAQI,0,100,220,0));
	rect(0,0,windowWidth,windowHeight);

	//css filters
	beijingImage.style.webkitFilter = "grayscale(" + map(currentAQI,0,100,100,0) + "%)";
	beijingImage.style.filter = "grayscale(" + map(currentAQI,0,100,100,0) + "%)";

	for (var i = particles.length - 1; i >= 0; i--) {
		particles[i].display();
		particles[i].move();
	};
}

function windowResized(){
	resizeCanvas(window.innerWidth,window.innerHeight);
}


