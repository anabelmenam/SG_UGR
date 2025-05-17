
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

        const texturaPared = loader.load('./texturas/image.png');
        texturaPared.wrapS = THREE.RepeatWrapping;
        texturaPared.wrapT = THREE.RepeatWrapping;
        texturaPared.repeat.set(10, 1); 
        texturaPared.anisotropy = 16;

        const texturaTorre = loader.load('./texturas/image.png');
        texturaTorre.wrapS = THREE.RepeatWrapping;
        texturaTorre.wrapT = THREE.RepeatWrapping;
        texturaTorre.anisotropy = 16;
        texturaTorre.repeat.set(1, 2); 


        const gris     = 0x800080;
        


        const material = new THREE.MeshStandardMaterial({
            map: texturaMadera
        });

        const material1 = new THREE.MeshStandardMaterial({
            color: gris
        });

        const material2 = new THREE.MeshStandardMaterial({
            map: texturaPared
        });

        const material3 = new THREE.MeshStandardMaterial({
            map: texturaTorre
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

        var pared1 = this.crearPared(texturaPared);
        pared1.translate(0, 5.35, 0.25);
        var pared2 = this.crearPared(texturaPared);
        pared2.translate(0, -5.35, 0.25);
        //pared2.rotateY(Math.PI);
        var pared3 = this.crearPared(texturaPared);
        pared3.translate(0, 5.35, 0.25);
        pared3.rotateZ(Math.PI / 2);
        var pared4 = this.crearPared(texturaPared);
        pared4.translate(0, -5.35, 0.25);
        pared4.rotateZ(Math.PI / 2);

        pared1 = new THREE.Mesh(pared1, material2);
        pared2 = new THREE.Mesh(pared2, material2);
        pared3 = new THREE.Mesh(pared3, material2);
        pared4 = new THREE.Mesh(pared4, material2);
        figura = new THREE.Mesh(figura, material);
        figura1 = new THREE.Mesh(figura1, material1);


        const torre1 = new THREE.Mesh(this.crearTorre(material2), material3);
        torre1.position.set(5.35, 5.35, 0.25);

        const torre2 = new THREE.Mesh(this.crearTorre(material2), material3);
        torre2.position.set(-5.35, 5.35, 0.25);

        const torre3 = new THREE.Mesh(this.crearTorre(material2), material3);
        torre3.position.set(5.35, -5.35, 0.25);

        const torre4 = new THREE.Mesh(this.crearTorre(material2), material3);
        torre4.position.set(-5.35, -5.35, 0.25);





        this.add(figura);
        this.add(figura1);
        this.add(pared1);
        this.add(pared2);
        this.add(pared3);
        this.add(pared4);
        this.add(torre1);
        this.add(torre2);
        this.add(torre3);
        this.add(torre4);
    }


    crearPared( textura) {
        
        const material = new THREE.MeshStandardMaterial({
            map: textura
        });



        let evaluador = new CSG.Evaluator();
        
        let pared = new THREE.BoxGeometry(10.2, 0.5, 1.5);
        

        pared = new CSG.Brush(pared, material);

        for(let i = 0; i < 10; i+=1){
            let hueco = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            hueco.translate(-5.5+i, 0, -0.7);
            hueco.translate(1,0,0);
            hueco = new CSG.Brush(hueco, material);
            pared = evaluador.evaluate(pared, hueco, CSG.SUBTRACTION);

        }

        
        pared = pared.geometry;

        return pared;
    }

    crearTorre(material) {
    const evaluador = new CSG.Evaluator();

    const paredes = [];

    // Pared frontal
    let pared1 = new THREE.BoxGeometry(1, 0.5, 2);
    pared1.translate(0,0.3,-0.2);
    paredes.push(new CSG.Brush(pared1, material));
    

    // Pared trasera
    let pared2 = new THREE.BoxGeometry(1, 0.5, 2);
    pared2.translate(0, -0.3,-0.2);
    paredes.push(new CSG.Brush(pared2, material));


    // Pared izquierda
    let pared3 = new THREE.BoxGeometry(1, 0.5, 2);
    pared3.rotateZ(Math.PI / 2);
    pared3.translate(0.3,0,-0.2);
    paredes.push(new CSG.Brush(pared3, material));

    // Pared derecha
    let pared4 = new THREE.BoxGeometry(1, 0.5, 2);
    pared4.rotateZ(Math.PI / 2);
    pared4.translate(-0.3,0, -0.2);
    paredes.push(new CSG.Brush(pared4, material));

    let techo = new THREE.BoxGeometry(1, 1, 0.5);
    techo.translate(0, 0, -0.96);
    paredes.push(new CSG.Brush(techo, material));
    
    let suelo = new THREE.BoxGeometry(1, 1, 0.5);
    suelo.translate(0, 0, 0.56);
    paredes.push(new CSG.Brush(suelo, material));

    // Unir todas las paredes en un solo cuerpo
    let torre = paredes.reduce((acc, pared) => evaluador.evaluate(acc, pared, CSG.ADDITION));

    let hueco = new THREE.BoxGeometry(0.4, 0.4, 2);
    hueco.translate(0, 0, -0.2);
    hueco = new CSG.Brush(hueco, material);

    let cruz1 = new THREE.BoxGeometry(10, 0.4, 0.5);
    cruz1.translate(0, 0, -1.2);
    let cruz2 = new THREE.BoxGeometry(0.4, 10, 0.5);
    cruz2.translate(0, 0, -1.2);
    cruz1 = new CSG.Brush(cruz1, material);
    cruz2 = new CSG.Brush(cruz2, material);
    let cruz = evaluador.evaluate(cruz1, cruz2, CSG.ADDITION);

    torre = evaluador.evaluate(torre, hueco, CSG.SUBTRACTION);
    torre = evaluador.evaluate(torre, cruz, CSG.SUBTRACTION);


    

    return torre.geometry;
}




  

}


export { DecoracionTablero };