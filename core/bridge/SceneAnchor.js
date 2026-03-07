// =======================================
// ACTUAL CONSTRUCTION OS - SCENE ANCHOR
// =======================================
// ربط الكيان بموقع في المشهد

export class SceneAnchor {
    constructor(entityId, sceneId, localPosition) {
        this.id = `anchor_${entityId}_${sceneId}_${Date.now()}`;
        this.entityId = entityId;
        this.sceneId = sceneId;
        
        this.localPosition = { ...localPosition };
        this.worldPosition = null;
        
        this.transform = {
            rotation: 0,
            scale: 1.0,
            matrix: null
        };
        
        this.metadata = {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            version: 1
        };
    }

    // تحديث من الإحداثيات العالمية
    updateFromWorld(worldPosition, sceneConnector) {
        this.worldPosition = { ...worldPosition };
        this.localPosition = sceneConnector.worldToLocal(this.sceneId, worldPosition);
        this.metadata.updated = new Date().toISOString();
        this.metadata.version++;
    }

    // تحديث من الإحداثيات المحلية
    updateFromLocal(localPosition, sceneConnector) {
        this.localPosition = { ...localPosition };
        this.worldPosition = sceneConnector.localToWorld(this.sceneId, localPosition);
        this.metadata.updated = new Date().toISOString();
        this.metadata.version++;
    }

    // تحديث من الكيان
    updateFromEntity(entity) {
        // تطبيق تحويلات الكيان إذا وجدت
        if (entity.data?.transform) {
            this.transform = { ...this.transform, ...entity.data.transform };
        }
        this.metadata.updated = new Date().toISOString();
        this.metadata.version++;
    }

    // حساب مصفوفة التحويل
    calculateTransformMatrix() {
        // مصفوفة 4x4 للتحويل
        return [
            [this.transform.scale, 0, 0, this.localPosition.x],
            [0, this.transform.scale, 0, this.localPosition.y],
            [0, 0, this.transform.scale, this.localPosition.z],
            [0, 0, 0, 1]
        ];
    }

    // المسافة من نقطة
    distanceTo(point) {
        return Math.sqrt(
            Math.pow(point.x - this.localPosition.x, 2) +
            Math.pow(point.y - this.localPosition.y, 2) +
            Math.pow(point.z - this.localPosition.z, 2)
        );
    }

    // حفظ
    toJSON() {
        return {
            id: this.id,
            entityId: this.entityId,
            sceneId: this.sceneId,
            localPosition: this.localPosition,
            worldPosition: this.worldPosition,
            transform: this.transform,
            metadata: this.metadata
        };
    }

    // تحميل
    static fromJSON(json) {
        const anchor = new SceneAnchor(
            json.entityId,
            json.sceneId,
            json.localPosition
        );
        anchor.id = json.id;
        anchor.worldPosition = json.worldPosition;
        anchor.transform = json.transform;
        anchor.metadata = json.metadata;
        return anchor;
    }
}
