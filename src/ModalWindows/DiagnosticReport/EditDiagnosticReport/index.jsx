import styles from './editDiagnosticReport.module.scss';
import classNames from 'classnames';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';

const EditDiagnosticReportModal = (props) => {
  let userToken = JSON.parse(localStorage.getItem('user'));
  const doctorId = Number(
    userToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
  );
  const institutionId = Number(
    userToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ],
  );
  const episodeId = localStorage.getItem('episodeId');

  const reportCategoryOptions = [
    {
      value: 'Лікувально-діагностична процедура',
      label: 'Лікувально-діагностична процедура',
    },
    { value: 'Діагностична процедура', label: 'Діагностична процедура' },
    { value: 'Візуалізація', label: 'Візуалізація' },
    { value: 'Лабораторна діагностика', label: 'Лабораторна діагностика' },
  ];
  const [selectReportCategoryData, setSelectReportCategoryData] = useState([]);

  const changeReportCategoryData = (selectReportCategoryData) => {
    if (!selectReportCategoryData) {
      selectReportCategoryData = {
        value: '',
        label: '',
      };
    }
    setSelectReportCategoryData(selectReportCategoryData);
  };

  const [conclusion, setConclusion] = useState('');
  const changeConclusion = (event) => {
    setConclusion(event.target.value);
  };

  const [executantOptions, setExecutantOptions] = useState([]);
  const [selectExectantData, setSelectExecunantData] = useState([]);

  const [interpretedOptions, setInterpretedOptions] = useState([]);
  const [selectInterpretedData, setSelectInterpretedData] = useState([]);

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
              label: `${response.data[i].surname} ${response.data[i].name} ${response.data[i].patronymic}`,
            });
          }
          fillArray.map(
            (item) => item.value === doctorId && setSelectExecunantData(item),
          );
          fillArray.map(
            (item) => item.value === doctorId && setSelectInterpretedData(item),
          );
          setInterpretedOptions(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const [otherInterpretedOptions, setOtherInterpretedOptions] = useState([]);

  const getAllDoctorsInSystem = () => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/Doctor/GetDoctorsExcludeInstitution',
      params: { institutionId },
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++) {
            fillArray.push({
              value: Number(response.data[i].id),
              label: `${response.data[i].surname} ${response.data[i].name} ${response.data[i].patronymic}`,
            });
          }
          setOtherInterpretedOptions(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const [otherInterpted, setOtherInterpreted] = useState(false);
  const changeOtherInterpretedTrue = () => {
    setOtherInterpreted(true);
    setSelectInterpretedData([]);
  };

  const changeOtherInterpretedFalse = () => {
    setOtherInterpreted(false);
    setSelectInterpretedData([]);
  };

  const validate = () => {
    if (selectReportCategoryData && selectExectantData && selectInterpretedData)
      editDiagnosticReport();
  };

  const editDiagnosticReport = () => {
    //if (props.isNoEpisode) {
    axios({
      method: 'put',
      url: `http://localhost:5244/api/DiagnosticReport/${props.reportId}`,
      params: { id: props.reportId },
      data: {
        reportId: props.reportId,
        category: selectReportCategoryData.value,
        conclusion: conclusion,
        executantDoctorId: selectExectantData.value,
        interpretedDoctorId: selectInterpretedData.value,
      },
    })
      .then((response) => {
        props.updateTable();
        props.onModalClose();
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
    // } else {
    //   axios({
    //     method: "put",
    //     url: "http://localhost:5244/api/AmbulatoryEpisode/UpdateDiagnosticReport",
    //     params: { episodeId },
    //     data: {
    //       reportId: props.reportId,
    //       category: selectReportCategoryData.value,
    //       conclusion: conclusion,
    //       executantDoctorId: selectExectantData.value,
    //       interpretedDoctorId: selectInterpretedData.value,
    //     },
    //   })
    //     .then((response) => {
    //       props.updateTable();
    //       props.onModalClose();
    //     })
    //     .catch((error) => {
    //       console.error(`Error: ${error}`);
    //     });
    // }
  };

  const setData = () => {
    if (props.isOpen) {
      setSelectReportCategoryData(props.category);
      setConclusion(props.conclusion);
      setSelectExecunantData(props.executantDoctor);
      setSelectInterpretedData(props.interpretedDoctor);
      props.setIsOpenFalse();
    }
  };

  useEffect(() => {
    getDoctors();
    getAllDoctorsInSystem();
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
          <h3>Редагування діагностичного звіту</h3>
          <button onClick={props.onModalClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <hr />
        <div className={styles.updateSection}>
          <div className={styles.inputsDiv}>
            <form>
              <div className={styles.form_group}>
                <label
                  htmlFor='select_report_category'
                  className={styles.label}
                >
                  Категорія діагностичного звіту
                </label>
                <Select
                  options={reportCategoryOptions}
                  id='select_report_category'
                  className={styles.select}
                  onChange={changeReportCategoryData}
                  value={selectReportCategoryData}
                  isClearable
                  noOptionsMessage={() => 'Категорію не знайдено'}
                  placeholder='Виберіть категорію'
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor='text_conclusion' className={styles.label}>
                  Заключення лікаря
                </label>
                <textarea
                  class='form-control'
                  id='text_conclusion'
                  value={conclusion}
                  onChange={changeConclusion}
                  placeholder='Введіть заключення'
                ></textarea>
              </div>
              <div className={styles.form_group}>
                <label htmlFor='select_execuatant' className={styles.label}>
                  Виконавець діагностики
                </label>
                <Select
                  options={executantOptions}
                  id='select_execuatant'
                  className={styles.select}
                  onChange={setSelectExecunantData}
                  value={selectExectantData}
                  isSearchable={false}
                  noOptionsMessage={() => ''}
                  placeholder='Виберіть виконавця дігностики'
                />
              </div>
              <div className={styles.form_group}>
                <div className={styles.labelFlex}>
                  <label htmlFor='select_interpreted' className={styles.label}>
                    Працівник, що інтерпретував результати
                  </label>
                  <div className={styles.checkbox}>
                    <input
                      class='form-check-input'
                      type='checkbox'
                      value={otherInterpted}
                      onChange={
                        otherInterpted
                          ? changeOtherInterpretedFalse
                          : changeOtherInterpretedTrue
                      }
                      id='checkbox_other_interpreted'
                    />
                    <label
                      className={styles.label}
                      for='checkbox_other_interpreted'
                    >
                      ІНШИЙ
                    </label>
                  </div>
                </div>
                <Select
                  options={
                    !otherInterpted
                      ? interpretedOptions
                      : otherInterpretedOptions
                  }
                  id='select_interpreted'
                  className={styles.select}
                  onChange={setSelectInterpretedData}
                  value={selectInterpretedData}
                  isSearchable={false}
                  noOptionsMessage={() => ''}
                  placeholder='Виберіть працівника, що інтерпретував результати'
                />
              </div>
              <div className={styles.container_update_btn}>
                <button
                  type='button'
                  className={styles.updateBtn}
                  onClick={validate}
                >
                  Зберегти дані
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

export default EditDiagnosticReportModal;
