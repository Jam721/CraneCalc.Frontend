import { Link } from 'react-router-dom';
import type {CargoItem} from '../../types/cargo';
import styles from './CargoCard.module.css';

interface CargoCardProps {
    cargo: CargoItem;
    onAddToCart: (cargoId: string) => void;
}

const CargoCard = ({ cargo }: CargoCardProps) => {
    const dimensions = `${cargo.length} × ${cargo.width} × ${cargo.height} м`;

    return (
        <div className={styles.rentCard}>
            {/* Обложка с изображением */}
            <div className={styles.rentCardPhoto}>
                <img
                    src={cargo.imageUrl}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/img/default.jpg';
                    }}
                    alt={cargo.title}
                    loading="lazy"
                />
            </div>

            {/* Контент в стиле карточек */}
            <div className={styles.rentCardContent}>
                <div className={styles.contentName}>Тип груза</div>
                <div className={styles.contentText}>{cargo.type}</div>
            </div>

            <div className={styles.rentCardContent}>
                <div className={styles.contentName}>Габариты</div>
                <div className={styles.contentText}>{dimensions}</div>
            </div>

            <div className={styles.rentCardContent}>
                <div className={styles.contentName}>Вес</div>
                <div className={styles.contentText}>{cargo.weight} тонн</div>
            </div>

            {/* Кнопка действия */}
            <div className={styles.rentCardButton}>
                <Link
                    to={`/cargo-detail/${cargo.id}`}
                    className={styles.btnDetail}
                >
                    📋 Подробнее
                </Link>
            </div>
        </div>
    );
};

export default CargoCard;