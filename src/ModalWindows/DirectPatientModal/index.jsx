import styles from './directPatientModal.module.scss';
import classNames from 'classnames';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';

const DirectPatientModal = (props) => {
  let userToken = JSON.parse(localStorage.getItem('user'));
  const institutionId = Number(
    userToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ],
  );
  const episodeId = Number(localStorage.getItem('episodeId'));

  const [departments, setDepartments] = useState();
  const [selectDepartments, setSelectDepartments] = useState();

  const [patient, setPatient] = useState(props.patient);

  const getDepartments = () => {
    console.log('work');
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/Department/GetDepartmentsByInstitutionId',
      params: { id: institutionId },
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++) {
            fillArray.push({
              value: Number(response.data[i].departmentId),
              label: response.data[i].name,
            });
          }
          setDepartments(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const directPatient = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/InpatientEpisode/DirectPatient',
      params: { episodeId, departmentId: selectDepartments.value },
    })
      .then((response) => {
        props.updateTable();
        props.onModalClose();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const setData = () => {
    if (props.isOpen) {
      setPatient(props.patient);
      props.setIsOpenFalse();
    }
  };

  useEffect(() => {
    getDepartments();
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
          <h3>Перевести пацієнта</h3>
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
                <label htmlFor='select_department' className={styles.label}>
                  Відділення
                </label>
                <Select
                  options={departments}
                  id='select_department'
                  className={styles.select}
                  onChange={setSelectDepartments}
                  value={selectDepartments}
                  isClearable
                  noOptionsMessage={() => 'Відділення не знайдено'}
                  placeholder='Оберіть відділення'
                />
              </div>
              <div className={styles.container_update_btn}>
                <button
                  type='button'
                  className={styles.updateBtn}
                  onClick={directPatient}
                  disabled={!selectDepartments && true}
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

export default DirectPatientModal;
