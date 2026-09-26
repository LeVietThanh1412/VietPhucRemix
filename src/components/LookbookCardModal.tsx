import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { MannequinVisualizer } from './MannequinVisualizer';
import { buildShareUrl, shareLinksAreLocalOnly } from '../utils/lookStorage';
import { computeLookMetrics } from '../utils/lookMetrics';
import {
  ExportFormat,
  FORMAT_SIZE,
  buildCaption,
  canvasToBlob,
  downloadBlob,
  renderLookbookCard,
  shareImage,
  slug,
  svgToImage
} from '../utils/lookbookExport';
import { Download, X, Share2, Check, Sparkles, Link2, Copy, Loader2, OctagonAlert, Bookmark, BookmarkCheck } from 'lucide-react';

interface LookbookCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OutfitConfig;
  onSave?: (config: OutfitConfig, name?: string) => 'saved' | 'duplicate' | 'full';
  isSaved?: boolean;
}

export const LookbookCardModal: React.FC<LookbookCardModalProps> = ({ isOpen, onClose, config, onSave, isSaved }) => {
  const [format, setFormat] = React.useState<ExportFormat>('story');
  const [title, setTitle] = React.useState('');
  const [preview, setPreview] = React.useState<string | null>(null);
  const [rendering, setRendering] = React.useState(false);
  const [flash, setFlash] = React.useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const shareUrl = React.useMemo(() => (isOpen ? buildShareUrl(config) : ''), [isOpen, config]);
  const metrics = React.useMemo(() => computeLookMetrics(config), [config]);
  const fileName = `viet-phuc-remix-${slug(title || metrics.labels.garment)}-${format}.png`;

  const notify = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  };

  // Re-render preview when inputs change (debounced for typing)
  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const t = window.setTimeout(async () => {
      if (!svgRef.current) return;
      setRendering(true);
      try {
        const img = await svgToImage(svgRef.current);
        const canvas = await renderLookbookCard({ format, config, mannequin: img, shareUrl, title });
        if (cancelled) return;
        canvasRef.current = canvas;
        setPreview(canvas.toDataURL('image/png'));
      } catch (e) {
        console.error('Render lookbook failed', e);
        if (!cancelled) notify('Không tạo được ảnh xem trước');
      } finally {
        if (!cancelled) setRendering(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [isOpen, format, config, shareUrl, title]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copy = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(ok);
    } catch {
      window.prompt('Sao chép thủ công:', text);
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    downloadBlob(await canvasToBlob(canvasRef.current), fileName);
    notify('Đã tải ảnh lookbook');
  };

  const handleShareImage = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current);
    const shared = await shareImage(blob, fileName, buildCaption(config, title), shareUrl);
    if (!shared) {
      downloadBlob(blob, fileName);
      await copy(buildCaption(config, title) + '\n' + shareUrl, 'Trình duyệt không hỗ trợ chia sẻ ảnh. Đã tải ảnh và sao chép caption.');
    }
  };

  const handleSave = () => {
    if (!onSave) return;
    const r = onSave(config, title);
    notify(r === 'saved' ? 'Đã lưu vào Tủ đồ' : r === 'duplicate' ? 'Look này đã có trong Tủ đồ' : 'Tủ đồ đã đầy (tối đa 12)');
  };

  const size = FORMAT_SIZE[format];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Xuất lookbook"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Off-screen source mannequin for rasterizing */}
      <div aria-hidden className="fixed -left-[9999px] top-0 w-[600px] pointer-events-none">
        <MannequinVisualizer config={config} svgRef={svgRef} hideBadge />
      </div>

      <div className="bg-[#FAF7F2] rounded-2xl border border-stone-300 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/70 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">Tạo Lookbook Việt Phục</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Preview */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div
              className="relative w-full max-w-[340px] rounded-xl overflow-hidden border border-stone-200 shadow-lg bg-stone-100"
              style={{ aspectRatio: `${size.w} / ${size.h}` }}
            >
              {preview && <img src={preview} alt="Xem trước lookbook" className="w-full h-full object-contain" />}
              {rendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-600" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-mono">
              {size.w}×{size.h}px · {size.label} · Có mã QR mở lại look
            </p>
          </div>

          {/* Controls */}
          <div className="md:col-span-6 space-y-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-stone-700 uppercase tracking-wider">Định dạng</span>
              <div className="flex gap-2">
                {(Object.keys(FORMAT_SIZE) as ExportFormat[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-lg border font-medium ${
                      format === f ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {FORMAT_SIZE[f].label}
                    <span className="block text-[10px] opacity-70">{f === 'story' ? 'Instagram / TikTok story' : 'Bài đăng Facebook / IG'}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="font-semibold text-stone-700 uppercase tracking-wider">Tên look (tùy chọn)</span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 50))}
                placeholder={metrics.labels.garment}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
            </label>

            {shareLinksAreLocalOnly() && (
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-[11px]">
                Link/QR hiện trỏ về <b>localhost</b>, chỉ mở được trên máy này. Hãy đặt <code>APP_URL</code> (xem README) hoặc
                deploy để người khác quét được.
              </div>
            )}

            {metrics.critical > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900">
                <OctagonAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Look này có <b>{metrics.critical} điểm sai lệch văn hóa</b> (điểm {metrics.cultural}/100). Bạn nên xem lại phần
                  "Chuẩn Mực Di Sản" trước khi chia sẻ công khai.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                disabled={!preview}
                className="py-2.5 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Tải ảnh PNG
              </button>
              <button
                onClick={handleShareImage}
                disabled={!preview}
                className="py-2.5 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Chia sẻ ảnh
              </button>
              <button
                onClick={() => copy(shareUrl, 'Đã sao chép link look')}
                className="py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium flex items-center justify-center gap-1.5"
              >
                <Link2 className="w-3.5 h-3.5" /> Sao chép link
              </button>
              <button
                onClick={() => copy(buildCaption(config, title) + '\n' + shareUrl, 'Đã sao chép caption')}
                className="py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Sao chép caption
              </button>
              {onSave && (
                <button
                  onClick={handleSave}
                  className="col-span-2 py-2 rounded-lg border border-amber-800/40 bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium flex items-center justify-center gap-1.5"
                >
                  {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  {isSaved ? 'Đã có trong Tủ đồ' : 'Lưu vào Tủ đồ để so sánh'}
                </button>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-stone-700 uppercase tracking-wider">Caption gợi ý</span>
              <pre className="whitespace-pre-wrap font-sans text-[11px] text-stone-600 bg-white border border-stone-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                {buildCaption(config, title)}
              </pre>
            </div>

            {flash && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium" role="status">
                <Check className="w-3.5 h-3.5" /> {flash}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
