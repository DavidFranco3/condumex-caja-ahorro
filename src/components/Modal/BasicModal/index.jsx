import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './BasicModal.scss'

function BasicModal ({
  show,
  setShow,
  title,
  children,
  size = 'lg',
  centered = true,
  backdrop = 'static',
  keyboard = false,
  ...rest
}) {
  const handleClose = () => {
    if (setShow) setShow(false)
  }

  return (
    <Modal
      className='basic-modal-principal'
      show={show}
      onHide={handleClose}
      size={size}
      centered={centered}
      backdrop={backdrop}
      keyboard={keyboard}
      {...rest}
    >
      <ModalHeader>
        {title && <h2>{title}</h2>}
        {/* Usamos un div en lugar de Modal.Title para evitar inconsistencias de encabezados (h2) y dotamos de a11y al botón de cerrar */}
        <div
          className='modal-title'
          role='button'
          tabIndex={0}
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClose()
            }
          }}
          aria-label='Cerrar modal'
          title='Cerrar'
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </div>
      </ModalHeader>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  )
}

BasicModal.propTypes = {
  /** Indica si se muestra o se oculta el modal */
  show: PropTypes.bool.isRequired,
  /** Función para actualizar el estado de visibilidad del modal */
  setShow: PropTypes.func.isRequired,
  /** Título principal del modal */
  title: PropTypes.string,
  /** Contenido interno del modal */
  children: PropTypes.node,
  /** Tamaño del modal ('sm', 'lg', 'xl') - Default ('lg') */
  size: PropTypes.string,
  /** Centrar verticalmente el modal en la pantalla - Default (true) */
  centered: PropTypes.bool,
  /** Define la interacción al dar click fuera del modal - Default ('static') */
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['static'])
  ]),
  /** Permite cerrar el modal con la tecla Esc - Default (false) */
  keyboard: PropTypes.bool
}

export default BasicModal
