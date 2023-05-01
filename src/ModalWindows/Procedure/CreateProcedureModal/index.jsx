import styles from "./createProcedure.module.scss";
import classNames from "classnames";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import { useRef } from "react";

const CreateProcedureModal = (props) => {
  let userToken = JSON.parse(localStorage.getItem("user"));
  const doctorId = Number(
    userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  );
  const patientId = Number(localStorage.getItem("patientId"));

  const [referralPackageId, setReferralPackageId] = useState("");
  const changeReferralPackageId = (event) => {
    setReferralPackageId(event.target.value);
  };

  const [selectServicesData, setSelectServicesData] = useState({});
  const [serviceOptions, setServiceOptions] = useState();

  const [selectStatusData, setSelectStatusData] = useState({});

  const statusOptions = [
    { value: "Інше", label: "Інше" },
    { value: "Процедура відмінена", label: "Процедура відмінена" },
    {
      value: "Процедура відмінена: відмова пацієнта",
      label: "Процедура відмінена: відмова пацієнта",
    },
    {
      value: "Процедура відмінена: протипокази до процедури",
      label: "Процедура відмінена: протипокази до процедури",
    },
    {
      value: "Процедура проведено успішно",
      label: "Процедура проведено успішно",
    },
    {
      value:
        "Проведення процедури не завершено: ускладнення, які виникли в процесі процедури",
      label:
        "Проведення процедури не завершено: ускладнення, які виникли в процесі процедури",
    },
    {
      value:
        "Проведення процедури не завершено: пацієнт відмовився від продовження процедури",
      label:
        "Проведення процедури не завершено: пацієнт відмовився від продовження процедури",
    },
    {
      value: "Проведення процедури не завершено: технічні проблеми",
      label: "Проведення процедури не завершено: технічні проблеми",
    },
    {
      value: "Процедура проведена не успішно",
      label: "Процедура проведена не успішно",
    },
  ];

  const [notes, setNotes] = useState("");
  const changeNotes = (event) => {
    setNotes(event.target.value);
  };

  let fillArray = [];
  let isFirstFill = true;

  const getServices = () => {
    axios({
      method: "post",
      url: "http://localhost:5244/api/Service/GetProcedures",
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
          setServiceOptions(fillArray);
        }
        isFirstFill = false;
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const createProcedure = () => {
    let serviceId = selectServicesData.value;
    let status = selectStatusData.value;
    axios({
      method: "post",
      url: "http://localhost:5244/api/Procedure/Create",
      data: {
        referralPackageId,
        doctorId,
        patientId,
        serviceId,
        status,
        notes: notes,
      },
    })
      .then((response) => {
        props.updateTable();
        setReferralPackageId("");
        setSelectServicesData([]);
        setSelectStatusData([]);
        setNotes("");
        props.onModalClose();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  useEffect(() => {
    getServices();
  }, []);

  if (!serviceOptions) return 0;

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
          <h3>Створення процедури</h3>
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
                  Номер направлення
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
                <label htmlFor="select_service" className={styles.label}>
                  Група послуг/послуга
                </label>
                <Select
                  options={serviceOptions}
                  id="select_service"
                  className={styles.select}
                  onChange={setSelectServicesData}
                  isClearable
                  noOptionsMessage={() => "Групи послуг/послуг не знайдено"}
                  placeholder="Виберіть групу послуг/послугу"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="select_status" className={styles.label}>
                  Результат процедури
                </label>
                <Select
                  options={statusOptions}
                  id="select_status"
                  className={styles.select}
                  onChange={setSelectStatusData}
                  isClearable
                  noOptionsMessage={() => "Результату процедури не знайдено"}
                  placeholder="Виберіть результат процедури"
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="text_area_notes" className={styles.label}>
                  Нотатки
                </label>
                <textarea
                  class="form-control"
                  id="text_area_notes"
                  rows="3"
                  value={notes}
                  onChange={changeNotes}
                  placeholder="Введіть нотатки"
                ></textarea>
              </div>
              <div className={styles.container_update_btn}>
                <button
                  type="button"
                  className={styles.updateBtn}
                  onClick={createProcedure}
                  disabled={
                    (referralPackageId === "" ||
                      !selectServicesData ||
                      !selectStatusData) &&
                    "disabled"
                  }
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

export default CreateProcedureModal;
