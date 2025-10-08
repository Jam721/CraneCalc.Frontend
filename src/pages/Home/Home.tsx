import ThreeScene from '../../components/ThreeScene/ThreeScene';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.home}>

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
                            <li>Расчета производительности башенного крана для грузов</li>
                            <li>Расчета производительности башенного крана для грузов</li>
                            <li>Расчета производительности башенного крана для грузов</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.craneSection}>
                    <ThreeScene />
                </div>
            </div>
        </div>
    );
};

export default Home;