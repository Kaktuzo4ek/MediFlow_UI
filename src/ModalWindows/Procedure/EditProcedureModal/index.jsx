import styles from "./editProcedure.module.scss";
import classNames from "classnames";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import { useRef } from "react";

const EditProcedureModal = (props) => {
  const [selectServicesData, setSelectServicesData] = useState(props.service);
  const [serviceOptions, setServiceOptions] = useState();

  const [selectStatusData, setSelectStatusData] = useState(props.status);

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

  const [notes, setNotes] = useState(props.notes);
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

  const editProcedure = () => {
    let procedureId = props.procedureId;
    axios({
      method: "put",
      url: `http://localhost:5244/api/Procedure/${procedureId}`,
      data: {
        procedureId,
        serviceId: selectServicesData.value,
        status: selectStatusData.value,
        prevServiceId: props.service.value,
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
      setSelectServicesData(props.service);
      setSelectStatusData(props.status);
      props.setIsOpenFalse();
    }
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
      onMouseOver={props.isOpen ? () => setData() : null}
    >
      <div className={styles.modal_body}>
        <div className={styles.modal_close}>
          <h3>Редагування процедури</h3>
          <button onClick={props.onModalClose} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <hr />
        <div className={styles.updateSection}>
          <div className={styles.inputsDiv}>
            <form>
              <div className={styles.form_group}>
                <label htmlFor="select_service" className={styles.label}>
                  Група послуг/послуга
                </label>
                <Select
                  options={serviceOptions}
                  id="select_service"
                  className={styles.select}
                  onChange={setSelectServicesData}
                  value={selectServicesData}
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
                  value={selectStatusData}
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
                  onClick={editProcedure}
                  disabled={
                    (!selectServicesData || !selectStatusData) && "disabled"
                  }
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

export default EditProcedureModal;
