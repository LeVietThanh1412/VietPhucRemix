import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { PRESET_LOOKBOOKS } from '../data/heritageData';
import { MannequinVisualizer } from './MannequinVisualizer';
import { SavedLook, sameLook } from '../utils/savedLooks';
import { LookMetrics, computeLookMetrics, overallScore } from '../utils/lookMetrics';
import { canvasToBlob, downloadBlob, renderComparisonSheet, svgToImage } from '../utils/lookbookExport';
import { X, ArrowRightLeft, Sparkles, Crown, Download, Loader2, Plus, Check } from 'lucide-react';

interface LookComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLook: OutfitConfig;
  savedLooks: SavedLook[];
  onApplyLook: (look: OutfitConfig) => void;
  /** Candidate keys to preselect, e.g. ["current", "saved:<id>"] */
  initialSelection?: string[];
}

interface Candidate {
  key: string;
  name: string;
  group: 'Hiện tại' | 'Tủ đồ của bạn' | 'Look mẫu';
  config: OutfitConfig;
}

const MAX_COMPARE = 3;

type Row = { label: string; get: (m: LookMetrics, total: number) => number | string; best?: 'max' | 'min'; hint?: string };

const ROWS: Row[] = [
  { label: 'Tổng điểm', get: (_m, t) => t, best: 'max', hint: '45% văn hóa + 25% màu + 30% hợp dịp' },
  { label: 'Tôn trọng văn hóa', get: m => m.cultural, best: 'max' },
  { label: 'Hài hòa màu sắc', get: m => m.harmony, best: 'max' },
  { label: 'Hợp sự kiện', get: m => m.eventFit, best: 'max' },
  { label: 'Độ trang trọng', get: m => m.formality, hint: 'Cao = lễ nghi, thấp = đời thường' },
  { label: 'Tỉ lệ đồ truyền thống', get: m => `${m.traditional}%`, hint: 'Phần còn lại là món remix hiện đại' },
  { label: 'Sai lệch / Lưu ý', get: m => `${m.critical} / ${m.warnings}` },
  { label: 'Màu chủ đạo', get: m => `${m.labels.color} (${m.labels.element})` },
  { label: 'Hạ y', get: m => m.labels.bottom },
  { label: 'Khăn / nón', get: m => m.labels.headwear },
  { label: 'Giày dép', get: m => m.labels.footwear },
  { label: 'Phụ kiện', get: m => m.labels.accessories },
  { label: 'Dịp', get: m => m.labels.event }
];

