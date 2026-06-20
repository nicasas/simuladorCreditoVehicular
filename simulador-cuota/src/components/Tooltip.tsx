import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
}

export function Tooltip({ content }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [visible]);

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        className="ml-1.5 w-4 h-4 rounded-full bg-gray-200 text-gray-500 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setVisible(v => !v)}
        aria-label="Más información"
      >
        ?
      </button>
      {visible && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-6 left-0 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed"
        >
          {content}
          <div className="absolute -bottom-1.5 left-2 w-3 h-3 bg-gray-900 rotate-45" />
        </div>
      )}
    </span>
  );
}
