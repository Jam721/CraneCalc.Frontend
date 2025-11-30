// hooks/useCargoData.ts
import { useState, useEffect } from 'react';
import type { CargoItem } from '../types/cargo';
import type { CargoApiParams } from '../types/paginatedResponse';
import { CargoService } from '../services/cargoService.ts';

export const useCargoData = (params: CargoApiParams = {}) => {
    const [data, setData] = useState<CargoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await CargoService.getCargoPaginated(params);
            setData(response.items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params.PageNumber, params.PageSize, params.Title, params.Type, params.MinWeight, params.MaxWeight]);

    return { cargoData: data, loading, error, refetch: fetchData };
};