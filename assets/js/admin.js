/* =====================================================
   GEM-GEM PJOK - admin.js
   Halaman admin: dashboard, data siswa, materi, bank soal,
   dan laporan pemantauan.
   ===================================================== */

const { esc } = UI;

const NOTE_LOCALSTORAGE =
  '<div class="notice">ℹ️ <b>Catatan:</b> data aplikasi ini disimpan di <b>localStorage</b> pada browser dan perangkat ini saja. ' +
  "Siswa yang mengerjakan di perangkat lain tidak akan muncul di sini. Untuk pemantauan lintas perangkat secara langsung, " +
  "dibutuhkan database online. Gunakan fitur Backup/Restore di halaman Laporan untuk memindahkan data secara manual.</div>";

// ---------- Fungsi bantu admin ----------
const round1 = (n) => Math.round(n * 10) / 10;

function scorePill(skor) {
  return '<span class="score-pill ' + (skor >= 70 ? "good" : skor >= 50 ? "mid" : "low") + '">' + skor + "</span>";
}

function activityOf(st) {
  if (!st.lastActive) return { label: "Belum mulai", cls: "badge-gray", key: "belum" };
  const days = (Date.now() - new Date(st.lastActive).getTime()) / 86400000;
  return days <= 7
    ? { label: "Aktif", cls: "badge-green", key: "aktif" }
    : { label: "Tidak aktif", cls: "badge-red", key: "tidak" };
}

function studentRows() {
  return DB.getStudents()
    .map((u) => ({ u, st: Game.stats(u.id) }))
    .sort((a, b) => a.u.nama.localeCompare(b.u.nama));
}

function exportStudentsCSV() {
  const rows = [["Nomor", "Nama", "Username", "Jumlah Kuis", "Nilai Rata-rata", "Nilai Tertinggi", "Total XP", "Level", "Status Perkembangan", "Progres Belajar (%)", "Terakhir Aktif", "Terdaftar"]];
  studentRows().forEach(({ u, st }, i) =>
    rows.push([i + 1, u.nama, u.username, st.kuis, st.rata === null ? "" : st.rata, st.tertinggi === null ? "" : st.tertinggi,
      st.xp, st.level, st.status.label, st.persenProgres, UI.fmtDate(st.lastActive), UI.fmtDate(u.createdAt)])
  );
  UI.downloadCSV("data-siswa-gem-gem-pjok.csv", rows);
}

function exportResultsCSV() {
  const rows = [["Nama Siswa", "Username", "Kategori", "Nilai", "Benar", "Salah", "Durasi (detik)", "XP", "Tanggal"]];
  DB.getResults()
    .slice()
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .forEach((r) => {
      const u = DB.findUserById(r.userId);
      rows.push([u ? u.nama : "(siswa dihapus)", u ? u.username : "", r.kategoriNama, r.skor, r.benar, r.salah, r.durasiDetik, r.xpDidapat || 0, UI.fmtDate(r.tanggal)]);
    });
  UI.downloadCSV("hasil-kuis-gem-gem-pjok.csv", rows);
}

function slugify(text) {
  return String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "materi";
}

const lines = (text) => String(text || "").split("\n").map((s) => s.trim()).filter(Boolean);

// ---------- Modal jawaban siswa ----------
function showAnswers(resultId) {
  const r = DB.getResultById(resultId);
  if (!r) return UI.toast("Data hasil tidak ditemukan.", "error");
  const u = DB.findUserById(r.userId);
  UI.modal({
    title: "Jawaban: " + (u ? u.nama : "Siswa") + " · " + r.kategoriNama,
    wide: true,
    body:
      '<p class="hint">Nilai <b>' + r.skor + "</b> · Benar " + r.benar + " · Salah " + r.salah + " · Waktu " + UI.fmtDuration(r.durasiDetik) + " · " + UI.fmtDate(r.tanggal) + "</p>" +
      r.jawaban.map((j, i) =>
        '<div class="review ' + (j.isBenar ? "ok" : "no") + '"><div class="review-q"><span>' + (j.isBenar ? "✅" : "❌") + "</span><b>" +
        (i + 1) + ". " + esc(j.pertanyaan) + "</b></div><p>Jawaban siswa: <b>" + (j.dipilih === null ? "(tidak dijawab)" : esc(j.dipilih)) + "</b></p>" +
        (j.isBenar ? "" : "<p>Jawaban benar: <b>" + esc(j.benar) + "</b></p>") + "</div>"
      ).join(""),
    footer: '<button class="btn btn-primary" data-close>Tutup</button>',
  });
}

