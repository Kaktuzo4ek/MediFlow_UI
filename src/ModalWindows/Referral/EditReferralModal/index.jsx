import styles from './editReferral.module.scss'
import classNames from 'classnames'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'

const EditReferralModal = props => {

    const referralId = props.referalId;

    const [selectServicesData, setSelectServicesData] = useState([]);
    const [priorities, setPriorities] = useState({});
    let priority;
    let serviceId;


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

    const updateReferral = () => {
        serviceId = selectServicesData.value;
        priority = priorities.value;
        axios({
            method: 'put',
            url: `http://localhost:5244/api/Referral/${referralId}`,
            data: {
                referralId,
                priority,
                serviceId,
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
        <div className={classNames(styles.modal_wrapper, `${props.isOpened ? styles.open: styles.close}`)} style={{...props.style}}>
            <div className={styles.modal_body}>
                <div className={styles.modal_close}><button onClick={props.onModalClose} className={styles.closeBtn}>×</button></div>
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
                                    noOptionsMessage={() => "Групи послуг/послуг не знайдено"} 
                                    placeholder='Виберіть пріоритет'
                                />
                            </div>
                            <div className={styles.container_update_btn}>
                                <button type="button" className={styles.updateBtn} onClick={updateReferral} disabled={selectServicesData.value === undefined || priorities.value === undefined && 'disabled'}>Зберегти дані</button>
                            </div>
                        </form>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default EditReferralModal