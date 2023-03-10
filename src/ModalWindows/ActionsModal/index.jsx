import styles from './actionsModal.module.scss'
import classNames from 'classnames'
import ItemAction from '../../Components/ItemAction'

const ActionsModal = props => {

    return(
        <div className={classNames(styles.modal_wrapper, `${props.isOpened ? styles.open: styles.close}`)} style={{...props.style}}>
            <div className={styles.modal_body}>
                <div className={styles.modal_close}><button onClick={props.onModalClose} className={styles.closeBtn}>×</button></div>
                <div className={styles.userAndNavFlex}>
                    <ItemAction key={props.item.patientId} item={props.item}/>
                    <div className={styles.navigation}>
                        <a href="#" className={styles.navItem}>Амбулаторні епізоди</a>
                        <a href="patient-procedures" className={styles.navItem} target='_blank' onClick={() => localStorage.setItem('patientId', props.item.patientId)}>Процедури</a>
                        <a href="patient-referrals" className={styles.navItem} target='_blank' onClick={() => localStorage.setItem('patientId', props.item.patientId)}>Направлення пацієнта</a>
                        <a href="#" className={styles.navItem}>Медичні висновки</a>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default ActionsModal