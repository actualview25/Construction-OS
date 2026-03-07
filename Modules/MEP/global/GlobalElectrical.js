// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL ELECTRICAL
// =======================================

export class GlobalElectrical {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.electricalData = {
            voltage: options.voltage || 220,
            phase: options.phase || 'single', // single, three
            circuits: []
        };
        
        this.entityId = null;
        this.totalLength = 0;
        this.totalPoints = 0;
    }

    // إنشاء دائرة كهربائية عالمية
    createCircuit(circuitType, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('electrical', {
            circuitType: circuitType,
            ...this.electricalData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId, circuitType, []);
        }

        return this.entityId;
    }

    // إضافة كابل
    addCable(sceneId, startPoint, endPoint, cableType = 'cu_2.5') {
        const globalStart = this.sceneConnector.localToGlobal(sceneId, startPoint);
        const globalEnd = this.sceneConnector.localToGlobal(sceneId, endPoint);
        
        const length = this.calculateLength(globalStart, globalEnd);

        const cableData = {
            start: globalStart,
            end: globalEnd,
            localStart: startPoint,
            localEnd: endPoint,
            type: cableType,
            length: length
        };

        // البحث عن أو إنشاء الجزء
        let segment = this.getOrCreateSegment(sceneId);
        if (!segment.cables) segment.cables = [];
        segment.cables.push(cableData);
        
        this.totalLength += length;
        
        return cableData;
    }

    // إضافة نقطة كهرباء
    addPoint(sceneId, position, pointType = 'socket') {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const pointData = {
            position: globalPos,
            localPosition: position,
            type: pointType
        };

        let segment = this.getOrCreateSegment(sceneId);
        if (!segment.points) segment.points = [];
        segment.points.push(pointData);
        
        this.totalPoints++;

        return pointData;
    }

    getOrCreateSegment(sceneId) {
        let segment = null;
        const sceneEntities = this.globalSystem.getSceneEntities(sceneId);
        
        sceneEntities.forEach(item => {
            if (item.entityId === this.entityId) {
                segment = item.segment;
            }
        });

        if (!segment) {
            segment = {
                sceneId,
                cables: [],
                points: []
            };
            this.globalSystem.addSegment(this.entityId, sceneId, segment);
        }

        return segment;
    }

    calculateLength(point1, point2) {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2) +
            Math.pow(point2.z - point1.z, 2)
        );
    }

    getTotalQuantities() {
        return {
            totalCableLength: this.totalLength.toFixed(2),
            totalPoints: this.totalPoints,
            circuits: this.electricalData.circuits.length,
            voltage: this.electricalData.voltage
        };
    }
}
