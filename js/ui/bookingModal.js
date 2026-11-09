// @ts-nocheck
import {
  POLIKLINIK_DATA,
  DOCTORS_DATA,
  SCHEDULE_DATES,
  SCHEDULE_TIMES,
  SAMPLE_PATIENT,
  formatRupiah,
} from "../data/mockData.js";

export function initBookingModal() {
  const backdrop = document.getElementById("bookingModalBackdrop");
  const closeBtn = document.getElementById("closeBookingModal");
  const contentArea = document.getElementById("modalStepContent");
  const footerArea = document.getElementById("modalFooter");
  const btnPrev = document.getElementById("btnModalPrev");
  const btnNext = document.getElementById("btnModalNext");
  const progressFill = document.getElementById("modalProgressFill");
  const stepListItems = document.querySelectorAll("#modalStepList li");

  const sumServiceBlock = document.getElementById("sumServiceBlock");
  const sumServiceText = document.getElementById("sumServiceText");
  const sumDoctorBlock = document.getElementById("sumDoctorBlock");
  const sumDoctorText = document.getElementById("sumDoctorText");
  const sumScheduleBlock = document.getElementById("sumScheduleBlock");
  const sumScheduleText = document.getElementById("sumScheduleText");
  const sumPriceBlock = document.getElementById("sumPriceBlock");
  const sumPriceText = document.getElementById("sumPriceText");

  const state = {
    step: 1,
    poliId: "jantung",
    doctorId: "dr-raka",
    dateId: "28-okt",
    time: "10:00",
    patient: {
      fullName: "",
      nik: "",
      birthDate: "",
      gender: "Perempuan",
      phone: "",
      email: "",
      guarantee: "Umum / Pribadi",
      complaint: "",
    },
    paymentMethod: "QRIS",
    adminFee: 5000,
    ticketQueue: "A-030",
    bookingCode: "HADI-32WUX8",
  };

  function getSelectedPoli() {
    return (
      POLIKLINIK_DATA.find((p) => p.id === state.poliId) || POLIKLINIK_DATA[0]
    );
  }

  function getSelectedDoctor() {
    return DOCTORS_DATA.find((d) => d.id === state.doctorId) || DOCTORS_DATA[0];
  }

  function getSelectedDate() {
    return (
      SCHEDULE_DATES.find((d) => d.id === state.dateId) || SCHEDULE_DATES[3]
    );
  }

  function updateSidebarAndProgress() {
    const pct = Math.min(state.step * 20, 100);
    if (progressFill) progressFill.style.width = `${pct}%`;

    stepListItems.forEach((li) => {
      const s = parseInt(li.getAttribute("data-step") || "1", 10);
      li.classList.remove("active", "done");
      if (state.step === 6 || s < state.step) {
        li.classList.add("done");
      } else if (s === state.step) {
        li.classList.add("active");
      }
    });

    const poli = getSelectedPoli();
    const doc = getSelectedDoctor();
    const dt = getSelectedDate();

    if (sumServiceBlock && sumServiceText) {
      sumServiceBlock.classList.remove("hidden");
      sumServiceText.textContent = poli.name;
    }
    if (sumDoctorBlock && sumDoctorText) {
      sumDoctorBlock.classList.toggle("hidden", state.step < 2);
      sumDoctorText.textContent = doc.shortName;
    }
    if (sumScheduleBlock && sumScheduleText) {
      sumScheduleBlock.classList.toggle("hidden", state.step < 3);
      sumScheduleText.textContent = `${dt.day}, ${dt.dateNum} Okt · ${state.time}`;
    }
    if (sumPriceBlock && sumPriceText) {
      sumPriceBlock.classList.toggle("hidden", state.step < 2);
      sumPriceText.textContent = formatRupiah(doc.price);
    }

    if (footerArea) {
      footerArea.classList.toggle("hidden", state.step >= 5);
    }
    if (btnPrev) {
      btnPrev.style.visibility = state.step > 1 ? "visible" : "hidden";
    }
  }

  function renderStep() {
    updateSidebarAndProgress();
    if (!contentArea) return;

    if (state.step === 1) {
      contentArea.innerHTML = `
        <p class="eyebrow text-orange">LANGKAH 1 DARI 5</p>
        <h3>Pilih layanan</h3>
        <p style="font-size:0.86rem;color:var(--text-secondary);">Pilih poliklinik sesuai kebutuhan Anda.</p>
        <div class="modal-options-grid">
          ${POLIKLINIK_DATA.map(
            (p) => `
            <div class="modal-option-card ${p.id === state.poliId ? "selected" : ""}" data-poli="${p.id}">
              <strong>${p.icon} ${p.name}</strong>
              <p>${p.desc}</p>
              <small style="display:block;margin-top:0.5rem;font-size:0.7rem;color:var(--text-muted);">${p.meta}</small>
            </div>
          `,
          ).join("")}
        </div>
      `;

      contentArea.querySelectorAll(".modal-option-card").forEach((card) => {
        card.addEventListener("click", () => {
          state.poliId = card.getAttribute("data-poli") || "jantung";
          const matchingDoc = DOCTORS_DATA.find(
            (d) => d.poliId === state.poliId,
          );
          if (matchingDoc) state.doctorId = matchingDoc.id;
          renderStep();
        });
      });
    } else if (state.step === 2) {
      const docs = DOCTORS_DATA.filter((d) => d.poliId === state.poliId);
      const list = docs.length > 0 ? docs : DOCTORS_DATA;

      contentArea.innerHTML = `
        <p class="eyebrow text-orange">LANGKAH 2 DARI 5</p>
        <h3>Pilih dokter</h3>
        <p style="font-size:0.86rem;color:var(--text-secondary);">Bandingkan jadwal terdekat, pengalaman, dan tarif konsultasi.</p>
        <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:1.25rem;">
          ${list
            .map(
              (d) => `
            <div class="modal-option-card ${d.id === state.doctorId ? "selected" : ""}" data-doc="${d.id}" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
              <div>
                <strong>${d.name}</strong>
                <p>${d.poliFull}</p>
                <small style="color:var(--text-secondary);">★ ${d.rating} · ${d.experience} · ${d.days}</small>
              </div>
              <div style="text-align:right;white-space:nowrap;">
                <strong>${formatRupiah(d.price)}</strong>
                <small style="display:block;color:var(--status-green);font-weight:700;">${d.nextAvailable}</small>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;

      contentArea.querySelectorAll(".modal-option-card").forEach((card) => {
        card.addEventListener("click", () => {
          state.doctorId = card.getAttribute("data-doc") || "dr-raka";
          renderStep();
        });
      });
    } else if (state.step === 3) {
      const doc = getSelectedDoctor();
      const dt = getSelectedDate();

      contentArea.innerHTML = `
        <p class="eyebrow text-orange">LANGKAH 3 DARI 5</p>
        <h3>Pilih jadwal</h3>
        <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:1rem;">
          Slot yang dicoret sudah terisi oleh pasien lain. Jadwal praktik <strong>${doc.shortName}</strong>
        </p>

        <label style="font-size:0.78rem;font-weight:700;">Pilih tanggal</label>
        <div class="date-slots-row">
          ${SCHEDULE_DATES.map(
            (d) => `
            <button class="slot-btn ${d.id === state.dateId ? "selected" : ""}" data-date="${d.id}" ${d.disabled ? "disabled style='opacity:0.4;cursor:not-allowed;'" : ""}>
              <small style="display:block;font-size:0.65rem;">${d.day}</small>
              <strong style="font-size:1.1rem;">${d.dateNum}</strong>
              <small style="display:block;font-size:0.65rem;">${d.month}</small>
            </button>
          `,
          ).join("")}
        </div>

        <label style="font-size:0.78rem;font-weight:700;">Pilih jam · ${dt.fullLabel}</label>
        <div class="time-slots-grid">
          ${SCHEDULE_TIMES.map(
            (t) => `
            <button class="slot-btn ${t.time === state.time ? "selected" : ""}" data-time="${t.time}" ${!t.available ? "disabled style='opacity:0.4;text-decoration:line-through;cursor:not-allowed;'" : ""}>
              ${t.time}
            </button>
          `,
          ).join("")}
        </div>
        <small style="color:var(--text-secondary);"><span class="status-dot green"></span> tersedia &nbsp;&middot;&nbsp; <span class="status-dot" style="background:var(--accent-orange);"></span> hampir penuh</small>
      `;

      contentArea.querySelectorAll("[data-date]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.dateId = btn.getAttribute("data-date") || "28-okt";
          renderStep();
        });
      });

      contentArea.querySelectorAll("[data-time]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.time = btn.getAttribute("data-time") || "10:00";
          renderStep();
        });
      });
    } else if (state.step === 4) {
      const p = state.patient;
      contentArea.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
          <div>
            <p class="eyebrow text-orange">LANGKAH 4 DARI 5</p>
            <h3>Data pasien</h3>
            <p style="font-size:0.82rem;color:var(--text-secondary);">Isi sesuai KTP agar pendaftaran di loket lebih cepat.</p>
          </div>
          <button class="btn-outline" id="btnFillSampleData" style="font-size:0.8rem;padding:0.5rem 0.9rem;">
            ✨ Isi data contoh
          </button>
        </div>

        <div class="form-grid">
          <div class="form-group full">
            <label>Nama lengkap</label>
            <input type="text" id="inpName" value="${p.fullName}" placeholder="Sesuai KTP" />
          </div>
          <div class="form-group">
            <label>NIK (16 digit)</label>
            <input type="text" id="inpNik" value="${p.nik}" placeholder="3174..." />
          </div>
          <div class="form-group">
            <label>Tanggal lahir</label>
            <input type="text" id="inpBirth" value="${p.birthDate}" placeholder="dd/mm/yyyy" />
          </div>
          <div class="form-group">
            <label>No. ponsel (WhatsApp)</label>
            <input type="text" id="inpPhone" value="${p.phone}" placeholder="0812..." />
          </div>
          <div class="form-group">
            <label>Email (opsional)</label>
            <input type="email" id="inpEmail" value="${p.email}" placeholder="nama@email.com" />
          </div>
          <div class="form-group full">
            <label>Keluhan utama (opsional)</label>
            <input type="text" id="inpComplaint" value="${p.complaint}" placeholder="Ceritakan keluhan singkat Anda..." />
          </div>
        </div>
      `;

      const bindInputs = () => {
        state.patient.fullName =
          document.getElementById("inpName")?.value || "";
        state.patient.nik = document.getElementById("inpNik")?.value || "";
        state.patient.birthDate =
          document.getElementById("inpBirth")?.value || "";
        state.patient.phone = document.getElementById("inpPhone")?.value || "";
        state.patient.email = document.getElementById("inpEmail")?.value || "";
        state.patient.complaint =
          document.getElementById("inpComplaint")?.value || "";
      };

      contentArea.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", bindInputs);
      });

      document
        .getElementById("btnFillSampleData")
        ?.addEventListener("click", () => {
          state.patient = { ...SAMPLE_PATIENT };
          renderStep();
        });
    } else if (state.step === 5) {
      const doc = getSelectedDoctor();
      const total = doc.price + state.adminFee;

      contentArea.innerHTML = `
        <p class="eyebrow text-orange">LANGKAH 5 DARI 5</p>
        <h3>Pembayaran</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);">Selesaikan pembayaran untuk mengunci jadwal Anda.</p>

        <div class="qr-payment-box">
          <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.4rem;">
            <span>Konsultasi ${doc.shortName}</span>
            <strong>${formatRupiah(doc.price)}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.85rem;padding-bottom:0.6rem;border-bottom:1px dashed var(--border-light);">
            <span>Biaya layanan</span>
            <strong>${formatRupiah(state.adminFee)}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:1.1rem;padding-top:0.6rem;">
            <strong>Total bayar</strong>
            <strong>${formatRupiah(total)}</strong>
          </div>
        </div>

        <div class="qr-payment-box" style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;">
          <div id="qrisCanvasBox" style="background:#fff;padding:0.5rem;border:1px solid var(--border-light);border-radius:8px;"></div>
          <div style="flex:1;">
            <strong>Pindai dengan aplikasi pembayaran</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin:0.25rem 0;">
              Berlaku <strong>14:58</strong>. Setelah membayar, status akan diperbarui otomatis.
            </p>
            <small style="font-family:var(--font-mono);color:var(--text-muted);">PAY · ${state.bookingCode}</small>
          </div>
        </div>

        <div style="margin-top:1.25rem;display:flex;flex-direction:column;gap:0.6rem;">
          <button class="btn-dark btn-full" id="btnConfirmPaid">Saya sudah membayar</button>
          <button class="btn-outline btn-full" id="btnBackFromPay">&larr; Kembali</button>
          <small style="text-align:center;color:var(--text-muted);font-size:0.74rem;">🔒 Simulasi — tidak ada transaksi nyata yang diproses.</small>
        </div>
      `;

      const qrBox = document.getElementById("qrisCanvasBox");
      if (qrBox && window.QRCode) {
        new window.QRCode(qrBox, {
          text: `QRIS-RSHADI-${state.bookingCode}-${total}`,
          width: 96,
          height: 96,
        });
      }

      document
        .getElementById("btnBackFromPay")
        ?.addEventListener("click", () => {
          state.step = 4;
          renderStep();
        });

      document
        .getElementById("btnConfirmPaid")
        ?.addEventListener("click", (e) => {
          const btn = e.currentTarget;
          btn.textContent = "⏳ Memproses pembayaran...";
          btn.disabled = true;
          setTimeout(() => {
            state.step = 6;
            renderStep();
          }, 900);
        });
    } else if (state.step === 6) {
      const doc = getSelectedDoctor();
      const dt = getSelectedDate();
      const total = doc.price + state.adminFee;
      const patientName = state.patient.fullName || SAMPLE_PATIENT.fullName;

      contentArea.innerHTML = `
        <div style="text-align:center;margin-bottom:1.25rem;">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--accent-orange-soft);color:var(--accent-orange);display:inline-flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">&check;</div>
          <h3>Janji temu terkonfirmasi!</h3>
          <p style="font-size:0.82rem;color:var(--text-secondary);">E-tiket juga dikirim ke WhatsApp Anda. Tunjukkan kode QR di loket pendaftaran.</p>
        </div>

        <div class="eticket-card" style="padding:0;overflow:hidden;">
          <div style="background:var(--bg-dark);color:#fff;padding:0.85rem 1.25rem;display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:1.1rem;">hadi<span class="text-orange">.</span></strong>
            <span style="font-size:0.72rem;letter-spacing:0.12em;color:var(--accent-orange);font-weight:700;">E-TIKET</span>
          </div>
          <div style="padding:1.25rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
            <div>
              <small style="font-size:0.68rem;color:var(--text-muted);letter-spacing:0.08em;">NOMOR ANTREAN</small>
              <strong style="display:block;font-size:2.2rem;font-family:var(--font-mono);line-height:1.1;margin-bottom:0.5rem;">${state.ticketQueue}</strong>
              <strong>${doc.name}</strong>
              <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;">${doc.poliFull}</p>
              <small style="display:block;color:var(--text-secondary);">🕒 ${dt.fullLabel} · ${state.time} WIB</small>
              <small style="display:block;color:var(--text-secondary);">📍 ${doc.location}</small>
            </div>
            <div style="text-align:center;">
              <div id="eticketQrBox" style="background:#fff;padding:0.5rem;border:1px solid var(--border-light);border-radius:8px;display:inline-block;"></div>
              <small style="display:block;font-family:var(--font-mono);font-size:0.7rem;margin-top:0.35rem;">${state.bookingCode}</small>
            </div>
          </div>
          <div style="padding:0.75rem 1.25rem;background:var(--bg-cream);border-top:1px dashed var(--border-light);display:flex;justify-content:space-between;font-size:0.8rem;">
            <span>Pasien <strong>${patientName}</strong></span>
            <span>QRIS · <strong>${formatRupiah(total)}</strong></span>
          </div>
        </div>

        <div style="display:flex;gap:0.75rem;margin-top:1.25rem;flex-wrap:wrap;">
          <button class="btn-outline" style="flex:1;" onclick="window.print()">🖨️ Cetak / simpan PDF</button>
          <button class="btn-dark" style="flex:1;" id="btnFinishBooking">Selesai</button>
        </div>
      `;

      const ticketQr = document.getElementById("eticketQrBox");
      if (ticketQr && window.QRCode) {
        new window.QRCode(ticketQr, {
          text: `${state.bookingCode}-${state.ticketQueue}-${patientName}`,
          width: 105,
          height: 105,
        });
      }

      document
        .getElementById("btnFinishBooking")
        ?.addEventListener("click", closeModal);
    }
  }

  function openModal(customDocId = null) {
    if (customDocId) {
      const found = DOCTORS_DATA.find((d) => d.id === customDocId);
      if (found) {
        state.poliId = found.poliId;
        state.doctorId = found.id;
        state.step = 3;
      }
    } else {
      const quickPoli = document.getElementById("quickPoliSelect")?.value;
      if (quickPoli) state.poliId = quickPoli;
      state.step = 1;
    }

    backdrop?.classList.remove("hidden");
    renderStep();
  }

  function closeModal() {
    backdrop?.classList.add("hidden");
  }

  document.querySelectorAll(".open-booking-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const poliAttr = btn.getAttribute("data-poli");
      if (poliAttr && POLIKLINIK_DATA.some((p) => p.id === poliAttr)) {
        state.poliId = poliAttr;
      }
      openModal();
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  btnPrev?.addEventListener("click", () => {
    if (state.step > 1) {
      state.step--;
      renderStep();
    }
  });

  btnNext?.addEventListener("click", () => {
    if (state.step === 4 && !state.patient.fullName) {
      state.patient = { ...SAMPLE_PATIENT };
    }
    if (state.step < 5) {
      state.step++;
      renderStep();
    }
  });

  return { openModalWithDoctor: openModal };
}
