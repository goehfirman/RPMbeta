import { Subject } from "../types";

// Helper to categorize text by phase
export const CP_REF: Partial<Record<Subject, { FaseA: string; FaseB: string; FaseC: string }>> = {
  [Subject.Pancasila]: {
    FaseA: `
      - Pancasila: Mengenal bendera negara, lagu kebangsaan, simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila; menerapkan nilai-nilai Pancasila di lingkungan keluarga.
      - UUD 1945: Mengenal aturan di lingkungan keluarga; menceritakan sikap mematuhi aturan di lingkungan keluarga.
      - Bhinneka Tunggal Ika: Mengenal semboyan Bhinneka Tunggal Ika; mengidentifikasi dan menghargai identitas dirinya sesuai jenis kelamin, hobi, bahasa, agama.
      - NKRI: Mengenal karakteristik lingkungan tempat tinggal dan sekolah sebagai bagian wilayah NKRI; menceritakan perilaku bekerja sama menjaga lingkungan.
    `,
    FaseB: `
      - Pancasila: Mengidentifikasi makna sila-sila Pancasila dan penerapannya sehari-hari; mengenal karakter perumus Pancasila; bangga menjadi anak Indonesia.
      - UUD 1945: Mengidentifikasi dan melaksanakan aturan di sekolah dan lingkungan tempat tinggal; mengidentifikasi hak dan kewajiban sebagai anggota keluarga dan warga sekolah.
      - Bhinneka Tunggal Ika: Membedakan dan menghargai identitas teman, keluarga, suku bangsa, bahasa, agama di lingkungan sekitar.
      - NKRI: Mengidentifikasi lingkungan tempat tinggal (RT, RW, Desa) sebagai bagian NKRI; menunjukkan perilaku kerja sama dalam keberagaman.
    `,
    FaseC: `
      - Pancasila: Memahami kronologi sejarah kelahiran Pancasila; meneladani sikap perumus Pancasila; menghubungkan sila-sila sebagai satu kesatuan utuh; menguraikan makna nilai Pancasila sebagai dasar negara.
      - UUD 1945: Mengimplementasikan norma, hak, dan kewajiban sebagai warga negara; mengenal Pembukaan UUD 1945; mempraktikkan musyawarah.
      - Bhinneka Tunggal Ika: Menyajikan hasil identifikasi sikap menghormati, menjaga, dan melestarikan keberagaman budaya.
      - NKRI: Mengenal wilayah kabupaten/kota dan provinsi sebagai bagian NKRI; gotong royong menjaga persatuan (Bela Negara).
    `
  },
  [Subject.BahasaIndonesia]: {
    FaseA: `
      - Menyimak: Memahami informasi dari teks aural (teks yang dibacakan) tentang diri dan lingkungan.
      - Membaca & Memirsa: Membaca kata-kata sederhana dengan fasih; memahami isi bacaan sederhana tentang diri dan lingkungan.
      - Berbicara & Presentasi: Merespons dengan bertanya, menjawab, menanggapi komentar orang lain; mengungkapkan perasaan secara lisan.
      - Menulis: Menulis permulaan dengan benar; mengembangkan tulisan tangan; menulis teks sederhana tentang diri/keluarga.
    `,
    FaseB: `
      - Menyimak: Memahami ide pokok informasi dari teks lisan/aural.
      - Membaca & Memirsa: Membaca kata baru dengan fasih; memahami ide pokok dan pendukung dalam teks sastra/nonsastra.
      - Berbicara & Presentasi: Menyajikan pendapat dengan pilihan kata yang sesuai; menanggapi diskusi; menceritakan kembali isi informasi.
      - Menulis: Menulis berbagai teks sederhana dengan rangkaian kalimat beragam; menggunakan kaidah kebahasaan dan kosakata baru (denotatif).
    `,
    FaseC: `
      - Menyimak: Menganalisis informasi dari teks lisan/aural dan menganalisis isi teks sastra.
      - Membaca & Memirsa: Membaca dengan berbagai pola intonasi; menganalisis informasi dan nilai dalam teks sastra/nonsastra (visual/audiovisual).
      - Berbicara & Presentasi: Mempresentasikan gagasan dengan efektif dan santun; menyampaikan perasaan berdasarkan fakta/imajinasi secara indah (sastra).
      - Menulis: Menulis berbagai tipe teks berdasarkan gagasan/imajinasi dengan kalimat kompleks, kreatif, dan menggunakan kosakata denotatif/konotatif.
    `
  },
  [Subject.Matematika]: {
    FaseA: `
      - Bilangan: Memahami bilangan cacah sampai 100; nilai tempat, membandingkan, mengurutkan; penjumlahan/pengurangan sampai 20; mengenal pecahan setengah dan seperempat.
      - Aljabar: Mengenal makna simbol "="; mengenali pola bukan bilangan (gambar, warna).
      - Pengukuran: Membandingkan panjang/berat secara langsung; mengukur dengan satuan tidak baku.
      - Geometri: Mengenal berbagai bangun datar (segitiga, segiempat, lingkaran) dan bangun ruang (balok, kubus, kerucut, bola); posisi benda.
      - Data: Mengurutkan, menyortir, mengelompokkan data (turus/piktogram).
    `,
    FaseB: `
      - Bilangan: Bilangan cacah sampai 10.000; operasi hitung penjumlahan/pengurangan sampai 1.000; perkalian/pembagian sampai 100; pecahan senilai; desimal persepuluhan.
      - Aljabar: Menemukan nilai belum diketahui dalam kalimat matematika; pola gambar/bilangan membesar dan mengecil.
      - Pengukuran: Mengukur panjang/berat dengan satuan baku (cm, m, g, kg); luas dan volume dengan satuan tidak baku.
      - Geometri: Mendeskripsikan ciri bangun datar; menyusun dan mengurai bangun datar.
      - Data: Menyajikan data dalam tabel, diagram gambar, batang.
    `,
    FaseC: `
      - Bilangan: Bilangan cacah sampai 1.000.000; KPK dan FPB; operasi hitung pecahan (campuran, desimal, persen).
      - Aljabar: Menemukan nilai belum diketahui (operasi campuran); bernalar proporsional (rasio).
      - Pengukuran: Keliling dan luas bangun datar; sudut; durasi waktu.
      - Geometri: Mengkonstruksi dan mengurai bangun ruang (kubus, balok); visualisasi spasial; lokasi pada peta sistem berpetak.
      - Data: Analisis data, mean, median, modus; kemungkinan kejadian (peluang) dalam percobaan acak.
    `
  },
  [Subject.IPAS]: {
    FaseA: "Belum diajarkan di Fase A (Kelas 1-2 fokus pada pengenalan lingkungan umum integrasi Bahasa/PPKN).",
    FaseB: `
      - Makhluk Hidup: Bentuk dan fungsi pancaindra; siklus hidup; upaya pelestarian.
      - Zat & Energi: Perubahan wujud zat; sumber dan bentuk energi; perubahan energi.
      - Gaya & Gerak: Jenis gaya dan pengaruhnya.
      - Lingkungan & Sosial: Interaksi sosial sekitar; letak kabupaten/provinsi; bentang alam; keragaman budaya; sejarah lokal; nilai mata uang.
    `,
    FaseC: `
      - Tubuh Manusia: Sistem organ tubuh (pernapasan, pencernaan, peredaran darah) dan cara menjaga kesehatan.
      - Ekosistem: Hubungan biotik dan abiotik.
      - Gelombang: Bunyi dan cahaya.
      - Energi: Penghematan dan energi alternatif; mitigasi perubahan iklim.
      - Tata Surya: Sistem tata surya; rotasi dan revolusi bumi.
      - Geografi & Sejarah: Letak geografis Indonesia; perjuangan pahlawan; keragaman budaya nasional; kegiatan ekonomi.
    `
  },
  [Subject.PJOK]: {
    FaseA: `
      - Terampil Bergerak: Mempraktikkan keterampilan gerak fundamental; mengeksplorasi strategi gerak sederhana.
      - Belajar melalui Gerak: Menaati peraturan; fair play; berpartisipasi dalam aktivitas jasmani.
      - Gaya Hidup Aktif: Berpartisipasi dalam aktivitas jasmani dan mengenal manfaatnya.
      - Kesehatan: Mengenali gaya hidup aktif dan sehat; menjaga kebersihan diri.
    `,
    FaseB: `
      - Terampil Bergerak: Menghaluskan keterampilan gerak fundamental dalam situasi gerak baru; konsep gerak.
      - Belajar melalui Gerak: Menerapkan strategi gerak sederhana; memecahkan masalah gerak; kerja sama tim.
      - Gaya Hidup Aktif: Mengenali faktor yang menyebabkan aktivitas jasmani menyenangkan.
      - Kesehatan: Mengenali risiko kesehatan akibat gaya hidup; pola makan sehat; pertolongan pertama cedera ringan.
    `,
    FaseC: `
      - Terampil Bergerak: Menyesuaikan keterampilan gerak melintasi berbagai situasi; mentransfer strategi gerak.
      - Belajar melalui Gerak: Merancang peraturan alternatif; modifikasi permainan; fair play dan inklusif.
      - Gaya Hidup Aktif: Merancang aktivitas jasmani teratur; pencegahan perilaku sedenter.
      - Kesehatan: Menghubungkan gaya hidup dengan risiko kesehatan; kebersihan dan kesehatan alat reproduksi; penanganan cedera sedang.
    `
  }
};