import React, {useState} from 'react';
import Modal from '../../ModalWindows/Modal';
import success_icon from '../../assets/icons/success.png'
import { useNavigate} from 'react-router-dom';
import styles from './confirmEmail.module.scss';
import { useEffect } from 'react';

const ConfirmEmail = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState({
        modal: true
    })

    const setModalAndNavigate = () => {
        setModal({...modal, modal: false});
        navigate('/login');
    }

    useEffect(() => {
        document.title = 'MediFlow - Медична інформаційна система';
    }, []);

    return (
        <div className={styles.background}>
            <Modal icon={success_icon} title={'Email підтверджено'} description={'Тепер ви можете увійти в особистий кабінет'} textBtn={'Закрити'} isOpened={modal.modal} onModalClose={setModalAndNavigate}></Modal>
        </div>
    );
}

export default ConfirmEmail;