// core/SceneManager.js
// مسؤول عن إدارة المشهد ثلاثي الأبعاد والعناصر

import * as THREE from 'three';

export class SceneManager {
    constructor(app) {
        this.app = app;
        this.scene = app.scene;
        this.camera = app.camera;
        this.renderer = app.renderer;
        this.controls = app.controls;
        
        this.elements = []; // جميع العناصر في المشهد
        this.layers = {}; // طبقات المشهد
        this.selection = null; // العنصر المحدد حالياً
    }
    
    // ===== إدارة العناصر =====
    addElement(element, category) {
        const id = `elem_${Date.now()}_${this.elements.length}`;
        
        const wrapped = {
            id: id,
            element: element,
            category: category,
            mesh: element.createMesh ? element.createMesh() : null,
            selected: false,
            visible: true,
            createdAt: new Date().toISOString()
        };
        
        if (wrapped.mesh) {
            wrapped.mesh.userData = { id: id, category: category };
            this.scene.add(wrapped.mesh);
        }
        
        this.elements.push(wrapped);
        return wrapped;
    }
    
    removeElement(id) {
        const index = this.elements.findIndex(e => e.id === id);
        if (index !== -1) {
            const element = this.elements[index];
            if (element.mesh) this.scene.remove(element.mesh);
            this.elements.splice(index, 1);
        }
    }
    
    // ===== التحديد =====
    selectElement(id) {
        // إلغاء تحديد السابق
        if (this.selection) {
            this.selection.selected = false;
            this.highlightElement(this.selection, false);
        }
        
        // تحديد الجديد
        const element = this.elements.find(e => e.id === id);
        if (element) {
            element.selected = true;
            this.selection = element;
            this.highlightElement(element, true);
        }
    }
    
    highlightElement(element, highlight) {
        if (!element.mesh) return;
        
        if (highlight) {
            // حفظ المواد الأصلية
            element.originalMaterials = element.mesh.material;
            
            // إضافة تأثير التحديد
            if (Array.isArray(element.mesh.material)) {
                element.mesh.material.forEach(mat => {
                    mat.emissive.setHex(0x444444);
                });
            } else {
                element.mesh.material.emissive.setHex(0x444444);
            }
            
            // إضافة إطار حول العنصر
            this.addBoundingBox(element);
        } else {
            // استعادة المواد الأصلية
            if (element.originalMaterials) {
                element.mesh.material = element.originalMaterials;
            }
            
            // إزالة الإطار
            this.removeBoundingBox(element);
        }
    }
    
    addBoundingBox(element) {
        if (!element.mesh) return;
        
        const box = new THREE.Box3().setFromObject(element.mesh);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffaa44 }));
        
        line.position.copy(center);
        element.boundingBox = line;
        this.scene.add(line);
    }
    
    removeBoundingBox(element) {
        if (element.boundingBox) {
            this.scene.remove(element.boundingBox);
            element.boundingBox = null;
        }
    }
    
    // ===== الرؤية =====
    hideElement(id) {
        const element = this.elements.find(e => e.id === id);
        if (element && element.mesh) {
            element.mesh.visible = false;
            element.visible = false;
        }
    }
    
    showElement(id) {
        const element = this.elements.find(e => e.id === id);
        if (element && element.mesh) {
            element.mesh.visible = true;
            element.visible = true;
        }
    }
    
    toggleVisibility(id) {
        const element = this.elements.find(e => e.id === id);
        if (element && element.mesh) {
            element.mesh.visible = !element.mesh.visible;
            element.visible = element.mesh.visible;
        }
    }
    
    // ===== التجميع =====
    groupElements(ids) {
        const group = new THREE.Group();
        const elements = [];
        
        ids.forEach(id => {
            const element = this.elements.find(e => e.id === id);
            if (element && element.mesh) {
                group.add(element.mesh);
                elements.push(element);
            }
        });
        
        const groupId = `group_${Date.now()}`;
        this.scene.add(group);
        
        return {
            id: groupId,
            group: group,
            elements: elements,
            type: 'group'
        };
    }
    
    // ===== البحث =====
    findElementsByCategory(category) {
        return this.elements.filter(e => e.category === category);
    }
    
    findElementsByName(name) {
        return this.elements.filter(e => 
            e.element.name?.toLowerCase().includes(name.toLowerCase())
        );
    }
    
    // ===== الحفظ والتحميل =====
    serialize() {
        return {
            elements: this.elements.map(e => ({
                id: e.id,
                category: e.category,
                type: e.element.constructor.name,
                position: e.mesh?.position.toArray(),
                rotation: e.mesh?.rotation.toArray(),
                scale: e.mesh?.scale.toArray()
            }))
        };
    }
    
    // ===== التصدير =====
    exportToOBJ() {
        // تصدير المشهد كملف OBJ
        let output = '';
        this.elements.forEach(e => {
            if (e.mesh) {
                // تحويل إلى OBJ (مبسط)
                output += `# عنصر: ${e.id}\n`;
                // ... الكود الكامل للتصدير
            }
        });
        return output;
    }
}