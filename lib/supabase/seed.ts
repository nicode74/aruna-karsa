import { SupabaseClient } from "@supabase/supabase-js";

export async function seedDatabase(supabase: SupabaseClient) {
  try {
    // 1. Seed site_config
    const { data: existingConfig, error: configCheckError } = await supabase
      .from("site_config")
      .select("id")
      .limit(1);

    if (configCheckError) {
      console.error("Error checking site_config:", configCheckError);
      return { success: false, error: configCheckError.message };
    }

    if (existingConfig.length === 0) {
      const { error: seedConfigError } = await supabase
        .from("site_config")
        .insert({
          site_name: "Aruna Karsa",
          logo_url: "/logo/logo-horizontal.png",
          contact_email: "info@arunakarsa.co.id",
          contact_phone: "+62 812-3456-789",
          contact_address: "Jl. Raya Sunrise No. 45, Kebayoran Baru, Jakarta Selatan, 12130",
          social_links: {
            instagram: "https://instagram.com",
            facebook: "https://facebook.com",
            whatsapp: "https://wa.me/628123456789"
          },
          footer_text: "Aruna Karsa adalah tekad untuk menghadirkan awal yang baru dalam setiap ruang yang dibangun, menjadikannya bukan sekadar bangunan, tetapi rumah bagi harapan dan kehidupan."
        });

      if (seedConfigError) {
        console.error("Error seeding site_config:", seedConfigError);
        return { success: false, error: seedConfigError.message };
      }
      console.log("Seeded site_config successfully.");
    }

    // 2. Seed pages
    const { data: existingPages, error: pagesCheckError } = await supabase
      .from("pages")
      .select("id");

    if (pagesCheckError) {
      console.error("Error checking pages:", pagesCheckError);
      return { success: false, error: pagesCheckError.message };
    }

    if (existingPages.length === 0) {
      const defaultPages = [
        {
          page_name: "home",
          title: "Beranda | Aruna Karsa",
          description: "Aruna Karsa adalah penyedia layanan desain arsitektur, perencanaan anggaran biaya (RAB) transparan, dan kontraktor konstruksi tepercaya.",
          sections: [
            { id: "navigation", enabled: true },
            { id: "hero", enabled: true, title: "Wujudkan Hunian Impian Anda Bersama Aruna Karsa", subtitle: "Penyedia layanan desain arsitektur, perencanaan anggaran biaya (RAB) transparan, dan kontraktor konstruksi tepercaya. Wujudkan hunian aman, estetis, dan bernilai sepanjang masa.", ctaText: "Hubungi Kami", ctaHref: "/contact", bgImage: "/images/modern_villa.png" },
            { id: "about", enabled: true, title: "TENTANG KAMI", subtitle: "Membangun Lebih dari Sekadar Struktur, Kami Mewujudkan Ruang Kehidupan", body: "Aruna Karsa lahir dari visi untuk menghadirkan layanan konstruksi dan arsitektur yang jujur, transparan, dan berstandar tinggi. Kami percaya bahwa setiap bangunan memiliki cerita..." },
            { id: "services", enabled: true, title: "LAYANAN KAMI", subtitle: "Solusi Konstruksi & Arsitektur Terintegrasi" },
            { id: "portfolio", enabled: true, title: "PORTOFOLIO", subtitle: "Karya Konstruksi & Keindahan Arsitektur Kami" },
            { id: "contact", enabled: true },
            { id: "footer", enabled: true }
          ]
        },
        {
          page_name: "about",
          title: "Tentang Kami | Aruna Karsa",
          description: "Pelajari visi, misi, dan nilai-nilai fundamental Aruna Karsa dalam menghadirkan desain arsitektur berkualitas dan transparan.",
          sections: [
            { id: "navigation", enabled: true },
            { id: "hero", enabled: true, title: "Tentang Aruna Karsa", subtitle: "Membangun Dengan Hati, Kualitas Tanpa Kompromi", ctaText: "Hubungi Kami", ctaHref: "/contact", bgImage: "/images/architectural_blueprint.png" },
            { id: "about", enabled: true, title: "TENTANG KAMI", subtitle: "Membangun Lebih dari Sekadar Struktur, Kami Mewujudkan Ruang Kehidupan" },
            { id: "services", enabled: true, title: "Layanan Pendukung", subtitle: "Layanan Utama Kami untuk Membantu Proyek Anda" },
            { id: "portfolio", enabled: true, title: "Proyek Pilihan", subtitle: "Beberapa Hasil Kerja Kami" },
            { id: "contact", enabled: true },
            { id: "footer", enabled: true }
          ]
        },
        {
          page_name: "services",
          title: "Layanan Kami | Aruna Karsa",
          description: "Layanan desain arsitektur, kontraktor bangunan, desain interior, dan perhitungan RAB transparan.",
          sections: [
            { id: "navigation", enabled: true },
            { id: "hero", enabled: true, title: "Layanan Terintegrasi", subtitle: "Dari Perencanaan Hingga Serah Terima Kunci", ctaText: "Konsultasi Gratis", ctaHref: "/contact", bgImage: "/images/construction_site.png" },
            { id: "services", enabled: true, title: "LAYANAN KAMI", subtitle: "Solusi Konstruksi & Arsitektur Terintegrasi" },
            { id: "portfolio", enabled: true, title: "Hasil Konstruksi", subtitle: "Bagaimana Layanan Kami Diwujudkan dalam Proyek Nyata" },
            { id: "contact", enabled: true },
            { id: "footer", enabled: true }
          ]
        },
        {
          page_name: "portfolio",
          title: "Portofolio | Aruna Karsa",
          description: "Portofolio proyek konstruksi, villa modern-tropis, kantor komersil, dan interior hunian mewah Aruna Karsa.",
          sections: [
            { id: "navigation", enabled: true },
            { id: "hero", enabled: true, title: "Portofolio Karya", subtitle: "Bukti Dedikasi Kami Terhadap Kualitas Konstruksi dan Estetika", ctaText: "Lihat Semua Proyek", ctaHref: "#projects", bgImage: "/images/modern_villa.png" },
            { id: "portfolio", enabled: true, title: "PORTOFOLIO", subtitle: "Karya Konstruksi & Keindahan Arsitektur Kami" },
            { id: "contact", enabled: true },
            { id: "footer", enabled: true }
          ]
        },
        {
          page_name: "contact",
          title: "Hubungi Kami | Aruna Karsa",
          description: "Hubungi tim arsitek dan kontraktor profesional Aruna Karsa untuk mewujudkan bangunan impian Anda.",
          sections: [
            { id: "navigation", enabled: true },
            { id: "hero", enabled: true, title: "Hubungi Kami", subtitle: "Mari Diskusikan Proyek Bangun Baru, Renovasi, atau Desain Impian Anda", ctaText: "Kontak Langsung", ctaHref: "#contact-details", bgImage: "/images/construction_site.png" },
            { id: "contact", enabled: true },
            { id: "footer", enabled: true }
          ]
        },
        {
          page_name: "blog",
          title: "Blog & Tips Bangunan | Aruna Karsa",
          description: "Kumpulan artikel seputar tips bangunan, desain rumah minimalis modern, konstruksi sipil, dan RAB transparan.",
          sections: [
            { id: "navigation", enabled: true },
            { id: "hero", enabled: true, title: "Blog & Wawasan Karsa", subtitle: "Kumpulan Tips Arsitektur, Konstruksi, dan Anggaran Biaya Rumah", ctaText: "Baca Artikel", ctaHref: "#blog-list", bgImage: "/images/architectural_blueprint.png" },
            { id: "blog", enabled: true, title: "ARTIKEL TERBARU", subtitle: "Wawasan & Tips Konstruksi Praktis" },
            { id: "contact", enabled: true },
            { id: "footer", enabled: true }
          ]
        }
      ];

      const { error: seedPagesError } = await supabase
        .from("pages")
        .insert(defaultPages);

      if (seedPagesError) {
        console.error("Error seeding pages:", seedPagesError);
        return { success: false, error: seedPagesError.message };
      }
      console.log("Seeded pages successfully.");
    }

    // 3. Seed services
    const { data: existingServices, error: servicesCheckError } = await supabase
      .from("services")
      .select("id");

    if (servicesCheckError) {
      console.error("Error checking services:", servicesCheckError);
      return { success: false, error: servicesCheckError.message };
    }

    if (existingServices.length === 0) {
      const defaultServices = [
        {
          title: "Desain Arsitektur",
          description: "Layanan perancangan konsep bangunan mulai dari denah, visualisasi 3D photorealistic, hingga gambar kerja teknis (DED) dengan detail presisi.",
          icon_name: "PenTool",
          features: ["Konsep 3D Render & Denah", "Gambar Detail Teknis (DED)", "Perizinan Bangunan Gedung (PBG)"],
          display_order: 1
        },
        {
          title: "Bangun & Kontraktor",
          description: "Pembangunan rumah tinggal, ruko, atau kantor secara menyeluruh dari struktur pondasi, pengerjaan arsitektural, hingga finishing dengan garansi kekuatan.",
          icon_name: "HardHat",
          features: ["Pengawasan Proyek Ketat", "Garansi Konstruksi Pemeliharaan", "Tenaga Ahli Bersertifikat"],
          display_order: 2
        },
        {
          title: "Desain Interior",
          description: "Transformasi estetika dalam ruang dengan perancangan layout, pemilihan skema warna, tata cahaya, serta custom pembuatan furnitur/cabinetry.",
          icon_name: "Sofa",
          features: ["Desain Kitchen Set & Wardrobe", "Pencahayaan & Aksesori Estetis", "Optimalisasi Tata Ruang"],
          display_order: 3
        },
        {
          title: "Penyusunan RAB Transparan",
          description: "Konsultasi perhitungan anggaran pembangunan secara rinci dan terbuka. Memastikan efisiensi biaya material tanpa mengorbankan kualitas struktur.",
          icon_name: "FileSpreadsheet",
          features: ["Rincian Material & Upah Kerja", "Alternatif Spek Sesuai Budget", "Akurat & Dapat Dipertanggungjawabkan"],
          display_order: 4
        }
      ];

      const { error: seedServicesError } = await supabase
        .from("services")
        .insert(defaultServices);

      if (seedServicesError) {
        console.error("Error seeding services:", seedServicesError);
        return { success: false, error: seedServicesError.message };
      }
      console.log("Seeded services successfully.");
    }

    // 4. Seed portfolio
    const { data: existingPortfolio, error: portfolioCheckError } = await supabase
      .from("portfolio")
      .select("id");

    if (portfolioCheckError) {
      console.error("Error checking portfolio:", portfolioCheckError);
      return { success: false, error: portfolioCheckError.message };
    }

    if (existingPortfolio.length === 0) {
      const defaultProjects = [
        {
          title: "Villa Kayu Aruna",
          category: "residential",
          category_label: "Residensial",
          location: "Jimbaran, Bali",
          year: "2025",
          area: "350 m²",
          status: "Selesai",
          image_url: "/images/modern_villa.png",
          description: "Desain dan pembangunan villa mewah bernuansa modern-tropis dengan struktur beton ekspos, kaca tempered lebar, dan cladding kayu jati daur ulang yang ramah lingkungan.",
          client: "Bpk. Adrian Wijaya",
          materials: ["Beton Struktur K-350", "Kayu Jati Grade A", "Kaca Low-E 8mm", "Smart Home System Integrations"]
        },
        {
          title: "Ruang Karsa Co-Working",
          category: "commercial",
          category_label: "Komersial",
          location: "SCBD, Jakarta",
          year: "2026",
          area: "680 m²",
          status: "Selesai",
          image_url: "/images/luxury_interior.png",
          description: "Pengerjaan interior luxury office untuk co-working space eksklusif. Menyeimbangkan tata akustik ruang, kehangatan material kayu, pencahayaan indirect LED, dan zonasi fungsional.",
          client: "PT Karsa Ruang Bersama",
          materials: ["Acoustic Panel Board", "Finishing HPL Premium", "Direct & Indirect LED warm white", "Ergonomic Furniture Set"]
        },
        {
          title: "Cluster Bintang Lestari",
          category: "residential",
          category_label: "Residensial",
          location: "BSD City, Tangerang",
          year: "2026",
          area: "240 m² (Per Unit)",
          status: "Pembangunan",
          image_url: "/images/construction_site.png",
          description: "Proyek pembangunan cluster perumahan modern minimalis 2 lantai dengan pengerjaan struktur baja WF yang kuat, beton ready-mix tersertifikasi, dan pengawasan terstruktur harian.",
          client: "PT Lestari Indah Sentosa",
          materials: ["Baja Struktur WF 250", "Beton Ready-mix K-300", "Bata Ringan Hebel", "Rangka Atap Baja Ringan"]
        }
      ];

      const { error: seedPortfolioError } = await supabase
        .from("portfolio")
        .insert(defaultProjects);

      if (seedPortfolioError) {
        console.error("Error seeding portfolio:", seedPortfolioError);
        return { success: false, error: seedPortfolioError.message };
      }
      console.log("Seeded portfolio successfully.");
    }

    // 5. Seed blog_posts
    const { data: existingBlog, error: blogCheckError } = await supabase
      .from("blog_posts")
      .select("id");

    if (blogCheckError) {
      console.error("Error checking blog_posts:", blogCheckError);
      return { success: false, error: blogCheckError.message };
    }

    if (existingBlog.length === 0) {
      const defaultBlogPosts = [
        {
          slug: "panduan-menghitung-rab-rumah-minimalis",
          title: "Panduan Menghitung RAB Rumah Minimalis Tanpa Ribet",
          category: "Tips Budget",
          date: "12 Juni 2026",
          read_time: "5 Menit Baca",
          excerpt: "Pelajari cara menyusun rencana anggaran biaya (RAB) bangunan secara transparan agar terhindar dari pembengkakan biaya tak terduga.",
          image_url: "/images/architectural_blueprint.png",
          author: "Ir. Hermawan",
          is_published: true,
          content: `<p>Membangun rumah impian adalah salah satu pencapaian terbesar dalam hidup. Namun, salah satu momok terbesar yang sering dihadapi pemilik rumah adalah pembengkakan biaya di tengah jalannya proyek konstruksi. Oleh karena itu, penyusunan Rencana Anggaran Biaya (RAB) secara transparan, matang, dan akurat sangatlah krusial.</p><h3>Apa Itu RAB?</h3><p>RAB adalah rincian estimasi biaya finansial yang diperlukan untuk merealisasikan pembangunan fisik rumah, mulai dari tahapan persiapan lahan, pembelian material konstruksi, pembayaran upah tenaga kerja (tukang), hingga pekerjaan finishing dan utilitas (listrik/pipa air).</p><h3>Langkah Menyusun RAB Transparan & Akurat</h3><ol><li><strong>Siapkan Gambar Kerja Lengkap (DED):</strong> RAB tidak bisa dibuat secara akurat tanpa adanya Detail Engineering Design (DED). Gambar arsitektur, denah struktur, dan utilitas listrik/pipa menjadi dasar perhitungan volume pekerjaan.</li><li><strong>Hitung Volume Tiap Pekerjaan:</strong> Hitung volume per item pengerjaan (misal: galian tanah dalam m³, pondasi batu kali dalam m³, pengecatan dinding dalam m²).</li><li><strong>Tentukan Harga Satuan Pekerjaan:</strong> Cari tahu harga material di toko bangunan terdekat dan tarif upah tenaga kerja harian atau borongan yang berlaku di wilayah Anda.</li><li><strong>Kalikan Volume dengan Harga Satuan:</strong> Kalikan setiap elemen volume dengan harga satuan untuk mendapatkan total biaya sub-pekerjaan, lalu kumpulkan dalam satu lembar rekapitulasi.</li></ol><blockquote>"Prinsip utama Aruna Karsa adalah keterbukaan. Kami selalu menyusun RAB secara mendetail per item pekerjaan dan mendiskusikan alternatif material untuk menyelaraskan budget tanpa mengurangi kekuatan struktural."</blockquote><h3>Kesimpulan</h3><p>Dengan RAB yang disusun secara transparan dan detail, Anda dapat mengontrol pengeluaran proyek secara presisi, menghindari sengketa dengan kontraktor di kemudian hari, dan memastikan hunian Anda selesai sesuai rencana awal.</p>`
        },
        {
          slug: "kelebihan-beton-k300-struktur-rumah",
          title: "Mengapa Beton K-300 Sangat Penting untuk Struktur Rumah 2 Lantai?",
          category: "Konstruksi",
          date: "05 Juni 2026",
          read_time: "4 Menit Baca",
          excerpt: "Ketahanan struktur bangunan jangka panjang ditentukan oleh spesifikasi beton. Simak penjelasannya mengapa beton K-300 direkomendasikan.",
          image_url: "/images/construction_site.png",
          author: "Supriyanto, S.T.",
          is_published: true,
          content: `<p>Saat merencanakan pembangunan rumah tinggal bertingkat (2 lantai atau lebih), kekuatan struktur pondasi, kolom (tiang), dan balok beton pembagi beban lantai atas menjadi aspek keselamatan nomor satu yang tidak boleh ditawar.</p><h3>Apa Arti Kode "K-300"?</h3><p>Kode "K" (Karakteristik) merujuk pada standar pengujian kekuatan tekan beton di Indonesia. Angka "300" berarti beton tersebut mampu menahan beban tekanan minimal sebesar 300 kilogram per sentimeter persegi (kg/cm²) setelah berumur 28 hari pengeringan sempurna.</p><h3>Mengapa Rumah 2 Lantai Direkomendasikan Menggunakan K-300?</h3><ul><li><strong>Daya Dukung Beban Vertikal:</strong> Lantai dua membawa beban tambahan berupa struktur pelat lantai beton, dinding bata lantai dua, mebel, dan aktivitas penghuni. Struktur kolom beton K-300 memastikan tiang penyangga tidak mengalami retak pecah akibat beban berat.</li><li><strong>Ketahanan Gempa:</strong> Indonesia terletak di jalur Ring of Fire. Struktur bangunan beton bertulang dengan kuat tekan K-300 memiliki elastisitas dan ketahanan yang lebih baik dalam meredam guncangan gempa dibanding beton racikan manual biasa (K-175 / K-225).</li><li><strong>Mencegah Lendutan Balok (Deflection):</strong> Balok beton bentang panjang yang menopang lantai dua rawan melendut jika kuat tekannya kurang. Penggunaan material ready-mix standar K-300 mencegah lendutan ini secara aman.</li></ul><blockquote>"Keamanan hukum & keselamatan penghuni adalah misi utama Aruna Karsa. Setiap konstruksi bertingkat yang kami bangun wajib menggunakan minimum beton ready-mix K-300 tersertifikasi laboratorium uji mutu beton."</blockquote><p>Selalu konsultasikan rencana struktur beton Anda dengan insinyur sipil berpengalaman sebelum memulai pengecoran pelat lantai atas rumah Anda.</p>`
        },
        {
          slug: "desain-modern-tropis-hemat-energi",
          title: "Trik Mendesain Rumah Modern Tropis yang Hemat Energi",
          category: "Arsitektur",
          date: "28 Mei 2026",
          read_time: "6 Menit Baca",
          excerpt: "Mulai dari penataan ventilasi silang hingga pencahayaan alami, ciptakan hunian tropis yang sejuk dan hemat tagihan listrik.",
          image_url: "/images/modern_villa.png",
          author: "Amelia Putri, Ar.",
          is_published: true,
          content: `<p>Iklim tropis dengan kelembapan tinggi dan paparan sinar matahari sepanjang tahun menuntut pendekatan desain arsitektur yang cermat. Arsitektur modern tropis hadir menjawab tantangan ini dengan menggabungkan garis-garis estetika modern yang bersih dengan adaptasi lingkungan lokal yang cerdas.</p><h3>Prinsip Utama Desain Tropis Hemat Energi</h3><ol><li><strong>Cross Ventilation (Ventilasi Silang):</strong> Letakkan bukaan jendela atau kisi-kisi angin saling berhadapan atau secara diagonal. Ini memicu aliran angin alami dari area bertekanan tinggi ke rendah, menjaga suhu ruangan tetap sejuk tanpa AC 24 jam.</li><li><strong>Overhang (Teritisan Atap Lebar):</strong> Buat atap atau kanopi pelindung jendela yang menjorok keluar cukup lebar. Ini memblokir sinar matahari terik langsung masuk ke dalam ruangan (yang membuat gerah), tetapi tetap membiarkan cahaya pantulan menerangi interior.</li><li><strong>Skylight & Double-Height Ceiling:</strong> Plafon yang tinggi dipadukan dengan skylight di tangga atau void tengah akan mempermudah udara panas naik ke atas dan dibuang keluar, sekaligus menyebarkan cahaya matahari alami secara merata.</li><li><strong>Pemilihan Warna & Material Berdaya Serap Rendah:</strong> Dinding luar berwarna terang/putih memantulkan kembali panas matahari. Penambahan cladding kayu atau vegetasi tanaman rambat di dinding barat/timur berfungsi meredam radiasi termal langsung.</li></ol><blockquote>"Desain di Aruna Karsa mengedepankan keselarasan alam. Estetika modern bukan berarti mengorbankan kenyamanan udara. Rumah tropis harus 'bernapas' secara alami agar sehat bagi penghuni dan ramah bagi lingkungan."</blockquote><p>Mengaplikasikan prinsip modern tropis sejak tahap sketsa desain awal akan meminimalkan penggunaan lampu dan penyejuk udara (AC), menghemat biaya listrik jangka panjang secara signifikan.</p>`
        }
      ];

      const { error: seedBlogError } = await supabase
        .from("blog_posts")
        .insert(defaultBlogPosts);

      if (seedBlogError) {
        console.error("Error seeding blog_posts:", seedBlogError);
        return { success: false, error: seedBlogError.message };
      }
      console.log("Seeded blog_posts successfully.");
    }

    return { success: true };
  } catch (err: any) {
    console.error("Database seeding exception:", err);
    return { success: false, error: err.message || err };
  }
}
