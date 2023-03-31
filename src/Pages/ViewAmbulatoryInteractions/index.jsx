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
import ViewAppointments from "../../Components/Ambulatory/ViewInteractions/ViewAppointments";
import ViewReferrals from "../../Components/Ambulatory/ViewInteractions/ViewReferrals";
import ViewProcedures from "../../Components/Ambulatory/ViewInteractions/ViewProcedures";
import ViewDiagnosticReports from "../../Components/Ambulatory/ViewInteractions/ViewDiagnosticReports";
import { CSSTransition } from 'react-transition-group';

const ViewAmbulatoryInteractions = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const patientId = Number(localStorage.getItem('patientId'));
    const episodeId = localStorage.getItem("episodeId");
    let user;

    const [isAppointmentActive, setIsAppointmentActive] = useState(true);
    const [isReferralActive, setIsReferralActive] = useState(false);
    const [isProcedureActive, setIsProcedureActive] = useState(false);
    const [isDiagnosisActive, setIsDiagnosisActive] = useState(false);
    const [isDiagnosticReportActive, setIsDiagnosticReportActive] = useState(false);

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
        setIsReferralActive(false);
        setIsProcedureActive(false);
        setIsDiagnosticReportActive(false);
    }

    const activeRefererral = () => {
        setIsAppointmentActive(false);
        setIsReferralActive(true);
        setIsProcedureActive(false);
        setIsDiagnosticReportActive(false);
    }

    const activeProcedure = () => {
        setIsAppointmentActive(false);
        setIsReferralActive(false);
        setIsProcedureActive(true);
        setIsDiagnosticReportActive(false);
    }

    const activeDiagnosticReport = () => {
        setIsAppointmentActive(false);
        setIsReferralActive(false);
        setIsProcedureActive(false);
        setIsDiagnosticReportActive(true);
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
                            <button type="button" className={classNames(styles.navButtons, isAppointmentActive && styles.active)} onClick={activeAppointment}>Результати прийому</button>
                            <button type="button" className={classNames(styles.navButtons, isReferralActive && styles.active)} onClick={activeRefererral}>Направлення</button>
                            <button type="button" className={classNames(styles.navButtons, isProcedureActive && styles.active)} onClick={activeProcedure}>Процедури</button>
                            <button type="button" className={classNames(styles.navButtons, isDiagnosticReportActive && styles.active)} onClick={activeDiagnosticReport}>Діагностичні звіти</button>
                        </div>

                        <div className={styles.line}></div>
                        <CSSTransition 
                            in={isAppointmentActive} 
                            classNames={{
                                enter: styles.fadeEnter,
                                enterActive: styles.fadeEnterActive,
                                exit: styles.fadeExit,
                                exitActive: styles.fadeExitActive,
                               }} 
                            timeout={300} 
                            unmountOnExit
                        >
                           <ViewAppointments/>
                        </CSSTransition>

                        <CSSTransition 
                            in={isReferralActive} 
                            classNames={{
                                enter: styles.fadeEnter,
                                enterActive: styles.fadeEnterActive,
                                exit: styles.fadeExit,
                                exitActive: styles.fadeExitActive,
                               }} 
                            timeout={300} 
                            unmountOnExit
                        >
                            <ViewReferrals/>
                        </CSSTransition>

                        <CSSTransition 
                            in={isProcedureActive} 
                            classNames={{
                                enter: styles.fadeEnter,
                                enterActive: styles.fadeEnterActive,
                                exit: styles.fadeExit,
                                exitActive: styles.fadeExitActive,
                               }} 
                            timeout={300} 
                            unmountOnExit
                        >
                            <ViewProcedures/>
                        </CSSTransition>

                        
                        <CSSTransition 
                            in={isDiagnosticReportActive} 
                            classNames={{
                                enter: styles.fadeEnter,
                                enterActive: styles.fadeEnterActive,
                                exit: styles.fadeExit,
                                exitActive: styles.fadeExitActive,
                               }} 
                            timeout={300} 
                            unmountOnExit
                        >
                            <ViewDiagnosticReports/>
                        </CSSTransition>
                    </div>        
                </div>
            </div>
    )
}

export default ViewAmbulatoryInteractions
