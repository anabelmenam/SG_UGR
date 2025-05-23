
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import  Stats from '../libs/stats.module.js'

// Clases de mi proyecto
import { Tablero } from './Tablero.js'
import { DecoracionTablero } from './DecoracionTablero.js'
import TWEEN  from '../libs/tween.module.js'

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    this.initStats();
    this.createLights();
    this.createCamera();
    this.createBackground();

    //TABLERO
    this.tablero = new Tablero();
    this.tablero.position.set(-3.5, -0.5, -3.5);
    this.add(this.tablero);
    this.tablero.setCamera(this.camera);

    this.decoracionTablero = new DecoracionTablero();
    this.decoracionTablero.rotateX(Math.PI/2);
    this.add(this.decoracionTablero);

    // VARIABLES PARA ANIMACION DE CAMARA
    this.isCameraRotating = false;
    this.rotationAngle = 0;
    this.rotationSpeed = Math.PI / 90; // velocidad del giro
    this.rotationCenter = new THREE.Vector3(0, 0, 0); // centro del tablero
    this.cameraRadius = this.camera.position.distanceTo(this.rotationCenter);
    this.startRotationVector = new THREE.Vector3(); // se usará para guardar la posición inicial
    

    this.tablero.onCambioTurno = (turnoEquipo) => {
      const targetPos = (turnoEquipo === 0) ? this.cameraPosBlancas : this.cameraPosNegras;
      this.equipo = turnoEquipo;

      this.camera.position.copy(targetPos);
      this.camera.lookAt(this.rotationCenter);
      this.camera.up.set(0, 1, 0);
      this.cameraControl.target.copy(this.rotationCenter);
      this.cameraControl.update();

      this.rotationDirection = (turnoEquipo === 0) ? 1 : -1;

      this.rotationAngle = 0;
      this.cameraRadius = this.camera.position.distanceTo(this.rotationCenter);
      this.startRotationVector.subVectors(this.camera.position, this.rotationCenter);

      this.isCameraRotating = true;
    };

    this.tablero.onBatalla = (turnoEquipo, centroBatalla) => {
      const lateral = new THREE.Vector3(1, 0, 0);
      const endPos = new THREE.Vector3().copy(centroBatalla)
        .addScaledVector(lateral, 6)
        .add(new THREE.Vector3(0, 4, 0));

      this.cameraStartPos = this.camera.position.clone();
      this.cameraEndPos = endPos.clone();
      this.cameraLerpAlpha = 0;
      this.isCameraMoving = true;

      this.rotationCenter = centroBatalla.clone();

      
};



  }

  initStats() {
    var stats = new Stats();
    
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }
  
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 50);
    this.camera.position.set (0, 16, 16);
    var look = new THREE.Vector3 (0 , 0, 0);     // Y hacia dónde mira

    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 2;
    this.cameraControl.zoomSpeed = -1;
    this.cameraControl.panSpeed = 0.2;

    this.cameraControl.target = look; // Debe orbitar con respecto al punto de mira de la cámara

    //Posiciones camaras partida
    this.cameraPosBlancas = new THREE.Vector3(0, 16, 18);
    this.cameraPosNegras = new THREE.Vector3(0, 16, -18);

  }
  
  createBackground() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('../imgs/fondo3.jpg', (texture) => {
      this.background = texture;
    });
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightPower : 500.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity : 0.5,   
      axisOnOff : true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    
    // Otro para la intensidad de la luz ambiental
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
      
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    this.ambientLight = new THREE.AmbientLight('pink', 2);
    this.add(this.ambientLight);

    this.pointLight = new THREE.PointLight('white');
    this.pointLight.power = 210;
    this.pointLight.position.set(0, 1, 0);
    this.add(this.pointLight);

    // Foco A
    this.SpotLightEquipoA = new THREE.SpotLight(0xfc03b5);
    this.SpotLightEquipoA.power = 450;
    this.SpotLightEquipoA.angle = Math.PI/8;
    this.SpotLightEquipoA.rotateZ(-Math.PI/4);
    this.SpotLightEquipoA.penumbra = 1;
    this.SpotLightEquipoA.position.set(0,5,-7);
    this.add(this.SpotLightEquipoA);


    // Foco B
    this.SpotLightEquipoB = new THREE.SpotLight(0xfcc603);
    this.SpotLightEquipoB.power = 450;
    this.SpotLightEquipoB.angle = Math.PI/8;
    this.SpotLightEquipoB.penumbra = 1;
    this.SpotLightEquipoB.position.set(0,5,7);
    this.add(this.SpotLightEquipoB);

    //this.mostrarLineasFocos();
  }

  mostrarLineasFocos() {
  if (!this.helperFocoA) {
    this.helperFocoA = new THREE.SpotLightHelper(this.SpotLightEquipoA);
    this.add(this.helperFocoA);
  }
  if (!this.helperFocoB) {
    this.helperFocoB = new THREE.SpotLightHelper(this.SpotLightEquipoB);
    this.add(this.helperFocoB);
  }
}

  setLightPower (valor) {
    this.sunLight.intensity = valor / 250.0; // Escalamos porque usamos intensidad en lugar de power
  }
  

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }
  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    var renderer = new THREE.WebGLRenderer();    
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);    
    renderer.setSize(window.innerWidth, window.innerHeight);    
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  setCamaraBatalla() {
    
  }
  
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);    
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    TWEEN.update();

    // === Activar el foco correspondiente ===
      this.SpotLightEquipoA.visible = false;
      this.SpotLightEquipoB.visible = false;

      if (this.equipo === 0) {
        this.SpotLightEquipoB.visible = true;
      } else {
        this.SpotLightEquipoA.visible = true;
      }

    if (this.stats) this.stats.update();  
    this.cameraControl.enabled = !(this.isCameraMoving || this.isCameraRotating);
  
    if (this.isCameraMoving) {
      this.cameraLerpAlpha += 0.01;
      if (this.cameraLerpAlpha >= 1) {
        this.cameraLerpAlpha = 1;
        this.isCameraMoving = false;
      }
  
      this.camera.position.lerpVectors(this.cameraStartPos, this.cameraEndPos, this.cameraLerpAlpha);
      this.camera.lookAt(new THREE.Vector3(3.5, 0, 3.5));
      this.cameraControl.target.set(3.5, 0, 3.5);
      this.cameraControl.update();
  
    }
  
    else if (this.isCameraRotating) {
      const totalRotation = Math.PI;
      const deltaAngle = this.rotationSpeed;
      this.rotationAngle += deltaAngle;
  
      if (this.rotationAngle >= totalRotation) {
        this.rotationAngle = totalRotation;
        this.isCameraRotating = false;
      }
  
      const angle = this.rotationAngle * this.rotationDirection;
      const x = this.startRotationVector.x * Math.cos(angle) - this.startRotationVector.z * Math.sin(angle);
      const z = this.startRotationVector.x * Math.sin(angle) + this.startRotationVector.z * Math.cos(angle);
  
      const newPos = new THREE.Vector3(x, this.startRotationVector.y, z).add(this.rotationCenter);
      this.camera.position.copy(newPos);
      this.camera.lookAt(this.rotationCenter);
      this.cameraControl.target.copy(this.rotationCenter);
      this.cameraControl.update();  
    } else {
      this.cameraControl.update();
    }
    
    this.renderer.render(this, this.getCamera());
    requestAnimationFrame(() => this.update());
  }
    
  
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());

  window.addEventListener('click', (event) => {
    scene.tablero.onPulsacion(event);    
  });

  
  scene.update();
});