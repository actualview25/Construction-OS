// modules/Earthworks/Layer.js

class Layer {
    constructor(name, material, thickness, elevation) {
        this.name = name;
        this.material = material;
        this.thickness = thickness; // سمك الطبقة (متر)
        this.elevation = elevation; // منسوب الطبقة
        this.mesh = null;
    }
    
    // إنشاء التمثيل ثلاثي الأبعاد للطبقة
    createMesh(boundaryPoints) {
        const shape = new THREE.Shape();
        boundaryPoints.forEach((p, i) => {
            if (i === 0) shape.moveTo(p.x, p.z);
            else shape.lineTo(p.x, p.z);
        });
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: this.thickness,
            bevelEnabled: false
        });
        
        const material = new THREE.MeshStandardMaterial({
            color: this.material.color,
            transparent: true,
            opacity: 0.7,
            emissive: 0x000000
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = this.elevation;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        return this.mesh;
    }
    
    // حساب حجم الطبقة
    calculateVolume(area) {
        return area * this.thickness;
    }
}