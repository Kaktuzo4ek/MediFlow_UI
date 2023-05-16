import React from 'react';
import styles from './createProcedure.module.scss';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProcedure = () => {
  let userToken = JSON.parse(localStorage.getItem('user'));
  const doctorId = Number(
    userToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
  );
  const institutionId = Number(
    userToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ],
  );
  const patientId = Number(localStorage.getItem('patientId'));
  const episodeId = localStorage.getItem('episodeId');

  const [referralPackageId, setReferralPackageId] = useState('');
  const changeReferralPackageId = (event) => {
    setReferralPackageId(event.target.value);
  };

  const [selectServicesData, setSelectServicesData] = useState([]);
  const [serviceOptions, setServiceOptions] = useState();

  const [selectStatusData, setSelectStatusData] = useState([]);

  const statusOptions = [
    { value: 'Інше', label: 'Інше' },
    { value: 'Процедура відмінена', label: 'Процедура відмінена' },
    {
      value: 'Процедура відмінена: відмова пацієнта',
      label: 'Процедура відмінена: відмова пацієнта',
    },
    {
      value: 'Процедура відмінена: протипокази до процедури',
      label: 'Процедура відмінена: протипокази до процедури',
    },
    {
      value: 'Процедура проведено успішно',
      label: 'Процедура проведено успішно',
    },
    {
      value:
        'Проведення процедури не завершено: ускладнення, які виникли в процесі процедури',
      label:
        'Проведення процедури не завершено: ускладнення, які виникли в процесі процедури',
    },
    {
      value:
        'Проведення процедури не завершено: пацієнт відмовився від продовження процедури',
      label:
        'Проведення процедури не завершено: пацієнт відмовився від продовження процедури',
    },
    {
      value: 'Проведення процедури не завершено: технічні проблеми',
      label: 'Проведення процедури не завершено: технічні проблеми',
    },
    {
      value: 'Процедура проведена не успішно',
      label: 'Процедура проведена не успішно',
    },
  ];

  const [notes, setNotes] = React.useState('');
  const changeNotes = (event) => {
    setNotes(event.target.value);
  };

  let fillArray = [];
  let isFirstFill = true;

  const [defaultServicesOptions, setDefaultServicesOptions] = useState();

  const getServices = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/Service/GetProcedures',
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++)
            fillArray.push({
              value: response.data[i].serviceId,
              label:
                `(${response.data[i].serviceId})` +
                ' ' +
                response.data[i].serviceName,
            });
          setServiceOptions(fillArray);
          setDefaultServicesOptions(fillArray.slice(0, 50));
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const filterOptions = (inputValue) => {
    return serviceOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  const createProcedure = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/AmbulatoryEpisode/CreateProcedure',
      params: { episodeId },
      data: {
        referralPackageId,
        doctorId,
        patientId,
        serviceId: selectServicesData.value,
        status: selectStatusData.value,
        notes: notes,
      },
    })
      .then((response) => {
        toast.success('Процедуру успішно створено!', { theme: 'colored' });
        setReferralPackageId('');
        setSelectServicesData([]);
        setSelectStatusData([]);
        setNotes('');
      })
      .catch((error) => {
        toast.error('Помилка серверу!', { theme: 'colored' });
        console.error(`Error: ${error}`);
      });
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div>
      <div className={styles.procedureBlock}>
        <ToastContainer />
        <h2>Cтворити процедуру</h2>
        <form>
          <div className={styles.form_group}>
            <label htmlFor='input_referralId' className={styles.label}>
              Номер направлення
            </label>
            <input
              type='text'
              id='input_referralId'
              className='form-control'
              value={referralPackageId}
              onChange={changeReferralPackageId}
              placeholder='Номер направлення'
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor='select_service' className={styles.label}>
              Група послуг/послуга <span>*</span>
            </label>
            <AsyncSelect
              loadOptions={loadOptions}
              defaultOptions={defaultServicesOptions}
              id='select_service'
              className={styles.select}
              onChange={setSelectServicesData}
              value={selectServicesData}
              isClearable
              noOptionsMessage={() => 'Групи послуг/послуг не знайдено'}
              placeholder='Виберіть групу послуг/послугу'
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor='select_status' className={styles.label}>
              Результат процедури <span>*</span>
            </label>
            <Select
              options={statusOptions}
              id='select_status'
              className={styles.select}
              onChange={setSelectStatusData}
              value={selectStatusData}
              isClearable
              noOptionsMessage={() => 'Результату процедури не знайдено'}
              placeholder='Виберіть результат процедури'
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor='text_area_notes' className={styles.label}>
              Нотатки
            </label>
            <textarea
              class='form-control'
              id='text_area_notes'
              rows='3'
              value={notes}
              onChange={changeNotes}
              placeholder='Введіть нотатки'
            ></textarea>
          </div>
          <div className={styles.container_update_btn}>
            <button
              type='button'
              className={styles.updateBtn}
              onClick={createProcedure}
            >
              Створити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProcedure;
