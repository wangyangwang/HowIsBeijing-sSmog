if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer, objects;
var controls;
var dae, stadium;
var fogNear, fogFar, fogSet = false;


var fogOscillateNoiseIndex = 0;
var fogOscillateN = 0;


var smogColor, blueSkyColor;

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load('dae/combo/cctv+buildings.dae', function(collada) {

    dae = collada.scene;

    dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
    dae.rotation.y = 0.6;
    dae.position.z = -10;
    dae.updateMatrix();
    
    init();
    animate();
    document.getElementsByTagName("h2")[0].innerHTML = "";

});


function init() {
    bgColor = new THREE.Color();
    smogColor = new THREE.Color("#B9B9B9");
    blueSkyColor = new THREE.Color('#E7F6FF');

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(2, 7, 20);



    scene = new THREE.Scene();

    scene.fog = new THREE.Fog("#B9B9B9", -100, 20);

    // Add the COLLADA
    scene.add(dae);


    //skybox
    // var imagePrefix = "img/skybox/sunset/sunset-";
    // var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    // var imageSuffix = ".jpg";
    // var skyGeometry = new THREE.CubeGeometry( 1000, 1000, 1000 ); 
    
    // var materialArray = [];
    // for (var i = 0; i < 6; i++)
    //   materialArray.push( new THREE.MeshBasicMaterial({
    //     map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
    //     side: THREE.BackSide
    //   }));
    // var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    // var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    // scene.add( skyBox );



    // Lights
    scene.add(new THREE.AmbientLight('#AEB5B8'));

    var directionalLight = new THREE.DirectionalLight( /*Math.random() * 0xffffff*/ '#D1D1D1', 1.4);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);

    var pointLight = new THREE.DirectionalLight(0xffffff, 10);


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(bgColor);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    setFog();
    renderer.setClearColor(bgColor);
    render();
}

var clock = new THREE.Clock();

function render() {
    var timer = Date.now() * 0.0005;
    camera.lookAt(new THREE.Vector3(0, 7, 0));
    renderer.render(scene, camera);
}

function setFog() {
    if (currentAQI != undefined) {
      if(currentAQI>0 && currentAQI < 40){
          fogFar = p5.prototype.map(currentAQI, 0, 40, 25, 50);
          fogNear = -100;
          bgColor = smogColor;
      }else if(currentAQI >= 40 && currentAQI <= 80){
          fogFar = p5.prototype.map(currentAQI, 40, 80, 50, 140);
          fogNear = -100;
          bgColor = smogColor;
      }else if(currentAQI >80 && currentAQI <= 100){
          fogFar = p5.prototype.map(currentAQI, 80, 100, 140, 160);
          fogNear = p5.prototype.map(currentAQI, 80, 100, -100, 10);
          var tempColor1 = new THREE.Color("#B9B9B9");
          bgColor = tempColor1.lerp(blueSkyColor,p5.prototype.map(currentAQI,80,100,0,1));
      }
      scene.fog.far = fogFar;
      scene.fog.near = fogNear;
      fogOscillate();
    }

}

function fogOscillate(){
  scene.fog.far = fogFar + p5.prototype.map(p5.prototype.noise(fogOscillateNoiseIndex), 0, 1, -15, 15);
  fogOscillateNoiseIndex+=0.008;
}
