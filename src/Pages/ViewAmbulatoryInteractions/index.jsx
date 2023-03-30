import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import styles from './viewInteractions.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import Navbar from "../../Components/Navbar";
import Select from "react-select";
import ViewAppointments from "../../Components/Ambulatory/ViewAppointments";

const ViewAmbulatoryInteractions = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const patientId = Number(localStorage.getItem('patientId'));
    const episodeId = localStorage.getItem("episodeId");
    let user;

    const [isAppointmentActive, setIsAppointmentActive] = useState(true);
    const [isProcedureActive, setIsProcedureActive] = useState(false);

    const navigate = useNavigate();

    const [patient, setPatient] = useState("");

    const getPatient = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/Patient/${patientId}`,
            params : {id: patientId},
        }).then((response) => {
            setPatient(`${response.data.surname} ${response.data.name} ${response.data.patronymic}`);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

    const activeAppointment = () => {
        setIsAppointmentActive(true);
        setIsProcedureActive(false);
    }

    const activeProcedure = () => {
        setIsAppointmentActive(false);
        setIsProcedureActive(true);
    }

    const [episodeName, setEpisodeName] = useState("");

    const getEpisode = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
            params : {id: episodeId},
        }).then((response) => {
            setEpisodeName(response.data[0].name);
        }).catch(error => console.error(`Error: ${error}`));
    }

    useEffect(() => {
        document.title = 'Перегляд амбулаторних взаємодій';
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                getPatient();
                getEpisode();
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

    return (
            <div>
                <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
                <Navbar isActiveHamburger={isActiveHamburger}/>
                <div className={styles.divideLine}></div>

                <div className={styles.headLine}>
                    <h1>Список взаємодій (Епізод - {episodeName})</h1>
                </div>

                <div className={styles.MainContainer}>
                    <div className={styles.container}>
                        <div className={styles.navInteractions}>
                            <button type="button" className={classNames(styles.navButtons, isAppointmentActive && styles.active)} onClick={activeAppointment}>Прийоми</button>
                            <button type="button" className={classNames(styles.navButtons, isProcedureActive && styles.active)} onClick={activeProcedure}>Процедури</button>
                        </div>

                        <div className={styles.line}></div>

                        {isAppointmentActive && <ViewAppointments/>}
                    </div>        
                </div>
            </div>
    )
}

export default ViewAmbulatoryInteractions
