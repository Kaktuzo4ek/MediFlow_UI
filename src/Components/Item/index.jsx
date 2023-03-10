import React from "react"
import styles from './item.module.scss'
import patient_icon from '../../assets/icons/searchPatient/patient.svg'
import { Image } from "react-bootstrap"
import ActionsModal from "../../ModalWindows/ActionsModal"
import { useState } from "react"

const Item = props => {

    const setParamsForModal = () => {
        props.setItem(props.item);
        props.setModalTrue();
    }

    if(!props.item.dateOfBirth) 
        return 0;

    return (
            <div className={styles.patientCard} key={props.item.patientId}>
                <div className={styles.containerFlex}>
                    <div className={styles.iconBlock}>
                        <Image src={patient_icon} alt='patient icon' className={styles.patientIcon}/>
                    </div>
                    <div className={styles.patientItem}>
                        <span className={styles.spans}><b>{props.item.surname} {props.item.name} {props.item.patronymic}</b></span><br/>
                        <span className={styles.spans}>ID: <b>{props.item.patientId}</b></span><br/>
                        <span className={styles.spans}>Дата народження: <b>{props.item.dateOfBirth.split('T')[0]}</b></span><br/>
                        <span className={styles.spans}>Телефон: <b>{props.item.phoneNumber}</b></span><br/>
                        <span className={styles.spans}>Населений пункт: <b>{props.item.city}</b></span><br/>
                        <button type="button" className={styles.actionBtn} onClick={setParamsForModal}>Дії</button>
                    </div>
                </div>
                <div className={styles.patientStatus}><span>Зареєстрований в MediFlow</span></div>
            </div>
    )
}

export default Item