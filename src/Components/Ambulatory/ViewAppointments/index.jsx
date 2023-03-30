import axios from "axios";
import React from "react";
import styles from './viewAppointments.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import edit2_icon from '../../../assets/icons/profilePage/edit2.png'
import { Image } from "react-bootstrap";
import delete_icon from '../../../assets/icons/delete.png'
import { useNavigate } from "react-router-dom";
import dropdown_icon from '../../../assets/icons/dropdown.png'

const ViewAppointments = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const patientId = Number(localStorage.getItem('patientId'));
    const episodeId = localStorage.getItem("episodeId");

    const navigate = useNavigate();

    const [episode, setEpisode] = useState([]);
    const [filterEpisode, setFilterEpisode] = useState([]);

    const [filter, setFilter] = useState('');
    const changeFilter = event => {
        setFilter(event.target.value)
    }

    const inputPatient = document.getElementById('filter_patient');
    const inputDoctor = document.getElementById('filter_doctor');
    const inputCategory = document.getElementById('filter_category');
    const inputProcedure = document.getElementById('filter_procedure');
    const inputStatus = document.getElementById('filter_status');
    const inputEventDate = document.getElementById('filter_event_date');

    const [filterBy, setFilterBy] = useState('');

    const changeFilterBy = event => {
        setFilterBy(event.target.value);
        if(event.target.value === 'patient') 
            inputPatient.classList.toggle(styles.visible);
        else
            inputPatient.classList.remove(styles.visible);

        if(event.target.value === 'doctor') 
            inputDoctor.classList.toggle(styles.visible);
        else
            inputDoctor.classList.remove(styles.visible);

        if(event.target.value === 'category') 
            inputCategory.classList.toggle(styles.visible);
        else
            inputCategory.classList.remove(styles.visible);

        if(event.target.value === 'procedure') 
            inputProcedure.classList.toggle(styles.visible);
        else
            inputProcedure.classList.remove(styles.visible);
        if(event.target.value === 'status') 
            inputStatus.classList.toggle(styles.visible);
        else
            inputStatus.classList.remove(styles.visible);
        if(event.target.value === 'date') 
            inputEventDate.classList.toggle(styles.visible);
        else
            inputEventDate.classList.remove(styles.visible);
    }

    const resetFilter = () => {
        setFilter('');
        setFilterBy('Пошук за');
        inputPatient.classList.remove(styles.visible);
        inputDoctor.classList.remove(styles.visible);
        inputCategory.classList.remove(styles.visible);
        inputProcedure.classList.remove(styles.visible);
        inputStatus.classList.remove(styles.visible);
        inputEventDate.classList.remove(styles.visible);
        getEpisode();
    }

    const filterReferrals = (filter, arrayForFilter) => {
        switch(filterBy) {
            case 'patient':
                setEpisode(arrayForFilter.filter(({patient}) => (patient.surname+" "+patient.name+" "+patient.patronymic).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'doctor':
                setEpisode(arrayForFilter.filter(({doctor}) => (doctor.surname+" "+doctor.name+" "+doctor.patronymic).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'category':
                setEpisode(arrayForFilter.filter(({category}) => category.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'procedure':
                setEpisode(arrayForFilter.filter(({referral}) => (referral.service.serviceId+" "+referral.service.serviceName).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'status':
                setEpisode(arrayForFilter.filter(({status}) => status.toLowerCase().includes(filter.toLowerCase())));
                break
            case 'date':
                setEpisode(arrayForFilter.filter(({eventDate}) => eventDate.toLowerCase().includes(filter.toLowerCase())));
                break;
        }
    }

    // const getEpisode = () => {
    //     axios({
    //         method: 'post',
    //         url: 'http://localhost:5244/api/AmbulatoryEpisode/getEpisode',
    //         params : {episodeId},
    //     }).then((response) => {
    //         console.log(response.data)
    //         setEpisode(response.data);
    //         setFilterEpisode(response.data);
    //     }).catch(error => console.error(`Error: ${error}`));
    // }

    const getEpisode = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
            params : {id: episodeId},
        }).then((response) => {
            console.log(response.data)
            setEpisode(response.data);
            setFilterEpisode(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const deleteProcedure = (pId) => {
        let procedureId = pId;
        axios({
            method: 'delete',
            url: `http://localhost:5244/api/Procedure/${procedureId}`,
            params : {procedureId},
        }).then((response) => {
            getEpisode();
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [procedureId, setProcedureId] = useState(0);
    const [serviceObj, setServiceObj] = useState({});
    const [statusObj, setStatusObj] = useState({});

    const setEditModalAndData = (pId, sId, sName, status) => {
        //setModal({...modal, modalEdit: true});
        setProcedureId(Number(pId));
        setServiceObj({value: sId, label: sName});
        setStatusObj({value: status, label: status});
    }

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

    const setDataAndNavigateToViewAppointmentReport = (episodeId, appointmentId) => {
        localStorage.setItem('episodeId', episodeId);
        localStorage.setItem('appointmentId', appointmentId);
        navigate('../doctor/medical-events/patient-episodes/view-interactions/view-appointment-report');
    }

    let count = 1;

    useEffect(() => {
        getEpisode();
    }, []);

    return (
        <div>
            <div className={styles.filterContainer}>
                <div className={styles.flexSelectAndBtn}>
                    <div className={styles.flexForSelects}>
                        <select id="select_filter" className={classNames('form-select', styles.select)} value={filterBy} onChange={changeFilterBy}>
                            <option value='null'>Пошук за</option>
                            <option value='patient'>ПІБ пацієнта</option>
                            <option value='doctor'>ПІБ лікаря</option>  
                            <option value='category'>Категорія</option>
                            <option value='procedure'>Процедура</option>
                            <option value='status'>Статус</option>
                            <option value='date'>Дата та час проведення</option>
                        </select>
                        <input type="text" id="filter_patient" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть ПІБ пацієнта'/>
                        <input type="text" id="filter_doctor" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder="Введіть ПІБ лікаря"/>
                        <input type="text" id="filter_category" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть категорію'/>
                        <input type="text" id="filter_procedure" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть процедуру'/>
                        <input type="text" id="filter_status" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть статус'/>
                        <input type="text" id="filter_event_date" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть дату та час проведення'/>
                    </div>
                    <div className={styles.flexButtons}>
                        <button type="button" className={styles.filterButtons} onClick={() => filterReferrals(filter, filterEpisode)}>Пошук</button>
                        <button type="button" className={styles.filterButtons} onClick={resetFilter}>Скинути фільтр</button>
                    </div>
                </div>
            </div>

            <div className={styles.procedureCountBlock}>
                <p>Кількість ({episode.length})</p>
            </div>

            <div className={styles.tableSection}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                        <th>№ П/П</th>
                        <th>Дата візиту</th>
                        <th>Лікар</th>
                        <th>Причина</th>
                        <th>Діагноз</th>
                        <th>Призначення</th>
                        <th>Дії</th>
                        </tr>
                    </thead>
                    {
                        episode && episode.length > 0 ?
                        episode.map((itemEpisode, index) => (
                            <tbody>
                                {itemEpisode.appointments.map((item, index) => (
                                        <tr key={index}>
                                            <td>{count++}</td>
                                            <td>{item.date.split('T')[0]} {item.date.split('T')[1].slice(0,5)}</td>
                                            <td>{itemEpisode.doctor.surname} {itemEpisode.doctor.name} {itemEpisode.doctor.patronymic}</td>
                                            <td>{item.diagnosisICPC2 && item.diagnosisICPC2.diagnosisName}</td>
                                            <td>{itemEpisode.diagnosisMKX10AM.diagnosisName}</td>
                                            <td>{item.appointmentsAndServices.map((a, index) => `(${a.service.serviceId}) ${a.service.serviceName} ${index+1 !== item.appointmentsAndServices.length ? ', ' : ''}`)}</td>
                                            <td>{doctorId === itemEpisode.doctor.id ? 
                                                    <div id={`action${index + 1}`} className={styles.flexForAction} onMouseOver={() => openActionsDropdown(`action${index+1}`, `actionsDropdown${index + 1}`)} onMouseOut={() => closeActionsDropdown(`actionsDropdown${index + 1}`)}>
                                                        <Image src={dropdown_icon} alt='dropdown icon' className={styles.actionIcon}/>
                                                        <div id={`actionsDropdown${index + 1}`} className={styles.actionsWrapper}>
                                                            <div className={styles.buttonsWrapper}>
                                                                <button className={styles.actionsBtn} type="button">Редагувати</button>
                                                                <button className={styles.actionsBtn} type="button">Видалити</button>
                                                                <button className={styles.actionsBtn} type="button" onClick={() => setDataAndNavigateToViewAppointmentReport(itemEpisode.episodeId, item.appointmentId)}>Переглянути</button>
                                                            </div>
                                                        </div>
                                                    </div> 
                                                : ''}
                                            </td>
                                        </tr>
                                ))}
                            </tbody>
                        )) : ''
                    }
                </table>
            </div>
        </div>
    )
}

export default ViewAppointments