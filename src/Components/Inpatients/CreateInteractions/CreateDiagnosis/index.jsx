import React from 'react';
import styles from './createDiagnosis.module.scss';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateDiagnosis = () => {
  const episodeId = localStorage.getItem('episodeId');

  const [episode, setEpisode] = useState([]);

  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [selectDiagnosisData, setSelectDiagnosisData] = useState([]);

  const getEpisode = () => {
    axios({
      method: 'get',
      url: `http://localhost:5244/api/InpatientEpisode/${episodeId}`,
      params: { id: episodeId },
    })
      .then((response) => {
        console.log(response.data[0]);
        setSelectDiagnosisData({
          value: `${response.data[0].diagnosisMKX10AM.diagnosisId}`,
          label: `(${response.data[0].diagnosisMKX10AM.diagnosisId}) ${response.data[0].diagnosisMKX10AM.diagnosisName}`,
        });
        setEpisode(response.data[0]);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const [defaultDiagnosesOptions, setDefaultDiagnosesOptions] = useState();

  const getDiagnosis = () => {
    let fillArray = [];
    let isFirstFill = true;
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
          setDefaultDiagnosesOptions(fillArray.slice(0, 50));
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const filterOptions = (inputValue) => {
    return diagnosisOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  const updateDiagnosis = () => {
    axios({
      method: 'put',
      url: 'http://localhost:5244/api/InpatientEpisode/UpdateDiagnosis',
      params: {
        episodeId: episodeId,
        diagnosisId: selectDiagnosisData.value,
      },
    })
      .then((response) => {
        !episode.diagnosisMKX10AM
          ? toast.success('Дігноз успішно створено!', { theme: 'colored' })
          : toast.success('Дігноз успішно змінено!', { theme: 'colored' });

        getEpisode();
      })
      .catch((error) => {
        toast.error('Помилка серверу!', { theme: 'colored' });
        console.error(`Error: ${error}`);
      });
  };

  useEffect(() => {
    getEpisode();
    getDiagnosis();
  }, []);

  return (
    <div>
      <div className={styles.diagnosisBlock}>
        <ToastContainer />
        {!episode.diagnosisMKX10AM ? (
          <h2>Створити діагноз</h2>
        ) : (
          <h2>Змінити діагноз</h2>
        )}
        <form>
          <div className={styles.form_group}>
            <label htmlFor='select_diagnosis' className={styles.label}>
              Дігноз (МКХ-10АМ) <span>*</span>
            </label>
            <AsyncSelect
              loadOptions={loadOptions}
              defaultOptions={defaultDiagnosesOptions}
              id='select_diagnosis'
              className={styles.select}
              onChange={setSelectDiagnosisData}
              value={selectDiagnosisData}
              isClearable
              noOptionsMessage={() => 'Назву діагнозу не знайдено'}
              placeholder='Виберіть назву діагнозу'
            />
            {episode.diagnosisMKX10AM && (
              <p>
                * Для цього епізоду вже є створений діагноз. Ви можете його
                змінити.
              </p>
            )}
          </div>
          <div className={styles.container_update_btn}>
            <button
              type='button'
              className={styles.updateBtn}
              onClick={updateDiagnosis}
            >
              {!episode.diagnosisMKX10AM
                ? 'Створити діагноз'
                : 'Змінити діагноз'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiagnosis;
