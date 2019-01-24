import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#app');
ReactModal.defaultStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
    overflow: 'auto',
  },
  content: {
    minHeight: '100%',
    padding: '1.5rem 4rem 6rem',
    borderRadius: '0.25rem'
  }
};

const Modal = (props) => {
  const { modalIsOpen, children } = props;
  console.log(ReactModal.defaultStyles);
  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={() => {
        document.body.removeAttribute('style');
        props.history.goBack();
      }}
      onAfterOpen={() => document.body.style.overflow = 'hidden'}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;