import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import styles from './episode.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import edit2_icon from '../../assets/icons/profilePage/edit2.png'
import { Image } from "react-bootstrap";
import delete_icon from '../../assets/icons/delete.png'
import Navbar from "../../Components/Navbar";
import CreateEpisodeModal from "../../ModalWindows/AmbulatoryEpisode/CreateEpisode";
import EditEpisodeModal from "../../ModalWindows/AmbulatoryEpisode/EditAmbulatoryEpisode";
import plus_icon from '../../assets/icons/plus.png'
import dropdown_icon from '../../assets/icons/dropdown.png'

const AmbulatoryEpisode = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const patientId = Number(localStorage.getItem('patientId'));

    const navigate = useNavigate();

    let user;

    const [episodes, setEpisodes] = useState([]);
    const [filterEpisodes, setFilterEpisodes] = useState([]);

    const [filter, setFilter] = useState('');
    const changeFilter = event => {
        setFilter(event.target.value)
    }

    const inputDoctor = document.getElementById('filter_doctor');
    const inputStatus = document.getElementById('filter_status');
    const inputName = document.getElementById('filter_name');
    const inputType = document.getElementById('filter_type');
    const inputDate = document.getElementById('filter_date');

    const [filterBy, setFilterBy] = useState('');

    const changeFilterBy = event => {
        setFilterBy(event.target.value);

        if(event.target.value === 'doctor') 
            inputDoctor.classList.toggle(styles.visible);
        else
            inputDoctor.classList.remove(styles.visible);

        if(event.target.value === 'status') 
            inputStatus.classList.toggle(styles.visible);
        else
            inputStatus.classList.remove(styles.visible);

        if(event.target.value === 'name') 
            inputName.classList.toggle(styles.visible);
        else
            inputName.classList.remove(styles.visible);

        if(event.target.value === 'type') 
            inputType.classList.toggle(styles.visible);
        else
            inputType.classList.remove(styles.visible);

        if(event.target.value === 'date') 
            inputDate.classList.toggle(styles.visible);
        else
            inputDate.classList.remove(styles.visible);
    }

    const resetFilter = () => {
        setFilter('');
        setFilterBy('Пошук за');
        inputDoctor.classList.remove(styles.visible);
        inputStatus.classList.remove(styles.visible);
        inputName.classList.remove(styles.visible);
        inputType.classList.remove(styles.visible);
        inputDate.classList.remove(styles.visible);
        getEpisodes();
    }

    const filterReferrals = (filter, arrayForFilter) => {
        switch(filterBy) {
            case 'doctor':
                setEpisodes(arrayForFilter.filter(({doctor}) => (doctor.surname+" "+doctor.name+" "+doctor.patronymic).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'status':
                setEpisodes(arrayForFilter.filter(({status}) => status.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'name':
                setEpisodes(arrayForFilter.filter(({name}) => name.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'type':
                setEpisodes(arrayForFilter.filter(({type}) => type.toLowerCase().includes(filter.toLowerCase())));
                break
            case 'date':
                setEpisodes(arrayForFilter.filter(({dateCreated}) => dateCreated.toLowerCase().includes(filter.toLowerCase())));
                break;
        }
    }

    const getEpisodes = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5244/api/AmbulatoryEpisode',
            params : {patientId},
        }).then((response) => {
            setEpisodes(response.data);
            setFilterEpisodes(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [patient, setPatient] = useState("");

    const getPatient = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/Patient/${patientId}`,
            params : {id: patientId},
        }).then((response) => {
            setPatient(`${response.data.surname} ${response.data.name} ${response.data.patronymic}`);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [modal, setModal] = useState({
        modalCreate: false,
        modalEdit: false
    });

    const deleteEpisode = (eId) => {
        axios({
            method: 'delete',
            url: `http://localhost:5244/api/AmbulatoryEpisode/${eId}`,
            params : {id: eId},
        }).then((response) => {
            getEpisodes();
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [episodeId, setEpisodeId] = useState(0);
    const [episodeName, setEpisodeName] = useState("");
    const [typeObj, setTypeObj] = useState({});
    const [diagnosisObj, setDiagnosisObj] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const setIsOpenFalse = () => {
        setIsOpen(false);
    }

    const setEditModalAndData = (eId, eName, tObj, dId, dName) => {
        setModal({...modal, modalEdit: true});
        setEpisodeId(Number(eId));
        setEpisodeName(eName);
        setTypeObj({value: tObj, label: tObj});
        setIsOpen(true);
        
        if(dId && dName)
            setDiagnosisObj({value: dId, label: `${dId} ${dName}`});
        else
            setDiagnosisObj({value: '', label: ''});
    }

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

    const openActionsDropdown = (idIcon, idDropdown) => {
        let icon = document.getElementById(idIcon);
        let elem = document.getElementById(idDropdown);

        let coords = icon.getBoundingClientRect();
    
        elem.style.position = "fixed";
        elem.style.maxHeight = "100%";
        elem.style.left = (coords.left - elem.offsetWidth)  + "px";
        elem.style.top = coords.top + "px";
    }

    const closeActionsDropdown = (idDropdown) => {
        let elem = document.getElementById(idDropdown); 
        elem.style.maxHeight = "0";
    }

    const setDataAndNavigateToInteractions = (episodeId) => {
        localStorage.setItem('episodeId', episodeId);
        navigate("../doctor/medical-events/patient-episodes/interactions");
    }

    const setDataAndNavigateToViewInteractions = (episodeId) => {
        localStorage.setItem('episodeId', episodeId);
        navigate("../doctor/medical-events/patient-episodes/view-interactions");
    }

    useEffect(() => {
        document.title = 'Амбулаторні епізоди';
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                getEpisodes();
                getPatient();
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

    return (
            <div>
                <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
                <Navbar isActiveHamburger={isActiveHamburger}/>
                <div className={styles.divideLine}></div>

                <div className={styles.headLine}>
                    <h1>Амбулаторні епізоди<br/>Пацієнт {patient}</h1>
                </div>

                <div className={styles.MainContainer}>
                    <div className={styles.navSection}>
                        <div className={styles.container}>
                            <div className={styles.btnContainer}>
                                <button type="button" className={styles.navButtons} onClick={() => setModal({...modal, modalCreate: true})}>Cтворити епізод</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.filterSection}>
                        <div className={styles.container}>
                            <div className={styles.filterContainer}>
                                <div className={styles.flexSelectAndBtn}>
                                    <div className={styles.flexForSelects}>
                                        <select id="select_filter" className={classNames('form-select', styles.select)} value={filterBy} onChange={changeFilterBy}>
                                            <option value='null'>Пошук за</option>
                                            <option value='doctor'>ПІБ лікаря</option>  
                                            <option value='status'>Статус</option>
                                            <option value='name'>Назва</option>
                                            <option value='type'>Тип</option>
                                            <option value='date'>Дата початку</option>
                                        </select>
                                        <input type="text" id="filter_doctor" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder="Введіть ПІБ лікаря"/>
                                        <input type="text" id="filter_status" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть статус'/>
                                        <input type="text" id="filter_name" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть назву'/>
                                        <input type="text" id="filter_type" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть тип'/>
                                        <input type="text" id="filter_date" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть дата початку'/>
                                    </div>
                                    <div className={styles.flexButtons}>
                                        <button type="button" className={styles.filterButtons} onClick={() => filterReferrals(filter, filterEpisodes)}>Пошук</button>
                                        <button type="button" className={styles.filterButtons} onClick={resetFilter}>Скинути фільтр</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.procedureCountBlock}>
                        <div className={styles.container}>
                            <p>Кількість ({episodes.length})</p>
                        </div>
                    </div>

                        <div className={styles.tableSection}>
                            <div className={styles.container}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                        <th>№ П/П</th>
                                        <th>Лікар</th>
                                        <th>Статус</th>
                                        <th>Назва</th>
                                        <th>Тип</th>
                                        <th>Дата початку</th>
                                        <th>Дії</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            episodes && episodes.length > 0 ?
                                            episodes.map((item, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.doctor.surname} {item.doctor.name} {item.doctor.patronymic}</td>
                                                        <td>{item.status}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.type}</td>
                                                        <td>{item.dateCreated.split("T")[0]}</td>
                                                        <td>{doctorId === item.doctor.id ? 
                                                                <div id={`action${index + 1}`} className={styles.flexForAction} onMouseOver={() => openActionsDropdown(`action${index+1}`, `actionsDropdown${index + 1}`)} onMouseOut={() => closeActionsDropdown(`actionsDropdown${index + 1}`)}>
                                                                    <Image src={dropdown_icon} alt='dropdown icon' className={styles.actionIcon}/>
                                                                    <div id={`actionsDropdown${index + 1}`} className={styles.actionsWrapper}>
                                                                        <div className={styles.buttonsWrapper}>
                                                                        {item.status === "Діючий" && <button className={styles.actionsBtn} type="button" onClick={() => setEditModalAndData(item.episodeId, item.name, item.type, item.diagnosisMKX10AM && item.diagnosisMKX10AM.diagnosisId, item.diagnosisMKX10AM && item.diagnosisMKX10AM.diagnosisName)}>Редагувати</button>}
                                                                            {item.status === "Діючий" && <button className={styles.actionsBtn} type="button" onClick={() => deleteEpisode(item.episodeId)}>Видалити</button>}
                                                                            {item.status === "Діючий" && <button className={styles.actionsBtn} type="button" onClick={() => setDataAndNavigateToInteractions(item.episodeId)}>Створити взаємодію</button>}
                                                                            {(item.appointment || item.referralPackage || item.procedure) && <button className={styles.actionsBtn} type="button" onClick={() => setDataAndNavigateToViewInteractions(item.episodeId)}>Переглянути взаємодії</button>}
                                                                            {item.referralPackage && <button className={styles.actionsBtn} type="button">Переглянути направлення</button>}
                                                                        </div>
                                                                    </div>
                                                                </div> : ''}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            ''
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <CreateEpisodeModal isOpened={modal.modalCreate} onModalClose={() => setModal({...modal, modalCreate: false})} updateTable={getEpisodes}></CreateEpisodeModal>
                    <EditEpisodeModal isOpened={modal.modalEdit} onModalClose={() => setModal({...modal, modalEdit: false})} updateTable={getEpisodes} episodeId={episodeId} diagnosis={diagnosisObj} episodeName={episodeName} type={typeObj} isOpen={isOpen} setIsOpenFalse={setIsOpenFalse}></EditEpisodeModal>

            </div>
    )
}

export default AmbulatoryEpisode
