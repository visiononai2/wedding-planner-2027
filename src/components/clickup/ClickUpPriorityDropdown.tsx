import React, { useState, useRef, useEffect } from 'react';
import { Flag, ChevronDown, Check } from 'lucide-react';
import { TaskPriority } from '../../types/wedding';
import { PRIORITY_CONFIGS, PRIORITY_LIST } from '../../utils/taskHelpers';

interface ClickUpPriorityDropdownProps {
  priority: TaskPriority;
  onChange: (newPriority: TaskPriority) => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  align?: 'left' | 'right';
  className?: string;
}

export const ClickUpPriorityDropdown: React.FC<ClickUpPriorityDropdownProps> = ({
  priority,
  onChange,
  size = 'md',
  showLabel = true,
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConfig = PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS.medium;

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

  const handleSelect = (p: TaskPriority, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(p);
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
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors cursor-pointer whitespace-nowrap shadow-2xs hover:brightness-95 ${
          size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
        } ${currentConfig.badgeClasses}`}
        title={`Priority: ${currentConfig.label}`}
      >
        <Flag className={`w-3 h-3 ${currentConfig.flagColor} fill-current shrink-0`} />
        {showLabel && <span>{currentConfig.label}</span>}
        <ChevronDown className="w-2.5 h-2.5 opacity-50 ml-0.5 shrink-0" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-36 rounded-2xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
            Priority
          </div>
          <div className="space-y-0.5">
            {PRIORITY_LIST.map((p) => {
              const config = PRIORITY_CONFIGS[p];
              const isSelected = p === priority;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={(e) => handleSelect(p, e)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl font-medium text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Flag className={`w-3 h-3 ${config.flagColor} fill-current`} />
                    <span className="text-[11px]">{config.label}</span>
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
