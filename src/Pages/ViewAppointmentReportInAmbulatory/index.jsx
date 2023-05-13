import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import styles from './viewAppointmentReport.module.scss';
import { useEffect } from 'react';
import classNames from 'classnames';
import { useState } from 'react';
import Navbar from '../../Components/Navbar';

const ViewAppointmentReport = () => {
  const episodeId = localStorage.getItem('episodeId');
  const appointmentId = localStorage.getItem('appointmentId');
  const [isActiveHamburger, setIsActiveHamburger] = useState(false);

  const [episode, setEpisode] = useState([]);
  const [appointment, setAppointment] = useState([]);

  const getEpisode = () => {
    axios({
      method: 'get',
      url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
      params: { id: episodeId },
    })
      .then((response) => {
        setEpisode(response.data[0]);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const getAppointment = () => {
    axios({
      method: 'get',
      url: `http://localhost:5244/api/Appointment/${appointmentId}`,
      params: { id: appointmentId },
    })
      .then((response) => {
        setAppointment(response.data);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  useEffect(() => {
    document.title = 'Звіт до прийому лікаря';
    getEpisode();
    getAppointment();
  }, []);

  if (!episode.doctor) return 0;

  return (
    <div>
      <Header
        isActiveHamburger={isActiveHamburger}
        setIsActiveHamburger={setIsActiveHamburger}
      />
      <Navbar isActiveHamburger={isActiveHamburger} />
      <div className={styles.divideLine}></div>

      <div className={styles.headLine}>
        <h1>Звіт про прийом лікаря</h1>
      </div>

      <div className={styles.MainContainer}>
        <div className={styles.container}>
          <div className={styles.flexForReport}>
            <div className={styles.visitInfo}>
              <p>
                Дата створення: <span>{episode.dateCreated.split('T')[0]}</span>
              </p>
              <p>
                Заклад: <span>{episode.doctor.institution.name}</span>
              </p>
              <p>
                Лікар:{' '}
                <span>{`${episode.doctor.surname} ${episode.doctor.name} ${episode.doctor.patronymic}`}</span>
              </p>
              <p>
                Пацієнт:{' '}
                <span>{`${episode.patient.surname} ${episode.patient.name} ${episode.patient.patronymic}`}</span>
              </p>
            </div>
            <div className={styles.visitResult}>
              <div className={styles.medicalEvents}>
                <div className={styles.headerVisitResult}>
                  <h3>Медична подія</h3>
                </div>
                <div className={styles.visitResultInfo}>
                  <p>
                    Дата та час візиту пацієта:{' '}
                    <span>{`${appointment.date.split('T')[0]} ${appointment.date
                      .split('T')[1]
                      .slice(0, 5)}`}</span>
                  </p>
                  <p>
                    Причина звернення:{' '}
                    <span>
                      {appointment.appointmentsAndDiagnosesICPC2.map(
                        (a, index) =>
                          `(${a.diagnosisICPC2.diagnosisCode}) ${
                            a.diagnosisICPC2.diagnosisName
                          } ${
                            index + 1 !==
                            appointment.appointmentsAndDiagnosesICPC2.length
                              ? ', '
                              : ''
                          }`,
                      )}
                    </span>
                  </p>
                  <p>
                    Тип візиту: <span>{appointment.interactionType}</span>
                  </p>
                  <p>
                    Клас зустрічей: <span>{appointment.interactionClass}</span>
                  </p>
                  <p>
                    Встановлено діагноз (МКХ-10AM):{' '}
                    <span>
                      {episode.diagnosisMKX10AM &&
                        episode.diagnosisMKX10AM.diagnosisName}
                    </span>
                  </p>
                  <p>
                    Відвідування: <span>{appointment.visiting}</span>
                  </p>
                  <p>
                    Коментарі до наданих медичних послуг:{' '}
                    <span>{appointment.serviceComment}</span>
                  </p>
                  <p>
                    Медичні послуги (АСМІ):{' '}
                    <span>
                      {appointment.appointmentsAndServices.map(
                        (a, index) =>
                          `(${a.service.serviceId}) ${a.service.serviceName} ${
                            index + 1 !==
                            appointment.appointmentsAndServices.length
                              ? ', '
                              : ''
                          }`,
                      )}
                    </span>
                  </p>
                  <p>
                    Посилання на електронне направлення:{' '}
                    <span>
                      {appointment.referral &&
                        appointment.referral.referralPackageId}
                    </span>
                  </p>
                  <p>
                    Пріоритет дослідження: <span>{appointment.priority}</span>
                  </p>
                </div>
              </div>
              <div className={styles.medicalEvents}>
                <div className={styles.headerVisitResult}>
                  <h3>Скарга / лікування</h3>
                </div>
                <div className={styles.visitResultInfo}>
                  <p>
                    Коментар хворого:{' '}
                    <span>{appointment.appealReasonComment}</span>
                  </p>
                  <p>
                    Призначення лікування: <span>{appointment.treatment}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointmentReport;
