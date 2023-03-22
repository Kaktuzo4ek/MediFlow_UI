import axios from "axios";
import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import styles from './login.module.scss'
import logo from '../../assets/images/MediFlow_logo.svg'
import jwt from 'jwt-decode'
import Loader from "../../ModalWindows/Loader";

const Login  = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [type, setType ] = useState('password');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    let see = document.getElementById('see');

    const navigate = useNavigate();
    const changeType = () => {
        const see = document.getElementById('see');
        see.classList.toggle(styles.see_active);

        if(type === 'text') 
            setType('password');
        if(type === 'password')
            setType('text');
    }

    const changeEmail = event => {
        setEmail(event.target.value);
    }
    const changePassword = event => {
        setPassword(event.target.value);
    }
    
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = () => {
        setIsLoading(true);
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/Auth/Login',
            data: {
                email,
                password,
            }
          }).then((response) => {
                localStorage.setItem('token', response.data.message);
                const token = response.data.message;
                localStorage.setItem('user', JSON.stringify(jwt(token)));
                setIsLoading(false);
                navigate('/doctor/main-page');
        }).catch(error => {
            setIsLoading(false);
            if(error.response.data.message === 'Invalid password')
            {
                setPasswordError('Невірний пароль');
                see.classList.toggle(styles.see_error);
            }
            if(error.response.data.message === 'Confrirm email to login')
            {
                setEmailError('Підтвердіть свій email щоб увійти');
            }
            else
                setEmailError('Користувача з таким email не існує');
            if(error.response.data.message === 'Not Confirmed')
                setEmailError('Ваш профіль не затвердив головний лікар');

        })
    }

    const authorize = () => {
        if(email === '')
            setEmailError('Заповніть це поле');
        else
            setEmailError('');

        if(password === '')
        {
            see = document.getElementById('see');
            see.classList.add(styles.see_error);
            setPasswordError('Заповніть це поле');
        } else {
            setPasswordError('');
            see.classList.remove(styles.see_error);
        }

        if(email && password !== '') {
            setEmailError('');
            setPasswordError('');
            loginUser();
        }
    }

        return (
            <div className={styles.container_flex}>
                <Loader isLoading={isLoading}/>
                <div className={styles.left_part}></div>
                <div className={styles.right_part}>
                    <div className={styles.container_logo}><Image src={logo} alt="MediFlow logo" className={styles.logo} onClick={() => navigate('/home')}/></div>
                    <div className={styles.container_title}><h3 className={styles.login_title}><strong>Увійти</strong> в особистий кабінет</h3></div>
                    <div className={styles.container_form}>
                        <form>
                            <div className={styles.form_group}>
                                <label htmlFor="input_email" className={styles.label}>Email</label>
                                <input type="email" id="input_email"  className={styles.input} value={email} onChange={changeEmail}/>
                                <p className={styles.errors}>{emailError}</p>
                            </div>
                            <div className={styles.form_group}>
                                <label htmlFor="input_password" className={styles.label}>Пароль</label>
                                <input type={type} id="input_password" className={styles.input} value={password} onChange={changePassword}/>
                                <p className={styles.errors}>{passwordError}</p>
                                <svg className={styles.see_icon} viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={changeType} id="see">
                                            <path d="M20.9511 7.24698C20.9441 7.22957 20.9363 7.21243 20.9279 7.19557C19.9966 5.34906 18.5473 3.78715 16.7368 2.67861C14.8765 1.5396 12.7199 0.937622 10.5002 0.937622C8.28049 0.937622 6.12377 1.53969 4.2635 2.6788C2.4596 3.78325 1.01435 5.33794 0.0827079 7.17556C-0.0217027 7.36649 -0.0294656 7.59735 0.0720339 7.79866C1.00319 9.64544 2.45252 11.2076 4.26321 12.3164C6.12358 13.4556 8.2803 14.0576 10.5002 14.0576C12.72 14.0576 14.8767 13.4556 16.737 12.3164C18.5477 11.2078 19.9969 9.64572 20.9281 7.79912C21.0153 7.62616 21.0234 7.42596 20.9511 7.24698ZM10.5002 12.6679C6.75625 12.6679 3.27878 10.6494 1.54261 7.49748C3.27878 4.34558 6.75625 2.32713 10.5002 2.32713C14.244 2.32713 17.7216 4.34577 19.4578 7.49758C17.7215 10.6492 14.2439 12.6679 10.5002 12.6679Z"></path>
                                            <path d="M10.5002 4.44812C8.73896 4.44812 7.30603 5.81614 7.30603 7.49756C7.30603 9.17898 8.73896 10.547 10.5002 10.547C12.2614 10.547 13.6943 9.17898 13.6943 7.49756C13.6943 5.81614 12.2614 4.44812 10.5002 4.44812ZM10.5002 9.1574C9.54154 9.1574 8.76157 8.41276 8.76157 7.49756C8.76157 6.58237 9.54154 5.83773 10.5002 5.83773C11.4588 5.83773 12.2387 6.58237 12.2387 7.49756C12.2387 8.41276 11.4588 9.1574 10.5002 9.1574Z"></path>
                                </svg>
                                <div className={styles.container_forget}><a href="/forgetPassword" className={styles.linksAnimate}>Забули пароль?</a></div>
                            </div>
                            <div className={styles.container_login_btn}><button type="button" className={styles.loginBtn} onClick={authorize}>Увійти</button></div>
                        </form>
                    </div>
                    <div className={styles.container_register}>
                        <div className={styles.registration_text}>
                            <p className={styles.registration_desc}>Не маєте акаунту? <a href="/code" className={styles.linksAnimate}><strong>Зареєстуватися</strong></a></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

export default Login