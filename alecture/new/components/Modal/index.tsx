import React, { FC, useCallback } from 'react';
import { CloseModalButton, CreateModal } from './styles';

interface ModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<ModalProps> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
