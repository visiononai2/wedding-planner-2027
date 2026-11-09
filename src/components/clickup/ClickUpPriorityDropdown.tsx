import React, { useState, useRef, useEffect } from 'react';
import { Flag, ChevronDown, Check } from 'lucide-react';
import { TaskPriority } from '../../types/wedding';
import { PRIORITY_CONFIGS, PRIORITY_LIST } from '../../utils/taskHelpers';

interface ClickUpPriorityDropdownProps {
  priority: TaskPriority;
  onChange: (newPriority: TaskPriority) => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const ClickUpPriorityDropdown: React.FC<ClickUpPriorityDropdownProps> = ({
  priority,
  onChange,
  size = 'md',
  showLabel = true,
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
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 ${
          size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
        } ${currentConfig.badgeClasses} hover:brightness-95`}
        title={`Priority: ${currentConfig.label}`}
      >
        <Flag className={`w-3 h-3 ${currentConfig.flagColor} fill-current`} />
        {showLabel && <span>{currentConfig.label}</span>}
        <ChevronDown className="w-2.5 h-2.5 opacity-50 ml-0.5" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1.5 w-36 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_16px_40px_rgba(28,25,23,0.12)] border border-stone-200/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[9px] font-semibold text-stone-400 uppercase tracking-widest">
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
                      ? 'bg-stone-900 text-stone-50 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100/80'
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
