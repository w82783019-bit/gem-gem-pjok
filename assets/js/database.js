/* =====================================================
   GEM-GEM PJOK - database.js
   Lapisan penyimpanan data (localStorage).
   Semua halaman mengakses data HANYA lewat objek DB ini,
   sehingga nanti mudah diganti ke database online
   (misalnya Firebase atau Supabase).

   CATATAN: localStorage hanya menyimpan data di browser
   dan perangkat masing-masing.
   ===================================================== */

const DB = (() => {
  // ---------- Kunci penyimpanan ----------
  const KEYS = {
    users: "gempjok_users",
    session: "gempjok_session",
    results: "gempjok_results",
    materi: "gempjok_materi",
    soal: "gempjok_soal",
    progress: "gempjok_progress",
  };

  // ---------- Fungsi dasar baca/tulis ----------
  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.error("Gagal membaca data:", key, err);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error("Gagal menyimpan data:", key, err);
      return false;
    }
  }

  function newId(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ---------- Hash password ----------
  // Memakai SHA-256 bila tersedia (localhost / https).
  // Jika tidak tersedia, memakai hash sederhana sebagai cadangan.
  async function hashPassword(text) {
    if (window.crypto && window.crypto.subtle) {
      const data = new TextEncoder().encode(text);
      const buf = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = (h << 5) - h + text.charCodeAt(i);
      h |= 0;
    }
    return "simple_" + h;
  }

  // ---------- Inisialisasi ----------
  // Dipanggil di setiap halaman: await DB.init();
  // - Membuat akun admin demo jika belum ada.
  // - Mengisi materi dan soal awal (hanya sekali).
  async function init() {
    const users = read(KEYS.users, []);
    if (!users.some((u) => u.role === "admin")) {
      users.push({
        id: newId("usr"),
        nama: "Administrator",
        username: "admin",
        passwordHash: await hashPassword("admin123"),
        role: "admin",
        avatar: "🧑‍🏫",
        createdAt: new Date().toISOString(),
      });
      write(KEYS.users, users);
    }
    if (localStorage.getItem(KEYS.materi) === null && typeof SEED_MATERI !== "undefined") {
      write(KEYS.materi, SEED_MATERI);
    }
    if (localStorage.getItem(KEYS.soal) === null && typeof SEED_SOAL !== "undefined") {
      write(KEYS.soal, SEED_SOAL);
    }
  }

  // ---------- Pengguna ----------
  const getUsers = () => read(KEYS.users, []);
  const getStudents = () => getUsers().filter((u) => u.role === "siswa");
  const findUserByUsername = (username) =>
    getUsers().find((u) => u.username.toLowerCase() === String(username).trim().toLowerCase());
  const findUserById = (id) => getUsers().find((u) => u.id === id);

  async function addUser({ nama, username, password, role = "siswa", avatar = "⚽" }) {
    if (findUserByUsername(username)) {
      return { ok: false, message: "Username sudah dipakai." };
    }
    const users = getUsers();
    const user = {
      id: newId("usr"),
      nama: String(nama).trim(),
      username: String(username).trim(),
      passwordHash: await hashPassword(password),
      role,
      avatar,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    write(KEYS.users, users);
    return { ok: true, user };
  }

  function updateUser(id, changes) {
    const users = getUsers();
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) return false;
    users[i] = { ...users[i], ...changes };
    return write(KEYS.users, users);
  }

  async function verifyLogin(username, password) {
    const user = findUserByUsername(username);
    if (!user) return null;
    const hash = await hashPassword(password);
    return hash === user.passwordHash ? user : null;
  }

  // Hapus siswa beserta hasil kuis dan progres belajarnya
  function deleteUser(id) {
    write(KEYS.users, getUsers().filter((u) => u.id !== id));
    write(KEYS.results, getResults().filter((r) => r.userId !== id));
    const progress = getProgress();
    delete progress[id];
    write(KEYS.progress, progress);
  }

  // ---------- Sesi login ----------
  const setSession = (user) =>
    write(KEYS.session, { userId: user.id, role: user.role, loginAt: new Date().toISOString() });
  const getSession = () => read(KEYS.session, null);
  const clearSession = () => localStorage.removeItem(KEYS.session);
  function getCurrentUser() {
    const s = getSession();
    return s ? findUserById(s.userId) || null : null;
  }

  // ---------- Hasil kuis ----------
  // Bentuk satu hasil:
  // { id, userId, kategori, kategoriNama, skor, benar, salah, totalSoal,
  //   durasiDetik, xpDidapat, levelSebelum, levelSesudah, levelNaik,
  //   jawaban:[{soalId, pertanyaan, dipilih, benar, isBenar, pembahasan}], tanggal }
  const getResults = () => read(KEYS.results, []);
  const getResultsByUser = (userId) => getResults().filter((r) => r.userId === userId);
  const getResultById = (id) => getResults().find((r) => r.id === id);

  function addResult(result) {
    const results = getResults();
    const saved = { id: newId("res"), tanggal: new Date().toISOString(), ...result };
    results.push(saved);
    write(KEYS.results, results);
    return saved;
  }

  // ---------- Materi dan soal ----------
  const getMateri = () => read(KEYS.materi, []);
  const saveMateri = (list) => write(KEYS.materi, list);
  const getSoal = () => read(KEYS.soal, []);
  const saveSoal = (list) => write(KEYS.soal, list);

  // ---------- Progres belajar (materi yang sudah dipelajari) ----------
  // Bentuk: { [userId]: { [materiId]: tanggalISO } }
  const getProgress = () => read(KEYS.progress, {});

  function markMateriRead(userId, materiId) {
    const all = getProgress();
    all[userId] = all[userId] || {};
    if (!all[userId][materiId]) all[userId][materiId] = new Date().toISOString();
    return write(KEYS.progress, all);
  }

  const getProgressByUser = (userId) => getProgress()[userId] || {};

  // ---------- Cadangan data ----------
  function exportBackup() {
    const data = {};
    Object.entries(KEYS).forEach(([name, key]) => {
      if (name !== "session") data[name] = read(key, null);
    });
    return JSON.stringify(data, null, 2);
  }

  function importBackup(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      if (!data || typeof data !== "object" || !Array.isArray(data.users)) return false;
      Object.entries(KEYS).forEach(([name, key]) => {
        if (name !== "session" && data[name] != null) write(key, data[name]);
      });
      return true;
    } catch (err) {
      console.error("Cadangan tidak valid:", err);
      return false;
    }
  }

  return {
    KEYS, newId, init, hashPassword,
    getUsers, getStudents, findUserByUsername, findUserById, addUser, updateUser, verifyLogin, deleteUser,
    setSession, getSession, clearSession, getCurrentUser,
    getResults, getResultsByUser, getResultById, addResult,
    getMateri, saveMateri, getSoal, saveSoal,
    getProgress, getProgressByUser, markMateriRead,
    exportBackup, importBackup,
  };
})();
