import { Handle, Position } from '@xyflow/react';

export default function MemberNode({ data }) {
  const { member } = data;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-64 overflow-hidden transition-all hover:shadow-md hover:border-primary-300">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-primary-500" />
      
      <div className="flex items-center gap-4 p-3">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">
              👤
            </div>
          )}
        </div>
        
        <div className="overflow-hidden">
          <h4 className="font-bold text-gray-800 text-sm truncate" title={member.name}>
            {member.name}
          </h4>
          <p className="text-xs text-primary-600 font-medium truncate" title={member.position}>
            {member.position}
          </p>
          {!member.isExecutive && (
            <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider mt-0.5">
              {member.division}
            </p>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-primary-500" />
    </div>
  );
}
