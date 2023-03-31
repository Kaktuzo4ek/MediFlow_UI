import React from "react";
import styles from './createReferralPackage.module.scss'
import Select from 'react-select'
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateReferralPackage = () => {
    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const institutionId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
    const patientId = Number(localStorage.getItem('patientId'));
    const episodeId = localStorage.getItem('episodeId');

    const [selectServicesData, setSelectServicesData] = useState([]);
    const [priorities, setPriorities] = useState([]);
    let priority;
    let services = [];

    const [serviceOptions, setServiceOptions] = useState();
    
    const priorityOptions = [
        { value: 'Плановий', label: 'Плановий' },
        { value: 'Терміновий', label: 'Терміновий' },
    ]

    let fillArray = [];
    let isFirstFill = true;

    const getServices = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5244/api/Service',
        }).then((response) => {
            if(isFirstFill){
                for(let i = 0; i < response.data.length; i++)
                    fillArray.push({value: (response.data[i].serviceId), label: `(${response.data[i].serviceId})` +" "+ (response.data[i].serviceName)});
                setServiceOptions(fillArray);
            }
            isFirstFill = false;
        }).catch(error => console.error(`Error: ${error}`));
    }

    const generateData = () => {
        let tempServices = [];
        selectServicesData.map(s => tempServices.push(s.value));
        services = tempServices;
        priority = priorities.value;
    }

    const createReferral = () => {
        generateData();
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/AmbulatoryEpisode/CreateReferralPackage',
            params: {episodeId},
            data: {
                doctorId,
                patientId,
                priority,
                services,
            }
        }).then((response) => {
            toast.success("Пакет направлень успішно створений!", {theme: "colored"});
            setSelectServicesData([]);
            setPriorities([]);
        }).catch(error => {
            toast.error("Помилка серверу!", {theme: "colored"});
            console.error(`Error: ${error}`)
        });
    }

    useEffect(() => {
            getServices();
    }, []);

    return (
        <div>
            <div className={styles.referralPackageBlock}>
                <ToastContainer />
                <h2>Створити пакет направлень</h2>
                <form>
                    <div className={styles.form_group}>
                        <label htmlFor="select_service" className={styles.label}>Група послуг/послуга <span>*</span></label>
                        <Select 
                            options={serviceOptions} 
                            id="select_service" 
                            className={styles.select} 
                            onChange={setSelectServicesData}
                            value={selectServicesData} 
                            isClearable 
                            isMulti 
                            noOptionsMessage={() => "Групи послуг/послуг не знайдено"} 
                            placeholder='Виберіть групу послуг/послугу'
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="select_priority" className={styles.label}>Пріоритет <span>*</span></label>
                        <Select 
                            options={priorityOptions} 
                            id="select_priority" 
                            className={styles.select}
                            onChange={setPriorities}
                            value={priorities} 
                            isClearable 
                            noOptionsMessage={() => "Пріоритету не знайдено"} 
                            placeholder='Виберіть пріоритет'
                        />
                    </div>
                    <div className={styles.container_update_btn}><button type="button" className={styles.updateBtn} onClick={createReferral}>Створити</button></div>
                </form>
            </div>
        </div>
    )
}

export default CreateReferralPackage