import React from "react";
import styles from './loader.module.scss';
import {ReactComponent as Logo} from '../../assets/icons/loader/logo.svg'
import classNames from "classnames";

const Loader = (props) => {
    return (
            <div className={classNames(styles.loaderWrapper, props.isLoading && styles.show)}><Logo class={styles.loader}/></div>
    )
}

export default Loader