// ---------- Modal detail siswa ----------
function showStudentDetail(userId) {
  const u = DB.findUserById(userId);
  if (!u) return;
  const st = Game.stats(userId);
  const materi = DB.getMateri();
  const dipelajari = materi.filter((m) => st.progress[m.id]);
  const totalJawab = st.benar + st.salah;
  const akurasi = totalJawab ? Math.round((st.benar / totalJawab) * 100) : 0;
  const act = activityOf(st);

  const m = UI.modal({
    title: "Detail Siswa: " + u.nama,
    wide: true,
    footer: '<button class="btn btn-primary" data-close>Tutup</button>',
    body:
      '<div class="detail-head"><div class="avatar xl">' + esc(u.avatar || "🙂") + "</div><div class=\"detail-id\">" +
      "<h3>" + esc(u.nama) + "</h3><p>@" + esc(u.username) + " · Terdaftar " + UI.fmtDate(u.createdAt, false) + "</p>" +
      '<span class="badge ' + st.status.cls + '">' + esc(st.status.label) + '</span> <span class="badge ' + act.cls + '">' + act.label + "</span></div></div>" +
      '<div class="grid grid-4 mt"><div class="mini-stat"><b>' + st.xp + "</b><small>Total XP</small></div>" +
      '<div class="mini-stat"><b>' + st.level + "</b><small>Level</small></div>" +
      '<div class="mini-stat"><b>' + st.kuis + "</b><small>Kuis dikerjakan</small></div>" +
      '<div class="mini-stat"><b>' + (st.rata === null ? "-" : st.rata) + "</b><small>Rata-rata nilai</small></div></div>" +
      '<h4 class="mt">Persentase Perkembangan: ' + st.persenProgres + "%</h4>" +
      '<div class="prog-line"><span>Materi dipelajari</span><b>' + st.materiDibaca.length + "/" + st.totalMateri + " (" + st.persenMateri + "%)</b></div>" + UI.progressBar(st.persenMateri) +
      '<div class="prog-line"><span>Kategori kuis dicoba</span><b>' + st.kategoriDicoba + "/" + st.totalMateri + " (" + st.persenKuis + "%)</b></div>" + UI.progressBar(st.persenKuis, "blue") +
      '<div class="prog-line"><span>Akurasi jawaban (' + st.benar + " benar, " + st.salah + " salah)</span><b>" + akurasi + "%</b></div>" + UI.progressBar(akurasi, "teal") +
      '<h4 class="mt">Materi yang Sudah Dipelajari</h4>' +
      (dipelajari.length
        ? '<div class="chip-row">' + dipelajari.map((x) => '<span class="chip">' + esc(x.ikon || "") + " " + esc(x.judul) + "</span>").join("") + "</div>"
        : '<p class="hint">Belum ada materi yang ditandai selesai dipelajari.</p>') +
      '<h4 class="mt">Grafik Perkembangan Nilai</h4><div id="detailChart" class="chart-box"></div>' +
      '<h4 class="mt">Riwayat Kuis</h4>' +
      (st.results.length
        ? '<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Kategori</th><th>Nilai</th><th>Benar</th><th>Salah</th><th>Waktu</th><th></th></tr></thead><tbody>' +
          st.results.slice().reverse().map((r) =>
            "<tr><td>" + UI.fmtDate(r.tanggal) + "</td><td>" + esc(r.kategoriNama) + "</td><td>" + scorePill(r.skor) + "</td><td>" + r.benar +
            "</td><td>" + r.salah + "</td><td>" + UI.fmtDuration(r.durasiDetik) + '</td><td><button class="btn btn-sm btn-ghost" data-rid="' + esc(r.id) + '">Lihat jawaban</button></td></tr>'
          ).join("") + "</tbody></table></div>"
        : '<p class="hint">Siswa ini belum mengerjakan kuis.</p>'),
  });

  UI.lineChart(
    m.body.querySelector("#detailChart"),
    st.results.map((r) => UI.shortDay(UI.dayKey(r.tanggal))),
    st.results.map((r) => r.skor),
    { max: 100 }
  );
  m.body.querySelectorAll("[data-rid]").forEach((b) => b.addEventListener("click", () => showAnswers(b.dataset.rid)));
}

