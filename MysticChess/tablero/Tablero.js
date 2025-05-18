
import * as THREE from '../libs/three.module.js';
import { Casilla } from './Casilla.js';
import { Caballo } from './Caballo.js';
import { Torre } from './Torre.js';
import { Alfil } from './Alfil.js';
import { Reina } from './Reina.js';
import { Rey } from './Rey.js';
import { PeonCaballero } from './PeonCaballero.js';
import { PeonMago } from './PeonMago.js';
import {Animator} from './Animator.js';

class Tablero extends THREE.Object3D {
    constructor() {
        super();
        this.turnoEquipo = 1;
        this.piezaPulsada = false;
        this.onCambioTurno = null;

        var material = new THREE.MeshNormalMaterial();
        this.casillas = [];
        this.caminoPulsable = [];

        this.animator = new Animator();

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
        this.inicializarCementerios();
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
        this.generarPulsables();
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

        // Intentamos primero pulsar una pieza del equipo actual
        const piezasPulsadas = this.raycaster.intersectObjects(this.piezasPulsables, true);
        if (piezasPulsadas.length > 0) {
            const intersect = piezasPulsadas[0];
            const piezaActual = intersect.object.userData.pieza;

            if (this.piezaPulsada && piezaActual === this.piezaSeleccionada) {
                // Deselección de la misma pieza
                this.reiniciarCamino();
                this.piezaSeleccionada.position.y = 0.5;
                this.piezaSeleccionada = null;
                this.piezaPulsada = false;
            } else {
                // Selección de nueva pieza
                this.reiniciarCamino();
                if (this.piezaSeleccionada) this.piezaSeleccionada.position.y = 0.5;

                this.piezaSeleccionada = piezaActual;
                this.piezaSeleccionada.position.y = 1;
                this.piezaPulsada = true;

                this.caminoPulsable = this.piezaSeleccionada.movimientosPosibles(this.casillas);
                this.destacarCamino();
            }

            return;
        }

        // Si no pulsamos una pieza, puede ser una casilla valida del camino
        if (this.piezaPulsada && this.caminoPulsable.length > 0) {
            const casillasPulsadas = this.raycaster.intersectObjects(this.caminoPulsable, true);
            if (casillasPulsadas.length > 0) {
                const casilla = casillasPulsadas[0].object.userData.casilla;
                if (casilla && casilla !== this.piezaSeleccionada.casilla) {
                    //Si la casilla tiene una pieza, la comemos
                    if(casilla.pieza != null) {
                        if(this.piezaSeleccionada instanceof Torre) {
                            this.combateTorre(casilla.pieza);
                        }
                        this.comerPieza(casilla.pieza);
                    }
                    var wait = $.Deferred();
                    const from = this.piezaSeleccionada.position;
                    const to = new THREE.Vector3(casilla.posI, 0.5, casilla.posJ);

                    this.animator.setAndStart(from, to, 500, wait);
                    wait.done(() => {
                        this.piezaSeleccionada.moverPieza(casilla);
                        this.piezaSeleccionada.position.y = 0.5;
                        this.reiniciarCamino();
                        this.piezaSeleccionada = null;
                        this.piezaPulsada = false;
                        this.pasarTurno();
                        this.generarPulsables();
                    })
                }
            }
        }
    }

    combateTorre(piezaObjetivo) {
        let cementerio = piezaObjetivo.equipo === 0 ? this.cementerioBlancas.pop() : this.cementerioNegras.pop();
        const torre = this.piezaSeleccionada;
        
        const torrePos = torre.position.clone();
        const objetivoPos = piezaObjetivo.position.clone();

        // Posición delante del objetivo (dependiendo de la dirección X o Z)
        const frente = objetivoPos.clone();
        if (Math.abs(torrePos.x - objetivoPos.x) > Math.abs(torrePos.z - objetivoPos.z)) {
            frente.x += torrePos.x < objetivoPos.x ? -1 : 1;
        } else {
            frente.z += torrePos.z < objetivoPos.z ? -1 : 1;
        }

        const wait1 = $.Deferred();
        const wait2 = $.Deferred();
        const waitFinal = $.Deferred();

        // Paso 1: La torre se mueve frente al objetivo
        this.animator.setAndStart(torrePos, frente, 500, wait1);

        wait1.done(() => {
            // Paso 2: Mover brazo de espada
            /*if (torre.brazoDch) {
                torre.brazoDch.rotation.z = -Math.PI / 4;
            }
            setTimeout(() => {
                if (torre.brazoDch) {
                    torre.brazoDch.rotation.z = -2 * Math.PI / 4;
                }
                // Paso 3: Matar ficha objetivo y mandarla al cementerio
                this.animator.mandarCementerio(piezaObjetivo.position.clone(), new THREE.Vector3(cementerio.posI, 0.5, cementerio.posJ), 500, wait2);

                wait2.done(() => {
                    piezaObjetivo.rotation.y = -Math.PI / 2;
                    cementerio.setPieza(piezaObjetivo);

                    // Brazo vuelve a posición original
                    if (torre.brazoDch) {
                        torre.brazoDch.rotation.z = -Math.PI / 4;
                    }

                    waitFinal.resolve();
                });
            }, 500);*/
            piezaObjetivo.rotation.y = -Math.PI / 2;
            cementerio.setPieza(piezaObjetivo);
        });

        waitFinal.done(() => {
            // Finalizar turno o movimiento
            const destino = piezaObjetivo.casillaActual;
            torre.moverPieza(destino);
            torre.position.set(destino.posI, 0.5, destino.posJ);
            this.reiniciarCamino();
            this.piezaSeleccionada = null;
            this.piezaPulsada = false;
            this.pasarTurno();
            this.generarPulsables();
        });
    }


    comerPieza(pieza) {
        let cementerio = null;
        if (pieza.equipo === 0) {
            cementerio = this.cementerioBlancas.pop();
        } else {
            cementerio = this.cementerioNegras.pop();
        }

        // ANIMACIÓN EN TRES PASOS
        const wait1 = $.Deferred();
        const wait2 = $.Deferred();
        const wait3 = $.Deferred();

        const piezaPos = pieza.position; // Este será el objeto animado

        const subida = piezaPos.clone();
        subida.y = 2;

        const desplazamiento = new THREE.Vector3(cementerio.posI, 2, cementerio.posJ);

        const bajada = new THREE.Vector3(cementerio.posI, 0.5, cementerio.posJ);

        this.animator.setAndStart(piezaPos, subida, 250, wait1);

        wait1.done(() => {
            this.animator.setAndStart(piezaPos, desplazamiento, 500, wait2);
        });

        wait2.done(() => {
            this.animator.setAndStart(piezaPos, bajada, 250, wait3);
        });

        wait3.done(() => {
            pieza.rotation.y = -Math.PI / 2;
            cementerio.setPieza(pieza);
        });
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

    inicializarCementerios() {
        const blanco = new THREE.Color(0xffffff);
        this.cementerioBlancas = [];
        this.cementerioNegras = [];
        
        // Cementerio de blancas (izquierda)
        for (let i=0; i<2; i++) {
            for (let j=0; j<8; j++) {
                let casilla = new Casilla(-3-i, j, blanco, true);
                this.cementerioNegras.push(casilla);
                this.add(casilla);
            }
        }
    
        // Cementerio de negras (derecha)
        for (let i=0; i<2; i++) {
            for (let j=0; j < 8; j++) {
                let casilla = new Casilla(10+i, j, blanco, true);
                this.cementerioBlancas.push(casilla);
                this.add(casilla);
            }
        } 
    }
    

    comerFicha() {

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