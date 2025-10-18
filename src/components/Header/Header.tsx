import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActiveLink = (path: string) => {
        return location.pathname === path ? styles.active : '';
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo} onClick={closeMenu}>
                    <i className="fas fa-crane"></i>
                    CraneCalc
                </Link>



                {/* Кнопка меню для мобильных */}
                <button
                    className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonActive : ''}`}
                    onClick={toggleMenu}
                    aria-label="Открыть меню"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Мобильная навигация */}
                <nav className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuActive : ''}`}>
                    <Link
                        to="/cargo-catalog"
                        className={`${styles.navLink} ${isActiveLink('/cargo-catalog')}`}
                        onClick={closeMenu}
                    >
                        Каталог грузов
                    </Link>
                </nav>

                {/* Overlay для закрытия меню */}
                {isMenuOpen && (
                    <div className={styles.overlay} onClick={closeMenu} />
                )}
            </div>
        </header>
    );
};

export default Header;