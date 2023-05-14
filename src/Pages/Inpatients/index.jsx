import { React, useState, useEffect } from 'react';
import styles from './inpatients.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames';
import { Image } from 'react-bootstrap';

import dropdown_icon from '../../assets/icons/dropdown.png';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navbar';
import ActionsModal from '../../ModalWindows/ActionsModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TreatingDoctorModal from '../../ModalWindows/TreatingDoctorModal';
import DirectPatientModal from '../../ModalWindows/DirectPatientModal';

const Inpatients = () => {
  let userToken = JSON.parse(localStorage.getItem('user'));
  const doctorId = Number(
    userToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
  );
  const depName =
    userToken[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'
    ];
  const patientId = Number(localStorage.getItem('patientId'));

  const navigate = useNavigate();

  let user;

  let role =
    userToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  let email =
    userToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
    ];
  const institutionId = Number(
    userToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ],
  );

  const [inpatients, setInpatients] = useState([]);
  const [inpatientsForFilter, setInpatientsForFilter] = useState([]);

  const [department, setDepartment] = useState('');

  const [depId, setDepartmentId] = useState(0);

  const [filter, setFilter] = useState('');
  const changeFilter = (event) => {
    setFilter(event.target.value);
  };

  const inputFullname = document.getElementById('filter_fullname');
  const inputDate = document.getElementById('filter_date');
  const inputDeparment = document.getElementById('filter_department');

  const [filterBy, setFilterBy] = useState('');

  const changeFilterBy = (event) => {
    setFilterBy(event.target.value);
    if (event.target.value === 'fullname')
      inputFullname.classList.toggle(styles.visible);
    else inputFullname.classList.remove(styles.visible);

    if (event.target.value === 'date')
      inputDate.classList.toggle(styles.visible);
    else inputDate.classList.remove(styles.visible);

    if (event.target.value === 'department')
      inputDeparment.classList.toggle(styles.visible);
    else inputDeparment.classList.remove(styles.visible);
  };

  const getInpatients = () => {
    axios({
      method: 'get',
      url: 'http://localhost:5244/api/InpatientEpisode',
    })
      .then((response) => {
        console.log(response.data);
        setInpatients(response.data);
        setInpatientsForFilter(response.data);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const filterDoctors = (filter, arrayForFilter) => {
    switch (filterBy) {
      case 'fullname':
        setInpatients(
          arrayForFilter.filter(({ patient }) =>
            (patient.surname + ' ' + patient.name + ' ' + patient.patronymic)
              .toLowerCase()
              .includes(filter.toLowerCase()),
          ),
        );
        break;
      case 'date':
        setInpatients(
          arrayForFilter.filter(({ receiptDate }) =>
            receiptDate.toLowerCase().includes(filter.toLowerCase()),
          ),
        );
        break;
      case 'department':
        setInpatients(
          arrayForFilter.filter(
            ({ department }) =>
              department &&
              department.name.toLowerCase().includes(filter.toLowerCase()),
          ),
        );
        break;
    }
  };

  const resetFilter = () => {
    setFilter('');
    setFilterBy('Пошук за');
    inputFullname.classList.remove(styles.visible);
    inputDate.classList.remove(styles.visible);
    inputDeparment.classList.remove(styles.visible);
    getInpatients();
  };

  const [isActiveHamburger, setIsActiveHamburger] = useState(false);

  const openActionsDropdown = (idIcon, idDropdown) => {
    let icon = document.getElementById(idIcon);
    let elem = document.getElementById(idDropdown);

    let coords = icon.getBoundingClientRect();

    elem.style.position = 'fixed';
    elem.style.maxHeight = '100%';
    elem.style.left = coords.left + icon.offsetWidth + 'px';
    elem.style.top = coords.top + 'px';
  };

  const closeActionsDropdown = (idDropdown) => {
    let elem = document.getElementById(idDropdown);
    elem.style.maxHeight = '0';
  };

  const [modal, setModal] = useState({
    modal: false,
    modalDoctor: false,
    modalDirect: false,
  });

  const setModalTrue = () => {
    setModal({ ...modal, modal: true });
  };

  const [doctorObj, setDoctorObj] = useState({});
  const [patient, setPatient] = useState('');

  const setDoctorModalData = (patient, doctor, episodeId) => {
    localStorage.setItem('episodeId', episodeId);
    setIsOpen(true);
    setModal({ ...modal, modalDoctor: true });
    setDoctorObj(
      doctor
        ? {
            value: doctor.id,
            label: `${doctor.surname} ${doctor.name} ${doctor.patronymic} (${
              doctor.position.positionName === 'Головний лікар'
                ? doctor.position.positionName
                : doctor.position.positionName + 'ія'
            })`,
          }
        : null,
    );
    setPatient(`${patient.surname} ${patient.name} ${patient.patronymic}`);
  };

  const setDirectModalData = (patient, episodeId) => {
    localStorage.setItem('episodeId', episodeId);
    setIsOpen(true);
    setModal({ ...modal, modalDirect: true });
    setPatient(`${patient.surname} ${patient.name} ${patient.patronymic}`);
  };

  const [isOpen, setIsOpen] = useState(false);
  const setIsOpenFalse = () => {
    setIsOpen(false);
  };

  const [itemForModal, setItemForModal] = useState(Object);

  const setItem = (item) => {
    setItemForModal(item);
  };

  const showActions = (patient) => {
    setItem(patient);
    setModalTrue();
  };

  const setDataAndNavigateToInteractions = (episodeId) => {
    localStorage.setItem('episodeId', episodeId);
    navigate('../doctor/medical-events/inpatient-episodes/interactions');
  };

  const setDataAndNavigateToViewInteractions = (episodeId) => {
    localStorage.setItem('episodeId', episodeId);
    navigate('../doctor/medical-events/inpatient-episodes/view-interactions');
  };

  const setDataAndNavigateToViewAppointmentReport = (episodeId) => {
    localStorage.setItem('episodeId', episodeId);
    navigate('../doctor/medical-events/inpatient-episodes/view-report');
  };

  const completeEpisode = (episodeId) => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/InpatientEpisode/CompleteEpisode',
      params: { episodeId },
    })
      .then((response) => {
        if (response.data.result.message === 'not completed referrals')
          toast.error(
            'Щоб завершити епізод потрібно погасити всі направлення!',
            { theme: 'colored' },
          );
        else {
          toast.success('Епізод завершено!', { theme: 'colored' });
          getInpatients();
        }
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const submitPatient = (episodeId) => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/InpatientEpisode/SubmitPatient',
      params: { episodeId },
    })
      .then((response) => {
        getInpatients();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const declinePatient = (episodeId) => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/InpatientEpisode/DeclinePatient',
      params: { episodeId },
    })
      .then((response) => {
        getInpatients();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  useEffect(() => {
    document.title = 'Пацієнти на стаціонарі';
    if (userToken !== null) {
      axios({
        method: 'get',
        url: `http://localhost:5244/api/Doctor/${userToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']}`,
      })
        .then((response) => {
          user = response.data[0];
          if (user.role.roleName !== 'Головний лікар') {
            setDepartment(user.department.name);
            setDepartmentId(user.department.departmentId);
          }
          getInpatients();
        })
        .catch((error) => console.error(`Error: ${error}`));
    } else {
      navigate('/login');
    }
  }, []);

  if (!inpatients) return 0;

  return (
    <div>
      <Header
        isActiveHamburger={isActiveHamburger}
        setIsActiveHamburger={setIsActiveHamburger}
      />
      <Navbar isActiveHamburger={isActiveHamburger} />
      <ActionsModal
        isOpened={modal.modal}
        onModalClose={() => {
          setModal({ ...modal, modal: false });
        }}
        item={itemForModal}
      ></ActionsModal>
      <ToastContainer />
      <div className={styles.divideLine}></div>

      <div className={styles.headLine}>
        <h1>Пацієнти на стаціонарі</h1>
      </div>

      <div className={styles.MainContainer}>
        <div className={styles.doctorsSection}>
          <div className={styles.containerForDoctorsSection}>
            <div className={styles.filterContainer}>
              <div className={styles.flexSelectAndBtn}>
                <div className={styles.flexForSelects}>
                  <select
                    id='select_filter'
                    className={classNames('form-select', styles.select)}
                    value={filterBy}
                    onChange={changeFilterBy}
                  >
                    <option value='null'>Пошук за</option>
                    <option value='fullname'>ПІБ пацієнта</option>
                    <option value='date'>Дата та час поступлення</option>
                    <option value='department'>Відділення</option>
                  </select>
                  <input
                    type='text'
                    id='filter_fullname'
                    className={classNames('form-control', styles.inputGroup)}
                    value={filter}
                    onChange={changeFilter}
                    placeholder='Введіть ПІБ пацієнта'
                  />
                  <input
                    type='text'
                    id='filter_date'
                    className={classNames('form-control', styles.inputGroup)}
                    value={filter}
                    onChange={changeFilter}
                    placeholder='Введіть дату та час поступлення'
                  />
                  <input
                    type='text'
                    id='filter_department'
                    className={classNames('form-control', styles.inputGroup)}
                    value={filter}
                    onChange={changeFilter}
                    placeholder='Введіть відділення'
                  />
                </div>
                <div className={styles.flexButtons}>
                  <button
                    type='button'
                    className={styles.filterButtons}
                    onClick={() => filterDoctors(filter, inpatientsForFilter)}
                  >
                    Пошук
                  </button>
                  <button
                    type='button'
                    className={styles.filterButtons}
                    onClick={resetFilter}
                  >
                    Скинути фільтр
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.employeeCountBlock}>
              <p>Кількість ({inpatients.length})</p>
            </div>
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Дії</th>
                    <th>№ П/П</th>
                    <th>Дата та час поступлення</th>
                    <th>Пацієнт</th>
                    <th>Стать</th>
                    <th>Вік</th>
                    <th>Статус пацієнта</th>
                    <th>Тип госпіталізації</th>
                    <th>Назва відд. при поступленні</th>
                    <th>Направлено з</th>
                    <th>Профіль ліжка</th>
                    <th>Пільгові категорії/супровід</th>
                  </tr>
                </thead>
                <tbody>
                  {inpatients && inpatients.length > 0
                    ? inpatients.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div
                                id={`action${index + 1}`}
                                className={styles.flexForAction}
                                onMouseOver={() =>
                                  openActionsDropdown(
                                    `action${index + 1}`,
                                    `actionsDropdown${index + 1}`,
                                  )
                                }
                                onMouseOut={() =>
                                  closeActionsDropdown(
                                    `actionsDropdown${index + 1}`,
                                  )
                                }
                              >
                                <Image
                                  src={dropdown_icon}
                                  alt='dropdown icon'
                                  className={styles.actionIcon}
                                />
                                <div
                                  id={`actionsDropdown${index + 1}`}
                                  className={styles.actionsWrapper}
                                >
                                  <div className={styles.buttonsWrapper}>
                                    {item.patientStatus !== 'Прийнято' ? (
                                      role !== 'Лікар' &&
                                      item.department.name === depName &&
                                      item.institution.institutionId ===
                                        institutionId ? (
                                        <div className={styles.patientStatus}>
                                          <p>{item.patientStatus}</p>
                                          <button
                                            className={styles.actionsBtn}
                                            type='button'
                                            onClick={() =>
                                              submitPatient(item.episodeId)
                                            }
                                          >
                                            Прийняти
                                          </button>
                                          <button
                                            className={classNames(
                                              styles.actionsBtn,
                                              styles.declineBtn,
                                            )}
                                            type='button'
                                            onClick={() =>
                                              declinePatient(item.episodeId)
                                            }
                                          >
                                            Відхилити
                                          </button>
                                        </div>
                                      ) : (
                                        'Немає прав'
                                      )
                                    ) : (
                                      <>
                                        {item.status === 'Діючий' && (
                                          <button
                                            className={styles.actionsBtn}
                                            type='button'
                                            onClick={() =>
                                              setDirectModalData(
                                                item.patient,
                                                item.episodeId,
                                              )
                                            }
                                          >
                                            Переведення між відділеннями
                                          </button>
                                        )}
                                        {item.status === 'Діючий' && (
                                          <button
                                            className={classNames(
                                              styles.actionsBtn,
                                              styles.dischargeBtn,
                                            )}
                                            type='button'
                                          >
                                            Виписка без історії
                                          </button>
                                        )}
                                        {item.status === 'Діючий' && (
                                          <button
                                            className={styles.actionsBtn}
                                            type='button'
                                            onClick={() =>
                                              setDoctorModalData(
                                                item.patient,
                                                item.treatingDoctor,
                                                item.episodeId,
                                              )
                                            }
                                          >
                                            Лікуючий лікар
                                          </button>
                                        )}
                                        {item.status === 'Діючий' && (
                                          <button
                                            className={classNames(
                                              styles.actionsBtn,
                                              styles.createBtn,
                                            )}
                                            type='button'
                                            onClick={() =>
                                              setDataAndNavigateToInteractions(
                                                item.episodeId,
                                              )
                                            }
                                          >
                                            Створити взаємодію
                                          </button>
                                        )}
                                        {(item.appointments.length > 0 ||
                                          item.referralPackage ||
                                          item.procedure.length > 0) && (
                                          <button
                                            className={styles.actionsBtn}
                                            type='button'
                                            onClick={() =>
                                              setDataAndNavigateToViewInteractions(
                                                item.episodeId,
                                              )
                                            }
                                          >
                                            Переглянути взаємодії
                                          </button>
                                        )}
                                        {item.status === 'Діючий' && (
                                          <button
                                            className={classNames(
                                              styles.actionsBtn,
                                              styles.viewBtn,
                                            )}
                                            type='button'
                                            onClick={() =>
                                              completeEpisode(item.episodeId)
                                            }
                                          >
                                            Завершити епізод
                                          </button>
                                        )}
                                        <button
                                          className={classNames(
                                            styles.actionsBtn,
                                            styles.viewBtn,
                                          )}
                                          type='button'
                                          onClick={() =>
                                            setDataAndNavigateToViewAppointmentReport(
                                              item.episodeId,
                                            )
                                          }
                                        >
                                          Переглянути звіт
                                        </button>
                                        {item.status === 'Діючий' && (
                                          <button
                                            className={styles.actionsBtn}
                                            type='button'
                                            onClick={() =>
                                              showActions(item.patient)
                                            }
                                          >
                                            Додаткові дії
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{index + 1}</td>
                            <td>{`${
                              item.receiptDate.split('T')[0]
                            } ${item.receiptDate
                              .split('T')[1]
                              .slice(0, 5)}`}</td>
                            <td>{`${item.patient.surname} ${item.patient.name} ${item.patient.patronymic}`}</td>
                            <td>{item.patient.gender}</td>
                            <td>
                              {`${
                                new Date().getFullYear() -
                                item.patient.dateOfBirth.split('-')[0]
                              } р.`}
                            </td>
                            <td>{item.patientStatus}</td>
                            <td>{item.type}</td>
                            <td>{item.department.name}</td>
                            <td></td>
                            <td>{item.bedType}</td>
                            <td>{item.benefitCategory}</td>
                          </tr>
                        );
                      })
                    : ''}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <TreatingDoctorModal
        isOpened={modal.modalDoctor}
        onModalClose={() => setModal({ ...modal, modalDoctor: false })}
        doctor={doctorObj}
        patient={patient}
        updateTable={getInpatients}
        isOpen={isOpen}
        setIsOpenFalse={setIsOpenFalse}
      ></TreatingDoctorModal>
      <DirectPatientModal
        isOpened={modal.modalDirect}
        onModalClose={() => setModal({ ...modal, modalDirect: false })}
        patient={patient}
        updateTable={getInpatients}
        isOpen={isOpen}
        setIsOpenFalse={setIsOpenFalse}
      ></DirectPatientModal>
    </div>
  );
};

export default Inpatients;
