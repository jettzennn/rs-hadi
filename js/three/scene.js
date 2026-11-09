// @ts-nocheck

export function initThreeScene() {
  const canvas = document.getElementById("hospital3DCanvas");
  if (!canvas || typeof window.THREE === "undefined") return null;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfaf6f0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;

  // KAMERA ORTHOGRAPHIC ISOMETRIK (Rahasia tampilan maket arsitektur di video!)
  const frustumSize = 7.2;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const camera = new THREE.OrthographicCamera(
    (-frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    100,
  );

  // Sudut pandang miring atas isometrik tetap
  camera.position.set(12, 11, 12);
  camera.zoom = 1.0;
  camera.updateProjectionMatrix();

  const rendererState = {
    lookTarget: new THREE.Vector3(0, 1.2, 0),
    frustumSize: frustumSize,
    animatedObjects: null,
  };

  // Pencahayaan Lembut Hangat (Warm Architectural Daylight)
  const hemiLight = new THREE.HemisphereLight(0xfffaf2, 0xd8c6b0, 0.8);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffe8cc, 0.9);
  dirLight.position.set(10, 18, 12);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 45;
  const d = 10;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0004;
  scene.add(dirLight);

  function updateOrthoBounds() {
    if (!canvas) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const asp = width / height;

    camera.left = (-rendererState.frustumSize * asp) / 2;
    camera.right = (rendererState.frustumSize * asp) / 2;
    camera.top = rendererState.frustumSize / 2;
    camera.bottom = -rendererState.frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", updateOrthoBounds);
  updateOrthoBounds();

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    if (rendererState.animatedObjects) {
      const { ambulance, scannerCore } = rendererState.animatedObjects;
      if (ambulance) {
        ambulance.position.x = 0.5 + Math.sin(elapsed * 0.65) * 1.3;
      }
      if (scannerCore) {
        scannerCore.position.z = -2.2 + Math.sin(elapsed * 1.4) * 0.22;
      }
    }

    camera.lookAt(rendererState.lookTarget);
    renderer.render(scene, camera);
  }
  animate();

  return { scene, camera, renderer, rendererState };
}
