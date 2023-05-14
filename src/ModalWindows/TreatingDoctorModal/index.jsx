import styles from './treatingDoctor.module.scss';
import classNames from 'classnames';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';

const TreatingDoctorModal = (props) => {
  let userToken = JSON.parse(localStorage.getItem('user'));
  const institutionId = Number(
    userToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ],
  );
  const episodeId = Number(localStorage.getItem('episodeId'));

  const [doctors, setDoctors] = useState();
  const [selectDoctors, setSelectDoctors] = useState(props.doctor);

  const [patient, setPatient] = useState(props.patient);

  const getDoctors = () => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/Doctor/GetDoctorsFromInstitution',
      params: { institutionId },
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++) {
            fillArray.push({
              value: Number(response.data[i].id),
              label: `${response.data[i].surname} ${response.data[i].name} ${
                response.data[i].patronymic
              } (${
                response.data[i].position.positionName === 'Головний лікар'
                  ? response.data[i].position.positionName
                  : response.data[i].position.positionName + 'ія'
              })`,
            });
          }
          setDoctors(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const setTreatingDoctor = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/InpatientEpisode/SetTreatingDoctor',
      params: { episodeId, doctorId: selectDoctors.value },
    })
      .then((response) => {
        props.updateTable();
        props.onModalClose();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const setData = () => {
    if (props.isOpen) {
      setSelectDoctors(props.doctor);
      setPatient(props.patient);
      props.setIsOpenFalse();
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div
      className={classNames(
        styles.modal_wrapper,
        `${props.isOpened ? styles.fadeIn : styles.fadeOut}`,
      )}
      style={{ ...props.style }}
      onMouseOver={props.isOpen ? () => setData() : null}
    >
      <div className={styles.modal_body}>
        <div className={styles.modal_close}>
          <h3>Призначити лікуючого лікаря</h3>
          <button onClick={props.onModalClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <hr />
        <div className={styles.updateSection}>
          <div className={styles.inputsDiv}>
            <form>
              <div className={styles.form_group}>
                <span className={styles.patientSpan}>Пацієнт: {patient}</span>
              </div>
              <div className={styles.form_group}>
                <label htmlFor='select_doctor' className={styles.label}>
                  Лікуючий лікар
                </label>
                <Select
                  options={doctors}
                  id='select_doctor'
                  className={styles.select}
                  onChange={setSelectDoctors}
                  value={selectDoctors}
                  isClearable
                  noOptionsMessage={() => 'Лікаря не знайдено'}
                  placeholder='Виберіть лікаря'
                />
                <div className={styles.description}>
                  Обраний лікуючий лікар автоматично стане відповідальним за
                  стаціонарний епізод пацієнта. Ви зможете його змінити у
                  будь-який момент, навіть після виписки пацієнта із стаціонару
                </div>
              </div>
              <div className={styles.container_update_btn}>
                <button
                  type='button'
                  className={styles.updateBtn}
                  onClick={setTreatingDoctor}
                  disabled={!selectDoctors && true}
                >
                  Зберегти
                </button>
              </div>
            </form>
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default TreatingDoctorModal;
