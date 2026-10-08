import React from 'react';
import { normalizeHex } from '../utils/outfitColor';

export function HexColorInput({ value, onChange, className }: { value: string; onChange: (hex: string) => void; className?: string }) {
  const [draft, setDraft] = React.useState(value.slice(1));
  React.useEffect(() => setDraft(value.slice(1)), [value]);
  const commit = () => {
    const hex = normalizeHex('#' + draft);
    if (hex) { onChange(hex); setDraft(hex.slice(1)); }
    else setDraft(value.slice(1));
  };
  return <input type="text" aria-label="Mã màu Hex" value={draft} maxLength={6} className={className}
    onChange={e => setDraft(e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6))}
    onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />;
}
