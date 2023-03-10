import React from "react"
import styles from './items.module.scss'
import patient_icon from '../../assets/icons/searchPatient/patient.svg'
import { Image } from "react-bootstrap"
import Item from "../Item"
import ActionsModal from "../../ModalWindows/ActionsModal"
import { useState } from "react"

const PatientItems = props => {

    return (
        <div className={styles.searchResultItems}>
            {props.items.map((item, index) => (
                    <Item key={index} item={item} setItem={props.setItem} setModalTrue={props.setModalTrue}/>
            ))}
        </div>
    )
}

export default PatientItems