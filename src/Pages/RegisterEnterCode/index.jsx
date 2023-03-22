import styles from './registerCode.module.scss';
import logo from '../../assets/images/MediFlow_logo.svg';
import facebook_icon from '../../assets/icons/footer/facebook.svg';
import google_icon from '../../assets/icons/footer/google.svg';
import instagram_icon from '../../assets/icons/footer/instagram.svg';
import twitter_icon from '../../assets/icons/footer/twitter.svg';
import telegram_icon from '../../assets/icons/footer/telegram.svg';
import { Image } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterEnterCode = () => {

    let [code, setCode] = React.useState('');
    const changeCode = event => {
        setCode(event.target.value);
    }
    const [codeError, setCodeError] = React.useState('');
    const navigate = useNavigate();

    const checkCode = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/Institution/${code}`,
        }).then((response) => {
            localStorage.setItem('code', code);
            navigate('/code/register');
        }).catch(error => {
                setCodeError('В нашій системі немає цього закладу');
        });
    }

    const validation = () => {
        if(code === '')
            setCodeError('Заповніть це поле');
        else {
            if(code.length !== 8) {
                setCodeError('Код ЄДРПОУ повинен складатися з 8 цифр');
            }
            else {
                code = parseInt(code);
                if(!Number.isInteger(code))
                    setCodeError('Код ЄДРПОУ повинен складатися з цифр');
                else {
                    setCodeError('');
                    checkCode();
                }
            }
        }
    }

    useEffect(() => {
        document.title = 'MediFlow - Медична інформаційна система';
    }, []);

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.header__inner}>
                        <div className={styles.header__logo}><Image src={logo} alt="MediFlow logo" className={styles.logo} onClick={() => navigate('/home')}/></div>

                        <nav className={styles.navigation}>
                            <a href='/home' className={styles.nav__link}>Головна</a>
                            <a href='/login' className={styles.nav__link} >Авторизуватись</a>
                        </nav>
                    </div>
                </div>
            </header>

            <div className={styles.divideLine}></div>

            <div className={styles.headLine}>
                <h1>Створення профілю медичного працівника</h1>
            </div>

            <div className={styles.containerCodeSection}>
                <div className={styles.container_form}>
                    <form>
                        <div className={styles.form_group}>
                            <label htmlFor="input_code" className={styles.label}>ЄДРПОУ Медичного закладу</label>
                            <input type="text" id="input_code" className={styles.input} value={code} onChange={changeCode} maxLength='8'/>
                            <p className={styles.errors}>{codeError}</p>
                            <div className={styles.container_register_btn}><button type="button" className={styles.registerBtn} onClick={validation}>Розпочати реєстрацію</button></div>
                        </div>
                    </form>
                </div>
            </div>

            <div className={styles.footerSection}>
                <div className={styles.container}>
                    <div className={styles.footer__inner}>
                            <div className={styles.footer__logo}><Image src={logo} alt="MediFlow logo" className={styles.logo} onClick={() => navigate('/home')}/></div>

                            <div className={styles.socials}>
                                <div className={styles.social_item}><Image src={facebook_icon} alt="facebook icon"/></div>
                                <div className={styles.social_item}><Image src={google_icon} alt="google icon"/></div>
                                <div className={styles.social_item}><Image src={twitter_icon} alt="twitter icon"/></div>
                                <div className={styles.social_item}><Image src={instagram_icon} alt="instagram icon"/></div>
                                <div className={styles.social_item}><Image src={telegram_icon} alt="telegram icon"/></div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterEnterCode