import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string | number;
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  type?: 'text' | 'number';
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  className = '',
  inputClassName = '',
  multiline = false,
  type = 'text',
  placeholder = 'Click to edit...',
  prefix = '',
  suffix = '',
  as: Component = 'span'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentVal(String(value ?? ''));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentVal !== String(value)) {
      onSave(currentVal);
    }
  };

  const handleCancel = () => {
    setCurrentVal(String(value ?? ''));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!multiline || e.ctrlKey || e.metaKey) {
        e.preventDefault();
        handleSave();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <span 
        className="inline-flex items-center gap-1 max-w-full" 
        onClick={(e) => e.stopPropagation()}
      >
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            rows={2}
            className={`px-2 py-1 bg-white border border-indigo-600 rounded-lg text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full min-w-[200px] ${inputClassName}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`px-2 py-0.5 bg-white border border-indigo-600 rounded-lg text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px] ${inputClassName}`}
          />
        )}
        <button
          type="button"
          onClick={handleSave}
          title="Save (Enter)"
          className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shrink-0"
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          title="Cancel (Esc)"
          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </span>
    );
  }

  return (
    <Component
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`group relative inline-flex items-center gap-1 cursor-pointer rounded px-1 -mx-1 hover:bg-gray-100 transition-colors ${className}`}
      title="Click or hover to edit"
    >
      <span>
        {prefix}
        {value !== undefined && value !== null && String(value).trim() !== '' ? (
          String(value)
        ) : (
          <span className="italic text-gray-400">{placeholder}</span>
        )}
        {suffix}
      </span>
      {/* 50% visible edit icon on hover as explicitly requested */}
      <span 
        className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity text-gray-500 hover:text-gray-900 shrink-0"
        aria-hidden="true"
      >
        <Pencil className="w-3 h-3 ml-0.5" />
      </span>
    </Component>
  );
};
