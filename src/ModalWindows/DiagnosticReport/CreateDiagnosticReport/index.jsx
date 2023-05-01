import styles from "./createDiagnosticReportModal.module.scss";
import classNames from "classnames";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";

const CreateDiagnosticReportModal = (props) => {
  let userToken = JSON.parse(localStorage.getItem("user"));
  const doctorId = Number(
    userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  );
  const institutionId = Number(
    userToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ]
  );
  const episodeId = 0;
  const patientId = Number(localStorage.getItem("patientId"));

  const [referralPackageId, setReferralPackageId] = useState("");
  const changeReferralPackageId = (event) => {
    setReferralPackageId(event.target.value);
  };

  const [servicesOptions, setServicesOptions] = useState();
  const [selectServicesData, setSelectServicesData] = useState([]);

  const getServices = () => {
    let fillArray = [];
    let isFirstFill = true;
    axios({
      method: "get",
      url: "http://localhost:5244/api/Service",
    })
      .then((response) => {
        if (isFirstFill) {
          for (let i = 0; i < response.data.length; i++)
            fillArray.push({
              value: response.data[i].serviceId,
              label:
                `(${response.data[i].serviceId})` +
                " " +
                response.data[i].serviceName,
            });
          setServicesOptions(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const reportCategoryOptions = [
    {
      value: "Лікувально-діагностична процедура",
      label: "Лікувально-діагностична процедура",
    },
    { value: "Діагностична процедура", label: "Діагностична процедура" },
    { value: "Візуалізація", label: "Візуалізація" },
    { value: "Лабораторна діагностика", label: "Лабораторна діагностика" },
  ];
  const [selectReportCategoryData, setSelectReportCategoryData] = useState([]);

  const changeReportCategoryData = (selectReportCategoryData) => {
    if (!selectReportCategoryData) {
      selectReportCategoryData = {
        value: "",
        label: "",
      };
    }
    setSelectReportCategoryData(selectReportCategoryData);
  };

  const [conclusion, setConclusion] = useState("");
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
      method: "post",
      url: "http://localhost:5244/api/Doctor/GetDoctorsFromInstitution",
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
            (item) => item.value === doctorId && setSelectExecunantData(item)
          );
          fillArray.map(
            (item) => item.value === doctorId && setSelectInterpretedData(item)
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
      method: "post",
      url: "http://localhost:5244/api/Doctor/GetDoctorsExcludeInstitution",
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

  const createDiagnosticReport = () => {
    axios({
      method: "post",
      url: "http://localhost:5244/api/DiagnosticReport/Create",
      params: { episodeId },
      data: {
        referralPackageId: referralPackageId,
        serviceId: selectServicesData.value,
        patientId: patientId,
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
  };

  useEffect(() => {
    getServices();
    getDoctors();
    getAllDoctorsInSystem();
  }, []);

  return (
    <div
      className={classNames(
        styles.modal_wrapper,
        `${props.isOpened ? styles.fadeIn : styles.fadeOut}`
      )}
      style={{ ...props.style }}
    >
      <div className={styles.modal_body}>
        <div className={styles.modal_close}>
          <h3>Cтворення діагностичного звіту</h3>
          <button onClick={props.onModalClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <hr />
        <div className={styles.updateSection}>
          <div className={styles.inputsDiv}>
            <form>
              <div className={styles.form_group}>
                <label htmlFor="input_referralId" className={styles.label}>
                  Номер направлення <span>*</span>
                </label>
                <input
                  type="text"
                  id="input_referralId"
                  className="form-control"
                  value={referralPackageId}
                  onChange={changeReferralPackageId}
                  placeholder="Номер направлення"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="select_services" className={styles.label}>
                  Медична послуга <span>*</span>
                </label>
                <Select
                  options={servicesOptions}
                  id="select_services"
                  className={styles.select}
                  onChange={setSelectServicesData}
                  value={selectServicesData}
                  isClearable
                  noOptionsMessage={() => "Послугу не знайдено"}
                  placeholder="Виберіть послугу"
                />
              </div>
              <div className={styles.form_group}>
                <label
                  htmlFor="select_report_category"
                  className={styles.label}
                >
                  Категорія діагностичного звіту <span>*</span>
                </label>
                <Select
                  options={reportCategoryOptions}
                  id="select_report_category"
                  className={styles.select}
                  onChange={changeReportCategoryData}
                  value={selectReportCategoryData}
                  isClearable
                  noOptionsMessage={() => "Категорію не знайдено"}
                  placeholder="Виберіть категорію"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="text_conclusion" className={styles.label}>
                  Заключення лікаря
                </label>
                <textarea
                  class="form-control"
                  id="text_conclusion"
                  rows="3"
                  value={conclusion}
                  onChange={changeConclusion}
                  placeholder="Введіть заключення"
                ></textarea>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="select_execuatant" className={styles.label}>
                  Виконавець діагностики <span>*</span>
                </label>
                <Select
                  options={executantOptions}
                  id="select_execuatant"
                  className={styles.select}
                  onChange={setSelectExecunantData}
                  value={selectExectantData}
                  isSearchable={false}
                  noOptionsMessage={() => ""}
                  placeholder="Виберіть виконавця дігностики"
                />
              </div>
              <div className={styles.form_group}>
                <div className={styles.labelFlex}>
                  <label htmlFor="select_interpreted" className={styles.label}>
                    Працівник, що інтерпретував результати <span>*</span>
                  </label>
                  <div className={styles.checkbox}>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value={otherInterpted}
                      onChange={
                        otherInterpted
                          ? changeOtherInterpretedFalse
                          : changeOtherInterpretedTrue
                      }
                      id="checkbox_other_interpreted"
                    />
                    <label
                      className={styles.label}
                      for="checkbox_other_interpreted"
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
                  id="select_interpreted"
                  className={styles.select}
                  onChange={setSelectInterpretedData}
                  value={selectInterpretedData}
                  isSearchable={false}
                  noOptionsMessage={() => ""}
                  placeholder="Виберіть працівника, що інтерпретував результати"
                />
              </div>
              <div className={styles.container_update_btn}>
                <button
                  type="button"
                  className={styles.updateBtn}
                  onClick={createDiagnosticReport}
                >
                  Створити
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

export default CreateDiagnosticReportModal;
