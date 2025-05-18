
import * as THREE from '../libs/three.module.js';
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
        this.turnoEquipo = 1;
        this.piezaPulsada = false;
        this.onCambioTurno = null;

        var material = new THREE.MeshNormalMaterial();
        this.casillas = [];
        this.caminoPulsable = [];

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        var marronClaro = 0xD2B48C;
        var marronOscuro = 0x5C3317;

        for ( let i = 0; i < 8; i++ ) {
            this.casillas[i] = [];
            for ( let j = 0; j < 8; j++ ) {
                var casilla = null;
                if( (i+j)%2 == 0 ) {
                    casilla = new Casilla(i,j, marronClaro);
                } else {
                    casilla = new Casilla(i,j, marronOscuro);
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

    pasarTurno() {
        this.turnoEquipo = this.turnoEquipo ? 0 : 1;

        if (this.onCambioTurno) {
            this.onCambioTurno(this.turnoEquipo); 
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
                if (pieza && pieza.equipo === this.turnoEquipo) {
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
    
        if (this.objetosPulsados.length > 0) {
            const intersect = this.objetosPulsados[0];
            const piezaActual = intersect.object.userData.pieza;
    
            if (this.piezaPulsada && piezaActual === this.piezaSeleccionada) {
                // Deseleccionar la pieza si se vuelve a pulsar la misma
                this.reiniciarCamino();
                this.piezaSeleccionada.position.y = 0.5; // devuelve a altura normal
                this.piezaPulsada = false;
                this.piezaSeleccionada = null;
                return;
            }
    
            // Si se selecciona una pieza distinta
            this.reiniciarCamino(); // Limpia caminos anteriores si los hay
            if(this.piezaSeleccionada) {
                this.piezaSeleccionada.position.y= 0.5;
            }
                
    
            if (piezaActual) {
                this.piezaSeleccionada = piezaActual;
                this.piezaPulsada = true;
                this.piezaSeleccionada.position.y = 1;
    
                this.caminoPulsable = this.piezaSeleccionada.movimientosPosibles(this.casillas);
                //this.caminoPulsable = this.camnino.filter((casilla) => casilla.pieza === null);
                this.destacarCamino();
    
                // Solo añadir listener una vez
                if (!this.casillaListenerAdded) {
                    this.casillaListenerAdded = true;
                    window.addEventListener('click', (evento) => {
                        this.onPulsacionCasilla(evento);
                    });
                }
            }
        }
    }
    

    onPulsacionCasilla(event) {
        if (this.piezaPulsada) { // Si hay una pieza seleccionada
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

            this.raycaster.setFromCamera(this.mouse, this.camera);
            this.casillasPulsadas = this.raycaster.intersectObjects(this.caminoPulsable, true);
            
            if (this.casillasPulsadas.length > 0) {
                this.intersectCasilla = this.casillasPulsadas[0];
                const casilla = this.intersectCasilla.object.userData.casilla;
                if (casilla && casilla !== this.piezaSeleccionada.casilla) {
                    this.piezaSeleccionada.moverPieza(casilla);
                    this.pasarTurno();
                }
                
                this.reiniciarCamino();
            }    
        }
    }

    destacarCamino() {
        for (let i = 0; i < this.caminoPulsable.length; i++) {
            const casilla = this.caminoPulsable[i];
            casilla.hacerPulsable();
        }   
    }

    reiniciarCamino() {
        if (!this.caminoPulsable || this.caminoPulsable.length === 0) return;
    
        for (let i = 0; i < this.caminoPulsable.length; i++) {
            const casilla = this.caminoPulsable[i];
            casilla.retomarColor();
        }
    
        this.caminoPulsable = [];
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