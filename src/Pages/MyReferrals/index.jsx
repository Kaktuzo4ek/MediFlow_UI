import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import styles from './myReferrals.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import edit2_icon from '../../assets/icons/profilePage/edit2.png'
import { Image } from "react-bootstrap";
import delete_icon from '../../assets/icons/delete.png'
import EditReferralModal from "../../ModalWindows/Referral/EditReferralModal";
import Navbar from "../../Components/Navbar";

const MyReferrals = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));

    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);

    const navigate = useNavigate();

    let user;

    const [filter, setFilter] = useState('');
    const changeFilter = event => {
        setFilter(event.target.value)
    }

    const inputRefId = document.getElementById('filter_refId');
    const inputDate = document.getElementById('filter_date');
    const inputService = document.getElementById('filter_service');
    const inputPriority = document.getElementById('filter_priority');
    const inputCategory = document.getElementById('filter_category');
    const inputPatient = document.getElementById('filter_patient');
    const inputStatus = document.getElementById('filter_status');

    const [filterBy, setFilterBy] = useState('');

    const changeFilterBy = event => {
        setFilterBy(event.target.value);
        if(event.target.value === 'refId') 
            inputRefId.classList.toggle(styles.visible);
        else
            inputRefId.classList.remove(styles.visible);

        if(event.target.value === 'date') 
            inputDate.classList.toggle(styles.visible);
        else
            inputDate.classList.remove(styles.visible);

        if(event.target.value === 'service') 
            inputService.classList.toggle(styles.visible);
        else
            inputService.classList.remove(styles.visible);

        if(event.target.value === 'priority') 
            inputPriority.classList.toggle(styles.visible);
        else
            inputPriority.classList.remove(styles.visible);
        if(event.target.value === 'category') 
            inputCategory.classList.toggle(styles.visible);
        else
            inputCategory.classList.remove(styles.visible);
        if(event.target.value === 'patient') 
            inputPatient.classList.toggle(styles.visible);
        else
            inputPatient.classList.remove(styles.visible);
        if(event.target.value === 'status') 
            inputStatus.classList.toggle(styles.visible);
        else
            inputStatus.classList.remove(styles.visible);
        
    }


    const resetFilter = () => {
        setFilter('');
        setFilterBy('Пошук за');
        inputRefId.classList.remove(styles.visible);
        inputDate.classList.remove(styles.visible);
        inputService.classList.remove(styles.visible);
        inputPriority.classList.remove(styles.visible);
        inputCategory.classList.remove(styles.visible);
        inputPatient.classList.remove(styles.visible);
        inputStatus.classList.remove(styles.visible);
        getReferrals();
    }

    const [referralPackages, setReferralPackages] = useState([]);
    let [referralsFilter, setReferralsFilter] = useState([]);

    let patientId = localStorage.getItem('patientId');

    const [isFinished, setIsFinished] = useState([]);

    const getReferrals = () => {
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/ReferralPackage/GetMyReferrals',
            params : {doctorId},
        }).then((response) => {
            setReferralPackages(response.data);
            setReferralsFilter(response.data);
            let tmpArr = [];
            let count = 0;
            response.data.map(item => {
                item.referrals.map(r => {
                    count++;
                    if(r.processStatus.slice(0,8) === 'Погашене')
                        tmpArr[count] = true;
                    else
                        tmpArr[count] = false;
                });
            });
            setIsFinished(tmpArr);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [modal, setModal] = useState({
        modal: false,
        modalCreate: false
    });

    const [referralIdModal, setReferralIdModal] = useState('');

    useEffect(() => {
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                getReferrals();
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

    const [serviceObj, setServiceObj] = useState({});
    const [priorityObj, setPriorityObj] = useState({});

    const setModalAndData = (refId, sId, sName, priority) => {
        setIsOpen(true);
        setModal({...modal, modal: true});
        setReferralIdModal(Number(refId));
        setServiceObj({value: sId, label: sName});
        setPriorityObj({value: priority, label: priority});
    }

    const deleteReferral = (refId, refPackId) => {
        let referralId = refId;
        let referralPackageId = refPackId;
        axios({
            method: 'delete',
            url: `http://localhost:5244/api/Referral/${referralId}`,
            params : {referralId, referralPackageId},
        }).then((response) => {
            getReferrals();
        }).catch(error => console.error(`Error: ${error}`));
    }

    
    const filterReferrals = (filter, arrayForFilter) => {
        switch(filterBy) {
            case 'refId':
                setReferralPackages(arrayForFilter.filter(({referralPackageId}) => referralPackageId.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'date':
                setReferralPackages(arrayForFilter.filter(({date}) => date.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'service':
                setReferralPackages(arrayForFilter.filter((item) => (item.referrals = item.referrals.filter(({service}) => (service.serviceId+" "+service.serviceName).toLowerCase().includes(filter.toLowerCase()))).length > 0));
                break;
            case 'priority':
                setReferralPackages(arrayForFilter.filter((item) => (item.referrals = item.referrals.filter(({priority}) => priority.toLowerCase().includes(filter.toLowerCase()))).length > 0));
                break;
            case 'category':
                setReferralPackages(arrayForFilter.filter((item) => (item.referrals = item.referrals.filter(({service}) => service.category.categoryName.toLowerCase().includes(filter.toLowerCase()))).length > 0));
                break;
            case 'patient':
                setReferralPackages(arrayForFilter.filter(({patient}) => (patient.surname+" "+ patient.name+" "+patient.patronymic).toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'status':
                setReferralPackages(arrayForFilter.filter((item) => (item.referrals = item.referrals.filter(({processStatus}) => processStatus.toLowerCase().includes(filter.toLowerCase()))).length > 0));
                break;
        }
    }

    let count = 1;
    let tmpRefCount = 0;
    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const setIsOpenFalse = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        document.title = 'Мої направлення'
    }, []);

    return (
            <div>
                <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
                <Navbar isActiveHamburger={isActiveHamburger}/>
                <div className={styles.divideLine}></div>

                <div className={styles.headLine}>
                    <h1>Мої направлення</h1>
                </div>

                <div className={styles.MainContainer}>
                    <div className={styles.filterSection}>
                        <div className={styles.container}>
                            <div className={styles.filterContainer}>
                                <div className={styles.flexSelectAndBtn}>
                                    <div className={styles.flexForSelects}>
                                        <select id="select_filter" className={classNames('form-select', styles.select)} value={filterBy} onChange={changeFilterBy}>
                                            <option value='null'>Пошук за</option>
                                            <option value='refId'>Номер направлення</option>
                                            <option value='date'>Дата виписування</option>  
                                            <option value='service'>Група послуг/послуга</option>
                                            <option value='priority'>Пріоритет</option>
                                            <option value='category'>Категорія</option>
                                            <option value='patient'>ПІБ пацієнта</option>
                                            <option value='status'>Статус процесу</option>
                                        </select>
                                        <input type="text" id="filter_refId" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть номер направлення'/>
                                        <input type="text" id="filter_date" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder="Введіть дату виписування"/>
                                        <input type="text" id="filter_service" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть групу послуг/послугу'/>
                                        <input type="text" id="filter_priority" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть пріоритет'/>
                                        <input type="text" id="filter_category" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть категорію'/>
                                        <input type="text" id="filter_patient" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть ПІБ пацієнта'/>
                                        <input type="text" id="filter_status" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть статус процесу'/>
                                    </div>
                                    <div className={styles.flexButtons}>
                                        <button type="button" className={styles.filterButtons} onClick={() => filterReferrals(filter, referralsFilter)}>Пошук</button>
                                        <button type="button" className={styles.filterButtons} onClick={resetFilter}>Скинути фільтр</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.procedureCountBlock}>
                        <div className={styles.container}>
                            <p {...referralPackages.map(item => tmpRefCount = tmpRefCount + item.referrals.length)}>Кількість ({tmpRefCount})</p>
                        </div>
                    </div>

                    <div className={styles.tableSection}>
                        <div className={styles.container}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                        <th>№ П/П</th>
                                        <th>Номер направлення</th>
                                        <th>Статус процесу</th>
                                        <th>Дата виписування</th>
                                        <th>Пріоритет</th>
                                        <th>Категорія</th>
                                        <th>Група послуг/послуга</th>
                                        <th>Вік</th>
                                        <th>Пацієнт</th>
                                        <th>Дійсне до</th>
                                        <th>Дії</th>
                                        </tr>
                                    </thead>
                                    {
                                        referralPackages && referralPackages.length > 0 ?
                                        referralPackages.map((itemPackage, indexPackage) => ( 
                                            <tbody>
                                                {itemPackage.referrals.map((item, index) => (
                                                        <tr key={index} className={isFinished[count] ? styles.finishedReferral : console.log(isFinished)}>
                                                            <td>{count++}</td>
                                                            <td>{item.referralPackageId}</td>
                                                            <td>{item.processStatus.split(' (')[0]}</td>
                                                            <td>{itemPackage.date.split('T')[0]}</td>
                                                            <td>{item.priority}</td>
                                                            <td>{item.service.category.categoryName}</td>
                                                            <td>({item.service.serviceId}) {item.service.serviceName}</td>
                                                            <td>{new Date().getFullYear() - itemPackage.patient.dateOfBirth.slice(0,4)}</td>
                                                            <td>{itemPackage.patient.surname} {itemPackage.patient.name} {itemPackage.patient.patronymic}</td>
                                                            <td>{itemPackage.validity.split('T')[0]}</td>
                                                            <td> {doctorId === itemPackage.doctor.id && item.processStatus.split(' (')[0] !== 'Погашене' ? 
                                                                <div className={styles.flexForAction}>
                                                                    <Image src={edit2_icon} alt='edit icon' className={styles.actionBtn} onClick={() => setModalAndData(item.referralId, item.service.serviceId, item.service.serviceName, item.priority)}/>
                                                                    <Image src={delete_icon} alt='delete icon' className={styles.actionBtn} onClick={() => deleteReferral(item.referralId, item.referralPackageId)}/>
                                                                </div> : ''}
                                                            </td>
                                                        </tr>
                                                ))}
                                            </tbody>
                                        )) : ''
                                    }
                                </table>
                            </div>
                    </div>
                </div>
                <EditReferralModal isOpened={modal.modal} onModalClose={() => setModal({...modal, modal: false})} referalId={referralIdModal} service={serviceObj} priority={priorityObj} updateTable={getReferrals} isOpen={isOpen} setIsOpenFalse={setIsOpenFalse}></EditReferralModal>
            </div>
    )
}

export default MyReferrals