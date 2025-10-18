import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CargoItem } from '../../types/cargo';
import CargoCard from '../../components/CargoCard/CargoCard';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import FiltersModal from '../../components/FiltersModal/FiltersModal';
import type { BreadcrumbItem } from '../../types/breadcrumbs';
import { useCargoData } from '../../hooks/useCargoData';
import styles from './CargoCatalog.module.css';
import craneImg from '/assets/crane.png';

interface Filters {
    Type?: string;
    MinWeight?: number;
    MaxWeight?: number;
}

const CargoCatalog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
    const [filteredCargo, setFilteredCargo] = useState<CargoItem[]>([]);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [, setAddingItems] = useState<Set<string>>(new Set());
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<Filters>({});

    const {
        cargoData,
        loading,
        error,
        refetch
    } = useCargoData({ PageSize: 100 });

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Главная', path: '/' },
        { label: 'Каталог грузов', isActive: true }
    ];

    // Фильтрация теперь зависит от appliedSearchQuery
    useEffect(() => {
        let filtered = [...cargoData];

        if (appliedSearchQuery.trim() !== '') {
            filtered = filtered.filter(cargo =>
                cargo.title.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
                cargo.type.toLowerCase().includes(appliedSearchQuery.toLowerCase())
            );
        }

        if (activeFilters.Type) {
            filtered = filtered.filter(cargo =>
                cargo.type.toLowerCase().includes(activeFilters.Type!.toLowerCase())
            );
        }

        if (activeFilters.MinWeight !== undefined) {
            filtered = filtered.filter(cargo => cargo.weight >= activeFilters.MinWeight!);
        }

        if (activeFilters.MaxWeight !== undefined) {
            filtered = filtered.filter(cargo => cargo.weight <= activeFilters.MaxWeight!);
        }

        setFilteredCargo(filtered);
    }, [cargoData, appliedSearchQuery, activeFilters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setAppliedSearchQuery(searchQuery); // Применяем поиск только при отправке формы
    };

    const handleAddToCart = async (cargoId: string) => {
        setAddingItems(prev => new Set(prev).add(cargoId));

        await new Promise(resolve => setTimeout(resolve, 1000));

        setCartQuantity(prev => prev + 1);
        setAddingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(cargoId);
            return newSet;
        });
    };

    const handleApplyFilters = (filters: Filters) => {
        setActiveFilters(filters);
    };

    const hasActiveFilters = Object.values(activeFilters).some(value =>
        value !== undefined && value !== '' && value !== 0
    );

    const isCartEmpty = cartQuantity === 0;
    const cartClass = isCartEmpty ? `${styles.fixedCalcBtn} ${styles.disabled}` : styles.fixedCalcBtn;

    if (loading) {
        return (
            <div className={styles.cargoCatalog}>
                <Breadcrumbs items={breadcrumbItems} />
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка каталога грузов...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.cargoCatalog}>
                <Breadcrumbs items={breadcrumbItems} />
                <div className={styles.errorContainer}>
                    <h3>Ошибка загрузки данных</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => refetch()}
                        className={styles.retryButton}
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cargoCatalog}>
            <Breadcrumbs items={breadcrumbItems} />

            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>Каталог грузов</h1>
                <p className={styles.heroSubtitle}>
                    Выберите тип груза для расчета производительности башенного крана
                </p>

                <div className={styles.searchRow}>
                    <form onSubmit={handleSearch} className={styles.searchContainer}>
                        <div className={styles.searchForm}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                                placeholder="Поиск грузов по названию..."
                            />
                            <button type="submit" className={styles.searchBtn}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </form>

                    <button
                        className={`${styles.filterButton} ${hasActiveFilters ? styles.filterButtonActive : ''}`}
                        onClick={() => setIsFiltersOpen(true)}
                    >
                        <i className="fas fa-filter"></i>
                        Фильтры
                        {hasActiveFilters && <span className={styles.filterIndicator}></span>}
                    </button>
                </div>
            </section>

            <div className={styles.cardsGrid}>
                {filteredCargo.map(cargo => (
                    <CargoCard
                        key={cargo.id}
                        cargo={cargo}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            {filteredCargo.length === 0 && !loading && (
                <div className={styles.noResults}>
                    <h3>Грузы не найдены</h3>
                    <p>Попробуйте изменить параметры поиска или фильтры</p>
                    {(hasActiveFilters || appliedSearchQuery) && (
                        <button
                            className={styles.clearFiltersButton}
                            onClick={() => {
                                setActiveFilters({});
                                setSearchQuery('');
                                setAppliedSearchQuery(''); // Сбрасываем примененный поиск
                            }}
                        >
                            Сбросить все фильтры
                        </button>
                    )}
                </div>
            )}

            <Link
                to={isCartEmpty ? '#' : '/cart'}
                className={cartClass}
                onClick={(e) => isCartEmpty && e.preventDefault()}
            >
                <div className={styles.iconWrapper}>
                    <img src={craneImg} alt="crane" className={styles.iconWrapperIco}/>
                    <span className={styles.badge}>{cartQuantity}</span>
                </div>
            </Link>

            <FiltersModal
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                onApplyFilters={handleApplyFilters}
                currentFilters={activeFilters}
            />
        </div>
    );
};

export default CargoCatalog;