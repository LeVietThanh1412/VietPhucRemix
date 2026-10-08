import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { SavedLook, sameLook } from '../utils/savedLooks';
import { computeLookMetrics, overallScore } from '../utils/lookMetrics';
import { MannequinVisualizer } from './MannequinVisualizer';
import { Bookmark, Trash2, Pencil, ArrowRightLeft, Shirt, Check } from 'lucide-react';

interface SavedLooksPanelProps {
  looks: SavedLook[];
  max: number;
  currentLook: OutfitConfig;
  onApply: (config: OutfitConfig) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onCompare: (keys: string[]) => void;
}

export const SavedLooksPanel: React.FC<SavedLooksPanelProps> = ({ looks, max, currentLook, onApply, onRemove, onRename, onCompare }) => {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [editing, setEditing] = React.useState<string | null>(null);
  const cancelRename = React.useRef(false);
  const [draft, setDraft] = React.useState('');

  // drop picks for deleted looks
  React.useEffect(() => {
    setPicked(p => p.filter(id => looks.some(l => l.id === id)));
  }, [looks]);

  const togglePick = (id: string) =>
    setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : p.length < 3 ? [...p, id] : [...p.slice(1), id]));

  if (looks.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-dashed border-stone-300 text-center text-xs text-stone-500 space-y-1">
        <Bookmark className="w-6 h-6 mx-auto text-stone-300" />
        <p className="font-medium text-stone-700">Tủ đồ đang trống</p>
        <p>Bấm "Lưu look" trong Studio để giữ lại các phương án. Sau đó bạn có thể so sánh 2–3 look cạnh nhau.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="text-stone-500">
          {looks.length}/{max} look đã lưu · Chọn 2–3 look để so sánh
        </span>
        <button
          onClick={() => onCompare(picked.length >= 2 ? picked.map(id => `saved:${id}`) : ['current', ...looks.slice(0, 2).map(l => `saved:${l.id}`)])}
          disabled={picked.length === 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 disabled:opacity-40"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          {picked.length >= 2 ? `So sánh ${picked.length} look đã chọn` : picked.length === 1 ? 'Chọn thêm 1 look' : 'So sánh với look hiện tại'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {looks.map(l => {
          const m = computeLookMetrics(l.config);
          const on = picked.includes(l.id);
          const active = sameLook(l.config, currentLook);
          return (
            <div
              key={l.id}
              className={`bg-white rounded-xl overflow-hidden flex flex-col transition-all ${
                on ? 'ring-2 ring-amber-800 border border-amber-800' : 'border border-stone-200 hover:border-stone-300'
              }`}
            >
              <button onClick={() => togglePick(l.id)} className="relative block" aria-pressed={on} title="Chọn để so sánh">
                <MannequinVisualizer config={l.config} hideBadge className="!rounded-none !shadow-none !border-0" />
                <span
                  className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center border text-white ${
                    on ? 'bg-amber-800 border-amber-800' : 'bg-white/80 border-stone-300'
                  }`}
                >
                  {on && <Check className="w-3 h-3" />}
                </span>
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-mono font-bold bg-white/90 px-1.5 py-0.5 rounded">
                  {overallScore(m)}
                </span>
                {m.critical > 0 && (
                  <span className="absolute bottom-1.5 right-1.5 text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">!</span>
                )}
              </button>
              <div className="p-2 space-y-1.5 flex-1 flex flex-col">
                {editing === l.id ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onBlur={() => {
                      if (!cancelRename.current) onRename(l.id, draft);
                      setEditing(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      if (e.key === 'Escape') { cancelRename.current = true; (e.target as HTMLInputElement).blur(); }
                    }}
                    className="w-full text-[11px] px-1.5 py-0.5 border border-stone-300 rounded"
                    maxLength={60}
                  />
                ) : (
                  <p className="text-[11px] font-semibold text-stone-900 line-clamp-2 leading-snug" title={l.name}>
                    {l.name}
                  </p>
                )}
                <p className="text-[10px] text-stone-400">
                  VH {m.cultural} · Màu {m.harmony}
                </p>
                <div className="flex items-center gap-1 mt-auto pt-1">
                  <button
                    onClick={() => onApply(l.config)}
                    disabled={active}
                    className="flex-1 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-medium text-stone-800 flex items-center justify-center gap-1 disabled:opacity-50"
                    title="Mặc thử"
                  >
                    <Shirt className="w-3 h-3" /> {active ? 'Đang mặc' : 'Mặc'}
                  </button>
                  <button
                    onClick={() => {
                      cancelRename.current = false;
                      setEditing(l.id);
                      setDraft(l.name);
                    }}
                    className="p-1 rounded-md hover:bg-stone-100 text-stone-500"
                    title="Đổi tên"
                    aria-label="Đổi tên"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemove(l.id)}
                    className="p-1 rounded-md hover:bg-red-50 text-stone-500 hover:text-red-600"
                    title="Xóa"
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
