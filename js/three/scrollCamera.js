// @ts-nocheck

export function initScrollCamera(scene, camera, models, rendererState) {
  if (typeof window.gsap === "undefined") return;

  // Offset posisi kamera Orthographic selalu menjaga sudut kemiringan isometrik (dx=9, dy=8.5, dz=9)
  const ISO_OFFSET = { x: 9.0, y: 8.5, z: 9.0 };

  const STEP_TARGETS = [
    // Step 0: Hero - Gedung Eksterior RS Hadi 7 Lantai
    { mode: "exterior", look: { x: 0.3, y: 1.6, z: 0.4 }, zoom: 0.92 },
    // Step 1: Pendaftaran
    { mode: "interior", look: { x: -3.4, y: 0.5, z: 1.4 }, zoom: 1.28 },
    // Step 2: Poliklinik
    { mode: "interior", look: { x: -0.1, y: 0.5, z: 1.3 }, zoom: 1.32 },
    // Step 3: Lab & Radiologi
    { mode: "interior", look: { x: 0.0, y: 0.5, z: -2.1 }, zoom: 1.28 },
    // Step 4: Farmasi
    { mode: "interior", look: { x: 3.4, y: 0.5, z: 1.1 }, zoom: 1.32 },
    // Step 5: Kasir
    { mode: "interior", look: { x: 4.1, y: 0.5, z: 1.75 }, zoom: 1.25 },
  ];

  function moveToStep(stepIndex = 0) {
    const target = STEP_TARGETS[stepIndex] || STEP_TARGETS[0];

    if (target.mode === "exterior") {
      window.gsap.to(models.exteriorGroup.position, {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      window.gsap.to(models.interiorGroup.position, {
        y: -18,
        duration: 0.7,
        ease: "power2.in",
      });
    } else {
      window.gsap.to(models.exteriorGroup.position, {
        y: 18,
        duration: 0.7,
        ease: "power2.in",
      });
      window.gsap.to(models.interiorGroup.position, {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    // Geser Kamera & Titik Fokus bersamaan agar sudut kemiringan Isometrik TIDAK berubah sedikit pun!
    window.gsap.to(camera.position, {
      x: target.look.x + ISO_OFFSET.x,
      y: target.look.y + ISO_OFFSET.y,
      z: target.look.z + ISO_OFFSET.z,
      duration: 1.0,
      ease: "power3.inOut",
    });

    if (rendererState && rendererState.lookTarget) {
      window.gsap.to(rendererState.lookTarget, {
        x: target.look.x,
        y: target.look.y,
        z: target.look.z,
        duration: 1.0,
        ease: "power3.inOut",
      });
    }

    window.gsap.to(camera, {
      zoom: target.zoom,
      duration: 1.0,
      ease: "power3.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }

  moveToStep(0);

  return { moveToStep };
}
