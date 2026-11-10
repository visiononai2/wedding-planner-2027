import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Assignee } from '../../types/wedding';
import { ASSIGNEE_CONFIGS, ASSIGNEE_LIST } from '../../utils/taskHelpers';

interface ClickUpAssigneeDropdownProps {
  assignedTo: Assignee;
  onChange: (newAssignee: Assignee) => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  align?: 'left' | 'right';
  className?: string;
}

export const ClickUpAssigneeDropdown: React.FC<ClickUpAssigneeDropdownProps> = ({
  assignedTo,
  onChange,
  size = 'md',
  showLabel = true,
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConfig = ASSIGNEE_CONFIGS[assignedTo] || ASSIGNEE_CONFIGS.Both;

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

  const handleSelect = (a: Assignee, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(a);
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
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-800 transition-colors shadow-2xs whitespace-nowrap cursor-pointer ${
          size === 'sm' 
            ? (showLabel ? 'px-2.5 py-1 text-[11px]' : 'p-1 text-[9px]') 
            : 'px-3 py-1.5 text-xs'
        }`}
        title={`Assignee: ${currentConfig.label}`}
      >
        <span
          className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${currentConfig.avatarBg}`}
        >
          {currentConfig.initials}
        </span>
        {showLabel && (
          <span className="font-medium text-slate-700 whitespace-nowrap truncate max-w-[130px]">
            {assignedTo === 'Both' ? 'Parth & Nisha' : currentConfig.label}
          </span>
        )}
        <ChevronDown className="w-2.5 h-2.5 opacity-50 ml-0.5 shrink-0" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-48 rounded-2xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
            Assignee
          </div>
          <div className="space-y-0.5">
            {ASSIGNEE_LIST.map((a) => {
              const config = ASSIGNEE_CONFIGS[a];
              const isSelected = a === assignedTo;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={(e) => handleSelect(a, e)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl font-medium text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${config.avatarBg}`}
                    >
                      {config.initials}
                    </span>
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
