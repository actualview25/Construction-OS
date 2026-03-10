// =======================================
// ACTUAL CONSTRUCTION OS - MAIN (نسخة مبسطة تضمن العمل)
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log('🚀 بدء تشغيل النسخة المبسطة...');

class ActualConstructionOS {
    constructor() {
        console.log('🔄 إنشاء المشهد...');
        
        // 1. المشهد
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111122);
        
        // 2. الكاميرا
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // 3. الريندرر
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        
        // 4. إضافة الريندرر للصفحة
        const container = document.getElementById('container');
        if (container) {
            container.appendChild(this.renderer.domElement);
            console.log('✅ تم إضافة الريندرر إلى container');
        } else {
            document.body.appendChild(this.renderer.domElement);
            console.log('✅ تم إضافة الريندرر إلى body');
        }
        
        // 5. التحكم
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        
        // 6. العناصر الأساسية
        this.setupBasics();
        
        // 7. بدء الحركة
        this.animate();
        
        console.log('✅ التطبيق جاهز');
    }
    
    setupBasics() {
        // إضاءة محيطة
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        // إضاءة اتجاهية
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        this.scene.add(dirLight);
        
        // شبكة أرضية
        const gridHelper = new THREE.GridHelper(20, 20, 0x88aaff, 0x335588);
        this.scene.add(gridHelper);
        
        // مكعب كبير وواضح
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffaa44,
            emissive: 0x442200
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, 1, 0);
        this.scene.add(this.cube);
        console.log('✅ تم إضافة المكعب');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // دوران المكعب
        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.02;
        }
        
        // تحديث التحكم
        if (this.controls) {
            this.controls.update();
        }
        
        // الرندر
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// =======================================
// التشغيل
// =======================================

window.addEventListener('load', () => {
    console.log('🌟 بدء تحميل التطبيق...');
    
    // إخفاء شاشة التحميل بعد 2 ثانية
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
    }, 2000);
    
    // إنشاء التطبيق
    window.app = new ActualConstructionOS();
});

// إعادة التشغيل
window.restartApp = () => {
    location.reload();
};
