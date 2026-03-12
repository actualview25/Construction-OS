// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL PAVEMENT
// =======================================

export class GlobalPavement {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.pavementData = {
            material: options.material || 'stone',
            pattern: options.pattern || 'grid',
            thickness: options.thickness || 0.1
        };
        this.entityId = null;
        this.areas = [];
    }

    create(area, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('pavement', {
            ...this.pavementData,
            area,
            created: new Date().toISOString()
        });
        if (sceneId) this.addArea(sceneId, area);
        return this.entityId;
    }

    addArea(sceneId, area) {
        const globalArea = {
            width: area.width,
            length: area.length,
            position: this.sceneConnector.localToGlobal(sceneId, area.position || { x: 0, y: 0, z: 0 })
        };
        const areaData = { ...globalArea, pavementData: { ...this.pavementData } };
        this.globalSystem.addSegment(this.entityId, sceneId, areaData);
        this.areas.push({ sceneId, ...areaData });
        return areaData;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'رصف عالمي',
            totalAreas: this.areas.length,
            totalArea: this.areas.reduce((sum, a) => sum + (a.width * a.length), 0).toFixed(2) + ' م²',
            specifications: this.pavementData
        };
    }
}
