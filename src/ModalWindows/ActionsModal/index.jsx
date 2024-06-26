import styles from './actionsModal.module.scss';
import classNames from 'classnames';
import ItemAction from '../../Components/ItemAction';

const ActionsModal = (props) => {
  return (
    <div
      className={classNames(
        styles.modal_wrapper,
        `${props.isOpened ? styles.fadeIn : styles.fadeOut}`,
      )}
      style={{ ...props.style }}
      id='modal'
    >
      <div className={styles.modal_body}>
        <div className={styles.modal_close}>
          <button onClick={props.onModalClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <div className={styles.userAndNavFlex}>
          <ItemAction key={props.item.patientId} item={props.item} />
          <div className={styles.navigationFlex}>
            <div className={styles.navigation}>
              <a
                href='medical-events/patient-episodes'
                className={styles.navItem}
                target='_blank'
                onClick={() =>
                  localStorage.setItem('patientId', props.item.patientId)
                }
              >
                Амбулаторні епізоди
              </a>
              <a
                href='patient-procedures'
                className={styles.navItem}
                target='_blank'
                onClick={() =>
                  localStorage.setItem('patientId', props.item.patientId)
                }
              >
                Процедури
              </a>
              <a
                href='patient-referrals'
                className={styles.navItem}
                target='_blank'
                onClick={() =>
                  localStorage.setItem('patientId', props.item.patientId)
                }
              >
                Направлення пацієнта
              </a>
            </div>
            <div className={styles.navigation}>
              <a
                href='medical-events/inpatient-episodes'
                className={styles.navItem}
                target='_blank'
              >
                Стаціонарні епізоди
              </a>
              <a
                href='patient-diagnostic-reports'
                className={styles.navItem}
                target='_blank'
                onClick={() =>
                  localStorage.setItem('patientId', props.item.patientId)
                }
              >
                Дігностичні звіти
              </a>
              <a
                href='medical-events/hospitalization'
                className={styles.navItem}
                target='_blank'
                onClick={() =>
                  localStorage.setItem('patientId', props.item.patientId)
                }
              >
                Госпіталізація
              </a>
            </div>
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default ActionsModal;
