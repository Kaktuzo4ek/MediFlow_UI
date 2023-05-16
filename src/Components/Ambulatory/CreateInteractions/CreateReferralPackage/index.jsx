import React from 'react';
import styles from './createReferralPackage.module.scss';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateReferralPackage = () => {
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

  const [selectServicesData, setSelectServicesData] = useState([]);
  const [priorities, setPriorities] = useState([]);
  let priority;
  let services = [];

  const [serviceOptions, setServiceOptions] = useState();

  const priorityOptions = [
    { value: 'Плановий', label: 'Плановий' },
    { value: 'Терміновий', label: 'Терміновий' },
  ];

  let fillArray = [];
  let isFirstFill = true;

  const [defaultServicesOptions, setDefaultServicesOptions] = useState();

  const getServices = () => {
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

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectCategoryData, setSelectCategoryData] = useState([]);

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectDepartmentData, setSelectDepartmentData] = useState([]);
  const [isHospitalization, setIsHospitalization] = useState(false);

  const getDepartments = () => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/Department/GetDepartmentsByInstitutionId',
      params: { id: institutionId },
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++)
            fillArray.push({
              value: response.data[i].departmentId,
              label: response.data[i].name,
            });
          setDepartmentOptions(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const getServiceCategory = (serviceId) => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'get',
      url: `http://localhost:5244/api/Service/${serviceId}`,
      params: { id: serviceId },
    })
      .then((response) => {
        if (isFirstFill) {
          fillArray.push({
            value: response.data.category.categoryName,
            label: response.data.category.categoryName,
          });

          if (fillArray[0].value !== 'Госпіталізація') {
            setIsHospitalization(false);
            fillArray.push({
              value: 'Госпіталізація',
              label: 'Госпіталізація',
            });
          } else setIsHospitalization(true);

          setCategoryOptions(fillArray);
          setSelectCategoryData(fillArray[0]);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const getCategories = () => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: 'get',
      url: 'http://localhost:5244/api/ServiceCategory',
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++) {
            fillArray.push({
              value: response.data[i].categoryName,
              label: response.data[i].categoryName,
            });
          }

          setCategoryOptions(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const changeSelectServicesData = (selectServicesData) => {
    if (!selectServicesData) {
      selectServicesData = [];
      getCategories();
      setSelectCategoryData([]);
      setIsHospitalization(false);
    }
    setSelectServicesData(selectServicesData);
    getServiceCategory(selectServicesData.value);
  };

  const changeSelectCategoryData = (selectCategoryData) => {
    if (!selectCategoryData) {
      selectCategoryData = [];
    }
    setSelectCategoryData(selectCategoryData);
    if (selectCategoryData.value === 'Госпіталізація')
      setIsHospitalization(true);
    else setIsHospitalization(false);
  };

  const createReferral = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/AmbulatoryEpisode/CreateReferralPackage',
      params: { episodeId },
      data: {
        doctorId,
        patientId,
        priority: priorities.value,
        serviceId: selectServicesData.value,
        category: selectCategoryData.value,
        hospitalizationDepartmentId: selectDepartmentData.value,
      },
    })
      .then((response) => {
        toast.success('Направлення успішно створено!', { theme: 'colored' });
        setSelectServicesData([]);
        setPriorities([]);
        setSelectCategoryData([]);
        setSelectDepartmentData([]);
      })
      .catch((error) => {
        toast.error('Помилка серверу!', { theme: 'colored' });
        console.error(`Error: ${error}`);
      });
  };

  useEffect(() => {
    getServices();
    getDepartments();
    getCategories();
  }, []);

  return (
    <div>
      <div className={styles.referralPackageBlock}>
        <ToastContainer />
        <h2>Створити направлення</h2>
        <form>
          <div className={styles.form_group}>
            <label htmlFor='select_service' className={styles.label}>
              Група послуг/послуга <span>*</span>
            </label>
            <Select
              options={serviceOptions}
              id='select_service'
              className={styles.select}
              onChange={changeSelectServicesData}
              value={selectServicesData}
              isClearable
              //isMulti
              noOptionsMessage={() => 'Групи послуг/послуг не знайдено'}
              placeholder='Виберіть групу послуг/послугу'
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor='select_priority' className={styles.label}>
              Пріоритет <span>*</span>
            </label>
            <AsyncSelect
              loadOptions={loadOptions}
              defaultOptions={defaultServicesOptions}
              id='select_priority'
              className={styles.select}
              onChange={setPriorities}
              value={priorities}
              isClearable
              noOptionsMessage={() => 'Пріоритету не знайдено'}
              placeholder='Виберіть пріоритет'
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor='select_category' className={styles.label}>
              Категорія <span>*</span>
            </label>
            <Select
              options={categoryOptions}
              id='select_category'
              className={styles.select}
              onChange={changeSelectCategoryData}
              value={selectCategoryData}
              isClearable
              noOptionsMessage={() => 'Категорії не знайдено'}
              placeholder='Виберіть категорію'
            />
          </div>
          {isHospitalization && (
            <div className={styles.form_group}>
              <label htmlFor='select_category' className={styles.label}>
                Відділення для госпіталізації <span>*</span>
              </label>
              <Select
                options={departmentOptions}
                id='select_category'
                className={styles.select}
                onChange={setSelectDepartmentData}
                value={selectDepartmentData}
                isClearable
                noOptionsMessage={() => 'Відділення не знайдено'}
                placeholder='Виберіть відділення для госпіталізації'
              />
            </div>
          )}
          <div className={styles.container_update_btn}>
            <button
              type='button'
              className={styles.updateBtn}
              onClick={createReferral}
            >
              Створити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReferralPackage;
