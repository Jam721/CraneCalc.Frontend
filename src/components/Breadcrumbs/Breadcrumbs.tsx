import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '../../types/breadcrumbs';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
    return (
        <nav className={`${styles.breadcrumbs} ${className}`}>
            {items.map((item, index) => (
                <div key={index} className={styles.breadcrumbItem}>
                    {item.path && !item.isActive ? (
                        <Link to={item.path} className={styles.breadcrumbLink}>
                            {item.label}
                        </Link>
                    ) : (
                        <span className={styles.breadcrumbCurrent}>
              {item.label}
            </span>
                    )}
                    {index < items.length - 1 && (
                        <span className={styles.breadcrumbSeparator}>/</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumbs;