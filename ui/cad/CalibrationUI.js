// =======================================
// ACTUAL CONSTRUCTION OS - CALIBRATION UI
// =======================================

export class CalibrationUI {
    constructor(app, calibrationWizard) {
        this.app = app;
        this.calibrationWizard = calibrationWizard;
        this.panel = null;
        this.isActive = false;
    }

    show() {
        if (this.panel) {
            this.panel.remove();
        }

        this.panel = document.createElement('div');
        this.panel.className = 'calibration-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(20, 30, 40, 0.95);
            backdrop-filter: blur(10px);
            border: 2px solid #4a6c8f;
            border-radius: 16px;
            color: white;
            padding: 25px;
            z-index: 10000;
            min-width: 350px;
            direction: rtl;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        `;

        this.updatePanel();
        document.body.appendChild(this.panel);
        
        this.isActive = true;
        this.app.calibrationMode = true;
    }

    updatePanel() {
        const state = this.calibrationWizard.start();
        
        this.panel.innerHTML = `
            <h2 style="color: #88aaff; margin-top: 0;">📏 معالج المعايرة</h2>
            <div style="margin: 20px 0;">
                <div style="background: #1a2a3a; padding: 15px; border-radius: 8px;">
                    <div style="color: #88aaff; font-size: 14px;">الخطوة ${this.calibrationWizard.step} من 3</div>
                    <div style="font-size: 18px; margin: 10px 0;">${state.message}</div>
                    <div style="color: #aaa; font-size: 12px;">${state.instruction}</div>
                </div>
            </div>
            <div id="calibration-points" style="margin: 15px 0;">
                ${this.renderPoints()}
            </div>
            <div id="calibration-distance" style="margin: 15px 0; ${this.calibrationWizard.step === 2 ? 'display: block;' : 'display: none;'}">
                <label style="display: block; margin-bottom: 5px;">المسافة الحقيقية (متر):</label>
                <input type="number" id="known-distance" step="0.001" min="0.001" 
                       style="width: 100%; padding: 8px; background: #1a2a3a; border: 1px solid #4a6c8f; color: white; border-radius: 4px;">
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="calibration-cancel" style="background: #c0392b; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">إلغاء</button>
                <button id="calibration-next" style="background: #27ae60; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">${this.getButtonText()}</button>
            </div>
        `;

        this.bindEvents();
    }

    renderPoints() {
        const points = this.calibrationWizard.calibrationPoints;
        if (points.length === 0) return '';

        return `
            <div style="background: #1a2a3a; padding: 10px; border-radius: 4px;">
                <div style="color: #88aaff; margin-bottom: 5px;">النقاط المحددة:</div>
                ${points.map((p, i) => `
                    <div style="font-size: 12px; color: #aaa;">
                        نقطة ${i + 1}: (${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})
                    </div>
                `).join('')}
            </div>
        `;
    }

    getButtonText() {
        if (this.calibrationWizard.step === 3) return 'تم';
        if (this.calibrationWizard.step === 2) return 'معايرة';
        return 'التالي';
    }

    bindEvents() {
        document.getElementById('calibration-cancel').onclick = () => this.hide();
        
        document.getElementById('calibration-next').onclick = () => {
            if (this.calibrationWizard.step === 2) {
                const distance = document.getElementById('known-distance').value;
                if (!distance) {
                    alert('الرجاء إدخال المسافة');
                    return;
                }
                this.calibrationWizard.setKnownDistance(parseFloat(distance));
                const result = this.calibrationWizard.calculateScale();
                
                if (result.completed) {
                    this.showResult(result);
                } else {
                    this.updatePanel();
                }
            } else if (this.calibrationWizard.step === 3) {
                this.hide();
            }
        };
    }

    showResult(result) {
        this.panel.innerHTML = `
            <h2 style="color: #88aaff; margin-top: 0;">✅ تمت المعايرة</h2>
            <div style="background: #1a2a3a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <div style="margin-bottom: 10px;">📏 المسافة في النموذج: ${result.modelDistance} وحدة</div>
                <div style="margin-bottom: 10px;">📐 المسافة الحقيقية: ${result.realDistance} متر</div>
                <div style="font-size: 18px; color: #88aaff;">📊 المقياس: 1 وحدة = ${result.scale} متر</div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="calibration-close" style="background: #27ae60; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">إغلاق</button>
            </div>
        `;

        document.getElementById('calibration-close').onclick = () => this.hide();
    }

    hide() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
        this.isActive = false;
        this.app.calibrationMode = false;
        this.calibrationWizard.reset();
    }

    handleClick(point) {
        if (!this.isActive) return false;

        const result = this.calibrationWizard.addPoint(point);
        
        if (result && result.step === 3) {
            this.showResult(result);
        } else {
            this.updatePanel();
        }

        return true;
    }
}
