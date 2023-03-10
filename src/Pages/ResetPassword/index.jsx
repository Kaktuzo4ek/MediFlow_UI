import axios from "axios";
import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import styles from './resetPassword.module.scss';
import logo from '../../assets/images/MediFlow_logo.svg';
import classNames from "classnames";
import Modal from '../../ModalWindows/Modal';
import success_icon from '../../assets/icons/success.png';

const ResetPassword  = () => {
    const [newPassword, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [token, setToken] = React.useState('');
    const [tokenError, setTokenError] = React.useState('');
    const [type, setType ] = useState('password');
    const [typeConfirm, setTypeConfirm] = useState('password');
    const [passwordError, setPasswordError] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
    let see = document.getElementById('see');
    let seeConfirm = document.getElementById('see_confirm');
    let email = localStorage.getItem('email');
    const navigate = useNavigate();
    const [modal, setModal] = useState({
        modal: false
    })

    const setModalAndNavigate = () => {
        setModal({...modal, modal: false});
        navigate('/login');
    }

    const changePasswordType = () => {
        const see = document.getElementById('see');
        see.classList.toggle(styles.see_active);

        if(type === 'text') 
            setType('password');
        if(type === 'password')
            setType('text');
    }

    const changePasswordConfirmType = () => {
        const seeConfirm = document.getElementById('see_confirm');
        seeConfirm.classList.toggle(styles.see_active);

        if(typeConfirm === 'text') 
            setTypeConfirm('password');
        if(typeConfirm === 'password')
            setTypeConfirm('text');
    }

    const changePassword = event => {
        setPassword(event.target.value);
    }

    const changeConfirmPassword = event => {
        setConfirmPassword(event.target.value);
    }

    const changeToken = event => {
        setToken(event.target.value);
    }

    const requestResetPassword = () => {
        axios({
            method: 'post',
            headers: { "Content-Type": "multipart/form-data" },
            url: 'http://localhost:5244/api/Auth/ResetPassword',
            data: {
                token,
                email,
                newPassword,
                confirmPassword
            }
            }).then((response) => {
                setModal({...modal, modal: true});
            }).catch(error => {
                /*if(error.response.data.message !== email)
                    setEmailError('Користувача з таким email не існує');*/
            });
    }

    const validation = () => {
        if(newPassword === '')
        {
            see = document.getElementById('see');
            see.classList.add(styles.see_error);
            setPasswordError('Заповніть це поле');
        } else {
            setPasswordError('');
            see.classList.remove(styles.see_error);
        }

        if(confirmPassword === '')
        {
            seeConfirm = document.getElementById('see_confirm');
            seeConfirm.classList.add(styles.see_error);
            setConfirmPasswordError('Заповніть це поле');
        } else {
            setConfirmPasswordError('');
            seeConfirm.classList.remove(styles.see_error);
        }

        if(token === '')
            setTokenError('Заповніть це поле');
        else
            setTokenError('');

        if(newPassword !== confirmPassword)
        {
            seeConfirm = document.getElementById('see_confirm');
            seeConfirm.classList.add(styles.see_error);
            setConfirmPasswordError('Паролі не співпадають');
        }

        if(token && email !== '' && confirmPassword === newPassword && newPassword !== '' && confirmPassword !== '') {
            setPasswordError('');
            setConfirmPasswordError('');
            setTokenError('');
            requestResetPassword();
        }
    }

        return (
            <div>
                <Modal icon={success_icon} title={'Пароль успішно змінено'} description={'Тепер ви можете авторизуватися використавши новий пароль'} textBtn={'Закрити'} isOpened={modal.modal} onModalClose={setModalAndNavigate}></Modal>
                <div className={styles.container_flex}>
                    <div className={styles.left_part}></div>
                    <div className={styles.right_part}>
                        <div className={styles.container_logo}><Image src={logo} alt="MediFlow logo" className={styles.logo} onClick={() => navigate('/home')}/></div>
                        <div className={styles.container_title}><h3 className={styles.login_title}><strong>Встановити</strong> новий пароль</h3></div>
                        <div className={styles.container_form}>
                            <form>
                                <div className={styles.form_group}>
                                    <label htmlFor="input_token" className={styles.label}>Токен</label>
                                    <input type='text' id="input_token" className={styles.input} value={token} onChange={changeToken}/>
                                    <p className={styles.errors}>{tokenError}</p>
                                </div>
                                <div className={classNames(styles.form_group, styles.form_group_no_margin)}>
                                    <label htmlFor="input_password" className={styles.label}>Пароль</label>
                                    <input type={type} id="input_password" className={styles.input} value={newPassword} onChange={changePassword}/>
                                    <p className={styles.errors}>{passwordError}</p>
                                    <svg className={styles.see_icon} viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={changePasswordType} id="see">
                                                <path d="M20.9511 7.24698C20.9441 7.22957 20.9363 7.21243 20.9279 7.19557C19.9966 5.34906 18.5473 3.78715 16.7368 2.67861C14.8765 1.5396 12.7199 0.937622 10.5002 0.937622C8.28049 0.937622 6.12377 1.53969 4.2635 2.6788C2.4596 3.78325 1.01435 5.33794 0.0827079 7.17556C-0.0217027 7.36649 -0.0294656 7.59735 0.0720339 7.79866C1.00319 9.64544 2.45252 11.2076 4.26321 12.3164C6.12358 13.4556 8.2803 14.0576 10.5002 14.0576C12.72 14.0576 14.8767 13.4556 16.737 12.3164C18.5477 11.2078 19.9969 9.64572 20.9281 7.79912C21.0153 7.62616 21.0234 7.42596 20.9511 7.24698ZM10.5002 12.6679C6.75625 12.6679 3.27878 10.6494 1.54261 7.49748C3.27878 4.34558 6.75625 2.32713 10.5002 2.32713C14.244 2.32713 17.7216 4.34577 19.4578 7.49758C17.7215 10.6492 14.2439 12.6679 10.5002 12.6679Z"></path>
                                                <path d="M10.5002 4.44812C8.73896 4.44812 7.30603 5.81614 7.30603 7.49756C7.30603 9.17898 8.73896 10.547 10.5002 10.547C12.2614 10.547 13.6943 9.17898 13.6943 7.49756C13.6943 5.81614 12.2614 4.44812 10.5002 4.44812ZM10.5002 9.1574C9.54154 9.1574 8.76157 8.41276 8.76157 7.49756C8.76157 6.58237 9.54154 5.83773 10.5002 5.83773C11.4588 5.83773 12.2387 6.58237 12.2387 7.49756C12.2387 8.41276 11.4588 9.1574 10.5002 9.1574Z"></path>
                                    </svg>
                                </div>
                                <div className={styles.form_group}>
                                    <label htmlFor="input_confirmPassword" className={styles.label}>Підтвердіть пароль</label>
                                    <input type={typeConfirm} id="input_confirmPassword" className={styles.input} value={confirmPassword} onChange={changeConfirmPassword}/>
                                    <p className={styles.errors}>{confirmPasswordError}</p>
                                    <svg className={styles.see_icon} viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={changePasswordConfirmType} id="see_confirm">
                                                <path d="M20.9511 7.24698C20.9441 7.22957 20.9363 7.21243 20.9279 7.19557C19.9966 5.34906 18.5473 3.78715 16.7368 2.67861C14.8765 1.5396 12.7199 0.937622 10.5002 0.937622C8.28049 0.937622 6.12377 1.53969 4.2635 2.6788C2.4596 3.78325 1.01435 5.33794 0.0827079 7.17556C-0.0217027 7.36649 -0.0294656 7.59735 0.0720339 7.79866C1.00319 9.64544 2.45252 11.2076 4.26321 12.3164C6.12358 13.4556 8.2803 14.0576 10.5002 14.0576C12.72 14.0576 14.8767 13.4556 16.737 12.3164C18.5477 11.2078 19.9969 9.64572 20.9281 7.79912C21.0153 7.62616 21.0234 7.42596 20.9511 7.24698ZM10.5002 12.6679C6.75625 12.6679 3.27878 10.6494 1.54261 7.49748C3.27878 4.34558 6.75625 2.32713 10.5002 2.32713C14.244 2.32713 17.7216 4.34577 19.4578 7.49758C17.7215 10.6492 14.2439 12.6679 10.5002 12.6679Z"></path>
                                                <path d="M10.5002 4.44812C8.73896 4.44812 7.30603 5.81614 7.30603 7.49756C7.30603 9.17898 8.73896 10.547 10.5002 10.547C12.2614 10.547 13.6943 9.17898 13.6943 7.49756C13.6943 5.81614 12.2614 4.44812 10.5002 4.44812ZM10.5002 9.1574C9.54154 9.1574 8.76157 8.41276 8.76157 7.49756C8.76157 6.58237 9.54154 5.83773 10.5002 5.83773C11.4588 5.83773 12.2387 6.58237 12.2387 7.49756C12.2387 8.41276 11.4588 9.1574 10.5002 9.1574Z"></path>
                                    </svg>
                                </div>
                                <div className={styles.container_login_btn}><button type="button" className={styles.loginBtn} onClick={validation}>Змінити пароль</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

export default ResetPassword