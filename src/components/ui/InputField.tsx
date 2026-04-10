import React from 'react';
import { Search } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  suggestions?: string[];
  onSuggestionClick?: (value: string) => void;
}

export default function InputField({
  label,
  icon,
  suggestions,
  onSuggestionClick,
  className = '',
  ...props
}: InputFieldProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const filteredSuggestions = suggestions?.filter(
    (s) =>
      !props.value ||
      s.toLowerCase().includes((props.value as string).toLowerCase())
  );

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
          {icon || <Search size={16} />}
        </div>
        <input
          {...props}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={[
            'w-full bg-navy-900 border border-white/15 rounded-xl',
            'pl-10 pr-4 py-3.5 text-white placeholder-white/35',
            'focus:outline-none focus:border-accent-red/60 focus:bg-navy-800',
            'transition-all duration-200 text-sm',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      {showSuggestions && filteredSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-navy-800 border border-white/15 rounded-xl overflow-hidden z-50 shadow-card-hover animate-fade-in">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => onSuggestionClick?.(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-150 flex items-center gap-2"
            >
              <Search size={13} className="text-accent-red/70" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
