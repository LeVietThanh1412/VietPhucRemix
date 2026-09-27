import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, User, Link as LinkIcon, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { IconViet3D } from './VietIcons';

interface ReadyPlayerMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatarUrl: (url: string) => void;
  currentAvatarUrl: string;
}

export const ReadyPlayerMeModal: React.FC<ReadyPlayerMeModalProps> = ({
  isOpen,
  onClose,
  onSelectAvatarUrl,
  currentAvatarUrl
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'presets' | 'url'>('create');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Subdomain for Ready Player Me frame
  const subdomain = 'demo';

  // Listen to Ready Player Me iframe postMessage events
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      let data: any = null;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (data?.source !== 'readyplayerme') return;

      // Subscribe to all frame events once ready
      if (data.eventName === 'v1.frame.ready' && frameRef.current?.contentWindow) {
        setIsFrameLoading(false);
        frameRef.current.contentWindow.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**'
          }),
          '*'
        );
      }

      // Handle exported 3D avatar GLB URL
      if (data.eventName === 'v1.avatar.exported' && data.data?.url) {
        const glbUrl = data.data.url;
        onSelectAvatarUrl(glbUrl);
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, onSelectAvatarUrl, onClose]);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'female-sample',
      name: 'Mẫu 3D Nữ Chuẩn (Thanh Lịch - Áo Tấc & Nhật Bình)',
      desc: 'Mô hình 3D Ready Player Me nguyên bản tỉ lệ chuẩn, tôn nét duyên khi diện Áo Tấc, Nhật Bình và Tứ Thân.',
      url: '/models/avatar-default.glb',
      gender: 'female'
    },
    {
      id: 'asian-sample',
      name: 'Mẫu 3D Phong Cách Á Đông (Trẻ Trung)',
      desc: 'Mô hình 3D phong cách Á Đông hiện đại, phù hợp trải nghiệm phối trang phục học sĩ và tân thời.',
      url: '/models/avatar-vroid.glb',
      gender: 'both'
    }
  ];

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onSelectAvatarUrl(customUrlInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[88vh] max-h-[820px] bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <IconViet3D size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                Trình Tạo & Chọn Avatar 3D Thật
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready Player Me
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Tạo hình ảnh 3D nhân vật đa giác thực tế (WebGL) để mặc cổ phục Việt Nam xoay 360°
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-stone-200/60 bg-stone-50/70">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tạo Mới Bằng Ready Player Me (Iframe)
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Chọn Mẫu 3D Có Sẵn
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Dán Link File .GLB 3D
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 relative bg-stone-900">
          {activeTab === 'create' && (
            <div className="w-full h-full relative">
              {isFrameLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900 text-white z-10">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
                  <p className="text-sm font-medium text-stone-200">Đang khởi tạo studio tạo mẫu 3D Ready Player Me...</p>
                  <p className="text-xs text-stone-400 mt-1">Bạn có thể tùy chỉnh khuôn mặt, kiểu tóc, vóc dáng 3D thực tế</p>
                </div>
              )}
              <iframe
                ref={frameRef}
                src={`https://${subdomain}.readyplayer.me/avatar?frameApi`}
                allow="camera *; microphone *; clipboard-write"
                className="w-full h-full border-none"
                title="Ready Player Me Avatar Creator"
              />
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="p-6 h-full overflow-y-auto bg-[#FAF8F5]">
              <h4 className="text-sm font-bold text-stone-800 mb-3">Danh Sách Nhân Vật Mẫu 3D</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presets.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectAvatarUrl(item.url);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      currentAvatarUrl === item.url
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-900">{item.name}</span>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      {currentAvatarUrl === item.url && (
                        <div className="p-1 rounded-full bg-amber-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-amber-700 font-semibold">
                      <span>Định dạng 3D: .GLB Đa Giác</span>
                      <span className="flex items-center gap-1 text-amber-800">
                        Áp dụng ngay <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="p-6 h-full flex flex-col justify-center max-w-lg mx-auto bg-[#FAF8F5]">
              <h4 className="text-sm font-bold text-stone-900 mb-2">Nhập Đường Dẫn Mô Hình 3D (.GLB)</h4>
              <p className="text-xs text-stone-500 mb-4">
                Bạn có thể dán đường dẫn file .glb xuất từ Ready Player Me (ví dụ: https://models.readyplayer.me/....glb)
              </p>
              <form onSubmit={handleApplyCustomUrl} className="flex flex-col gap-3">
                <input
                  type="url"
                  placeholder="https://models.readyplayer.me/648b26f5899fcb780ea2999e.glb"
                  value={customUrlInput}
                  onChange={e => setCustomUrlInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
                >
                  Nạp Mô Hình 3D Này Vào App
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
