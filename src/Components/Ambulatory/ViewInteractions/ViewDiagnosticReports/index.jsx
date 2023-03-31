import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './viewDiagnosticReport.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import CreateProcedureModal from "../../../../ModalWindows/Procedure/CreateProcedureModal";
import EditProcedureModal from "../../../../ModalWindows/Procedure/EditProcedureModal";
import edit2_icon from '../../../../assets/icons/profilePage/edit2.png'
import { Image } from "react-bootstrap";
import delete_icon from '../../../../assets/icons/delete.png'

const ViewDiagnosticReports = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const patientId = Number(localStorage.getItem('patientId'));
    const episodeId = localStorage.getItem("episodeId");

    const navigate = useNavigate();

    let user;

    const [reports, setReports] = useState([]);
    const [filterReports, setFilterReports] = useState([]);

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
        getReports();
    }

    const filterReferrals = (filter, arrayForFilter) => {
        switch(filterBy) {
            case 'patient':
                setReports(arrayForFilter.filter(({patient}) => (patient.surname+" "+patient.name+" "+patient.patronymic).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'doctor':
                setReports(arrayForFilter.filter(({doctor}) => (doctor.surname+" "+doctor.name+" "+doctor.patronymic).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'category':
                setReports(arrayForFilter.filter(({category}) => category.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'procedure':
                setReports(arrayForFilter.filter(({referral}) => (referral.service.serviceId+" "+referral.service.serviceName).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'status':
                setReports(arrayForFilter.filter(({status}) => status.toLowerCase().includes(filter.toLowerCase())));
                break
            case 'date':
                setReports(arrayForFilter.filter(({eventDate}) => eventDate.toLowerCase().includes(filter.toLowerCase())));
                break;
        }
    }

    const getReports = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
            params : {id: episodeId},
        }).then((response) => {
            setReports(response.data[0].diagnosticReports);
            setFilterReports(response.data[0].diagnosticReports);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [modal, setModal] = useState({
        modalCreate: false,
        modalEdit: false
    });

    const deleteReport = (pId) => {
        let procedureId = pId;
        axios({
            method: 'delete',
            url: `http://localhost:5244/api/Procedure/${procedureId}`,
            params : {procedureId},
        }).then((response) => {
            getReports();
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [procedureId, setProcedureId] = useState(0);
    const [serviceObj, setServiceObj] = useState({});
    const [statusObj, setStatusObj] = useState({});

    const setEditModalAndData = (pId, sName, status) => {
        setIsOpen(true);
        setModal({...modal, modalEdit: true});
        setProcedureId(Number(pId));
        setServiceObj({value: sName.split(" ")[0].replace('(','').replace(')',''), label: `${sName.split(" ")[0]} ${sName.slice(sName.split(" ")[0].length, sName.length)}`});
        setStatusObj({value: status, label: status});
    }

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const setIsOpenFalse = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        document.title = 'Процедури пацієнта';
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                getReports();
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

    return (
            <div>                    
                    <div className={styles.filterSection}>
                        <div className={styles.container}>
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
                                        <button type="button" className={styles.filterButtons} onClick={() => filterReferrals(filter, filterReports)}>Пошук</button>
                                        <button type="button" className={styles.filterButtons} onClick={resetFilter}>Скинути фільтр</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.procedureCountBlock}>
                        <div className={styles.container}>
                            <p>Кількість ({reports.length})</p>
                        </div>
                    </div>

                        <div className={styles.tableSection}>
                            <div className={styles.container}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                        <th>№ П/П</th>
                                        <th>Категорія звіту</th>
                                        <th>Медична послуга</th>
                                        <th>Категорія послуги</th>
                                        <th>Заключення лікаря</th>
                                        <th>Виконавець</th>
                                        <th>Інтерпретував результати</th>
                                        <th>Дії</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            reports && reports.length > 0 ?
                                            reports.map((item, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.category}</td>
                                                        <td>{`(${item.service.serviceId}) ${item.service.serviceName}`}</td>
                                                        <td>{item.service.category.categoryName}</td>
                                                        <td>{item.conclusion}</td>
                                                        <td>{`${item.executantDoctor.surname} ${item.executantDoctor.name} ${item.executantDoctor.patronymic}`}</td>
                                                        <td>{`${item.interpretedDoctor.surname} ${item.interpretedDoctor.name} ${item.interpretedDoctor.patronymic}`}</td>
                                                        <td>{doctorId === item.executantDoctor.id ? 
                                                                <div className={styles.flexForAction}>
                                                                    <Image src={edit2_icon} alt='edit icon' className={styles.actionBtn} onClick={() => setEditModalAndData(item.procedureId, item.procedureName, item.status)}/>
                                                                    <Image src={delete_icon} alt='delete icon' className={styles.actionBtn} onClick={() => deleteReport(item.procedureId)}/>
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
                        <CreateProcedureModal isOpened={modal.modalCreate} onModalClose={() => setModal({...modal, modalCreate: false})} updateTable={getReports}></CreateProcedureModal>
                        <EditProcedureModal isOpened={modal.modalEdit} onModalClose={() => setModal({...modal, modalEdit: false})} updateTable={getReports} procedureId={procedureId} service={serviceObj} status={statusObj} isOpen={isOpen} setIsOpenFalse={setIsOpenFalse}></EditProcedureModal>
                    </div>
    )
}

export default ViewDiagnosticReports