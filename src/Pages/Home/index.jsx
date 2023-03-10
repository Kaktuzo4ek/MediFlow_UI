import React, { useRef } from 'react';
import styles from './home.module.scss'
import logo from '../../assets/images/MediFlow_logo.svg';
import heart_icon from '../../assets/icons/aboutProject/heart.svg';
import stethoscope_icon from '../../assets/icons/aboutProject/stethoscope.svg'
import people_icon from '../../assets/icons/aboutProject/people.svg';
import declaration_icon from '../../assets/icons/aboutProject/declaration.svg';
import appointment_icon from '../../assets/icons/aboutProject/appointment.svg';
import aid_kit_icon from '../../assets/icons/aboutProject/aid_kit.svg';
import icon1 from '../../assets/icons/advantages/icon1.svg';
import icon2 from '../../assets/icons/advantages/icon2.svg';
import icon3 from '../../assets/icons/advantages/icon3.svg';
import icon4 from '../../assets/icons/advantages/icon4.svg';
import icon5 from '../../assets/icons/advantages/icon5.svg';
import phone_icon from '../../assets/icons/contacts/phone.png';
import email_icon from '../../assets/icons/contacts/email.png';
import location_icon from '../../assets/icons/contacts/location.png';
import questions_icon from '../../assets/icons/faq/questions.png'
import facebook_icon from '../../assets/icons/footer/facebook.svg';
import google_icon from '../../assets/icons/footer/google.svg';
import instagram_icon from '../../assets/icons/footer/instagram.svg';
import twitter_icon from '../../assets/icons/footer/twitter.svg';
import telegram_icon from '../../assets/icons/footer/telegram.svg';
import { Image } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import classNames from 'classnames';

