import styles from './modal.module.scss'
import classNames from 'classnames'
import { Image } from 'react-bootstrap'
const Modal = props => {
    return(
        <div className={classNames(styles.modal_wrapper, `${props.isOpened ? styles.open: styles.close}`)} style={{...props.style}}>
            <div className={styles.modal_body}>
                <div className={styles.modal_close} onClick={props.onModalClose}>×</div>
                <Image src={props.icon} alt="icon" className={styles.modal_icon}/>
                <h2 className={styles.modal_title}>{props.title}</h2>
                <p className={styles.modal_description}>{props.description}</p>
                <button type='button' className={styles.modal_button} onClick={props.onModalClose}>{props.textBtn}</button>
                {props.children}
            </div>
        </div>
    )
}

export default Modal