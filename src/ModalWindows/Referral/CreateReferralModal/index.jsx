import styles from './createReferral.module.scss'
import classNames from 'classnames'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { useRef } from 'react'

const CreateReferralModal = props => {

    let userToken = JSON.parse(localStorage.getItem('user'));

    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);

    const institutionId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

    const patientId = Number(localStorage.getItem('patientId'));

    const [selectServicesData, setSelectServicesData] = useState([]);
    const [priorities, setPriorities] = useState([]);
    let priority;
    let services = [];

    const [serviceOptions, setServiceOptions] = useState();
    
    const priorityOptions = [
        { value: 'Плановий', label: 'Плановий' },
        { value: 'Терміновий', label: 'Терміновий' },
    ]

    const categoryOptions = [
        { value: 'Візуалізація', label: 'Візуалізація' },
        { value: 'Госпіталізація', label: 'Госпіталізація' },
    ];
    const [selectCategoryData, setSelectCategoryData] = useState([]);

    const getServices = () => {
        let fillArray = [];
        let isFirstFill = true;
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

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectDepartmentData, setSelectDepartmentData] = useState([]);
    const [isHospitalization, setIsHospitalization] = useState(false);

    const getDepartments = () => {
        let fillArray = [];
        let isFirstFill = true;
        axios({
            method: 'post',
            url: 'http://localhost:5244/api/Department/GetDepartmentsByInstitutionId',
            params: {id: institutionId}
        }).then((response) => {
            if(isFirstFill){
                for(let i = 0; i < response.data.length; i++)
                    fillArray.push({value: response.data[i].departmentId, label: response.data[i].name});
                    setDepartmentOptions(fillArray);
            }
            isFirstFill = false;
        }).catch(error => console.error(`Error: ${error}`));
    }

    
    const changeSelectCategoryData = (selectCategoryData) => {
        if (!selectCategoryData) {
            selectCategoryData = [];
          }
        setSelectCategoryData(selectCategoryData);
        if(selectCategoryData.value === "Госпіталізація")
            setIsHospitalization(true);
        else 
            setIsHospitalization(false);
    };

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
            url: 'http://localhost:5244/api/ReferralPackage/Create',
            data: {
                doctorId,
                patientId,
                priority,
                services,
            }
        }).then((response) => {
            setSelectServicesData([]);
            setPriorities([]);
            props.updateTable();
            props.onModalClose();
        }).catch(error => console.error(`Error: ${error}`));
    }

    useEffect(() => {
            getServices();
            getDepartments();
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
                                    value={selectServicesData} 
                                    isClearable 
                                    //isMulti 
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
                                    value={priorities}
                                    isClearable 
                                    noOptionsMessage={() => "Пріоритету не знайдено"} 
                                    placeholder='Виберіть пріоритет'
                                />
                            </div>
                            <div className={styles.form_group}>
                                <label htmlFor="select_category" className={styles.label}>Категорія</label>
                                <Select 
                                    options={categoryOptions} 
                                    id="select_category" 
                                    className={styles.select}
                                    onChange={changeSelectCategoryData} 
                                    value={selectCategoryData}
                                    isClearable 
                                    noOptionsMessage={() => "Категорії не знайдено"} 
                                    placeholder='Виберіть категорію'
                                />
                            </div>
                            {isHospitalization &&
                            <div className={styles.form_group}>
                                <label htmlFor="select_category" className={styles.label}>Відділення для госпіталізації</label>
                                <Select 
                                    options={departmentOptions} 
                                    id="select_category" 
                                    className={styles.select}
                                    onChange={setSelectDepartmentData} 
                                    value={selectDepartmentData}
                                    isClearable 
                                    noOptionsMessage={() => "Відділення не знайдено"} 
                                    placeholder='Виберіть відділення для госпіталізації'
                                />
                            </div>
                            }
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