function Home() {
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    }
    
    const displayAnswer1 = () => {
        const faq1 = document.getElementById('faq1');
        faq1.classList.toggle(styles.active);
    }

    const displayAnswer2 = () => {
        const faq2 = document.getElementById('faq2');
        faq2.classList.toggle(styles.active);
    }

    const displayAnswer3 = () => {
        const faq3 = document.getElementById('faq3');
        faq3.classList.toggle(styles.active);
    }

    const displayAnswer4 = () => {
        const faq4 = document.getElementById('faq4');
        faq4.classList.toggle(styles.active);
    }

    const displayAnswer5 = () => {
        const faq5 = document.getElementById('faq5');
        faq5.classList.toggle(styles.active);
    }

    const aboutSection = useRef(null);
    const advantagesSection = useRef(null);
    const contactsSection = useRef(null);
    const faqSection = useRef(null);
    const mainImageSection = useRef(null);

    const scrollToAboutSection = () => window.scrollTo({top: aboutSection.current.offsetTop - 80, behavior:"smooth"});
    const scrollToAdvantagesSection = () => window.scrollTo({top: advantagesSection.current.offsetTop - 80, behavior:"smooth"});
    const scrollToContactsSection = () => window.scrollTo({top: contactsSection.current.offsetTop - 80, behavior:"smooth"});
    const scrollToFaqSection = () => window.scrollTo({top: faqSection.current.offsetTop - 80, behavior:"smooth"});
    const scrollToMainImageSection = () => window.scrollTo({top: mainImageSection.current.offsetTop - 80, behavior:"smooth"});


    return (
    <div>
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.header__inner}>
                    <div className={styles.header__logo} onClick={scrollToMainImageSection}><Image src={logo} alt="MediFlow logo" className={styles.logo}/></div>

                    <nav className={styles.navigation}>
                        <a className={styles.nav__link} onClick={scrollToAboutSection}>Про проект</a>
                        <a className={styles.nav__link} onClick={scrollToAdvantagesSection}>Переваги</a>
                        <a className={styles.nav__link} onClick={scrollToContactsSection}>Контакти</a>
                        <a className={styles.nav__link} onClick={scrollToFaqSection}>FAQ</a>
                    </nav>
                    <button className={styles.loginBtn} onClick={navigateToLogin}>Увійти</button>
                </div>
            </div>
        </header>

        <div className={styles.divMainImage} ref={mainImageSection}>
            <div className={styles.container}>
                <h1 className={styles.main_title}>MIC «MediFlow»</h1>
                <p className={styles.main_description}>Міжнародне хмарне SaaS рішення для автоматизації робочих процесів медичних закладів.</p>
                <button className={styles.mainBtn_details} onClick={scrollToAboutSection}>Дізнатись детальніше</button>
            </div>
        </div>

        <div className={styles.aboutProject} ref={aboutSection}>
            <div className={styles.container}>
                <h2 className={styles.title_about_project}>Про проект</h2>
                <p className={styles.desc_about_project}>Цей проект передбачає програму для автоматизації процесів у медичних установах. 
                    Це допомагає створити спрощений робочий процес для додаткової ефективності та точності. 
                    Програма розроблена, щоб допомогти медичному персоналу впорядкувати щоденні завдання, такі як реєстрації 
                    пацієнтів, планування, записи пацієнтів, перенаправлення між відділеннями, ведення історії хвороби, 
                    здійснення назначень. Це також може допомогти зменшити ручне введення даних і помилки даних. 
                    Програма зручна для користувача та може бути налаштована відповідно до потреб окремих медичних установ.
                </p>
                <h3 className={styles.system_users_header}>У нашій системі зареєстровано:</h3>
                <div className={styles.system_items}>
                    <div className={styles.system_items_inner}>
                        <div className={styles.system_items_flex}>
                            <div className={classNames(styles.system_item, styles.institution)}>
                                <div className={styles.system_item_icon}><Image src={heart_icon} alt='heart icon' className={styles.system_icons}/></div>
                                <p className={styles.system_item_number}>859 Мед. закладів</p>
                                <p className={styles.system_item_desc}>(4 288 відділень)</p>
                            </div>
                            <div className={classNames(styles.system_item, styles.doctors)} >
                                <div className={styles.system_item_icon}><Image src={stethoscope_icon} alt='stethoscope icon' className={styles.system_icons}/></div>
                                <p className={styles.system_item_number}>40 774</p>
                                <p className={styles.system_item_desc}>Лікарів</p>
                            </div>
                            <div className={classNames(styles.system_item, styles.patients)}>
                                <div className={styles.system_item_icon}><Image src={people_icon} alt='people icon' className={styles.system_icons}/></div>
                                <p className={styles.system_item_number}>3 883 017</p>
                                <p className={styles.system_item_desc}>Пацієнтів</p>
                            </div> 
                        </div>
                        <div className={styles.system_items_flex}>
                            <div className={classNames(styles.system_item, styles.declaration)}>
                                <div className={styles.system_item_icon}><Image src={declaration_icon} alt='declaration icon' className={styles.system_icons}/></div>
                                <p className={styles.system_item_number}>2 003 989</p>
                                <p className={styles.system_item_desc}>Декларацій</p>
                            </div>
                            <div className={classNames(styles.system_item, styles.declaration)}>
                                <div className={styles.system_item_icon}><Image src={appointment_icon} alt='declaration icon' className={styles.system_icons}/></div>
                                <p className={styles.system_item_number}>7 300 115</p>
                                <p className={styles.system_item_desc}>Записів на прийом</p>
                            </div>
                            <div className={classNames(styles.system_item, styles.declaration)}>
                                <div className={styles.system_item_icon}><Image src={aid_kit_icon} alt='declaration icon' className={styles.system_icons}/></div>
                                <p className={styles.system_item_number}>4 311 836</p>
                                <p className={styles.system_item_desc}>Історій лікування</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className={styles.advantagesSection} ref={advantagesSection}>
            <div className={styles.container}>
                <h2 className={styles.title_advantageSection}>Ключові переваги</h2>
                <div className={styles.advantages}>
                    <div className={styles.advantage_item}>
                        <Image src={icon1} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Реєстрація закладу в eHealth</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon2} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Реєстрація лікарів в eHealth</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon3} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Підписання декларацій пацієнтів з лікарями</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon4} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Електронний рецепт</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon5} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Укладання договорів закладів з НСЗУ</p>
                    </div>
                </div>
                <div className={styles.advantages}>
                    <div className={styles.advantage_item}>
                        <Image src={icon1} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Електронна реєстратура</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon2} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>База пацієнтів</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon3} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Перегляд та внесення медичних даних пацієнтів</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon4} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Внесення медичних даних пацієнтів</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <Image src={icon5} alt='icon' className={styles.advantages_icons}/>
                        <p className={styles.advantages_item_desc}>Формування статистики та звітності</p>
                    </div>
                </div>
            </div>
        </div>

        <div className={styles.contactsSection} ref={contactsSection}>
            <div className={styles.container}>
                <h2 className={styles.title_contacts_section}>Наші контакти</h2>
                <div className={styles.contacts}>
                    <p className={styles.contacts_desc}>Якщо у вас виникнуть будь-які питання стосовно роботи платформи, 
                        ви завжди можете зв’язатися з нашими спеціалістами одним з наступних способів:
                    </p>
                    <div className={styles.contacts_flex}>
                        <div className={styles.contact_item}>
                            <div className={styles.contact_item_flex}>
                                <Image src={phone_icon} alt="phone icon" className={styles.contacts_icons}/>
                                <h3 className={styles.contact_item_title}>Зателефонуйте</h3>
                            </div>
                            <div className={styles.contacts_description_container}>
                                <p className={styles.contact_item_desc}>+38 (097) 1987 934</p>
                                <p className={styles.contact_item_desc}>+38 (093) 8965 391</p>
                            </div>
                        </div>
                        <div className={styles.contact_item}>
                            <div className={styles.contact_item_flex}>
                                <Image src={email_icon} alt="email icon" className={styles.contacts_icons}/>
                                <h3 className={styles.contact_item_title}>Надішліть лист</h3>
                            </div>
                            <div className={styles.contacts_description_container}>
                                <p className={styles.p_for_link}><a className={styles.contact_item_desc_link} href='mailto:support@mediflow.net'>support@mediflow.net</a></p>
                                <p className={styles.p_for_link}><a className={styles.contact_item_desc_link} href='mailto:help@mediflow.net'>help@mediflow.net</a></p>
                            </div>
                        </div>
                        <div className={styles.contact_item}>
                            <div className={styles.contact_item_flex}>
                                <Image src={location_icon} alt="location icon" className={styles.contacts_icons}/>
                                <h3 className={styles.contact_item_title}>Завітайте до офісу</h3>
                            </div>
                            <div className={styles.contacts_description_container}>
                                <p className={styles.contact_item_desc}>вулиця Степана Бандери, 12, Львів, Львівська область, 79000</p>
                            </div>
                        </div>
                    </div>

                    <p className={styles.contacts_desc}>Якщо ж  ви хочете зареєстувати свій медичний заклад та приєднатися до 
                        нашої системи, зв’яжіться з нами одним з наступних способів:
                    </p>
                    <div className={styles.contacts_flex}>
                        <div className={styles.contact_item}>
                            <div className={styles.contact_item_flex}>
                                <Image src={phone_icon} alt="phone icon" className={styles.contacts_icons}/>
                                <h3 className={styles.contact_item_title}>Зателефонуйте</h3>
                            </div>
                            <div className={styles.contacts_description_container}>
                                <p className={styles.contact_item_desc}>+38 (097) 1243 121</p>
                                <p className={styles.contact_item_desc}>+38 (093) 2347 292</p>
                            </div>
                        </div>
                        <div className={styles.contact_item}>
                            <div className={styles.contact_item_flex}>
                                <Image src={email_icon} alt="email icon" className={styles.contacts_icons}/>
                                <h3 className={styles.contact_item_title}>Надішліть лист</h3>
                            </div>
                            <div className={styles.contacts_description_container}>
                                <p className={styles.p_for_link}><a className={styles.contact_item_desc_link} href='mailto:support@mediflow.net'>info@mediflow.net</a></p>
                                <p className={styles.p_for_link}><a className={styles.contact_item_desc_link} href='mailto:help@mediflow.net'>register@mediflow.net</a></p>
                            </div>
                        </div>
                        <div className={styles.contact_item}>
                            <div className={styles.contact_item_flex}>
                                <Image src={location_icon} alt="location icon" className={styles.contacts_icons}/>
                                <h3 className={styles.contact_item_title}>Завітайте до офісу</h3>
                            </div>
                            <div className={styles.contacts_description_container}>
                                <p className={styles.contact_item_desc}>вулиця Степана Бандери, 15, Львів, Львівська область, 79000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className={styles.faqSection} ref={faqSection}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h2 className={styles.faqSection_title}>FAQ</h2>
                    <div className={styles.faq} onClick={displayAnswer1} id='faq1'>
                        <div className={styles.questions}>
                            <h3 className={styles.faq_title}>Чим ви відрізняєтесь від конкурентів?</h3>
                            <Image src={questions_icon} alt="questions icon" className={styles.questions_icons}/>
                        </div>
                        <div className={styles.answers}>
                        <p className={styles.answers_desc}>Один із найбільших функціоналів в одному рішенні при одній із найнижчих цін</p>
                        </div>
                    </div>
                    <div className={styles.faq} onClick={displayAnswer2} id='faq2'>
                        <div className={styles.questions}>
                            <h3 className={styles.faq_title}>Які технічні вимоги до обладнання?</h3>
                            <Image src={questions_icon} alt="questions icon" className={styles.questions_icons}/>
                        </div>
                        <div className={styles.answers}>
                            <p className={styles.answers_desc}>MediFlow - хмарний сервіс. Достатньо будь-якого комп’ютера офісного рівня з підключенням до
                                 інтернету. Також немає потреби в серверах чи іншому додатковому обладнанні.
                            </p>
                        </div>
                    </div>
                    <div className={styles.faq} onClick={displayAnswer3} id='faq3'>
                        <div className={styles.questions}>
                            <h3 className={styles.faq_title}>Чи можу я робити зміни в програмі?</h3>
                            <Image src={questions_icon} alt="questions icon" className={styles.questions_icons}/>
                        </div>
                        <div className={styles.answers}>
                        <p className={styles.answers_desc}>Особисто ви не можете, оскільки це хмарне рішення, однак ми досить гнучкі у
                             питанні побажань закладів, тому виконуємо будь-які зміни функціоналу під конкретний заклад.
                              А також написання додаткових не типових модулів функціоналу.
                        </p>
                        </div>
                    </div>
                    <div className={styles.faq} onClick={displayAnswer4} id='faq4'>
                        <div className={styles.questions}>
                            <h3 className={styles.faq_title}>Ми вже користуємось іншою системою, чи можемо перейти до вас?</h3>
                            <Image src={questions_icon} alt="questions icon" className={styles.questions_icons}/>
                        </div>
                        <div className={styles.answers}>
                        <p className={styles.answers_desc}>Данні eHealth мігруються моментально без втрат (заклад, лікарі, декларації), 
                            інші ж дані можемо мігрувати якщо надасться доступ до бази даних попередньої системи.
                        </p>
                        </div>
                    </div>
                    <div className={styles.faq} onClick={displayAnswer5} id='faq5'>
                        <div className={styles.questions}>
                            <h3 className={styles.faq_title}>Чи можемо безкоштовно отримати ваше рішення?</h3>
                            <Image src={questions_icon} alt="questions icon" className={styles.questions_icons}/>
                        </div>
                        <div className={styles.answers}>
                        <p className={styles.answers_desc}>На жаль ні, оскільки для того щоб рішення було найкращим, необхідно його підтримувтаи 
                            і розвивати, а для цього треба кошти :)
                            Однак готові до діалогу щодо схем оплат (розтермінування, кредитування, робота з фондами та ін.)
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className={styles.footerSection}>
            <div className={styles.container}>
                <div className={styles.footer__inner}>
                        <div className={styles.footer__logo} onClick={scrollToMainImageSection}><Image src={logo} alt="MediFlow logo" className={styles.logo}/></div>

                        <div className={styles.socials}>
                            <div className={styles.social_item}><Image src={facebook_icon} alt="facebook icon"/></div>
                            <div className={styles.social_item}><Image src={google_icon} alt="google icon"/></div>
                            <div className={styles.social_item}><Image src={twitter_icon} alt="twitter icon"/></div>
                            <div className={styles.social_item}><Image src={instagram_icon} alt="instagram icon"/></div>
                            <div className={styles.social_item}><Image src={telegram_icon} alt="telegram icon"/></div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
    );
}

export default Home;