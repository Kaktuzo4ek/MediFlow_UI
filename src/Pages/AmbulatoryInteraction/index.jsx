import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import styles from './ambulatoryInteraction.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import Navbar from "../../Components/Navbar";
import Select from "react-select";
import CreateAppointment from "../../Components/Ambulatory/CreateInteractions/CreateAppointment";
import CreateDiagnosis from "../../Components/Ambulatory/CreateInteractions/CreateDiagnosis";
import CreateReferralPackage from "../../Components/Ambulatory/CreateInteractions/CreateReferralPackage";
import CreateDiagnosticReport from "../../Components/Ambulatory/CreateInteractions/CreateDiagnosticReport"
import CreateProcedure from "../../Components/Ambulatory/CreateInteractions/CreateProcedure"
import { CSSTransition } from 'react-transition-group';

const AmbulatoryInteraction = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const doctorId = Number(userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    const patientId = Number(localStorage.getItem('patientId'));
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
        setIsDiagnosisActive(false);
        setIsDiagnosticReportActive(false);
    }

    const activeRefererral = () => {
        setIsAppointmentActive(false);
        setIsReferralActive(true);
        setIsProcedureActive(false);
        setIsDiagnosisActive(false);
        setIsDiagnosticReportActive(false);
    }

    const activeProcedure = () => {
        setIsAppointmentActive(false);
        setIsReferralActive(false);
        setIsProcedureActive(true);
        setIsDiagnosisActive(false);
        setIsDiagnosticReportActive(false);
    }

    const activeDiagnosis = () => {
        setIsAppointmentActive(false);
        setIsReferralActive(false);
        setIsProcedureActive(false);
        setIsDiagnosisActive(true);
        setIsDiagnosticReportActive(false);
    }

    const activeDiagnosticReport = () => {
        setIsAppointmentActive(false);
        setIsReferralActive(false);
        setIsProcedureActive(false);
        setIsDiagnosisActive(false);
        setIsDiagnosticReportActive(true);
    }

    useEffect(() => {
        document.title = 'Амбулаторні взаємодія';
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                getPatient();
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
                    <h1>Амбулаторна взаємодія<br/>Пацієнт {patient}</h1>
                </div>

                <div className={styles.MainContainer}>
                    <div className={styles.container}>
                        <div className={styles.navInteractions}>
                            <button type="button" className={classNames(styles.navButtons, isAppointmentActive && styles.active)} onClick={activeAppointment}>Результати прийому</button>
                            <button type="button" className={classNames(styles.navButtons, isDiagnosisActive && styles.active)} onClick={activeDiagnosis}>Діагноз</button>
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
                            <CreateAppointment/>
                        </CSSTransition>

                        <CSSTransition 
                            in={isDiagnosisActive}                            
                            classNames={{
                                enter: styles.fadeEnter,
                                enterActive: styles.fadeEnterActive,
                                exit: styles.fadeExit,
                                exitActive: styles.fadeExitActive,
                               }} 
                            timeout={300} 
                            unmountOnExit
                        >
                            <CreateDiagnosis/>
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
                            <CreateReferralPackage/>
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
                            <CreateProcedure/>
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
                            <CreateDiagnosticReport/>
                        </CSSTransition>
                    </div>        
                </div>
            </div>
    )
}

export default AmbulatoryInteraction
