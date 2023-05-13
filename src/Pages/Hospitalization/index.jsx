import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../Components/Header';
import Navbar from '../../Components/Navbar';
import styles from './hospitalization.module.scss';

const Hospitalization = () => {
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
  const navigate = useNavigate();

  let user;

  const [isActiveHamburger, setIsActiveHamburger] = useState(false);

  const [patient, setPatient] = useState();

  const [dateTime, setDateTime] = useState(
    `${new Date().toISOString().split('T')[0]} ${new Date()
      .toISOString()
      .split('T')[1]
      .slice(0, 5)}`,
  );

  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState();
  const [gender, setGender] = useState('Чоловік');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [directedFrom, setDirectedFrom] = useState('Звернувся сам');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [referralNumber, setReferralNumber] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [postIndex, setPostIndex] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [workPlace, setWorkPlace] = useState();

  const country = [
    {
      value: 'УКРАЇНА - 804',
      label: 'УКРАЇНА - 804',
    },
  ];
  const [selectCountryData, setSelectCountryData] = useState(country[0]);

  const document = [
    {
      value: 'Паспорт',
      label: 'Паспорт',
    },
    {
      value: 'Посвідчення водія',
      label: 'Посвідчення водія',
    },
  ];
  const [selectDocumentData, setSelectDocumentData] = useState(document[0]);

  const benefits = [
    {
      value: 'Без категорії',
      label: 'Без категорії',
    },
    {
      value: 'Загальні захворювання - інваліди III група',
      label: 'Загальні захворювання - інваліди III група',
    },
    {
      value: 'Загальні захворювання - інваліди II група',
      label: 'Загальні захворювання - інваліди II група',
    },
    {
      value: 'Загальні захворювання - інваліди I група',
      label: 'Загальні захворювання - інваліди I група',
    },
    {
      value: 'Учасники АТО/ООС',
      label: 'Учасники АТО/ООС',
    },
    {
      value: 'Військовослужбовці - Нацгвардія України',
      label: 'Військовослужбовці - Нацгвардія України',
    },
    {
      value: 'Проф. захворювання - інваліди III група',
      label: 'Проф. захворювання - інваліди III група',
    },
    {
      value: 'Проф. захворювання - інваліди II група',
      label: 'Проф. захворювання - інваліди II група',
    },
    {
      value: 'Проф. захворювання - інваліди I група',
      label: 'Проф. захворювання - інваліди I група',
    },
    {
      value: 'Переміщені особи',
      label: 'Переміщені особи',
    },
  ];
  const [selectBenefitsData, setSelectBenefitsData] = useState(benefits[0]);

  const bedTypes = [
    {
      value: 'Хірургічні для дорослих',
      label: 'Хірургічні для дорослих',
    },
    {
      value: 'Гінекологічні для дорослих',
      label: 'Гінекологічні для дорослих',
    },
    {
      value: 'Хірургічні для дітей',
      label: 'Хірургічні для дітей',
    },
  ];
  const [selectBedTypesData, setSelectBedTypesData] = useState(bedTypes[0]);

  const hospitalizationTypes = [
    {
      value: 'Ургентна цілодобова',
      label: 'Ургентна цілодобова',
    },
    {
      value: 'Планова цілодобова',
      label: 'Планова цілодобова',
    },
  ];
  const [selectHospitalizationTypesData, setSelectHospitalizationTypesData] =
    useState(hospitalizationTypes[0]);

  const getPatient = () => {
    axios({
      method: 'get',
      url: `http://localhost:5244/api/Patient/${patientId}`,
      params: { id: patientId },
    })
      .then((response) => {
        setPatient(response.data);
        setSurname(response.data.surname);
        setName(response.data.name);
        setPatronymic(response.data.patronymic);
        setDateOfBirth(response.data.dateOfBirth.slice(0, 10));
        setGender(response.data.gender);
        setHeight(response.data.height);
        setWeight(response.data.weight);
        setDocumentNumber(response.data.documentNumber);
        setRegion(response.data.region);
        setDistrict(response.data.district);
        setCity(response.data.city);
        setPostIndex(response.data.postIndex);
        setStreet(response.data.street);
        setBuildingNumber(response.data.buildingNumber);
        setPhoneNumber(response.data.phoneNumber);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const createHospitalization = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5244/api/InpatientEpisode/Create',
      data: {
        receiptDate: dateTime,
        bedType: selectBedTypesData.value,
        benefitCategory: selectBenefitsData.value,
        patientInfo: {
          patientId: patientId,
          surname: surname,
          name: name,
          patronymic: patronymic,
          phoneNumber: phoneNumber,
          dateOfBirth: dateOfBirth,
          gender: gender,
          height: Number(height),
          weight: Number(weight),
          documentType: '',
          documentNumber: '',
          identityCode: '',
          city: city,
          region: region,
          district: district,
          street: street,
          postIndex: postIndex,
          buildingNumber: buildingNumber,
          email: '',
        },
        doctorId: doctorId,
        patientId: patientId,
        directedFrom: directedFrom,
        institutionName: institutionName,
        institutionCode: institutionCode,
        countryAndCode: selectCountryData.value,
        documentType: selectDocumentData.value,
        documentNumber: documentNumber,
        isWorking: isWorking,
        workPlace: workPlace,
        referralPackageId: referralNumber,
        type: selectHospitalizationTypesData.value,
      },
    })
      .then((response) => {
        toast.success('Пацієнт прийнятий на стаціонарне лікування!', {
          theme: 'colored',
        });
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        toast.error('Помилка серверу!', {
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    document.title = 'Поступлення пацієнта';
    if (userToken !== null) {
      axios({
        method: 'get',
        url: `http://localhost:5244/api/Doctor/${userToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']}`,
      })
        .then((response) => {
          user = response.data[0];
          getPatient();
        })
        .catch((error) => console.error(`Error: ${error}`));
    } else {
      navigate('/login');
    }
  }, []);

  if (!patient) return 0;

  return (
    <div>
      <Header
        isActiveHamburger={isActiveHamburger}
        setIsActiveHamburger={setIsActiveHamburger}
      />
      <Navbar isActiveHamburger={isActiveHamburger} />
      <div className={styles.divideLine}></div>

      <div className={styles.headLine}>
        <h1>Поступлення пацієнта</h1>
      </div>

      <div className={styles.MainContainer}>
        <ToastContainer />
        <div className={styles.container}>
          <div className={styles.containerForm}>
            <form>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='input_datetime' className={styles.label}>
                    1. Дата та час звернення
                  </label>
                  <input
                    type='datetime-local'
                    id='input_datetime'
                    className='form-control'
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    placeholder='Введіть дату та час звернення'
                    max={`${new Date().toISOString().split('T')[0]}T00:00`}
                  />
                </div>
                {/* </div> */}
                {/* <div className={styles.flexBox}> */}
                <div className={styles.form_group}>
                  <label htmlFor='input_surname' className={styles.label}>
                    2. Прізвище
                  </label>
                  <input
                    type='text'
                    id='input_surname'
                    className='form-control'
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_name' className={styles.label}>
                    Ім'я
                  </label>
                  <input
                    type='text'
                    id='input_name'
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_patronymic' className={styles.label}>
                    По батькові
                  </label>
                  <input
                    type='text'
                    id='input_patronymic'
                    className='form-control'
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_dateOfBirth' className={styles.label}>
                    3. Дата народження
                  </label>
                  <input
                    type='date'
                    id='input_dateOfBirth'
                    className='form-control'
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='input_age' className={styles.label}>
                    4. Вік
                  </label>
                  <input
                    type='text'
                    id='input_age'
                    className='form-control'
                    value={
                      new Date().getFullYear() -
                      patient.dateOfBirth.split('-')[0]
                    }
                    disabled
                  />
                </div>
                {/* </div> */}
                {/* <div className={styles.flexBox}> */}
                <div className={styles.form_group}>
                  <label htmlFor='radio_gender' className={styles.label}>
                    5. Стать
                  </label>
                  <br />
                  <div id='radio_gender' className='btn-group' role='group'>
                    <input
                      type='radio'
                      className='btn-check'
                      name='input_gender'
                      value='Чоловік'
                      onClick={(e) => setGender(e.target.value)}
                      id='input_gender1'
                      checked={gender === 'Чоловік'}
                    />
                    <label
                      className='btn btn-outline-primary'
                      htmlFor='input_gender1'
                    >
                      Чоловік
                    </label>
                    <input
                      type='radio'
                      className='btn-check'
                      name='input_gender'
                      value='Жінка'
                      onClick={(e) => setGender(e.target.value)}
                      id='input_gender2'
                      checked={gender === 'Жінка'}
                    />
                    <label
                      className='btn btn-outline-primary'
                      htmlFor='input_gender2'
                    >
                      Жінка
                    </label>
                  </div>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_height' className={styles.label}>
                    5.1. Зріст, см
                  </label>
                  <input
                    type='text'
                    id='input_height'
                    className='form-control'
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_weight' className={styles.label}>
                    5.1. Вага, кг
                  </label>
                  <input
                    type='text'
                    id='input_weight'
                    className='form-control'
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='radio_sentBy' className={styles.label}>
                    6. Ким направлений
                  </label>
                  <br />
                  <div id='radio_sentBy' className='btn-group' role='group'>
                    <input
                      type='radio'
                      className='btn-check'
                      name='input_sentBy'
                      value='Звернувся сам'
                      onClick={(e) => setDirectedFrom(e.target.value)}
                      id='input_sentBy1'
                      checked={directedFrom === 'Звернувся сам'}
                    />
                    <label
                      className='btn btn-outline-primary'
                      htmlFor='input_sentBy1'
                    >
                      Звернувся сам
                    </label>
                    <input
                      type='radio'
                      className='btn-check'
                      name='input_sentBy'
                      value='Доставлений бригодою ЕМД'
                      onClick={(e) => setDirectedFrom(e.target.value)}
                      id='input_sentBy2'
                      checked={directedFrom === 'Доставлений бригодою ЕМД'}
                    />
                    <label
                      className='btn btn-outline-primary'
                      htmlFor='input_sentBy2'
                    >
                      Доставлений бригодою ЕМД
                    </label>
                    <input
                      type='radio'
                      className='btn-check'
                      name='input_sentBy'
                      value='Установа'
                      onClick={(e) => setDirectedFrom(e.target.value)}
                      id='input_sentBy3'
                      checked={directedFrom === 'Установа'}
                    />
                    <label
                      className='btn btn-outline-primary'
                      htmlFor='input_sentBy3'
                    >
                      Установа
                    </label>
                  </div>
                </div>
                {directedFrom === 'Установа' && (
                  <>
                    <div className={styles.form_group}>
                      <label
                        htmlFor='input_instituion_name'
                        className={styles.label}
                      >
                        6.1. Назва установи
                      </label>
                      <input
                        type='text'
                        id='input_instituion_name'
                        className='form-control'
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                      />
                    </div>
                    <div className={styles.form_group}>
                      <label
                        htmlFor='input_instituion_code'
                        className={styles.label}
                      >
                        6.2. Код за ЄДРПОУ
                      </label>
                      <input
                        type='text'
                        id='input_instituion_code'
                        className='form-control'
                        value={institutionCode}
                        onChange={(e) => setInstitutionCode(e.target.value)}
                      />
                    </div>
                    <div className={styles.form_group}>
                      <label htmlFor='input_referral' className={styles.label}>
                        6.3. Номер е-направленння
                      </label>
                      <input
                        type='text'
                        id='input_referral'
                        className='form-control'
                        value={referralNumber}
                        onChange={(e) => setReferralNumber(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='select_country' className={styles.label}>
                    7. Назва та код країни
                  </label>
                  <Select
                    options={country}
                    id='select_country'
                    className={styles.select}
                    onChange={setSelectCountryData}
                    value={selectCountryData}
                    isClearable
                    noOptionsMessage={() => 'Країни не знайдено'}
                    placeholder='Виберіть країну'
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='select_document' className={styles.label}>
                    8. Документ, що посвідчує особу
                  </label>
                  <Select
                    options={document}
                    id='select_country'
                    className={styles.select}
                    onChange={setSelectDocumentData}
                    value={selectDocumentData}
                    isClearable
                    noOptionsMessage={() => 'Документа не знайдено'}
                    placeholder='Виберіть документ'
                  />
                </div>
                <div className={styles.form_group}>
                  <label
                    htmlFor='input_document_number'
                    className={styles.label}
                  >
                    8.1. Номер документа, що посвідчує особу
                  </label>
                  <input
                    type='text'
                    id='input_document_number'
                    className='form-control'
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='input_region' className={styles.label}>
                    9.1. Область
                  </label>
                  <input
                    type='text'
                    id='input_region'
                    className='form-control'
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_district' className={styles.label}>
                    9.2. Район області або назва міста обласного значення
                  </label>
                  <input
                    type='text'
                    id='input_district'
                    className='form-control'
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_city' className={styles.label}>
                    9.3. Населений пункт
                  </label>
                  <input
                    type='text'
                    id='input_city'
                    className='form-control'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='input_index' className={styles.label}>
                    9.4. Індекс
                  </label>
                  <input
                    type='text'
                    id='input_index'
                    className='form-control'
                    value={postIndex}
                    onChange={(e) => setPostIndex(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_street' className={styles.label}>
                    9.5. Вулиця
                  </label>
                  <input
                    type='text'
                    id='input_street'
                    className='form-control'
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_building' className={styles.label}>
                    9.6. Номер будинку, квартири
                  </label>
                  <input
                    type='text'
                    id='input_building'
                    className='form-control'
                    value={buildingNumber}
                    onChange={(e) => setBuildingNumber(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='input_phone' className={styles.label}>
                    9.7. Контактний телефон
                  </label>
                  <input
                    type='text'
                    id='input_phone'
                    className='form-control'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='radio_working' className={styles.label}>
                    10. Працює
                  </label>
                  <br />
                  <div id='radio_working' className='btn-group' role='group'>
                    <input
                      type='radio'
                      className='btn-check'
                      onClick={() => setIsWorking(!isWorking)}
                      name='input_working'
                      id='input_working1'
                      checked={isWorking}
                    />
                    <label
                      className='btn btn-outline-primary'
                      htmlFor='input_working1'
                    >
                      Так
                    </label>
                    <input
                      type='radio'
                      className='btn-check'
                      onClick={(e) => setIsWorking(!isWorking)}
                      name='input_working'
                      id='input_working2'
                      checked={!isWorking}
                    />
                    <label
                      className='btn btn-outline-primary'
                      htmlFor='input_working2'
                    >
                      Ні
                    </label>
                  </div>
                </div>
                {isWorking && (
                  <div className={styles.form_group}>
                    <label htmlFor='input_work_place' className={styles.label}>
                      10.1. Місце роботи
                    </label>
                    <input
                      type='text'
                      id='input_work_place'
                      className='form-control'
                      value={workPlace}
                      onChange={(e) => setWorkPlace(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className={styles.flexBox}>
                <div className={styles.form_group}>
                  <label htmlFor='select_benefits' className={styles.label}>
                    11. Пільгова категорія
                  </label>
                  <Select
                    options={benefits}
                    id='select_benefits'
                    className={styles.select}
                    onChange={setSelectBenefitsData}
                    value={selectBenefitsData}
                    isClearable
                    noOptionsMessage={() => 'Категорії не знайдено'}
                    placeholder='Виберіть пільгову категорію'
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor='select_bedType' className={styles.label}>
                    12. Профіль ліжка
                  </label>
                  <Select
                    options={bedTypes}
                    id='select_bedType'
                    className={styles.select}
                    onChange={setSelectBedTypesData}
                    value={selectBedTypesData}
                    isClearable
                    noOptionsMessage={() => 'Профіля ліжка не знайдено'}
                    placeholder='Виберіть профіль ліжка'
                  />
                </div>
                <div className={styles.form_group}>
                  <label
                    htmlFor='select_hospitalizationType'
                    className={styles.label}
                  >
                    13. Тип госпіталізації
                  </label>
                  <Select
                    options={hospitalizationTypes}
                    id='select_hospitalizationType'
                    className={styles.select}
                    onChange={setSelectHospitalizationTypesData}
                    value={selectHospitalizationTypesData}
                    isClearable
                    noOptionsMessage={() => 'Типу не знайдено'}
                    placeholder='Виберіть тип госпіталізації'
                  />
                </div>
              </div>
              <div className={styles.container_create_btn}>
                <button
                  type='button'
                  className={styles.createBtn}
                  onClick={createHospitalization}
                >
                  Госпіталізувати
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitalization;
