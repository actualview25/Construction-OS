// =======================================
// ACTUAL CONSTRUCTION OS - GEO REFERENCING
// =======================================

export class GeoReferencing {
    constructor() {
        this.coordinateSystem = 'utm'; // utm, local, wgs84
        this.datum = 'wgs84';
        this.origin = { x: 0, y: 0, z: 0 };
        this.scale = 1.0;
        this.rotation = 0;
        this.gcp = []; // Ground Control Points
        this.transformMatrix = null;
        this.units = 'meter';
    }

    // إضافة نقطة تحكم أرضية
    addGCP(photoPoint, realWorldPoint) {
        this.gcp.push({
            photo: { ...photoPoint },
            real: { ...realWorldPoint },
            error: 0,
            id: `gcp-${Date.now()}-${this.gcp.length}`
        });
        
        if (this.gcp.length >= 3) {
            this.calculateTransform();
        }
        
        console.log(`📍 تم إضافة نقطة تحكم رقم ${this.gcp.length}`);
    }

    // حساب التحويل باستخدام Least Squares
    calculateTransform() {
        if (this.gcp.length < 3) {
            console.warn('⚠️ تحتاج على الأقل 3 نقاط تحكم');
            return;
        }

        // مصفوفة المعادلات
        let A = [];
        let B = [];
        
        this.gcp.forEach(point => {
            // معادلة X
            A.push([point.photo.x, point.photo.y, point.photo.z, 1, 0, 0, 0, 0]);
            B.push(point.real.x);
            
            // معادلة Y
            A.push([0, 0, 0, 0, point.photo.x, point.photo.y, point.photo.z, 1]);
            B.push(point.real.y);
        });

        // حل المعادلات (تبسيط - في الواقع نستخدم مكتبة)
        this.transformMatrix = this.solveLeastSquares(A, B);
        
        // حساب الأخطاء
        this.calculateErrors();
        
        console.log(`📐 تم حساب مصفوفة التحويل باستخدام ${this.gcp.length} نقاط`);
    }

