// src/components/ComponentesReutilizables/SearchableSelect.tsx
import React, { useState, useEffect, useRef } from 'react';

interface Option {
  id: number | string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: number | string | null;
  onChange: (value: number | string | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecciona...',
  label,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(filter.toLowerCase())
  );

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.id === value)?.label || '';

  return (
    <div className="searchable-select" ref={containerRef} style={{ position: 'relative' }}>
      {label && <label className="form-label">{label}</label>}
      <div
        className={`form-control dropdown-toggle ${disabled ? 'disabled' : ''}`}
        role="combobox"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        style={{ userSelect: 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {selectedLabel || placeholder}
      </div>
      {open && (
        <div
          className="dropdown-menu show"
          style={{
            maxHeight: 200,
            overflowY: 'auto',
            width: '100%',
            position: 'absolute',
            zIndex: 1050,
          }}
        >
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Buscar..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            autoFocus
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <button
                key={opt.id}
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                  setFilter('');
                }}
              >
                {opt.label}
              </button>
            ))
          ) : (
            <div className="dropdown-item disabled text-muted">No encontrado</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
