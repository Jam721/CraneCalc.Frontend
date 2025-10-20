import ThreeScene from '../../components/ThreeScene/ThreeScene';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.home}>
            {/* Анимация как фон - занимает весь экран */}
            <div className={styles.backgroundAnimation}>
                <ThreeScene />
            </div>

            {/* Контент поверх анимации */}
            <div className={styles.content}>
                <div className={styles.textSection}>
                    <h1 className={styles.title}>Добро пожаловать в CraneCalc</h1>
                    <p className={styles.subtitle}>
                        Профессиональные расчеты для башенных кранов
                    </p>
                    <div className={styles.description}>
                        <p>Наша платформа предоставляет точные расчеты и анализ для:</p>
                        <ul className={styles.featuresList}>
                            <li>Расчета производительности башенного крана для грузов</li>
                        </ul>
                    </div>
                </div>

                {/* Этот блок теперь для баланса композиции */}
                <div className={styles.craneSection}>
                    {/* Можно оставить пустым или добавить декоративные элементы */}
                </div>
            </div>
        </div>
    );
};

export default Home;