import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../Components/Header";
import styles from "./viewDiagnosticReportInfo.module.scss";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "../../../../Components/Navbar";
import printIcon from "../../../../assets/icons/print.png";

const ViewDiagnosticReportInfo = () => {
  const diagnosticReportId = localStorage.getItem("diagnosticReportId");
  const [isActiveHamburger, setIsActiveHamburger] = useState(false);

  const navigate = useNavigate();

  const [report, setReport] = useState([]);

  const getProcedure = () => {
    axios({
      method: "get",
      url: `http://localhost:5244/api/DiagnosticReport/${diagnosticReportId}`,
      params: { id: diagnosticReportId },
    })
      .then((response) => {
        setReport(response.data);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  useEffect(() => {
    document.title = "Перегляд діагностичного звіту";
    getProcedure();
  }, []);

  if (!report.executantDoctor) return 0;

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
          <h1>Діагностичний звіт</h1>
        </div>
      </div>

      <div className={styles.MainContainer}>
        <div className={styles.container}>
          <div className={styles.btnContainer}>
            <button
              type="button"
              className={styles.navButtons}
              onClick={() => navigate("../doctor/patient-diagnostic-reports")}
            >
              Повернутися до переліку діагностичних звітів
            </button>
          </div>
          <div className={styles.signatureAndReportFlex}>
            <div className={styles.flexForReport}>
              <div className={styles.visitInfo}>
                <p>
                  Дата створення: <span>{report.date.split("T")[0]}</span>
                </p>
                <p>
                  Заклад: <span>{report.executantDoctor.institution.name}</span>
                </p>
                <p>
                  Лікар:{" "}
                  <span>{`${report.executantDoctor.surname} ${report.executantDoctor.name} ${report.executantDoctor.patronymic}`}</span>
                </p>
                <p>
                  Пацієнт:{" "}
                  <span>{`${report.patient.surname} ${report.patient.name} ${report.patient.patronymic}`}</span>
                </p>
                <p>
                  Примітка:{" "}
                  <span>
                    {report.referral
                      ? `Процедурою погашене електронне скерування №${report.referral.referralPackageId}`
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
                        Дата надання послуги:{" "}
                        <span>{`${report.date.split("T")[0]} ${report.date
                          .split("T")[1]
                          .slice(0, 5)}`}</span>
                      </p>
                      <p>
                        Виконавець діагностики:{" "}
                        <span>{`${report.executantDoctor.surname} ${report.executantDoctor.name} ${report.executantDoctor.patronymic}`}</span>
                      </p>
                      <p>
                        Працівник, що інтерпретував результати:{" "}
                        <span>{`${report.interpretedDoctor.surname} ${report.interpretedDoctor.name} ${report.interpretedDoctor.patronymic}`}</span>
                      </p>
                      <p>
                        Послуга:{" "}
                        <span>{`(${report.service.serviceId}) ${report.service.serviceName}`}</span>
                      </p>
                      <p>
                        Категорія: <span>{report.category}</span>
                      </p>
                      <p>
                        Заключення лікаря: <span>{report.conclusion}</span>
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
                  report.executantDoctor.surname
                } ${report.executantDoctor.name.slice(
                  0,
                  1
                )}. ${report.executantDoctor.patronymic.slice(0, 1)}.`}</span>
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

export default ViewDiagnosticReportInfo;
