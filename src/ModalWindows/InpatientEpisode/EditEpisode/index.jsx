import styles from './editEpisode.module.scss';
import classNames from 'classnames';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import { useRef } from 'react';

const EditInpatientEpisodeModal = (props) => {
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);

  const [episodeName, setEpisodeName] = useState([]);

  const changeEpisodeName = (event) => {
    setEpisodeName(event.target.value);
  };

  const episodeTypeOptions = [
    { value: 'Лікування', label: 'Лікування' },
    { value: 'Діагностика', label: 'Діагностика' },
    { value: 'Паліативна допомога', label: 'Паліативна допомога' },
    { value: 'Профілактика', label: 'Профілактика' },
    { value: 'Реабілітація', label: 'Реабілітація' },
  ];

  const [selectDiagnosisData, setSelectDiagnosisData] = useState([]);
  const [selectEpisodeTypeData, setSelectEpisodeTypeData] = useState([]);

  const changeDiagnosisData = (selectDiagnosisData) => {
    if (!selectDiagnosisData) {
      selectDiagnosisData = {
        value: '',
        label: '',
      };
    }
    setSelectDiagnosisData(selectDiagnosisData);
    setEpisodeName(selectDiagnosisData.label);
  };

  let fillArray = [];
  let isFirstFill = true;

  const getDiagnosis = () => {
    axios({
      method: 'get',
      url: 'http://localhost:5244/api/DiagnosisMKX10AM',
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++)
            fillArray.push({
              value: response.data[i].diagnosisId,
              label:
                `(${response.data[i].diagnosisId})` +
                ' ' +
                response.data[i].diagnosisName,
            });
          setDiagnosisOptions(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const updateEpisode = () => {
    axios({
      method: 'put',
      url: `http://localhost:5244/api/InpatientEpisode/${props.episodeId}`,
      data: {
        episodeId: props.episodeId,
        diagnosisId: selectDiagnosisData.value,
        name: episodeName,
        type: selectEpisodeTypeData.value,
      },
    })
      .then((response) => {
        props.updateTable();
        props.onModalClose();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const setData = () => {
    if (props.isOpen) {
      setEpisodeName(props.episodeName);
      setSelectDiagnosisData(props.diagnosis);
      setSelectEpisodeTypeData(props.type);
      props.setIsOpenFalse();
    }
  };

  useEffect(() => {
    getDiagnosis();
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
          <h3>Редагування епізоду лікування</h3>
          <button onClick={props.onModalClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <hr />
        <div className={styles.updateSection}>
          <div className={styles.inputsDiv}>
            <form>
              <div className={styles.form_group}>
                <label htmlFor='select_diagnosis' className={styles.label}>
                  Назва діагнозу
                </label>
                <Select
                  options={diagnosisOptions}
                  id='select_diagnosis'
                  className={styles.select}
                  onChange={changeDiagnosisData}
                  value={selectDiagnosisData}
                  isClearable
                  noOptionsMessage={() => 'Назву діагнозу не знайдено'}
                  placeholder='Виберіть назву діагнозу'
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor='input_episode_name' className={styles.label}>
                  Назва епізоду
                </label>
                <input
                  type='text'
                  id='input_episode_name'
                  className='form-control'
                  value={episodeName}
                  onChange={changeEpisodeName}
                  placeholder='Назва епізоду'
                />
                <p>
                  * Назва епізоду може складатися з діагнозу (за винятком
                  психіатричних та ВІЛ-діагнозів), а також містити іншу корисну
                  інформацію щодо звернення пацієнта.
                </p>
              </div>
              <div className={styles.container_update_btn}>
                <button
                  type='button'
                  className={styles.updateBtn}
                  onClick={updateEpisode}
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

export default EditInpatientEpisodeModal;
