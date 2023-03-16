import React from "react"
import styles from './profile.module.scss'
import { Image } from "react-bootstrap"
import logo from '../../assets/images/MediFlow_logo.svg'
import userPhoto from '../../assets/icons/profilePage/userPhoto.png'
import logout_icon from '../../assets/icons/profilePage/logout.svg'
import edit_icon from '../../assets/icons/profilePage/edit.png'
import edit1_icon from '../../assets/icons/profilePage/edit1.png'
import edit2_icon from '../../assets/icons/profilePage/edit2.png'
import logout1_icon from '../../assets/icons/profilePage/logout.png'
import down_icon from '../../assets/icons/profilePage/down.png'
import down1_icon from  '../../assets/icons/profilePage/down1.png'
import userPhotoBig from '../../assets/icons/profilePage/userPhotoBig.png'
import Modal from '../../ModalWindows/Modal'
import success_icon from '../../assets/icons/success.png'
import error_icon from '../../assets/icons/error.png'
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar"

const Profile = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    let user;

    const [username, setUsername] = useState('');

    const [id, setUserId] = useState(1);

    const [email, setEmail] = React.useState('');

    const [modal, setModal] = useState({
        modal: false
    })

    const setModalAndNavigate = () => {
        setModal({...modal, modal: false});
    }

    const [institution, setInstitution] = React.useState('');

    const [department, setDepartment] = React.useState('');

    const [position, setPosition] = React.useState('');

    let isPasswordChange = false;

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

    const [dateOfBirth, setDateOfBirth] = React.useState(Date);
    const changeDateOfBirth = event => {
        setDateOfBirth(event.target.value);
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

    const updateUser = () => {
        axios({
            method: 'put',
            url: `http://localhost:5244/api/Doctor/${id}`,
            data: {
                id,
                email,
                surname,
                name,
                patronymic,
                phoneNumber,
                dateOfBirth,
                gender,
                password
            }
        }).then((response) => {
            setSurname(response.data.surname);
            setName(response.data.name);
            setPatronymic(response.data.patronymic);
            setPhone(response.data.phoneNumber);
            setDateOfBirth(response.data.dateOfBirth.slice(0, 10));
            setGender(response.data.gender);
            setPassword('');
            setConfirmPassword('');
        }).catch(error => console.error(`Error: ${error}`));

        if(isPasswordChange)
        {
            setModalIcon(success_icon);
            setModalTitle('Пароль змінено');
            setModalDescription('Ваш пароль був успішно змінений, використовуйте його для того, щоб увійти в систему');
            setModal({...modal, modal: true});
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    const [modalIcon, setModalIcon] = useState(success_icon);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [isValidationSuccess, setIsValidationSuccesss] = useState(false);
    
    const modalCheck = () => {
        if(isValidationSuccess)
            setModalAndNavigate();
        else 
            setModal({...modal, modal: false})
    }

    const validation = () => {
        if(email === '' || surname === '' || name === '' || patronymic === '' || phoneNumber === '' || dateOfBirth === '' || gender === '')
        {
            setIsValidationSuccesss(false);
            setModalIcon(error_icon);
            setModalTitle('Виникла помилка');
            setModalDescription('Неможливо змінити особисті дані, адже наявні порожні поля');
            setModal({...modal, modal: true});
        }
            if(password === confirmPassword && password !== '' && confirmPassword !== '') 
            {
                setIsValidationSuccesss(true);
                isPasswordChange = true;
                updateUser();
            } else if(password === confirmPassword) {
                setIsValidationSuccesss(true);
                updateUser();
            } else {
                setIsValidationSuccesss(false);
                setModalIcon(error_icon);
                setModalTitle('Виникла помилка');
                setModalDescription('Пароль і пароль підтвердження не збігаються');
                setModal({...modal, modal: true});
            }

    }

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

     useEffect(() => {
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                setUserId(user.id);
                setEmail(user.email);
                setInstitution(user.institution.name);
                setDepartment(user.department.name);
                setSurname(user.surname);
                setName(user.name);
                setPatronymic(user.patronymic);
                setPhone(user.phoneNumber);
                setDateOfBirth(user.dateOfBirth.slice(0, 10));
                setPosition(user.position.positionName);
                setGender(user.gender);
                setUsername(`${user.surname} ${user.name} ${user.patronymic}`);
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

    return (
        <div>
            <Modal icon={modalIcon} title={modalTitle} description={modalDescription} textBtn={'Закрити'} isOpened={modal.modal} onModalClose={modalCheck}></Modal>
            
                <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
                <Navbar isActiveHamburger={isActiveHamburger}/>
            <div className={styles.MainContainer}>
                <div className={styles.divideLine}></div>

                <div className={styles.headLine}>
                    <h1>Редагування своїх даних: {username}</h1>
                </div>

                <div className={styles.updateSection}>
                    <div className={styles.container}>
                        <div className={styles.container_form}>
                            <form>
                                    <div className={styles.updateDataSection}>
                                        <div className={styles.form_flex}>
                                            <div className={styles.form_group}>
                                                <label htmlFor="input_email" className={styles.label}>Email</label>
                                                <input type="email" id="input_email"  className='form-control' value={email} placeholder='Email' disabled/>
                                            </div>
                                            <div className={styles.form_group}>
                                                <label htmlFor="input_institution" className={styles.label}>Медичний заклад</label>
                                                <input type="text" id="input_institution" className='form-control' value={institution} placeholder='Медичний заклад' disabled/>
                                            </div>
                                        </div>
                                        <div className={styles.form_flex}>
                                            <div className={styles.form_group}>
                                                <label htmlFor="input_department" className={styles.label}>Відділення</label>
                                                <input type="text" id="input_department" className='form-control' value={department} placeholder='Відділення' disabled/>
                                            </div>
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
                                                <label htmlFor="input_position" className={styles.label}>Посада</label>
                                                <input type="text" id="input_position" className='form-control' value={position} placeholder='Посада' disabled/>
                                            </div>
                                            <div className={styles.form_group}>
                                                <label htmlFor="select_gender" className={styles.label}>Стать</label>
                                                <select id="select_gender" className='form-select' value={gender} onChange={changeGender}>
                                                    <option value='Оберіть вашу стать'>Оберіть вашу стать</option>
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
                                        <div className={styles.container_update_btn}><button type="button" className={styles.updateBtn} onClick={validation}>Зберегти дані</button></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default Profile