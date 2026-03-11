// =======================================
// ACTUAL VIEW CONSTRUCTION OS - FLOOR NAVIGATION
// =======================================

export class FloorNavigation {
    constructor(floorConnector) {
        this.floorConnector = floorConnector;
        this.currentFloor = null;
        this.navigationHistory = [];
        this.bookmarks = new Map();
        console.log('✅ FloorNavigation initialized');
    }

    // الانتقال إلى طابق
    navigateToFloor(floorId) {
        const floor = this.floorConnector.floors.get(floorId);
        if (!floor) {
            console.error('❌ الطابق غير موجود');
            return false;
        }
        
        // تسجيل الطابق الحالي في التاريخ
        if (this.currentFloor) {
            this.navigationHistory.push({
                floorId: this.currentFloor,
                timestamp: new Date().toISOString()
            });
        }
        
        // تحديث الطابق الحالي
        this.currentFloor = floorId;
        
        console.log(`📌 الانتقال إلى الطابق ${floorId} (المستوى ${floor.level})`);
        
        // حدث الانتقال
        this.emitNavigationEvent('floorChanged', floor);
        
        return true;
    }

    // العودة إلى الطابق السابق
    goBack() {
        if (this.navigationHistory.length === 0) {
            console.log('ℹ️ لا يوجد طابق سابق');
            return false;
        }
        
        const previous = this.navigationHistory.pop();
        return this.navigateToFloor(previous.floorId);
    }

    // الصعود طابق للأعلى
    goUp() {
        if (!this.currentFloor) {
            console.log('ℹ️ لا يوجد طابق حالي');
            return false;
        }
        
        const upper = this.floorConnector.getUpperFloor(this.currentFloor);
        if (upper) {
            return this.navigateToFloor(upper.id);
        } else {
            console.log('ℹ️ لا يوجد طابق علوي');
            return false;
        }
    }

    // النزول طابق للأسفل
    goDown() {
        if (!this.currentFloor) {
            console.log('ℹ️ لا يوجد طابق حالي');
            return false;
        }
        
        const lower = this.floorConnector.getLowerFloor(this.currentFloor);
        if (lower) {
            return this.navigateToFloor(lower.id);
        } else {
            console.log('ℹ️ لا يوجد طابق سفلي');
            return false;
        }
    }

    // إضافة إشارة مرجعية للطابق الحالي
    addBookmark(name) {
        if (!this.currentFloor) {
            console.log('ℹ️ لا يوجد طابق حالي لوضع إشارة');
            return false;
        }
        
        const bookmarkId = `bookmark-${Date.now()}`;
        this.bookmarks.set(bookmarkId, {
            id: bookmarkId,
            name: name || `طابق ${this.currentFloor}`,
            floorId: this.currentFloor,
            timestamp: new Date().toISOString()
        });
        
        console.log(`🔖 تم إضافة إشارة: ${name}`);
        return bookmarkId;
    }

    // الانتقال إلى إشارة مرجعية
    goToBookmark(bookmarkId) {
        const bookmark = this.bookmarks.get(bookmarkId);
        if (!bookmark) {
            console.error('❌ الإشارة غير موجودة');
            return false;
        }
        
        return this.navigateToFloor(bookmark.floorId);
    }

    // حذف إشارة مرجعية
    removeBookmark(bookmarkId) {
        if (this.bookmarks.delete(bookmarkId)) {
            console.log(`🗑️ تم حذف الإشارة ${bookmarkId}`);
            return true;
        }
        return false;
    }

    // الحصول على جميع الإشارات
    getBookmarks() {
        return Array.from(this.bookmarks.values());
    }

    // البحث عن طابق باسم أو مستوى
    findFloor(query) {
        const floors = this.floorConnector.getAllFloors();
        
        return floors.filter(floor => 
            floor.id.includes(query) ||
            floor.level.toString().includes(query) ||
            (floor.name && floor.name.includes(query))
        );
    }

    // إنشاء مسار بين طابقين
    createPath(fromFloorId, toFloorId) {
        const fromFloor = this.floorConnector.floors.get(fromFloorId);
        const toFloor = this.floorConnector.floors.get(toFloorId);
        
        if (!fromFloor || !toFloor) {
            console.error('❌ أحد الطابقين غير موجود');
            return null;
        }
        
        const path = [];
        let currentLevel = fromFloor.level;
        const targetLevel = toFloor.level;
        
        if (currentLevel < targetLevel) {
            // صعود
            while (currentLevel < targetLevel) {
                currentLevel++;
                const floor = this.floorConnector.getFloorAtLevel(currentLevel);
                if (floor) path.push(floor.id);
            }
        } else {
            // نزول
            while (currentLevel > targetLevel) {
                currentLevel--;
                const floor = this.floorConnector.getFloorAtLevel(currentLevel);
                if (floor) path.push(floor.id);
            }
        }
        
        return {
            from: fromFloorId,
            to: toFloorId,
            path: path,
            steps: path.length
        };
    }

    // الحصول على تاريخ التصفح
    getHistory() {
        return this.navigationHistory;
    }

    // مسح التاريخ
    clearHistory() {
        this.navigationHistory = [];
        console.log('🗑️ تم مسح تاريخ التصفح');
    }

    // إرسال حدث التنقل
    emitNavigationEvent(eventName, data) {
        const event = new CustomEvent(`floorNavigation:${eventName}`, {
            detail: {
                ...data,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            currentFloor: this.currentFloor,
            historySize: this.navigationHistory.length,
            bookmarksCount: this.bookmarks.size,
            availableFloors: this.floorConnector.floors.size
        };
    }
}
