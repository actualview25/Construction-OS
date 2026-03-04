// core/ProjectManager.js
// مسؤول عن إدارة المشروع والملفات والبيانات

export class ProjectManager {
    constructor(app) {
        this.app = app;
        this.currentProject = null;
        this.projects = [];
        this.recentProjects = [];
        
        this.loadFromStorage();
    }
    
    // ===== إنشاء مشروع جديد =====
    newProject(name = 'مشروع جديد') {
        const project = {
            id: `proj_${Date.now()}`,
            name: name,
            location: '',
            description: '',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            
            // إعدادات المشروع
            settings: {
                units: 'metric', // metric, imperial
                scale: 1.0,
                gridSize: 10,
                snapToGrid: true
            },
            
            // بيانات المشروع
            boundary: null,
            elements: [],
            materials: [],
            
            // إحصائيات
            stats: {
                elementCount: 0,
                concreteVolume: 0,
                steelWeight: 0,
                area: 0,
                estimatedCost: 0
            }
        };
        
        this.currentProject = project;
        this.projects.push(project);
        this.saveToStorage();
        this.updateRecent(project.id);
        
        return project;
    }
    
    // ===== حفظ المشروع =====
    saveProject() {
        if (!this.currentProject) return;
        
        // تحديث بيانات المشروع
        this.currentProject.modified = new Date().toISOString();
        this.currentProject.elements = this.app.sceneManager.serialize();
        this.currentProject.stats = this.calculateStats();
        
        this.saveToStorage();
        
        // حفظ في ملف (للتخزين الدائم)
        this.exportToFile();
    }
    
    // ===== تحميل مشروع =====
    loadProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) return null;
        
        this.currentProject = project;
        this.updateRecent(id);
        
        // تطبيق بيانات المشروع على المشهد
        this.applyProjectData();
        
        return project;
    }
    
    // ===== حساب الإحصائيات =====
    calculateStats() {
        const stats = {
            elementCount: this.app.sceneManager.elements.length,
            concreteVolume: 0,
            steelWeight: 0,
            area: 0,
            estimatedCost: 0
        };
        
        this.app.sceneManager.elements.forEach(e => {
            if (e.element.getBOQ) {
                const boq = e.element.getBOQ();
                
                // استخراج الأرقام
                Object.values(boq).forEach(val => {
                    if (typeof val === 'string') {
                        const match = val.match(/[\d.]+/);
                        if (match) {
                            const num = parseFloat(match[0]);
                            
                            if (val.includes('م³') || val.includes('m³')) {
                                stats.concreteVolume += num;
                            } else if (val.includes('كجم') || val.includes('kg')) {
                                stats.steelWeight += num;
                            } else if (val.includes('م²') || val.includes('m²')) {
                                stats.area += num;
                            }
                        }
                    }
                });
            }
        });
        
        // تقدير التكلفة (تقريبي)
        stats.estimatedCost = (stats.concreteVolume * 850) + (stats.steelWeight * 3.2);
        
        return stats;
    }
    
    // ===== التخزين المحلي =====
    saveToStorage() {
        const data = {
            projects: this.projects,
            recentProjects: this.recentProjects,
            currentProjectId: this.currentProject?.id
        };
        
        localStorage.setItem('constructionOS_projects', JSON.stringify(data));
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('constructionOS_projects');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.projects = data.projects || [];
                this.recentProjects = data.recentProjects || [];
                
                if (data.currentProjectId) {
                    this.currentProject = this.projects.find(p => p.id === data.currentProjectId);
                }
            } catch (e) {
                console.warn('❌ فشل تحميل المشاريع المحفوظة');
            }
        }
    }
    
    // ===== المشاريع الأخيرة =====
    updateRecent(projectId) {
        this.recentProjects = this.recentProjects.filter(id => id !== projectId);
        this.recentProjects.unshift(projectId);
        this.recentProjects = this.recentProjects.slice(0, 5); // آخر 5 مشاريع
    }
    
    getRecentProjects() {
        return this.recentProjects
            .map(id => this.projects.find(p => p.id === id))
            .filter(p => p);
    }
    
    // ===== التصدير =====
    exportToFile() {
        if (!this.currentProject) return;
        
        const data = JSON.stringify(this.currentProject, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentProject.name}.cosp`; // Construction OS Project
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const project = JSON.parse(e.target.result);
                    this.projects.push(project);
                    this.currentProject = project;
                    this.saveToStorage();
                    resolve(project);
                } catch (err) {
                    reject('❌ ملف غير صالح');
                }
            };
            
            reader.readAsText(file);
        });
    }
    
    // ===== التقارير =====
    generateReport(format = 'summary') {
        if (!this.currentProject) return '';
        
        const stats = this.calculateStats();
        const date = new Date().toLocaleDateString('ar-SA');
        
        let report = '';
        
        if (format === 'summary') {
            report = `
📋 تقرير المشروع
══════════════════════════════
🏗️ المشروع: ${this.currentProject.name}
📅 التاريخ: ${date}
══════════════════════════════
📊 الإحصائيات:
• عدد العناصر: ${stats.elementCount}
• حجم الخرسانة: ${stats.concreteVolume.toFixed(2)} م³
• وزن الحديد: ${stats.steelWeight.toFixed(2)} كجم
• المساحة: ${stats.area.toFixed(2)} م²
• التكلفة التقديرية: ${stats.estimatedCost.toFixed(2)} ريال
══════════════════════════════
            `;
        }
        
        return report;
    }
}