import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import styles from './viewReferral.module.scss'
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import Navbar from "../../Components/Navbar";
import saveIcon from '../../assets/icons/save.png'
import printIcon from '../../assets/icons/print.png'
import barcodeIcon from '../../assets/icons/barcode.png'
import { Image } from "react-bootstrap";

const ViewReferral = () => {

    const episodeId = Number(localStorage.getItem('episodeId'));
    const referralPackageId = localStorage.getItem('referralPackageId');
    const referralId = Number(localStorage.getItem('referralId'));

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

    const [episode, setEpisode] = useState([]);

    const getEpisode = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
            params : {id: episodeId},
        }).then((response) => {
            setEpisode(response.data[0]);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [referralPackage, setReferralPackage] = useState([]);
    const [referral, setReferral] = useState([]);

    const getReferral = () => {
        axios({
            method: 'get',
            url: `http://localhost:5244/api/ReferralPackage/${referralPackageId}`,
            params : {id: String(referralPackageId)},
        }).then((response) => {
            setReferralPackage(response.data[0]);
            response.data[0].referrals.map(item => item.referralId === referralId && setReferral(item));
        }).catch(error => console.error(`Error: ${error}`));
    }


    const generateBarcode = () => {
        // const { DOMImplementation, XMLSerializer } = require('xmldom');
        // const xmlSerializer = new XMLSerializer();
        // const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
        // const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        
        // JsBarcode(svgNode, 'test', {
        //     xmlDocument: document,
        // });
        
        // const svgText = xmlSerializer.serializeToString(svgNode);
    }

    useEffect(() => {
        document.title = "Перегляд направлення";
        getEpisode();
        getReferral();
    }, []);

    if(!episode.doctor)
        return 0;
    

    return (
            <div>
                <div className={styles.hide}>
                <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
                </div>
                <div className={styles.hide}>
                <Navbar isActiveHamburger={isActiveHamburger}/>
                </div>
                <div className={styles.divideLine}></div>

                <div className={styles.headLine}>
                    <div className={styles.divForTitle}><h1>Е-Направлення</h1></div>
                </div>

                <div className={styles.MainContainer}>
                    <div className={styles.container}>
                        <div className={styles.signatureAndReportFlex}>
                            <div className={styles.flexForReport}>
                                <div className={styles.visitInfo}>
                                    <p>Дата створення: <span>{episode.dateCreated.split("T")[0]}</span></p>
                                    <p>Заклад: <span>{episode.doctor.institution.name}</span></p>
                                    <p>Лікар: <span>{`${episode.doctor.surname} ${episode.doctor.name} ${episode.doctor.patronymic}`}</span></p>
                                    <p>Пацієнт: <span>{`${episode.patient.surname} ${episode.patient.name} ${episode.patient.patronymic}`}</span></p>
                                    <p>Діагноз: <span>{episode.diagnosisMKX10AM && `(${episode.diagnosisMKX10AM.diagnosisId}) ${episode.diagnosisMKX10AM.diagnosisName}`}</span></p>
                                </div>
                                <div className={styles.wrapper}>
                                    <div className={styles.referralData}>
                                        <div className={styles.referralHeader}>
                                            <h3>Електронне направлення: {referral.referralPackageId}</h3>
                                            <h3 className={styles.hForPrint}>Електронне направлення</h3>
                                            <Image src={barcodeIcon} className={styles.barcodePhoto}/>
                                        </div>
                                        <div className={styles.referralInfo}>
                                            <p>Категорія направлення: <span>{referral.category}</span></p>
                                            <p>Послуга: <span>{`(${referral.service.serviceId}) ${referral.service.serviceName}`}</span></p>
                                            <p>Джерело фінансування: <span>Програма державних фінансових гарантій медичного обслуговування населення</span></p>
                                            {referral.hospitalizationDepartment && <p>Відділення для госпіталізації: <span>{referral.hospitalizationDepartment.name}</span></p>}
                                            <p>Пріоритет направлення: <span>{referral.priority}</span></p>
                                            <p>Дата створення: <span>{`${referral.date.split("T")[0]} ${referral.date.split("T")[1].slice(0,5)}`}</span></p>
                                            <p>Термін дії направлення: <span>{`${referral.validity.split("T")[0]} ${referral.validity.split("T")[1].slice(0,5)}`}</span></p>
                                            <p>Статус направлення: <span>{referral.status}</span></p>
                                        </div>
                                        <div className={styles.referralInfoPrint}>
                                            <h4><b>№</b> {referral.referralPackageId}</h4>
                                            <h5>Інформаційна довідка</h5>
                                            <p>Дата виписування направлення: <span>{`${referral.date.split("T")[0]} ${referral.date.split("T")[1].slice(0,5)}`}</span></p>
                                            <p>Дійсне до: <span>{`${referral.validity.split("T")[0]} ${referral.validity.split("T")[1].slice(0,5)}`}</span></p>
                                            <p>Джерело фінансування: <span>Програма державних фінансових гарантій медичного обслуговування населення</span></p>
                                            <p>Пацієнт: <span>{`${referral.patient.surname} ${referral.patient.name} ${referral.patient.patronymic}`}</span></p>
                                            <p>Дата народження пацієнта: <span>{referral.patient.dateOfBirth.split("T")[0]}</span></p>
                                            <p>Категорія направлення: <span><b>{referral.category}</b></span></p>
                                            {referral.hospitalizationDepartment && <p>Відділення для госпіталізації: <span><b>{referral.hospitalizationDepartment.name}</b></span></p>}
                                            <p>Послуга: <span><b>{`(${referral.service.serviceId}) ${referral.service.serviceName}`}</b></span></p>
                                            <p>Пріоритет направлення: <span><b>{referral.priority}</b></span></p>
                                            <p>Тип епізоду: <span>{episode.type}</span></p>
                                            <p>Діагноз: <span>{`(${episode.diagnosisMKX10AM.diagnosisId}) ${episode.diagnosisMKX10AM.diagnosisName}`}</span></p>
                                            <p>Лікар: <span>{`${referral.doctor.surname} ${referral.doctor.name} ${referral.doctor.patronymic}`}</span></p>
                                            <p>Телефон лікаря: <span>{referral.doctor.phoneNumber}</span></p>
                                            <p>Найменування закладу охорони здоров'я: <span>{referral.doctor.institution.name}</span></p>
                                            <p>Код за ЄДРПОУ: <span>{referral.doctor.institution.institutionId}</span></p>
                                            <h5>Номер направлення: надіслано на номер <span>{referral.patient.phoneNumber}</span></h5>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                            <div className={styles.actionsAndSignatureFlex}>
                                <div className={styles.actions}>
                                    <div className={styles.actionDiv} onClick={() =>window.print()}><img src={printIcon}/><p>Друкувати</p></div>
                                </div>
                            </div>
                        </div>  
                    </div>        
                </div>
            </div>
    )
}

export default ViewReferral
