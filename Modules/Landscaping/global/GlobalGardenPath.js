// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL GARDEN PATH
// =======================================

export class GlobalGardenPath {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.pathData = {
            width: options.width || 1.0,
            material: options.material || 'stone'
        };
        this.entityId = null;
        this.segments = [];
    }

    create(points, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('gardenPath', {
            ...this.pathData,
            points,
            created: new Date().toISOString()
        });
        if (sceneId) this.addSegment(sceneId, points);
        return this.entityId;
    }

    addSegment(sceneId, points) {
        const globalPoints = points.map(p => this.sceneConnector.localToGlobal(sceneId, p));
        const segment = { points: globalPoints, localPoints: points, pathData: { ...this.pathData } };
        this.globalSystem.addSegment(this.entityId, sceneId, segment);
        this.segments.push({ sceneId, ...segment });
        return segment;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'ممر عالمي',
            totalSegments: this.segments.length,
            totalLength: this.segments.reduce((sum, s) => sum + s.points.length, 0)
        };
    }
}
