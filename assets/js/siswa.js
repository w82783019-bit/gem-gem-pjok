/* =====================================================
   GEM-GEM PJOK - siswa.js
   Halaman siswa: dashboard, materi, kuis, hasil, profil.
   ===================================================== */

const { esc } = UI;

// ---------- Potongan tampilan yang dipakai ulang ----------
function badgeGrid(badges) {
  return (
    '<div class="badge-grid">' +
    badges
      .map(
        (b) =>
          '<div class="badge-item ' + (b.didapat ? "earned" : "locked") + '" title="' + esc(b.deskripsi) + '">' +
          '<div class="badge-ico">' + b.ikon + "</div><strong>" + esc(b.nama) + "</strong><small>" +
          (b.didapat ? "Diraih" : esc(b.deskripsi)) + "</small></div>"
      )
      .join("") +
    "</div>"
  );
}

function historyRows(results) {
  return results
    .map(
      (r) =>
        "<tr><td>" + UI.fmtDate(r.tanggal) + "</td><td>" + esc(r.kategoriNama) + '</td><td><span class="score-pill ' +
        (r.skor >= 70 ? "good" : r.skor >= 50 ? "mid" : "low") + '">' + r.skor + "</span></td><td>" +
        r.benar + "/" + r.totalSoal + "</td><td>+" + (r.xpDidapat || 0) + ' XP</td><td><a class="link" href="hasil.html?id=' +
        encodeURIComponent(r.id) + '">Lihat</a></td></tr>'
    )
    .join("");
}

function showLevelUp(level) {
  const title = Game.LEVEL_TITLES[level - 1] || "";
  const m = UI.modal({
    title: "Naik Level!",
    body:
      '<div class="levelup"><div class="levelup-star">🌟</div><div class="levelup-num">Level ' + level +
      "</div><p>Selamat! Kamu sekarang <strong>" + esc(title) + "</strong>.</p>" +
      '<div class="confetti">🎉 🎊 ✨ 🏅 🎉</div></div>',
    footer: '<button class="btn btn-primary" data-close>Lanjutkan</button>',
  });
  return m;
}

