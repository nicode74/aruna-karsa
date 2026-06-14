export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  author: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "panduan-menghitung-rab-rumah-minimalis",
    title: "Panduan Menghitung RAB Rumah Minimalis Tanpa Ribet",
    category: "Tips Budget",
    date: "12 Juni 2026",
    readTime: "5 Menit Baca",
    excerpt: "Pelajari cara menyusun rencana anggaran biaya (RAB) bangunan secara transparan agar terhindar dari pembengkakan biaya tak terduga.",
    image: "/images/architectural_blueprint.png",
    author: "Ir. Hermawan",
    content: `
      <p>Membangun rumah impian adalah salah satu pencapaian terbesar dalam hidup. Namun, salah satu momok terbesar yang sering dihadapi pemilik rumah adalah pembengkakan biaya di tengah jalannya proyek konstruksi. Oleh karena itu, penyusunan Rencana Anggaran Biaya (RAB) secara transparan, matang, dan akurat sangatlah krusial.</p>
      
      <h3>Apa Itu RAB?</h3>
      <p>RAB adalah rincian estimasi biaya finansial yang diperlukan untuk merealisasikan pembangunan fisik rumah, mulai dari tahapan persiapan lahan, pembelian material konstruksi, pembayaran upah tenaga kerja (tukang), hingga pekerjaan finishing dan utilitas (listrik/pipa air).</p>
      
      <h3>Langkah Menyusun RAB Transparan & Akurat</h3>
      <ol>
        <li><strong>Siapkan Gambar Kerja Lengkap (DED):</strong> RAB tidak bisa dibuat secara akurat tanpa adanya Detail Engineering Design (DED). Gambar arsitektur, denah struktur, dan utilitas listrik/pipa menjadi dasar perhitungan volume pekerjaan.</li>
        <li><strong>Hitung Volume Tiap Pekerjaan:</strong> Hitung volume per item pengerjaan (misal: galian tanah dalam m³, pondasi batu kali dalam m³, pengecatan dinding dalam m²).</li>
        <li><strong>Tentukan Harga Satuan Pekerjaan:</strong> Cari tahu harga material di toko bangunan terdekat dan tarif upah tenaga kerja harian atau borongan yang berlaku di wilayah Anda.</li>
        <li><strong>Kalikan Volume dengan Harga Satuan:</strong> Kalikan setiap elemen volume dengan harga satuan untuk mendapatkan total biaya sub-pekerjaan, lalu kumpulkan dalam satu lembar rekapitulasi.</li>
      </ol>
      
      <blockquote>
        "Prinsip utama Aruna Karsa adalah keterbukaan. Kami selalu menyusun RAB secara mendetail per item pekerjaan dan mendiskusikan alternatif material untuk menyelaraskan budget tanpa mengurangi kekuatan struktural."
      </blockquote>

      <h3>Kesimpulan</h3>
      <p>Dengan RAB yang disusun secara transparan dan detail, Anda dapat mengontrol pengeluaran proyek secara presisi, menghindari sengketa dengan kontraktor di kemudian hari, dan memastikan hunian Anda selesai sesuai rencana awal.</p>
    `
  },
  {
    slug: "kelebihan-beton-k300-struktur-rumah",
    title: "Mengapa Beton K-300 Sangat Penting untuk Struktur Rumah 2 Lantai?",
    category: "Konstruksi",
    date: "05 Juni 2026",
    readTime: "4 Menit Baca",
    excerpt: "Ketahanan struktur bangunan jangka panjang ditentukan oleh spesifikasi beton. Simak penjelasannya mengapa beton K-300 direkomendasikan.",
    image: "/images/construction_site.png",
    author: "Supriyanto, S.T.",
    content: `
      <p>Saat merencanakan pembangunan rumah tinggal bertingkat (2 lantai atau lebih), kekuatan struktur pondasi, kolom (tiang), dan balok beton pembagi beban lantai atas menjadi aspek keselamatan nomor satu yang tidak boleh ditawar.</p>
      
      <h3>Apa Arti Kode "K-300"?</h3>
      <p>Kode "K" (Karakteristik) merujuk pada standar pengujian kekuatan tekan beton di Indonesia. Angka "300" berarti beton tersebut mampu menahan beban tekanan minimal sebesar 300 kilogram per sentimeter persegi (kg/cm²) setelah berumur 28 hari pengeringan sempurna.</p>
      
      <h3>Mengapa Rumah 2 Lantai Direkomendasikan Menggunakan K-300?</h3>
      <ul>
        <li><strong>Daya Dukung Beban Vertikal:</strong> Lantai dua membawa beban tambahan berupa struktur pelat lantai beton, dinding bata lantai dua, mebel, dan aktivitas penghuni. Struktur kolom beton K-300 memastikan tiang penyangga tidak mengalami retak pecah akibat beban berat.</li>
        <li><strong>Ketahanan Gempa:</strong> Indonesia terletak di jalur Ring of Fire. Struktur bangunan beton bertulang dengan kuat tekan K-300 memiliki elastisitas dan ketahanan yang lebih baik dalam meredam guncangan gempa dibanding beton racikan manual biasa (K-175 / K-225).</li>
        <li><strong>Mencegah Lendutan Balok (Deflection):</strong> Balok beton bentang panjang yang menopang lantai dua rawan melendut jika kuat tekannya kurang. Penggunaan material ready-mix standar K-300 mencegah lendutan ini secara aman.</li>
      </ul>

      <blockquote>
        "Keamanan hukum dan keselamatan penghuni adalah misi utama Aruna Karsa. Setiap konstruksi bertingkat yang kami bangun wajib menggunakan minimum beton ready-mix K-300 tersertifikasi laboratorium uji mutu beton."
      </blockquote>

      <p>Selalu konsultasikan rencana struktur beton Anda dengan insinyur sipil berpengalaman sebelum memulai pengecoran pelat lantai atas rumah Anda.</p>
    `
  },
  {
    slug: "desain-modern-tropis-hemat-energi",
    title: "Trik Mendesain Rumah Modern Tropis yang Hemat Energi",
    category: "Arsitektur",
    date: "28 Mei 2026",
    readTime: "6 Menit Baca",
    excerpt: "Mulai dari penataan ventilasi silang hingga pencahayaan alami, ciptakan hunian tropis yang sejuk dan hemat tagihan listrik.",
    image: "/images/modern_villa.png",
    author: "Amelia Putri, Ar.",
    content: `
      <p>Iklim tropis dengan kelembapan tinggi dan paparan sinar matahari sepanjang tahun menuntut pendekatan desain arsitektur yang cermat. Arsitektur modern tropis hadir menjawab tantangan ini dengan menggabungkan garis-garis estetika modern yang bersih dengan adaptasi lingkungan lokal yang cerdas.</p>
      
      <h3>Prinsip Utama Desain Tropis Hemat Energi</h3>
      <ol>
        <li><strong>Cross Ventilation (Ventilasi Silang):</strong> Letakkan bukaan jendela atau kisi-kisi angin saling berhadapan atau secara diagonal. Ini memicu aliran angin alami dari area bertekanan tinggi ke rendah, menjaga suhu ruangan tetap sejuk tanpa AC 24 jam.</li>
        <li><strong>Overhang (Teritisan Atap Lebar):</strong> Buat atap atau kanopi pelindung jendela yang menjorok keluar cukup lebar. Ini memblokir sinar matahari terik langsung masuk ke dalam ruangan (yang membuat gerah), tetapi tetap membiarkan cahaya pantulan menerangi interior.</li>
        <li><strong>Skylight & Double-Height Ceiling:</strong> Plafon yang tinggi dipadukan dengan skylight di tangga atau void tengah akan mempermudah udara panas naik ke atas dan dibuang keluar, sekaligus menyebarkan cahaya matahari alami secara merata.</li>
        <li><strong>Pemilihan Warna & Material Berdaya Serap Rendah:</strong> Dinding luar berwarna terang/putih memantulkan kembali panas matahari. Penambahan cladding kayu atau vegetasi tanaman rambat di dinding barat/timur berfungsi meredam radiasi termal langsung.</li>
      </ol>

      <blockquote>
        "Desain di Aruna Karsa mengedepankan keselarasan alam. Estetika modern bukan berarti mengorbankan kenyamanan udara. Rumah tropis harus 'bernapas' secara alami agar sehat bagi penghuni dan ramah bagi lingkungan."
      </blockquote>

      <p>Mengaplikasikan prinsip modern tropis sejak tahap sketsa desain awal akan meminimalkan penggunaan lampu dan penyejuk udara (AC), menghemat biaya listrik jangka panjang secara signifikan.</p>
    `
  }
];
