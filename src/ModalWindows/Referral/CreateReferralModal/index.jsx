import styles from './createReferral.module.scss'
import classNames from 'classnames'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { useRef } from 'react'

const CreateReferralModal = props => {

    function getRandomInt() {
        let min = Math.ceil(1000);
        let max = Math.floor(9999);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let userToken = JSON.parse(localStorage.getItem('user'));

    const [referralId, setReferralId] = useState(`${getRandomInt()}-${getRandomInt()}-${getRandomInt()}-${getRandomInt()}`);

    let referralPackageId;

    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);

    const patientId = Number(localStorage.getItem('patientId'));

    const [selectServicesData, setSelectServicesData] = useState([]);
    const [priorities, setPriorities] = useState({});
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
        setReferralId(`${getRandomInt()}-${getRandomInt()}-${getRandomInt()}-${getRandomInt()}`);
        referralPackageId = referralId;
        let tempServices = [];
        selectServicesData.map(s => tempServices.push(s.value));
        services = tempServices;
        priority = priorities.value;
    }

    const createReferral = () => {
        generateData();
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/ReferralPackage/Create',
            data: {
                referralPackageId,
                doctorId,
                patientId,
                priority,
                services,
            }
        }).then((response) => {
            props.updateTable();
            props.onModalClose();
        }).catch(error => console.error(`Error: ${error}`));
    }

    useEffect(() => {
            getServices();
    }, [])
    
    if(!serviceOptions)
        return 0;

    return(
        <div className={classNames(styles.modal_wrapper, `${props.isOpened ? styles.fadeIn: styles.fadeOut}`)} style={{...props.style}}>
            <div className={styles.modal_body}>
                <div className={styles.modal_close}><h3>Створення пакету направлень</h3><button onClick={props.onModalClose} className={styles.closeBtn}>×</button></div>
                <hr/>
                <div className={styles.updateSection}>
                    <div className={styles.inputsDiv}>
                        <form>
                            <div className={styles.form_group}>
                                <label htmlFor="select_service" className={styles.label}>Група послуг/послуга</label>
                                <Select 
                                    options={serviceOptions} 
                                    id="select_service" 
                                    className={styles.select} 
                                    onChange={setSelectServicesData} 
                                    isClearable 
                                    isMulti 
                                    noOptionsMessage={() => "Групи послуг/послуг не знайдено"} 
                                    placeholder='Виберіть групу послуг/послугу'
                                />
                            </div>
                            <div className={styles.form_group}>
                                <label htmlFor="select_priority" className={styles.label}>Пріоритет</label>
                                <Select 
                                    options={priorityOptions} 
                                    id="select_priority" 
                                    className={styles.select}
                                    onChange={setPriorities} 
                                    isClearable 
                                    noOptionsMessage={() => "Пріоритету не знайдено"} 
                                    placeholder='Виберіть пріоритет'
                                />
                            </div>
                            <div className={styles.container_update_btn}><button type="button" className={styles.updateBtn} onClick={createReferral} disabled={selectServicesData.length === 0 || priorities.value === undefined && 'disabled'}>Створити</button></div>
                        </form>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default CreateReferralModal