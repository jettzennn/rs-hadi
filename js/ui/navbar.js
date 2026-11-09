// @ts-nocheck
import { DOCTORS_DATA } from "../data/mockData.js";

/**
 * @param {(docId?: string | null) => void} [openModalWithDoctor]
 */
export function initNavbarAndSections(openModalWithDoctor = () => {}) {
  const btnHamburger = document.getElementById("btnHamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (btnHamburger && mobileMenu) {
    btnHamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

  const doctorsGrid = document.getElementById("doctorsGrid");
  const filterPills = document.querySelectorAll(
    "#doctorFilterPills .filter-pill",
  );

  function renderDoctors(filterPoli = "semua") {
    if (!doctorsGrid) return;
    const filtered =
      filterPoli === "semua"
        ? DOCTORS_DATA.slice(0, 3)
        : DOCTORS_DATA.filter((d) => d.poliId === filterPoli);

    const listToShow =
      filtered.length > 0 ? filtered : DOCTORS_DATA.slice(0, 3);

    doctorsGrid.innerHTML = listToShow
      .map(
        (doc) => `
      <article class="doctor-card">
        <div class="doc-photo-wrap" style="background: ${doc.bgGradient}">
          <span class="doc-avail-badge"><span class="status-dot green"></span> Jadwal tersedia</span>
          <div class="doc-avatar-art">${doc.initials}</div>
        </div>
        <div class="doc-card-body">
          <div class="doc-meta-top">
            <span>♥ ${doc.poliName}</span>
            <strong>★ ${doc.rating}</strong>
          </div>
          <h3>${doc.name}</h3>
          <p class="doc-exp">${doc.experience} · ${doc.reviews} ulasan</p>
          <div class="doc-card-foot">
            <div>
              <small>JADWAL TERDEKAT</small>
              <strong>${doc.nextAvailable}</strong>
            </div>
            <button class="btn-circle-orange select-doc-btn" data-doc-id="${doc.id}" aria-label="Pilih ${doc.name}">
              &rarr;
            </button>
          </div>
        </div>
      </article>
    `,
      )
      .join("");

    doctorsGrid.querySelectorAll(".select-doc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const docId = btn.getAttribute("data-doc-id");
        if (openModalWithDoctor) openModalWithDoctor(docId);
      });
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      renderDoctors(pill.getAttribute("data-filter") || "semua");
    });
  });

  renderDoctors("semua");

  const btnSimulate = document.getElementById("btnSimulateAmbulance");
  const btnReset = document.getElementById("btnResetAmbulance");
  const marker = document.getElementById("ambulanceMarker");
  const etaMinutes = document.getElementById("etaMinutes");
  const etaTextStatus = document.getElementById("etaTextStatus");
  const etaTimeline = document.getElementById("etaTimeline");

  let ambInterval = null;
  const waypoints = [
    { x: 480, y: 115, eta: 7 },
    { x: 400, y: 145, eta: 5 },
    { x: 300, y: 175, eta: 4 },
    { x: 200, y: 165, eta: 2 },
    { x: 110, y: 205, eta: 1 },
    { x: 70, y: 230, eta: 0 },
  ];

  function startAmbulanceSimulation() {
    if (ambInterval) clearInterval(ambInterval);
    let idx = 0;

    ambInterval = setInterval(() => {
      const pt = waypoints[idx];
      if (marker) {
        marker.style.transition = "transform 0.8s ease-in-out";
        marker.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
      }
      const label = pt.eta === 0 ? "Tiba!" : String(pt.eta);
      if (etaMinutes) etaMinutes.textContent = label;
      if (etaTextStatus) etaTextStatus.textContent = String(pt.eta);
      if (etaTimeline) etaTimeline.textContent = String(pt.eta);

      idx++;
      if (idx >= waypoints.length) {
        clearInterval(ambInterval);
      }
    }, 950);
  }

  if (btnSimulate) {
    btnSimulate.addEventListener("click", startAmbulanceSimulation);
  }
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (marker) marker.setAttribute("transform", "translate(300, 175)");
      if (etaMinutes) etaMinutes.textContent = "7";
      if (etaTextStatus) etaTextStatus.textContent = "7";
      if (etaTimeline) etaTimeline.textContent = "7";
    });
  }
}
