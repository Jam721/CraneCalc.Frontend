import { Link } from 'react-router-dom';
import type {CargoItem} from '../../types/cargo';
import styles from './CargoCard.module.css';

interface CargoCardProps {
    cargo: CargoItem;
    onAddToCart: (cargoId: string) => void;
}

const CargoCard = ({ cargo, onAddToCart }: CargoCardProps) => {
    const dimensions = `${cargo.length} × ${cargo.width} × ${cargo.height} м`;

    return (
        <div className={styles.rentCard}>
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

            <div className={styles.rentCardContent}>
                <div className={styles.contentName}>Тип:</div>
                <div className={styles.contentText}>{cargo.type}</div>
            </div>

            <div className={styles.rentCardContent}>
                <div className={styles.contentName}>Размеры:</div>
                <div className={styles.contentText}>{dimensions}</div>
            </div>

            <div className={styles.rentCardContent}>
                <div className={styles.contentName}>Масса:</div>
                <div className={styles.contentText}>{cargo.weight} т</div>
            </div>

            <div className={styles.rentCardButton}>
                <Link
                    to={`/cargo-detail/${cargo.id}`}
                    className={styles.btnDetail}
                >
                    Подробнее
                </Link>
                <button
                    className={styles.addToCalc}
                    onClick={() => onAddToCart(cargo.id)}
                >
                    Добавить в расчет
                </button>
            </div>
        </div>
    );
};

export default CargoCard;