import React from "react";
import styles from './createProcedure.module.scss'
import Select from 'react-select'
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProcedure = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const institutionId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
    const patientId = Number(localStorage.getItem('patientId'));
    const episodeId = localStorage.getItem('episodeId');

    const [referralPackageId, setReferralPackageId] = useState('');
    const changeReferralPackageId = event => {
        setReferralPackageId(event.target.value);
    }

    const [selectServicesData, setSelectServicesData] = useState({});
    const [serviceOptions, setServiceOptions] = useState();

    const [selectStatusData, setSelectStatusData] = useState({});

    const statusOptions = [
        { value: 'Інше', label: 'Інше' },
        { value: 'Процедура відмінена', label: 'Процедура відмінена' },
        { value: 'Процедура відмінена: відмова пацієнта', label: 'Процедура відмінена: відмова пацієнта' },
        { value: 'Процедура відмінена: протипокази до процедури', label: 'Процедура відмінена: протипокази до процедури' },
        { value: 'Процедура проведено успішно', label: 'Процедура проведено успішно' },
        { value: 'Проведення процедури не завершено: ускладнення, які виникли в процесі процедури', label: 'Проведення процедури не завершено: ускладнення, які виникли в процесі процедури' },
        { value: 'Проведення процедури не завершено: пацієнт відмовився від продовження процедури', label: 'Проведення процедури не завершено: пацієнт відмовився від продовження процедури' },
        { value: 'Проведення процедури не завершено: технічні проблеми', label: 'Проведення процедури не завершено: технічні проблеми' },
        { value: 'Процедура проведена не успішно', label: 'Процедура проведена не успішно' }
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

    const createProcedure = () => {
        let serviceId = selectServicesData.value;
        let status = selectStatusData.value;
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/Procedure/Create',
            data: {
                referralPackageId,
                doctorId,
                patientId,
                serviceId,
                status
            }
        }).then((response) => {
        }).catch(error => console.error(`Error: ${error}`));
    }

    useEffect(() => {
        getServices();
    }, [])

    return (
        <div>
            <div className={styles.procedureBlock}>
                <ToastContainer />
                <h2>Cтворити процедуру</h2>
                <form>
                    <div className={styles.form_group}>
                        <label htmlFor="input_referralId" className={styles.label}>Номер направлення</label>
                        <input type="text" id="input_referralId" className='form-control' value={referralPackageId} onChange={changeReferralPackageId} placeholder="Номер направлення"/>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="select_service" className={styles.label}>Група послуг/послуга</label>
                        <Select 
                            options={serviceOptions} 
                            id="select_service" 
                            className={styles.select} 
                            onChange={setSelectServicesData} 
                            isClearable 
                            noOptionsMessage={() => "Групи послуг/послуг не знайдено"} 
                            placeholder='Виберіть групу послуг/послугу'
                        />
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="select_status" className={styles.label}>Результат процедури</label>
                        <Select 
                            options={statusOptions} 
                            id="select_status" 
                            className={styles.select} 
                            onChange={setSelectStatusData} 
                            isClearable 
                            noOptionsMessage={() => "Результату процедури не знайдено"} 
                            placeholder='Виберіть результат процедури'
                        />
                    </div>
                    <div className={styles.container_update_btn}><button type="button" className={styles.updateBtn}>Створити</button></div>
                </form>
            </div>
        </div>
    )
}

export default CreateProcedure