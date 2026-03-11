// =======================================
// ACTUAL VIEW CONSTRUCTION OS - ADVANCED CLASH DETECTION
// =======================================

import { ClashDetection } from './ClashDetection.js';

export class AdvancedClashDetection extends ClashDetection {
    constructor(globalSystem, sceneConnector) {
        super(globalSystem, sceneConnector);
        this.rules = [];
        this.exceptions = [];
        console.log('✅ AdvancedClashDetection initialized');
    }

    // إضافة قاعدة فحص مخصصة
    addRule(rule) {
        this.rules.push({
            id: `rule-${Date.now()}-${this.rules.length}`,
            ...rule
        });
    }

    // إضافة استثناء
    addException(exception) {
        this.exceptions.push({
            id: `exception-${Date.now()}-${this.exceptions.length}`,
            ...exception
        });
    }

    // فحص متقدم مع مراعاة القواعد والاستثناءات
    advancedDetect(sceneId, options = {}) {
        const baseClashes = this.detectInScene(sceneId);
        const filteredClashes = [];
        
        for (const clash of baseClashes) {
            // تطبيق القواعد
            if (this.applyRules(clash)) {
                // تطبيق الاستثناءات
                if (!this.isExcepted(clash)) {
                    filteredClashes.push(this.enhanceClash(clash));
                }
            }
        }
        
        return filteredClashes;
    }

    // تطبيق القواعد على التعارض
    applyRules(clash) {
        if (this.rules.length === 0) return true;
        
        for (const rule of this.rules) {
            if (rule.type === 'ignore' && rule.condition(clash)) {
                return false;
            }
            if (rule.type === 'require' && !rule.condition(clash)) {
                return false;
            }
        }
        return true;
    }

    // فحص إذا كان التعارض مستثنى
    isExcepted(clash) {
        return this.exceptions.some(exp => 
            exp.elementIds && 
            exp.elementIds.includes(clash.elements[0]) && 
            exp.elementIds.includes(clash.elements[1])
        );
    }

    // تحسين معلومات التعارض
    enhanceClash(clash) {
        return {
            ...clash,
            enhanced: true,
            analysis: this.analyzeClash(clash),
            recommendations: this.getRecommendations(clash),
            estimatedCost: this.estimateCost(clash)
        };
    }

    // تحليل التعارض
    analyzeClash(clash) {
        const analysis = {
            type: this.determineClashType(clash),
            critical: clash.severity === 'high',
            resolvable: true,
            estimatedTime: this.estimateResolutionTime(clash)
        };
        
        return analysis;
    }

    // تحديد نوع التعارض
    determineClashType(clash) {
        // يمكن توسيعها لاحقاً
        if (clash.penetration.x > 0.5) return 'structural';
        if (clash.penetration.y > 0.3) return 'vertical';
        return 'minor';
    }

    // تقدير وقت الحل
    estimateResolutionTime(clash) {
        switch(clash.severity) {
            case 'high': return '2-3 hours';
            case 'medium': return '1 hour';
            case 'low': return '15 minutes';
            default: return 'unknown';
        }
    }

    // توصيات لحل التعارض
    getRecommendations(clash) {
        const recommendations = [];
        
        if (clash.severity === 'high') {
            recommendations.push('إعادة تصميم المنطقة المتعارضة');
            recommendations.push('مراجعة المخططات الإنشائية');
        } else if (clash.severity === 'medium') {
            recommendations.push('تعديل موضع أحد العناصر');
            recommendations.push('فحص المسافات الآمنة');
        } else {
            recommendations.push('يمكن تجاهل هذا التعارض البسيط');
        }
        
        return recommendations;
    }

    // تقدير التكلفة
    estimateCost(clash) {
        const baseCost = 100; // وحدة نقدية
        switch(clash.severity) {
            case 'high': return baseCost * 5;
            case 'medium': return baseCost * 2;
            case 'low': return baseCost * 0.5;
            default: return 0;
        }
    }

    // فحص كامل للمشروع
    runFullCheck(scenes) {
        const report = {
            timestamp: new Date().toISOString(),
            totalScenes: scenes.size,
            scenes: {},
            summary: {
                total: 0,
                high: 0,
                medium: 0,
                low: 0
            }
        };
        
        for (const [sceneId, scene] of scenes) {
            const clashes = this.advancedDetect(sceneId);
            report.scenes[sceneId] = {
                name: scene.name,
                clashes: clashes
            };
            
            report.summary.total += clashes.length;
            report.summary.high += clashes.filter(c => c.severity === 'high').length;
            report.summary.medium += clashes.filter(c => c.severity === 'medium').length;
            report.summary.low += clashes.filter(c => c.severity === 'low').length;
        }
        
        return report;
    }
}
