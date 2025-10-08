import { useState, useEffect } from 'react';
import styles from './FiltersModal.module.css';

interface Filters {
    Type?: string;
    MinWeight?: number;
    MaxWeight?: number;
}

interface FiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: Filters) => void;
    currentFilters: Filters;
}

const FiltersModal = ({ isOpen, onClose, onApplyFilters, currentFilters }: FiltersModalProps) => {
    const [localFilters, setLocalFilters] = useState<Filters>(currentFilters);

    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters, isOpen]);

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters = {
            Type: '',
            MinWeight: undefined,
            MaxWeight: undefined,
        };
        setLocalFilters(resetFilters);
        onApplyFilters(resetFilters);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Фильтры</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={styles.filtersContainer}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Тип груза</label>
                        <input
                            type="text"
                            value={localFilters.Type || ''}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, Type: e.target.value }))}
                            className={styles.filterInput}
                            placeholder="Например: Панель перекрытия"
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Вес груза (т)</label>
                        <div className={styles.weightRange}>
                            <input
                                type="number"
                                value={localFilters.MinWeight || ''}
                                onChange={(e) => setLocalFilters(prev => ({
                                    ...prev,
                                    MinWeight: e.target.value ? parseFloat(e.target.value) : undefined
                                }))}
                                className={styles.weightInput}
                                placeholder="Мин"
                                min="0"
                                step="0.1"
                            />
                            <span className={styles.rangeSeparator}>—</span>
                            <input
                                type="number"
                                value={localFilters.MaxWeight || ''}
                                onChange={(e) => setLocalFilters(prev => ({
                                    ...prev,
                                    MaxWeight: e.target.value ? parseFloat(e.target.value) : undefined
                                }))}
                                className={styles.weightInput}
                                placeholder="Макс"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button
                        className={styles.resetButton}
                        onClick={handleReset}
                    >
                        <i className="fas fa-redo"></i>
                        Сбросить
                    </button>
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            className={styles.applyButton}
                            onClick={handleApply}
                        >
                            Применить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltersModal;