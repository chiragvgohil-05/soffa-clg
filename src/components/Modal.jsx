// components/Modal.jsx
import { useEffect } from 'react';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   showCloseButton = true,
                   closeOnOverlayClick = true,
                   closeOnEscape = true,
                   size = 'medium'
               }) => {
    useEffect(() => {
        if (!closeOnEscape || !isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, closeOnEscape]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'modal-small';
            case 'large': return 'modal-large';
            case 'full': return 'modal-full';
            default: return 'modal-medium';
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-content ${getSizeClass()}`}>
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && <h2 className="modal-title">{title}</h2>}
                        {showCloseButton && (
                            <button
                                className="modal-close-btn"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                <div className="modal-body">{children}</div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    animation: modalAppear 0.2s ease-out;
                }
                .modal-small { max-width: 400px; width: 100%; }
                .modal-medium { max-width: 600px; width: 100%; }
                .modal-large { max-width: 800px; width: 100%; }
                .modal-full {
                    width: 95vw;
                    height: 95vh;
                    max-width: none;
                    max-height: none;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px 16px;
                    border-bottom: 1px solid #e5e7eb;
                }
                .modal-title {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                }
                .modal-close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 4px;
                    color: #6b7280;
                    border-radius: 4px;
                    line-height: 1;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .modal-close-btn:hover {
                    background-color: #f3f4f6;
                    color: #374151;
                }
                .modal-body {
                    padding: 24px;
                }
                @keyframes modalAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                @media (max-width: 640px) {
                    .modal-overlay { padding: 10px; }
                    .modal-content { max-height: 95vh; }
                    .modal-small,
                    .modal-medium,
                    .modal-large {
                        width: 100%;
                        max-width: none;
                    }
                    .modal-header { padding: 16px 20px 12px; }
                    .modal-body { padding: 20px; }
                    .modal-title { font-size: 1.125rem; }
                }
            `}</style>
        </div>
    );
};

export default Modal;
