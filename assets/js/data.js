/* =====================================================
   GEM-GEM PJOK - data.js
   Data awal (seed): 8 materi PJOK dan 80 soal kuis.
   Data ini hanya disalin ke localStorage satu kali saat
   aplikasi pertama dibuka. Setelah itu admin bisa
   menambah, mengubah, dan menghapusnya lewat dashboard.
   ===================================================== */

const SEED_MATERI = [
  {
    id: "sepak-bola",
    judul: "Sepak Bola",
    ikon: "⚽",
    warna: "#16a34a",
    penjelasan:
      "Sepak bola adalah permainan beregu yang dimainkan oleh dua tim, masing-masing terdiri dari 11 pemain. Tujuannya mencetak gol sebanyak-banyaknya ke gawang lawan dengan kaki, kepala, atau bagian tubuh lain kecuali tangan dan lengan. Sepak bola melatih kerja sama tim, kecepatan, ketahanan, dan sportivitas.",
    tujuan: [
      "Menjelaskan peraturan dasar permainan sepak bola",
      "Mempraktikkan teknik dasar mengumpan, menggiring, dan menembak bola",
      "Menunjukkan sikap sportif dan kerja sama tim",
    ],
    peraturan: [
      "Satu tim terdiri dari 11 pemain termasuk penjaga gawang",
      "Waktu pertandingan dewasa 2 x 45 menit (dapat disesuaikan untuk pertandingan sekolah)",
      "Hanya penjaga gawang yang boleh memegang bola di dalam area penalti",
      "Bola yang keluar melewati garis samping dilanjutkan dengan lemparan ke dalam",
      "Pelanggaran dikenai tendangan bebas, penalti, atau kartu kuning dan merah",
    ],
    teknik: [
      "Mengumpan (passing) dengan kaki bagian dalam",
      "Menggiring bola (dribbling) dengan punggung kaki dan sisi luar kaki",
      "Menahan bola (stopping) dengan telapak kaki atau kaki bagian dalam",
      "Menendang ke gawang (shooting) dengan punggung kaki",
      "Menyundul bola (heading) dengan dahi",
    ],
    rangkuman:
      "Sepak bola dimainkan 11 lawan 11. Teknik dasarnya meliputi passing, dribbling, stopping, shooting, dan heading. Pemain wajib menjunjung sportivitas dan mematuhi peraturan.",
  },
  {
    id: "bola-voli",
    judul: "Bola Voli",
    ikon: "🏐",
    warna: "#f59e0b",
    penjelasan:
      "Bola voli adalah permainan beregu yang dimainkan di lapangan yang dipisahkan oleh net. Dua tim saling memukul bola melewati net agar jatuh di lapangan lawan, sambil mencegah bola jatuh di lapangan sendiri. Permainan ini melatih kekompakan, ketepatan, dan kelincahan.",
    tujuan: [
      "Menyebutkan peraturan dasar permainan bola voli",
      "Mempraktikkan servis, passing bawah, passing atas, dan smash",
      "Bekerja sama dengan teman satu tim",
    ],
    peraturan: [
      "Setiap tim bermain dengan 6 pemain di dalam lapangan",
      "Setiap tim maksimal 3 kali sentuhan sebelum bola dikembalikan ke lawan",
      "Sistem rally point: setiap rally menghasilkan satu poin bagi pemenangnya",
      "Satu set dimenangkan dengan 25 poin dan selisih minimal 2 poin",
      "Pemain tidak boleh menyentuh bola dua kali berturut-turut (kecuali saat blok)",
    ],
    teknik: [
      "Servis bawah dan servis atas untuk memulai permainan",
      "Passing bawah dengan dua lengan lurus untuk menerima bola servis",
      "Passing atas dengan ujung jari untuk mengumpan kepada penyerang",
      "Smash (spike): pukulan keras dari atas net",
      "Blok: menghadang bola serangan lawan di atas net",
    ],
    rangkuman:
      "Bola voli dimainkan 6 lawan 6 dengan maksimal 3 sentuhan. Teknik dasarnya adalah servis, passing bawah, passing atas, smash, dan blok. Kekompakan tim sangat menentukan.",
  },
  {
    id: "bola-basket",
    judul: "Bola Basket",
    ikon: "🏀",
    warna: "#ea580c",
    penjelasan:
      "Bola basket adalah permainan beregu di mana dua tim berusaha memasukkan bola ke ring lawan yang tingginya 3,05 meter. Pemain bergerak dengan cara menggiring (dribble) atau mengoper bola. Permainan ini melatih kecepatan, ketepatan, kekuatan, dan strategi.",
    tujuan: [
      "Menjelaskan peraturan dasar permainan bola basket",
      "Mempraktikkan passing, dribbling, dan shooting",
      "Menerapkan sikap fair play dalam bermain",
    ],
    peraturan: [
      "Setiap tim bermain dengan 5 pemain di dalam lapangan",
      "Pertandingan resmi terdiri atas 4 kuarter, masing-masing 10 menit (aturan FIBA)",
      "Tembakan dari dalam garis 3 poin bernilai 2, dari luar garis 3 poin bernilai 3, lemparan bebas bernilai 1",
      "Dilarang berlari membawa bola tanpa menggiring (travelling)",
      "Dilarang menggiring dengan dua tangan atau menggiring lagi setelah berhenti (double dribble)",
    ],
    teknik: [
      "Chest pass: operan dua tangan dari depan dada",
      "Bounce pass: operan yang dipantulkan ke lantai",
      "Dribbling: menggiring bola dengan ujung jari",
      "Lay up: tembakan dekat ring setelah dua langkah",
      "Rebound: merebut bola pantulan dari ring",
    ],
    rangkuman:
      "Bola basket dimainkan 5 lawan 5 dengan ring setinggi 3,05 meter. Hindari travelling dan double dribble. Teknik utamanya adalah passing, dribbling, shooting, dan rebound.",
  },
  {
    id: "bulu-tangkis",
    judul: "Bulu Tangkis",
    ikon: "🏸",
    warna: "#0ea5e9",
    penjelasan:
      "Bulu tangkis adalah olahraga raket yang dimainkan di lapangan yang dibatasi net. Pemain memukul kok (shuttlecock) agar jatuh di area lawan. Bulu tangkis dapat dimainkan tunggal atau ganda, dan melatih kecepatan reaksi, kelincahan, serta koordinasi.",
    tujuan: [
      "Menyebutkan peraturan dasar bulu tangkis",
      "Mempraktikkan cara memegang raket, servis, dan pukulan dasar",
      "Menunjukkan sikap jujur dan sportif saat bertanding",
    ],
    peraturan: [
      "Pertandingan terdiri atas maksimal 3 game",
      "Satu game dimenangkan dengan 21 poin (rally point), selisih minimal 2 poin, batas maksimal 30 poin",
      "Servis dilakukan menyilang (diagonal) dan kok dipukul di bawah pinggang",
      "Kok yang jatuh tepat di garis dinyatakan masuk (in)",
      "Nomor pertandingan: tunggal, ganda putra/putri, dan ganda campuran",
    ],
    teknik: [
      "Cara memegang raket (grip) yang benar dan lentur",
      "Servis pendek dan servis panjang",
      "Clear (lob): pukulan tinggi dan jauh ke belakang lapangan lawan",
      "Smash: pukulan keras menukik ke bawah",
      "Drop shot dan netting: pukulan jatuh tipis di dekat net",
      "Footwork: langkah kaki cepat dan seimbang",
    ],
    rangkuman:
      "Bulu tangkis memakai raket dan kok, dengan game sampai 21 poin. Pukulan dasarnya servis, clear, smash, drop shot, dan netting, ditunjang footwork yang baik.",
  },
  {
    id: "atletik",
    judul: "Atletik",
    ikon: "🏃",
    warna: "#dc2626",
    penjelasan:
      "Atletik adalah cabang olahraga yang terdiri dari nomor jalan, lari, lompat, dan lempar. Karena gerakannya alami (berlari, melompat, melempar), atletik disebut sebagai induk dari banyak cabang olahraga. Atletik melatih kecepatan, kekuatan, daya tahan, dan kelincahan.",
    tujuan: [
      "Menyebutkan nomor-nomor dalam atletik",
      "Mempraktikkan start jongkok, lari jarak pendek, dan lompat jauh",
      "Menunjukkan sikap disiplin dan pantang menyerah",
    ],
    peraturan: [
      "Pelari harus tetap berada di lintasan masing-masing pada lari jarak pendek",
      "Berangkat sebelum aba-aba atau tembakan disebut false start",
      "Pada lompat jauh, tumpuan tidak boleh melewati papan tumpu",
      "Lari estafet 4 x 100 meter dilakukan oleh 4 pelari yang mengoper tongkat estafet",
      "Pergantian tongkat estafet dilakukan di dalam area pergantian",
    ],
    teknik: [
      "Start jongkok dengan aba-aba: bersedia, siap, ya",
      "Lari jarak pendek dengan mendarat di ujung telapak kaki",
      "Lompat jauh: awalan, tumpuan, melayang, mendarat",
      "Tolak peluru: mendorong peluru dari bahu dengan kuat",
      "Lompat tinggi gaya flop (Fosbury flop)",
    ],
    rangkuman:
      "Atletik terdiri dari nomor jalan, lari, lompat, dan lempar. Pahami aturan start, lintasan, dan estafet. Teknik lompat jauh memiliki empat tahap: awalan, tumpuan, melayang, dan mendarat.",
  },
  {
    id: "senam-lantai",
    judul: "Senam Lantai",
    ikon: "🤸",
    warna: "#9333ea",
    penjelasan:
      "Senam lantai adalah senam yang dilakukan di atas matras tanpa alat bantu. Gerakannya meliputi berguling, meroda, kayang, dan sikap keseimbangan. Senam lantai melatih kelentukan, kekuatan otot, keseimbangan, dan keberanian.",
    tujuan: [
      "Menyebutkan gerakan dasar senam lantai",
      "Mempraktikkan guling depan, guling belakang, kayang, dan meroda dengan aman",
      "Menerapkan prinsip keselamatan saat berlatih senam",
    ],
    peraturan: [
      "Gunakan matras yang rata dan cukup tebal",
      "Lakukan pemanasan sebelum berlatih",
      "Kenakan pakaian olahraga yang nyaman dan lepas aksesori berbahaya",
      "Berlatih bertahap dari gerakan mudah ke sulit",
      "Berlatih dengan pengawasan guru atau teman yang siap membantu",
    ],
    teknik: [
      "Guling depan: sikap awal jongkok, dagu ditempelkan ke dada, berguling lewat punggung",
      "Guling belakang: berguling ke belakang dengan tumpuan kedua tangan",
      "Sikap lilin: tumpuan di bahu dan lengan atas, kaki lurus ke atas",
      "Kayang: badan melengkung dengan tumpuan kedua tangan dan kaki",
      "Meroda: berputar ke samping dengan tumpuan tangan dan kaki bergantian",
      "Sikap pesawat terbang: keseimbangan satu kaki dengan badan condong ke depan",
    ],
    rangkuman:
      "Senam lantai dilakukan di matras untuk melatih kelentukan, kekuatan, dan keseimbangan. Utamakan keselamatan: pemanasan, matras yang aman, dan latihan bertahap.",
  },
  {
    id: "kebugaran-jasmani",
    judul: "Kebugaran Jasmani",
    ikon: "💪",
    warna: "#0d9488",
    penjelasan:
      "Kebugaran jasmani adalah kemampuan tubuh melakukan aktivitas sehari-hari dengan baik tanpa kelelahan berlebihan, serta masih punya tenaga untuk kegiatan lain. Komponen utamanya adalah daya tahan jantung dan paru, kekuatan otot, daya tahan otot, kelentukan, dan komposisi tubuh.",
    tujuan: [
      "Menyebutkan komponen kebugaran jasmani",
      "Melakukan tes kebugaran sederhana",
      "Menyusun kebiasaan latihan yang teratur dan aman",
    ],
    labelPeraturan: "Prinsip Latihan",
    labelTeknik: "Contoh Tes dan Latihan",
    peraturan: [
      "Prinsip FITT: Frequency (frekuensi), Intensity (intensitas), Time (waktu), Type (jenis latihan)",
      "Selalu mulai dengan pemanasan dan akhiri dengan pendinginan",
      "Tingkatkan beban latihan secara bertahap",
      "Beri waktu istirahat yang cukup agar otot pulih",
      "Anak dan remaja dianjurkan aktif fisik minimal 60 menit setiap hari",
    ],
    teknik: [
      "Lari 12 menit (tes Cooper) untuk mengukur daya tahan",
      "Push-up untuk mengukur kekuatan dan daya tahan otot lengan",
      "Sit-up untuk mengukur kekuatan dan daya tahan otot perut",
      "Sit and reach untuk mengukur kelentukan",
      "Shuttle run untuk mengukur kelincahan",
    ],
    rangkuman:
      "Kebugaran jasmani dijaga dengan latihan teratur menurut prinsip FITT. Komponennya meliputi daya tahan, kekuatan, kelentukan, dan komposisi tubuh. Jangan lupa pemanasan dan pendinginan.",
  },
  {
    id: "kesehatan",
    judul: "Kesehatan dan Pola Hidup Sehat",
    ikon: "🥗",
    warna: "#65a30d",
    penjelasan:
      "Sehat bukan hanya bebas dari penyakit, tetapi keadaan sejahtera secara fisik, mental, dan sosial. Pola hidup sehat dibangun dari kebiasaan sehari-hari: makan bergizi seimbang, olahraga teratur, tidur cukup, menjaga kebersihan, dan menjauhi zat berbahaya seperti rokok dan narkoba.",
    tujuan: [
      "Menjelaskan arti sehat dan pentingnya pola hidup sehat",
      "Menyebutkan contoh makanan bergizi seimbang",
      "Menerapkan kebiasaan hidup bersih dan sehat setiap hari",
    ],
    labelPeraturan: "Aturan Hidup Sehat",
    labelTeknik: "Langkah Menjaga Kesehatan",
    peraturan: [
      "Makan makanan bergizi seimbang: karbohidrat, protein, sayur, dan buah",
      "Minum air putih yang cukup, sekitar 8 gelas per hari",
      "Tidur cukup, remaja membutuhkan sekitar 8 sampai 10 jam per malam",
      "Berolahraga teratur dan hindari terlalu lama duduk atau bermain gawai",
      "Jauhi rokok, minuman keras, dan narkoba",
    ],
    teknik: [
      "Cuci tangan dengan sabun di air mengalir selama sekitar 20 detik",
      "Sarapan setiap pagi agar tubuh berenergi dan mudah berkonsentrasi",
      "Mandi dua kali sehari dan menyikat gigi dengan benar",
      "Menjaga kebersihan lingkungan rumah dan sekolah",
      "Mengelola stres dengan istirahat, hobi, dan bercerita kepada orang tepercaya",
    ],
    rangkuman:
      "Hidup sehat berarti sejahtera fisik, mental, dan sosial. Terapkan gizi seimbang, olahraga, tidur cukup, dan kebersihan, serta jauhi zat berbahaya.",
  },
];

