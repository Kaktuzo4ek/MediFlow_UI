import styles from './editReferral.module.scss';
import classNames from 'classnames';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const EditReferralModal = (props) => {
  let userToken = JSON.parse(localStorage.getItem('user'));
  const institutionId = Number(
    userToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ],
  );
  const referralId = props.referalId;

  const [selectServicesData, setSelectServicesData] = useState(props.service);
  const [serviceOptions, setServiceOptions] = useState();

  const [selectPrioritiesData, setSelectPrioritiesData] = useState(
    props.priority,
  );
  const priorityOptions = [
    { value: 'Плановий', label: 'Плановий' },
    { value: 'Терміновий', label: 'Терміновий' },
  ];

  let priority;
  let serviceId;

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

  const updateReferral = () => {
    axios({
      method: 'put',
      url: `http://localhost:5244/api/Referral/${referralId}`,
      params: { id: referralId },
      data: {
        referralId,
        priority: selectPrioritiesData.value,
        serviceId: selectServicesData.value,
        category: selectCategoryData.value,
        hospitalizationDepartmentId: selectDepartmentData.value,
      },
    })
      .then((response) => {
        props.updateTable();
        props.onModalClose();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectCategoryData, setSelectCategoryData] = useState(props.category);

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectDepartmentData, setSelectDepartmentData] = useState();
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

  const setData = () => {
    if (props.isOpen) {
      setSelectServicesData(props.service);
      setSelectPrioritiesData(props.priority);
      setSelectCategoryData(props.category);
      setSelectDepartmentData(props.hospDep);
      if (props.category.value === 'Госпіталізація') setIsHospitalization(true);
      else {
        setIsHospitalization(false);
        setSelectDepartmentData([]);
      }

      props.setIsOpenFalse();
    }
  };

  useEffect(() => {
    getServices();
    getDepartments();
  }, []);

  if (!serviceOptions) return 0;

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
          <h3>Редагування направлення</h3>
          <button onClick={props.onModalClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <hr />
        <div className={styles.updateSection}>
          <div className={styles.inputsDiv}>
            <form>
              <div className={styles.form_group}>
                <label htmlFor='select_service' className={styles.label}>
                  Група послуг/послуга
                </label>
                <AsyncSelect
                  loadOptions={loadOptions}
                  defaultOptions={defaultServicesOptions}
                  id='select_service'
                  className={styles.select}
                  onChange={changeSelectServicesData}
                  value={selectServicesData}
                  isClearable
                  noOptionsMessage={() => 'Групи послуг/послуг не знайдено'}
                  placeholder='Виберіть групу послуг/послугу'
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor='select_priority' className={styles.label}>
                  Пріоритет
                </label>
                <Select
                  options={priorityOptions}
                  id='select_priority'
                  className={styles.select}
                  onChange={setSelectPrioritiesData}
                  value={selectPrioritiesData}
                  isClearable
                  noOptionsMessage={() => 'Пріоритету не знайдено'}
                  placeholder='Виберіть пріоритет'
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor='select_category' className={styles.label}>
                  Категорія
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
                    Відділення для госпіталізації
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
                  onClick={updateReferral}
                  disabled={
                    !selectServicesData && !selectPrioritiesData && 'disabled'
                  }
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

export default EditReferralModal;
