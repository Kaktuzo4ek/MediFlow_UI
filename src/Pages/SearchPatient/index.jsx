import { React, useState, useEffect } from "react"
import styles from './searchPatient.module.scss'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "../../Components/Header"
import search from '../../assets/icons/searchPatient/search.svg'
import { Image } from "react-bootstrap"
import PatientItems from "../../Components/PatientItems"
import ActionsModal from "../../ModalWindows/ActionsModal"
import ReactDOM from "react-dom/client";
import classNames from "classnames"
import Navbar from "../../Components/Navbar"
import Loader from "../../ModalWindows/Loader"

const SearchPatient = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    let user;

    const [patients, setPatients] = useState([]);

    const [isSearch, setIsSearch] = useState(false);

    let surname = "no";
    let name = "no";
    let patronymic = "no";

    const getPatients = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5244/api/Patient',
        }).then((response) => {
            setPatients(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }

    useEffect(() => {
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

    const [fullname, setFullname] = useState('');
    const changeFullname = event => {
        setFullname(event.target.value);
        if(event.target.value === '')
        {
            const searchLabel = document.getElementById('label_search');
            searchLabel.classList.remove(styles.showLabel);
        }
        if(event.target.value.length >= 1)
        {
            const searchLabel = document.getElementById('label_search');
            searchLabel.classList.add(styles.showLabel);
        }
    }

    const splitSearchString = () => {
        let arr = fullname.split(' ');
        if(fullname === '') {
            surname = "no";
            name = "no";
            patronymic = "no";
        }


        if(arr.length === 1)
            if(arr[0] !== '')
                surname = arr[0];

        if(arr.length === 2) {
            surname = arr[0];
            name = arr[1];
        }

        if(arr.length === 3) {
            surname = arr[0];
            name = arr[1];
            patronymic = arr[2];
        }
    }

    const searchPatients = () => {
        setIsSearch(true);
        splitSearchString();
        setIsLoading(true);
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/Patient/searchPatients',
            params: {
                surname,
                name,
                patronymic
            }
        }).then((response) => {
            setPatients(response.data);
        }).catch(error => console.error(`Error: ${error}`));
        setIsLoading(false);
    }

    const [modal, setModal] = useState({
        modal: false
    })

    const setModalTrue = () => {
        setModal({...modal, modal: true});
    }

    const [itemForModal, setItemForModal] = useState(Object);

    const setItem = (item) => {
        setItemForModal(item);
    }

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
            <Navbar isActiveHamburger={isActiveHamburger}/>
            <ActionsModal isOpened={modal.modal} onModalClose={() => {setModal({...modal, modal: false})}} item={itemForModal}></ActionsModal>
            <Loader isLoading={isLoading}/>

            <div className={styles.MainContainer}>
                <div className={styles.searchSection}>
                    <div className={styles.container}>
                        <div className={styles.searchBlock}>
                            <div className={styles.searchWrap}>
                                <h1>Пошук пацієнта</h1>
                                <div className={styles.form_group}>
                                    <label htmlFor="search_fullname" id='label_search' className={styles.label}>Прізвище ім'я По батькові</label>
                                    <input type="text" id="search_fullname" className={styles.inputSearch} value={fullname} onChange={changeFullname} placeholder="Прізвище Ім'я По батькові"/>
                                    <button type="button" className={styles.searchBtn} onClick={searchPatients}><Image src={search} alt='search icon' className={styles.searchIcon}/></button>
                                </div>
                            </div>
                            {patients.length !== 0 ? 
                                <div className={classNames(styles.searchResult, `${patients.length !== 0 ? styles.showResult : ''}`)}>
                                    <h1 className={styles.titleResult}>Результати пошуку</h1>
                                    <PatientItems items={patients} setModalTrue={setModalTrue} setItem={setItem}/>
                                </div>
                            : <div className={classNames(styles.searchResult, `${patients.length === 0 && isSearch !== false ? styles.showResult : ''}`)}>
                                <h1 className={styles.titleResult}>Результати пошуку</h1>
                                <p>За вашим запитом нічого не знайдено. Схоже такого пацієнта не існує в системі eHealth. Або ж спробуйте перевірити введені дані та повторити ще раз</p>
                            </div>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPatient