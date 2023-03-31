import styles from './register.module.scss';
import logo from '../../assets/images/MediFlow_logo.svg';
import facebook_icon from '../../assets/icons/footer/facebook.svg';
import google_icon from '../../assets/icons/footer/google.svg';
import instagram_icon from '../../assets/icons/footer/instagram.svg';
import twitter_icon from '../../assets/icons/footer/twitter.svg';
import telegram_icon from '../../assets/icons/footer/telegram.svg';
import { Image } from 'react-bootstrap';
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../../ModalWindows/Modal';
import success_icon from '../../assets/icons/success.png';
import error_icon from '../../assets/icons/error.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Register = () => {
    const [email, setEmail] = React.useState('');
    const changeEmail = event => {
        setEmail(event.target.value);
    }

    const [modal, setModal] = useState({
        modal: false
    })

    const setModalAndNavigate = () => {
        setModal({...modal, modal: false});
        navigate('/login');
    }

    let institution = localStorage.getItem('code');
    institution = parseInt(institution);

    const [roleId, setRoleId] = useState(3);
    const changeRoleId = event => {
        setRoleId(Number(event.target.value));
    }

    const [roles, setRoles] = useState([]);

    const [departmentId, setDepartmentId] = React.useState(0);
    const [departments, setDepartments] = React.useState([]);
    const changeDepartmentId = event => {
        setDepartmentId(Number(event.target.value));
    }

    const [certificate, setCertificate] = useState("");
    const changeCertificate = event => {
        setCertificate(event.target.value);
    }

    const [depAndInst, setDepAndInst] = React.useState([]);

    const [surname, setSurname] = React.useState('');
    const changeSurname = event => {
        setSurname(event.target.value);
    }

    const [name, setName] = React.useState('');
    const changeName = event => {
        setName(event.target.value);
    }

    const [patronymic, setPatronymic] = React.useState('');
    const changePatronymic = event => {
        setPatronymic(event.target.value);
    }

    const [phoneNumber, setPhone] = React.useState('');
    const changePhone = event => {
        setPhone(event.target.value);
    }

    const [dateOfBirth, setDateOfBirth] = React.useState('');
    const changeDateOfBirth = event => {
        setDateOfBirth(event.target.value);
    }

    const [positionId, setPositionId] = React.useState(0);
    const [positions, setPositions] = React.useState([]);
    const changePositionId = event => {
        setPositionId(Number(event.target.value));
    }

    const [gender, setGender] = React.useState('');
    const changeGender = event => {
        setGender(event.target.value);
    }

    const [password, setPassword] = React.useState('');
    const changePassword = event => {
        setPassword(event.target.value);
    }

    const [confirmPassword, setConfirmPassword] = React.useState('');
    const changeConfirmPassword = event => {
        setConfirmPassword(event.target.value);
    }

    const getDepAndInst = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/InstAndDep/${institution}`,
        }).then((response) => {
            setDepAndInst(response.data);
            console.log(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const getRoles = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5244/api/Role',
        }).then((response) => {
            setRoles(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const navigate = useNavigate();

    const [modalIcon, setModalIcon] = useState(success_icon);
    const [modalTitle, setModalTitle] = useState('Ви успішно зареєструвалися');
    const [modalDescription, setModalDescription] = useState('Тепер перевірте свою електронну пошту та підтвердіть її щоб увійти до особистого кабінету');
    const [isValidationSuccess, setIsValidationSuccesss] = useState(false);


    const[isSuccessfulyRegister, setIsSuccessfullyRegister] = useState(false);
    const registerUser = () => {
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/Auth/Register',
            data: {
                email,
                password,
                confirmPassword,
                institutionId: institution,
                departmentId,
                surname,
                name,
                patronymic,
                phoneNumber,
                dateOfBirth,
                positionId,
                gender,
                certificate,
                roleId
            }
        }).then((response) => {
            if(response.data.message === "User created successfully!")
            {
                setIsSuccessfullyRegister(true);
                setModalIcon(success_icon);
                setModalTitle('Ви успішно зареєструвалися');
                setModalDescription('Тепер перевірте свою електронну пошту та підтвердіть її щоб увійти до особистого кабінету');
                setModal({...modal, modal: true});
            }
            else if(response.data.message === "Certificate doesn`t match")
            {
                setIsValidationSuccesss(false);
                toast.error("Сертифікати не співпадають, перевірте введені дані!", {theme: "colored"});
                // setModalIcon(error_icon);
                // setModalTitle('Виникла помилка');
                // setModalDescription('Сертифікати не співпадають, перевірте введені дані');
                // setModal({...modal, modal: true});
            }
        }).catch(error => console.error(`Error: ${error}`));
    }
    
    const modalCheck = () => {
        if(isSuccessfulyRegister)
            setModalAndNavigate();
        else 
            setModal({...modal, modal: false})
    }

    const validation = () => {
        if(email === '' || surname === '' || name === '' || patronymic === '' || phoneNumber === '' || dateOfBirth === '' || gender === '' || password === '' || confirmPassword === '')
        {
            setIsValidationSuccesss(false);
            toast.error("Заповність всі поля для того, щоб зареєструватися!", {theme: "colored"});
            // setModalIcon(error_icon);
            // setModalTitle('Виникла помилка');
            // setModalDescription('Заповність всі поля для того, щоб зареєструватися');
            // setModal({...modal, modal: true});
        }
        else if (password === confirmPassword) 
        {
            registerUser();
        } 
        else
        {
            setIsValidationSuccesss(false);
            toast.error("Пароль і пароль підтвердження не збігаються!", {theme: "colored"});
            // setModalIcon(error_icon);
            // setModalTitle('Виникла помилка');
            // setModalDescription('Пароль і пароль підтвердження не збігаються');
            // setModal({...modal, modal: true});
        }
    }

    useEffect(() => {
        document.title = 'MediFlow - Медична інформаційна система';
        getDepAndInst();
        getRoles();
        axios({
            method: 'get',
            url: 'http://localhost:5244/api/Position',
        }).then((response) => {
            setPositions(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }, [])


    if(depAndInst === undefined)
        return 0;
    if(roles === undefined)
        return 0;
    if(departments === undefined)
        return 0;
    if(positions === undefined)
        return 0;

    return (
        <div>
             <Modal icon={modalIcon} title={modalTitle} description={modalDescription} textBtn={'Закрити'} isOpened={modal.modal} onModalClose={modalCheck}></Modal>
             <ToastContainer/>
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
                    <h1>Додавання працівника</h1>
                </div>

                <div className={styles.registration_section}>
                    <div className={styles.container}>
                        <div className={styles.container_form}>
                            <form>
                                <div className={styles.form_flex}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="select_role" className={styles.label}>Роль</label>
                                        <select id="select_role" className='form-select' value={roleId} onChange={changeRoleId}>
                                            {roles.map(item => <option key={item.roleId} value={item.roleId}>{item.roleName}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="select_position" className={styles.label}>Посада</label>
                                        <select id="select_position" className='form-select' value={positionId} onChange={changePositionId}>
                                            <option value='0'>Оберіть посаду</option>
                                            {positions.map(pos => <option key={pos.positionId} value={pos.positionId}>{pos.positionName}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.form_flex}>
                                    {roleId === 1 ?
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_certificate" className={styles.label}>Сертифікат</label>
                                        <input type="text" id="input_certificate"  className='form-control' value={certificate} onChange={changeCertificate} placeholder='Сертифікат'/>
                                    </div>
                                    :
                                    <div className={styles.form_group}>
                                        <label htmlFor="select_department" className={styles.label}>Відділення</label>
                                        <select id="select_department" className='form-select' value={departmentId} onChange={changeDepartmentId}>
                                            <option value='0'>Оберіть відділення</option>
                                            {depAndInst.map(item => <option key = {item.department.departmentId} value={item.department.departmentId}>{item.department.name}</option>)}
                                        </select>
                                    </div>
                                    }
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_surname" className={styles.label}>Прізвище</label>
                                        <input type="text" id="input_surname" className='form-control' value={surname} onChange={changeSurname} placeholder='Прізвище'/>
                                    </div>
                                </div>
                                <div className={styles.form_flex}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_name" className={styles.label}>Ім'я</label>
                                        <input type="text" id="input_name" className='form-control' value={name} onChange={changeName} placeholder="Ім'я" />
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_patronymic" className={styles.label}>По-батькові</label>
                                        <input type="text" id="input_patronymic" className='form-control' value={patronymic} onChange={changePatronymic} placeholder='По-батькові'/>
                                    </div>
                                </div>
                                <div className={styles.form_flex}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_phone" className={styles.label}>Мобільний телефон</label>
                                        <input type="text" id="input_phone" className='form-control' value={phoneNumber} onChange={changePhone} placeholder='+38'/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_dateOfBirth" className={styles.label}>Дата народження</label>
                                        <input type="date" id="input_dateOfBirth" className='form-control' value={dateOfBirth} onChange={changeDateOfBirth}/>
                                    </div>
                                </div>
                                <div className={styles.form_flex}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_email" className={styles.label}>Email</label>
                                        <input type="email" id="input_email"  className='form-control' value={email} onChange={changeEmail} placeholder='Email'/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="select_gender" className={styles.label}>Стать</label>
                                        <select id="select_gender" className='form-select' value={gender} onChange={changeGender}>
                                            <option value='Оберіть стать'>Оберіть стать</option>
                                            <option value='Чоловік'>Чоловік</option>
                                            <option value='Жінка'>Жінка</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.form_flex}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_password" className={styles.label}>Пароль</label>
                                        <input type="text" id="input_password" className='form-control' value={password} onChange={changePassword} placeholder='Пароль'/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="input_confirmPassword" className={styles.label}>Підтвердіть пароль</label>
                                        <input type="text" id="input_confirmPassword" className='form-control' value={confirmPassword} onChange={changeConfirmPassword} placeholder='Підтвердіть пароль'/>
                                    </div>
                                </div>
                                <div className={styles.container_register_btn}><button type="button" className={styles.registerBtn} onClick={validation}>Зареєструватися</button></div>
                            </form>
                        </div>
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
        </div>
    )
}

export default Register