/* ---------- Soal kuis ---------- */
let _seedNo = 0;
function q(kategori, pertanyaan, pilihan, jawaban, pembahasan) {
  _seedNo += 1;
  return { id: "seed_" + _seedNo, kategori, pertanyaan, pilihan, jawaban, pembahasan };
}

const SEED_SOAL = [
  /* ===== Sepak Bola ===== */
  q("sepak-bola", "Berapa jumlah pemain dalam satu tim sepak bola di lapangan, termasuk penjaga gawang?", ["9 pemain", "10 pemain", "11 pemain", "12 pemain"], 2, "Satu tim sepak bola terdiri dari 11 pemain, termasuk penjaga gawang."),
  q("sepak-bola", "Berapa lama waktu normal pertandingan sepak bola dewasa?", ["2 x 30 menit", "2 x 45 menit", "2 x 40 menit", "3 x 30 menit"], 1, "Pertandingan sepak bola dewasa berlangsung 2 x 45 menit."),
  q("sepak-bola", "Siapa satu-satunya pemain yang boleh memegang bola dengan tangan di dalam area penalti sendiri?", ["Bek", "Gelandang", "Penjaga gawang", "Penyerang"], 2, "Hanya penjaga gawang yang diperbolehkan memegang bola dengan tangan di area penalti timnya."),
  q("sepak-bola", "Bagian kaki yang paling tepat untuk mengumpan pendek dengan akurat adalah...", ["Ujung kaki", "Punggung kaki", "Kaki bagian dalam", "Tumit"], 2, "Kaki bagian dalam memiliki bidang yang luas sehingga umpan pendek lebih akurat."),
  q("sepak-bola", "Tendangan yang diberikan karena tim bertahan melanggar di dalam kotak penalti disebut...", ["Tendangan bebas", "Tendangan sudut", "Tendangan penalti", "Tendangan gawang"], 2, "Pelanggaran oleh tim bertahan di dalam kotak penalti dihukum dengan tendangan penalti."),
  q("sepak-bola", "Pemain yang diberi kartu merah harus...", ["Mendapat peringatan saja", "Dikeluarkan dari lapangan", "Diganti oleh pemain lain", "Melakukan tendangan bebas"], 1, "Kartu merah berarti pemain dikeluarkan dan timnya bermain dengan kekurangan pemain."),
  q("sepak-bola", "Menahan atau mengontrol bola agar tidak lari jauh disebut...", ["Heading", "Stopping", "Shooting", "Throw-in"], 1, "Stopping adalah teknik menghentikan atau mengontrol bola."),
  q("sepak-bola", "Membawa bola sambil berlari dengan sentuhan-sentuhan kecil di kaki disebut...", ["Passing", "Heading", "Dribbling", "Blocking"], 2, "Dribbling adalah teknik menggiring bola."),
  q("sepak-bola", "Cara melakukan lemparan ke dalam (throw-in) yang benar adalah...", ["Satu tangan dari samping badan", "Dua tangan dari belakang kepala dan kedua kaki menyentuh tanah", "Dua tangan dari bawah pinggang", "Satu tangan sambil berlari"], 1, "Lemparan ke dalam dilakukan dengan dua tangan dari belakang kepala, kedua kaki tetap menyentuh tanah."),
  q("sepak-bola", "Bola yang keluar melewati garis samping lapangan dilanjutkan dengan...", ["Tendangan sudut", "Lemparan ke dalam", "Tendangan gawang", "Tendangan penalti"], 1, "Bola keluar lewat garis samping dilanjutkan dengan lemparan ke dalam."),

  /* ===== Bola Voli ===== */
  q("bola-voli", "Berapa jumlah pemain bola voli yang berada di lapangan untuk satu tim?", ["4 pemain", "5 pemain", "6 pemain", "7 pemain"], 2, "Satu tim bola voli bermain dengan 6 pemain di dalam lapangan."),
  q("bola-voli", "Teknik menerima bola servis dengan dua lengan lurus dari bawah disebut...", ["Passing atas", "Passing bawah", "Smash", "Blok"], 1, "Passing bawah memakai dua lengan yang lurus dan digunakan untuk menerima servis."),
  q("bola-voli", "Pukulan keras dari atas net untuk mematikan bola di lapangan lawan disebut...", ["Servis", "Passing bawah", "Smash", "Umpan"], 2, "Smash (spike) adalah pukulan keras dari atas untuk mencetak poin."),
  q("bola-voli", "Gerakan menghadang bola serangan lawan di atas net disebut...", ["Blok", "Servis", "Passing", "Umpan"], 0, "Blok dilakukan dengan mengangkat tangan di atas net untuk menghadang serangan."),
  q("bola-voli", "Tinggi net bola voli putra dewasa adalah...", ["2,24 meter", "2,43 meter", "2,35 meter", "2,50 meter"], 1, "Net putra dewasa 2,43 meter, sedangkan putri 2,24 meter."),
  q("bola-voli", "Berapa kali maksimal sebuah tim boleh menyentuh bola sebelum mengembalikannya ke lawan?", ["2 kali", "3 kali", "4 kali", "5 kali"], 1, "Setiap tim maksimal 3 kali sentuhan (blok tidak dihitung sebagai sentuhan pertama)."),
  q("bola-voli", "Pukulan pertama untuk memulai permainan bola voli disebut...", ["Servis", "Smash", "Blok", "Passing"], 0, "Permainan dimulai dengan servis."),
  q("bola-voli", "Memantulkan bola dua kali berturut-turut oleh pemain yang sama disebut pelanggaran...", ["Bola keluar", "Sentuhan ganda (double contact)", "Servis salah", "Rotasi"], 1, "Sentuhan ganda oleh pemain yang sama termasuk pelanggaran."),
  q("bola-voli", "Tugas utama pengumpan (setter) dalam bola voli adalah...", ["Menerima servis", "Menghalangi serangan lawan", "Mengatur dan mengarahkan bola kepada penyerang", "Melakukan servis saja"], 2, "Setter mengatur bola agar dapat di-smash oleh penyerang."),
  q("bola-voli", "Pada sistem rally point, yang dimaksud adalah...", ["Poin hanya didapat tim yang melakukan servis", "Setiap rally menghasilkan poin bagi pemenangnya", "Poin hanya didapat dari smash", "Poin dihitung setiap sentuhan bola"], 1, "Dalam rally point, setiap pertukaran bola menghasilkan satu poin bagi tim yang menang."),

  /* ===== Bola Basket ===== */
  q("bola-basket", "Berapa jumlah pemain satu tim bola basket yang berada di lapangan?", ["4 pemain", "5 pemain", "6 pemain", "7 pemain"], 1, "Satu tim bola basket bermain dengan 5 pemain di lapangan."),
  q("bola-basket", "Tembakan yang dilakukan dari luar garis 3 poin, jika masuk bernilai...", ["1 poin", "2 poin", "3 poin", "4 poin"], 2, "Tembakan dari luar garis 3 poin bernilai 3 poin."),
  q("bola-basket", "Lemparan bebas (free throw) yang berhasil masuk bernilai...", ["1 poin", "2 poin", "3 poin", "4 poin"], 0, "Lemparan bebas bernilai 1 poin."),
  q("bola-basket", "Berlari membawa bola lebih dari beberapa langkah tanpa menggiring disebut pelanggaran...", ["Travelling", "Double dribble", "Out of bounds", "Charging"], 0, "Travelling terjadi bila pemain berjalan atau berlari dengan bola tanpa menggiring."),
  q("bola-basket", "Menggiring bola dengan dua tangan sekaligus atau menggiring lagi setelah berhenti disebut...", ["Travelling", "Double dribble", "Blocking", "Jump ball"], 1, "Itulah pelanggaran double dribble."),
  q("bola-basket", "Tinggi ring basket dari lantai adalah...", ["2,75 meter", "3,05 meter", "3,50 meter", "2,43 meter"], 1, "Ring basket berada pada ketinggian 3,05 meter."),
  q("bola-basket", "Operan bola dengan dua tangan dari depan dada disebut...", ["Chest pass", "Bounce pass", "Lay up", "Rebound"], 0, "Chest pass adalah operan dua tangan dari depan dada."),
  q("bola-basket", "Gerakan merebut bola pantulan setelah tembakan gagal disebut...", ["Dribble", "Pivot", "Rebound", "Steal"], 2, "Rebound adalah merebut bola pantulan dari ring atau papan."),
  q("bola-basket", "Tembakan dengan melangkah dua langkah lalu melompat dekat ring disebut...", ["Jump shot", "Lay up", "Free throw", "Hook shot"], 1, "Lay up dilakukan dekat ring setelah dua langkah."),
  q("bola-basket", "Kontak fisik yang tidak sah dengan lawan dalam bola basket disebut...", ["Travelling", "Rebound", "Personal foul", "Pivot"], 2, "Kontak fisik tidak sah dikenai personal foul."),

  /* ===== Bulu Tangkis ===== */
  q("bulu-tangkis", "Berapa poin yang dibutuhkan untuk memenangkan satu game bulu tangkis (sistem rally point)?", ["11 poin", "15 poin", "21 poin", "25 poin"], 2, "Satu game dimenangkan dengan 21 poin dan selisih minimal 2 poin."),
  q("bulu-tangkis", "Bola yang dipukul dalam permainan bulu tangkis disebut...", ["Puck", "Kok (shuttlecock)", "Bola karet", "Bola kasti"], 1, "Bulu tangkis memakai kok atau shuttlecock."),
  q("bulu-tangkis", "Pukulan tinggi dan jauh ke belakang lapangan lawan disebut...", ["Netting", "Drop shot", "Clear", "Servis pendek"], 2, "Clear (lob) mengarahkan kok tinggi dan jauh ke belakang lapangan lawan."),
  q("bulu-tangkis", "Pukulan keras yang menukik cepat ke bawah disebut...", ["Smash", "Netting", "Lob", "Servis"], 0, "Smash adalah pukulan keras dan menukik."),
  q("bulu-tangkis", "Pukulan yang jatuh tipis di dekat net setelah dipukul dari belakang lapangan disebut...", ["Smash", "Drop shot", "Clear", "Servis panjang"], 1, "Drop shot jatuh pelan dan tipis di dekat net."),
  q("bulu-tangkis", "Tinggi net bulu tangkis di bagian tengah lapangan adalah...", ["1,20 meter", "1,524 meter", "1,80 meter", "2,00 meter"], 1, "Net bulu tangkis setinggi 1,524 meter di bagian tengah."),
  q("bulu-tangkis", "Berapa pemain dalam satu sisi pada nomor ganda?", ["1 pemain", "2 pemain", "3 pemain", "4 pemain"], 1, "Nomor ganda dimainkan 2 pemain di setiap sisi."),
  q("bulu-tangkis", "Saat servis bulu tangkis, kok harus dipukul...", ["Di atas kepala", "Di bawah pinggang", "Bebas di mana saja", "Setelah melompat"], 1, "Kok dipukul di bawah pinggang saat servis."),
  q("bulu-tangkis", "Fungsi utama footwork pada bulu tangkis adalah...", ["Menambah berat badan", "Bergerak cepat dan seimbang menuju kok", "Menghemat tenaga tanpa bergerak", "Mengubah arah angin"], 1, "Footwork membuat pemain sampai ke kok dengan cepat dan seimbang."),
  q("bulu-tangkis", "Kok yang jatuh tepat pada garis lapangan dinyatakan...", ["Keluar (out)", "Masuk (in)", "Diulang", "Pelanggaran"], 1, "Kok yang jatuh pada garis dianggap masuk (in)."),

  /* ===== Atletik ===== */
  q("atletik", "Nomor atletik yang termasuk lari jarak pendek adalah...", ["100 meter", "1.500 meter", "5.000 meter", "Maraton"], 0, "Lari 100 meter termasuk lari jarak pendek (sprint)."),
  q("atletik", "Start yang digunakan pada lari jarak pendek adalah...", ["Start berdiri", "Start jongkok", "Start duduk", "Start berbaring"], 1, "Lari jarak pendek menggunakan start jongkok."),
  q("atletik", "Aba-aba pada start jongkok yang benar adalah...", ["Bersedia – Siap – Ya", "Siap – Mulai", "Satu – Dua – Tiga", "Mulai – Lari"], 0, "Aba-aba start jongkok: bersedia, siap, ya (atau tembakan)."),
  q("atletik", "Urutan gerakan lompat jauh yang benar adalah...", ["Tumpuan – awalan – mendarat – melayang", "Awalan – tumpuan – melayang – mendarat", "Melayang – awalan – tumpuan – mendarat", "Mendarat – awalan – tumpuan – melayang"], 1, "Lompat jauh: awalan, tumpuan, melayang, lalu mendarat."),
  q("atletik", "Nomor lempar yang menggunakan bola logam berat dengan cara ditolak dari bahu adalah...", ["Lempar lembing", "Tolak peluru", "Lempar cakram", "Lompat tinggi"], 1, "Tolak peluru dilakukan dengan menolak peluru dari bahu."),
  q("atletik", "Pada lari jarak pendek, kaki mendarat pada bagian...", ["Tumit", "Ujung telapak kaki", "Punggung kaki", "Sisi luar kaki"], 1, "Pelari sprint mendarat dengan ujung telapak kaki."),
  q("atletik", "Berapa jumlah pelari dalam satu regu lari estafet 4 x 100 meter?", ["2 pelari", "3 pelari", "4 pelari", "5 pelari"], 2, "Estafet 4 x 100 meter dilakukan oleh 4 pelari."),
  q("atletik", "Benda yang dioper antarpelari pada lari estafet adalah...", ["Bola", "Tongkat estafet", "Pita", "Peluru"], 1, "Pelari estafet mengoper tongkat estafet."),
  q("atletik", "Gaya lompat tinggi yang paling banyak dipakai atlet modern adalah...", ["Gaya gunting", "Gaya guling perut", "Gaya flop (Fosbury flop)", "Gaya jongkok"], 2, "Gaya flop atau Fosbury flop paling efektif dan umum dipakai."),
  q("atletik", "Berangkat sebelum aba-aba atau tembakan start disebut...", ["Walkover", "Overtake", "False start", "Foul"], 2, "Berangkat sebelum aba-aba disebut false start."),

  /* ===== Senam Lantai ===== */
  q("senam-lantai", "Gerakan menggulingkan badan ke depan di atas matras disebut...", ["Guling depan", "Guling belakang", "Kayang", "Meroda"], 0, "Guling depan adalah berguling ke depan dengan punggung bertumpu pada matras."),
  q("senam-lantai", "Sikap awal untuk melakukan guling depan adalah...", ["Berdiri tegak", "Berbaring", "Jongkok dengan tangan di matras", "Duduk bersila"], 2, "Guling depan dimulai dari sikap jongkok dengan kedua tangan di depan."),
  q("senam-lantai", "Gerakan badan melengkung ke belakang dengan tumpuan kedua tangan dan kaki disebut...", ["Meroda", "Kayang", "Sikap lilin", "Guling lenting"], 1, "Kayang adalah gerakan melengkungkan badan ke belakang."),
  q("senam-lantai", "Gerakan berputar ke samping dengan tumpuan tangan dan kaki bergantian disebut...", ["Kayang", "Guling belakang", "Meroda", "Sikap lilin"], 2, "Meroda seperti roda berputar ke samping."),
  q("senam-lantai", "Hal yang wajib dilakukan sebelum berlatih senam adalah...", ["Makan banyak", "Tidur", "Pemanasan", "Berlari 10 kilometer"], 2, "Pemanasan menyiapkan otot dan sendi agar tidak cedera."),
  q("senam-lantai", "Alas yang digunakan untuk berlatih senam lantai adalah...", ["Karpet tipis", "Matras", "Rumput liar", "Pasir kasar"], 1, "Senam lantai dilakukan di atas matras."),
  q("senam-lantai", "Pada sikap lilin, bagian tubuh yang menjadi tumpuan adalah...", ["Kepala", "Pantat", "Bahu dan lengan atas", "Telapak kaki"], 2, "Pada sikap lilin, bahu dan lengan atas menopang badan."),
  q("senam-lantai", "Manfaat utama senam lantai bagi tubuh adalah...", ["Melatih kelentukan, kekuatan, dan keseimbangan", "Menambah tinggi badan secara instan", "Mengurangi kebutuhan tidur", "Menghilangkan rasa lapar"], 0, "Senam lantai melatih kelentukan, kekuatan, dan keseimbangan."),
  q("senam-lantai", "Agar aman, saat guling depan dagu harus...", ["Diangkat ke atas", "Ditempelkan ke dada", "Dimiringkan ke kanan", "Dibuka lebar"], 1, "Dagu ditempelkan ke dada agar kepala tidak terbentur matras."),
  q("senam-lantai", "Sikap berdiri satu kaki dengan badan condong ke depan dan kedua tangan terentang disebut...", ["Sikap lilin", "Sikap kayang", "Sikap duduk", "Sikap pesawat terbang"], 3, "Itulah sikap pesawat terbang, latihan keseimbangan."),

  /* ===== Kebugaran Jasmani ===== */
  q("kebugaran-jasmani", "Kemampuan jantung, paru-paru, dan pembuluh darah bekerja dalam waktu lama disebut...", ["Kelincahan", "Daya tahan kardiorespirasi", "Kecepatan", "Kelentukan"], 1, "Itulah daya tahan jantung dan paru (kardiorespirasi)."),
  q("kebugaran-jasmani", "Tes lari 12 menit (tes Cooper) bertujuan mengukur...", ["Kekuatan lengan", "Kelentukan", "Daya tahan", "Keseimbangan"], 2, "Tes Cooper mengukur daya tahan kardiorespirasi."),
  q("kebugaran-jasmani", "Tes sit and reach digunakan untuk mengukur...", ["Kelentukan", "Daya tahan", "Kekuatan", "Kecepatan"], 0, "Sit and reach mengukur kelentukan otot punggung bawah dan paha belakang."),
  q("kebugaran-jasmani", "Push-up terutama mengukur...", ["Kelentukan", "Kekuatan dan daya tahan otot lengan dan dada", "Kelincahan", "Keseimbangan"], 1, "Push-up melatih dan mengukur kekuatan otot lengan dan dada."),
  q("kebugaran-jasmani", "Menurut anjuran WHO, anak dan remaja sebaiknya aktif fisik minimal ... per hari.", ["15 menit", "30 menit", "60 menit", "3 jam"], 2, "WHO menganjurkan minimal 60 menit aktivitas fisik sedang hingga berat per hari."),
  q("kebugaran-jasmani", "Latihan yang paling tepat untuk meningkatkan kelentukan adalah...", ["Lari cepat", "Peregangan (stretching)", "Push-up", "Sit-up"], 1, "Peregangan secara rutin meningkatkan kelentukan."),
  q("kebugaran-jasmani", "Tujuan utama pemanasan adalah...", ["Membuat lelah lebih dulu", "Menaikkan suhu tubuh dan mencegah cedera", "Menghabiskan waktu", "Mengurangi berat badan seketika"], 1, "Pemanasan menyiapkan otot dan sendi agar siap bekerja dan terhindar dari cedera."),
  q("kebugaran-jasmani", "Pendinginan dilakukan pada saat...", ["Sebelum latihan", "Setelah latihan inti", "Saat tidur", "Sebelum makan"], 1, "Pendinginan dilakukan setelah latihan inti agar tubuh kembali normal secara bertahap."),
  q("kebugaran-jasmani", "FITT dalam prinsip latihan adalah singkatan dari...", ["Fast, Intense, Tough, Training", "Frequency, Intensity, Time, Type", "Food, Ice, Tea, Time", "Fitness, Idea, Team, Talent"], 1, "FITT: Frequency, Intensity, Time, Type."),
  q("kebugaran-jasmani", "Kemampuan mengubah arah tubuh dengan cepat dan tepat disebut...", ["Kekuatan", "Daya tahan", "Kelincahan", "Kelentukan"], 2, "Itulah kelincahan, diukur misalnya dengan shuttle run."),

  /* ===== Kesehatan dan Pola Hidup Sehat ===== */
  q("kesehatan", "Mencuci tangan dengan sabun sebaiknya dilakukan minimal selama sekitar...", ["1 detik", "5 detik", "20 detik", "5 menit"], 2, "Cuci tangan dengan sabun dianjurkan sekitar 20 detik agar kuman terangkat."),
  q("kesehatan", "Makanan yang menjadi sumber karbohidrat adalah...", ["Nasi", "Ikan", "Bayam", "Susu"], 0, "Nasi, roti, jagung, dan singkong adalah sumber karbohidrat."),
  q("kesehatan", "Remaja dianjurkan tidur sekitar ... setiap malam.", ["4 sampai 5 jam", "8 sampai 10 jam", "12 sampai 14 jam", "2 sampai 3 jam"], 1, "Remaja membutuhkan sekitar 8 sampai 10 jam tidur per malam."),
  q("kesehatan", "Zat berbahaya pada rokok yang merusak paru-paru adalah...", ["Vitamin C", "Kalsium", "Nikotin dan tar", "Serat"], 2, "Nikotin dan tar berbahaya bagi paru-paru dan membuat kecanduan."),
  q("kesehatan", "Makanan sumber protein hewani adalah...", ["Telur", "Singkong", "Kangkung", "Nasi"], 0, "Telur, ikan, daging, dan susu termasuk protein hewani."),
  q("kesehatan", "Menurut WHO, sehat adalah keadaan...", ["Tidak sakit saja", "Sejahtera fisik, mental, dan sosial", "Kuat mengangkat beban", "Tidak pernah ke dokter"], 1, "Sehat berarti sejahtera fisik, mental, dan sosial, bukan sekadar bebas penyakit."),
  q("kesehatan", "Manfaat utama sarapan pagi adalah...", ["Membuat mengantuk", "Memberi energi dan membantu konsentrasi", "Menghemat uang saku", "Mengurangi tinggi badan"], 1, "Sarapan memberi tenaga dan membantu konsentrasi belajar."),
  q("kesehatan", "Penyakit yang mudah menular melalui tangan yang kotor adalah...", ["Patah tulang", "Rabun jauh", "Diare", "Alergi debu"], 2, "Diare sering menular karena tangan atau makanan yang tidak bersih."),
  q("kesehatan", "Contoh pola hidup sehat adalah...", ["Begadang setiap malam", "Rutin berolahraga dan makan seimbang", "Jajan makanan cepat saji setiap hari", "Jarang minum air putih"], 1, "Olahraga rutin dan gizi seimbang adalah dasar pola hidup sehat."),
  q("kesehatan", "Zat gizi yang berfungsi sebagai sumber tenaga utama adalah...", ["Vitamin", "Mineral", "Karbohidrat", "Serat"], 2, "Karbohidrat adalah sumber tenaga utama bagi tubuh."),
];
