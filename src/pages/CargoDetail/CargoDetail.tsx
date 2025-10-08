import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '../../types/breadcrumbs';
import { useCargoById } from '../../hooks/useCargoById';
import styles from './CargoDetail.module.css';

const CargoDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { cargo, loading, error } = useCargoById(id);

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Главная', path: '/' },
        { label: 'Каталог грузов', path: '/cargo-catalog' },
        { label: cargo ? cargo.title : 'Груз не найден', isActive: true }
    ];

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <Breadcrumbs items={breadcrumbItems} />
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка данных о грузе...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer}>
                <Breadcrumbs items={breadcrumbItems} />
                <div className={styles.errorContainer}>
                    <h3>Ошибка загрузки данных</h3>
                    <p>{error}</p>
                    <Link to="/cargo-catalog" className={styles.backLink}>
                        Вернуться в каталог
                    </Link>
                </div>
            </div>
        );
    }

    if (!cargo) {
        return (
            <div className={styles.pageContainer}>
                <Breadcrumbs items={breadcrumbItems} />
                <div className={styles.notFound}>
                    <h2>Груз не найден</h2>
                    <p>Запрошенный груз не существует или был удален</p>
                    <Link to="/cargo-catalog" className={styles.backLink}>
                        Вернуться в каталог
                    </Link>
                </div>
            </div>
        );
    }

    const dimensions = `${cargo.length} × ${cargo.width} × ${cargo.height} м`;

    return (
        <div className={styles.pageContainer}>
            <Breadcrumbs items={breadcrumbItems} />

            <div className={styles.cargoDetail}>
                <div>
                    <img
                        src={cargo.imageUrl}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/img/default.jpg';
                        }}
                        alt={cargo.title}
                        className={styles.cargoImage}
                    />
                </div>

                <div className={styles.cargoInfo}>
                    <h2 className={styles.cargoTitle}>{cargo.title}</h2>

                    <div className={styles.cargoSpecs}>
                        <div className={styles.specItem}>
                            <span>Тип груза:</span>
                            <span className={styles.specItemText}>{cargo.type}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span>Масса:</span>
                            <span className={styles.specItemText}>{cargo.weight} т</span>
                        </div>
                        <div className={styles.specItem}>
                            <span>Габариты:</span>
                            <span className={styles.specItemText}>{dimensions}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span>Объем:</span>
                            <span className={styles.specItemText}>{cargo.volume} м³</span>
                        </div>
                        <div className={styles.specItem}>
                            <span>Марка бетона:</span>
                            <span className={styles.specItemText}>{cargo.concreteGrade}</span>
                        </div>
                    </div>

                    <p className={styles.modelDesc}>
                        {cargo.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CargoDetail;