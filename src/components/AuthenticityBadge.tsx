import React from 'react';
import { AuthenticityLevel } from '../types/vietphuc';

const META: Record<AuthenticityLevel, { label: string; cls: string; title: string }> = {
  documented: {
    label: 'Có tư liệu',
    cls: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: 'Có hiện vật, ảnh tư liệu hoặc ghi chép sử liệu trực tiếp'
  },
  reconstructed: {
    label: 'Phỏng dựng',
    cls: 'bg-sky-100 text-sky-800 border-sky-200',
    title: 'Phục dựng từ nguồn gián tiếp (tượng, tranh, thư tịch); chi tiết có thể khác nhau'
  },
  modern: {
    label: 'Cách tân cận đại',
    cls: 'bg-violet-100 text-violet-800 border-violet-200',
    title: 'Cải cách thời trang có tác giả, niên đại xác định'
  }
};

export const AuthenticityBadge: React.FC<{ level: AuthenticityLevel }> = ({ level }) => {
  const m = META[level];
  return (
    <span title={m.title} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${m.cls}`}>
      {m.label}
    </span>
  );
};
