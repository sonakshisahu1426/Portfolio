// --- 1. SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-bg').appendChild(renderer.domElement);

camera.position.z = 15;

// --- 2. CREATE OBJECTS ---

// Group to hold 3D elements
const elementsGroup = new THREE.Group();
scene.add(elementsGroup);

// A. Wireframe Icosahedron (The "Tech Sphere")
const geometry = new THREE.IcosahedronGeometry(10, 1); // Radius 10, Detail 1
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00d4ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const mainSphere = new THREE.Mesh(geometry, material);
elementsGroup.add(mainSphere);

// B. Particle System (Represents Data/DSA)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 600;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles randomly in 3D space
    posArray[i] = (Math.random() - 0.5) * 60;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
elementsGroup.add(particlesMesh);

// --- 3. LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00d4ff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

// --- 4. ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the sphere slowly
    mainSphere.rotation.y = elapsedTime * 0.15;
    mainSphere.rotation.x = elapsedTime * 0.1;

    // Rotate particles slowly
    particlesMesh.rotation.y = -elapsedTime * 0.1;
    
    // Make the whole group float slightly
    elementsGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// --- 5. MOUSE INTERACTION (Parallax Effect) ---
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Add simple easing to mouse movement in the animation loop
function updateOnMouseMove() {
    elementsGroup.rotation.y += 0.05 * (mouseX - elementsGroup.rotation.y);
    elementsGroup.rotation.x += 0.05 * (mouseY - elementsGroup.rotation.x);
    
    requestAnimationFrame(updateOnMouseMove);
}
updateOnMouseMove();

// --- 6. RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});