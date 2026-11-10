import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { TaskStatus } from '../../types/wedding';
import { STATUS_CONFIGS, STATUS_LIST } from '../../utils/taskHelpers';

interface ClickUpStatusDropdownProps {
  status: TaskStatus;
  onChange: (newStatus: TaskStatus) => void;
  size?: 'sm' | 'md';
  align?: 'left' | 'right';
  className?: string;
}

export const ClickUpStatusDropdown: React.FC<ClickUpStatusDropdownProps> = ({
  status,
  onChange,
  size = 'md',
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConfig = STATUS_CONFIGS[status] || STATUS_CONFIGS.todo;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (s: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(s);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block text-left ${isOpen ? 'z-50' : ''} ${className}`}
      ref={containerRef}
      data-open={isOpen ? 'true' : 'false'}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center gap-1.5 font-medium tracking-wider uppercase rounded-full border transition-colors cursor-pointer whitespace-nowrap shadow-2xs hover:brightness-95 ${
          size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        } ${currentConfig.pillClasses}`}
        title="Change status"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${currentConfig.dotColor} shrink-0`} />
        <span>{currentConfig.label}</span>
        <ChevronDown className="w-2.5 h-2.5 opacity-50 ml-0.5 shrink-0" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-44 rounded-2xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
            Status
          </div>
          <div className="space-y-0.5">
            {STATUS_LIST.map((s) => {
              const config = STATUS_CONFIGS[s];
              const isSelected = s === status;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => handleSelect(s, e)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl font-medium text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <span className="text-[10px] tracking-wider uppercase">{config.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
