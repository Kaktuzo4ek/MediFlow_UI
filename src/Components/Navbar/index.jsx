import React, { useState } from 'react';
import styles from './navbar.module.scss';
import classNames from 'classnames';
import { ReactComponent as InstitutionIcon } from '../../assets/icons/navbar/institution.svg';
import { ReactComponent as EHealthIcon } from '../../assets/icons/navbar/eHealth.svg';
import { ReactComponent as PatientsIcon } from '../../assets/icons/navbar/patients.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={classNames(
        styles.navbarWrapper,
        props.isActiveHamburger && styles.openNavbar,
      )}
    >
      <div className={styles.navbarList}>
        <div className={styles.item}>
          <InstitutionIcon className={styles.itemIcon} />
          <hr />
          <div className={styles.options}>
            <h4>Заклад</h4>
            <a
              onClick={() => {
                navigate('../doctor/hospital/doctors');
              }}
            >
              Медичні працівники
            </a>
          </div>
        </div>
        <div className={styles.item}>
          <hr />
          <EHealthIcon className={styles.itemIcon} />
          <div className={styles.options}>
            <h4>eHealth</h4>
            <span
              className={isActive && styles.open}
              onClick={() =>
                isActive ? setIsActive(false) : setIsActive(true)
              }
            >
              E-направлення
            </span>
            <div
              className={classNames(styles.sublist, isActive && styles.open)}
            >
              <a
                onClick={() => {
                  navigate('../doctor/e-health/search-referral');
                }}
              >
                Пошук направлення
              </a>
              <a
                onClick={() => {
                  navigate('../doctor/e-health/my-referrals');
                }}
              >
                Мої направлення
              </a>
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <hr />
          <PatientsIcon className={styles.itemIcon} />
          <div className={styles.options}>
            <h4>Пацієнти</h4>
            <a
              onClick={() => {
                navigate('../doctor/search-patient');
              }}
            >
              Пошук пацієнта
            </a>
            <a
              onClick={() => {
                navigate('../doctor/inpatients');
              }}
            >
              Пацієнти на стаціонарі
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
