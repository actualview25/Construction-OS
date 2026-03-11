// =======================================
// ACTUAL VIEW CONSTRUCTION OS - FLOOR COPY SYSTEM
// =======================================

export class FloorCopySystem {
    constructor(globalSystem, sceneConnector) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.copyHistory = [];
        console.log('✅ FloorCopySystem initialized');
    }

    // نسخ طابق كامل
    async duplicateFloor(sourceFloorId, targetFloorId, heightChange = 3.0) {
        console.log(`🔄 بدء نسخ الطابق ${sourceFloorId} إلى ${targetFloorId}`);
        
        try {
            // الحصول على عناصر المصدر
            const sourceElements = await this.getFloorElements(sourceFloorId);
            
            // الحصول على إعدادات الطابق المصدر
            const sourceSettings = await this.getFloorSettings(sourceFloorId);
            
            // إنشاء نسخ من العناصر
            const copiedElements = await this.copyElements(
                sourceElements, 
                targetFloorId, 
                heightChange
            );
            
            // نسخ الإعدادات
            await this.copySettings(sourceSettings, targetFloorId);
            
            // تسجيل العملية
            this.logCopy(sourceFloorId, targetFloorId, copiedElements.length);
            
            console.log(`✅ تم نسخ ${copiedElements.length} عنصر بنجاح`);
            
            return {
                success: true,
                elementsCount: copiedElements.length,
                targetFloorId,
                sourceFloorId
            };
            
        } catch (error) {
            console.error('❌ فشل نسخ الطابق:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على عناصر الطابق
    async getFloorElements(floorId) {
        // يمكن تطويرها لاحقاً
        return this.sceneConnector.getElementsInScene(floorId) || [];
    }

    // الحصول على إعدادات الطابق
    async getFloorSettings(floorId) {
        // يمكن تطويرها لاحقاً
        return {
            materials: [],
            lights: [],
            cameras: []
        };
    }

    // نسخ العناصر
    async copyElements(elements, targetFloorId, heightChange) {
        const copied = [];
        
        for (const element of elements) {
            const copy = await this.copyElement(element, heightChange);
            if (copy) {
                await this.addElementToFloor(targetFloorId, copy);
                copied.push(copy);
            }
        }
        
        return copied;
    }

    // نسخ عنصر فردي
    async copyElement(element, heightChange) {
        try {
            // إنشاء نسخة عميقة
            const copy = JSON.parse(JSON.stringify(element));
            
            // تعديل المعرف
            copy.id = `${element.id}-copy-${Date.now()}-${Math.random()}`;
            
            // تعديل الموقع
            if (copy.position) {
                copy.position.y += heightChange;
            }
            
            // تعديل الطابع الزمني
            copy.createdAt = new Date().toISOString();
            copy.originalId = element.id;
            
            return copy;
            
        } catch (error) {
            console.warn('⚠️ فشل نسخ عنصر:', error);
            return null;
        }
    }

    // إضافة عنصر للطابق الهدف
    async addElementToFloor(floorId, element) {
        return this.sceneConnector.addElement(floorId, element);
    }

    // نسخ الإعدادات
    async copySettings(settings, targetFloorId) {
        // يمكن تطويرها لاحقاً
        console.log(`⚙️ تم نسخ الإعدادات إلى ${targetFloorId}`);
        return true;
    }

    // تسجيل عملية النسخ
    logCopy(sourceId, targetId, count) {
        this.copyHistory.push({
            id: `copy-${Date.now()}-${this.copyHistory.length}`,
            source: sourceId,
            target: targetId,
            elementsCount: count,
            timestamp: new Date().toISOString()
        });
    }

    // الحصول على تاريخ النسخ
    getCopyHistory(floorId = null) {
        if (floorId) {
            return this.copyHistory.filter(h => 
                h.source === floorId || h.target === floorId
            );
        }
        return this.copyHistory;
    }

    // تراجع عن آخر نسخة
    async undoLastCopy() {
        const lastCopy = this.copyHistory.pop();
        if (!lastCopy) {
            console.log('ℹ️ لا توجد عمليات للتراجع');
            return false;
        }
        
        console.log(`↩️ التراجع عن نسخة ${lastCopy.source} → ${lastCopy.target}`);
        
        // حذف العناصر المنسوخة
        await this.removeCopiedElements(lastCopy.target, lastCopy.timestamp);
        
        return true;
    }

    // حذف العناصر المنسوخة
    async removeCopiedElements(floorId, timestamp) {
        const elements = await this.getFloorElements(floorId);
        const copiedElements = elements.filter(el => 
            el.createdAt === timestamp || el.originalId
        );
        
        for (const element of copiedElements) {
            await this.sceneConnector.removeElement(floorId, element.id);
        }
        
        console.log(`🗑️ تم حذف ${copiedElements.length} عنصر من ${floorId}`);
    }
}
