// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL FLOOR
// =======================================

export class GlobalFloor {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.floorData = {
            material: options.material || 'tile_ceramic',
            thickness: options.thickness || 0.02,
            finish: options.finish || 'standard',
            color: options.color || 0xd2b48c
        };
        
        this.entityId = null;
        this.segments = [];
        this.totalArea = 0;
    }

    create(points, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('floor', {
            ...this.floorData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId, points);
        }

        return this.entityId;
    }

    addSegment(sceneId, points) {
        // تحويل جميع النقاط إلى إحداثيات عالمية
        const globalPoints = points.map(p => 
            this.sceneConnector.localToGlobal(sceneId, p)
        );

        // حساب المساحة
        const area = this.calculateArea(globalPoints);

        const segmentData = {
            boundary: globalPoints,
            localBoundary: points,
            area: area,
            thickness: this.floorData.thickness,
            volume: area * this.floorData.thickness
        };

        this.globalSystem.addSegment(this.entityId, sceneId, segmentData);
        
        this.totalArea += area;
        this.segments.push({ sceneId, ...segmentData });

        console.log(`🏢 تم إضافة أرضية بمساحة ${area.toFixed(2)} م² في المشهد ${sceneId}`);
        return segmentData;
    }

    calculateArea(points) {
        if (points.length < 3) return 0;
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i].x * points[j].z;
            area -= points[j].x * points[i].z;
        }
        return Math.abs(area) / 2;
    }

    renderInScene(sceneId, threeScene) {
        const sceneEntities = this.globalSystem.getSceneEntities(sceneId);
        
        sceneEntities.forEach(item => {
            if (item.entityId === this.entityId) {
                this.renderSegment(item.segment, threeScene);
            }
        });
    }

    renderSegment(segment, threeScene) {
        const shape = new THREE.Shape();
        segment.localBoundary.forEach((p, i) => {
            if (i === 0) shape.moveTo(p.x, p.z);
            else shape.lineTo(p.x, p.z);
        });

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: this.floorData.thickness,
            bevelEnabled: false
        });

        const material = new THREE.MeshStandardMaterial({
            color: this.floorData.color,
            roughness: 0.3,
            metalness: 0.1
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0;
        threeScene.add(mesh);
    }

    getTotalQuantities() {
        return {
            material: this.floorData.material,
            thickness: this.floorData.thickness,
            totalArea: this.totalArea.toFixed(2),
            totalVolume: (this.totalArea * this.floorData.thickness).toFixed(2),
            segments: this.segments.length,
            scenes: [...new Set(this.segments.map(s => s.sceneId))]
        };
    }
}
