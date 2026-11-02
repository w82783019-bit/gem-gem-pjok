/* =====================================================
   GEM-GEM PJOK - game.js
   Logika game: penyusunan kuis, penilaian, XP, level 1-10,
   badge, tantangan, ranking, dan statistik siswa.
   Dipakai oleh halaman siswa maupun admin.
   ===================================================== */

const Game = (() => {
  // ---------- Pengaturan ----------
  const SECONDS_PER_QUESTION = 30; // waktu menjawab tiap soal
  const QUESTIONS_PER_GAME = 10; // jumlah soal tiap permainan
  const POINTS_PER_CORRECT = 10; // nilai tiap jawaban benar
  const BONUS_PERFECT_XP = 20; // bonus XP jika semua benar
  const BONUS_FIRST_TRY_XP = 10; // bonus XP saat pertama kali mencoba kategori

  // XP minimum untuk mencapai level 1 sampai 10
  const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
  const MAX_LEVEL = LEVEL_XP.length;
  const LEVEL_TITLES = [
    "Pemula", "Pelari Muda", "Atlet Muda", "Pemain Handal", "Atlet Tangguh",
    "Bintang Sekolah", "Juara Daerah", "Juara Nasional", "Legenda", "Master PJOK",
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Level ----------
  function levelFromXp(xp) {
    let level = 1;
    for (let i = 0; i < LEVEL_XP.length; i++) {
      if (xp >= LEVEL_XP[i]) level = i + 1;
    }
    return level;
  }

  function levelInfo(xp) {
    const level = levelFromXp(xp);
    const maxed = level >= MAX_LEVEL;
    const base = LEVEL_XP[level - 1];
    const next = maxed ? base : LEVEL_XP[level];
    const percent = maxed ? 100 : Math.round(((xp - base) / (next - base)) * 100);
    return { level, xp, base, next, maxed, percent, remaining: maxed ? 0 : next - xp, title: LEVEL_TITLES[level - 1] };
  }

  // ---------- Status perkembangan berdasarkan nilai rata-rata ----------
  function statusOf(rata) {
    if (rata === null) return { label: "Belum mengerjakan kuis", cls: "badge-gray" };
    if (rata < 60) return { label: "Perlu Bimbingan", cls: "badge-red" };
    if (rata < 80) return { label: "Berkembang", cls: "badge-yellow" };
    return { label: "Sangat Baik", cls: "badge-green" };
  }

  // ---------- Statistik satu siswa ----------
  // persenProgres = rata-rata dari (materi yang dipelajari) dan (kategori yang sudah dikuis)
  function stats(userId) {
    const results = DB.getResultsByUser(userId).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    const materi = DB.getMateri();
    const ids = new Set(materi.map((m) => m.id));
    const progress = DB.getProgressByUser(userId);
    const materiDibaca = Object.keys(progress).filter((id) => ids.has(id));
    const kategoriDicoba = new Set(results.map((r) => r.kategori).filter((k) => ids.has(k)));
    const skor = results.map((r) => r.skor);
    const xp = results.reduce((s, r) => s + (r.xpDidapat || 0), 0);
    const totalMateri = materi.length;
    const persenMateri = totalMateri ? Math.round((materiDibaca.length / totalMateri) * 100) : 0;
    const persenKuis = totalMateri ? Math.round((kategoriDicoba.size / totalMateri) * 100) : 0;
    const rata = skor.length ? Math.round((skor.reduce((a, b) => a + b, 0) / skor.length) * 10) / 10 : null;
    const dates = [...results.map((r) => r.tanggal), ...Object.values(progress)];
    const lastActive = dates.length ? dates.slice().sort().pop() : null;

    return {
      results,
      progress,
      kuis: results.length,
      tertinggi: skor.length ? Math.max(...skor) : null,
      terendah: skor.length ? Math.min(...skor) : null,
      rata,
      xp,
      level: levelFromXp(xp),
      info: levelInfo(xp),
      materiDibaca,
      totalMateri,
      kategoriDicoba: kategoriDicoba.size,
      benar: results.reduce((s, r) => s + (r.benar || 0), 0),
      salah: results.reduce((s, r) => s + (r.salah || 0), 0),
      persenMateri,
      persenKuis,
      persenProgres: Math.round((persenMateri + persenKuis) / 2),
      lastActive,
      status: statusOf(rata),
    };
  }

  // ---------- Badge ----------
  function badges(userId, st) {
    st = st || stats(userId);
    const materi = DB.getMateri();
    const semuaKategoriLulus =
      materi.length > 0 &&
      materi.every((m) => st.results.some((r) => r.kategori === m.id && r.skor >= 70));
    return [
      { id: "pemula", nama: "Pemula PJOK", ikon: "🌱", deskripsi: "Selesaikan 1 kuis", didapat: st.kuis >= 1 },
      { id: "atlet", nama: "Atlet Cerdas", ikon: "🧠", deskripsi: "Selesaikan 5 kuis", didapat: st.kuis >= 5 },
      { id: "juara", nama: "Juara Kuis", ikon: "🏆", deskripsi: "Raih nilai 100", didapat: st.tertinggi === 100 },
      { id: "rajin", nama: "Kutu Buku", ikon: "📖", deskripsi: "Pelajari 3 materi", didapat: st.materiDibaca.length >= 3 },
      { id: "bintang", nama: "Bintang Sekolah", ikon: "⭐", deskripsi: "Capai Level 5", didapat: st.level >= 5 },
      { id: "master", nama: "Master Olahraga", ikon: "🥇", deskripsi: "Nilai minimal 70 di semua kategori", didapat: semuaKategoriLulus },
    ];
  }

  // ---------- Tantangan ----------
  function challenges(userId, st) {
    st = st || stats(userId);
    const totalKat = Math.max(1, st.totalMateri);
    return [
      { judul: "Pelajari 3 materi", cur: Math.min(st.materiDibaca.length, 3), target: 3 },
      { judul: "Selesaikan 3 kuis", cur: Math.min(st.kuis, 3), target: 3 },
      { judul: "Raih nilai 100 pada satu kuis", cur: st.tertinggi === 100 ? 1 : 0, target: 1 },
      { judul: "Capai Level 5", cur: Math.min(st.level, 5), target: 5 },
      { judul: "Coba kuis di semua kategori", cur: Math.min(st.kategoriDicoba, totalKat), target: totalKat },
    ];
  }

  // ---------- Ranking siswa (hanya data di perangkat ini) ----------
  function ranking() {
    return DB.getStudents()
      .map((user) => {
        const st = stats(user.id);
        return { user, xp: st.xp, level: st.level, kuis: st.kuis, rata: st.rata };
      })
      .sort((a, b) => b.xp - a.xp || (b.rata || 0) - (a.rata || 0) || a.user.nama.localeCompare(b.user.nama));
  }

  // ---------- Menyusun soal kuis ----------
  // Mengambil maksimal 10 soal acak dari kategori, lalu mengacak urutan pilihan.
  function buildQuiz(kategoriId) {
    const pool = DB.getSoal().filter(
      (s) => s.kategori === kategoriId && Array.isArray(s.pilihan) && s.pilihan.length === 4
    );
    return shuffle(pool)
      .slice(0, QUESTIONS_PER_GAME)
      .map((s) => {
        const opts = shuffle(s.pilihan.map((teks, i) => ({ teks, benar: i === s.jawaban })));
        return {
          id: s.id,
          pertanyaan: s.pertanyaan,
          pembahasan: s.pembahasan || "",
          pilihan: opts.map((o) => o.teks),
          jawaban: opts.findIndex((o) => o.benar),
        };
      });
  }

  // ---------- Menyelesaikan kuis dan menyimpan hasil ----------
  // jawaban: array angka (indeks pilihan) atau null jika waktu habis
  function finish({ user, materi, soalList, jawaban, durasi }) {
    const detail = soalList.map((s, i) => {
      const pick = jawaban[i];
      return {
        soalId: s.id,
        pertanyaan: s.pertanyaan,
        dipilih: pick === null || pick === undefined ? null : s.pilihan[pick],
        benar: s.pilihan[s.jawaban],
        isBenar: pick === s.jawaban,
        pembahasan: s.pembahasan,
      };
    });
    const benar = detail.filter((d) => d.isBenar).length;
    const total = soalList.length;
    const skor = benar * POINTS_PER_CORRECT;

    const before = stats(user.id);
    const firstTry = !before.results.some((r) => r.kategori === materi.id);
    const xpDidapat =
      skor + (total > 0 && benar === total ? BONUS_PERFECT_XP : 0) + (firstTry ? BONUS_FIRST_TRY_XP : 0);
    const levelSebelum = before.level;
    const levelSesudah = levelFromXp(before.xp + xpDidapat);

    return DB.addResult({
      userId: user.id,
      kategori: materi.id,
      kategoriNama: materi.judul,
      skor,
      benar,
      salah: total - benar,
      totalSoal: total,
      durasiDetik: Math.round(durasi),
      xpDidapat,
      levelSebelum,
      levelSesudah,
      levelNaik: levelSesudah > levelSebelum,
      jawaban: detail,
    });
  }

  return {
    SECONDS_PER_QUESTION, QUESTIONS_PER_GAME, POINTS_PER_CORRECT, LEVEL_XP, MAX_LEVEL, LEVEL_TITLES,
    levelFromXp, levelInfo, statusOf, stats, badges, challenges, ranking, buildQuiz, finish,
  };
})();
