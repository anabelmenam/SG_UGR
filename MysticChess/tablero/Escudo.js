

import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

import { OBJLoader } from '../libs/OBJLoader.js';
import { MTLLoader } from '../libs/MTLLoader.js';




class Escudo extends THREE.Object3D {

    static modeloBase = null;

    static loadEscudo(callback) {
        if (this.modeloBase) {
            callback(this.modeloBase.clone(true));
            return;
        }

        const mtlLoader = new MTLLoader();
        mtlLoader.setPath('../objs/');

        mtlLoader.load('shield.mtl', (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('../objs/');

            objLoader.load('shield.obj', (obj) => {
                obj.scale.set(0.1, 0.1, 0.1);
                obj.rotation.x = Math.PI/2;
                obj.rotation.y = Math.PI;
                obj.rotation.z = 3*Math.PI/2;
                this.modeloBase = obj;
                callback(obj.clone(true));
            });
        });
    }





}




export {Escudo};


