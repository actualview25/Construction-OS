// =======================================
// ACTUAL CONSTRUCTION OS - MEP FIXTURE
// =======================================

export class Fixture {
    constructor(options = {}) {
        this.id = options.id || `fixture-${Date.now()}-${Math.random()}`;
        this.type = options.type || 'sink'; // sink, toilet, shower, faucet
        this.system = options.system || 'plumbing'; // plumbing, electrical, hvac
        this.position = options.position || { x: 0, y: 0, z: 0 };
        this.rotation = options.rotation || 0;
        this.connections = options.connections || [];
        this.specs = options.specs || {};
        this.mesh = null;
    }

    createMesh() {
        const group = new THREE.Group();

        switch (this.type) {
            case 'sink':
                this.createSink(group);
                break;
            case 'toilet':
                this.createToilet(group);
                break;
            case 'shower':
                this.createShower(group);
                break;
            case 'faucet':
                this.createFaucet(group);
                break;
            case 'light':
                this.createLight(group);
                break;
            case 'socket':
                this.createSocket(group);
                break;
            case 'ac_unit':
                this.createACUnit(group);
                break;
        }

        group.position.set(this.position.x, this.position.y, this.position.z);
        group.rotation.y = this.rotation;

        this.mesh = group;
        return group;
    }

    createSink(group) {
        // حوض المغسلة
        const baseGeo = new THREE.BoxGeometry(0.6, 0.1, 0.5);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.05;
        group.add(base);

        // الحوض
        const bowlGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
        const bowlMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const bowl = new THREE.Mesh(bowlGeo, bowlMat);
        bowl.position.set(0.1, 0.175, 0);
        group.add(bowl);

        // الصنبور
        const faucetGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.15);
        const faucetMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
        const faucet = new THREE.Mesh(faucetGeo, faucetMat);
        faucet.position.set(0.2, 0.225, 0.15);
        group.add(faucet);
    }

    createToilet(group) {
        // قاعدة المرحاض
        const baseGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.05;
        group.add(base);

        // جسم المرحاض
        const bodyGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0, 0.25, -0.1);
        group.add(body);

        // خزان المياه
        const tankGeo = new THREE.BoxGeometry(0.35, 0.3, 0.2);
        const tankMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const tank = new THREE.Mesh(tankGeo, tankMat);
        tank.position.set(0, 0.4, 0.15);
        group.add(tank);
    }

    createShower(group) {
        // قاعدة الدش
        const baseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.025;
        group.add(base);

        // عمود الدش
        const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.0);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(0.3, 1.0, 0);
        group.add(pole);

        // رأس الدش
        const headGeo = new THREE.SphereGeometry(0.08);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0.3, 2.0, 0);
        group.add(head);
    }

    createFaucet(group) {
        // قاعدة الصنبور
        const baseGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.1);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.05;
        group.add(base);

        // جسم الصنبور
        const bodyGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.15);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0.05, 0.125, 0);
        group.add(body);

        // مقبض
        const handleGeo = new THREE.BoxGeometry(0.04, 0.04, 0.06);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.set(-0.05, 0.125, 0.05);
        group.add(handle);
    }

    createLight(group) {
        // قاعدة اللمبة
        const baseGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.05);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        // اللمبة
        const bulbGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const bulbMat = new THREE.MeshStandardMaterial({ 
            color: 0xffaa00,
            emissive: 0x442200,
            emissiveIntensity: 0.5
        });
        const bulb = new THREE.Mesh(bulb
