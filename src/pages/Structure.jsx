import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getAllMembers } from '../services/firestoreService';
import { DIVISIONS } from '../firebase/collections';
import PageTransition from '../components/PageTransition';
import MemberNode from '../components/MemberNode';

const nodeTypes = { memberNode: MemberNode };

export default function StructurePage() {
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  useEffect(() => {
    getAllMembers().then(data => {
      const bph = data.filter(m => m.isExecutive);
      const newNodes = [];
      const newEdges = [];
      
      const nodeWidth = 280;
      const nodeHeight = 120;
      const bphY = 0;
      const divY = 200;
      
      // 1. BPH
      bph.forEach((m, i) => {
        newNodes.push({
          id: m.id,
          type: 'memberNode',
          data: { member: m },
          position: { x: (i - (bph.length - 1) / 2) * nodeWidth, y: bphY },
        });
      });
      
      // 2. Divisions
      const divisions = DIVISIONS.filter(d => d !== 'Umum / BPH');
      let currentX = -((divisions.length - 1) / 2) * (nodeWidth * 1.5);
      
      divisions.forEach((divName) => {
        const divMembers = data.filter(m => m.division === divName && !m.isExecutive);
        if (divMembers.length === 0) return;
        
        const divNodeId = `div-${divName}`;
        newNodes.push({
          id: divNodeId,
          data: { label: `Divisi ${divName}` },
          position: { x: currentX + 60, y: divY }, // Offset to center above members
          style: { 
            background: '#f8fafc', 
            border: '2px solid #cbd5e1',
            borderRadius: '12px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#334155'
          }
        });
        
        if (bph.length > 0) {
          newEdges.push({
            id: `e-${bph[0].id}-${divNodeId}`,
            source: bph[0].id,
            target: divNodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#94a3b8' }
          });
        }
        
        divMembers.forEach((m, mIdx) => {
          newNodes.push({
            id: m.id,
            type: 'memberNode',
            data: { member: m },
            position: { x: currentX, y: divY + 100 + (mIdx * nodeHeight) },
          });
          
          newEdges.push({
            id: `e-${divNodeId}-${m.id}`,
            source: mIdx === 0 ? divNodeId : divMembers[mIdx - 1].id,
            target: m.id,
            type: 'smoothstep',
            style: { stroke: '#cbd5e1' }
          });
        });
        
        currentX += nodeWidth * 1.5;
      });
      
      setNodes(newNodes);
      setEdges(newEdges);
      setLoading(false);
    });
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-3">Struktur Organisasi</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80 text-lg">DEMA {new Date().getFullYear()} — Kepengurusan Lengkap</motion.p>
      </div>

      <div className="w-full h-[800px] bg-gray-50 border-b border-gray-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4" />
            <p className="text-gray-400">Memuat visual diagram...</p>
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-5xl mb-4">👥</p>
            <p>Data pengurus belum tersedia</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            className=""
          >
            <Background color="#ccc" gap={16} />
            <Controls className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100" />
            <MiniMap 
              nodeColor={(n) => {
                if (n.type === 'memberNode') return '#10b981';
                return '#cbd5e1';
              }} 
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto text-center py-8 px-4 text-gray-500 text-sm">
        💡 Tips: Gunakan scroll mouse atau cubit layar untuk zoom in/out, dan geser untuk menjelajahi struktur.
      </div>
    </PageTransition>
  );
}
