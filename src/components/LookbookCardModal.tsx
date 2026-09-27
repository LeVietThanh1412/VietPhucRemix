import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { MannequinVisualizer } from './MannequinVisualizer';
import { StoryCardNode } from './StoryCardNode';
import { buildShareUrl, shareLinksAreLocalOnly } from '../utils/lookStorage';
import { computeLookMetrics } from '../utils/lookMetrics';
import { exportElementToImage, downloadDataUrl } from '../utils/htmlToImageExport';
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
import { 
  Download, 
  X, 
  Share2, 
  Check, 
  Sparkles, 
  Link2, 
  Copy, 
  Loader2, 
  OctagonAlert, 
  Bookmark, 
  BookmarkCheck,
  FileImage,
  Layers
} from 'lucide-react';

interface LookbookCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OutfitConfig;
  onSave?: (config: OutfitConfig, name?: string) => 'saved' | 'duplicate' | 'full';
  isSaved?: boolean;
}

export type ExportEngine = 'html-to-image' | 'canvas';

export const LookbookCardModal: React.FC<LookbookCardModalProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  onSave, 
  isSaved 
}) => {
  const [format, setFormat] = React.useState<ExportFormat>('story');
  const [engine, setEngine] = React.useState<ExportEngine>('html-to-image');
  const [title, setTitle] = React.useState('');
  const [preview, setPreview] = React.useState<string | null>(null);
  const [rendering, setRendering] = React.useState(false);
  const [flash, setFlash] = React.useState<string | null>(null);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const storyNodeRef = React.useRef<HTMLDivElement>(null);

  const shareUrl = React.useMemo(() => (isOpen ? buildShareUrl(config) : ''), [isOpen, config]);
  const metrics = React.useMemo(() => computeLookMetrics(config), [config]);
  const fileNameBase = `viet-phuc-remix-${slug(title || metrics.labels.garment)}-${format}`;

  const notify = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2500);
  };

  // Re-render preview when inputs change (debounced for typing & engine change)
  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const t = window.setTimeout(async () => {
      setRendering(true);
      try {
        if (engine === 'html-to-image') {
          // html-to-image workflow: snapshots the styled StoryCardNode DOM element
          if (!storyNodeRef.current) return;
          // small delay to ensure webfonts and SVG are painted in off-screen DOM
          await new Promise(r => setTimeout(r, 60));
          const dataUrl = await exportElementToImage(storyNodeRef.current, {
            format: 'png',
            pixelRatio: 2
          });
          if (cancelled) return;
          setPreview(dataUrl);
        } else {
          // Legacy canvas 2D workflow: manual rasterization
          if (!svgRef.current) return;
          const img = await svgToImage(svgRef.current);
          const canvas = await renderLookbookCard({ format, config, mannequin: img, shareUrl, title });
          if (cancelled) return;
          canvasRef.current = canvas;
          setPreview(canvas.toDataURL('image/png'));
        }
      } catch (e) {
        console.error('Render lookbook failed', e);
        if (!cancelled) notify('Không tạo được ảnh xem trước, vui lòng thử lại');
      } finally {
        if (!cancelled) setRendering(false);
      }
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [isOpen, format, engine, config, shareUrl, title]);

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

  const handleDownloadPng = async () => {
    if (!preview) return;
    if (engine === 'html-to-image') {
      downloadDataUrl(preview, `${fileNameBase}.png`);
      notify('Đã tải ảnh PNG chuẩn nét (html-to-image)');
    } else {
      if (!canvasRef.current) return;
      downloadBlob(await canvasToBlob(canvasRef.current), `${fileNameBase}.png`);
      notify('Đã tải ảnh lookbook PNG');
    }
  };

  const handleDownloadJpg = async () => {
    if (engine === 'html-to-image' && storyNodeRef.current) {
      try {
        const jpgUrl = await exportElementToImage(storyNodeRef.current, {
          format: 'jpeg',
          pixelRatio: 2
        });
        downloadDataUrl(jpgUrl, `${fileNameBase}.jpg`);
        notify('Đã tải ảnh JPG chất lượng cao');
      } catch (e) {
        console.error('Error exporting JPG', e);
        notify('Lỗi xuất file JPG');
      }
    } else if (canvasRef.current) {
      canvasRef.current.toBlob(blob => {
        if (blob) {
          downloadBlob(blob, `${fileNameBase}.jpg`);
          notify('Đã tải ảnh JPG');
        }
      }, 'image/jpeg', 0.92);
    }
  };

  const handleShareImage = async () => {
    if (!preview) return;
    let blob: Blob | null = null;
    if (engine === 'html-to-image') {
      const res = await fetch(preview);
      blob = await res.blob();
    } else if (canvasRef.current) {
      blob = await canvasToBlob(canvasRef.current);
    }

    if (!blob) return;

    const shared = await shareImage(blob, `${fileNameBase}.png`, buildCaption(config, title), shareUrl);
    if (!shared) {
      handleDownloadPng();
      await copy(
        buildCaption(config, title) + '\n' + shareUrl,
        'Trình duyệt không hỗ trợ chia sẻ trực tiếp. Đã tải ảnh và sao chép caption!'
      );
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Xuất thẻ ảnh lookbook & story"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Off-screen DOM node for html-to-image capturing */}
      <div aria-hidden className="fixed -left-[9999px] top-0 pointer-events-none">
        <StoryCardNode
          cardRef={storyNodeRef}
          config={config}
          format={format}
          title={title}
          shareUrl={shareUrl}
        />
      </div>

      {/* Off-screen source mannequin for legacy canvas rasterizing */}
      <div aria-hidden className="fixed -left-[9999px] top-0 w-[600px] pointer-events-none">
        <MannequinVisualizer config={config} svgRef={svgRef} hideBadge />
      </div>

      <div className="bg-[#FAF7F2] rounded-2xl border border-stone-300 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/70 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">
                Xuất Thẻ Ảnh Di Sản & Lookbook
              </h2>
              <p className="text-xs text-stone-500">
                Tạo thẻ văn hóa định dạng Story (9:16) hoặc Bài đăng (4:5) chia sẻ mạng xã hội
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Preview Column */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div
              className="relative w-full max-w-[340px] rounded-xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100 flex items-center justify-center transition-all"
              style={{ aspectRatio: `${size.w} / ${size.h}` }}
            >
              {preview && (
                <img
                  src={preview}
                  alt="Xem trước lookbook"
                  className="w-full h-full object-contain select-none"
                />
              )}
              {rendering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs gap-2">
                  <Loader2 className="w-7 h-7 animate-spin text-amber-800" />
                  <span className="text-xs font-medium text-stone-600 font-mono">
                    Đang kết xuất {engine === 'html-to-image' ? 'html-to-image' : 'canvas'}...
                  </span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-mono flex items-center gap-1.5">
              <span>{size.w}×{size.h}px · {size.label}</span>
              <span>•</span>
              <span className="text-amber-800 font-semibold uppercase">{engine}</span>
            </p>
          </div>

          {/* Controls Column */}
          <div className="md:col-span-6 space-y-4 text-xs">
            {/* Format selector */}
            <div className="space-y-1.5">
              <span className="font-semibold text-stone-700 uppercase tracking-wider">
                Định dạng khung hình
              </span>
              <div className="flex gap-2">
                {(Object.keys(FORMAT_SIZE) as ExportFormat[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 px-3 rounded-lg border font-medium transition-all ${
                      format === f
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {FORMAT_SIZE[f].label}
                    <span className="block text-[10px] opacity-70">
                      {f === 'story' ? 'Instagram / TikTok Story' : 'Bài đăng Facebook / IG'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Engine Selector (html-to-image vs Canvas) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-700 uppercase tracking-wider">
                  Bộ máy xuất ảnh (Workflow 3)
                </span>
                <span className="text-[10px] text-amber-800 font-medium">Khuyên dùng html-to-image</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEngine('html-to-image')}
                  className={`py-2 px-2.5 rounded-lg border text-left transition-all ${
                    engine === 'html-to-image'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-800/30 shadow-2xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>html-to-image</span>
                  </div>
                  <span className="block text-[10px] text-stone-500 font-normal mt-0.5">
                    Thẻ đồ họa DOM sắc nét, chuẩn font chữ & viền vàng
                  </span>
                </button>

                <button
                  onClick={() => setEngine('canvas')}
                  className={`py-2 px-2.5 rounded-lg border text-left transition-all ${
                    engine === 'canvas'
                      ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-800/30 shadow-2xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <FileImage className="w-3.5 h-3.5 text-stone-700" />
                    <span>Canvas 2D</span>
                  </div>
                  <span className="block text-[10px] text-stone-500 font-normal mt-0.5">
                    Bản vẽ cổ điển vẽ bằng pixel context 2D
                  </span>
                </button>
              </div>
            </div>

            {/* Custom title */}
            <label className="block space-y-1.5">
              <span className="font-semibold text-stone-700 uppercase tracking-wider">
                Tên thẻ lookbook (tùy chọn)
              </span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 50))}
                placeholder={metrics.labels.garment}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-800"
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
                  Look này có <b>{metrics.critical} điểm chưa chuẩn mực</b> (điểm {metrics.cultural}/100). Bạn nên kiểm tra kỹ
                  trước khi chia sẻ công khai.
                </span>
              </div>
            )}

            {/* Download and Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadPng}
                disabled={!preview || rendering}
                className="py-2.5 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
              >
                <Download className="w-3.5 h-3.5" /> Tải ảnh PNG
              </button>
              <button
                onClick={handleDownloadJpg}
                disabled={!preview || rendering}
                className="py-2.5 rounded-lg bg-stone-800 text-white font-semibold hover:bg-stone-700 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
              >
                <Download className="w-3.5 h-3.5" /> Tải ảnh JPG
              </button>
              <button
                onClick={handleShareImage}
                disabled={!preview || rendering}
                className="col-span-2 py-2.5 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
              >
                <Share2 className="w-3.5 h-3.5" /> Chia sẻ lên Story / Mạng Xã Hội
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

            {/* Caption Preview */}
            <div className="space-y-1">
              <span className="font-semibold text-stone-700 uppercase tracking-wider">
                Caption gợi ý đăng mạng xã hội:
              </span>
              <pre className="whitespace-pre-wrap font-sans text-[11px] text-stone-600 bg-white border border-stone-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                {buildCaption(config, title)}
              </pre>
            </div>

            {flash && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium animate-in fade-in" role="status">
                <Check className="w-3.5 h-3.5" /> {flash}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