export const LookComparisonModal: React.FC<LookComparisonModalProps> = ({
  isOpen,
  onClose,
  currentLook,
  savedLooks,
  onApplyLook,
  initialSelection
}) => {
  const candidates = React.useMemo<Candidate[]>(() => {
    const list: Candidate[] = [{ key: 'current', name: 'Look đang phối', group: 'Hiện tại', config: currentLook }];
    savedLooks.forEach(s => list.push({ key: `saved:${s.id}`, name: s.name, group: 'Tủ đồ của bạn', config: s.config }));
    PRESET_LOOKBOOKS.forEach(p => list.push({ key: `preset:${p.id}`, name: p.title, group: 'Look mẫu', config: p.config }));
    return list;
  }, [currentLook, savedLooks]);

  const defaultSelection = React.useCallback((): string[] => {
    if (initialSelection?.length) {
      const valid = [...new Set(initialSelection)].filter(key => candidates.some(c => c.key === key));
      return [...valid, ...candidates.map(c => c.key).filter(key => !valid.includes(key))].slice(0, Math.max(2, Math.min(MAX_COMPARE, valid.length)));
    }
    const saved = savedLooks.filter(s => !sameLook(s.config, currentLook)).slice(0, 2).map(s => `saved:${s.id}`);
    if (saved.length) return ['current', ...saved];
    const preset = PRESET_LOOKBOOKS.find(p => p.config.garmentId !== currentLook.garmentId) ?? PRESET_LOOKBOOKS[0];
    return ['current', `preset:${preset.id}`];
  }, [initialSelection, savedLooks, currentLook, candidates]);

  const [selected, setSelected] = React.useState<string[]>(defaultSelection);
  const [exportError, setExportError] = React.useState('');
  const exportBusy = React.useRef(false);
  const [exporting, setExporting] = React.useState(false);
  const svgRefs = React.useRef<Record<string, SVGSVGElement | null>>({});

  // Reset selection each time the modal opens
  React.useEffect(() => {
    if (isOpen) setSelected(defaultSelection());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    setSelected(prev => {
      const valid = [...new Set(prev)].filter(key => candidates.some(c => c.key === key));
      const next = [...valid, ...candidates.map(c => c.key).filter(key => !valid.includes(key))].slice(0, Math.max(2, Math.min(MAX_COMPARE, valid.length)));
      return next.join('|') === prev.join('|') ? prev : next;
    });
  }, [candidates]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chosen = selected.map(k => candidates.find(c => c.key === k)).filter((c): c is Candidate => !!c);
  const metrics = chosen.map(c => computeLookMetrics(c.config));
  const totals = metrics.map(overallScore);
  const bestScore = Math.max(...totals);
  const winners = totals.flatMap((total, i) => total === bestScore ? [i] : []);
  const bestIdx = winners.length === 1 ? winners[0] : -1;

  const toggle = (key: string) =>
    setSelected(prev =>
      prev.includes(key) ? (prev.length > 2 ? prev.filter(k => k !== key) : prev) : prev.length < MAX_COMPARE ? [...prev, key] : [...prev.slice(1), key]
    );

  const verdict = (() => {
    if (chosen.length < 2) return null;
    if (winners.length > 1) return { text: `Các look ${winners.map(i => '"' + chosen[i].name + '"').join(', ')} đồng điểm (${bestScore}/100).`, tip: 'Chọn theo từng tiêu chí và bối cảnh sự kiện bên dưới.' };
    const b = chosen[bestIdx];
    const bm = metrics[bestIdx];
    const parts: string[] = [];
    const lead = (fn: (m: LookMetrics) => number) => metrics.every((m, i) => i === bestIdx || fn(bm) >= fn(m));
    if (lead(m => m.cultural)) parts.push('tôn trọng văn hóa nhất');
    if (lead(m => m.eventFit)) parts.push('hợp dịp nhất');
    if (lead(m => m.harmony)) parts.push('màu hài hòa nhất');
    const most = (fn: (m: LookMetrics) => number) => chosen[metrics.map(fn).indexOf(Math.max(...metrics.map(fn)))].name;
    const tip = metrics.some(m => m.critical > 0)
      ? 'Có phương án chứa sai lệch văn hóa, nên sửa trước khi chia sẻ.'
      : `Nếu muốn nét truyền thống rõ nhất, hãy chọn "${most(m => m.traditional)}". Nếu cần trang trọng nhất, hãy chọn "${most(m => m.formality)}".`;
    return { text: `"${b.name}" nổi bật nhất${parts.length ? ' vì ' + parts.join(', ') : ''}.`, tip };
  })();

  const handleExport = async () => {
    if (exportBusy.current || chosen.length < 2) return;
    exportBusy.current = true;
    setExportError('');
    setExporting(true);
    try {
      const entries = await Promise.all(
        chosen.map(async c => {
          const svg = svgRefs.current[c.key];
          if (!svg) throw new Error('missing svg');
          return { name: c.name, config: c.config, mannequin: await svgToImage(svg) };
        })
      );
      const canvas = await renderComparisonSheet(entries);
      downloadBlob(await canvasToBlob(canvas), 'viet-phuc-remix-so-sanh.png');
    } catch (e) {
      setExportError('Không xuất được bảng so sánh, vui lòng thử lại');
    } finally {
      exportBusy.current = false;
      setExporting(false);
    }
  };

  const groups = ['Hiện tại', 'Tủ đồ của bạn', 'Look mẫu'] as const;
  const cols = chosen.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="So sánh phương án phối"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FAF7F2] rounded-2xl border border-stone-300 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/70 sticky top-0 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">So Sánh Phương Án Phối Đồ</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting || chosen.length < 2}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-50"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Tải bảng so sánh</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500" aria-label="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {exportError && <p role="alert" className="text-sm text-red-800">{exportError}</p>}
          {/* Picker */}
          <div className="space-y-2">
            <p className="text-xs text-stone-600">
              Chọn <b>2–3 phương án</b> để so sánh ({selected.length}/{MAX_COMPARE}).
              {savedLooks.length === 0 && ' Mẹo: bấm "Lưu look" trong Studio để thêm look của riêng bạn vào Tủ đồ.'}
            </p>
            {groups.map(gr => {
              const items = candidates.filter(c => c.group === gr);
              if (!items.length) return null;
              return (
                <div key={gr} className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 w-24 shrink-0">{gr}</span>
                  {items.map(c => {
                    const on = selected.includes(c.key);
                    return (
                      <button
                        key={c.key}
                        onClick={() => toggle(c.key)}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1 transition-colors ${
                          on ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                        aria-pressed={on}
                      >
                        {on ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        <span className="max-w-[160px] truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Verdict */}
          {verdict && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Crown className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{verdict.text}</p>
                <p className="text-amber-900/80 mt-0.5">{verdict.tip}</p>
              </div>
            </div>
          )}

          {/* Cards */}
          <div className={`grid grid-cols-1 ${cols} gap-4`}>
            {chosen.map((c, i) => (
              <div
                key={c.key}
                className={`p-4 bg-white rounded-xl space-y-3 ${i === bestIdx ? 'border-2 border-amber-800 shadow-md' : 'border border-stone-200 shadow-xs'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{c.group}</span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 truncate">{c.name}</h3>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-mono font-bold px-2 py-1 rounded ${
                      i === bestIdx ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    {i === bestIdx && '★ '}
                    {totals[i]}
                  </span>
                </div>
                <div className="max-w-[240px] mx-auto">
                  <MannequinVisualizer
                    config={c.config}
                    className="w-full"
                    hideBadge
                    svgRef={el => {
                      svgRefs.current[c.key] = el;
                    }}
                  />
                </div>
                {c.key !== 'current' && (
                  <button
                    onClick={() => {
                      onApplyLook(c.config);
                      onClose();
                    }}
                    className="w-full py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Mặc thử look này
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Metrics table */}
          {chosen.length >= 2 && (
            <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-500">
                    <th className="text-left font-semibold px-3 py-2 w-44">Tiêu chí</th>
                    {chosen.map((c, i) => (
                      <th key={c.key} className={`text-left font-semibold px-3 py-2 ${i === bestIdx ? 'text-amber-900' : ''}`}>
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(row => {
                    const vals = metrics.map((m, i) => row.get(m, totals[i]));
                    const nums = vals.filter((v): v is number => typeof v === 'number');
                    const top = row.best && nums.length === vals.length ? (row.best === 'min' ? Math.min(...nums) : Math.max(...nums)) : null;
                    const tie = top !== null && nums.every(n => n === top);
                    return (
                      <tr key={row.label} className="border-t border-stone-100 align-top">
                        <td className="px-3 py-2 text-stone-600 font-medium" title={row.hint}>
                          {row.label}
                          {row.hint && <span className="block text-[10px] text-stone-400 font-normal">{row.hint}</span>}
                        </td>
                        {vals.map((v, i) => {
                          const win = top !== null && !tie && v === top;
                          return (
                            <td key={i} className={`px-3 py-2 ${win ? 'font-bold text-emerald-700' : 'text-stone-800'}`}>
                              {typeof v === 'number' && row.best ? (
                                <div className="flex items-center gap-2">
                                  <span className="w-7 font-mono">{v}</span>
                                  <span className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden max-w-[120px]">
                                    <span
                                      className={`block h-full ${v >= 90 ? 'bg-emerald-500' : v >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                                      style={{ width: `${v}%` }}
                                    />
                                  </span>
                                </div>
                              ) : (
                                v
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
