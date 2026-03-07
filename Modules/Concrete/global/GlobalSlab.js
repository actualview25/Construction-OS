// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL SLAB
// =======================================

export class GlobalSlab {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.slabData = {
            type: options.type || 'solid',
            thickness: options.thickness || 0.15,
            grade: options.grade || 'C30',
            rebar: options.rebar || {
                main: 12,
                spacing: 150
            },
            color: options.color || 0x999999
        };
        
        this.entityId = null;
        this.segments = [];
        this.totalArea = 0;
        this.totalVolume = 0;
        this.totalRebar = 0;
    }

    create(points, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('slab', {
            ...this.slabData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId, points);
        }

        return this.entityId;
    }

    addSegment(sceneId, points, elevation = 0) {
        const globalPoints = points.map(p => 
            this.sceneConnector.localToGlobal(sceneId, {
                x: p.x,
                y: p.y + elevation,
                z: p.z
            })
        );

        const area = this.calculateArea(points);
        const volume = area * this.slabData.thickness;
        const rebarWeight = this.calculateRebarWeight(area);

        const segmentData = {
            boundary: globalPoints,
            localBoundary: points,
            elevation: elevation,
            area: area,
            volume: volume,
            rebarWeight: rebarWeight,
            thickness: this.slabData.thickness
        };

        this.globalSystem.addSegment(this.entityId, sceneId, segmentData);
        
        this.totalArea += area;
        this.totalVolume += volume;
        this.totalRebar += rebarWeight;
        this.segments.push({ sceneId, ...segmentData });

        console.log(`🏢 تم إضافة سقف بمساحة ${area.toFixed(2)} م² في المشهد ${sceneId}`);
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

    calculateRebarWeight(area) {
        // وزن تقريبي: 80 كجم/م²
        return area * 80;
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
            depth: this.slabData.thickness,
            bevelEnabled: false
        });

        const material = new THREE.MeshStandardMaterial({
            color: this.slabData.color,
            transparent: true,
            opacity: 0.7
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = segment.elevation;
        threeScene.add(mesh);
    }

    getTotalQuantities() {
        return {
            type: this.slabData.type,
            thickness: this.slabData.thickness,
            grade: this.slabData.grade,
            totalArea: this.totalArea.toFixed(2),
            totalVolume: this.totalVolume.toFixed(2),
            totalRebar: this.totalRebar.toFixed(2),
            segments: this.segments.length,
            scenes: [...new Set(this.segments.map(s => s.sceneId))]
        };
    }
}
