import { React, useState, useEffect } from "react"
import styles from './header.module.scss'
import { Image } from "react-bootstrap"
import logo from '../../assets/images/MediFlow_logo.svg'
import userPhoto from '../../assets/icons/profilePage/userPhoto.png'
import edit2_icon from '../../assets/icons/profilePage/edit2.png'
import logout1_icon from '../../assets/icons/profilePage/logout.png'
import down1_icon from  '../../assets/icons/profilePage/down1.png'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {ReactComponent as MediFlowLogo} from '../../assets/images/MediFlow_logo_small.svg'
import classNames from 'classnames'

const Header = (props) => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    let user;

    const [username, setUsername] = useState('');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    let role = userToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];


    useEffect(() => {
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                setUsername(`${user.surname} ${user.name} ${user.patronymic}`);
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

  return (
                <header className={styles.header}>
                    <div className={styles.container}>
                        <div className={styles.header__inner}>
                            <div className={styles.flexLogoAndHamburger}>
                                <div className={styles.containerForLogo}>
                                    <MediFlowLogo alt="MediFlow logo" className={styles.logo} onClick={()=> {navigate('../doctor/main-page')}}/>
                                </div>
                                <div className={classNames(styles.hamburger, props.isActiveHamburger && styles.isActive)} onClick={() => props.isActiveHamburger ? props.setIsActiveHamburger(false) : props.setIsActiveHamburger(true)}>
                                    <span className={styles.line}></span>
                                    <span className={styles.line}></span>
                                    <span className={styles.line}></span>
                                </div>
                            </div>

                            <nav className={styles.navigation}>
                                <div className={styles.navigationUser}>
                                    <span className={styles.username}>{username}</span>
                                    <Image src={userPhoto} alt='user photo' className={styles.userPhoto}/>
                                    <Image src={down1_icon} alt='down icon' className={styles.downIcon}/>
                                    <div className={styles.subMenuWrap}>
                                        <div className={styles.subMenu}>
                                            <div className={styles.userInfo}>
                                                <div className={styles.loginAsBlock}>
                                                    <span className={styles.titleLoginAs}>Ви зайшли як: </span> 
                                                    <span className={styles.textLoginAs}>{username}</span>
                                                </div>
                                                <div className={styles.roleBlock}>
                                                    <span className={styles.titleLoginAs}>Тип профілю: </span> 
                                                    <span className={styles.textLoginAs}>{role}</span>
                                                </div>
                                                <hr/>
                                                <div className={styles.profileEditBlock} onClick={()=> {navigate('../doctor/profile-edit')}}>
                                                    <Image src={edit2_icon} alt='edit icon' className={styles.editIcon}/>
                                                    <a href='../doctor/profile-edit' className={styles.profileOptionText}>Редагувати профіль</a>
                                                </div>
                                                <hr/>
                                                <div className={styles.logoutBlock} onClick={logout}>
                                                    <Image src={logout1_icon} alt='logout icon' className={styles.logoutIcon}/>
                                                    <a className={styles.profileOptionText}>Вийти</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </header>
  )
}

export default Header
