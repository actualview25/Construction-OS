// =======================================
// ACTUAL CONSTRUCTION OS - PRIORITY QUEUE
// =======================================
// طابور أولويات ذكي للتحميل
// =======================================

export class PriorityQueue {
    constructor(integratedLoader) {
        this.loader = integratedLoader;
        this.queue = [];
        this.processing = false;
        this.maxConcurrent = 3;
        this.currentProcessing = 0;
        this.paused = false;
        
        // أولويات محددة بوضوح
        this.PRIORITY = {
            CRITICAL: 100,    // Tile في مجال الرؤية مباشرة
            HIGH: 70,         // Tile قريب من مجال الرؤية
            MEDIUM: 40,       // مشاهد متصلة
            LOW: 10,          // تحميل مسبق بعيد
            BACKGROUND: 1     // خلفية
        };

        // إحصائيات شاملة
        this.stats = {
            queued: 0,
            processed: 0,
            failed: 0,
            avgWaitTime: 0,
            totalWaitTime: 0,
            priorityBreakdown: {},
            typeBreakdown: {}
        };

        // للتصحيح
        this.debug = false;
    }

    // ==================== إدارة المهام ====================

    /**
     * إضافة مهمة جديدة للطابور
     * @param {Object} task - المهمة المراد إضافتها
     * @returns {string} - معرف المهمة
     */
    addTask(task) {
        // التحقق من صحة المهمة
        if (!task.type || !task.execute) {
            console.error('❌ مهمة غير صالحة:', task);
            return null;
        }

        const taskWithPriority = {
            ...task,
            priority: this.calculatePriority(task),
            addedAt: Date.now(),
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            attempts: 0,
            maxAttempts: task.maxAttempts || 3
        };

        // إدراج حسب الأولوية (تنازلياً)
        const index = this.queue.findIndex(t => t.priority < taskWithPriority.priority);
        if (index === -1) {
            this.queue.push(taskWithPriority);
        } else {
            this.queue.splice(index, 0, taskWithPriority);
        }

        // تحديث الإحصائيات
        this.stats.queued++;
        this.stats.priorityBreakdown[taskWithPriority.priority] = 
            (this.stats.priorityBreakdown[taskWithPriority.priority] || 0) + 1;
        this.stats.typeBreakdown[task.type] = 
            (this.stats.typeBreakdown[task.type] || 0) + 1;

        if (this.debug) {
            console.log(`📥 مهمة مضافة: ${task.type} (أولوية ${taskWithPriority.priority})`);
        }

        // بدء المعالجة إذا لم تكن جارية
        if (!this.processing && !this.paused) {
            this.processQueue();
        }

        return taskWithPriority.id;
    }

    /**
     * حساب الأولوية بناءً على عدة عوامل
     * @param {Object} task - المهمة
     * @returns {number} - قيمة الأولوية (1-100)
     */
    calculatePriority(task) {
        let priority = 0;

        // 1. الأولوية الأساسية حسب النوع
        switch (task.type) {
            case 'tile':
                priority += 50;
                break;
            case 'scene':
                priority += 30;
                break;
            case 'preload':
                priority += 15;
                break;
            case 'entity':
                priority += 20;
                break;
            case 'texture':
                priority += 10;
                break;
            default:
                priority += 5;
        }

        // 2. حسب المسافة من المستخدم (إذا وجدت)
        if (task.viewport && task.position) {
            const distance = this.calculateDistance(task.position, task.viewport);
            // كلما كانت المسافة أقل، كلما زادت الأولوية
            priority += Math.max(0, 50 - distance) * 0.5;
        }

        // 3. حسب اتجاه النظر
        if (task.direction && task.position) {
            const inView = this.isInView(task.position, task.direction);
            if (inView) priority += 25;
        }

        // 4. حسب الأهمية المحددة
        if (task.importance) {
            priority += Math.min(30, task.importance * 10);
        }

        // 5. حسب LOD المطلوب
        if (task.lod) {
            const lodPriority = { 
                'high': 30, 
                'medium': 20, 
                'low': 10,
                'culled': 0
            };
            priority += lodPriority[task.lod] || 0;
        }

        // 6. حسب عدد المحاولات (المهام الفاشلة تأخذ أولوية أقل)
        if (task.attempts > 0) {
            priority -= task.attempts * 5;
        }

        // التأكد من أن الأولوية ضمن النطاق 1-100
        return Math.min(100, Math.max(1, Math.floor(priority)));
    }

    /**
     * معالجة الطابور
     */
    async processQueue() {
        if (this.processing || this.paused || this.queue.length === 0) return;
        
        this.processing = true;

        while (this.queue.length > 0 && this.currentProcessing < this.maxConcurrent && !this.paused) {
            // أخذ المهمة ذات الأولوية القصوى
            const task = this.queue.shift();
            this.currentProcessing++;

            // معالجة المهمة بشكل غير متزامن
            this.processTask(task).finally(() => {
                this.currentProcessing--;
                this.stats.processed++;
                
                // تحديث متوسط وقت الانتظار
                const waitTime = Date.now() - task.addedAt;
                this.stats.totalWaitTime += waitTime;
                this.stats.avgWaitTime = this.stats.totalWaitTime / this.stats.processed;
            });
        }

        this.processing = false;

        // إذا بقي مهام ولم يكن متوقفاً، استمر بعد تأخير بسيط
        if (this.queue.length > 0 && !this.paused) {
            setTimeout(() => this.processQueue(), 50);
        }
    }

    /**
     * معالجة مهمة واحدة
     * @param {Object} task - المهمة المراد معالجتها
     */
    async processTask(task) {
        task.attempts++;

        if (this.debug) {
            console.log(`🔄 معالجة: ${task.type} (أولوية ${task.priority}, محاولة ${task.attempts})`);
        }

        const startTime = Date.now();

        try {
            // تنفيذ المهمة
            await task.execute();

            const duration = Date.now() - startTime;
            
            if (this.debug) {
                console.log(`✅ اكتملت: ${task.type} في ${duration}ms`);
            }

            // تسجيل النجاح في analytics إذا وجد
            if (this.loader?.analytics) {
                this.loader.analytics.logTaskSuccess({
                    ...task,
                    duration,
                    success: true
                });
            }

        } catch (error) {
            console.error(`❌ فشل معالجة ${task.type}:`, error.message);
            this.stats.failed++;

            // إعادة المحاولة بأولوية أقل إذا لم نتجاوز الحد الأقصى
            if (task.attempts < task.maxAttempts) {
                if (this.debug) {
                    console.log(`🔄 إعادة محاولة ${task.type} (محاولة ${task.attempts}/${task.maxAttempts})`);
                }

                // إضافة المهمة مرة أخرى بأولوية أقل
                setTimeout(() => {
                    this.addTask({
                        ...task,
                        priority: task.priority - 15,
                        addedAt: Date.now()
                    });
                }, 1000 * Math.pow(2, task.attempts)); // تأخير متزايد

            } else {
                console.error(`❌ فشل ${task.type} بعد ${task.attempts} محاولات`);
                
                // تسجيل الفشل في analytics
                if (this.loader?.analytics) {
                    this.loader.analytics.logTaskFailure(task, error);
                }
            }
        }
    }

    // ==================== دوال مساعدة ====================

    /**
     * حساب المسافة بين نقطتين
     * @param {Object} pos1 - النقطة الأولى
     * @param {Object} pos2 - النقطة الثانية
     * @returns {number} - المسافة
     */
    calculateDistance(pos1, pos2) {
        if (!pos1 || !pos2) return Infinity;
        
        const dx = (pos2.x || 0) - (pos1.x || 0);
        const dy = (pos2.y || 0) - (pos1.y || 0);
        const dz = (pos2.z || 0) - (pos1.z || 0);
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * هل النقطة في مجال الرؤية
     * @param {Object} position - موقع النقطة
     * @param {Object} direction - اتجاه النظر
     * @returns {boolean} - هل هي في مجال الرؤية
     */
    isInView(position, direction) {
        if (!direction || !position) return false;

        // حساب الزاوية بين اتجاه النظر وموقع النقطة
        const dx = position.x - direction.x;
        const dy = position.y - direction.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const viewAngle = direction.angle || 0;
        
        // مجال رؤية 60 درجة
        const diff = Math.abs(angle - viewAngle);
        return diff < 30 || diff > 330;
    }

    /**
     * إضافة Tiles قريبة للطابور
     * @param {string} sceneId - معرف المشهد
     * @param {Array} tiles - قائمة التايلات
     * @param {Object} viewport - موقع المستخدم
     * @param {Object} direction - اتجاه النظر
     */
    queueNearbyTiles(sceneId, tiles, viewport, direction) {
        if (!tiles || !Array.isArray(tiles)) return;

        tiles.forEach(tile => {
            // حساب مركز التايل
            const tilePos = {
                x: (tile.col + 0.5) * (tile.size || 256),
                y: (tile.row + 0.5) * (tile.size || 256),
                z: 0
            };

            const distance = this.calculateDistance(tilePos, viewport);

            // تحديد الأولوية والـ LOD
            let priority = this.PRIORITY.BACKGROUND;
            let lod = 'low';

            if (distance < 500) {
                priority = this.PRIORITY.CRITICAL;
                lod = 'high';
            } else if (distance < 1000) {
                priority = this.PRIORITY.HIGH;
                lod = 'medium';
            } else if (distance < 2000) {
                priority = this.PRIORITY.MEDIUM;
                lod = 'low';
            }

            // إضافة للطابور
            this.addTask({
                type: 'tile',
                sceneId,
                tile,
                lod,
                priority,
                position: tilePos,
                viewport,
                direction,
                importance: tile.importance || 1,
                execute: async () => {
                    if (this.loader && typeof this.loader.loadTileWithLOD === 'function') {
                        await this.loader.loadTileWithLOD(sceneId, tile, lod);
                    }
                }
            });
        });
    }

    /**
     * إضافة مشاهد متصلة للطابور
     * @param {string} currentSceneId - المشهد الحالي
     * @param {Array} connectedScenes - المشاهد المتصلة
     * @param {Object} currentPosition - موقع المستخدم
     */
    queueConnectedScenes(currentSceneId, connectedScenes, currentPosition) {
        if (!connectedScenes || !Array.isArray(connectedScenes)) return;

        connectedScenes.forEach(scene => {
            const distance = this.calculateDistance(scene.position, currentPosition);

            let priority = this.PRIORITY.BACKGROUND;
            if (distance < 20) {
                priority = this.PRIORITY.HIGH;
            } else if (distance < 50) {
                priority = this.PRIORITY.MEDIUM;
            }

            this.addTask({
                type: 'preload',
                sceneId: scene.id,
                priority,
                position: scene.position,
                importance: scene.importance || 1,
                execute: async () => {
                    if (this.loader && typeof this.loader.preloadScene === 'function') {
                        await this.loader.preloadScene(scene.id);
                    }
                }
            });
        });
    }

    // ==================== التحكم في الطابور ====================

    /**
     * إيقاف المعالجة مؤقتاً
     */
    pause() {
        this.paused = true;
        console.log('⏸️ طابور الأولويات متوقف مؤقتاً');
    }

    /**
     * استئناف المعالجة
     */
    resume() {
        this.paused = false;
        console.log('▶️ طابور الأولويات مستأنف');
        
        if (!this.processing && this.queue.length > 0) {
            this.processQueue();
        }
    }

    /**
     * إلغاء مهمة محددة
     * @param {string} taskId - معرف المهمة
     * @returns {boolean} - هل تم الإلغاء بنجاح
     */
    cancelTask(taskId) {
        const index = this.queue.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const task = this.queue[index];
            this.queue.splice(index, 1);
            this.stats.queued--;
            
            if (this.debug) {
                console.log(`🗑️ تم إلغاء مهمة: ${task.type}`);
            }
            return true;
        }
        return false;
    }

