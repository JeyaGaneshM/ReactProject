// SelectDropdown.tsx

import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  options: Option[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  onDoubleClick?: () => void; // Add onDoubleClick to the interface
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, selectedOption, onSelectOption, onDoubleClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: Option) => {
    onSelectOption(option.value);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '200px' }}>
      <div
        onClick={handleToggleDropdown}
        onDoubleClick={onDoubleClick} // Use onDoubleClick here
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#fff',
          color: '#333',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {selectedOption}
        <span style={{ marginLeft: '8px', fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1,
            border: '1px solid #ccc',
            borderRadius: '5px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            background: '#fff',
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              style={{
                padding: '10px',
                cursor: 'pointer',
                transition: 'background 0.3s',
                borderBottom: index === options.length - 1 ? 'none' : '1px solid #ccc',
              }}
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