// =====================================================
// Halaman-halaman admin
// =====================================================
const AdminPages = {
  // ---------- Dashboard ----------
  dashboard: {
    title: "Dashboard Admin",
    render(el) {
      const students = DB.getStudents();
      const ids = new Set(students.map((s) => s.id));
      const results = DB.getResults().filter((r) => ids.has(r.userId));
      const done = new Set(results.map((r) => r.userId));
      const avg = results.length ? round1(results.reduce((s, r) => s + r.skor, 0) / results.length) : null;
      const best = results.length ? results.reduce((a, b) => (b.skor > a.skor ? b : a)) : null;
      const worst = results.length ? results.reduce((a, b) => (b.skor < a.skor ? b : a)) : null;
      const nameOf = (r) => { const u = DB.findUserById(r.userId); return u ? u.nama : "-"; };

      // Grafik nilai rata-rata per hari
      const byDay = {};
      results.forEach((r) => { (byDay[UI.dayKey(r.tanggal)] = byDay[UI.dayKey(r.tanggal)] || []).push(r.skor); });
      const dayKeys = Object.keys(byDay).sort().slice(-14);

      // Grafik aktivitas 7 hari terakhir
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        last7.push(UI.dayKey(d.toISOString()));
      }
      const countByDay = last7.map((k) => results.filter((r) => UI.dayKey(r.tanggal) === k).length);

      const recent = results.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 8);

      el.innerHTML = NOTE_LOCALSTORAGE +
        '<section class="grid grid-4">' +
        sCard("👥", "Jumlah Siswa", students.length, "green") +
        sCard("📝", "Siswa Sudah Kuis", done.size, "blue") +
        sCard("📊", "Rata-rata Nilai", avg === null ? "-" : avg, "teal") +
        sCard("📚", "Materi Tersedia", DB.getMateri().length, "purple") + "</section>" +
        '<section class="grid grid-2">' +
        '<div class="card hl"><small>Nilai Tertinggi</small><b class="big-num">' + (best ? best.skor : "-") + "</b><span>" + (best ? esc(nameOf(best)) + " · " + esc(best.kategoriNama) : "Belum ada data") + "</span></div>" +
        '<div class="card hl low"><small>Nilai Terendah</small><b class="big-num">' + (worst ? worst.skor : "-") + "</b><span>" + (worst ? esc(nameOf(worst)) + " · " + esc(worst.kategoriNama) : "Belum ada data") + "</span></div></section>" +
        '<section class="grid grid-2"><div class="card"><h3>Grafik Perkembangan Nilai (rata-rata per hari)</h3><div id="chartScore" class="chart-box"></div></div>' +
        '<div class="card"><h3>Grafik Aktivitas Belajar (kuis per hari, 7 hari)</h3><div id="chartAct" class="chart-box"></div></div></section>' +
        '<section class="card"><div class="card-head"><h3>Riwayat Kuis Terbaru</h3><div class="btn-row"><a class="btn btn-sm btn-ghost" href="laporan.html">Lihat semua</a>' +
        '<button class="btn btn-sm btn-secondary" id="expCsv">⬇ Ekspor CSV Siswa</button></div></div>' +
        (recent.length
          ? '<div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Kategori</th><th>Nilai</th><th>Waktu</th><th>Tanggal</th><th></th></tr></thead><tbody>' +
            recent.map((r) => "<tr><td>" + esc(nameOf(r)) + "</td><td>" + esc(r.kategoriNama) + "</td><td>" + scorePill(r.skor) + "</td><td>" + UI.fmtDuration(r.durasiDetik) +
              "</td><td>" + UI.fmtDate(r.tanggal) + '</td><td><button class="btn btn-sm btn-ghost" data-rid="' + esc(r.id) + '">Jawaban</button></td></tr>').join("") + "</tbody></table></div>"
          : UI.emptyState("📭", "Belum ada siswa yang mengerjakan kuis.")) + "</section>";

      UI.lineChart(document.getElementById("chartScore"), dayKeys.map(UI.shortDay), dayKeys.map((k) => round1(byDay[k].reduce((a, b) => a + b, 0) / byDay[k].length)), { max: 100 });
      UI.barChart(document.getElementById("chartAct"), last7.map(UI.shortDay), countByDay);
      document.getElementById("expCsv").addEventListener("click", exportStudentsCSV);
      el.querySelectorAll("[data-rid]").forEach((b) => b.addEventListener("click", () => showAnswers(b.dataset.rid)));
    },
  },

  // ---------- Data & pemantauan siswa ----------
  siswa: {
    title: "Pemantauan Siswa",
    render(el) {
      const all = studentRows();
      el.innerHTML = NOTE_LOCALSTORAGE +
        '<section class="card"><div class="toolbar">' +
        '<input type="search" id="q" placeholder="🔍 Cari nama atau username…">' +
        '<select id="fName"><option value="">Semua nama siswa</option>' + all.map((r) => '<option value="' + esc(r.u.id) + '">' + esc(r.u.nama) + "</option>").join("") + "</select>" +
        '<select id="fStatus"><option value="">Semua status</option><option>Belum mengerjakan kuis</option><option>Perlu Bimbingan</option><option>Berkembang</option><option>Sangat Baik</option></select>' +
        '<button class="btn btn-secondary" id="expCsv">⬇ Ekspor CSV</button></div><div id="tableArea"></div></section>';

      const area = document.getElementById("tableArea");

      function draw() {
        const q = document.getElementById("q").value.trim().toLowerCase();
        const who = document.getElementById("fName").value;
        const stt = document.getElementById("fStatus").value;
        const rows = studentRows().filter(({ u, st }) =>
          (!q || u.nama.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)) &&
          (!who || u.id === who) && (!stt || st.status.label === stt)
        );
        if (!rows.length) {
          area.innerHTML = UI.emptyState("👥", all.length ? "Tidak ada siswa yang cocok dengan pencarian." : "Belum ada siswa yang mendaftar pada perangkat ini.");
          return;
        }
        area.innerHTML =
          '<div class="table-wrap"><table><thead><tr><th>No</th><th>Nama Siswa</th><th>Username</th><th>Kuis</th><th>Rata-rata</th><th>Tertinggi</th><th>Total XP</th><th>Level</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' +
          rows.map(({ u, st }, i) =>
            "<tr><td>" + (i + 1) + '</td><td><span class="avatar sm">' + esc(u.avatar || "🙂") + "</span> " + esc(u.nama) + "</td><td>" + esc(u.username) + "</td><td>" + st.kuis +
            "</td><td>" + (st.rata === null ? "-" : st.rata) + "</td><td>" + (st.tertinggi === null ? "-" : st.tertinggi) + "</td><td>" + st.xp + "</td><td>" + st.level +
            '</td><td><span class="badge ' + st.status.cls + '">' + esc(st.status.label) + '</span></td><td class="nowrap"><button class="btn btn-sm btn-primary" data-detail="' + esc(u.id) +
            '">Detail</button> <button class="btn btn-sm btn-danger-soft" data-del="' + esc(u.id) + '">Hapus</button></td></tr>'
          ).join("") + "</tbody></table></div>";
      }

      ["q", "fName", "fStatus"].forEach((id) => {
        document.getElementById(id).addEventListener(id === "q" ? "input" : "change", draw);
      });
      document.getElementById("expCsv").addEventListener("click", exportStudentsCSV);

      area.addEventListener("click", async (e) => {
        const d = e.target.closest("[data-detail]");
        const x = e.target.closest("[data-del]");
        if (d) showStudentDetail(d.dataset.detail);
        if (x) {
          const u = DB.findUserById(x.dataset.del);
          if (u && (await UI.confirmBox('Hapus siswa "' + u.nama + '" beserta seluruh nilai dan progresnya? Tindakan ini tidak bisa dibatalkan.', "Ya, hapus"))) {
            DB.deleteUser(u.id);
            UI.toast("Siswa dihapus.", "success");
            AdminPages.siswa.render(el);
          }
        }
      });

      draw();
    },
  },

  // ---------- Kelola materi ----------
  materi: {
    title: "Kelola Materi",
    render(el) {
      const materi = DB.getMateri();
      const soal = DB.getSoal();
      el.innerHTML =
        '<section class="card"><div class="card-head"><h3>Daftar Materi (' + materi.length + ')</h3><button class="btn btn-primary" id="addMateri">＋ Tambah Materi</button></div>' +
        (materi.length
          ? '<div class="table-wrap"><table><thead><tr><th>Ikon</th><th>Judul</th><th>Jumlah Soal</th><th>Ringkasan</th><th>Aksi</th></tr></thead><tbody>' +
            materi.map((m) =>
              '<tr><td class="ico-cell" style="--cat:' + esc(m.warna || "#16a34a") + '">' + esc(m.ikon || "🏅") + "</td><td><b>" + esc(m.judul) + "</b></td><td>" +
              soal.filter((s) => s.kategori === m.id).length + "</td><td>" + esc((m.rangkuman || "").slice(0, 80)) + '…</td><td class="nowrap">' +
              '<button class="btn btn-sm btn-secondary" data-edit="' + esc(m.id) + '">Edit</button> <button class="btn btn-sm btn-danger-soft" data-del="' + esc(m.id) + '">Hapus</button></td></tr>'
            ).join("") + "</tbody></table></div>"
          : UI.emptyState("📚", "Belum ada materi. Klik Tambah Materi.")) + "</section>";

      document.getElementById("addMateri").addEventListener("click", () => AdminPages.materi.form(el, null));
      // Listener dipasang pada section baru (bukan pada el) agar tidak menumpuk setiap render
      el.querySelector("section").addEventListener("click", async (e) => {
        const ed = e.target.closest("[data-edit]");
        const dl = e.target.closest("[data-del]");
        if (ed) AdminPages.materi.form(el, DB.getMateri().find((m) => m.id === ed.dataset.edit));
        if (dl) {
          const m = DB.getMateri().find((x) => x.id === dl.dataset.del);
          if (m && (await UI.confirmBox('Hapus materi "' + m.judul + '"? Semua soal pada materi ini juga akan terhapus.', "Ya, hapus"))) {
            DB.saveMateri(DB.getMateri().filter((x) => x.id !== m.id));
            DB.saveSoal(DB.getSoal().filter((s) => s.kategori !== m.id));
            UI.toast("Materi dihapus.", "success");
            AdminPages.materi.render(el);
          }
        }
      });
    },

    form(el, m) {
      const isNew = !m;
      m = m || { judul: "", ikon: "🏅", warna: "#16a34a", penjelasan: "", tujuan: [], peraturan: [], teknik: [], rangkuman: "" };
      const modal = UI.modal({
        title: isNew ? "Tambah Materi" : "Edit Materi",
        wide: true,
        body:
          '<form id="mForm"><div class="form-grid"><label class="field"><span>Judul materi *</span><input name="judul" required maxlength="60" value="' + esc(m.judul) + '"></label>' +
          '<label class="field"><span>Ikon (emoji)</span><input name="ikon" maxlength="4" value="' + esc(m.ikon) + '"></label>' +
          '<label class="field"><span>Warna</span><input type="color" name="warna" value="' + esc(m.warna || "#16a34a") + '"></label></div>' +
          '<label class="field"><span>Penjelasan materi *</span><textarea name="penjelasan" rows="4" required>' + esc(m.penjelasan) + "</textarea></label>" +
          '<label class="field"><span>Tujuan pembelajaran (satu per baris)</span><textarea name="tujuan" rows="3">' + esc((m.tujuan || []).join("\n")) + "</textarea></label>" +
          '<label class="field"><span>' + esc(m.labelPeraturan || "Peraturan dasar") + ' (satu per baris)</span><textarea name="peraturan" rows="4">' + esc((m.peraturan || []).join("\n")) + "</textarea></label>" +
          '<label class="field"><span>' + esc(m.labelTeknik || "Teknik dasar") + ' (satu per baris)</span><textarea name="teknik" rows="4">' + esc((m.teknik || []).join("\n")) + "</textarea></label>" +
          '<label class="field"><span>Rangkuman</span><textarea name="rangkuman" rows="3">' + esc(m.rangkuman) + "</textarea></label></form>",
        footer: '<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" id="saveMateri">Simpan</button>',
      });

      modal.el.querySelector("#saveMateri").addEventListener("click", () => {
        const f = modal.el.querySelector("#mForm");
        if (!f.reportValidity()) return;
        const data = {
          judul: f.judul.value.trim(),
          ikon: f.ikon.value.trim() || "🏅",
          warna: f.warna.value,
          penjelasan: f.penjelasan.value.trim(),
          tujuan: lines(f.tujuan.value),
          peraturan: lines(f.peraturan.value),
          teknik: lines(f.teknik.value),
          rangkuman: f.rangkuman.value.trim(),
        };
        const list = DB.getMateri();
        if (isNew) {
          let id = slugify(data.judul);
          while (list.some((x) => x.id === id)) id += "-" + Math.random().toString(36).slice(2, 5);
          list.push({ id, ...data });
        } else {
          const i = list.findIndex((x) => x.id === m.id);
          if (i === -1) return UI.toast("Materi tidak ditemukan.", "error");
          list[i] = { ...list[i], ...data };
        }
        DB.saveMateri(list);
        modal.close();
        UI.toast("Materi disimpan.", "success");
        AdminPages.materi.render(el);
      });
    },
  },

  // ---------- Bank soal ----------
  soal: {
    title: "Bank Soal Kuis",
    render(el) {
      const materi = DB.getMateri();
      const params = new URLSearchParams(location.search);
      let filter = params.get("k") || "";
      const soal = DB.getSoal();

      el.innerHTML =
        '<section class="card"><div class="chip-row">' +
        materi.map((m) => {
          const n = soal.filter((s) => s.kategori === m.id).length;
          return '<span class="chip ' + (n < 10 ? "warn" : "") + '">' + esc(m.ikon || "") + " " + esc(m.judul) + ": <b>" + n + "</b> soal" + (n < 10 ? " ⚠️" : "") + "</span>";
        }).join("") + '</div><p class="hint">Setiap kategori sebaiknya memiliki minimal 10 soal agar satu permainan berisi 10 pertanyaan.</p></section>' +
        '<section class="card"><div class="toolbar"><select id="fKat"><option value="">Semua kategori</option>' +
        materi.map((m) => '<option value="' + esc(m.id) + '"' + (m.id === filter ? " selected" : "") + ">" + esc(m.judul) + "</option>").join("") +
        '</select><input type="search" id="q" placeholder="🔍 Cari pertanyaan…"><button class="btn btn-primary" id="addSoal">＋ Tambah Soal</button></div><div id="tableArea"></div></section>';

      const area = document.getElementById("tableArea");
      const katName = (id) => { const m = materi.find((x) => x.id === id); return m ? m.judul : "(kategori dihapus)"; };

      function draw() {
        filter = document.getElementById("fKat").value;
        const q = document.getElementById("q").value.trim().toLowerCase();
        const rows = DB.getSoal().filter((s) => (!filter || s.kategori === filter) && (!q || s.pertanyaan.toLowerCase().includes(q)));
        if (!rows.length) { area.innerHTML = UI.emptyState("❓", "Tidak ada soal yang cocok."); return; }
        area.innerHTML =
          '<div class="table-wrap"><table><thead><tr><th>No</th><th>Pertanyaan</th><th>Kategori</th><th>Jawaban Benar</th><th>Aksi</th></tr></thead><tbody>' +
          rows.map((s, i) =>
            "<tr><td>" + (i + 1) + "</td><td>" + esc(s.pertanyaan) + "</td><td>" + esc(katName(s.kategori)) + "</td><td>" + esc(s.pilihan[s.jawaban]) +
            '</td><td class="nowrap"><button class="btn btn-sm btn-secondary" data-edit="' + esc(s.id) + '">Edit</button> <button class="btn btn-sm btn-danger-soft" data-del="' + esc(s.id) + '">Hapus</button></td></tr>'
          ).join("") + "</tbody></table></div>";
      }

      document.getElementById("fKat").addEventListener("change", draw);
      document.getElementById("q").addEventListener("input", draw);
      document.getElementById("addSoal").addEventListener("click", () => {
        if (!materi.length) return UI.toast("Tambah materi terlebih dahulu.", "error");
        AdminPages.soal.form(el, null, filter);
      });
      area.addEventListener("click", async (e) => {
        const ed = e.target.closest("[data-edit]");
        const dl = e.target.closest("[data-del]");
        if (ed) AdminPages.soal.form(el, DB.getSoal().find((s) => s.id === ed.dataset.edit), filter);
        if (dl && (await UI.confirmBox("Hapus soal ini?", "Ya, hapus"))) {
          DB.saveSoal(DB.getSoal().filter((s) => s.id !== dl.dataset.del));
          UI.toast("Soal dihapus.", "success");
          AdminPages.soal.render(el);
        }
      });
      draw();
    },

    form(el, s, defaultKat) {
      const isNew = !s;
      const materi = DB.getMateri();
      s = s || { kategori: defaultKat || materi[0].id, pertanyaan: "", pilihan: ["", "", "", ""], jawaban: 0, pembahasan: "" };
      const letters = ["A", "B", "C", "D"];
      const modal = UI.modal({
        title: isNew ? "Tambah Soal" : "Edit Soal",
        wide: true,
        body:
          '<form id="sForm"><label class="field"><span>Kategori</span><select name="kategori">' +
          materi.map((m) => '<option value="' + esc(m.id) + '"' + (m.id === s.kategori ? " selected" : "") + ">" + esc(m.judul) + "</option>").join("") + "</select></label>" +
          '<label class="field"><span>Pertanyaan *</span><textarea name="pertanyaan" rows="3" required>' + esc(s.pertanyaan) + "</textarea></label>" +
          '<div class="field"><span>Pilihan jawaban * (pilih bulatan untuk jawaban yang benar)</span>' +
          letters.map((l, i) =>
            '<div class="opt-edit"><input type="radio" name="jawaban" value="' + i + '"' + (i === s.jawaban ? " checked" : "") + '><b>' + l +
            '</b><input type="text" name="p' + i + '" required maxlength="200" value="' + esc(s.pilihan[i] || "") + '"></div>'
          ).join("") + "</div>" +
          '<label class="field"><span>Pembahasan</span><textarea name="pembahasan" rows="3">' + esc(s.pembahasan) + "</textarea></label></form>",
        footer: '<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" id="saveSoal">Simpan</button>',
      });

      modal.el.querySelector("#saveSoal").addEventListener("click", () => {
        const f = modal.el.querySelector("#sForm");
        if (!f.reportValidity()) return;
        const pilihan = [0, 1, 2, 3].map((i) => f["p" + i].value.trim());
        if (new Set(pilihan.map((p) => p.toLowerCase())).size < 4) return UI.toast("Keempat pilihan harus berbeda.", "error");
        const data = {
          kategori: f.kategori.value,
          pertanyaan: f.pertanyaan.value.trim(),
          pilihan,
          jawaban: Number(f.jawaban.value),
          pembahasan: f.pembahasan.value.trim(),
        };
        const list = DB.getSoal();
        if (isNew) list.push({ id: DB.newId("soal"), ...data });
        else {
          const i = list.findIndex((x) => x.id === s.id);
          if (i === -1) return UI.toast("Soal tidak ditemukan.", "error");
          list[i] = { ...list[i], ...data };
        }
        DB.saveSoal(list);
        modal.close();
        UI.toast("Soal disimpan.", "success");
        AdminPages.soal.render(el);
      });
    },
  },

  // ---------- Laporan ----------
  laporan: {
    title: "Laporan Pemantauan",
    render(el) {
      const rows = studentRows();
      const info = rows.map((r) => ({ ...r, act: activityOf(r.st) }));
      const aktif = info.filter((r) => r.act.key === "aktif").length;
      const belumKuis = info.filter((r) => r.st.kuis === 0).length;
      const selesai = info.filter((r) => r.st.persenProgres === 100).length;
      const belumSelesai = info.length - selesai;

      const results = DB.getResults().slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal));
      const materi = DB.getMateri();

      el.innerHTML = NOTE_LOCALSTORAGE +
        '<section class="grid grid-4">' +
        sCard("✅", "Siswa Aktif (7 hari)", aktif, "green") +
        sCard("🕳️", "Belum Mengerjakan Kuis", belumKuis, "orange") +
        sCard("⏳", "Belum Selesai Belajar", belumSelesai, "blue") +
        sCard("🎓", "Selesai Belajar (100%)", selesai, "purple") + "</section>" +
        '<section class="card"><div class="card-head"><h3>Laporan per Siswa</h3><div class="btn-row">' +
        '<select id="fAct"><option value="">Semua siswa</option><option value="aktif">Aktif (7 hari terakhir)</option><option value="tidak">Tidak aktif</option><option value="belum">Belum mulai</option><option value="belumselesai">Belum selesai belajar</option></select>' +
        '<button class="btn btn-secondary" id="expSiswa">⬇ CSV Siswa</button><button class="btn btn-ghost" id="printBtn">🖨️ Cetak</button></div></div><div id="areaSiswa"></div></section>' +
        '<section class="card"><div class="card-head"><h3>Riwayat Semua Kuis</h3><div class="btn-row">' +
        '<select id="rKat"><option value="">Semua kategori</option>' + materi.map((m) => '<option value="' + esc(m.id) + '">' + esc(m.judul) + "</option>").join("") + "</select>" +
        '<button class="btn btn-secondary" id="expHasil">⬇ CSV Hasil Kuis</button></div></div><div id="areaHasil"></div></section>' +
        '<section class="card no-print"><h3>Backup & Restore Data</h3><p class="hint">Simpan seluruh data (siswa, hasil, materi, soal) ke file JSON, atau pulihkan dari file cadangan. Restore akan menimpa data di perangkat ini.</p>' +
        '<div class="btn-row"><button class="btn btn-secondary" id="backupBtn">⬇ Backup (JSON)</button><label class="btn btn-ghost file-btn">⬆ Restore dari file<input type="file" id="restoreFile" accept=".json,application/json" hidden></label></div></section>';

      const areaSiswa = document.getElementById("areaSiswa");
      const areaHasil = document.getElementById("areaHasil");

      function drawSiswa() {
        const f = document.getElementById("fAct").value;
        const list = info.filter((r) => !f || (f === "belumselesai" ? r.st.persenProgres < 100 : r.act.key === f));
        areaSiswa.innerHTML = list.length
          ? '<div class="table-wrap"><table><thead><tr><th>No</th><th>Nama</th><th>Aktivitas</th><th>Terakhir Aktif</th><th>Progres Belajar</th><th>Kuis</th><th>Rata-rata</th><th>Status</th></tr></thead><tbody>' +
            list.map((r, i) =>
              "<tr><td>" + (i + 1) + "</td><td>" + esc(r.u.nama) + '</td><td><span class="badge ' + r.act.cls + '">' + r.act.label + "</span></td><td>" + UI.fmtDate(r.st.lastActive) +
              "</td><td><div class=\"prog-cell\">" + UI.progressBar(r.st.persenProgres) + "<small>" + r.st.persenProgres + "%" + (r.st.persenProgres === 100 ? " · selesai" : "") + "</small></div></td><td>" + r.st.kuis +
              "</td><td>" + (r.st.rata === null ? "-" : r.st.rata) + '</td><td><span class="badge ' + r.st.status.cls + '">' + esc(r.st.status.label) + "</span></td></tr>"
            ).join("") + "</tbody></table></div>"
          : UI.emptyState("👥", info.length ? "Tidak ada siswa pada filter ini." : "Belum ada siswa yang mendaftar pada perangkat ini.");
      }

      function drawHasil() {
        const k = document.getElementById("rKat").value;
        const list = results.filter((r) => !k || r.kategori === k);
        areaHasil.innerHTML = list.length
          ? '<div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Kategori</th><th>Nilai</th><th>Benar</th><th>Salah</th><th>Waktu</th><th>Tanggal</th><th class="no-print"></th></tr></thead><tbody>' +
            list.map((r) => {
              const u = DB.findUserById(r.userId);
              return "<tr><td>" + esc(u ? u.nama : "(dihapus)") + "</td><td>" + esc(r.kategoriNama) + "</td><td>" + scorePill(r.skor) + "</td><td>" + r.benar + "</td><td>" + r.salah +
                "</td><td>" + UI.fmtDuration(r.durasiDetik) + "</td><td>" + UI.fmtDate(r.tanggal) + '</td><td class="no-print"><button class="btn btn-sm btn-ghost" data-rid="' + esc(r.id) + '">Jawaban</button></td></tr>';
            }).join("") + "</tbody></table></div>"
          : UI.emptyState("📭", "Belum ada hasil kuis yang tersimpan.");
      }

      document.getElementById("fAct").addEventListener("change", drawSiswa);
      document.getElementById("rKat").addEventListener("change", drawHasil);
      document.getElementById("expSiswa").addEventListener("click", exportStudentsCSV);
      document.getElementById("expHasil").addEventListener("click", exportResultsCSV);
      document.getElementById("printBtn").addEventListener("click", () => window.print());
      areaHasil.addEventListener("click", (e) => {
        const b = e.target.closest("[data-rid]");
        if (b) showAnswers(b.dataset.rid);
      });
      document.getElementById("backupBtn").addEventListener("click", () =>
        UI.downloadFile("backup-gem-gem-pjok.json", DB.exportBackup(), "application/json")
      );
      document.getElementById("restoreFile").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          if (await UI.confirmBox("Restore akan menimpa data siswa, hasil, materi, dan soal di perangkat ini. Lanjutkan?", "Ya, restore")) {
            if (DB.importBackup(String(reader.result))) {
              UI.toast("Data berhasil dipulihkan.", "success");
              setTimeout(() => location.reload(), 800);
            } else UI.toast("File cadangan tidak valid.", "error");
          }
        };
        reader.readAsText(file);
        e.target.value = "";
      });

      drawSiswa();
      drawHasil();
    },
  },
};

function sCard(icon, label, value, color) {
  return '<div class="stat-card ' + color + '"><div class="stat-ico">' + icon + "</div><div><small>" + esc(label) + "</small><b>" + esc(value) + "</b></div></div>";
}

App.run(AdminPages, "admin");
