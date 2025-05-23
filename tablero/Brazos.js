import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Escudo} from './Escudo.js';
import {Espada} from './Espada.js';
import {Varita} from './Varita.js';

class Brazos extends THREE.Object3D {
    constructor (material, resolucion) {
        super();
        this.material = material;
        this.resolucion = resolucion;
    }

    createBrazoDerecho(equipo) {
        const brazo = new THREE.Object3D();

        // ESFERA HOMBRO
        const hombro = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 32, 32, this.resolucion, this.resolucion),
            this.material
        );
        hombro.position.set(0, 0, 0);

        // BRAZO SUPERIOR (cilindro + rotación)
        const brazoSuperior = new THREE.Object3D();

        const meshBrazoSuperior = new THREE.Mesh( new THREE.CylinderGeometry(0.45, 0.45, 2.5, this.resolucion), this.material);
        meshBrazoSuperior.rotation.z = Math.PI/2;
        meshBrazoSuperior.position.x = 1.5;

        brazoSuperior.add(meshBrazoSuperior);
        brazoSuperior.rotation.z = 4*Math.PI/3; 
        brazoSuperior.rotation.y = Math.PI/2;
        brazoSuperior.position.set(0, 0, 0);

        // CODO
        const codo = new THREE.Object3D();
        const meshCodo = new THREE.Mesh( new THREE.SphereGeometry(0.5, 32, 32), this.material);
        meshCodo.position.set(0, 0, 0);
        codo.add(meshCodo);
        codo.position.x = 3;

        brazoSuperior.add(codo);

        // ANTEBRAZO
        const antebrazo = new THREE.Object3D();
        const meshAntebrazo = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.3, this.resolucion), this.material);
        meshAntebrazo.rotation.z = Math.PI/2;
        meshAntebrazo.position.x = 0.75;

        antebrazo.add(meshAntebrazo);
        antebrazo.position.x = 0.5;
        antebrazo.position.y = -0.5;
        antebrazo.rotation.z = -Math.PI/4;
        codo.add(antebrazo);

        // MANO
        const mano = new THREE.Object3D();
        const meshMano = new THREE.Mesh(new THREE.SphereGeometry(0.45, this.resolucion, this.resolucion), this.material);
        meshMano.position.x = 1;
        mano.add(meshMano);
        mano.position.x = 1;
        antebrazo.add(mano);

        //ESPADA
        if(equipo == 0) {
            Espada.loadEspada((espada) => {
                mano.add(espada);
            });
        } else {
            Varita.loadVarita((varita) => {
                
                mano.add(varita);
            });
        }

        // Montaje final
        hombro.add(brazoSuperior)
        brazo.add(hombro);
        //brazo.add(brazoSuperior);

        // Referencias
        brazo.hombro = hombro
        brazo.codo = codo;
        brazo.antebrazo = antebrazo;
        brazo.mano = mano;

        return brazo;
    }

    createBrazoIzquierdo(equipo) {
        const brazo = new THREE.Object3D();

        // HOMBRO
        const hombro = new THREE.Mesh(new THREE.SphereGeometry(0.6, this.resolucion, this.resolucion), this.material);
        hombro.position.set(0, 0, 0);

        // BRAZO SUPERIOR (cilindro + rotación)
        const brazoSuperior = new THREE.Object3D();
        const meshBrazoSuperior = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.5, this.resolucion), this.material);
        meshBrazoSuperior.rotation.z = Math.PI/2;
        meshBrazoSuperior.position.x = -1.5;

        brazoSuperior.add(meshBrazoSuperior);
        brazoSuperior.rotation.z = -4*Math.PI/3; // invertido para brazo izquierdo
        brazoSuperior.rotation.y = -Math.PI / 2;
        brazoSuperior.position.set(0, 0, 0);

        // CODO
        const codo = new THREE.Object3D();
        const meshCodo = new THREE.Mesh(new THREE.SphereGeometry(0.5, this.resolucion, this.resolucion),this.material);
        meshCodo.position.set(0, 0, 0);
        codo.add(meshCodo);
        codo.position.x = -3; 
        
        brazoSuperior.add(codo);

        // ANTEBRAZO
        const antebrazo = new THREE.Object3D();
        const cilindro2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.3, this.resolucion),this.material);
        cilindro2.rotation.z = Math.PI/2;
        cilindro2.position.x = -0.75;

        antebrazo.add(cilindro2);
        antebrazo.position.x = -0.5;
        antebrazo.position.y = -0.5;
        antebrazo.rotation.z = Math.PI/4;

        codo.add(antebrazo);

        // MANO
        const mano = new THREE.Object3D();
        const esferaMano = new THREE.Mesh(new THREE.SphereGeometry(0.45, this.resolucion, this.resolucion),this.material);
        esferaMano.position.x = -1;
        mano.add(esferaMano);
        mano.position.x = -1;
        antebrazo.add(mano);

        // ESCUDO
        if(equipo == 0) {
            Escudo.loadEscudo((escudo) => {
                escudo.position.set(-1, 0, 0);
                mano.add(escudo);
            });

        }
        
        // Montaje final
        brazo.add(hombro);
        brazo.add(brazoSuperior);

        // Referencias
        brazo.codo = codo;
        brazo.antebrazo = antebrazo;
        brazo.mano = mano;

        return brazo;
    }   
}

export { Brazos };