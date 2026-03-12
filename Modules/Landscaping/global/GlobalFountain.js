// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL FOUNTAIN
// =======================================

export class GlobalFountain {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.fountainData = {
            type: options.type || 'classic',
            diameter: options.diameter || 2.0,
            height: options.height || 1.5,
            waterFlow: options.waterFlow !== false
        };
        this.entityId = null;
        this.instances = [];
    }

    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('fountain', {
            ...this.fountainData,
            created: new Date().toISOString()
        });
        if (sceneId) this.addInstance(sceneId, position);
        return this.entityId;
    }

    addInstance(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        const instance = { position: globalPos, localPosition: position, fountainData: { ...this.fountainData } };
        this.globalSystem.addSegment(this.entityId, sceneId, instance);
        this.instances.push({ sceneId, ...instance });
        return instance;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'نافورة عالمية',
            totalInstances: this.instances.length,
            specifications: this.fountainData
        };
    }
}
