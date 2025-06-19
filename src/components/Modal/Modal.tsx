// src/components/ControlesFormulario/Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import "../../assets/Modal.css";

interface ModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl'; 
}

const Modal: React.FC<ModalProps> = ({ show, title, onClose, children, size = 'lg' }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      >
        <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
