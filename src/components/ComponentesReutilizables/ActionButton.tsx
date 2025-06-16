import React from 'react';
import '../../assets/ActionButton.css';


interface ActionButtonProps {
  label: string;
  color?: string; // color de fondo
  onClick?: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, color = '#007bff', onClick, disabled }) => {
  return (
    <button
      className="action-button"
      style={{ backgroundColor: color }}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
};

export default ActionButton;
