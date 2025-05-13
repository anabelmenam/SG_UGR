
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';


class DecoracionTablero extends THREE.Object3D {
    constructor() {
        super();
        const loader = new THREE.TextureLoader();

        const texturaMadera = loader.load('./texturas/madera4.jpg'); 
        texturaMadera.wrapS = THREE.RepeatWrapping;
        texturaMadera.wrapT = THREE.RepeatWrapping;
        texturaMadera.repeat.set(1, 1); 
        texturaMadera.anisotropy = 16;

        const texturaPared = loader.load('./texturas/pared.jpg');
        texturaPared.wrapS = THREE.RepeatWrapping;
        texturaPared.wrapT = THREE.RepeatWrapping;
        texturaPared.repeat.set(1, 1); 
        texturaPared.anisotropy = 16;

        const gris     = 0x444444;
        


        const material = new THREE.MeshStandardMaterial({
            map: texturaMadera
        });

        const material1 = new THREE.MeshStandardMaterial({
            color: gris
        });

        const material2 = new THREE.MeshStandardMaterial({
            map: texturaPared
        });


        var evaluador = new CSG.Evaluator();
        
        var shape = new THREE.Shape();
        shape.moveTo(4.1,4.1);
        shape.lineTo(4.1,-4.1);
        shape.lineTo(-4.1,-4.1);
        shape.lineTo(-4.1,4.1);
        shape.lineTo(4.1,4.1);
        shape.lineTo(5.1,5.1);
        shape.lineTo(5.1,-5.1);
        shape.lineTo(-5.1,-5.1);
        shape.lineTo(-5.1,5.1);
        shape.lineTo(5.1,5.1);

        var extrudeSettings = {
            steps: 1,
            depth: 1,
            bevelEnabled: false
        };

        var shape1 = new THREE.Shape();
        shape1.moveTo(4,4);
        shape1.lineTo(4,-4);
        shape1.lineTo(-4,-4);
        shape1.lineTo(-4,4);
        shape1.lineTo(4,4);
        shape1.lineTo(5,5);
        shape1.lineTo(5,-5);
        shape1.lineTo(-5,-5);
        shape1.lineTo(-5,5);
        shape1.lineTo(5,5);

        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        var dec = new CSG.Brush(geometry, material);

        var geometry1 = new THREE.ExtrudeGeometry( shape1, extrudeSettings );
        var dec1 = new CSG.Brush(geometry1, material1);

        var borrar = new THREE.BoxGeometry(8.2,8.2,1);
        borrar = new CSG.Brush(borrar, material);

        var borrar1 = new THREE.BoxGeometry(8,8,1);
        borrar1 = new CSG.Brush(borrar1, material1);

        var figura = evaluador.evaluate(dec, borrar, CSG.SUBTRACTION);
        var figura1 = evaluador.evaluate(dec1, borrar1, CSG.SUBTRACTION);
        figura1 = evaluador.evaluate(figura1, figura, CSG.SUBTRACTION);
        figura.geometry.computeBoundingBox();
        figura.geometry.computeVertexNormals();
        figura.geometry.computeBoundingSphere();
        figura.geometry.computeUVs?.(); 

        figura = figura.geometry;
        figura1 = figura1.geometry;

        var pared = this.crearPared();
        pared.translate(0, 5.35, 0.25);
        pared = new THREE.Mesh(pared, material2);
        figura = new THREE.Mesh(figura, material);
        figura1 = new THREE.Mesh(figura1, material1);



        this.add(figura);
        this.add(figura1);
        this.add(pared);
    }

    crearPared(angulo, textura) {
        
        const material = new THREE.MeshStandardMaterial({
            map: textura
        });

        var evaluador = new CSG.Evaluator();
        
        var geometry = new THREE.BoxGeometry(10.2, 0.5, 1.5);
        var piedra = new THREE.BoxGeometry(0.5, 0.7, 0.4);
        piedra.translate(0, 0.05, 0);

        var pared = new CSG.Brush(geometry, material);
        piedra = new CSG.Brush(piedra, material);
        pared = evaluador.evaluate(pared, piedra, CSG.ADDITION);
        pared.geometry.computeBoundingBox();
        pared.geometry.computeVertexNormals();
        pared.geometry.computeBoundingSphere();
        pared.geometry.computeUVs?.(); 
        pared = pared.geometry;


        return pared;
    }


  

}


export { DecoracionTablero };