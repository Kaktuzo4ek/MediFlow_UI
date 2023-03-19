import { React, useState, useEffect } from "react"
import styles from './doctors.module.scss'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import classNames from "classnames"
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar"

const Doctors = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    let user;

    const [doctors, setDoctors] = useState([]);
    const [doctorsForFilter, setDoctorsForFilter] = useState([]);

    const [department, setDepartment] = useState('');

    const [depId, setDepartmentId] = useState(0);

    const [filter, setFilter] = useState('');
    const changeFilter = event => {
        setFilter(event.target.value)
    }

    const inputSurname = document.getElementById('filter_surname');
    const inputName = document.getElementById('filter_name');
    const inputPatronymic = document.getElementById('filter_patronymic');
    const inputPosition = document.getElementById('filter_position');

    const [filterBy, setFilterBy] = useState('');

    const changeFilterBy = event => {
        setFilterBy(event.target.value);
        if(event.target.value === 'surname') 
            inputSurname.classList.toggle(styles.visible);
        else
            inputSurname.classList.remove(styles.visible);

        if(event.target.value === 'name') 
            inputName.classList.toggle(styles.visible);
        else
            inputName.classList.remove(styles.visible);

        if(event.target.value === 'patronymic') 
            inputPatronymic.classList.toggle(styles.visible);
        else
            inputPatronymic.classList.remove(styles.visible);

        if(event.target.value === 'position') 
            inputPosition.classList.toggle(styles.visible);
        else
            inputPosition.classList.remove(styles.visible);
    }

    const getDoctors = () => {
        axios({
            method: 'post',
            url: `http://localhost:5244/api/Doctor/${user.department.departmentId}`,
        }).then((response) => {
            setDoctors(response.data);
            setDoctorsForFilter(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const filterDoctors = (filter, arrayForFilter) => {
        switch(filterBy) {
            case 'surname':
                setDoctors(arrayForFilter.filter(({surname}) => surname.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'name':
                setDoctors(arrayForFilter.filter(({name}) => name.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'patronymic':
                setDoctors(arrayForFilter.filter(({patronymic}) => patronymic.toLowerCase().includes(filter.toLowerCase())));
                break;
            case 'position':
                setDoctors(arrayForFilter.filter(({position}) => position.positionName.toLowerCase().includes(filter.toLowerCase())));
                break;
        }
    }

    const resetFilter = () => {
        setFilter('');
        inputSurname.classList.remove(styles.visible);
        inputName.classList.remove(styles.visible);
        inputPatronymic.classList.remove(styles.visible);
        inputPosition.classList.remove(styles.visible);
        axios({
            method: 'post',
            url: `http://localhost:5244/api/Doctor/${depId}`,
        }).then((response) => {
            setDoctors(response.data);
        }).catch(error => console.error(`Error: ${error}`));
    }

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

    useEffect(() => {
        if(userToken !== null)
        {
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
                setDepartment(user.department.name);
                getDoctors();
                setDepartmentId(user.department.departmentId);
            }).catch(error => console.error(`Error: ${error}`));
        } else {
            navigate('/login');
        }
    }, [])

    return (
        <div>
            <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
            <Navbar isActiveHamburger={isActiveHamburger}/>
                <div className={styles.divideLine}></div>

                <div className={styles.headLine}>
                    <h1>{department}: Працівники</h1>
                </div>

                <div className={styles.MainContainer}>
                    <div className={styles.doctorsSection}>
                        <div className={styles.containerForDoctorsSection}>
                            <div className={styles.filterContainer}>
                                <div className={styles.flexSelectAndBtn}>
                                    <div className={styles.flexForSelects}>
                                        <select id="select_filter" className={classNames('form-select', styles.select)} value={filterBy} onChange={changeFilterBy}>
                                            <option value='null'>Пошук за</option>
                                            <option value='surname'>Прізвище</option>
                                            <option value='name'>Ім'я</option>  
                                            <option value='patronymic'>По-батькові</option>
                                            <option value='position'>Посада</option>
                                        </select>
                                        <input type="text" id="filter_surname" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть прізвище'/>
                                        <input type="text" id="filter_name" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder="Введіть ім'я"/>
                                        <input type="text" id="filter_patronymic" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть по-батькові'/>
                                        <input type="text" id="filter_position" className={classNames('form-control', styles.inputGroup)} value={filter} onChange={changeFilter} placeholder='Введіть посаду'/>
                                    </div>
                                    <div className={styles.flexButtons}>
                                        <button type="button" className={styles.filterButtons} onClick={() => filterDoctors(filter, doctorsForFilter)}>Пошук</button>
                                        <button type="button" className={styles.filterButtons} onClick={resetFilter}>Скинути фільтр</button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.employeeCountBlock}>
                                <p>Працівники ({doctors.length})</p>
                            </div>

                            <div className={styles.tableSection}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                        <th>№ П/П</th>
                                        <th>Прізвище</th>
                                        <th>Ім'я</th>
                                        <th>По-батькові</th>
                                        <th>Посада</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            doctors && doctors.length > 0 ?
                                            doctors.map((item, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.surname}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.patronymic}</td>
                                                        <td>{item.position.positionName}</td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            ''
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Doctors