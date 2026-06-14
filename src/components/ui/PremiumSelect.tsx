import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

interface PremiumSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function PremiumSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
}: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-40" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface-elevated border border-surface-border 
                   hover:border-indigo-500/40 focus:border-indigo-500 
                   px-3 py-2.5 rounded-xl text-sm font-medium text-left
                   transition-all duration-200 focus:outline-none focus:text-text-primary focus:ring-2 focus:ring-indigo-500/20 text-text-secondary "
      >
        <span className=" truncate">{selectedLabel}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute mt-2 w-full bg-surface-elevated border border-surface-border 
                        rounded-3xl py-2 shadow-2xl shadow-black/60 z-50 max-h-80 overflow-auto
                        backdrop-blur-2xl hide-scrollbar"
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-3 text-left text-sm hover:bg-surface-hover transition-colors
                ${
                  option.value === value
                    ? "text-brand-primary bg-indigo-500/10 font-medium"
                    : "text-text-primary"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
