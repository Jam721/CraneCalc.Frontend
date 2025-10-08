import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation();

    const isActiveLink = (path: string) => {
        return location.pathname === path ? styles.active : '';
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    <i className="fas fa-crane"></i>
                    CraneCalc
                </Link>
                <nav className={styles.navLinks}>
                    <Link
                        to="/cargo-catalog"
                        className={`${styles.navLink} ${isActiveLink('/cargo-catalog')}`}
                    >
                        Каталог грузов
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;