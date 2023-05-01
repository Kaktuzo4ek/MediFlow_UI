import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import styles from "./viewAmbulatoryEpisodeReport.module.scss";
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import Navbar from "../../Components/Navbar";
import saveIcon from "../../assets/icons/save.png";
import printIcon from "../../assets/icons/print.png";

const ViewAmbulatoryEpisodeReport = () => {
  const episodeId = localStorage.getItem("episodeId");
  const [isActiveHamburger, setIsActiveHamburger] = useState(false);

  const [episode, setEpisode] = useState([]);

  const getEpisode = () => {
    axios({
      method: "get",
      url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
      params: { id: episodeId },
    })
      .then((response) => {
        setEpisode(response.data[0]);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  useEffect(() => {
    document.title = "Звіт до амбулаторного епізоду";
    getEpisode();
  }, []);

  if (!episode.doctor) return 0;

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
        <div className={styles.institutionInfo}>
          <p>
            Заклад: <span>{episode.doctor.institution.name}</span>
          </p>
          <p>
            Адреса: <span>{episode.doctor.institution.adress}</span>
          </p>
          <p>
            Код ЄДРПОУ: <span>{episode.doctor.institution.institutionId}</span>
          </p>
        </div>
        <div className={styles.appointmentInfo}>
          <p>
            Дата створення: <span>{episode.dateCreated.split("T")[0]}</span>
          </p>
          <p>
            Пацієнт:{" "}
            <span>{`${episode.patient.surname} ${episode.patient.name} ${episode.patient.patronymic}`}</span>
          </p>
          <p>
            Адреса проживання: <span>{episode.patient.city}</span>
          </p>
          <p>
            Дата народження:{" "}
            <span>{episode.patient.dateOfBirth.split("T")[0]}</span>
          </p>
          <p>
            Вік:{" "}
            <span>
              {new Date().getFullYear() -
                episode.patient.dateOfBirth.split("-")[0]}
            </span>
          </p>
          <p>
            Стать: <span>Жіноча</span>
          </p>
        </div>
        <div className={styles.divForTitle}>
          <h1>Амбулаторна взаємодія</h1>
        </div>
      </div>

      <div className={styles.MainContainer}>
        <div className={styles.container}>
          <div className={styles.signatureAndReportFlex}>
            <div className={styles.flexForReport}>
              <div className={styles.visitInfo}>
                <p>
                  Дата створення:{" "}
                  <span>{episode.dateCreated.split("T")[0]}</span>
                </p>
                <p>
                  Заклад: <span>{episode.doctor.institution.name}</span>
                </p>
                <p>
                  Лікар:{" "}
                  <span>{`${episode.doctor.surname} ${episode.doctor.name} ${episode.doctor.patronymic}`}</span>
                </p>
                <p>
                  Пацієнт:{" "}
                  <span>{`${episode.patient.surname} ${episode.patient.name} ${episode.patient.patronymic}`}</span>
                </p>
              </div>
              <div className={styles.wrapper}>
                {episode.appointments.map((item) => (
                  <div className={styles.visitResult}>
                    <div className={styles.medicalEvents}>
                      <h3>Медична подія</h3>
                      <div className={styles.visitResultInfo}>
                        <p>
                          Дата та час візиту пацієта:{" "}
                          <span>{`${item.date.split("T")[0]} ${item.date
                            .split("T")[1]
                            .slice(0, 5)}`}</span>
                        </p>
                        <p>
                          Причина звернення:{" "}
                          <span>
                            {item.appointmentsAndDiagnosesICPC2.map(
                              (a, index) =>
                                `(${a.diagnosisICPC2.diagnosisCode}) ${
                                  a.diagnosisICPC2.diagnosisName
                                } ${
                                  index + 1 !==
                                  item.appointmentsAndDiagnosesICPC2.length
                                    ? ", "
                                    : ""
                                }`
                            )}
                          </span>
                        </p>
                        <p>
                          Тип візиту: <span>{item.interactionType}</span>
                        </p>
                        <p>
                          Клас зустрічей: <span>{item.interactionClass}</span>
                        </p>
                        <p>
                          Встановлено діагноз (МКХ-10AM):{" "}
                          <span>
                            {episode.diagnosisMKX10AM &&
                              episode.diagnosisMKX10AM.diagnosisName}
                          </span>
                        </p>
                        <p>
                          Відвідування: <span>{item.visiting}</span>
                        </p>
                        <p>
                          Коментарі до наданих медичних послуг:{" "}
                          <span>{item.serviceComment}</span>
                        </p>
                        <p>
                          Медичні послуги (АСМІ):{" "}
                          <span>
                            {item.appointmentsAndServices.map(
                              (a, index) =>
                                `(${a.service.serviceId}) ${
                                  a.service.serviceName
                                } ${
                                  index + 1 !==
                                  item.appointmentsAndServices.length
                                    ? ", "
                                    : ""
                                }`
                            )}
                          </span>
                        </p>
                        <p>
                          Посилання на електронне направлення:{" "}
                          <span>
                            {episode.referralPackage &&
                              episode.referralPackage.referralPackageId}
                          </span>
                        </p>
                        <p>
                          Пріоритет дослідження: <span>{item.priority}</span>
                        </p>
                      </div>
                    </div>
                    <div className={styles.medicalEvents}>
                      <div className={styles.headerVisitResult}>
                        <h3>Скарга / лікування</h3>
                      </div>
                      <div className={styles.visitResultInfo}>
                        <p>
                          Коментар хворого:{" "}
                          <span>{item.appealReasonComment}</span>
                        </p>
                        <p>
                          Призначення лікування: <span>{item.treatment}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {episode.diagnosticReports.map((item, index) => (
                  <div className={styles.visitResult}>
                    <div className={styles.medicalEvents}>
                      <div className={styles.headerVisitResult}>
                        <h3>Діагностичний звіт {index + 1}</h3>
                      </div>
                      <div className={styles.visitResultInfo}>
                        <p>
                          Медична послуга:{" "}
                          <span>{`(${item.service.serviceId}) ${item.service.serviceName}`}</span>
                        </p>
                        <p>
                          Категорія діагностичного звіту:{" "}
                          <span>{item.category}</span>
                        </p>
                        <p>
                          Категорія послуги:{" "}
                          <span>{item.service.category.categoryName}</span>
                        </p>
                        <p>
                          Дата надання послуги:{" "}
                          <span>{`${item.date.split("T")[0]} ${item.date
                            .split("T")[1]
                            .slice(0, 5)}`}</span>
                        </p>
                        <p>
                          Заключення лікаря: <span>{item.conclusion}</span>
                        </p>
                        <p>
                          Виконавець діагностики:{" "}
                          <span>{`${item.executantDoctor.surname} ${item.executantDoctor.name} ${item.executantDoctor.patronymic}`}</span>
                        </p>
                        <p>
                          Працівник, що інтерпретував результати:{" "}
                          <span>{`${item.interpretedDoctor.surname} ${item.interpretedDoctor.name} ${item.interpretedDoctor.patronymic}`}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                {/* <div className={styles.actionDiv}><img src={saveIcon}/><p>Завантажити pdf</p></div> */}
              </div>
              <div className={styles.signature}>
                <p>Лікар</p>
                <span>{`${episode.doctor.surname} ${episode.doctor.name.slice(
                  0,
                  1
                )}. ${episode.doctor.patronymic.slice(0, 1)}.`}</span>
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

export default ViewAmbulatoryEpisodeReport;
