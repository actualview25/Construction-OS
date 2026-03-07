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
        this.totalStationData = [];
        this.gpsData = [];
        this.method = 'manual'; // manual, totalStation, gps
    }

    // بدء المعالج
    start(method = 'manual') {
        this.method = method;
        this.step = 1;
        this.calibrationPoints = [];
        
        console.log(`📏 بدء معالج المعايرة - الطريقة: ${method}`);
        
        return {
            step: 1,
            method: method,
            message: 'اختر النقطة الأولى في المخطط',
            instruction: 'انقر على نقطة معروفة في المشهد'
        };
    }

    // إضافة نقطة
    addPoint(point) {
        this.calibrationPoints.push({ ...point });
        
        if (this.method === 'manual') {
            return this.handleManualPoint();
        } else if (this.method === 'totalStation') {
            return this.handleTotalStationPoint();
        } else if (this.method === 'gps') {
            return this.handleGPSPoint();
        }
    }

    // معالجة النقاط في الطريقة اليدوية
    handleManualPoint() {
        if (this.step === 1 && this.calibrationPoints.length === 1) {
            this.step = 2;
            return {
                step: 2,
                message: 'اختر النقطة الثانية',
                instruction: 'انقر على النقطة الثانية (مسافة معروفة)'
            };
        }
        
        if (this.step === 2 && this.calibrationPoints.length === 2) {
            this.step = 3;
            return {
                step: 3,
                message: 'أدخل المسافة الحقيقية',
                instruction: 'أدخل المسافة بين النقطتين بالمتر'
            };
        }
        
        return null;
    }

    // معالجة نقاط Total Station
    handleTotalStationPoint() {
        if (this.calibrationPoints.length <= this.totalStationData.length) {
            const point = this.totalStationData[this.calibrationPoints.length - 1];
            
            this.geoRef.addGCP(
                this.calibrationPoints[this.calibrationPoints.length - 1],
                {
                    x: point.easting,
                    y: point.northing,
                    z: point.elevation
                }
            );
            
            if (this.calibrationPoints.length === this.totalStationData.length) {
                this.step = 4;
                return {
                    step: 4,
                    message: 'اكتملت المعايرة',
                    instruction: 'تمت إضافة جميع نقاط التحكم'
                };
            }
            
            return {
                step: 2,
                message: `أضف نقطة ${this.calibrationPoints.length + 1}`,
                instruction: `انقر على النقطة المقابلة للنقطة ${this.totalStationData[this.calibrationPoints.length].id}`
            };
        }
        
        return null;
    }

    // معالجة نقاط GPS
    handleGPSPoint() {
        // مشابه لـ Total Station
        return this.handleTotalStationPoint();
    }

    // تعيين المسافة الحقيقية
    setKnownDistance(distance) {
        this.knownDistance = parseFloat(distance);
        
        if (this.calibrationPoints.length >= 2 && this.knownDistance > 0) {
            return this.calculateScale();
        }
        
        return null;
    }

    // حساب المقياس
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
            step: 4,
            message: 'تمت المعايرة بنجاح',
            modelDistance: modelDistance.toFixed(4),
            realDistance: this.knownDistance,
            scale: scale.toFixed(4),
            completed: true
        };
    }

    // استيراد بيانات من Total Station
    importTotalStationData(csvData) {
        const lines = csvData.split('\n');
        this.totalStationData = [];
        
        lines.forEach((line, index) => {
            if (index === 0 || !line.trim()) return; // تخطي الرأس
            
            const [id, easting, northing, elevation, desc] = line.split(',');
            this.totalStationData.push({
                id: id.trim(),
                easting: parseFloat(easting),
                northing: parseFloat(northing),
                elevation: parseFloat(elevation),
                description: desc?.trim() || ''
            });
        });
        
        console.log(`📡 تم استيراد ${this.totalStationData.length} نقطة من Total Station`);
        return this.totalStationData;
    }

    // استيراد بيانات GPS
    importGPSData(csvData) {
        const lines = csvData.split('\n');
        this.gpsData = [];
        
        lines.forEach((line, index) => {
            if (index === 0 || !line.trim()) return;
            
            const [id, lat, lon, alt, desc] = line.split(',');
            this.gpsData.push({
                id: id.trim(),
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                altitude: parseFloat(alt),
                description: desc?.trim() || ''
            });
        });
        
        console.log(`🛰️ تم استيراد ${this.gpsData.length} نقطة GPS`);
        return this.gpsData;
    }

    // ربط نقطة في الصورة مع نقطة من Total Station
    matchWithTotalStation(photoPoint, stationIndex) {
        const stationPoint = this.totalStationData[stationIndex];
        if (!stationPoint) return false;
        
        this.geoRef.addGCP(photoPoint, {
            x: stationPoint.easting,
            y: stationPoint.northing,
            z: stationPoint.elevation
        });
        
        console.log(`✅ تم ربط نقطة الصورة مع نقطة المساح ${stationPoint.id}`);
        return true;
    }

    // ربط نقطة في الصورة مع نقطة GPS
    matchWithGPS(photoPoint, gpsIndex) {
        const gpsPoint = this.gpsData[gpsIndex];
        if (!gpsPoint) return false;
        
        // تحويل GPS إلى UTM
        const utm = this.geoRef.wgs84ToUtm(gpsPoint.latitude, gpsPoint.longitude);
        
        this.geoRef.addGCP(photoPoint, {
            x: utm.easting,
            y: utm.northing,
            z: gpsPoint.altitude
        });
        
        console.log(`✅ تم ربط نقطة الصورة مع نقطة GPS ${gpsPoint.id}`);
        return true;
    }

    // التحقق من صحة المعايرة
    validateCalibration() {
        const errors = [];
        
        if (this.calibrationPoints.length < 2) {
            errors.push('تحتاج إلى نقطتين للمعايرة على الأقل');
        }
        
        if (this.knownDistance <= 0) {
            errors.push('المسافة الحقيقية يجب أن تكون أكبر من صفر');
        }
        
        if (this.geoRef.gcp.length < 3) {
            errors.push('يفضل استخدام 3 نقاط تحكم على الأقل للحصول على دقة أفضل');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // الحصول على تقرير المعايرة
    getCalibrationReport() {
        const report = {
            method: this.method,
            points: this.calibrationPoints.map((p, i) => ({
                number: i + 1,
                x: p.x.toFixed(2),
                y: p.y.toFixed(2),
                z: p.z.toFixed(2)
            })),
            gcps: this.geoRef.gcp.length,
            totalStationPoints: this.totalStationData.length,
            gpsPoints: this.gpsData.length
        };

        if (this.calibrationPoints.length >= 2 && this.knownDistance > 0) {
            const p1 = this.calibrationPoints[0];
            const p2 = this.calibrationPoints[1];
            const modelDistance = Math.sqrt(
                Math.pow(p2.x - p1.x, 2) +
                Math.pow(p2.y - p1.y, 2) +
                Math.pow(p2.z - p1.z, 2)
            );
            
            report.modelDistance = modelDistance.toFixed(4);
            report.realDistance = this.knownDistance;
            report.scale = (this.knownDistance / modelDistance).toFixed(4);
        }

        return report;
    }

    // إعادة تعيين
    reset() {
        this.step = 1;
        this.calibrationPoints = [];
        this.knownDistance = 0;
        this.totalStationData = [];
        this.gpsData = [];
        console.log('🔄 إعادة تعيين معالج المعايرة');
    }

    // إنشاء واجهة المستخدم
    createUI() {
        const container = document.createElement('div');
        container.className = 'calibration-wizard';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(20,30,40,0.95);
            backdrop-filter: blur(10px);
            border: 2px solid #4a6c8f;
            border-radius: 12px;
            color: white;
            padding: 15px;
            z-index: 1000;
            direction: rtl;
        `;

        container.innerHTML = `
            <h3 style="color: #88aaff; margin-top: 0;">📏 معالج المعايرة</h3>
            <div style="margin: 10px 0;" id="calibration-status"></div>
            <div style="margin: 10px 0;" id="calibration-points"></div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="calibration-cancel" style="background: #c0392b; color: white; border: none; padding: 5px 10px; border-radius: 4px;">إلغاء</button>
                <button id="calibration-next" style="background: #27ae60; color: white; border: none; padding: 5px 10px; border-radius: 4px;">التالي</button>
            </div>
        `;

        return container;
    }
}
