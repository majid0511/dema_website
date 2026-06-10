import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllMembers } from '../services/firestoreService';
import { DIVISIONS } from '../firebase/collections';
import PageTransition from '../components/PageTransition';
import SectionHeader  from '../components/SectionHeader';
import OrgCard from '../components/OrgCard';

export default function StructurePage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMembers().then(data => { setMembers(data); setLoading(false); });
  }, []);

  // Pisahkan BPH (pengurus inti) dan divisi lainnya
  const bph      = members.filter(m => m.isExecutive);
  const byDiv    = DIVISIONS.filter(d => d !== 'Umum / BPH').map(div => ({
    name: div,
    members: members.filter(m => m.division === div && !m.isExecutive),
  })).filter(d => d.members.length > 0);

  return (
    <PageTransition>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-3">Struktur Organisasi</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80 text-lg">DEMA {new Date().getFullYear()} — Kepengurusan Lengkap</motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16">

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
            <p className="text-gray-400 mt-4">Memuat data pengurus...</p>
          </div>
        ) : (
          <>
            {/* ─── BPH / Pengurus Inti ─── */}
            {bph.length > 0 && (
              <section>
                <SectionHeader title="Badan Pengurus Harian" subtitle="Pimpinan utama organisasi" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
                  {bph.map((m, i) => (
                    <motion.div key={m.id}
                      initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }} transition={{ delay: i * 0.08 }}>
                      <OrgCard member={m} variant="bph" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ─── Per divisi ─── */}
            {byDiv.map((div, di) => (
              <section key={div.name}>
                <SectionHeader title={`Divisi ${div.name}`} subtitle={`${div.members.length} anggota`} />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {div.members.map((m, i) => (
                    <motion.div key={m.id}
                      initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }} transition={{ delay: i * 0.06 }}>
                      <OrgCard member={m} variant="division" />
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}

            {members.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">👥</p>
                <p>Data pengurus belum tersedia</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
