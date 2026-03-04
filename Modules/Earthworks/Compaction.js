















// modules/Earthworks/Compaction.js
import * as THREE from 'three';
import { SoilMaterial } from './SoilMaterial.js';

export class Compaction {
    constructor(boundary, layers) {
        this.boundary = boundary;
        this.layers = layers;
        this.totalVolume = 0;
    }
    
    draw(scene, startY) {
        let y = startY;
        
        this.layers.forEach((layer, i) => {
            const material = new SoilMaterial(layer.material);
            const geometry = new THREE.BoxGeometry(
                Math.sqrt(this.boundary.area) * 2,
                layer.thickness,
                Math.sqrt(this.boundary.area) * 2
            );
            
            const meshMaterial = new THREE.MeshStandardMaterial({
                color: material.color,
                transparent: true,
                opacity: 0.5 + (i * 0.1)
            });
            
            const mesh = new THREE.Mesh(geometry, meshMaterial);
            mesh.position.set(0, y + layer.thickness/2, 0);
            scene.add(mesh);
            
            const volume = this.boundary.area * layer.thickness;
            this.totalVolume += volume;
            
            y += layer.thickness;
        });
    }
    
    getBOQ() {
        return {
            العمل: 'ردم ودمك',
            الطبقات: this.layers.length,
            الحجم_الكلي: this.totalVolume.toFixed(2) + ' م³',
            التفاصيل: this.layers.map(l => ({
                سمك: l.thickness + ' م',
                مادة: l.material
            }))
        };
    }
}































// modules/Earthworks/Compaction.js

class Compaction {
    constructor(area, options = {}) {
        this.area = area;
        this.layers = [];
        this.totalVolume = 0;
        this.compactionRatio = options.compactionRatio || 0.95;
        
        // أنواع مواد الردم
        this.materials = {
            'sand': new SoilMaterial('sand'),
            'gravel': new SoilMaterial('gravel'),
            'selected': new SoilMaterial('fill', { density: 1.8 })
        };
    }
    
    // إضافة طبقة ردم
    addLayer(thickness, materialType = 'sand') {
        const material = this.materials[materialType];
        const looseVolume = this.area * thickness;
        const compactedVolume = material.getCompactedVolume(looseVolume);
        
        const layer = {
            thickness: thickness,
            material: material,
            looseVolume: looseVolume,
            compactedVolume: compactedVolume,
            passes: this.calculatePasses(thickness) // عدد تمريرات الدمك
        };
        
        this.layers.push(layer);
        this.totalVolume += compactedVolume;
        
        return layer;
    }
    
    // حساب عدد تمريرات الدمك
    calculatePasses(thickness) {
        if (thickness <= 0.2) return 4; // طبقة رقيقة: 4 تمريرات
        if (thickness <= 0.3) return 6; // طبقة متوسطة: 6 تمريرات
        return 8; // طبقة سميكة: 8 تمريرات
    }
    
    // رسم طبقات الردم
    draw(scene, baseElevation) {
        let currentElevation = baseElevation;
        
        this.layers.forEach(layer => {
            const geometry = new THREE.BoxGeometry(
                Math.sqrt(this.area) * 2, // عرض
                layer.thickness,            // ارتفاع (سمك)
                Math.sqrt(this.area) * 2    // عمق
            );
            
            const material = new THREE.MeshStandardMaterial({
                color: layer.material.color,
                transparent: true,
                opacity: 0.6
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, currentElevation + layer.thickness/2, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            scene.add(mesh);
            
            currentElevation += layer.thickness;
        });
    }
    
    // تصدير جدول كميات الردم
    getBOQ() {
        return {
            نوع: 'ردم ودمك',
            عدد_الطبقات: this.layers.length,
            الحجم_الكلي: this.totalVolume.toFixed(2) + ' م³',
            التفاصيل: this.layers.map((layer, i) => ({
                طبقة: i + 1,
                سمك: layer.thickness.toFixed(2) + ' م',
                مادة: layer.material.name,
                حجم_مدمك: layer.compactedVolume.toFixed(2) + ' م³',
                تمريرات: layer.passes
            }))
        };
    }
}