    /**
     * إلغاء جميع المهام من نوع معين
     * @param {string} type - نوع المهام المراد إلغاؤها
     */
    cancelTasksByType(type) {
        const before = this.queue.length;
        this.queue = this.queue.filter(t => t.type !== type);
        const removed = before - this.queue.length;
        this.stats.queued -= removed;
        
        if (removed > 0 && this.debug) {
            console.log(`🗑️ تم إلغاء ${removed} مهام من نوع ${type}`);
        }
    }

    /**
     * مسح الطابور بالكامل
     */
    clear() {
        this.queue = [];
        this.stats.queued = 0;
        console.log('🧹 تم مسح طابور الأولويات');
    }

    // ==================== إحصائيات ====================

    /**
     * الحصول على إحصائيات الطابور
     * @returns {Object} - الإحصائيات
     */
    getStats() {
        return {
            queueLength: this.queue.length,
            processing: this.currentProcessing,
            maxConcurrent: this.maxConcurrent,
            paused: this.paused,
            ...this.stats,
            priorityBreakdown: { ...this.stats.priorityBreakdown },
            typeBreakdown: { ...this.stats.typeBreakdown },
            nextPriority: this.queue[0]?.priority || 0,
            nextTaskType: this.queue[0]?.type || 'none',
            estimatedTimeRemaining: this.estimateTimeRemaining()
        };
    }

    /**
     * تقدير الوقت المتبقي لمعالجة الطابور
     * @returns {number} - الوقت التقديري بالمللي ثانية
     */
    estimateTimeRemaining() {
        if (this.queue.length === 0) return 0;
        
        const avgTimePerTask = 100; // تقدير 100ms لكل مهمة
        const concurrentTasks = this.maxConcurrent;
        
        return Math.ceil((this.queue.length / concurrentTasks) * avgTimePerTask);
    }

    /**
     * تفعيل/تعطيل وضع التصحيح
     * @param {boolean} enabled - تفعيل أم لا
     */
    setDebug(enabled) {
        this.debug = enabled;
        console.log(`🐛 وضع التصحيح ${enabled ? 'مفعل' : 'معطل'}`);
    }

    /**
     * الحصول على حالة الطابور كنص
     * @returns {string} - حالة الطابور
     */
    getStatusString() {
        const stats = this.getStats();
        return `📊 طابور: ${stats.queueLength} مهام | جاري: ${stats.processing}/${stats.maxConcurrent} | أولوية: ${stats.nextPriority}`;
    }
}

export default PriorityQueue;
