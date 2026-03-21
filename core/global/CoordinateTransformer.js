// =======================================
// ACTUAL VIEW CONSTRUCTION OS - COORDINATE TRANSFORMER
// =======================================
// نظام تحويل الإحداثيات بين المشاهد المختلفة
// =======================================

export class CoordinateTransformer {
    constructor(geoReferencing, sceneConnector) {
        this.geoRef = geoReferencing;
        this.sceneConnector = sceneConnector;
        this.transformCache = new Map(); // تخزين التحويلات المؤقتة
        this.conversionHistory = []; // سجل التحويلات
        console.log('✅ CoordinateTransformer initialized');
    }

    /**
     * تحويل إحداثيات من مشهد إلى آخر
     * @param {string} fromSceneId - المشهد المصدر
     * @param {string} toSceneId - المشهد الهدف
     * @param {Object} localPoint - النقطة في المشهد المصدر {x, y, z}
     * @returns {Object} النقطة في المشهد الهدف {x, y, z}
     */
    transformBetweenScenes(fromSceneId, toSceneId, localPoint) {
        try {
            // التحقق من وجود المفاتيح في الكاش
            const cacheKey = `${fromSceneId}_${toSceneId}_${JSON.stringify(localPoint)}`;
            if (this.transformCache.has(cacheKey)) {
                return this.transformCache.get(cacheKey);
            }

            // الخطوة 1: تحويل من المشهد المصدر إلى الإحداثيات العالمية
            const globalPoint = this.sceneConnector.localToGlobal(fromSceneId, localPoint);
            
            // الخطوة 2: تحويل من الإحداثيات العالمية إلى المشهد الهدف
            const targetPoint = this.sceneConnector.globalToLocal(toSceneId, globalPoint);
            
            // تسجيل التحويل
            this.conversionHistory.push({
                from: fromSceneId,
                to: toSceneId,
                original: localPoint,
                global: globalPoint,
                result: targetPoint,
                timestamp: new Date().toISOString()
            });
            
            // تخزين في الكاش (مؤقت)
            this.transformCache.set(cacheKey, targetPoint);
            setTimeout(() => this.transformCache.delete(cacheKey), 5000);
            
            return targetPoint;
            
        } catch (error) {
            console.error('❌ فشل تحويل الإحداثيات:', error);
            return localPoint;
        }
    }

    /**
     * تحويل إحداثيات الصورة إلى إحداثيات عالمية
     * @param {string} sceneId - معرف المشهد
     * @param {Object} photoPoint - إحداثيات الصورة {x, y, z}
     * @returns {Object} الإحداثيات العالمية {x, y, z}
     */
    photoToWorld(sceneId, photoPoint) {
        try {
            // استخدام GeoReferencing لتحويل الصورة إلى واقع
            const worldPoint = this.geoRef.photoToWorld(photoPoint);
            
            // تطبيق تحويل المشهد
            const scene = this.sceneConnector.getScene(sceneId);
            if (scene) {
                return {
                    x: worldPoint.x + scene.origin.x,
                    y: worldPoint.y + scene.origin.y,
                    z: worldPoint.z + scene.origin.z
                };
            }
            
            return worldPoint;
            
        } catch (error) {
            console.error('❌ فشل تحويل Photo → World:', error);
            return photoPoint;
        }
    }

    /**
     * تحويل إحداثيات عالمية إلى إحداثيات الصورة
     * @param {string} sceneId - معرف المشهد
     * @param {Object} worldPoint - الإحداثيات العالمية {x, y, z}
     * @returns {Object} إحداثيات الصورة {x, y, z}
     */
    worldToPhoto(sceneId, worldPoint) {
        try {
            // عكس تحويل المشهد
            const scene = this.sceneConnector.getScene(sceneId);
            let localPoint = worldPoint;
            
            if (scene) {
                localPoint = {
                    x: worldPoint.x - scene.origin.x,
                    y: worldPoint.y - scene.origin.y,
                    z: worldPoint.z - scene.origin.z
                };
            }
            
            // استخدام GeoReferencing لتحويل العالم إلى صورة
            return this.geoRef.worldToPhoto(localPoint);
            
        } catch (error) {
            console.error('❌ فشل تحويل World → Photo:', error);
            return worldPoint;
        }
    }

