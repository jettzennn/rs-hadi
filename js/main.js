// @ts-nocheck
import { initNavbarAndSections } from "./ui/navbar.js";
import { initScrollytelling } from "./ui/scrollytelling.js";
import { initBookingModal } from "./ui/bookingModal.js";
import { initThreeScene } from "./three/scene.js";
import { buildHospitalWorld } from "./three/models.js";
import { initScrollCamera } from "./three/scrollCamera.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi Modal Buat Janji 5 Langkah
  const { openModalWithDoctor } = initBookingModal();

  // 2. Inisialisasi Navbar, Filter Dokter, & Simulasi Peta Ambulans
  initNavbarAndSections(openModalWithDoctor);

  // 3. Inisialisasi Dunia 3D Three.js (Gedung Eksterior + 5 Ruangan Interior)
  const threeApp = initThreeScene();
  let cameraController = null;

  if (threeApp) {
    const models = buildHospitalWorld(threeApp.scene);
    threeApp.rendererState.animatedObjects = models;
    cameraController = initScrollCamera(
      threeApp.scene,
      threeApp.camera,
      models,
      threeApp.rendererState,
    );
  }

  // 4. Hubungkan Scrollytelling dengan Pergerakan Kamera 3D
  initScrollytelling((stepIndex) => {
    if (cameraController && typeof cameraController.moveToStep === "function") {
      cameraController.moveToStep(stepIndex);
    }
  });
});
