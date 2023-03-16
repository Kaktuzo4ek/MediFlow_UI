import styles from './editProcedure.module.scss'
import classNames from 'classnames'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { useRef } from 'react'

const EditProcedureModal = props => {

    const [selectServicesData, setSelectServicesData] = useState(props.service);
    const [serviceOptions, setServiceOptions] = useState();

    const [selectStatusData, setSelectStatusData] = useState(props.status);

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

    const editProcedure = () => {
        let procedureId = props.procedureId;
        axios({
            method: 'put',
            url: `http://localhost:5244/api/Procedure/${procedureId}`,
            data: {
                procedureId,
                serviceId: selectServicesData.value,
                status: selectStatusData.value,
                prevServiceId: props.service.value
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
                                    value={selectServicesData}
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
                                    value={selectStatusData}
                                    isClearable 
                                    noOptionsMessage={() => "Результату процедури не знайдено"} 
                                    placeholder='Виберіть результат процедури'
                                />
                            </div>
                            <div className={styles.container_update_btn}><button type="button" className={styles.updateBtn} onClick={editProcedure} disabled={(!selectServicesData || !selectStatusData)  && 'disabled'}>Зберегти</button></div>
                        </form>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default EditProcedureModal