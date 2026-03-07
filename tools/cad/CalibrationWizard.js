// =======================================
// ACTUAL CONSTRUCTION OS - CALIBRATION WIZARD
// =======================================

export class CalibrationWizard {
    constructor(geoRef, sceneConnector) {
        this.geoRef = geoRef;
        this.sceneConnector = sceneConnector;
        this.step = 1;
        this.calibrationPoints = [];
        this.knownDistance = 0;
    }

    start() {
        this.step = 1;
        this.calibrationPoints = [];
        console.log('📏 بدء معالج المعايرة - الخطوة 1');
        return {
            step: 1,
            message: 'اختر النقطة الأولى في المخطط',
            instruction: 'انقر على نقطة معروفة في المشهد'
        };
    }

    addPoint(point) {
        this.calibrationPoints.push(point);
        
        if (this.step === 1 && this.calibrationPoints.length === 1) {
            this.step = 2;
            return {
                step: 2,
                message: 'اختر النقطة الثانية',
                instruction: 'انقر على النقطة الثانية (مسافة معروفة)'
            };
        }
        
        if (this.step === 2 && this.calibrationPoints.length === 2) {
            return this.calculateScale();
        }
        
        return null;
    }

    setKnownDistance(distance) {
        this.knownDistance = distance;
    }

    calculateScale() {
        if (this.calibrationPoints.length < 2) {
            throw new Error('تحتاج إلى نقطتين للمعايرة');
        }

        const point1 = this.calibrationPoints[0];
        const point2 = this.calibrationPoints[1];
        
        // المسافة في النموذج
        const modelDistance = Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2) +
            Math.pow(point2.z - point1.z, 2)
        );

        if (modelDistance === 0) {
            throw new Error('المسافة بين النقطتين صفر');
        }

        // حساب المقياس
        const scale = this.knownDistance / modelDistance;
        
        this.geoRef.setScale(scale);
        
        console.log(`📐 تمت المعايرة: ${modelDistance.toFixed(4)} وحدة = ${this.knownDistance} متر`);
        console.log(`📏 المقياس: 1 وحدة = ${scale.toFixed(4)} متر`);

        return {
            step: 3,
            message: 'تمت المعايرة بنجاح',
            modelDistance: modelDistance.toFixed(4),
            realDistance: this.knownDistance,
            scale: scale.toFixed(4),
            completed: true
        };
    }

    validateCalibration() {
        if (this.calibrationPoints.length < 2) {
            return {
                valid: false,
                message: 'تحتاج إلى نقطتين للمعايرة'
            };
        }

        if (this.knownDistance <= 0) {
            return {
                valid: false,
                message: 'الرجاء إدخال مسافة صحيحة'
            };
        }

        return {
            valid: true,
            message: 'المعايرة صالحة'
        };
    }

    reset() {
        this.step = 1;
        this.calibrationPoints = [];
        this.knownDistance = 0;
        console.log('🔄 إعادة تعيين المعايرة');
    }

    getCalibrationReport() {
        if (this.calibrationPoints.length < 2) return null;

        const point1 = this.calibrationPoints[0];
        const point2 = this.calibrationPoints[1];
        const modelDistance = Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2) +
            Math.pow(point2.z - point1.z, 2)
        );

        return {
            points: this.calibrationPoints.map((p, i) => ({
                number: i + 1,
                x: p.x.toFixed(2),
                y: p.y.toFixed(2),
                z: p.z.toFixed(2)
            })),
            modelDistance: modelDistance.toFixed(4),
            realDistance: this.knownDistance,
            scale: (this.knownDistance / modelDistance).toFixed(4)
        };
    }
}