    solveLeastSquares(A, B) {
        // هذه دالة مبسطة - في الواقع نستخدم مكتبة رياضية
        // للتبسيط، نعيد مصفوفة افتراضية
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    calculateErrors() {
        this.gcp.forEach(point => {
            const transformed = this.photoToWorld(point.photo);
            const error = {
                x: Math.abs(transformed.x - point.real.x),
                y: Math.abs(transformed.y - point.real.y),
                z: Math.abs(transformed.z - point.real.z)
            };
            point.error = Math.sqrt(error.x*error.x + error.y*error.y + error.z*error.z);
        });

        const avgError = this.gcp.reduce((sum, p) => sum + p.error, 0) / this.gcp.length;
        console.log(`📊 متوسط الخطأ: ${avgError.toFixed(3)} متر`);
    }

    // تحويل من إحداثيات الصورة إلى العالم الحقيقي
    photoToWorld(photoPoint) {
        if (!this.transformMatrix) {
            // تحويل بسيط إذا لم توجد مصفوفة
            return {
                x: photoPoint.x * this.scale + this.origin.x,
                y: photoPoint.y * this.scale + this.origin.y,
                z: photoPoint.z * this.scale + this.origin.z
            };
        }

        // تطبيق التحويل
        return {
            x: this.transformMatrix[0][0] * photoPoint.x + 
                this.transformMatrix[0][1] * photoPoint.y + 
                this.transformMatrix[0][2] * photoPoint.z + 
                this.transformMatrix[0][3],
            y: this.transformMatrix[1][0] * photoPoint.x + 
                this.transformMatrix[1][1] * photoPoint.y + 
                this.transformMatrix[1][2] * photoPoint.z + 
                this.transformMatrix[1][3],
            z: this.transformMatrix[2][0] * photoPoint.x + 
                this.transformMatrix[2][1] * photoPoint.y + 
                this.transformMatrix[2][2] * photoPoint.z + 
                this.transformMatrix[2][3]
        };
    }

    // تحويل من العالم الحقيقي إلى الصورة
    worldToPhoto(worldPoint) {
        if (!this.transformMatrix) {
            return {
                x: (worldPoint.x - this.origin.x) / this.scale,
                y: (worldPoint.y - this.origin.y) / this.scale,
                z: (worldPoint.z - this.origin.z) / this.scale
            };
        }

        // عكس التحويل - يحتاج إلى مصفوفة معكوسة
        // للتبسيط، نعيد التحويل البسيط
        return {
            x: (worldPoint.x - this.origin.x) / this.scale,
            y: (worldPoint.y - this.origin.y) / this.scale,
            z: (worldPoint.z - this.origin.z) / this.scale
        };
    }

    // تعيين نظام الإحداثيات
    setCoordinateSystem(system, datum = 'wgs84') {
        this.coordinateSystem = system;
        this.datum = datum;
        console.log(`🌐 نظام الإحداثيات: ${system} - ${datum}`);
    }

    // تعيين الأصل
    setOrigin(x, y, z) {
        this.origin = { x, y, z };
        console.log(`📍 تم تعيين الأصل: (${x}, ${y}, ${z})`);
    }

    // تعيين المقياس
    setScale(scale) {
        this.scale = scale;
        console.log(`📏 المقياس: 1 وحدة = ${scale} متر`);
    }

    // استيراد نقاط من Total Station
    importTotalStationData(data) {
        const points = [];
        const lines = data.split('\n');
        
        lines.forEach((line, index) => {
            if (index === 0 || !line.trim()) return; // تخطي الرأس
            
            const [id, easting, northing, elevation, desc] = line.split(',');
            points.push({
                id: id.trim(),
                easting: parseFloat(easting),
                northing: parseFloat(northing),
                elevation: parseFloat(elevation),
                description: desc?.trim() || ''
            });
        });
        
        console.log(`📡 تم استيراد ${points.length} نقطة من Total Station`);
        return points;
    }

    // استيراد نقاط GPS
    importGPSData(data) {
        const points = [];
        const lines = data.split('\n');
        
        lines.forEach((line, index) => {
            if (index === 0 || !line.trim()) return;
            
            const [id, lat, lon, alt, desc] = line.split(',');
            points.push({
                id: id.trim(),
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                altitude: parseFloat(alt),
                description: desc?.trim() || ''
            });
        });
        
        console.log(`🛰️ تم استيراد ${points.length} نقطة GPS`);
        return points;
    }

    // تحويل من UTM إلى WGS84
    utmToWgs84(easting, northing, zone) {
        // هذه دالة مبسطة - تحتاج مكتبة proj4 للحسابات الدقيقة
        return {
            latitude: northing / 111111, // تقريب
            longitude: easting / (111111 * Math.cos(35 * Math.PI / 180)),
            altitude: 0
        };
    }

    // تحويل من WGS84 إلى UTM
    wgs84ToUtm(lat, lon) {
        // حساب تقريبي للـ zone
        const zone = Math.floor((lon + 180) / 6) + 1;
        
        return {
            easting: lon * 111111 * Math.cos(lat * Math.PI / 180),
            northing: lat * 111111,
            zone: zone,
            hemisphere: lat >= 0 ? 'N' : 'S'
        };
    }

    // الحصول على تقرير المعايرة
    getCalibrationReport() {
        const avgError = this.gcp.reduce((sum, p) => sum + p.error, 0) / this.gcp.length;
        const maxError = Math.max(...this.gcp.map(p => p.error));
        
        return {
            gcps: this.gcp.length,
            coordinateSystem: this.coordinateSystem,
            datum: this.datum,
            origin: this.origin,
            scale: this.scale,
            averageError: avgError.toFixed(3),
            maxError: maxError.toFixed(3),
            gcpsList: this.gcp.map(p => ({
                id: p.id,
                photo: p.photo,
                real: p.real,
                error: p.error.toFixed(3)
            }))
        };
    }

    // تصدير للاستخدام في ACTUAL VIEW STUDIO
    exportForViewer() {
        return {
            coordinateSystem: this.coordinateSystem,
            datum: this.datum,
            origin: this.origin,
            scale: this.scale,
            transformMatrix: this.transformMatrix,
            gcps: this.gcp.map(p => ({
                photo: p.photo,
                real: p.real
            }))
        };
    }
}
