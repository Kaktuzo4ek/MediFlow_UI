import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./viewDiagnosticReport.module.scss";
import { useEffect } from "react";
import classNames from "classnames";
import { useState } from "react";
import EditDiagnosticReportModal from "../../../../ModalWindows/DiagnosticReport/EditDiagnosticReport";
import edit2_icon from "../../../../assets/icons/profilePage/edit2.png";
import { Image } from "react-bootstrap";
import delete_icon from "../../../../assets/icons/delete.png";
import visual_icon from "../../../../assets/icons/visual.png";

const ViewDiagnosticReports = () => {
  let userToken = JSON.parse(localStorage.getItem("user"));
  const doctorId = Number(
    userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  );
  const patientId = Number(localStorage.getItem("patientId"));
  const episodeId = localStorage.getItem("episodeId");

  const navigate = useNavigate();

  let user;

  const [reports, setReports] = useState([]);
  const [filterReports, setFilterReports] = useState([]);

  const [filter, setFilter] = useState("");
  const changeFilter = (event) => {
    setFilter(event.target.value);
  };

  const inputReportCategory = document.getElementById("filter_reportCategory");
  const inputService = document.getElementById("filter_service");
  const inputServiceCategory = document.getElementById(
    "filter_serviceCategory"
  );
  const inputConclusion = document.getElementById("filter_conclusion");
  const inputExecutant = document.getElementById("filter_executant");
  const inputInterpreted = document.getElementById("filter_interpreted");

  const [filterBy, setFilterBy] = useState("");

  const changeFilterBy = (event) => {
    setFilterBy(event.target.value);

    if (event.target.value === "reportCategory")
      inputReportCategory.classList.toggle(styles.visible);
    else inputReportCategory.classList.remove(styles.visible);

    if (event.target.value === "service")
      inputService.classList.toggle(styles.visible);
    else inputService.classList.remove(styles.visible);

    if (event.target.value === "serviceCategory")
      inputServiceCategory.classList.toggle(styles.visible);
    else inputServiceCategory.classList.remove(styles.visible);

    if (event.target.value === "conclusion")
      inputConclusion.classList.toggle(styles.visible);
    else inputConclusion.classList.remove(styles.visible);

    if (event.target.value === "executant")
      inputExecutant.classList.toggle(styles.visible);
    else inputExecutant.classList.remove(styles.visible);

    if (event.target.value === "interpreted")
      inputInterpreted.classList.toggle(styles.visible);
    else inputInterpreted.classList.remove(styles.visible);
  };

  const resetFilter = () => {
    setFilter("");
    setFilterBy("Пошук за");
    inputReportCategory.classList.remove(styles.visible);
    inputService.classList.remove(styles.visible);
    inputServiceCategory.classList.remove(styles.visible);
    inputConclusion.classList.remove(styles.visible);
    inputExecutant.classList.remove(styles.visible);
    inputInterpreted.classList.remove(styles.visible);
    getReports();
  };

  const filterReferrals = (filter, arrayForFilter) => {
    switch (filterBy) {
      case "reportCategory":
        setReports(
          arrayForFilter.filter(({ category }) =>
            category.toLowerCase().includes(filter.toLowerCase())
          )
        );
        break;
      case "service":
        setReports(
          arrayForFilter.filter(({ service }) =>
            (service.serviceId + " " + service.serviceName)
              .toLowerCase()
              .includes(filter.toLowerCase())
          )
        );
        break;
      case "categoryService":
        setReports(
          arrayForFilter.filter(({ service }) =>
            service.category.categoryName
              .toLowerCase()
              .includes(filter.toLowerCase())
          )
        );
        break;
      case "conclusion":
        setReports(
          arrayForFilter.filter(({ conclusion }) =>
            conclusion.toLowerCase().includes(filter.toLowerCase())
          )
        );
        break;
      case "executant":
        setReports(
          arrayForFilter.filter(({ executantDoctor }) =>
            (
              executantDoctor.surname +
              " " +
              executantDoctor.name +
              " " +
              executantDoctor.patronymic
            )
              .toLowerCase()
              .includes(filter.toLowerCase())
          )
        );
        break;
      case "interpreted":
        setReports(
          arrayForFilter.filter(({ interpretedDoctor }) =>
            (
              interpretedDoctor.surname +
              " " +
              interpretedDoctor.name +
              " " +
              interpretedDoctor.patronymic
            )
              .toLowerCase()
              .includes(filter.toLowerCase())
          )
        );
        break;
    }
  };

  const getReports = () => {
    axios({
      method: "get",
      url: `http://localhost:5244/api/AmbulatoryEpisode/${episodeId}`,
      params: { id: episodeId },
    })
      .then((response) => {
        setReports(response.data[0].diagnosticReports);
        setFilterReports(response.data[0].diagnosticReports);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const [modal, setModal] = useState({
    modalCreate: false,
    modalEdit: false,
  });

  const deleteReport = (reportId) => {
    axios({
      method: "delete",
      url: "http://localhost:5244/api/AmbulatoryEpisode/DeleteDiagnosticReport",
      params: { episodeId, reportId },
    })
      .then((response) => {
        getReports();
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  const [reportId, setReportId] = useState(0);
  const [categoryObj, setCategoryObj] = useState({});
  const [serviceObj, setServiceObj] = useState({});
  const [conclusion, setConclusion] = useState("");
  const [executantDoctorObj, setExecutantDoctorObj] = useState({});
  const [interpretedDoctorObj, setInterpretedDoctorObj] = useState({});

  const setEditModalAndData = (
    reportId,
    category,
    service,
    conc,
    executant,
    interpreted
  ) => {
    setIsOpen(true);
    setModal({ ...modal, modalEdit: true });
    setReportId(Number(reportId));
    setCategoryObj({ value: category, label: category });
    setServiceObj({
      value: service.serviceId,
      label: `(${service.serviceId}) ${service.serviceName}`,
    });
    setConclusion(conc);
    setExecutantDoctorObj({
      value: executant.id,
      label: `${executant.surname} ${executant.name} ${executant.patronymic}`,
    });
    setInterpretedDoctorObj({
      value: interpreted.id,
      label: `${interpreted.surname} ${interpreted.name} ${interpreted.patronymic}`,
    });
  };

  const [isActiveHamburger, setIsActiveHamburger] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const setIsOpenFalse = () => {
    setIsOpen(false);
  };

  const setDataAndNavigateToViewInfo = (rId) => {
    localStorage.setItem("diagnosticReportId", rId);
    navigate("../doctor/patient-diagnostic-reports/view-info");
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <div>
      <div className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.filterContainer}>
            <div className={styles.flexSelectAndBtn}>
              <div className={styles.flexForSelects}>
                <select
                  id="select_filter"
                  className={classNames("form-select", styles.select)}
                  value={filterBy}
                  onChange={changeFilterBy}
                >
                  <option value="null">Пошук за</option>
                  <option value="reportCategory">Категорія звіту</option>
                  <option value="service">Медична послуга</option>
                  <option value="serviceCategory">Категорія послуги</option>
                  <option value="conclusion">Заключення лікаря</option>
                  <option value="executant">ПІБ виконавця</option>
                  <option value="interpreted">
                    ПІБ інтерпретатора результатів
                  </option>
                </select>
                <input
                  type="text"
                  id="filter_reportCategory"
                  className={classNames("form-control", styles.inputGroup)}
                  value={filter}
                  onChange={changeFilter}
                  placeholder="Введіть категорію звіту"
                />
                <input
                  type="text"
                  id="filter_service"
                  className={classNames("form-control", styles.inputGroup)}
                  value={filter}
                  onChange={changeFilter}
                  placeholder="Введіть медичну послугу"
                />
                <input
                  type="text"
                  id="filter_serviceCategory"
                  className={classNames("form-control", styles.inputGroup)}
                  value={filter}
                  onChange={changeFilter}
                  placeholder="Введіть категорію послуги"
                />
                <input
                  type="text"
                  id="filter_conclusion"
                  className={classNames("form-control", styles.inputGroup)}
                  value={filter}
                  onChange={changeFilter}
                  placeholder="Введіть заключення лікаря"
                />
                <input
                  type="text"
                  id="filter_executant"
                  className={classNames("form-control", styles.inputGroup)}
                  value={filter}
                  onChange={changeFilter}
                  placeholder="Введіть ПІБ виконавця"
                />
                <input
                  type="text"
                  id="filter_interpreted"
                  className={classNames("form-control", styles.inputGroup)}
                  value={filter}
                  onChange={changeFilter}
                  placeholder="Введіть ПІБ інтерпретатора результатів"
                />
              </div>
              <div className={styles.flexButtons}>
                <button
                  type="button"
                  className={styles.filterButtons}
                  onClick={() => filterReferrals(filter, filterReports)}
                >
                  Пошук
                </button>
                <button
                  type="button"
                  className={styles.filterButtons}
                  onClick={resetFilter}
                >
                  Скинути фільтр
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.procedureCountBlock}>
        <div className={styles.container}>
          <p>Кількість ({reports.length})</p>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№ П/П</th>
                <th>Категорія звіту</th>
                <th>Медична послуга</th>
                <th>Категорія послуги</th>
                <th>Заключення лікаря</th>
                <th>Виконавець</th>
                <th>Інтерпретував результати</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {reports && reports.length > 0
                ? reports.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.category}</td>
                        <td>{`(${item.service.serviceId}) ${item.service.serviceName}`}</td>
                        <td>{item.service.category.categoryName}</td>
                        <td>{item.conclusion}</td>
                        <td>{`${item.executantDoctor.surname} ${item.executantDoctor.name} ${item.executantDoctor.patronymic}`}</td>
                        <td>{`${item.interpretedDoctor.surname} ${item.interpretedDoctor.name} ${item.interpretedDoctor.patronymic}`}</td>
                        <td>
                          {doctorId === item.executantDoctor.id ? (
                            <div className={styles.flexForAction}>
                              <Image
                                src={visual_icon}
                                alt="view icon"
                                className={styles.actionBtn}
                                onClick={() =>
                                  setDataAndNavigateToViewInfo(item.reportId)
                                }
                              />
                              <Image
                                src={edit2_icon}
                                alt="edit icon"
                                className={styles.actionBtn}
                                onClick={() =>
                                  setEditModalAndData(
                                    item.reportId,
                                    item.category,
                                    item.service,
                                    item.conclusion,
                                    item.executantDoctor,
                                    item.interpretedDoctor
                                  )
                                }
                              />
                              <Image
                                src={delete_icon}
                                alt="delete icon"
                                className={styles.actionBtn}
                                onClick={() => deleteReport(item.reportId)}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </div>
      </div>
      <EditDiagnosticReportModal
        isOpened={modal.modalEdit}
        onModalClose={() => setModal({ ...modal, modalEdit: false })}
        updateTable={getReports}
        reportId={reportId}
        category={categoryObj}
        service={serviceObj}
        conclusion={conclusion}
        executantDoctor={executantDoctorObj}
        interpretedDoctor={interpretedDoctorObj}
        isOpen={isOpen}
        setIsOpenFalse={setIsOpenFalse}
      ></EditDiagnosticReportModal>
    </div>
  );
};

export default ViewDiagnosticReports;
