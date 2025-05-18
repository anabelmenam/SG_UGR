
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import  Stats from '../libs/stats.module.js'

// Clases de mi proyecto
import { Tablero } from './Tablero.js'
import { DecoracionTablero } from './DecoracionTablero.js'

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
    this.tablero.position.set(0, 0, 0);
    this.add(this.tablero);
    this.tablero.setCamera(this.camera);

    this.decoracionTablero = new DecoracionTablero();
    this.decoracionTablero.rotateX(Math.PI/2);
    this.decoracionTablero.position.set(3.5, 0.5, 3.5);
    this.add(this.decoracionTablero);


    // VARIABLES PARA ANIMACION DE CAMARA
    this.isCameraRotating = false;
    this.rotationAngle = 0;
    this.rotationSpeed = Math.PI / 90; // velocidad del giro
    this.rotationCenter = new THREE.Vector3(3.5, 0, 3.5); // centro del tablero
    this.cameraRadius = this.camera.position.distanceTo(this.rotationCenter);
    this.startRotationVector = new THREE.Vector3(); // se usará para guardar la posición inicial
    

    this.tablero.onCambioTurno = () => {
      this.isCameraRotating = true;
      this.rotationAngle = 0;
      this.cameraRadius = this.camera.position.distanceTo(this.rotationCenter);
      this.startRotationVector.subVectors(this.camera.position, this.rotationCenter);
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
    this.camera.position.set (3, 16, 18);
    var look = new THREE.Vector3 (3 , -2, 1);     // Y hacia dónde mira

    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 2;
    this.cameraControl.zoomSpeed = -1;
    this.cameraControl.panSpeed = 0.2;

    this.cameraControl.target = look; // Debe orbitar con respecto al punto de mira de la cámara
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
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    // La añadimos a la escena
    this.add (this.ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.pointLight = new THREE.PointLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 3, 1 );
    this.add (this.pointLight);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    if (this.stats) this.stats.update();
  
    // Desactivar controles mientras la cámara se mueve
    this.cameraControl.enabled = !(this.isCameraMoving || this.isCameraRotating);
  
    // Movimiento de cámara para el turno de blancas
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
  
    // Rotación de cámara para el turno de negras
    else if (this.isCameraRotating) {
      const totalRotation = Math.PI;
      const deltaAngle = this.rotationSpeed;
      this.rotationAngle += deltaAngle;
  
      if (this.rotationAngle >= totalRotation) {
        this.rotationAngle = totalRotation;
        this.isCameraRotating = false;
        console.log("Animación de rotación (negras) finalizada.");
      }
  
      const angle = this.rotationAngle;
      const x = this.startRotationVector.x * Math.cos(angle) - this.startRotationVector.z * Math.sin(angle);
      const z = this.startRotationVector.x * Math.sin(angle) + this.startRotationVector.z * Math.cos(angle);
  
      const newPos = new THREE.Vector3(x, this.startRotationVector.y, z).add(this.rotationCenter);
      this.camera.position.copy(newPos);
      this.camera.lookAt(this.rotationCenter);
      this.cameraControl.target.copy(this.rotationCenter);
      this.cameraControl.update();
  
      console.log(`Rotación: ${(this.rotationAngle * 180 / Math.PI).toFixed(2)}°`);
    }
  
    // Sin animación, solo control manual
    else {
      this.cameraControl.update();
    }
  
    // Logs de posición y punto de mira
    const pos = this.camera.position;
    const look = this.cameraControl.target;
    console.log(`Posición cámara: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`);
    console.log(`Look at (target): x=${look.x.toFixed(2)}, y=${look.y.toFixed(2)}, z=${look.z.toFixed(2)}`);
  
    this.renderer.render(this, this.getCamera());
    requestAnimationFrame(() => this.update());
  }
  
  
  
}

/// La función   main
$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());

  window.addEventListener('click', (event) => {
    scene.tablero.onPulsacion(event);    
  });

  
  scene.update();
});