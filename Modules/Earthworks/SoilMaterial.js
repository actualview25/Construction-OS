// modules/Earthworks/SoilMaterial.js
// modules/Earthworks/Excavation.js
import * as THREE from 'three';
import { SoilMaterial } from './SoilMaterial.js';

export class Excavation {
    constructor(boundary, depth, soilType = 'topsoil') {
        this.boundary = boundary;
        this.depth = depth;
        this.material = new SoilMaterial(soilType);
        this.volume = boundary.area * depth;
    }
    
    draw(scene) {
        const points = this.boundary.points;
        const shape = new THREE.Shape();
        points.forEach((p, i) => {
            if (i === 0) shape.moveTo(p.x, p.z);
            else shape.lineTo(p.x, p.z);
        });
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: this.depth,
            bevelEnabled: false
        });
        
        const material = new THREE.MeshStandardMaterial({
            color: this.material.color,
            transparent: true,
            opacity: 0.6
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = -this.depth;
        scene.add(mesh);
        
        // حدود الحفر
        const linePoints = points.map(p => new THREE.Vector3(p.x, -this.depth, p.z));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffaa44 });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
    }
    
    getBOQ() {
        return {
            العمل: 'حفريات',
            العمق: this.depth.toFixed(2) + ' م',
            المساحة: this.boundary.area.toFixed(2) + ' م²',
            الحجم: this.volume.toFixed(2) + ' م³',
            التربة: this.material.type,
            الوزن: (this.volume * this.material.density).toFixed(2) + ' طن'
        };
    }
}






































class SoilMaterial {
    constructor(type, properties = {}) {
        this.type = type; // 'topsoil', 'sand', 'gravel', 'rock', 'fill'
        this.name = this.getMaterialName(type);
        this.color = this.getMaterialColor(type);
        this.density = properties.density || 1.6; // طن/م³
        this.compactionRatio = properties.compactionRatio || 0.95; // نسبة الدمك
        this.unitWeight = properties.unitWeight || 18; // kN/m³
    }
    
    getMaterialName(type) {
        const names = {
            'topsoil': 'تربة سطحية',
            'sand': 'رمل',
            'gravel': 'حصى',
            'rock': 'صخور',
            'fill': 'ردم'
        };
        return names[type] || type;
    }
    
    getMaterialColor(type) {
        const colors = {
            'topsoil': 0x8B4513, // بني
            'sand': 0xF4E542,    // أصفر
            'gravel': 0x808080,  // رمادي
            'rock': 0x555555,    // رمادي غامق
            'fill': 0xCD853F     // بني فاتح
        };
        return colors[type] || 0x964B00;
    }
    
    // حساب الحجم بعد الدمك
    getCompactedVolume(looseVolume) {
        return looseVolume * this.compactionRatio;
    }
}
// modules/Earthworks/SoilMaterial.js
export class SoilMaterial {
    constructor(type) {
        this.type = type;
        this.colors = {
            'topsoil': 0x8B4513,
            'sand': 0xF4E542,
            'gravel': 0x808080,
            'rock': 0x555555,
            'selected': 0xCD853F
        };
        this.densities = {
            'topsoil': 1.3,
            'sand': 1.6,
            'gravel': 1.8,
            'rock': 2.2,
            'selected': 1.7
        };
    }
    
    get color() { return this.colors[this.type] || 0x964B00; }
    get density() { return this.densities[this.type] || 1.6; }
}