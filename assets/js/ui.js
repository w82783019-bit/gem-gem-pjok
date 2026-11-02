/* =====================================================
   GEM-GEM PJOK - ui.js
   Fungsi bantu tampilan yang dipakai semua halaman:
   escape HTML, toast, modal, sidebar, grafik SVG, ekspor CSV.
   ===================================================== */

const UI = (() => {
  // Halaman di folder admin/ dan siswa/ memakai data-base="../"
  const BASE = document.body.dataset.base || "";

  // Pemisah kolom CSV. Excel versi Indonesia biasanya memakai titik koma (;).
  // Ubah menjadi "," jika Excel Anda memakai koma.
  const CSV_SEPARATOR = ";";

  // ---------- Util dasar ----------
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function fmtDate(iso, withTime = true) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d)) return "-";
    const opt = { day: "2-digit", month: "short", year: "numeric" };
    if (withTime) { opt.hour = "2-digit"; opt.minute = "2-digit"; }
    return d.toLocaleString("id-ID", opt);
  }

  function fmtDuration(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? m + " mnt " + s + " dtk" : s + " dtk";
  }

  function dayKey(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function shortDay(key) {
    const [, m, d] = key.split("-");
    return d + "/" + m;
  }

  function emptyState(icon, text) {
    return '<div class="empty"><div class="empty-ico">' + icon + "</div><p>" + esc(text) + "</p></div>";
  }

  function progressBar(percent, extraClass = "") {
    const p = Math.max(0, Math.min(100, Math.round(percent || 0)));
    return '<div class="progress ' + extraClass + '"><div class="progress-fill" style="width:' + p + '%"></div></div>';
  }

  // ---------- Toast ----------
  function toast(message, type = "info") {
    let root = document.getElementById("toastRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "toastRoot";
      root.className = "toast-root";
      document.body.appendChild(root);
    }
    const el = document.createElement("div");
    el.className = "toast toast-" + type;
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => {
      el.classList.add("hide");
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }

  // ---------- Modal ----------
  const modalStack = [];

  function modal({ title, body, footer, wide = false, onClose }) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML =
      '<div class="modal' + (wide ? " wide" : "") + '" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><h3>' + esc(title) + '</h3><button class="icon-btn" data-close aria-label="Tutup">✕</button></div>' +
      '<div class="modal-body"></div>' +
      (footer ? '<div class="modal-foot"></div>' : "") +
      "</div>";
    const bodyEl = backdrop.querySelector(".modal-body");
    if (typeof body === "string") bodyEl.innerHTML = body;
    else if (body) bodyEl.appendChild(body);
    const footEl = backdrop.querySelector(".modal-foot");
    if (footEl) footEl.innerHTML = footer;

    function close() {
      const i = modalStack.indexOf(api);
      if (i !== -1) modalStack.splice(i, 1);
      backdrop.remove();
      if (!modalStack.length) document.body.classList.remove("modal-open");
      if (typeof onClose === "function") onClose();
    }

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.closest("[data-close]")) close();
    });

    const api = { el: backdrop, body: bodyEl, foot: footEl, close };
    modalStack.push(api);
    document.body.classList.add("modal-open");
    document.body.appendChild(backdrop);
    return api;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalStack.length) modalStack[modalStack.length - 1].close();
  });

  function confirmBox(message, okLabel = "Ya, lanjutkan") {
    return new Promise((resolve) => {
      let result = false;
      const m = modal({
        title: "Konfirmasi",
        body: "<p>" + esc(message) + "</p>",
        footer:
          '<button class="btn btn-ghost" data-close>Batal</button>' +
          '<button class="btn btn-danger" id="confirmOk">' + esc(okLabel) + "</button>",
        onClose: () => resolve(result),
      });
      m.el.querySelector("#confirmOk").addEventListener("click", () => {
        result = true;
        m.close();
      });
    });
  }

  // ---------- Kerangka halaman (sidebar + topbar) ----------
  const MENU = {
    admin: [
      { key: "dashboard", href: "dashboard.html", icon: "📊", label: "Dashboard" },
      { key: "siswa", href: "siswa.html", icon: "👥", label: "Data Siswa" },
      { key: "materi", href: "materi.html", icon: "📚", label: "Materi" },
      { key: "soal", href: "soal.html", icon: "❓", label: "Bank Soal" },
      { key: "laporan", href: "laporan.html", icon: "📈", label: "Laporan" },
    ],
    siswa: [
      { key: "dashboard", href: "dashboard.html", icon: "🏠", label: "Beranda" },
      { key: "materi", href: "materi.html", icon: "📚", label: "Materi" },
      { key: "kuis", href: "kuis.html", icon: "🎮", label: "Main Kuis" },
      { key: "hasil", href: "hasil.html", icon: "🏆", label: "Riwayat" },
      { key: "profil", href: "profil.html", icon: "👤", label: "Profil" },
    ],
  };

  function shell({ role, active, user, title }) {
    const nav = MENU[role]
      .map((i) =>
        '<a href="' + i.href + '" class="' + (i.key === active ? "active" : "") + '">' +
        '<span class="nav-ico">' + i.icon + "</span><span>" + i.label + "</span></a>"
      ).join("");

    document.getElementById("root").innerHTML =
      '<div class="app-shell">' +
      '<aside class="sidebar" id="sidebar">' +
      '<a class="brand" href="' + BASE + 'index.html"><span class="brand-logo">🏅</span><span>GEM-GEM <b>PJOK</b></span></a>' +
      '<nav class="nav">' + nav + "</nav>" +
      '<div class="sidebar-foot">' +
      '<div class="user-chip"><span class="avatar">' + esc(user.avatar || "🙂") + "</span>" +
      "<div><strong>" + esc(user.nama) + "</strong><small>" + (role === "admin" ? "Administrator" : "Siswa") + "</small></div></div>" +
      '<button class="btn btn-ghost btn-block" id="logoutBtn">Keluar</button>' +
      "</div></aside>" +
      '<div class="sidebar-overlay" id="overlay"></div>' +
      '<div class="main">' +
      '<header class="topbar"><button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button><h1>' + esc(title) + "</h1></header>" +
      '<main id="content" class="content"></main>' +
      "</div></div>";

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const toggle = (open) => {
      sidebar.classList.toggle("open", open);
      overlay.classList.toggle("show", open);
    };
    document.getElementById("menuToggle").addEventListener("click", () => toggle(!sidebar.classList.contains("open")));
    overlay.addEventListener("click", () => toggle(false));
    document.getElementById("logoutBtn").addEventListener("click", () => Auth.logout());

    return document.getElementById("content");
  }

  // ---------- Grafik SVG sederhana (tanpa library) ----------
  function lineChart(el, labels, values, opts = {}) {
    if (!values.length) {
      el.innerHTML = emptyState("📉", "Belum ada data untuk ditampilkan.");
      return;
    }
    const W = 640, H = 260, pl = 40, pr = 16, pt = 16, pb = 36;
    const max = opts.max || Math.max(10, ...values);
    const iw = W - pl - pr;
    const ih = H - pt - pb;
    const x = (i) => pl + (values.length === 1 ? iw / 2 : (iw * i) / (values.length - 1));
    const y = (v) => pt + ih - (Math.min(v, max) / max) * ih;

    let grid = "";
    for (let g = 0; g <= 4; g++) {
      const val = Math.round((max * g) / 4);
      const yy = y(val);
      grid += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" class="chart-grid"/>' +
        '<text x="' + (pl - 8) + '" y="' + (yy + 4) + '" text-anchor="end" class="chart-text">' + val + "</text>";
    }
    const points = values.map((v, i) => x(i) + "," + y(v)).join(" ");
    const area = x(0) + "," + (pt + ih) + " " + points + " " + x(values.length - 1) + "," + (pt + ih);
    const step = Math.ceil(values.length / 7);
    const xl = labels.map((l, i) =>
      i % step === 0 || i === values.length - 1
        ? '<text x="' + x(i) + '" y="' + (H - 12) + '" text-anchor="middle" class="chart-text">' + esc(l) + "</text>"
        : ""
    ).join("");
    const dots = values.map((v, i) =>
      '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="4.5" class="chart-dot"><title>' + esc(labels[i]) + ": " + v + "</title></circle>"
    ).join("");

    el.innerHTML =
      '<svg viewBox="0 0 ' + W + " " + H + '" class="chart" role="img">' + grid +
      '<polygon points="' + area + '" class="chart-area"/>' +
      '<polyline points="' + points + '" class="chart-line"/>' + dots + xl + "</svg>";
  }

  function barChart(el, labels, values) {
    if (!values.length) {
      el.innerHTML = emptyState("📊", "Belum ada data untuk ditampilkan.");
      return;
    }
    const W = 640, H = 260, pl = 40, pr = 16, pt = 16, pb = 36;
    const rawMax = Math.max(...values, 1);
    const max = rawMax <= 4 ? 4 : Math.ceil(rawMax / 4) * 4;
    const iw = W - pl - pr;
    const ih = H - pt - pb;
    const slot = iw / values.length;
    const bw = Math.min(46, slot * 0.6);
    const y = (v) => pt + ih - (v / max) * ih;

    let grid = "";
    for (let g = 0; g <= 4; g++) {
      const val = (max * g) / 4;
      const yy = y(val);
      grid += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" class="chart-grid"/>' +
        '<text x="' + (pl - 8) + '" y="' + (yy + 4) + '" text-anchor="end" class="chart-text">' + val + "</text>";
    }
    const bars = values.map((v, i) => {
      const cx = pl + slot * i + slot / 2;
      const h = ih - (y(v) - pt);
      return '<rect x="' + (cx - bw / 2) + '" y="' + y(v) + '" width="' + bw + '" height="' + h + '" rx="6" class="chart-bar"><title>' +
        esc(labels[i]) + ": " + v + "</title></rect>" +
        '<text x="' + cx + '" y="' + (H - 12) + '" text-anchor="middle" class="chart-text">' + esc(labels[i]) + "</text>";
    }).join("");

    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" class="chart" role="img">' + grid + bars + "</svg>";
  }

  // ---------- Unduh file ----------
  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function csvCell(value) {
    let s = String(value ?? "");
    // Cegah formula injection di Excel
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function downloadCSV(filename, rows) {
    const text = rows.map((r) => r.map(csvCell).join(CSV_SEPARATOR)).join("\r\n");
    downloadFile(filename, "\uFEFF" + text, "text/csv;charset=utf-8");
  }

  return {
    BASE, esc, $, $$, fmtDate, fmtDuration, dayKey, shortDay, emptyState, progressBar,
    toast, modal, confirmBox, shell, lineChart, barChart, downloadFile, downloadCSV,
  };
})();
