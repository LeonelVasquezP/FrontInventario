import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  color?: string; 
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, color = '#007bff', disabled = false }) => {
  const styles: React.CSSProperties = {
    backgroundColor: color,
    border: 'none',
    padding: '8px 14px',
    margin: '0 5px',
    borderRadius: '4px',
    color: 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  };

  return (
    <button
      style={styles}
      onClick={onClick}
      disabled={disabled}
      onMouseOver={(e) => {
        if (!disabled) (e.currentTarget.style.backgroundColor = shadeColor(color, -20));
      }}
      onMouseOut={(e) => {
        if (!disabled) (e.currentTarget.style.backgroundColor = color);
      }}
    >
      {label}
    </button>
  );
};


function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, R + (R * percent) / 100));
  G = Math.min(255, Math.max(0, G + (G * percent) / 100));
  B = Math.min(255, Math.max(0, B + (B * percent) / 100));

  const rStr = R.toString(16).padStart(2, '0');
  const gStr = G.toString(16).padStart(2, '0');
  const bStr = B.toString(16).padStart(2, '0');

  return `#${rStr}${gStr}${bStr}`;
}

export default ActionButton;
