// hooks/useCargoData.ts
import { useState, useEffect, useCallback } from 'react';
import type { CargoItem } from '../types/cargo';
import type { CargoApiParams } from '../types/paginatedResponse';
import { CargoService } from '../services/cargoService';

export const useCargoData = (params: CargoApiParams = {}) => {
    const [data, setData] = useState<CargoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching cargo data with params:', params);
            const response = await CargoService.getCargoPaginated(params);
            console.log('Received cargo data:', response.items.length, 'items');
            setData(response.items);
        } catch (err) {
            console.error('Error fetching cargo data:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [params.PageNumber, params.PageSize, params.Title, params.Type, params.MinWeight, params.MaxWeight]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { cargoData: data, loading, error, refetch: fetchData };
};