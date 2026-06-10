import { motion } from 'framer-motion';
import { siteConfig } from '../config/siteConfig';
import PageTransition from '../components/PageTransition';
import SectionHeader  from '../components/SectionHeader';

const VALUES = [
  { icon: '🕌', title: 'Islami',        desc: 'Seluruh kegiatan berlandaskan nilai-nilai Islam yang rahmatan lil alamin.' },
  { icon: '🤝', title: 'Amanah',        desc: 'Mengemban kepercayaan mahasiswa dengan penuh tanggung jawab dan kejujuran.' },
  { icon: '⚡', title: 'Profesional',   desc: 'Bekerja dengan standar tinggi, disiplin, dan berorientasi pada hasil nyata.' },
  { icon: '🌱', title: 'Inovatif',      desc: 'Terus bergerak maju dengan ide-ide segar untuk kemajuan mahasiswa.' },
  { icon: '🤲', title: 'Inklusif',      desc: 'Melayani seluruh mahasiswa tanpa membeda-bedakan latar belakang.' },
  { icon: '💪', title: 'Kolaboratif',   desc: 'Bersinergi dengan seluruh elemen kampus demi tujuan bersama.' },
];

const ACHIEVEMENTS = [
  { year: '2023', title: 'DEMA Terbaik Kopertais IV', desc: 'Penghargaan sebagai organisasi mahasiswa teladan tingkat Kopertais Wilayah IV Surabaya.' },
  { year: '2023', title: 'KKN Award', desc: 'Juara 1 program KKN terbaik tingkat kampus.' },
  { year: '2022', title: 'Inovasi Aspirasi Digital', desc: 'Peluncuran platform aspirasi mahasiswa berbasis digital pertama di kampus.' },
];

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
            className="font-arabic text-3xl text-yellow-200 mb-4">{siteConfig.heroAyat}</motion.p>
          <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="text-4xl font-extrabold mb-3">Tentang DEMA</motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            className="text-white/80 text-lg">{siteConfig.campusName}</motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-20">

        {/* Sejarah */}
        <section>
          <SectionHeader title="Sejarah Singkat" subtitle="Perjalanan DEMA dari masa ke masa" />
          <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-600 leading-relaxed mb-4">
              Dewan Eksekutif Mahasiswa (DEMA) {siteConfig.campusName} merupakan organisasi mahasiswa tertinggi
              di lingkungan kampus yang berdiri sejak kampus didirikan. DEMA hadir sebagai lembaga eksekutif
              yang menjalankan fungsi pelayanan, pengembangan, dan advokasi bagi seluruh mahasiswa.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dengan semangat nilai-nilai Islam yang mengakar kuat di pesantren, DEMA {siteConfig.shortName}
              berkomitmen menjadi organisasi yang amanah, profesional, dan berpihak kepada kepentingan mahasiswa.
              Setiap periode kepengurusan selalu diisi dengan program-program inovatif yang menyentuh kebutuhan nyata mahasiswa.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kini pada periode {siteConfig.periodYear}, DEMA hadir dengan wajah baru: lebih digital,
              lebih inklusif, dan lebih responsif terhadap aspirasi mahasiswa.
            </p>
          </div>
        </section>

        {/* Visi Misi */}
        <section>
          <SectionHeader title="Visi & Misi" subtitle="Landasan gerak DEMA" />
          <div className="mt-8 space-y-5">
            {/* Visi */}
            <div className="bg-primary-600 text-white rounded-3xl p-7">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">🎯 Visi</h3>
              <p className="text-white/90 leading-relaxed text-lg">{siteConfig.visi}</p>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">🚀 Misi</h3>
              <ol className="space-y-3">
                {siteConfig.misi.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center
                                     justify-center text-sm font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                    <p className="text-gray-600 leading-relaxed">{m}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Nilai organisasi */}
        <section>
          <SectionHeader title="Nilai-Nilai Organisasi" subtitle="Prinsip yang kami pegang teguh" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
              >
                <p className="text-4xl mb-3">{v.icon}</p>
                <h4 className="font-bold text-gray-800 mb-1">{v.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Filosofi logo */}
        <section>
          <SectionHeader title="Filosofi Logo" subtitle="Makna di balik identitas visual DEMA" />
          <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Placeholder logo */}
              <div className="w-36 h-36 bg-primary-50 rounded-3xl flex items-center justify-center
                              text-6xl flex-shrink-0 border-2 border-primary-100">
                🕌
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p><strong className="text-gray-800">🟢 Warna Hijau</strong> — Melambangkan Islam, pertumbuhan, dan kedamaian. Hijau adalah warna khas pesantren yang mencerminkan nilai-nilai Islami.</p>
                <p><strong className="text-gray-800">✨ Bintang</strong> — Simbol cahaya petunjuk dan cita-cita mahasiswa yang tinggi.</p>
                <p><strong className="text-gray-800">📖 Buku Terbuka</strong> — Representasi ilmu pengetahuan sebagai fondasi pergerakan mahasiswa.</p>
                <p><strong className="text-gray-800">🤝 Jabat Tangan</strong> — Menggambarkan ukhuwah dan kolaborasi antar mahasiswa.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Prestasi */}
        <section>
          <SectionHeader title="Prestasi & Pencapaian" subtitle="Jejak langkah DEMA" />
          <div className="mt-8 space-y-4">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.1 }}
                className="flex gap-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="text-center flex-shrink-0">
                  <span className="inline-block bg-primary-100 text-primary-700 font-bold text-sm
                                   px-3 py-1 rounded-xl">{a.year}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{a.title}</h4>
                  <p className="text-gray-500 text-sm">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
