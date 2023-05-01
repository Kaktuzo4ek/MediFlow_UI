import axios from "axios";
import React from "react";
import styles from './viewAppointments.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import edit2_icon from '../../../../assets/icons/profilePage/edit2.png'
import { Image } from "react-bootstrap";
import delete_icon from '../../../../assets/icons/delete.png'
import { useNavigate } from "react-router-dom";
import dropdown_icon from '../../../../assets/icons/dropdown.png'

const ViewAppointments = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const patientId = Number(localStorage.getItem('patientId'));
    const episodeId = Number(localStorage.getItem("episodeId"));

    const navigate = useNavigate();

    const [episode, setEpisode] = useState([]);
    const [filterEpisode, setFilterEpisode] = useState([]);

    const [filter, setFilter] = useState('');
    const changeFilter = event => {
        setFilter(event.target.value)
    }

    const inputDoctor = document.getElementById('filter_doctor');
    const inputReason = document.getElementById('filter_reason');
    const inputService = document.getElementById('filter_service');
    const inputEventDate = document.getElementById('filter_date');

    const [filterBy, setFilterBy] = useState('');

    const changeFilterBy = event => {
        setFilterBy(event.target.value);

        if(event.target.value === 'doctor') 
            inputDoctor.classList.toggle(styles.visible);
        else
            inputDoctor.classList.remove(styles.visible);

        if(event.target.value === 'reason') 
            inputReason.classList.toggle(styles.visible);
        else
            inputReason.classList.remove(styles.visible);

        if(event.target.value === 'service') 
            inputService.classList.toggle(styles.visible);
        else
            inputService.classList.remove(styles.visible);

        if(event.target.value === 'date') 
            inputEventDate.classList.toggle(styles.visible);
        else
            inputEventDate.classList.remove(styles.visible);
    }

    const resetFilter = () => {
        setFilter('');
        setFilterBy('Пошук за');
        inputDoctor.classList.remove(styles.visible);
        inputReason.classList.remove(styles.visible);
        inputService.classList.remove(styles.visible);
        inputEventDate.classList.remove(styles.visible);
        getEpisode();
    }

    const filterReferrals = (filter, arrayForFilter) => {
        switch(filterBy) {
            case 'doctor':
                setEpisode(arrayForFilter.filter(({doctor}) => (doctor.surname+" "+doctor.name+" "+doctor.patronymic).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'reason':
                setEpisode(arrayForFilter.filter((item) => (item.appointments = item.appointments.filter((itemApp) => (itemApp.appointments = itemApp.filter(({appointmentsAndDiagnosesICPC2}) => appointmentsAndDiagnosesICPC2.diagnosisICPC2.diagnosisCode+" "+appointmentsAndDiagnosesICPC2.diagnosisICPC2.diagnosisName).toLowerCase().includes(filter.toLowerCase()))).length > 0)));
                break;
            case 'service':
                setEpisode(arrayForFilter.filter((item) => (item.appointments = item.appointments.filter((itemApp) => (itemApp.appointments = itemApp.filter(({appointmentsAndServices}) => appointmentsAndServices.service.serviceId+" "+appointmentsAndServices.service.serviceName).toLowerCase().includes(filter.toLowerCase()))).length > 0)));
                break;
            case 'date':
                setEpisode(arrayForFilter.filter((item) => (item.appointments = item.appointments.filter((itemApp) => (itemApp.appointments = itemApp.filter(({date}) => date.toLowerCase().includes(filter.toLowerCase()))).length > 0))));
                break;
        }
    }

    const [appointmentsCount, setAppointmentsCount] = useState(0);

    const getEpisode = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
            params : {id: episodeId},
        }).then((response) => {
            console.log(response.data)
            setEpisode(response.data);
            setFilterEpisode(response.data);
            setAppointmentsCount(response.data[0].appointments.length);
        }).catch(error => console.error(`Error: ${error}`));
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

    const setDataAndNavigateToEditAppointment = (appointmentId) => {
        localStorage.setItem('appointmentId', appointmentId);
        navigate('../doctor/medical-events/patient-episodes/view-interactions/view-appointments/edit-appointments');
    }

    const deleteAppointment = (appointmentId) => {
        axios({
            method: 'delete',
            url: `http://localhost:5244/api/Appointment/${appointmentId}`,
            params : {id: appointmentId, episodeId},
        }).then((response) => {
            getEpisode();
        }).catch(error => console.error(`Error: ${error}`));
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
                            <option value='doctor'>ПІБ лікаря</option>  
                            <option value='reason'>Причина</option>
                            <option value='service'>Призначення</option>
                            <option value='date'>Дата візиту</option>
                        </select>
                        <input type="text" id="filter_doctor" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder="Введіть ПІБ лікаря"/>
                        <input type="text" id="filter_reason" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть причину'/>
                        <input type="text" id="filter_service" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть призначення'/>
                        <input type="text" id="filter_date" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть дату візиту'/>
                    </div>
                    <div className={styles.flexButtons}>
                        <button type="button" className={styles.filterButtons} onClick={() => filterReferrals(filter, filterEpisode)}>Пошук</button>
                        <button type="button" className={styles.filterButtons} onClick={resetFilter}>Скинути фільтр</button>
                    </div>
                </div>
            </div>

            <div className={styles.procedureCountBlock}>
                <p>Кількість ({appointmentsCount})</p>
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
                        <th>Надані послуги</th>
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
                                            <td>{item.appointmentsAndDiagnosesICPC2 && item.appointmentsAndDiagnosesICPC2.map((a, index) => `(${a.diagnosisICPC2.diagnosisCode}) ${a.diagnosisICPC2.diagnosisName} ${index+1 !== item.appointmentsAndDiagnosesICPC2.length ? ', ' : ''}`)}</td>
                                            <td>{itemEpisode.diagnosisMKX10AM && `(${itemEpisode.diagnosisMKX10AM.diagnosisId}) ${itemEpisode.diagnosisMKX10AM.diagnosisName}`}</td>
                                            <td>{item.appointmentsAndServices.map((a, index) => `(${a.service.serviceId}) ${a.service.serviceName} ${index+1 !== item.appointmentsAndServices.length ? ', ' : ''}`)}</td>
                                            <td>{doctorId === itemEpisode.doctor.id ? 
                                                    <div id={`action${index + 1}`} className={styles.flexForAction} onMouseOver={() => openActionsDropdown(`action${index+1}`, `actionsDropdown${index + 1}`)} onMouseOut={() => closeActionsDropdown(`actionsDropdown${index + 1}`)}>
                                                        <Image src={dropdown_icon} alt='dropdown icon' className={styles.actionIcon}/>
                                                        <div id={`actionsDropdown${index + 1}`} className={styles.actionsWrapper}>
                                                            <div className={styles.buttonsWrapper}>
                                                                <button className={styles.actionsBtn} type="button" onClick={() => setDataAndNavigateToEditAppointment(item.appointmentId)}>Редагувати</button>
                                                                <button className={styles.actionsBtn} type="button" onClick={() => deleteAppointment(item.appointmentId)}>Видалити</button>
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