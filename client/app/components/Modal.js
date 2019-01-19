import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#app');
ReactModal.defaultStyles.overlay.zIndex = 999;

const Modal = (props) => {
  const { modalIsOpen, children } = props;
  console.log(ReactModal.defaultStyles);
  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={() => props.history.goBack()}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;