    /**
     * حساب المسافة بين نقطتين في نفس المشهد
     * @param {string} sceneId - معرف المشهد
     * @param {Object} pointA - النقطة الأولى {x, y, z}
     * @param {Object} pointB - النقطة الثانية {x, y, z}
     * @returns {number} المسافة بالمتر
     */
    calculateDistance(sceneId, pointA, pointB) {
        // تحويل النقاط إلى إحداثيات عالمية أولاً
        const globalA = this.sceneConnector.localToGlobal(sceneId, pointA);
        const globalB = this.sceneConnector.localToGlobal(sceneId, pointB);
        
        const dx = globalB.x - globalA.x;
        const dy = globalB.y - globalA.y;
        const dz = globalB.z - globalA.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * حساب الزاوية بين نقطتين
     * @param {Object} pointA - النقطة المركزية
     * @param {Object} pointB - النقطة المرجعية
     * @returns {number} الزاوية بالراديان
     */
    calculateAngle(pointA, pointB) {
        return Math.atan2(pointB.z - pointA.z, pointB.x - pointA.x);
    }

    /**
     * تدوير نقطة حول مركز
     * @param {Object} point - النقطة المراد تدويرها
     * @param {Object} center - مركز الدوران
     * @param {number} angle - زاوية الدوران بالراديان
     * @returns {Object} النقطة بعد الدوران
     */
    rotatePoint(point, center, angle) {
        const dx = point.x - center.x;
        const dz = point.z - center.z;
        
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        return {
            x: center.x + dx * cos - dz * sin,
            y: point.y,
            z: center.z + dx * sin + dz * cos
        };
    }

    /**
     * حساب نقطة منتصف بين نقطتين
     * @param {Object} pointA - النقطة الأولى
     * @param {Object} pointB - النقطة الثانية
     * @returns {Object} نقطة المنتصف
     */
    getMidPoint(pointA, pointB) {
        return {
            x: (pointA.x + pointB.x) / 2,
            y: (pointA.y + pointB.y) / 2,
            z: (pointA.z + pointB.z) / 2
        };
    }

    /**
     * التحقق مما إذا كانت النقطة داخل مضلع
     * @param {Object} point - النقطة المراد فحصها
     * @param {Array} polygon - مصفوفة نقاط المضلع
     * @returns {boolean} true إذا كانت النقطة داخل المضلع
     */
    isPointInPolygon(point, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, zi = polygon[i].z;
            const xj = polygon[j].x, zj = polygon[j].z;
            
            const intersect = ((zi > point.z) != (zj > point.z)) &&
                (point.x < (xj - xi) * (point.z - zi) / (zj - zi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    /**
     * تحويل إحداثيات متعددة بين المشاهد
     * @param {string} fromSceneId - المشهد المصدر
     * @param {string} toSceneId - المشهد الهدف
     * @param {Array} points - مصفوفة نقاط
     * @returns {Array} مصفوفة النقاط المحولة
     */
    transformPointsBetweenScenes(fromSceneId, toSceneId, points) {
        return points.map(point => 
            this.transformBetweenScenes(fromSceneId, toSceneId, point)
        );
    }

    /**
     * إنشاء مصفوفة تحويل بين مشهدين
     * @param {string} sceneId1 - المشهد الأول
     * @param {string} sceneId2 - المشهد الثاني
     * @returns {Object} مصفوفة التحويل {scale, rotation, translation}
     */
    getTransformationMatrix(sceneId1, sceneId2) {
        // الحصول على نقاط مرجعية بين المشهدين
        const anchors = this.sceneConnector.getAnchorsBetweenScenes(sceneId1, sceneId2);
        
        if (anchors.length < 3) {
            console.warn('⚠️ نقاط مرجعية غير كافية لحساب المصفوفة');
            return null;
        }
        
        // حساب معاملات التحويل (تقريبية)
        let scaleSum = 0;
        let rotationSum = 0;
        let translationSum = { x: 0, y: 0, z: 0 };
        
        anchors.forEach(anchor => {
            const point1 = anchor.localPoint;
            const point2 = anchor.globalPoint;
            
            // حساب المقياس
            const dist1 = Math.sqrt(point1.x * point1.x + point1.z * point1.z);
            const dist2 = Math.sqrt(point2.x * point2.x + point2.z * point2.z);
            scaleSum += dist2 / dist1;
            
            // حساب الدوران
            const angle1 = Math.atan2(point1.z, point1.x);
            const angle2 = Math.atan2(point2.z, point2.x);
            rotationSum += angle2 - angle1;
            
            // حساب الإزاحة
            translationSum.x += point2.x - point1.x;
            translationSum.y += point2.y - point1.y;
            translationSum.z += point2.z - point1.z;
        });
        
        const count = anchors.length;
        
        return {
            scale: scaleSum / count,
            rotation: rotationSum / count,
            translation: {
                x: translationSum.x / count,
                y: translationSum.y / count,
                z: translationSum.z / count
            }
        };
    }

    /**
     * تطبيق مصفوفة تحويل على نقطة
     * @param {Object} point - النقطة الأصلية
     * @param {Object} matrix - مصفوفة التحويل {scale, rotation, translation}
     * @returns {Object} النقطة بعد التحويل
     */
    applyTransformation(point, matrix) {
        // تدوير
        const cos = Math.cos(matrix.rotation);
        const sin = Math.sin(matrix.rotation);
        
        const rotatedX = point.x * cos - point.z * sin;
        const rotatedZ = point.x * sin + point.z * cos;
        
        // تطبيق المقياس والإزاحة
        return {
            x: rotatedX * matrix.scale + matrix.translation.x,
            y: point.y * matrix.scale + matrix.translation.y,
            z: rotatedZ * matrix.scale + matrix.translation.z
        };
    }

    /**
     * الحصول على سجل التحويلات
     * @param {number} limit - عدد السجلات المطلوبة
     * @returns {Array} سجل التحويلات
     */
    getConversionHistory(limit = 10) {
        return this.conversionHistory.slice(-limit);
    }

    /**
     * مسح سجل التحويلات
     */
    clearHistory() {
        this.conversionHistory = [];
        this.transformCache.clear();
        console.log('🗑️ تم مسح سجل التحويلات');
    }

    /**
     * الحصول على إحصائيات التحويلات
     * @returns {Object} إحصائيات التحويلات
     */
    getStats() {
        return {
            totalConversions: this.conversionHistory.length,
            cacheSize: this.transformCache.size,
            uniqueScenes: new Set(this.conversionHistory.flatMap(h => [h.from, h.to])).size,
            lastConversion: this.conversionHistory[this.conversionHistory.length - 1] || null
        };
    }
}
