import { React, useState, useEffect } from "react"
import styles from './homeDoctor.module.scss'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar"

const HomeDoctor = () => {

    let userToken = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    let user;

    const [isActiveHamburger, setIsActiveHamburger] = useState(false);

    useEffect(() => {
            document.title = 'Кабінет лікаря';
            axios({
                method: 'get',
                url: `http://localhost:5244/api/Doctor/${userToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}`,
            }).then((response) => {
                user = response.data[0];
            }).catch(error => console.error(`Error: ${error}`));
    }, [])

    return (
        <div>
                <Header isActiveHamburger={isActiveHamburger} setIsActiveHamburger={setIsActiveHamburger}/>
                <Navbar isActiveHamburger={isActiveHamburger}/>
                <div className={styles.divideLine}></div>

                <div className={styles.headLine}>
                    <h1>Головна сторінка</h1>
                </div>

                <div className={styles.MainContainer}>
                    
                </div>

        </div>
    )
}

export default HomeDoctor