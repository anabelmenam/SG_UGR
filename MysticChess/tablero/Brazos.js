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
        const esferaHombro = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 32, 32, this.resolucion, this.resolucion),
            this.material
        );
        esferaHombro.position.set(0, 0, 0);

        // BRAZO SUPERIOR (cilindro + rotación)
        const segmentoSuperior = new THREE.Object3D();

        const cilindro1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.45, 2.5, this.resolucion),
            this.material
        );
        cilindro1.rotation.z = Math.PI / 2;
        cilindro1.position.x = 1.5;

        segmentoSuperior.add(cilindro1);
        segmentoSuperior.rotation.z = 4* Math.PI / 3; 
        segmentoSuperior.rotation.y = Math.PI / 2;
        //segmentoSuperior.rotation.z = Math.PI / 2;
        segmentoSuperior.position.set(0, 0, 0);

        // CODO
        const esferaCodo = new THREE.Object3D();
        const mCodo = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            this.material
        );
        mCodo.position.set(0, 0, 0);
        esferaCodo.add(mCodo);
        esferaCodo.position.x = 3;

        segmentoSuperior.add(esferaCodo);

        // ANTEBRAZO
        const antebrazo = new THREE.Object3D();
        const cilindro2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 2.3, this.resolucion),
            this.material
        );
        cilindro2.rotation.z = Math.PI / 2;
        cilindro2.position.x = 0.75;

        antebrazo.add(cilindro2);
        antebrazo.position.x = 0.5;
        antebrazo.position.y = -0.5;
        antebrazo.rotation.z = -Math.PI / 4;
        esferaCodo.add(antebrazo);

        // MANO
        const mano = new THREE.Object3D();
        const esferaMano = new THREE.Mesh(
            new THREE.SphereGeometry(0.45, this.resolucion, this.resolucion),
            this.material
        );
        esferaMano.position.x = 1;
        mano.add(esferaMano);
        mano.position.x = 1;
        antebrazo.add(mano);

        //ESPADA
        if(equipo == 0) {
            Espada.loadEspada((espada) => {
                
                mano.add(espada);
            });
            
        }
        /*else {
            Varita.loadVarita((varita) => {
                
                mano.add(varita);
            });
        }*/

        // Montaje final
        brazo.add(esferaHombro);
        brazo.add(segmentoSuperior);

        // Referencias
        brazo.codo = esferaCodo;
        brazo.antebrazo = antebrazo;
        brazo.mano = mano;

        return brazo;
    }

    createBrazoIzquierdo(equipo) {
        const brazo = new THREE.Object3D();

        // ESFERA HOMBRO
        const esferaHombro = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, this.resolucion, this.resolucion),
            this.material
        );
        esferaHombro.position.set(0, 0, 0);

        // BRAZO SUPERIOR (cilindro + rotación)
        const segmentoSuperior = new THREE.Object3D();

        const cilindro1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.45, 2.5, this.resolucion),
            this.material
        );
        cilindro1.rotation.z = Math.PI / 2;
        cilindro1.position.x = -1.5; // reflejado

        segmentoSuperior.add(cilindro1);
        segmentoSuperior.rotation.z = -4 * Math.PI / 3; // invertido para brazo izquierdo
        segmentoSuperior.rotation.y = -Math.PI / 2;
        segmentoSuperior.position.set(0, 0, 0);

        // CODO
        const esferaCodo = new THREE.Object3D();
        const mCodo = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, this.resolucion, this.resolucion),
            this.material
        );
        mCodo.position.set(0, 0, 0);
        esferaCodo.add(mCodo);
        esferaCodo.position.x = -3; // reflejado

        segmentoSuperior.add(esferaCodo);

        // ANTEBRAZO
        const antebrazo = new THREE.Object3D();
        const cilindro2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 2.3, this.resolucion),
            this.material
        );
        cilindro2.rotation.z = Math.PI / 2;
        cilindro2.position.x = -0.75; // reflejado

        antebrazo.add(cilindro2);
        antebrazo.position.x = -0.5;
        antebrazo.position.y = -0.5;
        antebrazo.rotation.z = Math.PI / 4; // invertido para doblar igual

        esferaCodo.add(antebrazo);

        // MANO
        const mano = new THREE.Object3D();
        const esferaMano = new THREE.Mesh(
            new THREE.SphereGeometry(0.45, this.resolucion, this.resolucion),
            this.material
        );
        esferaMano.position.x = -1;
        mano.add(esferaMano);
        mano.position.x = -1;
        antebrazo.add(mano);

        // ESCUDO
        /*if(equipo == 0) {
            Escudo.loadEscudo((escudo) => {
                escudo.position.set(-1, 0, 0);
                mano.add(escudo);
            });

        }*/
        
        // Montaje final
        brazo.add(esferaHombro);
        brazo.add(segmentoSuperior);

        // Referencias
        brazo.codo = esferaCodo;
        brazo.antebrazo = antebrazo;
        brazo.mano = mano;

        return brazo;
    }   
}

export { Brazos };