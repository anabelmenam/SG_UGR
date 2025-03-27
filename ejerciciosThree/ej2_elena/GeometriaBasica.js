import * as THREE from '../libs/three.module.js';

class Cubo extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        // Crear geometría y material
        this.geometria = new THREE.BoxGeometry(this.guiControls.sizeX, this.guiControls.sizeY, this.guiControls.sizeZ);
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        // Crear el cubo y almacenarlo
        this.box = new THREE.Mesh(this.geometria, material);
        this.box.position.set(0,0,0)//(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

        this.add(this.box);
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            sizeX: 1,
            sizeY: 1,
            sizeZ: 1
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'sizeX', 1, 3, 0.1).name('Dimensión X: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'sizeY', 1, 3, 0.1).name('Dimensión Y: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'sizeZ', 1, 3, 0.1).name('Dimensión Z: ').listen().onChange(() => this.updateGeometria());
    }

    update() {
        this.box.rotateX(0.03);
        this.box.rotateZ(-0.01);
        this.box.rotateY(0.005);
        //this.box.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);
    }
    
    updateGeometria() {
        this.box.geometry.dispose();  // Libera la memoria de la geometría anterior
        this.box.geometry = new THREE.BoxGeometry(this.guiControls.sizeX, this.guiControls.sizeY, this.guiControls.sizeZ);
    }  
}

class Cono extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        // Crear geometría y material
        this.geometria = new THREE.ConeGeometry(this.guiControls.Radio, this.guiControls.Altura, this.guiControls.Resolucion);
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        // Crear el cono y almacenarlo
        this.cono = new THREE.Mesh(this.geometria, material);
        this.cono.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

        this.add(this.cono);
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            Radio: 1,
            Altura: 2,
            Resolucion: 3,
            posX: 0.0,
            posY: 0.0,
            posZ: -5.0
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'Radio', 1, 3, 0.1).name('Radio: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'Altura', 1, 3, 0.1).name('Altura: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'Resolucion', 3, 70, 1).name('Resolucion: ').listen().onChange(() => this.updateGeometria());
    }

    update() {
        this.cono.rotateX(0.03);
        this.cono.rotateZ(-0.01);
        this.cono.rotateY(0.005);
    }
    
    updateGeometria() {
        this.cono.geometry.dispose();  // Libera la memoria de la geometría anterior
        this.cono.geometry = new THREE.ConeGeometry(this.guiControls.Radio, this.guiControls.Altura, this.guiControls.Resolucion);
    }
}

class Cilindro extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        // Crear geometría y material
        this.geometria = new THREE.CylinderGeometry(this.guiControls.RadioTop, this.guiControls.RadioBottom, this.guiControls.Altura, this.guiControls.SegmentosR);
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        // Crear el cilindro y almacenarlo
        this.cilindro = new THREE.Mesh(this.geometria, material);
        this.cilindro.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

        this.add(this.cilindro);
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            RadioTop: 0.5,
            RadioBottom: 0.5,
            Altura: 1,
            SegmentosR: 3,
            posX: 0.0,
            posY: 0.0,
            posZ: 5.0
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'RadioTop', 0.5, 3, 0.1).name('RadioTop: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'RadioBottom', 0.5, 3, 0.1).name('RadioBottom: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'Altura', 1, 4, 1).name('Altura: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'SegmentosR', 2, 70, 1).name('SegmentosR: ').listen().onChange(() => this.updateGeometria());

    }

    update() {
        this.cilindro.rotateX(0.03);
        this.cilindro.rotateZ(-0.01);
        this.cilindro.rotateY(0.005);
    }
    
    updateGeometria() {
        this.cilindro.geometry.dispose();  // Libera la memoria de la geometría anterior
        this.cilindro.geometry = new THREE.CylinderGeometry(this.guiControls.RadioTop, this.guiControls.RadioBottom, this.guiControls.Altura, this.guiControls.SegmentosR);
    }
    
}

