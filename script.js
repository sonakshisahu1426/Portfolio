const canvasContainer = document.getElementById('canvas-bg');

if (window.THREE && canvasContainer) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    camera.position.z = 15;

    const group = new THREE.Group();
    scene.add(group);

    const sphereGeometry = new THREE.IcosahedronGeometry(10, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.11
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < positions.length; i++) {
        positions[i] = (Math.random() - 0.5) * 60;
    }

    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffffff,
        transparent: true,
        opacity: 0.55
    });

    const particles = new THREE.Points(
        particlesGeometry,
        particlesMaterial
    );

    group.add(particles);

    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
        targetX = (event.clientX / window.innerWidth - 0.5) * 0.4;
        targetY = (event.clientY / window.innerHeight - 0.5) * 0.25;
    });

    const clock = new THREE.Clock();

    function animate() {
        const elapsed = clock.getElapsedTime();

        sphere.rotation.y = elapsed * 0.12;
        sphere.rotation.x = elapsed * 0.07;
        particles.rotation.y = -elapsed * 0.06;

        group.position.y = Math.sin(elapsed * 0.35) * 0.25;
        group.rotation.y += (targetX - group.rotation.y) * 0.02;
        group.rotation.x += (targetY - group.rotation.x) * 0.02;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}
