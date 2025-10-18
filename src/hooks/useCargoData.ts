import { useState, useEffect, useCallback, useRef } from 'react';
import type { CargoItem } from '../types/cargo';
import type { CargoApiParams } from '../types/paginatedResponse';
import { CargoService } from '../services/cargoService';

export const useCargoData = (initialParams: CargoApiParams = {}) => {
    const [cargoData, setCargoData] = useState<CargoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Используем ref для initialParams, чтобы избежать лишних ререндеров
    const initialParamsRef = useRef(initialParams);

    const fetchCargoData = useCallback(async (params: CargoApiParams = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await CargoService.getCargoPaginated({
                PageNumber: params.PageNumber || initialParamsRef.current.PageNumber || 1,
                PageSize: params.PageSize || initialParamsRef.current.PageSize || 100,
                ...params
            });

            setCargoData(response.items);
            setTotalCount(response.totalCount);
            setCurrentPage(response.pageNumber);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch cargo data');
        } finally {
            setLoading(false);
        }
    }, []); // Пустой массив зависимостей - функция создается один раз

    useEffect(() => {
        fetchCargoData(initialParamsRef.current);
    }, [fetchCargoData]); // Только одна зависимость

    const refetch = useCallback((params?: CargoApiParams) => {
        fetchCargoData(params);
    }, [fetchCargoData]);

    return {
        cargoData,
        loading,
        error,
        totalCount,
        currentPage,
        refetch
    };
};