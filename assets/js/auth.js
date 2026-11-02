/* =====================================================
   GEM-GEM PJOK - auth.js
   Login, registrasi, logout, dan pembatasan halaman
   berdasarkan jenis akun (admin / siswa).

   CATATAN KEAMANAN: karena semua kode berjalan di browser,
   login ini bersifat simulasi untuk belajar/demo kelas.
   Untuk data nyata, gunakan server dan database online.
   ===================================================== */

const AVATARS = ["⚽", "🏀", "🏐", "🏸", "🏃", "🤸", "🥇", "🦁", "🐯", "🦅", "🐬", "🚀"];

const Auth = {
  base: document.body.dataset.base || "",

  homeFor(user) {
    return (user.role === "admin" ? "admin/" : "siswa/") + "dashboard.html";
  },

  logout() {
    DB.clearSession();
    location.href = Auth.base + "login.html";
  },

  // ---------- Halaman login ----------
  async initLogin() {
    await DB.init();
    const current = DB.getCurrentUser();
    if (current) {
      location.replace(Auth.homeFor(current));
      return;
    }
    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("formError");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.textContent = "";
      const username = form.username.value.trim();
      const password = form.password.value;
      if (!username || !password) {
        errorBox.textContent = "Username dan password wajib diisi.";
        return;
      }
      const user = await DB.verifyLogin(username, password);
      if (!user) {
        errorBox.textContent = "Username atau password salah.";
        return;
      }
      DB.setSession(user);
      location.href = Auth.homeFor(user);
    });
  },

  // ---------- Halaman registrasi ----------
  async initRegister() {
    await DB.init();
    const current = DB.getCurrentUser();
    if (current) {
      location.replace(Auth.homeFor(current));
      return;
    }
    const form = document.getElementById("registerForm");
    const errorBox = document.getElementById("formError");
    const picker = document.getElementById("avatarPicker");

    picker.innerHTML = AVATARS.map(
      (a, i) =>
        '<label class="avatar-option"><input type="radio" name="avatar" value="' + a + '"' +
        (i === 0 ? " checked" : "") + "><span>" + a + "</span></label>"
    ).join("");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.textContent = "";
      const nama = form.nama.value.trim();
      const username = form.username.value.trim();
      const password = form.password.value;
      const confirm = form.confirm.value;
      const avatar = form.avatar.value || AVATARS[0];

      if (nama.length < 3) return (errorBox.textContent = "Nama minimal 3 karakter.");
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
        return (errorBox.textContent = "Username 3-20 karakter: huruf, angka, atau garis bawah (_).");
      if (password.length < 6) return (errorBox.textContent = "Password minimal 6 karakter.");
      if (password !== confirm) return (errorBox.textContent = "Konfirmasi password tidak sama.");

      const result = await DB.addUser({ nama, username, password, role: "siswa", avatar });
      if (!result.ok) return (errorBox.textContent = result.message);

      DB.setSession(result.user);
      location.href = "siswa/dashboard.html";
    });
  },

  // ---------- Halaman utama ----------
  async initHome() {
    await DB.init();
    const user = DB.getCurrentUser();
    const cta = document.getElementById("ctaArea");
    if (user) {
      cta.innerHTML =
        '<a class="btn btn-primary btn-lg" href="' + Auth.homeFor(user) + '">Masuk ke Dashboard</a>' +
        '<button class="btn btn-ghost btn-lg" id="homeLogout">Keluar</button>';
      document.getElementById("homeLogout").addEventListener("click", () => Auth.logout());
      const navCta = document.getElementById("navCta");
      if (navCta) navCta.innerHTML = '<a class="btn btn-primary" href="' + Auth.homeFor(user) + '">Dashboard</a>';
    }
    const list = document.getElementById("kategoriList");
    if (list) {
      list.innerHTML = DB.getMateri()
        .map(
          (m) =>
            '<div class="cat-card" style="--cat:' + UI.esc(m.warna || "#16a34a") + '">' +
            '<div class="cat-ico">' + UI.esc(m.ikon || "🏅") + "</div><h3>" + UI.esc(m.judul) + "</h3></div>"
        ).join("");
    }
  },
};

// ---------- Penjaga halaman + pemuat halaman ----------
// Dipakai oleh admin.js dan siswa.js:
//   App.run(NamaHalaman, "admin" | "siswa")
const App = {
  async run(pages, role) {
    await DB.init();
    const user = DB.getCurrentUser();
    if (!user || user.role !== role) {
      location.replace(UI.BASE + "login.html");
      return;
    }
    const key = document.body.dataset.page;
    const page = pages[key];
    if (!page) {
      console.error("Halaman tidak dikenal:", key);
      return;
    }
    const content = UI.shell({ role, active: key, user, title: page.title });
    try {
      await page.render(content, user);
    } catch (err) {
      console.error(err);
      content.innerHTML =
        '<div class="card"><h3>Terjadi kesalahan</h3><p>Halaman gagal dimuat. Coba muat ulang (F5).</p></div>';
    }
  },
};

// ---------- Jalankan sesuai halaman publik ----------
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "login") Auth.initLogin();
  else if (page === "register") Auth.initRegister();
  else if (page === "home") Auth.initHome();
});