class Esfera extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        // Crear geometría y material
        this.geometria = new THREE.SphereGeometry(this.guiControls.Radio, this.guiControls.ResEcuador, this.guiControls.ResMeridiano);
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        // Crear la esfera y almacenarlo
        this.esfera = new THREE.Mesh(this.geometria, material);
        this.esfera.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

        this.add(this.esfera);
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            Radio: 0.5,
            ResEcuador: 10,  // Seguros valores mayores a 2
            ResMeridiano: 10, 
            posX: 0.0,
            posY: 5.0,
            posZ: 0.0
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'Radio', 0.5, 1, 0.1).name('Radio: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'ResEcuador', 3, 50, 0.1).name('Res. Ecuador : ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'ResMeridiano', 3, 50, 1).name('Res. Meridiano: ').listen().onChange(() => this.updateGeometria());
    }

    update() {
        this.esfera.rotateX(0.03);
        this.esfera.rotateZ(-0.01);
        this.esfera.rotateY(0.005);
    }
    
    updateGeometria() {
        this.esfera.geometry.dispose();  // Libera la memoria de la geometría anterior
        this.esfera.geometry = new THREE.SphereGeometry(this.guiControls.Radio, this.guiControls.ResEcuador, this.guiControls.ResMeridiano);
    }
}

class Toro extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        // Crear geometría y material
        this.geometria = new THREE.TorusGeometry(this.guiControls.RadioPrincipal, this.guiControls.RadioTubo, this.guiControls.ResToro, this.guiControls.ResTubo
        );
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        // Crear el toroide y almacenarlo
        this.toro = new THREE.Mesh(this.geometria, material);
        this.toro.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

        this.add(this.toro);
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            RadioPrincipal: 0.5,
            RadioTubo: 0.1, 
            ResToro: 10, 
            ResTubo: 10, 
            posX: 0.0,
            posY: 5.0,
            posZ: 5.0
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'RadioPrincipal', 1, 5, 0.1).name('Radio Principal: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'RadioTubo', 0.1, 2, 0.1).name('Radio Tubo: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'ResToro', 3, 50, 1).name('Res. Toro: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'ResTubo', 3, 50, 1).name('Res. Tubo: ').listen().onChange(() => this.updateGeometria());
    }

    update() {
        this.toro.rotateX(0.03);
        this.toro.rotateZ(-0.01);
        this.toro.rotateY(0.005);
    }
    
    updateGeometria() {
        this.toro.geometry.dispose();  // Libera la memoria de la geometría anterior
        this.toro.geometry = new THREE.TorusGeometry(
            this.guiControls.RadioPrincipal, 
            this.guiControls.RadioTubo, 
            this.guiControls.ResToro, 
            this.guiControls.ResTubo
        );
    }
}


class Icosaedro extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        // Crear geometría y material
        this.geometria = new THREE.IcosahedronGeometry(this.guiControls.Radio, this.guiControls.Resolucion);
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        // Crear el icosaedro y almacenarlo
        this.icosaedro = new THREE.Mesh(this.geometria, material);
        this.icosaedro.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

        this.add(this.icosaedro);
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            Radio: 1,
            Resolucion: 0, // Debe ser entero (0 mínimo)
            posX: 0.0,
            posY: 5.0,
            posZ: -5.0
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'Radio', 1, 3, 0.1).name('Radio: ').listen().onChange(() => this.updateGeometria());
        folder.add(this.guiControls, 'Resolucion', 0, 5, 1).name('Resolución: ').listen().onChange(() => this.updateGeometria());
    }

    update() {
        this.icosaedro.rotateX(0.03);
        this.icosaedro.rotateZ(-0.01);
        this.icosaedro.rotateY(0.005);
    }
    
    updateGeometria() {
        this.icosaedro.geometry.dispose();  // Libera la memoria de la geometría anterior
        this.icosaedro.geometry = new THREE.IcosahedronGeometry(this.guiControls.Radio, this.guiControls.Resolucion);
    }
}


export { Cubo, Cono, Cilindro, Esfera, Toro, Icosaedro };

