import React from 'react';

const RelationsPreview = ({ nodes, edges, onExpand }) => {
  if (!nodes?.length) return null;

  return (
    <div className="absolute left-4 bottom-4 z-40">
      <div className="glass rounded-xl border border-white/15 p-2 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-200">Relations</span>
          <button
            onClick={onExpand}
            className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-200"
          >
            Expand
          </button>
        </div>
        <div className="grid grid-cols-6 gap-1 w-[180px]">
          {nodes.slice(0, 18).map((n) => (
            <div key={n.id} className="w-6 h-4 rounded bg-white/10 border border-white/10"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelationsPreview;


