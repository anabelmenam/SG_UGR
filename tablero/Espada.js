

import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { OBJLoader } from '../libs/OBJLoader.js';
import { MTLLoader } from '../libs/MTLLoader.js';

class Espada extends THREE.Object3D {

    static modeloBase = null;

    static loadEspada(callback) {
        if (this.modeloBase) {
            callback(this.modeloBase.clone(true));
            return;
        }

        const mtlLoader = new MTLLoader();
        mtlLoader.setPath('../objs/');

        mtlLoader.load('sword.mtl', (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('../objs/');

            objLoader.load('sword.obj', (obj) => {
                obj.scale.set(0.02, 0.02, 0.02);
                obj.rotation.x = Math.PI/2;
                obj.rotation.y = -Math.PI/3;
                obj.rotation.z = 3*Math.PI/2;
                obj.position.set(1, 0, 0);
                this.modeloBase = obj;
                callback(obj.clone(true));
            });
        });
    }
}

export {Espada};