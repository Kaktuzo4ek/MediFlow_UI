import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../Components/Header";
import styles from "./viewProcedureInfo.module.scss";
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import Navbar from "../../../../Components/Navbar";
import printIcon from "../../../../assets/icons/print.png";

const ViewProcedureInfo = () => {
  const procedureId = localStorage.getItem("procedureId");
  const [isActiveHamburger, setIsActiveHamburger] = useState(false);

  const navigate = useNavigate();

  const [procedure, setProcedure] = useState([]);

  const getProcedure = () => {
    axios({
      method: "get",
      url: `http://localhost:5244/api/Procedure/${procedureId}`,
      params: { id: procedureId },
    })
      .then((response) => {
        setProcedure(response.data);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  useEffect(() => {
    document.title = "Перегляд процедури";
    getProcedure();
  }, []);

  if (!procedure.doctor) return 0;

  return (
    <div>
      <div className={styles.hide}>
        <Header
          isActiveHamburger={isActiveHamburger}
          setIsActiveHamburger={setIsActiveHamburger}
        />
      </div>
      <div className={styles.hide}>
        <Navbar isActiveHamburger={isActiveHamburger} />
      </div>
      <div className={styles.divideLine}></div>

      <div className={styles.headLine}>
        <div className={styles.divForTitle}>
          <h1>Процедура</h1>
        </div>
      </div>

      <div className={styles.MainContainer}>
        <div className={styles.container}>
          <div className={styles.btnContainer}>
            <button
              type="button"
              className={styles.navButtons}
              onClick={() => navigate("../doctor/patient-procedures")}
            >
              Повернутися до переліку процедур
            </button>
          </div>
          <div className={styles.signatureAndReportFlex}>
            <div className={styles.flexForReport}>
              <div className={styles.visitInfo}>
                <p>
                  Дата створення:{" "}
                  <span>{procedure.dateCreated.split("T")[0]}</span>
                </p>
                <p>
                  Заклад: <span>{procedure.doctor.institution.name}</span>
                </p>
                <p>
                  Лікар:{" "}
                  <span>{`${procedure.doctor.surname} ${procedure.doctor.name} ${procedure.doctor.patronymic}`}</span>
                </p>
                <p>
                  Пацієнт:{" "}
                  <span>{`${procedure.patient.surname} ${procedure.patient.name} ${procedure.patient.patronymic}`}</span>
                </p>
                <p>
                  Примітка:{" "}
                  <span>
                    {procedure.referral
                      ? `Процедурою погашене електронне скерування №${procedure.referral.referralPackageId}`
                      : "-"}
                  </span>
                </p>
              </div>
              <div className={styles.wrapper}>
                <div className={styles.visitResult}>
                  <div className={styles.medicalEvents}>
                    <h3>Процедура</h3>
                    <div className={styles.visitResultInfo}>
                      <p>
                        Послуга: <span>{procedure.procedureName}</span>
                      </p>
                      <p>
                        Категорія процедури: <span>{procedure.category}</span>
                      </p>
                      <p>
                        Дата проведення процедури:{" "}
                        <span>{`${
                          procedure.eventDate.split("T")[0]
                        } ${procedure.eventDate
                          .split("T")[1]
                          .slice(0, 5)}`}</span>
                      </p>
                      <p>
                        Результат проведення процедури:{" "}
                        <span>{procedure.status}</span>
                      </p>
                      <p>
                        Заклад надання послуги:{" "}
                        <span>{procedure.doctor.institution.name}</span>
                      </p>
                      <p>
                        Нотатки: <span>{procedure.notes}</span>
                      </p>
                      <p>
                        Виконавець:{" "}
                        <span>{`${procedure.doctor.surname} ${procedure.doctor.name} ${procedure.doctor.patronymic}`}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.actionsAndSignatureFlex}>
              <div className={styles.actions}>
                <div
                  className={styles.actionDiv}
                  onClick={() => window.print()}
                >
                  <img src={printIcon} />
                  <p>Друкувати</p>
                </div>
              </div>
              <div className={styles.signature}>
                <p>Лікар</p>
                <span>{`${
                  procedure.doctor.surname
                } ${procedure.doctor.name.slice(
                  0,
                  1
                )}. ${procedure.doctor.patronymic.slice(0, 1)}.`}</span>
                <i></i>
              </div>
            </div>
          </div>
          <div className={styles.copyright}>
            Документ сформовано Медичною Інформаційною Системою MediFlow
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProcedureInfo;
