# GEM-GEM PJOK (Game Edukasi Materi Olahraga)

Website game edukasi PJOK memakai HTML, CSS, dan JavaScript murni (tanpa framework).

## Cara menjalankan
1. Ekstrak zip, buka folder `gem-gem-pjok` di VS Code.
2. Pasang ekstensi **Live Server**, klik kanan `index.html` > **Open with Live Server**.
   (Bisa juga klik dua kali `index.html`, tetapi Live Server lebih disarankan.)
3. Login admin demo: username `admin`, password `admin123`.
4. Siswa mendaftar sendiri lewat halaman **Daftar**.

## Cara publikasi ke GitHub Pages
1. Buat repository baru di GitHub, unggah seluruh isi folder (file `index.html` harus berada di akar repository).
2. Buka **Settings > Pages**, pilih Source: **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu Save.
3. Tunggu beberapa menit, alamat situs akan muncul di halaman yang sama.

## Catatan penting
- Data disimpan di **localStorage**: hanya ada di browser dan perangkat masing-masing.
  Admin hanya melihat siswa yang mendaftar dan bermain di perangkat/browser yang sama.
  Pemantauan lintas perangkat secara langsung butuh database online (misalnya Firebase atau Supabase).
  Seluruh akses data lewat `assets/js/database.js`, jadi cukup file itu yang diganti nanti.
- Fitur **Backup/Restore** di halaman Admin > Laporan membantu memindahkan data secara manual.
- Login bersifat simulasi (kode berjalan di browser). Jangan dipakai untuk data sensitif.
- Mengganti password admin: edit data lewat DevTools atau hapus data situs lalu ubah nilai di `database.js` (fungsi `init`).
- Ekspor CSV memakai pemisah titik koma (`;`). Ubah `CSV_SEPARATOR` di `assets/js/ui.js` bila perlu koma.

## Struktur
- `index.html`, `login.html`, `register.html`
- `admin/` dashboard, siswa, materi, soal, laporan
- `siswa/` dashboard, materi, kuis, hasil, profil
- `assets/css/style.css`
- `assets/js/` data.js (materi & 80 soal awal), database.js, ui.js, auth.js, game.js, siswa.js, admin.js
