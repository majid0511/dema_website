import { motion } from 'framer-motion';
import { siteConfig } from '../config/siteConfig';
import { waLink } from '../utils/formatters';
import PageTransition from '../components/PageTransition';
import SectionHeader  from '../components/SectionHeader';

// Data kontak per divisi — sesuaikan dengan pengurus yang menjabat
const DIVISION_CONTACTS = [
  {
    division: 'Akademik & Kemahasiswaan',
    icon: '🎓',
    color: 'bg-blue-50 border-blue-100',
    contacts: [
      { name: 'Ahmad Fauzan', role: 'Ketua Divisi Akademik', whatsapp: '6285xxxxxxxxx' },
      { name: 'Siti Aisyah',  role: 'Sekretaris Divisi',     whatsapp: '6285xxxxxxxxx' },
    ],
  },
  {
    division: 'Sosial & Masyarakat',
    icon: '🤝',
    color: 'bg-green-50 border-green-100',
    contacts: [
      { name: 'Budi Santoso', role: 'Ketua Divisi Sosial', whatsapp: '6285xxxxxxxxx' },
    ],
  },
  {
    division: 'Keagamaan',
    icon: '🕌',
    color: 'bg-yellow-50 border-yellow-100',
    contacts: [
      { name: 'Ustadz Malik', role: 'Ketua Divisi Keagamaan', whatsapp: '6285xxxxxxxxx' },
    ],
  },
  {
    division: 'Media & Informasi',
    icon: '📱',
    color: 'bg-purple-50 border-purple-100',
    contacts: [
      { name: 'Rizky Pratama', role: 'Ketua Divisi Media', whatsapp: '6285xxxxxxxxx' },
      { name: 'Laila Nur',     role: 'Admin Media Sosial', whatsapp: '6285xxxxxxxxx' },
    ],
  },
];

export default function ContactPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-2">Hubungi Kami</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80">Temukan kontak divisi yang kamu butuhkan</motion.p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-14">

        {/* Info kontak umum */}
        <section>
          <SectionHeader title="Kontak Umum" subtitle="Hubungi DEMA langsung" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: '✉️', label: 'Email', value: siteConfig.email,
                href: `mailto:${siteConfig.email}`,
              },
              {
                icon: '📍', label: 'Alamat', value: siteConfig.address,
                href: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`,
              },
              {
                icon: '📱', label: 'WhatsApp', value: 'Chat langsung',
                href: waLink(siteConfig.whatsapp, 'Halo DEMA, saya ingin bertanya...'),
              },
            ].map(item => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center
                           hover:shadow-md hover:-translate-y-0.5 transition-all block group">
                <p className="text-4xl mb-3">{item.icon}</p>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="font-medium text-gray-700 text-sm group-hover:text-primary-600 transition-colors">
                  {item.value}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Media sosial */}
        <section>
          <SectionHeader title="Media Sosial" subtitle="Ikuti kami di berbagai platform" />
          <div className="flex flex-wrap gap-4 mt-8">
            {siteConfig.instagram && (
              <a href={`https://instagram.com/${siteConfig.instagram}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 px-6 py-4
                           shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="text-3xl">📸</span>
                <div>
                  <p className="text-xs text-gray-400">Instagram</p>
                  <p className="font-semibold text-gray-800">@{siteConfig.instagram}</p>
                </div>
              </a>
            )}
            {siteConfig.youtube && (
              <a href={`https://youtube.com/@${siteConfig.youtube}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 px-6 py-4
                           shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="text-3xl">▶️</span>
                <div>
                  <p className="text-xs text-gray-400">YouTube</p>
                  <p className="font-semibold text-gray-800">@{siteConfig.youtube}</p>
                </div>
              </a>
            )}
            {siteConfig.tiktok && (
              <a href={`https://tiktok.com/@${siteConfig.tiktok}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 px-6 py-4
                           shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="text-3xl">🎵</span>
                <div>
                  <p className="text-xs text-gray-400">TikTok</p>
                  <p className="font-semibold text-gray-800">@{siteConfig.tiktok}</p>
                </div>
              </a>
            )}
          </div>
        </section>

        {/* Kontak per divisi */}
        <section>
          <SectionHeader title="Kontak Per Divisi" subtitle="Hubungi langsung penanggung jawab" />
          <div className="space-y-6 mt-8">
            {DIVISION_CONTACTS.map((div, di) => (
              <motion.div key={div.division}
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: di * 0.08 }}
                className={`rounded-2xl border p-6 ${div.color}`}>
                {/* Header divisi */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{div.icon}</span>
                  <h3 className="font-bold text-gray-800 text-lg">Divisi {div.division}</h3>
                </div>

                {/* Kartu kontak */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {div.contacts.map((c, ci) => (
                    <div key={ci} className="bg-white rounded-xl p-4 border border-white shadow-sm">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center
                                      text-primary-600 font-bold mb-3">
                        {c.name[0]}
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500 mb-3">{c.role}</p>
                      <a href={waLink(c.whatsapp, `Halo Kak ${c.name}, saya ingin bertanya mengenai ${div.division}.`)}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs
                                   px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-medium">
                        {/* WhatsApp mini icon */}
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Jam pelayanan */}
        <section>
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
            <h3 className="font-bold text-primary-700 mb-4 flex items-center gap-2 text-lg">
              🕐 Jam Pelayanan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { day: 'Senin – Kamis', time: '08.00 – 16.00 WIB' },
                { day: 'Jumat',         time: '08.00 – 11.30 WIB' },
                { day: 'Sabtu',         time: '08.00 – 13.00 WIB' },
                { day: 'Minggu & Libur',time: 'Tutup' },
              ].map(h => (
                <div key={h.day} className="flex justify-between bg-white rounded-xl px-4 py-2.5 border border-primary-100">
                  <span className="text-gray-600 font-medium">{h.day}</span>
                  <span className={h.time === 'Tutup' ? 'text-red-500 font-medium' : 'text-primary-700 font-semibold'}>
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
