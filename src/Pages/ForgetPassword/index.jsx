import axios from "axios";
import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import styles from './forgetPassword.module.scss';
import logo from '../../assets/images/MediFlow_logo.svg';
import Modal from '../../ModalWindows/Modal';
import success_icon from '../../assets/icons/success.png'

const ForgetPassword  = () => {
    const [email, setEmail] = React.useState('');
    const navigate = useNavigate();
    const [emailError, setEmailError] = React.useState('');
    const [modal, setModal] = useState({
        modal: false
    })

    const setModalAndNavigate = () => {
        setModal({...modal, modal: false});
        navigate('/resetPassword');
    }

    const changeEmail = event => {
        setEmail(event.target.value);
    }

    const resetPassword = () => {
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/Auth/ForgetPassword',
            params: {
                email: email
              },
          }).then((response) => {
                setModal({...modal, modal: true});
        }).catch(error => console.error(`Error: ${error}`));;
    }

    const requestCheckEmail = () => {
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/Auth/CheckEmail',
            data: {
                email
            }
          }).then((response) => {
                localStorage.setItem('email', response.data.message);
                resetPassword();
    
        }).catch(error => {
            if(error.response.data.message !== email)
                setEmailError('Користувача з таким email не існує');
        })
    }

    const checkEmail = () => {
        if(email === '')
            setEmailError('Заповніть це поле');
        else
            setEmailError('');

        if(email !== '') {
            setEmailError('');
            requestCheckEmail();
        }
    }

        return (
            <div>
                <Modal icon={success_icon} title={'Лист успішно надіслано'} description={'Перевірте свою поштову скриньку та слідуйте інструкціям, які описані в листі'} textBtn={'Закрити'} isOpened={modal.modal} onModalClose={setModalAndNavigate}></Modal>
                <div className={styles.container_flex}>
                    <div className={styles.left_part}></div>
                    <div className={styles.right_part}>
                        <div className={styles.container_logo} onClick={() => {navigate('/home')}}><Image src={logo} alt="MediFlow logo" className={styles.logo}/></div>
                        <div className={styles.container_title}><h3 className={styles.login_title}><strong>Відновити</strong> пароль</h3></div>
                        <div className={styles.container_form}>
                            <form>
                                <div className={styles.form_group}>
                                    <label htmlFor="input_email" className={styles.label}>Email</label>
                                    <input type="email" id="input_email"  className={styles.input} value={email} onChange={changeEmail}/>
                                    <p className={styles.errors}>{emailError}</p>
                                </div>
                                <div className={styles.container_login_btn}><button type="button" className={styles.loginBtn} onClick={checkEmail}>Надіслати лист</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

export default ForgetPassword