// =====================================================
// Halaman-halaman siswa
// =====================================================
const SiswaPages = {
  // ---------- Dashboard ----------
  dashboard: {
    title: "Beranda Siswa",
    render(el, user) {
      const st = Game.stats(user.id);
      const info = st.info;
      const badges = Game.badges(user.id, st);
      const chal = Game.challenges(user.id, st);
      const rank = Game.ranking();
      const myRank = rank.findIndex((r) => r.user.id === user.id) + 1;
      const recent = st.results.slice().reverse().slice(0, 5);

      el.innerHTML =
        '<section class="hero-card">' +
        '<div class="hero-left"><div class="avatar xl">' + esc(user.avatar || "🙂") + "</div>" +
        "<div><p class=\"muted-light\">Selamat datang kembali,</p><h2>" + esc(user.nama) + "</h2>" +
        '<span class="level-chip">Level ' + info.level + " · " + esc(info.title) + "</span></div></div>" +
        '<div class="hero-right"><div class="xp-row"><span>' + info.xp + " XP</span><span>" +
        (info.maxed ? "Level maksimal!" : info.remaining + " XP lagi ke Level " + (info.level + 1)) + "</span></div>" +
        UI.progressBar(info.percent, "light") +
        '<div class="hero-actions"><a class="btn btn-white" href="materi.html">📚 Mulai Belajar</a>' +
        '<a class="btn btn-outline-light" href="kuis.html">🎮 Main Kuis</a></div></div></section>' +
        '<section class="grid grid-5">' +
        statCard("✨", "Total XP", st.xp, "green") +
        statCard("🎖️", "Level", info.level + " / " + Game.MAX_LEVEL, "blue") +
        statCard("📝", "Kuis Selesai", st.kuis, "teal") +
        statCard("🏆", "Nilai Tertinggi", st.tertinggi === null ? "-" : st.tertinggi, "orange") +
        statCard("📈", "Progres Belajar", st.persenProgres + "%", "purple") +
        "</section>" +
        '<section class="grid grid-2">' +
        '<div class="card"><h3>Progres Pembelajaran</h3>' +
        '<div class="prog-line"><span>Materi dipelajari</span><b>' + st.materiDibaca.length + "/" + st.totalMateri + "</b></div>" +
        UI.progressBar(st.persenMateri) +
        '<div class="prog-line"><span>Kategori kuis dicoba</span><b>' + st.kategoriDicoba + "/" + st.totalMateri + "</b></div>" +
        UI.progressBar(st.persenKuis, "blue") +
        '<h3 class="mt">Tantangan</h3>' +
        chal.map((c) =>
          '<div class="chal ' + (c.cur >= c.target ? "done" : "") + '"><div class="prog-line"><span>' +
          (c.cur >= c.target ? "✅ " : "🎯 ") + esc(c.judul) + "</span><b>" + c.cur + "/" + c.target + "</b></div>" +
          UI.progressBar((c.cur / c.target) * 100, "blue") + "</div>"
        ).join("") +
        "</div>" +
        '<div class="card"><h3>Ranking Siswa</h3><p class="hint">Peringkatmu: ' + (myRank ? "#" + myRank : "-") +
        " dari " + rank.length + ' siswa (data di perangkat ini)</p>' +
        '<ol class="rank-list">' +
        rank.slice(0, 8).map((r, i) =>
          '<li class="' + (r.user.id === user.id ? "me" : "") + '"><span class="rank-no">' +
          (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1) + '</span><span class="avatar sm">' + esc(r.user.avatar || "🙂") +
          "</span><span class=\"rank-name\">" + esc(r.user.nama) + "</span><b>" + r.xp + " XP</b></li>"
        ).join("") +
        "</ol></div></section>" +
        '<section class="card"><h3>Badge & Penghargaan</h3>' + badgeGrid(badges) + "</section>" +
        '<section class="card"><div class="card-head"><h3>Riwayat Permainan</h3><a class="link" href="hasil.html">Lihat semua</a></div>' +
        (recent.length
          ? '<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Kategori</th><th>Nilai</th><th>Benar</th><th>XP</th><th></th></tr></thead><tbody>' +
            historyRows(recent) + "</tbody></table></div>"
          : UI.emptyState("🎮", "Belum ada permainan. Ayo mulai kuis pertamamu!")) +
        "</section>";
    },
  },

  // ---------- Materi ----------
  materi: {
    title: "Materi Pembelajaran",
    render(el, user) {
      const id = new URLSearchParams(location.search).get("id");
      const materi = DB.getMateri();
      const detail = id ? materi.find((m) => m.id === id) : null;
      if (detail) return SiswaPages.materi.renderDetail(el, user, detail);

      const progress = DB.getProgressByUser(user.id);
      if (!materi.length) {
        el.innerHTML = '<div class="card">' + UI.emptyState("📚", "Belum ada materi. Hubungi guru/admin.") + "</div>";
        return;
      }
      el.innerHTML =
        '<p class="page-desc">Pilih materi, baca sampai selesai, lalu uji pemahamanmu lewat kuis.</p><div class="grid grid-3">' +
        materi.map((m) =>
          '<a class="materi-card" href="materi.html?id=' + encodeURIComponent(m.id) + '" style="--cat:' + esc(m.warna || "#16a34a") + '">' +
          '<div class="materi-art"><span>' + esc(m.ikon || "🏅") + "</span></div>" +
          '<div class="materi-body"><h3>' + esc(m.judul) + "</h3><p>" + esc((m.penjelasan || "").slice(0, 100)) + "…</p>" +
          (progress[m.id] ? '<span class="badge badge-green">✓ Sudah dipelajari</span>' : '<span class="badge badge-gray">Belum dipelajari</span>') +
          "</div></a>"
        ).join("") + "</div>";
    },

    renderDetail(el, user, m) {
      const done = !!DB.getProgressByUser(user.id)[m.id];
      const list = (arr) => '<ul class="check-list">' + (arr || []).map((t) => "<li>" + esc(t) + "</li>").join("") + "</ul>";
      const jumlahSoal = DB.getSoal().filter((s) => s.kategori === m.id).length;

      el.innerHTML =
        '<a class="link back" href="materi.html">← Kembali ke daftar materi</a>' +
        '<section class="materi-hero" style="--cat:' + esc(m.warna || "#16a34a") + '">' +
        '<div class="materi-hero-art">' + esc(m.ikon || "🏅") + "</div><div><h2>" + esc(m.judul) + "</h2>" +
        '<p>' + esc(m.penjelasan) + "</p></div></section>" +
        '<div class="grid grid-2">' +
        '<div class="card"><h3>🎯 Tujuan Pembelajaran</h3>' + list(m.tujuan) + "</div>" +
        '<div class="card"><h3>📋 ' + esc(m.labelPeraturan || "Peraturan Dasar") + "</h3>" + list(m.peraturan) + "</div>" +
        '<div class="card"><h3>🛠️ ' + esc(m.labelTeknik || "Teknik Dasar") + "</h3>" + list(m.teknik) + "</div>" +
        '<div class="card"><h3>📝 Rangkuman</h3><p>' + esc(m.rangkuman) + "</p></div></div>" +
        '<div class="card action-bar"><div><strong>' + (done ? "✅ Materi ini sudah kamu pelajari." : "Sudah selesai membaca?") +
        "</strong><p class=\"hint\">" + jumlahSoal + " soal tersedia untuk materi ini.</p></div><div class=\"btn-row\">" +
        (done ? "" : '<button class="btn btn-secondary" id="markRead">✔ Tandai Sudah Dipelajari</button>') +
        '<a class="btn btn-primary" href="kuis.html?k=' + encodeURIComponent(m.id) + '">🎮 Main Kuis</a></div></div>';

      const btn = document.getElementById("markRead");
      if (btn) {
        btn.addEventListener("click", () => {
          DB.markMateriRead(user.id, m.id);
          UI.toast("Materi ditandai sudah dipelajari!", "success");
          SiswaPages.materi.renderDetail(el, user, m);
        });
      }
    },
  },

  // ---------- Kuis ----------
  kuis: {
    title: "Kuis PJOK",
    render(el, user) {
      const k = new URLSearchParams(location.search).get("k");
      const materi = k ? DB.getMateri().find((m) => m.id === k) : null;
      if (!materi) return SiswaPages.kuis.renderPicker(el, user);
      return SiswaPages.kuis.renderIntro(el, user, materi);
    },

    renderPicker(el, user) {
      const materi = DB.getMateri();
      const results = DB.getResultsByUser(user.id);
      const soal = DB.getSoal();
      if (!materi.length) {
        el.innerHTML = '<div class="card">' + UI.emptyState("🎮", "Belum ada kategori kuis.") + "</div>";
        return;
      }
      el.innerHTML =
        '<p class="page-desc">Pilih kategori kuis. Setiap jawaban benar bernilai ' + Game.POINTS_PER_CORRECT +
        ' poin dan kamu punya ' + Game.SECONDS_PER_QUESTION + ' detik untuk tiap soal.</p><div class="grid grid-4">' +
        materi.map((m) => {
          const n = soal.filter((s) => s.kategori === m.id).length;
          const best = results.filter((r) => r.kategori === m.id).reduce((mx, r) => Math.max(mx, r.skor), -1);
          return '<a class="quiz-card" href="kuis.html?k=' + encodeURIComponent(m.id) + '" style="--cat:' + esc(m.warna || "#16a34a") + '">' +
            '<div class="quiz-ico">' + esc(m.ikon || "🏅") + "</div><h3>" + esc(m.judul) + "</h3><small>" + n + " soal</small>" +
            '<span class="badge ' + (best >= 0 ? "badge-green" : "badge-gray") + '">' + (best >= 0 ? "Terbaik: " + best : "Belum dicoba") + "</span></a>";
        }).join("") + "</div>";
    },

    renderIntro(el, user, materi) {
      const jumlah = Math.min(DB.getSoal().filter((s) => s.kategori === materi.id && Array.isArray(s.pilihan) && s.pilihan.length === 4).length, Game.QUESTIONS_PER_GAME);
      if (!jumlah) {
        el.innerHTML = '<a class="link back" href="kuis.html">← Pilih kategori lain</a><div class="card">' +
          UI.emptyState("❓", "Kategori ini belum memiliki soal.") + "</div>";
        return;
      }
      el.innerHTML =
        '<a class="link back" href="kuis.html">← Pilih kategori lain</a>' +
        '<div class="card quiz-intro" style="--cat:' + esc(materi.warna || "#16a34a") + '"><div class="quiz-ico big">' + esc(materi.ikon || "🏅") +
        "</div><h2>Kuis " + esc(materi.judul) + "</h2><ul class=\"intro-list\"><li>📝 " + jumlah + " soal pilihan ganda</li><li>⏱️ " +
        Game.SECONDS_PER_QUESTION + " detik per soal</li><li>⭐ " + Game.POINTS_PER_CORRECT + " poin untuk setiap jawaban benar</li></ul>" +
        '<button class="btn btn-primary btn-lg" id="startQuiz">Mulai Kuis</button></div>';
      document.getElementById("startQuiz").addEventListener("click", () => SiswaPages.kuis.run(el, user, materi));
    },

    run(el, user, materi) {
      const soalList = Game.buildQuiz(materi.id);
      const jawaban = [];
      const startedAt = Date.now();
      let index = 0;
      let timerId = null;
      let skorSementara = 0;

      function stopTimer() {
        if (timerId) { clearInterval(timerId); timerId = null; }
      }

      function showQuestion() {
        const s = soalList[index];
        const letters = ["A", "B", "C", "D"];
        el.innerHTML =
          '<div class="card quiz-box" style="--cat:' + esc(materi.warna || "#16a34a") + '">' +
          '<div class="quiz-top"><span class="badge badge-blue">' + esc(materi.ikon || "") + " " + esc(materi.judul) + "</span>" +
          "<span>Soal <b>" + (index + 1) + "</b>/" + soalList.length + "</span><span>Skor: <b id=\"liveScore\">" + skorSementara + "</b></span>" +
          '<span class="timer-text">⏱️ <b id="timeLeft">' + Game.SECONDS_PER_QUESTION + "</b> dtk</span></div>" +
          '<div class="timer-bar"><div class="timer-fill" id="timerFill"></div></div>' +
          '<h2 class="q-text">' + esc(s.pertanyaan) + "</h2>" +
          '<div class="options">' +
          s.pilihan.map((p, i) =>
            '<button class="option" data-i="' + i + '"><span class="opt-letter">' + letters[i] + "</span><span>" + esc(p) + "</span></button>"
          ).join("") +
          '</div><div id="feedback"></div></div>';

        const deadline = Date.now() + Game.SECONDS_PER_QUESTION * 1000;
        const fill = document.getElementById("timerFill");
        const label = document.getElementById("timeLeft");
        stopTimer();
        timerId = setInterval(() => {
          const left = Math.max(0, deadline - Date.now());
          fill.style.width = (left / (Game.SECONDS_PER_QUESTION * 1000)) * 100 + "%";
          fill.classList.toggle("danger", left < 8000);
          label.textContent = Math.ceil(left / 1000);
          if (left <= 0) answer(null);
        }, 100);

        el.querySelectorAll(".option").forEach((btn) =>
          btn.addEventListener("click", () => answer(Number(btn.dataset.i)))
        );
      }

      function answer(pick) {
        stopTimer();
        const s = soalList[index];
        jawaban[index] = pick;
        const benar = pick === s.jawaban;
        if (benar) skorSementara += Game.POINTS_PER_CORRECT;

        el.querySelectorAll(".option").forEach((btn) => {
          const i = Number(btn.dataset.i);
          btn.disabled = true;
          if (i === s.jawaban) btn.classList.add("correct");
          else if (i === pick) btn.classList.add("wrong");
        });
        document.getElementById("liveScore").textContent = skorSementara;

        const last = index === soalList.length - 1;
        const head = pick === null
          ? '⏰ Waktu habis!'
          : benar ? "✅ Benar! +" + Game.POINTS_PER_CORRECT + " poin" : "❌ Salah";
        document.getElementById("feedback").innerHTML =
          '<div class="feedback ' + (benar ? "ok" : "no") + '"><strong>' + head + "</strong>" +
          (s.pembahasan ? "<p><b>Pembahasan:</b> " + esc(s.pembahasan) + "</p>" : "") +
          '<button class="btn btn-primary" id="nextBtn">' + (last ? "Lihat Hasil" : "Soal Berikutnya →") + "</button></div>";
        document.getElementById("nextBtn").addEventListener("click", () => {
          if (last) finish();
          else { index += 1; showQuestion(); }
        });
      }

      function finish() {
        stopTimer();
        const result = Game.finish({
          user, materi, soalList, jawaban,
          durasi: (Date.now() - startedAt) / 1000,
        });
        location.href = "hasil.html?id=" + encodeURIComponent(result.id);
      }

      showQuestion();
    },
  },

  // ---------- Hasil / riwayat ----------
  hasil: {
    title: "Hasil & Riwayat",
    render(el, user) {
      const id = new URLSearchParams(location.search).get("id");
      if (!id) return SiswaPages.hasil.renderList(el, user);
      const r = DB.getResultById(id);
      if (!r || r.userId !== user.id) {
        el.innerHTML = '<a class="link back" href="hasil.html">← Kembali</a><div class="card">' +
          UI.emptyState("🔍", "Hasil tidak ditemukan.") + "</div>";
        return;
      }
      const deg = Math.round((r.skor / Math.max(1, r.totalSoal * Game.POINTS_PER_CORRECT)) * 360);
      const msg = r.skor >= 90 ? "Luar biasa! 🎉" : r.skor >= 70 ? "Bagus sekali! 👏" : r.skor >= 50 ? "Cukup baik, terus berlatih! 💪" : "Jangan menyerah, baca materinya lagi! 📖";

      el.innerHTML =
        '<section class="card result-card"><div class="score-ring" style="--deg:' + deg + 'deg"><div><b>' + r.skor +
        "</b><small>/ " + r.totalSoal * Game.POINTS_PER_CORRECT + "</small></div></div>" +
        "<div class=\"result-info\"><h2>" + msg + "</h2><p>Kategori: <b>" + esc(r.kategoriNama) + "</b></p>" +
        '<div class="result-stats"><div><b>' + r.benar + "</b><small>Benar</small></div><div><b>" + r.salah +
        "</b><small>Salah</small></div><div><b>" + UI.fmtDuration(r.durasiDetik) + "</b><small>Waktu</small></div><div><b>+" +
        (r.xpDidapat || 0) + "</b><small>XP</small></div></div>" +
        '<div class="btn-row"><a class="btn btn-primary" href="kuis.html?k=' + encodeURIComponent(r.kategori) + '">🔁 Ulangi Permainan</a>' +
        '<a class="btn btn-secondary" href="kuis.html">Kategori Lain</a><a class="btn btn-ghost" href="dashboard.html">Beranda</a></div></div></section>' +
        '<section class="card"><h3>Pembahasan Jawaban</h3>' +
        r.jawaban.map((j, i) =>
          '<div class="review ' + (j.isBenar ? "ok" : "no") + '"><div class="review-q"><span>' + (j.isBenar ? "✅" : "❌") + "</span><b>" +
          (i + 1) + ". " + esc(j.pertanyaan) + "</b></div>" +
          '<p>Jawabanmu: <b>' + (j.dipilih === null ? "(tidak dijawab)" : esc(j.dipilih)) + "</b></p>" +
          (j.isBenar ? "" : "<p>Jawaban benar: <b>" + esc(j.benar) + "</b></p>") +
          (j.pembahasan ? '<p class="hint">' + esc(j.pembahasan) + "</p>" : "") + "</div>"
        ).join("") + "</section>";

      // Animasi naik level (hanya ditampilkan sekali per hasil)
      const flag = "gempjok_lvl_" + r.id;
      if (r.levelNaik && !sessionStorage.getItem(flag)) {
        sessionStorage.setItem(flag, "1");
        setTimeout(() => showLevelUp(r.levelSesudah), 400);
      }
    },

    renderList(el, user) {
      const results = DB.getResultsByUser(user.id).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
      el.innerHTML = '<section class="card"><h3>Riwayat Permainan</h3>' +
        (results.length
          ? '<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Kategori</th><th>Nilai</th><th>Benar</th><th>XP</th><th></th></tr></thead><tbody>' +
            historyRows(results) + "</tbody></table></div>"
          : UI.emptyState("🎮", "Belum ada riwayat. Mainkan kuis untuk mulai mengumpulkan nilai!")) +
        "</section>";
    },
  },

  // ---------- Profil ----------
  profil: {
    title: "Profil Saya",
    render(el, user) {
      const st = Game.stats(user.id);
      const badges = Game.badges(user.id, st);
      el.innerHTML =
        '<div class="grid grid-2"><section class="card"><div class="profile-head"><div class="avatar xl" id="avatarPreview">' + esc(user.avatar || "🙂") +
        "</div><div><h2>" + esc(user.nama) + "</h2><p class=\"hint\">@" + esc(user.username) + " · Level " + st.level + " · " + st.xp + " XP</p></div></div>" +
        '<form id="profileForm"><label class="field"><span>Nama lengkap</span><input name="nama" value="' + esc(user.nama) + '" required minlength="3" maxlength="50"></label>' +
        '<div class="field"><span>Avatar</span><div class="avatar-picker" id="avatarPicker">' +
        AVATARS.map((a) => '<label class="avatar-option"><input type="radio" name="avatar" value="' + a + '"' + (a === user.avatar ? " checked" : "") + "><span>" + a + "</span></label>").join("") +
        '</div></div><button class="btn btn-primary" type="submit">Simpan Profil</button></form></section>' +
        '<section class="card"><h3>Ganti Password</h3><form id="passForm"><label class="field"><span>Password lama</span><input type="password" name="lama" required></label>' +
        '<label class="field"><span>Password baru (min. 6 karakter)</span><input type="password" name="baru" required minlength="6"></label>' +
        '<label class="field"><span>Ulangi password baru</span><input type="password" name="ulang" required></label>' +
        '<p class="form-error" id="passError"></p><button class="btn btn-secondary" type="submit">Ubah Password</button></form></section></div>' +
        '<section class="card"><h3>Ringkasan Belajar</h3><div class="grid grid-4"><div class="mini-stat"><b>' + st.kuis + "</b><small>Kuis selesai</small></div>" +
        '<div class="mini-stat"><b>' + (st.rata === null ? "-" : st.rata) + "</b><small>Rata-rata nilai</small></div>" +
        '<div class="mini-stat"><b>' + st.materiDibaca.length + "/" + st.totalMateri + "</b><small>Materi dipelajari</small></div>" +
        '<div class="mini-stat"><b>' + st.persenProgres + "%</b><small>Progres belajar</small></div></div></section>" +
        '<section class="card"><h3>Badge</h3>' + badgeGrid(badges) + "</section>";

      document.getElementById("profileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target;
        const nama = f.nama.value.trim();
        if (nama.length < 3) return UI.toast("Nama minimal 3 karakter.", "error");
        DB.updateUser(user.id, { nama, avatar: f.avatar.value });
        UI.toast("Profil disimpan.", "success");
        setTimeout(() => location.reload(), 500);
      });

      document.getElementById("passForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const f = e.target;
        const err = document.getElementById("passError");
        err.textContent = "";
        const ok = await DB.verifyLogin(user.username, f.lama.value);
        if (!ok) return (err.textContent = "Password lama salah.");
        if (f.baru.value.length < 6) return (err.textContent = "Password baru minimal 6 karakter.");
        if (f.baru.value !== f.ulang.value) return (err.textContent = "Konfirmasi password tidak sama.");
        const fresh = await DB.hashPassword(f.baru.value);
        DB.updateUser(user.id, { passwordHash: fresh });
        f.reset();
        UI.toast("Password berhasil diubah.", "success");
      });
    },
  },
};

function statCard(icon, label, value, color) {
  return '<div class="stat-card ' + color + '"><div class="stat-ico">' + icon + '</div><div><small>' + esc(label) + "</small><b>" + esc(value) + "</b></div></div>";
}

App.run(SiswaPages, "siswa");
