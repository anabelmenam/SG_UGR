

import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

import { OBJLoader } from '../libs/OBJLoader.js';
import { MTLLoader } from '../libs/MTLLoader.js';




class Escudo extends THREE.Object3D {

    constructor (material) {
        super();
        this.evaluador = new CSG.Evaluator();
        this.material = new THREE.MeshStandardMaterial({color:0x444444});

        this.loadModelo();
        
        
    }


    loadModelo() {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath('../objs/');

        mtlLoader.load('shield.mtl', (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('../objs/');

            objLoader.load('shield.obj', (obj) => {
                obj.scale.set(0.05, 0.05, 0.05); 
                obj.rotation.set(Math.PI/2, 0, 0);
                obj.position.set(0, 0, 0); 

                this.add(obj);
            });
        });
    }





}




export {Escudo};


