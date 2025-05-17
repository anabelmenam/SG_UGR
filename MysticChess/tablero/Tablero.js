
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';
import { Pieza } from './Pieza.js';
import { Casilla } from './Casilla.js';

import { Caballo } from './Caballo.js';
import { Torre } from './Torre.js';
import { Alfil } from './Alfil.js';
import { Reina } from './Reina.js';
import { Rey } from './Rey.js';
import { PeonCaballero } from './PeonCaballero.js';
import { PeonMago } from './PeonMago.js';

class Tablero extends THREE.Object3D {
    constructor() {
        super();
        
        var material = new THREE.MeshNormalMaterial();
        this.casillas = [];

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.materialCasillaDestacada = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.casillasDestacadas = [];

        var marronClaro = 0xD2B48C;
        var marronOscuro = 0x5C3317;

        for( let i = 0; i < 8; i++ ) {
            this.casillas[i] = [];
            for( let j = 0; j < 8; j++ ) {
                var casilla = null;
                if( (i+j)%2 == 0 ) {
                    casilla = new Casilla(i-3.5,j-3.5, marronClaro);
                } else {
                    casilla = new Casilla(i-3.5,j-3.5, marronOscuro);
                }
                this.casillas[i][j] = casilla;
                this.add(casilla);
            }
        }

        this.inicializarTablero();
        this.generarPulsables();
    }

    inicializarTablero() {
        this.casillas[0][0].setPieza(new Torre(0, this.casillas[0][0], "torreCaballero1"));
        this.casillas[1][0].setPieza(new Caballo(0, this.casillas[1][0], "caballoCaballero1"));
        this.casillas[2][0].setPieza(new Alfil(0, this.casillas[2][0], "alfilCaballero1"));
        this.casillas[3][0].setPieza(new Reina(0, this.casillas[3][0], "reinaCaballero"));
        this.casillas[4][0].setPieza(new Rey(0, this.casillas[4][0], "reyCaballero"));
        this.casillas[5][0].setPieza(new Alfil(0, this.casillas[5][0], "alfilCaballero2"));
        this.casillas[6][0].setPieza(new Caballo(0, this.casillas[6][0], "caballoCaballero2"));
        this.casillas[7][0].setPieza(new Torre(0, this.casillas[7][0], "torreCaballero2"));
        for (let j = 0; j < 8; j++) {
            const nombre = "peonCaballero" + j;
            this.casillas[j][1].setPieza(new PeonCaballero(0, this.casillas[j][1], nombre));
        }
        
        this.casillas[0][7].setPieza(new Torre(1, this.casillas[0][7], "torreMago1"));
        this.casillas[1][7].setPieza(new Caballo(1, this.casillas[1][7], "caballoMago1"));
        this.casillas[2][7].setPieza(new Alfil(1, this.casillas[2][7], "alfilMago1"));
        this.casillas[3][7].setPieza(new Reina(1, this.casillas[3][7], "reinaMago"));
        this.casillas[4][7].setPieza(new Rey(1, this.casillas[4][7], "reyMago"));
        this.casillas[5][7].setPieza(new Alfil(1, this.casillas[5][7],"alfilMago2") );
        this.casillas[6][7].setPieza(new Caballo(1, this.casillas[6][7], "caballoMago2"));
        this.casillas[7][7].setPieza(new Torre(1, this.casillas[7][7], "torreMago2"));
        for (let j = 0; j < 8; j++) {
            const nombre = "peonMago" + j;
            this.casillas[j][6].setPieza(new PeonMago(1, this.casillas[j][6], nombre));
        }

    }
    
    setCamera(camera) {
        this.camera = camera;
    }    

    generarPulsables() {
        this.piezasPulsables = []; // Recolectamos las mallas de piezas
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const pieza = this.casillas[i][j].pieza;
                if (pieza) {
                    this.piezasPulsables.push(pieza.mesh);
                }
            }
        }
    }

    onPulsacion(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.objetosPulsados = this.raycaster.intersectObjects(this.piezasPulsables, true);

        if(this.piezaSeleccionada) {
            this.piezaSeleccionada.position.y = 0.5; // baja pieza seleccionada
            this.reiniciarCasillasDestacadas();
        }

        if (this.objetosPulsados.length > 0) {
            const intersect = this.objetosPulsados[0];
            const pieza = intersect.object.userData.pieza;
            if (pieza) {
                this.piezaSeleccionada = pieza;
                this.piezaSeleccionada.position.y = 1; // eleva pieza seleccionada

                console.log(`Pieza seleccionada: ${pieza.nombre}`);

                this.casillasPulsables = pieza.movimientosPosibles();
                console.log("Posibles casillas: ", this.casillasPulsables);
                this.casillasPulsables.forEach(([i, j]) => {
                    const casilla = this.casillas[i][j];
                    if (casilla) {
                        casilla.originalMaterial = casilla.children[0].material;
                        casilla.children[0].material = this.materialCasillaDestacada;
                        this.casillasDestacadas.push(casilla);
                    }
                });
            }
        }
    }

    pickCasilla(event) {
        if (this.piezaSeleccionada) { // SI HAY UNA PIEZA SELECCIONADA
            this.mouse.x = (event.clientX / window.innerWidth) * 2-1;
            this.mouse.y = 1-2 * (event.clientY / window.innerHeight);
    
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const casillasMeshes = this.casillasDestacadas.map(c => c.children[0]);
            this.casillasPulsadas = this.raycaster.intersectObjects(casillasMeshes, true);
    
            if (this.casillasPulsadas.length > 0) {
                const meshCasilla = this.casillasPulsadas[0].object;
                const casillaDestino = this.casillas.flat().find(c => c.children[0] === meshCasilla);
                console.log("Casilla destino: ", casillaDestino);
                if (casillaDestino) {
                    this.piezaSeleccionada.casillaActual.vaciarCasilla();
                    this.piezaSeleccionada.casillaActual = casillaDestino;
                    casillaDestino.setPieza(this.piezaSeleccionada);
                    this.piezaSeleccionada = null;
                    
                    this.reiniciarCasillasDestacadas();
                }
            }
        }
    }


    reiniciarCasillasDestacadas() {
        this.casillasDestacadas.forEach(casilla => {
            if (casilla.originalMaterial) {
                casilla.children[0].material = casilla.originalMaterial;
            }
        });
        this.casillasDestacadas = [];
    }



    createGUI (gui, titleGui) {
        this.guiControls = {
            resolucion: 20,
        }
        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'resolucion', 3, 50, 1).name('Resolucion: ').listen().onChange ( () =>this.updateGeometria() );
    }
}

export { Tablero };