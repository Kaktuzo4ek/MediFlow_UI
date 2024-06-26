import React from 'react';
import styles from './appointment.module.scss';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAppointment = () => {
  let userToken = JSON.parse(localStorage.getItem('user'));

  const doctorId = Number(
    userToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
  );

  const episodeId = Number(localStorage.getItem('episodeId'));

  const [referralPackageId, setReferralPackageId] = useState('');
  const changeReferralPackageId = (event) => {
    setReferralPackageId(event.target.value);
  };

  const [reasonsOptions, setReasonsOptions] = useState([]);
  const [selectReasonsData, setSelectReasonsData] = useState([]);

  const [defaultReasonsOptions, setDefaultReasonsOptions] = useState();

  const getReasons = () => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/DiagnosisICPC2/GetReasons',
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++)
            fillArray.push({
              value: response.data[i].diagnosisId,
              label:
                `(${response.data[i].diagnosisCode})` +
                ' ' +
                response.data[i].diagnosisName,
            });
          setReasonsOptions(fillArray);
          setDefaultReasonsOptions(fillArray.slice(0, 50));
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const filterReasonsOptions = (inputValue) => {
    return reasonsOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const loadReasonsOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterReasonsOptions(inputValue));
    }, 1000);
  };

  const [reasonsComment, setReasonsComment] = useState('');
  const changeReasonsComment = (event) => {
    setReasonsComment(event.target.value);
  };

  const interactionClassOptions = [
    {
      value: 'Амбулаторна медична допомога',
      label: 'Амбулаторна медична допомога',
    },
  ];
  const [selectInteractionClassData, setSelectInteractionClassData] = useState(
    interactionClassOptions[0],
  );

  const visitingOptions = [
    { value: 'Первинне', label: 'Первинне' },
    { value: 'Повторне', label: 'Повторне' },
    { value: 'Завершення епізоду', label: 'Завершення епізоду' },
  ];
  const [selectVisitingData, setSelectVisitingData] = useState(
    visitingOptions[0],
  );

  const interactionTypeOptions = [
    {
      value: "Взаємодія в закладі охорони здороров'я",
      label: "Взаємодія в закладі охорони здороров'я",
    },
    {
      value: "Консультація пацієнта засобами зв'язку",
      label: "Консультація пацієнта засобами зв'язку",
    },
    {
      value: 'Візит за місцем постійного перебування пацієнта',
      label: 'Візит за місцем постійного перебування пацієнта',
    },
    {
      value:
        'Візит за межами медичного закладу та місцем постійного перебування пацієнта',
      label:
        'Візит за межами медичного закладу та місцем постійного перебування пацієнта',
    },
    { value: 'Проведення інтервенцій', label: 'Проведення інтервенцій' },
  ];
  const [selectInteractionTypeData, setSelectInteractionTypeData] = useState(
    interactionTypeOptions[0],
  );

  const [servicesOptions, setServicesOptions] = useState();
  const [selectServicesData, setSelectServicesData] = useState([]);

  const [defaultServicesOptions, setDefaultServicesOptions] = useState();

  const getServices = () => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'get',
      url: 'http://localhost:5244/api/Service',
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
          setServicesOptions(fillArray);
          setDefaultServicesOptions(fillArray.slice(0, 50));
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const filterOptions = (inputValue) => {
    return servicesOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  const [servicesComment, setServicesComment] = useState('');
  const changeServicesComment = (event) => {
    setServicesComment(event.target.value);
  };

  const priorityOptions = [
    { value: 'Плановий', label: 'Плановий' },
    { value: 'Примусовий', label: 'Примусовий' },
    { value: 'Ургентний', label: 'Ургентний' },
  ];
  const [selectPriorityData, setSelectPriorityData] = useState(
    priorityOptions[0],
  );

  const [treatment, setTreatment] = useState('');
  const changeTreatment = (event) => {
    setTreatment(event.target.value);
  };

  const [notes, setNotes] = useState('');
  const changeNotes = (event) => {
    setNotes(event.target.value);
  };

  const createAppointment = () => {
    let services = [];
    selectServicesData.map((s) => services.push(s.value));

    let reasons = [];
    selectReasonsData.map((r) => reasons.push(Number(r.value)));

    console.log(selectReasonsData);

    if (
      selectReasonsData.value !== 0 &&
      selectInteractionClassData.value !== '' &&
      selectVisitingData !== '' &&
      selectInteractionTypeData.value !== '' &&
      selectServicesData.length !== 0 &&
      selectPriorityData.value !== ''
    )
      axios({
        method: 'post',
        url: 'http://localhost:5244/api/Appointment/CreateAppointmentInAmbulatory',
        data: {
          referralId: referralPackageId,
          diagnosesICPC2: reasons,
          ambulatoryEpisodeId: episodeId,
          appealReasonComment: reasonsComment,
          doctorId: doctorId,
          interactionClass: selectInteractionClassData.value,
          visiting: selectVisitingData.value,
          interactionType: selectInteractionTypeData.value,
          services: services,
          serviceComment: servicesComment,
          priority: selectPriorityData.value,
          treatment: treatment,
          notes: notes,
        },
      })
        .then((response) => {
          if (response.data.result.message === 'not completed referrals')
            toast.error(
              'Щоб завершити епізод потрібно погасити всі направлення!',
              { theme: 'colored' },
            );
          else {
            toast.success('Результат прийому успішно збережений!', {
              theme: 'colored',
            });
            setReferralPackageId('');
            setSelectReasonsData([]);
            setReasonsComment('');
            setSelectInteractionClassData([]);
            setSelectVisitingData([]);
            setSelectInteractionTypeData([]);
            setSelectServicesData([]);
            setServicesComment('');
            setSelectPriorityData([]);
            setTreatment('');
            setNotes('');
          }
        })
        .catch((error) => {
          console.error(`Error: ${error}`);
          toast.error('Помилка серверу!', { theme: 'colored' });
        });
    else {
      toast.error("Заповніть обов'язкові поля!", { theme: 'colored' });
    }
  };

  useEffect(() => {
    getReasons();
    getServices();
  }, []);

  return (
    <div className={styles.appointmentBlock}>
      <ToastContainer />
      <h2>Записати результати прийому</h2>
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
          <label htmlFor='select_diagnosis' className={styles.label}>
            Причина звернення (ICPC-2) <span>*</span>
          </label>
          <AsyncSelect
            loadOptions={loadReasonsOptions}
            defaultOptions={defaultReasonsOptions}
            id='select_diagnosis'
            className={styles.select}
            onChange={setSelectReasonsData}
            value={selectReasonsData}
            isMulti
            isClearable
            noOptionsMessage={() => 'Причини звернення не знайдено'}
            placeholder='Виберіть причину звернення'
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor='text_area_reasons_comment' className={styles.label}>
            Коментарі до причин
          </label>
          <textarea
            class='form-control'
            id='text_area_reasons_comment'
            rows='3'
            value={reasonsComment}
            onChange={changeReasonsComment}
            placeholder='Введіть коментарі до причин'
          ></textarea>
        </div>
        <div className={styles.form_group}>
          <label htmlFor='select_interaction_class' className={styles.label}>
            Клас взаємодії <span>*</span>
          </label>
          <Select
            options={interactionClassOptions}
            id='select_interaction_class'
            className={styles.select}
            onChange={setSelectInteractionClassData}
            value={selectInteractionClassData}
            isClearable
            noOptionsMessage={() => 'Класу взаємодії не знайдено'}
            placeholder='Виберіть клас взаємодії'
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor='select_visiting' className={styles.label}>
            Відвідування <span>*</span>
          </label>
          <Select
            options={visitingOptions}
            id='select_visiting'
            className={styles.select}
            onChange={setSelectVisitingData}
            value={selectVisitingData}
            isClearable
            noOptionsMessage={() => 'Відвідування не знайдено'}
            placeholder='Виберіть відвідування'
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor='select_interaction_type' className={styles.label}>
            Тип взаємодії <span>*</span>
          </label>
          <Select
            options={interactionTypeOptions}
            id='select_interaction_type'
            className={styles.select}
            onChange={setSelectInteractionTypeData}
            value={selectInteractionTypeData}
            isClearable
            noOptionsMessage={() => 'Типу взаємодії не знайдено'}
            placeholder='Виберіть тип взаємодії'
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor='select_services' className={styles.label}>
            Медичні послуги <span>*</span>
          </label>
          <AsyncSelect
            loadOptions={loadOptions}
            defaultOptions={defaultServicesOptions}
            id='select_services'
            className={styles.select}
            onChange={setSelectServicesData}
            value={selectServicesData}
            isMulti
            isClearable
            noOptionsMessage={() => 'Групи послуг/послугу не знайдено'}
            placeholder='Виберіть групу послуг/послугу'
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor='text_services_comment' className={styles.label}>
            Коментарі до наданих медичних послуг
          </label>
          <textarea
            class='form-control'
            id='text_services_comment'
            rows='3'
            value={servicesComment}
            onChange={changeServicesComment}
            placeholder='Введіть коментарі до наданих медичних послуг'
          ></textarea>
        </div>
        <div className={styles.form_group}>
          <label htmlFor='select_priority' className={styles.label}>
            Пріоритет <span>*</span>
          </label>
          <Select
            options={priorityOptions}
            id='select_priority'
            className={styles.select}
            onChange={setSelectPriorityData}
            value={selectPriorityData}
            isClearable
            noOptionsMessage={() => 'Приорітету не знайдено'}
            placeholder='Виберіть приоритет'
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor='text_treatment' className={styles.label}>
            Призначене лікування
          </label>
          <textarea
            class='form-control'
            id='text_treatment'
            rows='3'
            value={treatment}
            onChange={changeTreatment}
            placeholder='Введіть призначене лікування'
          ></textarea>
        </div>
        <div className={styles.form_group}>
          <label htmlFor='text_notes' className={styles.label}>
            Примітки
          </label>
          <textarea
            class='form-control'
            id='text_notes'
            rows='3'
            value={notes}
            onChange={changeNotes}
            placeholder='Введіть примітки'
          ></textarea>
        </div>
        <div className={styles.container_update_btn}>
          <button
            type='button'
            className={styles.updateBtn}
            onClick={createAppointment}
          >
            Зберегти
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;
